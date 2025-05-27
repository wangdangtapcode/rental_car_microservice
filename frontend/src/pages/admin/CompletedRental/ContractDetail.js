import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const ContractDetailPage = () => {
  const currentUser = useSelector((state) => state.user.user);
  const { contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [contractDetails, setContractDetails] = useState(null);
  const [vehiclesInContract, setVehiclesInContract] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returningVehicle, setReturningVehicle] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let contractData = location.state?.contract;

      if (!contractData) {
        setError("Không tìm thấy thông tin hợp đồng.");
        setTimeout(() => navigate(-1), 2000);
        return;
      }

      const penaltyResp = await axios.get(
        "http://localhost:8081/api/penalty-types/all"
      );
      const typesData = penaltyResp.data;

      setContractDetails(contractData);
      setPenaltyTypes(typesData);
      setVehiclesInContract(contractData.contractVehicleDetails || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError(
        err.response?.data?.message || "Không thể tải dữ liệu từ máy chủ."
      );
    } finally {
      setIsLoading(false);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddPenalty = useCallback((contractVehicleDetailId) => {
    setVehiclesInContract((prevVehicles) =>
      prevVehicles.map((vehicleDetail) => {
        if (vehicleDetail.id === contractVehicleDetailId) {
          const updatedVehicle = {
            ...vehicleDetail,
            penalties: [
              ...vehicleDetail.penalties,
              {
                tempId: Date.now(),
                penaltyType: {},
                penaltyAmount: 0,
                note: "",
                isDirty: true,
              },
            ],
          };
          setSelectedVehicles((prevSelected) =>
            prevSelected.map((v) =>
              v.id === contractVehicleDetailId ? updatedVehicle : v
            )
          );
          return updatedVehicle;
        }
        return vehicleDetail;
      })
    );
  }, []);

  const handleRemovePenalty = useCallback(
    (contractVehicleDetailId, tempPenaltyId) => {
      setVehiclesInContract((prevVehicles) =>
        prevVehicles.map((vehicleDetail) => {
          if (vehicleDetail.id === contractVehicleDetailId) {
            const updatedVehicle = {
              ...vehicleDetail,
              penalties: vehicleDetail.penalties.filter(
                (p) => p.tempId !== tempPenaltyId
              ),
            };
            setSelectedVehicles((prevSelected) =>
              prevSelected.map((v) =>
                v.id === contractVehicleDetailId ? updatedVehicle : v
              )
            );
            return updatedVehicle;
          }
          return vehicleDetail;
        })
      );
    },
    []
  );

  const handlePenaltyChange = useCallback(
    (contractVehicleDetailId, tempPenaltyId, field, value) => {
      setVehiclesInContract((prevVehicles) =>
        prevVehicles.map((vehicleDetail) => {
          if (vehicleDetail.id === contractVehicleDetailId) {
            const updatedVehicle = {
              ...vehicleDetail,
              penalties: vehicleDetail.penalties.map((penalty) => {
                if (penalty.tempId === tempPenaltyId) {
                  const updatedPenalty = { ...penalty };

                  if (field === "penaltyType") {
                    const selectedType = penaltyTypes.find(
                      (pt) => pt.id.toString() === value
                    );
                    if (selectedType) {
                      updatedPenalty.penaltyType = selectedType;
                      if (selectedType.defaultAmount > 0) {
                        updatedPenalty.penaltyAmount =
                          selectedType.defaultAmount;
                      }
                      updatedPenalty.note = selectedType.description;
                    }
                  }

                  if (field === "penaltyAmount") {
                    updatedPenalty.penaltyAmount = parseFloat(value) || 0;
                  }

                  if (field === "note") {
                    updatedPenalty.note = value;
                  }

                  return updatedPenalty;
                }
                return penalty;
              }),
            };
            setSelectedVehicles((prevSelected) =>
              prevSelected.map((v) =>
                v.id === contractVehicleDetailId ? updatedVehicle : v
              )
            );
            return updatedVehicle;
          }
          return vehicleDetail;
        })
      );
    },
    [penaltyTypes]
  );

  const handleVehicleSelect = (vehicleDetail) => {
    setSelectedVehicles((prev) => {
      const isSelected = prev.some((v) => v.id === vehicleDetail.id);
      if (isSelected) {
        return prev.filter((v) => v.id !== vehicleDetail.id);
      } else {
        const updatedVehicle = {
          ...vehicleDetail,
          actualReturnDate: new Date().toISOString().split("T")[0],
        };

        setVehiclesInContract((prev) =>
          prev.map((v) => (v.id === vehicleDetail.id ? updatedVehicle : v))
        );

        return [...prev, updatedVehicle];
      }
    });
  };

  const handleSelectAllActive = () => {
    const activeVehicles = vehiclesInContract.filter(
      (v) => v.status === "ACTIVE"
    );
    const updatedVehicles = activeVehicles.map((v) => ({
      ...v,
      actualReturnDate: new Date().toISOString().split("T")[0],
    }));
    setSelectedVehicles(updatedVehicles);
    setVehiclesInContract(updatedVehicles);
  };

  const handleDeselectAll = () => {
    setSelectedVehicles([]);
  };

  const handleReturnSelectedVehicles = () => {
    if (selectedVehicles.length === 0) {
      setError("Vui lòng chọn ít nhất một xe để trả");
      return;
    }

    const allVehiclesInContract = contractDetails.contractVehicleDetails || [];
    const allVehiclesReturned = allVehiclesInContract.every((contractVehicle) =>
      selectedVehicles.some(
        (selectedVehicle) => selectedVehicle.id === contractVehicle.id
      )
    );

    const updatedContract = {
      contract: {
        ...contractDetails,
        isAllVehiclesReturned: allVehiclesReturned,
      },
      selectedVehicles: selectedVehicles.map((v) => ({
        ...v,
        penalties: v.penalties.map((p) => ({
          note: p.note,
          penaltyAmount: p.penaltyAmount,
          penaltyType: p.penaltyType,
        })),
      })),
    };
    navigate(`/completedRental/invoice/${contractId}`, {
      state: { contract: updatedContract },
    });
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Đang tải thông tin hợp đồng...
      </p>
    );
  if (error && !contractDetails)
    return <p className="mt-10 text-center text-red-600">Lỗi: {error}</p>;
  if (!contractDetails)
    return (
      <p className="text-center mt-10 text-gray-600">
        Không có thông tin hợp đồng.
      </p>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Chi tiết Hợp đồng Trả Xe - Mã HĐ: {contractDetails.id}
      </h2>
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-lg font-medium mb-3 text-gray-800">
          Thông tin Hợp đồng
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-600">Khách hàng:</span>{" "}
              {contractDetails.customer?.user?.fullName || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Số điện thoại:
              </span>{" "}
              {contractDetails.customer?.user?.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Địa chỉ:</span>{" "}
              {contractDetails.customer?.user?.address || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Trạng thái:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  contractDetails.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {contractDetails.status}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Nhân viên tạo:
              </span>{" "}
              {contractDetails.employee?.user?.fullName || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Ngày tạo:</span>{" "}
              {contractDetails.createdDate}
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-600">
                Tổng Tiền ước tính:
              </span>{" "}
              {contractDetails.totalEstimatedAmount?.toLocaleString() || 0} VND
            </p>
            <div>
              <span className="font-semibold text-gray-600">
                Tài sản thế chấp:
              </span>
              {contractDetails.collaterals?.length > 0 ? (
                <ul className="list-disc list-inside ml-4 mt-1">
                  {contractDetails.collaterals.map((c) => (
                    <li key={c.id}>{c.description}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-500">Không có</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium my-4 text-gray-800">
        Danh sách xe trong hợp đồng
      </h3>

      {error && (
        <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={handleSelectAllActive}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Chọn trả tất cả xe
          </button>
          <button
            onClick={handleDeselectAll}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            Bỏ chọn tất cả
          </button>
        </div>
        <button
          onClick={handleReturnSelectedVehicles}
          disabled={selectedVehicles.length === 0}
          className={`px-4 py-2 ${
            selectedVehicles.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded`}
        >
          Trả {selectedVehicles.length} xe đã chọn
        </button>
      </div>

      {vehiclesInContract.length > 0 ? (
        vehiclesInContract.map((vehicleDetail) => (
          <div
            key={vehicleDetail.id}
            className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {vehicleDetail.status === "ACTIVE" ? (
                  <input
                    type="checkbox"
                    checked={selectedVehicles.some(
                      (v) => v.id === vehicleDetail.id
                    )}
                    onChange={() => handleVehicleSelect(vehicleDetail)}
                    className="mr-3 h-5 w-5"
                  />
                ) : (
                  <div className="mr-3 h-5 w-5" /> // Placeholder for alignment
                )}
                <h4 className="text-md font-medium text-gray-800">
                  {vehicleDetail.vehicle?.name} -{" "}
                  {vehicleDetail.vehicle?.licensePlate}
                </h4>
              </div>
              <div className="flex space-x-2">
                {vehicleDetail.status === "ACTIVE" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    Đang thuê
                  </span>
                )}
                {vehicleDetail.status === "PENDING_RETURN" && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                    Đang Chờ Thanh Toán
                  </span>
                )}
                {vehicleDetail.status === "COMPLETED" && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Đã Trả Ngày{" "}
                    {new Date(
                      vehicleDetail.actualReturnDate
                    ).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>

            {/* Thông tin xe và ảnh */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-1">
                {vehicleDetail.vehicle?.vehicleImages &&
                vehicleDetail.vehicle.vehicleImages.length > 0 ? (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={vehicleDetail.vehicle.vehicleImages[0].imageUri}
                      alt={vehicleDetail.vehicle.name}
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
                    <span className="font-medium">Ngày bắt đầu:</span>{" "}
                    {vehicleDetail.startDate
                      ? new Date(vehicleDetail.startDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Ngày kết thúc:</span>{" "}
                    {vehicleDetail.endDate
                      ? new Date(vehicleDetail.endDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Giá thuê/ngày:</span>{" "}
                    {vehicleDetail.rentalPrice?.toLocaleString() || 0} VND
                  </div>
                  <div>
                    <span className="font-medium">Số ngày thuê:</span>{" "}
                    {vehicleDetail.startDate && vehicleDetail.endDate
                      ? Math.ceil(
                          (new Date(vehicleDetail.endDate) -
                            new Date(vehicleDetail.startDate)) /
                            (1000 * 60 * 60 * 24)
                        ) + 1
                      : 0}{" "}
                    ngày
                  </div>
                  <div>
                    <span className="font-medium">Tổng tiền ước tính:</span>{" "}
                    {vehicleDetail.totalEstimatedAmount?.toLocaleString() || 0}{" "}
                    VND
                  </div>
                </div>
              </div>
            </div>

            {/* Chỉ hiển thị form trả xe cho xe đang ACTIVE */}
            {vehicleDetail.status === "ACTIVE" &&
              selectedVehicles.some((v) => v.id === vehicleDetail.id) && (
                <div className="mt-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <h5 className="font-medium text-blue-800 mb-3">
                    Thông tin trả xe
                  </h5>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedVehicles.length ===
                    vehiclesInContract.filter((v) => v.status === "ACTIVE")
                      .length
                      ? "Trả tất cả xe còn lại - Sẽ áp dụng tiền cọc"
                      : "Trả một phần xe - Không áp dụng tiền cọc"}
                  </p>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày trả thực tế:
                    </label>
                    <input
                      type="date"
                      value={
                        vehicleDetail.actualReturnDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setVehiclesInContract((prev) =>
                          prev.map((vd) => {
                            if (vd.id === vehicleDetail.id) {
                              return {
                                ...vd,
                                actualReturnDate: newDate,
                              };
                            }
                            return vd;
                          })
                        );
                        setSelectedVehicles((prevSelected) =>
                          prevSelected.map((v) => {
                            if (v.id === vehicleDetail.id) {
                              return {
                                ...v,
                                actualReturnDate: newDate,
                              };
                            }
                            return v;
                          })
                        );
                      }}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>

                  <h5 className="font-medium text-gray-700 mb-2">
                    Các lỗi vi phạm (nếu có)
                  </h5>

                  {vehicleDetail.penalties &&
                    vehicleDetail.penalties.map((penalty, idx) => (
                      <div
                        key={penalty.tempId || idx}
                        className="mb-3 p-2 border border-gray-200 rounded bg-white"
                      >
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Loại lỗi:
                            </label>
                            <select
                              className="border rounded px-2 py-1 w-full"
                              value={penalty.penaltyType?.id || ""}
                              onChange={(e) =>
                                handlePenaltyChange(
                                  vehicleDetail.id,
                                  penalty.tempId,
                                  "penaltyType",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Chọn loại lỗi</option>
                              {penaltyTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name} (
                                  {type.defaultAmount.toLocaleString()} VND)
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tiền phạt (VND):
                            </label>
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-full"
                              value={penalty.penaltyAmount || 0}
                              onChange={(e) =>
                                handlePenaltyChange(
                                  vehicleDetail.id,
                                  penalty.tempId,
                                  "penaltyAmount",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ghi chú:
                            </label>
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-full"
                              value={penalty.note || ""}
                              onChange={(e) =>
                                handlePenaltyChange(
                                  vehicleDetail.id,
                                  penalty.tempId,
                                  "note",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <button
                            onClick={() =>
                              handleRemovePenalty(
                                vehicleDetail.id,
                                penalty.tempId
                              )
                            }
                            className="ml-2 mt-5 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}

                  <button
                    onClick={() => handleAddPenalty(vehicleDetail.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    + Thêm lỗi
                  </button>
                </div>
              )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">
          Không có xe nào trong hợp đồng này.
        </p>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};
