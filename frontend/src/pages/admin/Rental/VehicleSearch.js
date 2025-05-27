import { useLocation, useNavigate } from "react-router";
import { useState, useCallback } from "react";
import axios from "axios";
import { formatCurrency } from "../../../utils/formatters";

export const VehicleSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  // xe
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [didSearchVehicle, setDidSearchVehicle] = useState(false);

  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    // Reset trạng thái tìm kiếm khi ngày thay đổi
    setDidSearchVehicle(false);
    setAvailableVehicles([]);
    setError(null);
  };
  //

  //
  const handleSearchSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError(null);

      if (!searchParams.startDate || !searchParams.endDate) {
        setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
        return;
      }
      if (new Date(searchParams.startDate) >= new Date(searchParams.endDate)) {
        setError("Ngày bắt đầu phải trước ngày kết thúc.");
        return;
      }

      setIsLoadingVehicles(true);
      setDidSearchVehicle(true);
      setAvailableVehicles([]);

      try {
        const response = await axios.get(
          "http://localhost:8081/api/vehicle/available",
          {
            params: {
              startDate: searchParams.startDate,
              endDate: searchParams.endDate,
            },
          }
        );
        console.log(response.data);
        const results = response.data;

        const currentlySelectedIds = new Set(
          selectedVehicles.map((item) => item.vehicle.id)
        );
        setAvailableVehicles(
          results.filter((v) => !currentlySelectedIds.has(v.id))
        );
        if (results.length === 0) {
          setError("Không tìm thấy xe phù hợp trong khoảng thời gian này.");
        }
      } catch (err) {
        setError("Lỗi trong quá trình tìm kiếm xe.");
        console.error(err);
      } finally {
        setIsLoadingVehicles(false);
      }
    },
    [searchParams, selectedVehicles]
  );
  //
  const handleSelectVehicleClick = useCallback(
    (vehicle) => {
      setSelectedVehicles((prev) => [
        ...prev,
        {
          vehicle: vehicle,
          conditionNotes: vehicle.vehicleCondition || "Như hiện trạng",
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
        },
      ]);

      // Sau khi chọn xe, ẩn danh sách xe (reset trạng thái tìm kiếm)
      setDidSearchVehicle(false);
      setAvailableVehicles([]);
    },
    [searchParams]
  );
  //
  const handleRemoveVehicleClick = useCallback(
    (vehicleId) => {
      const removedItem = selectedVehicles.find(
        (item) => item.vehicle.id === vehicleId
      );
      if (!removedItem) return;

      setSelectedVehicles((prev) =>
        prev.filter((item) => item.vehicle.id !== vehicleId)
      );

      if (didSearchVehicle) {
        setAvailableVehicles((prev) => {
          // Kiểm tra xem xe đã tồn tại trong danh sách availableVehicles chưa
          if (!prev.some((v) => v.id === vehicleId)) {
            const newList = [...prev, removedItem.vehicle];

            newList.sort((a, b) => a.name.localeCompare(b.name));
            return newList;
          }
          return prev;
        });
      }
    },
    [selectedVehicles, didSearchVehicle]
  );

  // Cập nhật ngày thuê cho xe đã chọn
  const handleVehicleDateChange = useCallback((vehicleId, field, value) => {
    setSelectedVehicles((prev) =>
      prev.map((item) => {
        if (item.vehicle.id === vehicleId) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      })
    );
  }, []);

  const handleContinueToCustomer = () => {
    // Kiểm tra dữ liệu hợp lệ
    let hasError = false;

    // Kiểm tra đã chọn xe chưa
    if (selectedVehicles.length === 0) {
      setError("Vui lòng chọn ít nhất một xe.");
      return;
    }

    // Kiểm tra từng xe có ngày bắt đầu và kết thúc hợp lệ không
    for (const vehicle of selectedVehicles) {
      if (!vehicle.startDate || !vehicle.endDate) {
        setError("Vui lòng chọn ngày bắt đầu và kết thúc cho từng xe.");
        hasError = true;
        break;
      }

      if (new Date(vehicle.startDate) >= new Date(vehicle.endDate)) {
        setError(
          `Xe ${vehicle.vehicle.name} có ngày bắt đầu phải trước ngày kết thúc.`
        );
        hasError = true;
        break;
      }
    }

    if (hasError) return;

    // Chuyển đến trang tìm khách hàng với thông tin xe đã chọn
    navigate("/rental/customerSearch", {
      state: {
        selectedVehicles: selectedVehicles,
        mode: "new",
      },
    });
  };
  const handleGoToBookingSearch = () => {
    navigate("/rental/contractSearch");
  };
  // Hàm hỗ trợ hiển thị ảnh xe
  const getThumbnailImage = (vehicle) => {
    if (vehicle.vehicleImages && vehicle.vehicleImages.length > 0) {
      const thumbnail = vehicle.vehicleImages.find((img) => img.isThumbnail);
      if (thumbnail && thumbnail.imageUri) {
        return (
          <img
            src={thumbnail.imageUri}
            alt={vehicle.name}
            className="w-full h-32 object-cover rounded mb-2"
          />
        );
      }
    }

    return (
      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center mb-2">
        <span className="text-gray-400 text-xs text-center">Không có ảnh</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Tìm kiếm xe</h1>
        <button
          onClick={handleGoToBookingSearch}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm text-center whitespace-nowrap" // Màu khác, thêm whitespace-nowrap
        >
          Tìm Đơn Đặt Online (Booking)
        </button>
      </div>

      <div className="p-4 border rounded shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Thông tin thuê xe</h2>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="startDate" className="block font-medium">
                Ngày bắt đầu:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchParams.startDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="endDate" className="block font-medium">
                Ngày kết thúc:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchParams.endDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                min={
                  searchParams.startDate ||
                  new Date().toISOString().split("T")[0]
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoadingVehicles}
            >
              {isLoadingVehicles ? "Đang tìm..." : "Tìm xe"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Danh sách xe đã chọn */}
        {selectedVehicles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Xe đã chọn</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedVehicles.map((item) => (
                <div
                  key={item.vehicle.id}
                  className="p-3 border rounded flex flex-col md:flex-row justify-between gap-3 bg-blue-50"
                >
                  <div className="md:w-32 mb-2 md:mb-0">
                    {getThumbnailImage(item.vehicle)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.vehicle.name}</div>
                    <div className="text-sm">
                      Biển số: {item.vehicle.licensePlate}
                    </div>
                    <div className="text-sm">
                      Giá thuê: {formatCurrency(item.vehicle.rentalPrice)}/ngày
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.conditionNotes}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor={`start-${item.vehicle.id}`}
                        className="block text-sm font-medium"
                      >
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        id={`start-${item.vehicle.id}`}
                        value={item.startDate}
                        onChange={(e) =>
                          handleVehicleDateChange(
                            item.vehicle.id,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`end-${item.vehicle.id}`}
                        className="block text-sm font-medium"
                      >
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        id={`end-${item.vehicle.id}`}
                        value={item.endDate}
                        onChange={(e) =>
                          handleVehicleDateChange(
                            item.vehicle.id,
                            "endDate",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded text-sm"
                        min={item.startDate}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveVehicleClick(item.vehicle.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 self-center"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleContinueToCustomer}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Tiếp tục - Chọn khách hàng
              </button>
            </div>
          </div>
        )}

        {/* Danh sách xe có sẵn */}
        {didSearchVehicle && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Xe có sẵn</h3>
            {isLoadingVehicles ? (
              <p className="text-gray-500">Đang tìm xe...</p>
            ) : availableVehicles.length === 0 ? (
              <p className="text-gray-500">
                Không tìm thấy xe phù hợp thêm trong khoảng thời gian này.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {availableVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="border rounded p-3 hover:bg-gray-50"
                  >
                    {getThumbnailImage(vehicle)}
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm mb-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          vehicle.ownerType === "STORE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {vehicle.ownerType === "STORE" ? "Cửa hàng" : "Đối tác"}
                      </span>
                      <span className="ml-2">{vehicle.type}</span>
                      <span className="ml-2">{vehicle.brand}</span>
                    </div>
                    <div className="text-sm">
                      Biển số: {vehicle.licensePlate}
                    </div>
                    <div className="text-sm">
                      Số chỗ: {vehicle.seatCount} chỗ
                    </div>
                    <div className="text-sm font-medium text-green-600 mb-2">
                      Giá thuê: {formatCurrency(vehicle.rentalPrice)}/ngày
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSelectVehicleClick(vehicle)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Chọn xe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
