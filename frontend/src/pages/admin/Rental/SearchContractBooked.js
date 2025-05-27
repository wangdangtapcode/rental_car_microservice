import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export const SearchContractBooked = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập thông tin khách hàng.");
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/rentalContract/search?name=${searchTerm}`
        );
        console.log("Response data:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSearchResults(response.data);
        } else if (response.data.length === 0) {
          setError("Không tìm thấy hợp đồng đặt trước phù hợp.");
          setSearchResults([]);
        }
      } catch (error) {
        setError("Đã có lỗi xảy ra khi tìm kiếm.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [searchTerm]);

  const handleSelectContract = (contract) => {
    console.log("Selected contract:", contract);
    const transformedState = {
      customer: contract.customer,
      selectedVehicles: contract.contractVehicleDetails.map((detail) => ({
        vehicle: detail.vehicle,
        conditionNotes:
          detail.vehicle.vehicleCondition || "Như hiện trạng khi đặt",
        startDate: detail.startDate,
        endDate: detail.endDate,
        totalEstimatedAmount: detail.totalEstimatedAmount,
      })),
      originalContractData: contract,
      mode: "booking",
    };
    navigate("/rental/contract/draft", { state: transformedState });
  };

  const handleGoToVehicleSearch = () => {
    navigate(`/rental/vehicles`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Xác nhận nhận xe từ đơn đặt trước
      </h1>

      <div className="p-4 border rounded shadow-sm bg-white">
        <div className="flex justify-between items-center gap-4 m-5">
          <h2 className="text-xl font-semibold mb-3">Tìm đơn đặt trước</h2>
          <div className="flex gap-3">
            <button
              onClick={handleGoToVehicleSearch}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm text-center whitespace-nowrap"
            >
              Tìm xe (Thuê xe)
            </button>
          </div>
        </div>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mt-8 mx-auto">
          <h3 className="text-xl font-medium mb-4 text-center">
            Danh sách đơn đặt trước:
          </h3>
          <ul className="list-none p-0 space-y-4">
            {searchResults.map((contract) => (
              <li
                key={contract.id}
                className="border border-gray-300 p-4 rounded-md shadow-sm bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <div className="grid grid-cols-1  gap-x-4 relative">
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
                  <div>
                    <div className="mb-1">
                      <strong>Trạng thái:</strong>
                      <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        ĐÃ ĐẶT TRƯỚC
                      </span>
                    </div>
                    <div className="mb-2 text-sm">
                      <strong>Xe trong HĐ:</strong>
                      {contract.contractVehicleDetails &&
                      contract.contractVehicleDetails.length > 0 ? (
                        <div className="ml-1 text-gray-700 flex flex-col gap-1">
                          {contract.contractVehicleDetails.map(
                            (detail, index) => (
                              <div key={index}>
                                {detail.vehicle?.name || "Không rõ"}{" "}
                                <span className="text-gray-500">
                                  (Từ ngày {detail.startDate} đến ngày{" "}
                                  {detail.endDate})
                                </span>
                              </div>
                            )
                          )}
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
                      className="absolute right-2 bottom-2 mt-1 py-1 px-3 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Xác nhận nhận xe
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
