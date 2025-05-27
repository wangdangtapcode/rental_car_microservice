import { Link } from "react-router-dom";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export const Sidebar = ({ isCollapsed }) => {
  const [isStaticsDropdown, setIsStaticsDropdown] = useState(false);
  const [isManagementDropdown, setIsManagementDropdown] = useState(false);
  const sidebarWidth = isCollapsed ? "w-20" : "w-60";
  const toggleDropdownStatics = (e) => {
    console.log("clicked");
    e.preventDefault();
    setIsStaticsDropdown(!isStaticsDropdown);
  };
  const toggleDropdownManagement = (e) => {
    console.log("clicked");
    e.preventDefault();
    setIsManagementDropdown(!isManagementDropdown);
  };
  return (
    <>
      <div
        className={`fixed top-16 left-0 bg-gray-800 ${sidebarWidth} h-[calc(100vh-4rem)] text-white transition-all duration-300`}
      >
        <div className="p-4">
          {!isCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                {!isCollapsed && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                to="/rental/vehicles"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                {!isCollapsed && "Rental"}
              </Link>
            </li>
            <li>
              <Link
                to="/completedRental"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                {!isCollapsed && "Complete Rental"}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/management/vehicle"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                {!isCollapsed && "Complete Rental"}
              </Link>
            </li>
            <li>
              <div
                className="flex justify-between items-center hover:bg-gray-700 cursor-pointer"
                onClick={toggleDropdownManagement}
              >
                <div className=" px-4 py-2 text-md">
                  {!isCollapsed && "Management"}
                </div>
                {!isCollapsed && (
                  <RiArrowDropDownLine className="w-8 h-8 mr-2" />
                )}
              </div>
              {!isCollapsed && isManagementDropdown && (
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      to="/admin/management/vehicle"
                      className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Vehicle Management
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
