import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const USER_SERVICE_URL = "http://localhost:8081";
const RENTAL_SERVICE_URL = "http://localhost:8083";
const VEHICLE_SERVICE_URL = "http://localhost:8082";
export const SearchContractPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập thông tin khách hàng để tìm kiếm.");
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // --- Bước 1: Gọi UserService để lấy customerId ---

      const userResponse = await axios.get(
        `${USER_SERVICE_URL}/api/customers/search?fullName=${searchTerm}`
      );
      if (!userResponse.data || userResponse.data.length === 0) {
        setError("Không tìm thấy khách hàng phù hợp.");
        setIsLoading(false);
        return;
      }

      const customerIds = userResponse.data.map((user) => user.id);
      // --- Bước 2: --------------------------------- ---

      const rentalContractsPayload = customerIds.map((id) => ({
        customerId: id,
      }));

      console.log("rentalContractsPayload", rentalContractsPayload);

      const rentalResponse = await axios.post(
        `${RENTAL_SERVICE_URL}/api/rentals/search-active-by-customer-ids`,
        rentalContractsPayload
      );

      console.log("rentalResponse", rentalResponse.data);

      if (!rentalResponse.data || rentalResponse.data.length === 0) {
        setError("Không tìm thấy hợp đồng phù hợp.");
        setIsLoading(false);
        return;
      }

      let rentalContracts = rentalResponse.data;

      // --- Bước 3: Gọi VehicleService để lấy chi tiết xe ---
      const allVehicleDetails = rentalContracts.flatMap(
        (contract) => contract.contractVehicleDetails || []
      );
      const uniqueVehicleIds = [
        ...new Set(
          allVehicleDetails
            .map((detail) => detail.vehicleId)
            .filter((id) => id != null)
        ),
      ];
      const vehicleIdsToFetch = uniqueVehicleIds.map((id) => ({
        id: id,
      }));
      console.log("vehicleIdsToFetch", vehicleIdsToFetch);
      let vehicleDetailsMap = {};

      const vehicleResponse = await axios.post(
        `${VEHICLE_SERVICE_URL}/api/vehicles/batch`,
        vehicleIdsToFetch
      );
      vehicleDetailsMap = (vehicleResponse.data || []).reduce(
        (map, vehicle) => {
          map[vehicle.id] = vehicle;
          return map;
        },
        {}
      );
      console.log("vehicleDetailsMap", vehicleDetailsMap);
      // --- Bước 4: Tổng hợp dữ liệu ---
      const populatedContracts = rentalContracts.map((contract) => ({
        ...contract,
        customer: userResponse.data.find((u) => u.id === contract.customerId),
        contractVehicleDetails: (contract.contractVehicleDetails || []).map(
          (detail) => ({
            ...detail,
            penalties: [],
            vehicle: vehicleDetailsMap[detail.vehicleId],
          })
        ),
      }));
      console.log("populatedContracts", populatedContracts);
      setSearchResults(populatedContracts);
    } catch (err) {
      console.error("Lỗi tìm kiếm hợp đồng:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc hệ thống.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleSelectContract = (contract) => {
    navigate(`/completedRental/contract/${contract.id}`, {
      state: { contract },
    });
  };

  return (
    // Container chính có thể giữ nguyên hoặc thêm padding nếu cần
    <div className="container mx-auto p-4 md:px-8">
      {" "}
      {/* Thêm padding ngang lớn hơn trên màn hình md trở lên */}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Tìm kiếm Hợp đồng Cần Trả Xe
      </h2>
      {/* --- Khung tìm kiếm vẫn giữ max-w-lg --- */}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center gap-3">
          <label htmlFor="search-term" className="sr-only">
            Tìm theo SĐT/Tên khách hàng:
          </label>
          <input
            type="text"
            id="search-term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên hoặc mã HĐ..."
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </div>
      {error && <p className="mt-4 text-center text-red-600">Lỗi: {error}</p>}
      {searchResults.length > 0 && (
        <div className="mt-8 max-w-4xl mx-auto">
          {" "}
          {/* <<<=== Thay đổi ở đây (ví dụ: max-w-4xl) */}
          <h3 className="text-xl font-medium mb-4 text-center">
            Kết quả tìm kiếm:
          </h3>
          <ul className="list-none p-0 space-y-4">
            {searchResults.map((contract) => (
              // Card kết quả có thể giữ nguyên style
              <li
                key={contract.id}
                className="border border-gray-300 p-4 rounded-md shadow-sm bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <div className="grid grid-cols-1  gap-x-4 relative">
                  {/* Cột thông tin HĐ */}
                  <div>
                    <div className="mb-1">
                      <strong>Mã HĐ:</strong> {contract.id}
                    </div>
                    <div className="mb-1">
                      <strong>Khách hàng:</strong>{" "}
                      {contract.customer?.user?.fullName || "N/A"}
                    </div>
                    <div className="mb-1">
                      <strong>Số điện thoại:</strong>{" "}
                      {contract.customer?.user?.phoneNumber || "N/A"}
                    </div>
                  </div>
                  {/* Cột trạng thái, xe, nút */}
                  <div>
                    <div className="mb-1">
                      <strong>Trạng thái:</strong>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                          contract.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </div>
                    <div className="mb-2 text-sm">
                      <strong>Xe trong HĐ:</strong>
                      {contract.contractVehicleDetails &&
                      contract.contractVehicleDetails.length > 0 ? (
                        <div className="ml-1 text-gray-700 mt-1">
                          {contract.contractVehicleDetails.map((detail) => (
                            <div
                              key={detail.id}
                              className="flex items-center mb-1"
                            >
                              <span className="mr-2">
                                {detail.vehicle?.name || "Không rõ"}
                              </span>
                              {detail.status === "ACTIVE" && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                  Đang thuê
                                </span>
                              )}
                              {detail.status === "PENDING_RETURN" && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                  Chờ thanh toán
                                </span>
                              )}
                              {detail.status === "COMPLETED" && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                  Đã trả
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="ml-1 text-gray-500 italic">
                          {" "}
                          (không có thông tin)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectContract(contract)}
                      className=" absolute right-2 bottom-2 mt-1 py-1 px-3 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Chọn hợp đồng này
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
