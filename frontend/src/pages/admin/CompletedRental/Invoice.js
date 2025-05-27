// src/pages/Invoice.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [contractDetails, setContractDetails] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [calculation, setCalculation] = useState({
    totalPenalties: 0,
    totalEstimatedAmount: 0,
    totalAmount: 0,
    isLastVehicles: false,
    finalAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.user.user);

  const calculateCosts = useCallback(
    (vehicles) => {
      if (!vehicles || !Array.isArray(vehicles)) return;

      // Tính tổng tiền thuê từ các xe được chọn
      let totalRentalAmount = 0;
      let totalPenalties = 0;

      vehicles.forEach((vehicle) => {
        totalRentalAmount += vehicle.totalEstimatedAmount;

        // Tính tiền phạt
        if (vehicle.penalties && Array.isArray(vehicle.penalties)) {
          vehicle.penalties.forEach((penalty) => {
            totalPenalties += Number(penalty.penaltyAmount) || 0;
          });
        }
      });

      // Kiểm tra xem có phải những xe cuối cùng trong hợp đồng không
      const allVehiclesInContract =
        contractDetails?.contractVehicleDetails || [];
      const remainingActiveVehicles = allVehiclesInContract.filter(
        (contractVehicle) =>
          contractVehicle.status === "ACTIVE" &&
          !vehicles.some(
            (selectedVehicle) => selectedVehicle.id === contractVehicle.id
          )
      );
      const isLastVehicles = remainingActiveVehicles.length === 0;

      // Tính tổng tiền
      const totalAmount = totalRentalAmount + totalPenalties;

      // Nếu là những xe cuối cùng thì áp dụng tiền cọc
      const finalAmount = isLastVehicles
        ? totalAmount - (contractDetails?.depositAmount || 0)
        : totalAmount;

      setCalculation({
        totalPenalties,
        totalEstimatedAmount: totalRentalAmount,
        totalAmount,
        isLastVehicles,
        finalAmount,
      });
    },
    [contractDetails]
  );

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const contractFromState = location.state?.contract;
    if (!contractFromState) {
      setError("Lỗi: Không nhận được dữ liệu hợp đồng từ trang trước.");
      setIsLoading(false);
      return;
    }

    if (!currentUser || !currentUser.id) {
      setError(
        "Lỗi: Không xác định được thông tin nhân viên xử lý. Vui lòng đăng nhập lại."
      );
      setIsLoading(false);
      return;
    }
    console.log("contractFromState", contractFromState);
    setContractDetails(contractFromState.contract);
    setSelectedVehicles(contractFromState.selectedVehicles);
    calculateCosts(contractFromState.selectedVehicles);
    setIsLoading(false);
  }, [location.state, calculateCosts, currentUser]);

  const handleCreateInvoice = useCallback(async () => {
    if (
      !contractDetails ||
      !selectedVehicles ||
      !currentUser ||
      !currentUser.id
    ) {
      setError("Thiếu thông tin Hợp đồng hoặc Nhân viên.");
      return;
    }

    setIsCreatingInvoice(true);
    setError(null);
    const now = new Date();
    const formattedCreatedDate = now.toISOString().slice(0, 10);
    try {
      // Chuẩn bị dữ liệu gửi lên server
      const invoiceData = {
        employee: currentUser,
        paymentDate: formattedCreatedDate,
        contractVehicleDetails: selectedVehicles,
        penaltyAmount: calculation.totalPenalties,
        totalAmount: calculation.totalAmount,
        dueAmount: calculation.finalAmount,
      };
      console.log("invoiceData", invoiceData);
      const response = await axios.post(
        `http://localhost:8081/api/invoice/create`,
        invoiceData
      );

      if (response.data === "Tạo hóa đơn thành công") {
        alert("Thêm hoá đơn thành công!");
        navigate("/completedRental");
      } else {
        alert("Thêm hoá đơn thất bại!");
      }
    } catch (err) {
      let errorMsg = "Đã xảy ra lỗi trong quá trình tạo hóa đơn.";
      if (err.response) {
        const serverError =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data);
        errorMsg = `Lỗi từ server: ${serverError} (Code: ${err.response.status})`;
      } else if (err.request) {
        errorMsg = "Không thể kết nối đến máy chủ.";
      } else {
        errorMsg = `Lỗi cấu hình request: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [contractDetails, selectedVehicles, currentUser, navigate, calculation]);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Đang tải dữ liệu hóa đơn...
      </p>
    );
  if (error && !contractDetails)
    return <p className="mt-10 text-center text-red-600">Lỗi: {error}</p>;
  if (!contractDetails)
    return (
      <p className="text-center mt-10 text-gray-600">
        Không có thông tin hợp đồng để tạo hóa đơn.
      </p>
    );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 VND";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Hóa đơn Thanh toán {selectedVehicles.length > 1 ? "Nhiều Xe" : "Một Xe"}
      </h2>
      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">
          Lỗi: {error}
        </p>
      )}
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white text-sm">
        {/* --- Phần Header (Hiển thị thông tin từ contractDetails) --- */}
        <div className="grid grid-cols-2  gap-x-6 gap-y-3 mb-5 pb-4 border-b border-gray-200">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Khách hàng
            </h3>
            <p>
              <strong>Tên:</strong>{" "}
              {contractDetails.customer?.user?.fullName || "N/A"}
            </p>
            <p>
              <strong>SĐT:</strong>{" "}
              {contractDetails.customer?.user?.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {contractDetails.customer?.user?.email || "N/A"}
            </p>
          </div>
          {/* Thông tin HĐ & Xử lý */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Hợp đồng
            </h3>
            <p>
              <strong>NV tạo HĐ:</strong>{" "}
              {contractDetails.employee?.user?.fullName || "N/A"}
            </p>
            <p className="mt-2">
              <strong>NV tạo hóa đơn:</strong>{" "}
              {currentUser?.user.fullName || "N/A"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <strong>Ngày tạo hóa đơn:</strong>{" "}
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* --- Phần Chi tiết Xe (Hiển thị từ selectedVehicles) --- */}
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-2 text-gray-700">
            Chi tiết Xe trong Hợp đồng
          </h3>
          {selectedVehicles && selectedVehicles.length > 0 ? (
            <div className="space-y-4">
              {selectedVehicles.map((vd) => (
                <div
                  key={vd.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      {vd.vehicle?.vehicleImages &&
                      vd.vehicle.vehicleImages.length > 0 ? (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img
                            src={vd.vehicle.vehicleImages[0].imageUri}
                            alt={vd.vehicle.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">Không có ảnh</span>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Tên xe:</span>{" "}
                          {vd.vehicle?.name || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Biển số:</span>{" "}
                          {vd.vehicle?.licensePlate || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Ngày bắt đầu:</span>{" "}
                          {formatDate(vd.startDate)}
                        </div>
                        <div>
                          <span className="font-medium">Ngày kết thúc:</span>{" "}
                          {formatDate(vd.endDate)}
                        </div>
                        <div>
                          <span className="font-medium">Ngày trả:</span>{" "}
                          {formatDate(vd.actualReturnDate)}
                        </div>
                        <div>
                          <span className="font-medium">Giá thuê/ngày:</span>{" "}
                          {formatCurrency(vd.rentalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {vd.penalties && vd.penalties.length > 0 && (
                    <div className="my-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-orange-200">
                            <th className="py-2 px-2 text-left">Loại phạt</th>
                            <th className="py-2 px-2 text-left">Ghi chú</th>
                            <th className="py-2 px-2 text-right">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vd.penalties.map((penalty, index) => (
                            <tr
                              key={index}
                              className="border-b border-orange-100"
                            >
                              <td className="py-2 px-2">
                                {penalty.penaltyType?.name}
                              </td>
                              <td className="py-2 px-2">{penalty.note}</td>
                              <td className="py-2 px-2 text-right font-medium">
                                {formatCurrency(penalty.penaltyAmount)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-orange-100">
                            <td colSpan="2" className="py-2 px-2 font-medium">
                              Tổng phạt xe này:
                            </td>
                            <td className="py-2 px-2 text-right font-bold">
                              {formatCurrency(
                                vd.penalties.reduce(
                                  (sum, p) => sum + (p.penaltyAmount || 0),
                                  0
                                )
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">
              Không có chi tiết xe trong hợp đồng này.
            </p>
          )}
        </div>

        {/* --- Phần Phạt ĐÃ CÓ trong Hợp đồng --- */}
        {/* {selectedVehicles.map(
          (vehicleDetail) =>
            vd.penalties &&
            vd.penalties.length > 0 && (
              <div
                key={vehicleDetail.id}
                className="mb-4 p-4 border border-orange-200 rounded-lg bg-orange-50"
              >
                <h4 className="font-medium text-orange-800 mb-2">
                  Phạt xe {vehicleDetail.vehicle?.name} -{" "}
                  {vehicleDetail.vehicle?.licensePlate}
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="py-2 px-2 text-left">Loại phạt</th>
                      <th className="py-2 px-2 text-left">Ghi chú</th>
                      <th className="py-2 px-2 text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleDetail.penalties.map((penalty, index) => (
                      <tr key={index} className="border-b border-orange-100">
                        <td className="py-2 px-2">
                          {penalty.penaltyType?.name}
                        </td>
                        <td className="py-2 px-2">{penalty.note}</td>
                        <td className="py-2 px-2 text-right font-medium">
                          {formatCurrency(penalty.penaltyAmount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-orange-100">
                      <td colSpan="2" className="py-2 px-2 font-medium">
                        Tổng phạt xe này:
                      </td>
                      <td className="py-2 px-2 text-right font-bold">
                        {formatCurrency(
                          vehicleDetail.penalties.reduce(
                            (sum, p) => sum + (p.penaltyAmount || 0),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
        )} */}

        {calculation.totalPenalties === 0 && (
          <div className="mb-5 pb-4 border-b border-gray-200">
            <p className="text-center text-gray-500 italic">
              Không có phí phạt nào.
            </p>
          </div>
        )}

        {/* --- Phần Tổng kết Tiền (CẬP NHẬT HIỂN THỊ) --- */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-700">
            Tổng kết Thanh toán
          </h3>
          <div className="space-y-2 max-w-md ml-auto">
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tổng tiền thuê gốc (HĐ):</span>
              <span className="font-medium text-gray-800 w-36 text-right">
                {formatCurrency(calculation.totalEstimatedAmount)}
              </span>
            </p>
            {calculation.totalPenalties > 0 && (
              <p className="flex justify-between items-center text-base">
                <span className="text-gray-600">Tổng phạt:</span>
                <span className="font-medium text-orange-700 w-36 text-right">
                  (+) {formatCurrency(calculation.totalPenalties)}
                </span>
              </p>
            )}

            {/* Hiển thị tổng cộng cuối cùng */}
            <p className="flex justify-between items-center text-base font-semibold border-t pt-2">
              <span className="text-gray-800">Tổng cộng (Thuê + Phạt):</span>
              <span className="text-gray-900 w-36 text-right">
                {formatCurrency(calculation.totalAmount)}
              </span>
            </p>

            {/* Hiển thị tiền cọc nếu là những xe cuối cùng */}
            {calculation.isLastVehicles && (
              <>
                <p className="flex justify-between items-center text-base">
                  <span className="text-gray-600">Tiền cọc đã trả:</span>
                  <span className="font-medium text-green-700 w-36 text-right">
                    (-) {formatCurrency(contractDetails?.depositAmount || 0)}
                  </span>
                </p>
                {/* Số tiền cuối cùng */}
                <div className="mt-3 font-bold text-lg text-right p-3 rounded-md border">
                  {calculation.finalAmount > 0 && (
                    <span>
                      Thanh toán thêm:{" "}
                      <strong className="ml-2">
                        {formatCurrency(calculation.finalAmount)}
                      </strong>
                    </span>
                  )}
                  {calculation.finalAmount < 0 && (
                    <span>
                      Hoàn lại KH:{" "}
                      <strong className="ml-2">
                        {formatCurrency(Math.abs(calculation.finalAmount))}
                      </strong>
                    </span>
                  )}
                  {calculation.finalAmount === 0 && <span>Hoàn tất.</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>{" "}
      {/* Kết thúc khung hóa đơn */}
      <div className="mt-8 text-center">
        <button
          onClick={handleCreateInvoice}
          disabled={isLoading || isCreatingInvoice}
          className={`py-3 px-8 text-lg font-semibold rounded-md shadow-md text-white transition duration-150 ease-in-out ${
            isCreatingInvoice
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isCreatingInvoice ? "Đang tạo hóa đơn..." : "Xác nhận & Tạo Hóa đơn"}
        </button>
      </div>
    </div>
  );
};
