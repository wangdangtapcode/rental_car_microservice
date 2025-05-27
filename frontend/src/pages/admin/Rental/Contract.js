import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "../../../utils/formatters";
import axios from "axios";
import { useSelector } from "react-redux";

export const ContractDraft = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy dữ liệu đầu vào và mode
  const contractInputData = location.state;
  const mode = contractInputData?.mode || "new"; // Mặc định là 'new'
  const originalContract = contractInputData?.originalContractData;
  // State chính của trang này
  const [customer, setCustomer] = useState(null);
  const [vehiclesWithNotes, setVehiclesWithNotes] = useState([]);
  const [collaterals, setCollaterals] = useState([]);
  const [newCollateralInput, setNewCollateralInput] = useState("");

  const [displayValues, setDisplayValues] = useState({
    totalEstimatedAmount: 0,
    depositAmount: 0,
    dueAmount: 0,
  });

  const [isSaving, setIsSaving] = useState(false); // Trạng thái đang lưu
  const [error, setError] = useState(null); // Lỗi chung

  // --- Effect để kiểm tra và lấy dữ liệu đầu vào ---
  useEffect(() => {
    if (!contractInputData) {
      console.error("ContractDraft: Missing input data. Navigating back.");
      navigate("/rental/vehicles", { replace: true });
      return;
    }
    console.log("ContractDraft: Input data:", contractInputData);
    if (contractInputData.customer) setCustomer(contractInputData.customer);

    if (contractInputData.selectedVehicles) {
      if (mode === "new") {
        // Cập nhật để tính tài chính cho từng xe
        const vehiclesWithFinancials = contractInputData.selectedVehicles.map(
          (vehicle) => {
            // Tính ngày thuê
            const startDate = new Date(vehicle.startDate);
            const endDate = new Date(vehicle.endDate);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Tính tài chính
            const price = Number(vehicle.vehicle?.rentalPrice);
            const totalAmount = price * diffDays;

            return {
              ...vehicle,
              totalEstimatedAmount: totalAmount,
            };
          }
        );
        setVehiclesWithNotes(vehiclesWithFinancials);
      } else if (mode === "booking") {
        // Giữ nguyên thông tin tài chính từ đơn đặt trước
        setVehiclesWithNotes(contractInputData.selectedVehicles);
        setDisplayValues({
          totalEstimatedAmount:
            contractInputData.originalContractData.totalEstimatedAmount || 0,
          depositAmount:
            contractInputData.originalContractData.depositAmount || 0,
          dueAmount: contractInputData.originalContractData.dueAmount || 0,
        });
        setCollaterals(
          contractInputData.originalContractData.collaterals?.map(
            (c) => c.description
          ) || []
        );
      }
    }
  }, [contractInputData, mode, navigate]);

  // Cập nhật tính toán tài chính tổng
  const calculateTotalFinancials = useCallback(() => {
    // Tính tổng từ các xe đã chọn
    const totalEstimated = vehiclesWithNotes.reduce(
      (sum, item) => sum + (item.totalEstimatedAmount || 0),
      0
    );

    const totalDeposit = totalEstimated * 0.2;

    const totalDue = totalEstimated - totalDeposit;

    return {
      total: totalEstimated,
      deposit: totalDeposit,
      due: totalDue,
    };
  }, [vehiclesWithNotes]);

  // Cập nhật hiển thị tài chính tổng hợp khi danh sách xe thay đổi
  useEffect(() => {
    if (mode === "new") {
      const { total, deposit, due } = calculateTotalFinancials();
      setDisplayValues({
        totalEstimatedAmount: total,
        depositAmount: deposit,
        dueAmount: due,
      });
    }
  }, [mode, vehiclesWithNotes, calculateTotalFinancials]);

  // Xử lý thay đổi ghi chú tình trạng xe
  const handleConditionNotesChange = useCallback((vehicleId, notes) => {
    setVehiclesWithNotes((prevVehicles) =>
      prevVehicles.map((item) => {
        if (item.vehicle.id === vehicleId) {
          return { ...item, conditionNotes: notes };
        }
        return item;
      })
    );
  }, []);

  const handleNewCollateralChange = (event) => {
    if (mode === "new") {
      setNewCollateralInput(event.target.value);
    }
  };

  const handleAddCollateral = () => {
    if (mode !== "new") return;
    const trimmedInput = newCollateralInput.trim();
    if (trimmedInput) {
      setCollaterals((prevCollaterals) => [...prevCollaterals, trimmedInput]);
      setNewCollateralInput("");
    }
  };

  const handleRemoveCollateral = (indexToRemove) => {
    if (mode !== "new") return;
    setCollaterals((prevCollaterals) =>
      prevCollaterals.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleConfirmContract = useCallback(async () => {
    setError(null);
    setIsSaving(true);
    // Kiểm tra chung
    if (
      !customer ||
      vehiclesWithNotes.length === 0 ||
      collaterals.length === 0
    ) {
      setError("Vui lòng điền đầy đủ thông tin hợp đồng và tài sản đảm bảo.");
      setIsSaving(false);
      return;
    }

    // Kiểm tra từng xe có dữ liệu đủ điều kiện không
    for (const vehicle of vehiclesWithNotes) {
      if (!vehicle.startDate || !vehicle.endDate) {
        setError("Thiếu thông tin ngày thuê cho một hoặc nhiều xe.");
        setIsSaving(false);
        return;
      }
    }

    if (!user || !user.id) {
      setError(
        "Không xác định được thông tin nhân viên. Vui lòng đăng nhập lại."
      );
      setIsSaving(false);
      return;
    }

    const now = new Date();
    const formattedCreatedDate = now.toISOString().slice(0, 10);

    let rentalContract;
    let apiUrl;
    let successMessage;
    if (mode === "new") {
      // Kiểm tra tiền cọc cho mode 'new'
      if (displayValues.depositAmount <= 0) {
        setError(
          "Tiền cọc dự kiến phải lớn hơn 0. Kiểm tra lại ngày hoặc xe đã chọn."
        );
        setIsSaving(false);
        return;
      }

      apiUrl = `http://localhost:8081/api/rentalContract/create`;
      successMessage = "Thêm hợp đồng mới thành công!";
      rentalContract = {
        customer: customer,
        employee: user,
        depositAmount: displayValues.depositAmount,
        totalEstimatedAmount: displayValues.totalEstimatedAmount,
        dueAmount: displayValues.dueAmount,
        createdDate: formattedCreatedDate,
        status: "ACTIVE",
        contractVehicleDetails: vehiclesWithNotes.map((item) => ({
          vehicle: item.vehicle,
          conditionNotes: item.conditionNotes,
          rentalPrice: item.vehicle.rentalPrice,
          startDate: item.startDate,
          endDate: item.endDate,
          totalEstimatedAmount: item.totalEstimatedAmount,
          status: "ACTIVE",
        })),
        collaterals: collaterals.map((desc) => ({ description: desc })),
      };
    } else if (mode === "booking" && originalContract) {
      apiUrl = `http://localhost:8081/api/rentalContract/update/${originalContract.id}`;
      successMessage = `Xác nhận nhận xe cho hợp đồng ${originalContract.id} thành công!`;
      rentalContract = {
        id: originalContract.id,
        employee: user,
        status: "ACTIVE",
        contractVehicleDetails: vehiclesWithNotes.map((item) => ({
          vehicle: item.vehicle,
          conditionNotes: item.conditionNotes,
          status: "ACTIVE",
        })),
      };
    } else {
      setError("Chế độ hoạt động không hợp lệ.");
      setIsSaving(false);
      return;
    }

    console.log(
      `Payload cho mode '${mode}':`,
      JSON.stringify(rentalContract, null, 2)
    );

    try {
      const response = await axios.post(apiUrl, rentalContract);
      if (response.data === true) {
        alert(successMessage);
        navigate(`/rental/vehicles`, { replace: true });
      } else {
        setError("Lưu hợp đồng thất bại. Phản hồi từ server không hợp lệ.");
        setIsSaving(false);
      }
    } catch (err) {
      let errorMsg = `Đã xảy ra lỗi (Mode: ${mode}).`;
      if (err.response) {
        const serverError =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data);
        errorMsg += ` Server: ${serverError} (${err.response.status})`;
      } else if (err.request) {
        errorMsg += ` Không thể kết nối server.`;
      } else {
        errorMsg += ` Lỗi: ${err.message}`;
      }
      setError(errorMsg);
      console.error("Save contract error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [
    customer,
    vehiclesWithNotes,
    collaterals,
    user,
    navigate,
    mode,
    originalContract,
    displayValues,
  ]);

  if (!customer) {
    return <div className="container mx-auto p-4">Đang tải dữ liệu...</div>;
  }

  const pageTitle =
    mode === "new"
      ? "Xác Nhận Tạo Hợp Đồng Mới"
      : `Xác Nhận Nhận Xe - HĐ #${originalContract?.id || ""}`;
  const submitButtonText =
    mode === "new" ? "Xác Nhận & Lưu Hợp Đồng" : "Xác Nhận Nhận Xe";
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Tiêu đề và nút quay lại */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <button
          onClick={() => {
            if (mode === "new") {
              navigate(`/rental/customerSearch`, {
                state: { selectedVehicles: vehiclesWithNotes },
              });
            } else {
              navigate("/rental/contractSearch", { replace: true });
            }
          }}
          className="text-md text-blue-600 hover:underline"
        >
          {mode === "new"
            ? "Quay lại chọn khách hàng"
            : "Quay lại tìm hợp đồng"}
        </button>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      {/* =========================================== */}
      {/* Thông tin Khách hàng và Ngày thuê */}
      {/* =========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin khách hàng */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2 text-gray-800">
            Thông tin khách hàng
          </h3>
          <p>
            <strong>Họ tên:</strong> {customer.user.fullName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {customer.user.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {customer.user.email || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {customer.user.address || "N/A"}
          </p>
        </div>
        {/* Thông tin thuê */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2 text-gray-800">
            Thông tin tổng hợp
          </h3>
          <p className="mt-2 font-semibold">
            Tổng tiền thuê dự kiến:{" "}
            <span className="text-indigo-700">
              {formatCurrency(displayValues.totalEstimatedAmount)}
            </span>
          </p>
          <p className="font-semibold">
            Tiền đặt cọc ({mode === "new" ? "20% - Tự động" : "Đã cọc"}):{" "}
            <span className="text-green-700">
              {formatCurrency(displayValues.depositAmount)}
            </span>
          </p>
          <p className="font-semibold">
            Số tiền còn lại cần thanh toán khi trả xe
            <span className="text-orange-700 ml-1">
              {formatCurrency(displayValues.dueAmount)}
            </span>
          </p>
        </div>
      </div>
      {/* =========================================== */}
      {/* Danh sách Xe thuê và Tình trạng */}
      {/* =========================================== */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3 text-gray-800">
          Xe Thuê ({vehiclesWithNotes.length})
        </h3>
        <div className="space-y-4">
          {vehiclesWithNotes.map((item) => (
            <div
              key={item.vehicle.id}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="mr-3 flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                  {item.vehicle.vehicleImages &&
                  item.vehicle.vehicleImages.length > 0 ? (
                    (() => {
                      const thumbnail = item.vehicle.vehicleImages.find(
                        (img) => img.isThumbnail
                      );
                      return (
                        thumbnail &&
                        thumbnail.imageUri && (
                          <img
                            src={thumbnail.imageUri}
                            alt={thumbnail.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )
                      );
                    })()
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs text-center">
                        Không có ảnh
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <p className="font-medium text-lg">
                      {item.vehicle.name}{" "}
                      <span className="text-base font-normal text-gray-600">
                        ({item.vehicle.licensePlate})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 sm:ml-4">
                      Giá/ngày:{" "}
                      <span className="font-bold text-indigo-600">
                        {formatCurrency(item.vehicle.rentalPrice)}
                      </span>
                    </p>
                  </div>

                  {/* Hiển thị thời gian thuê của xe */}
                  <div className="mt-2 mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        Từ ngày:
                      </span>
                      <span className="text-sm font-medium">
                        {item.startDate
                          ? new Date(item.startDate).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        Đến ngày:
                      </span>
                      <span className="text-sm font-medium">
                        {item.endDate
                          ? new Date(item.endDate).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin tài chính cho từng xe */}
                  <div className="mb-3 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="font-medium text-gray-700">
                          Thành tiền:
                        </span>{" "}
                        <span className="text-indigo-600">
                          {formatCurrency(item.totalEstimatedAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input Tình trạng xe */}
                  <div>
                    <label
                      htmlFor={`condition-${item.vehicle.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tình trạng xe khi giao (ghi chú):
                    </label>
                    <textarea
                      id={`condition-${item.vehicle.id}`}
                      rows="2"
                      value={item.conditionNotes}
                      onChange={(e) =>
                        handleConditionNotesChange(
                          item.vehicle.id,
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: Trầy xước nhẹ cản trước, mức xăng còn 1 vạch,..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* =========================================== */}
      {/* Tài sản đảm bảo */}
      {/* =========================================== */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3 text-gray-800">Tài sản đảm bảo</h3>
        {mode === "new" ? (
          <>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newCollateralInput}
                onChange={handleNewCollateralChange}
                placeholder="Mô tả tài sản (VD: CCCD 123xxx, Xe máy Dream biển số...)"
                className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCollateral}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                disabled={!newCollateralInput.trim()}
              >
                Thêm
              </button>
            </div>
            {collaterals.length === 0 && (
              <p className="text-sm text-gray-500">
                Chưa có tài sản đảm bảo nào được thêm.
              </p>
            )}
          </>
        ) : (
          collaterals.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              Thông tin tài sản đảm bảo đã được ghi nhận từ đơn đặt trước.
            </p>
          )
        )}
        {/* Danh sách tài sản đã thêm */}
        {collaterals.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {collaterals.map((collateral, index) => (
              <li
                key={index}
                className={`flex justify-between items-center group p-2 rounded ${
                  mode === "new" ? "hover:bg-gray-200" : ""
                } transition-all duration-200`}
              >
                <span>{collateral}</span>
                {mode === "new" && (
                  <button
                    onClick={() => handleRemoveCollateral(index)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-2 px-1 hover:bg-red-100 rounded"
                    title="Xóa tài sản này"
                  >
                    × Xóa
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          mode !== "new" && (
            <p className="text-sm text-gray-500 italic">
              Không có tài sản đảm bảo nào được ghi nhận cho hợp đồng này.
            </p>
          )
        )}
      </div>
      {/* =========================================== */}
      {/* Nút Xác nhận */}
      {/* =========================================== */}
      <div className="mt-6 pt-6 border-t flex justify-end">
        <button
          onClick={handleConfirmContract}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out text-lg"
          disabled={
            isSaving ||
            (mode === "new" && displayValues.totalEstimatedAmount <= 0) ||
            vehiclesWithNotes.length === 0 ||
            collaterals.length === 0
          }
        >
          {isSaving ? "Đang xử lý..." : submitButtonText}
        </button>
      </div>
      {/* Thông báo lỗi phụ */}
      {collaterals.length === 0 && (
        <p className="text-red-500 text-sm text-right mt-1">
          Vui lòng điền tài sản đảm bảo.
        </p>
      )}
      {vehiclesWithNotes.length === 0 && (
        <p className="text-red-500 text-sm text-right mt-1">
          Không có xe nào trong hợp đồng.
        </p>
      )}
      {mode === "new" &&
        displayValues.totalEstimatedAmount <= 0 &&
        vehiclesWithNotes.length > 0 && (
          <p className="text-red-500 text-sm text-right mt-1">
            Tổng tiền thuê dự kiến không hợp lệ. Kiểm tra lại ngày hoặc xe.
          </p>
        )}
    </div>
  );
};
