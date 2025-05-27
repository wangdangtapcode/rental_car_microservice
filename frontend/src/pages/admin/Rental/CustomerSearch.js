import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleRight } from "react-icons/fa";

export const CustomerSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVehicles = location.state?.selectedVehicles || [];

  // --- State cho Tìm kiếm Khách hàng ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  // --- State cho Modal Thêm Khách hàng ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    status: "ACTIVE",
    userType: "CUSTOMER",
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [addError, setAddError] = useState("");
  //
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);
        try {
          const data = await findCustomersByName(searchTerm);
          setSearchResults(data);
        } catch (err) {
          setSearchError("Lỗi tìm kiếm khách hàng.");
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]); // Xóa kết quả nếu input rỗng
      }
    }, 500); // Chờ 500ms sau khi ngừng gõ

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout khi component unmount hoặc searchTerm thay đổi
  }, [searchTerm]);

  const findCustomersByName = async (name) => {
    if (!name) return [];

    try {
      const response = await axios.get(
        `http://localhost:8081/api/management/customer/search?fullName=${name}`
      );

      if (Array.isArray(response.data)) {
        console.log(response.data);
        return response.data;
      } else {
        console.error(`API Error: ${response.status}`);
        return [];
      }
    } catch (error) {
      //   setSearchError("Lỗi tìm kiếm khách hàng.");
      console.error("Error fetching customers:", error);
      return [];
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddError("");
    setNewCustomerData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      status: "ACTIVE",
      userType: "CUSTOMER",
    });
  };
  //
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };
  //
  const handleAddFormChange = (event) => {
    const { name, value } = event.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //
  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    setAddError("");
    setIsAddingCustomer(true);

    try {
      console.log(newCustomerData);
      const response = await axios.post(
        "http://localhost:8081/api/management/customer/add",
        newCustomerData
      );
      console.log(response.data);
      if (response.data) {
        alert("Thêm khách hàng thành công");
        setShowAddModal(false);
        // Nếu có xe đã chọn, chuyển đến trang tạo hợp đồng với khách hàng mới
        if (selectedVehicles.length > 0) {
          const draftState = {
            customer: response.data,
            selectedVehicles: selectedVehicles,
            mode: "new",
          };
          navigate("/rental/contract/draft", { state: draftState });
        }
      }
    } catch (err) {
      setAddError("Lỗi khi thêm khách hàng. Vui lòng thử lại.");
      console.error("Add customer error:", err);
    } finally {
      setIsAddingCustomer(false);
    }
  };
  //
  const handleSelectCustomer = (customer) => {
    console.log("Selected customer:", customer);

    // Nếu có xe đã chọn, chuyển đến trang tạo hợp đồng
    if (selectedVehicles.length > 0) {
      const draftState = {
        customer: customer,
        selectedVehicles: selectedVehicles,
        mode: "new",
      };
      navigate("/rental/contract/draft", { state: draftState });
    } else {
      // Nếu chưa chọn xe, chuyển đến trang chọn xe
      navigate(`/rental/vehicles/${customer.id}`, { state: { customer } });
    }
  };

  const handleBackToVehicleSearch = () => {
    navigate("/rental/vehicles", { state: { selectedVehicles } });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Khách hàng nhận xe/thuê xe tại chỗ
      </h1>

      {selectedVehicles.length > 0 && (
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">
                Đã chọn {selectedVehicles.length} xe
              </span>
              <button
                onClick={handleBackToVehicleSearch}
                className="ml-4 text-sm text-blue-600 hover:underline font-medium"
              >
                ← Quay lại chọn xe
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border rounded shadow-sm bg-white">
        <div className="flex justify-between items-center gap-4 m-5">
          <h2 className="text-xl font-semibold mb-3">
            Tìm Khách Hàng(Thuê tại chỗ)
          </h2>
          <div className="flex gap-3">
            {" "}
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm text-center whitespace-nowrap" // Thêm whitespace-nowrap
            >
              + Thêm Khách Hàng Mới
            </button>
          </div>
        </div>

        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isSearching && <p className="text-gray-500">Đang tìm kiếm...</p>}
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

        {!isSearching && searchTerm.trim() && searchResults.length === 0 && (
          <div className="mt-3 text-center text-gray-600">
            <p>Không tìm thấy khách hàng nào khớp với "{searchTerm}".</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-3 max-h-80 overflow-y-auto border rounded">
            <ul className="divide-y">
              {searchResults.map((customer) => (
                <li
                  key={customer.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div>
                    <p className="font-medium">{customer.user.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {customer.user.phoneNumber} - {customer.user.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.user.address}
                    </p>
                  </div>
                  <FaAngleRight className="h-5 w-5 text-blue-500" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal Thêm Khách Hàng Mới */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Thêm Khách Hàng Mới</h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={newCustomerData.fullName}
                    onChange={handleAddFormChange}
                    required
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newCustomerData.email}
                    onChange={handleAddFormChange}
                    required
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newCustomerData.password}
                    onChange={handleAddFormChange}
                    required
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newCustomerData.phoneNumber}
                    onChange={handleAddFormChange}
                    required
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newCustomerData.address}
                    onChange={handleAddFormChange}
                    required
                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              {addError && <p className="text-red-500 mt-3">{addError}</p>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={isAddingCustomer}
                >
                  {isAddingCustomer ? "Đang thêm..." : "Thêm khách hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
