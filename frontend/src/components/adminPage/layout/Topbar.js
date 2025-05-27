import { IoMdNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../store/userSlice";
import { useNavigate } from "react-router";
import { TiThMenu } from "react-icons/ti";
export const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isClickedUserIcon, setIsClickedUserIcon] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  function toggleDropdown() {
    setIsClickedUserIcon(!isClickedUserIcon);
  }
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  return (
    <>
      <div className="fixed top 0 bg-white shadow-md z-10 w-full ">
        <div className="flex items-center w-full justify-between px-4 py-2 h-16">
          <div className="flex items-center space-x-4">
            {/* Nút bật/tắt sidebar */}
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <TiThMenu className="w-6 h-6" />
            </button>
            <div className="text-lg font-bold text-black">Logo</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full ">
              <IoMdNotificationsOutline className="w-6 h-6" />
            </button>
            <div className="relative">
              <button
                className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                onClick={toggleDropdown}
              >
                <CiUser className="w-6 h-6" />
              </button>
              {isClickedUserIcon && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-2 px-4 text-gray-700">
                    👤 {user.user?.fullName || "Người dùng"}
                  </div>
                  <div className="py-2 px-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Cài đặt
                  </div>
                  <div
                    className="py-2 px-4 text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
