import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const LayoutAdmin = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  console.log("Admin in HeaderAdmin:", user);
  useEffect(() => {
    const userType = user?.user.userType;
    if (!user) {
      navigate("/login");
    } else if (userType === "CUSTOMER") {
      alert("Bạn không có quyền truy cập vào trang này.");
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <div className="relative w-screen h-screen flex flex-col ">
        <Topbar
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex flex-1">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main
            className={`flex-1 mt-16 p-10 transition-all duration-300 ${
              isSidebarCollapsed ? "ml-20" : "ml-60"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
