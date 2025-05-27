import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
export const VehicleManagement = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const [vehicleList, setVehicleList] = useState([]);
  const fetchSearchVehicle = async () => {
    try {
      const response = await axios.get(
        searchKey
          ? `http://localhost:8081/api/management/vehicle/search?name=${searchKey}`
          : "http://localhost:8081/api/management/vehicle/search/all"
      );
      console.log(response.data);
      setVehicleList(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const deleteCustomer = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá Xe này không?");
    if (!confirm) return;
    try {
      const reponse = await axios.delete(
        `http://localhost:8081/api/management/vehicle/del/${id}`
      );

      if (reponse.data === true) {
        alert("Xóa Xe thành công");
        setVehicleList((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Xóa Xe thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl text-center font-bold mb-10">Quản lý Ô tô</h1>
        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex  items-center w-1/2">
            <input
              value={searchKey}
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Tìm kiếm xe"
              className="border border-gray-300 rounded-lg px-4 py-2 w-2/3"
            />
            <button
              onClick={() => {
                fetchSearchVehicle();
              }}
              className="bg-blue-500 text-white border border-gray-300 px-4 py-2 rounded-lg mx-2"
            >
              Tìm
            </button>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            <Link to="/admin/management/vehicle/add">Thêm xe</Link>
          </button>
        </div>
        <div className="overflow-x-auto mt-10">
          <table className="border border-gray-300 w-full text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className=" px-4 py-2">Mã xe</th>
                <th className=" px-4 py-2">Ảnh chính</th>
                <th className=" px-4 py-2">Hãng</th>
                <th className=" px-4 py-2">Tên</th>
                <th className=" px-4 py-2">Loại</th>
                <th className=" px-4 py-2">Năm sản xuất</th>
                <th className=" px-4 py-2">Biển số xe</th>
                <th className=" px-4 py-2">Giá thuê (Ngày)</th>
                <th className=" px-4 py-2">Chủ sở hữu</th>
                <th className=" px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vehicleList.map((vehicle) => (
                <tr
                  onClick={() =>
                    navigate(`/admin/management/vehicle/detail/${vehicle.id}`, {
                      state: { vehicle },
                    })
                  }
                  className="hover:bg-gray-100 text-center divide-x divide-gray-300 cursor-pointer"
                >
                  <td className="px-4 py-2">{vehicle.id}</td>
                  <td className="px-4 py-2">
                    {vehicle.vehicleImages &&
                    vehicle.vehicleImages.length > 0 ? (
                      (() => {
                        const thumbnail = vehicle.vehicleImages.find(
                          (img) => img.isThumbnail
                        );
                        return (
                          thumbnail &&
                          thumbnail.imageUri && (
                            <img
                              src={thumbnail.imageUri}
                              alt={vehicle.name}
                              className="w-20 h-20 object-cover"
                            />
                          )
                        );
                      })()
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          Không có ảnh chính
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{vehicle.brand}</td>
                  <td className="px-4 py-2">{vehicle.name}</td>
                  <td className="px-4 py-2">{vehicle.type}</td>
                  <td className="px-4 py-2">{vehicle.manufactureYear}</td>
                  <td className="px-4 py-2">{vehicle.licensePlate}</td>
                  <td className="px-4 py-2">{vehicle.rentalPrice}</td>
                  <td className="px-4 py-2">{vehicle.ownerType}</td>
                  <td className="px-4 py-2 flex items-center justify-center space-x-2">
                    <FaRegEdit
                      className=" text-yellow-500 cursor-pointer text-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/admin/management/vehicle/edit/${vehicle.id}`,
                          {
                            state: { vehicle },
                          }
                        );
                      }}
                    />
                    <AiOutlineDelete
                      className=" text-red-500 cursor-pointer text-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomer(vehicle.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
