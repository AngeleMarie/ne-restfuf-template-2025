import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "/mylogo.svg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { axiosPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth"; 

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth(); // ← You forgot this!

  const menuItems = [
    { icon: <DashboardIcon />, text: "Dashboard", route: "/dashboard" },
    { icon: <SettingsIcon />, text: "Settings", route: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      // Notify backend to clear refresh token cookie (invalidate session)
      await axiosPrivate.post("/auth/logout", null, {
        withCredentials: true, // ← Important to send cookies!
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage + auth context
      localStorage.removeItem("accessToken");
      localStorage.removeItem("persist");
      setAuth({});

      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="bg-main-grey min-h-screen flex flex-col p-3 md:p-5 w-[70px] md:w-auto">
      <div className="flex items-center space-x-3 md:space-x-6 p-2 md:p-4">
        <img className="w-8 h-8 md:w-10 md:h-10" src={logo} alt="logo" />
        <span className="hidden md:block text-main-blue font-bold text-xl">
          Maglo
        </span>
      </div>

      <ul className="mt-8 flex-1 max-h-[80vh]">
        {menuItems.map((item, index) => (
          <li key={index} className={`${index !== 0 ? "mt-4 md:mt-8" : ""}`}>
            <Link
              to={item.route}
              className={`flex items-center gap-x-3 md:gap-x-8 p-2 rounded-md text-main-black/80 hover:bg-main-blue hover:text-white transition-all duration-200 w-full ${
                location.pathname === item.route
                  ? "bg-main-blue text-white"
                  : ""
              }`}
            >
              {item.icon}
              <span className="hidden md:block font-medium">{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="p-2 md:p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-x-3 md:gap-x-8 p-2 rounded-md text-red-600 hover:bg-red-100 transition-all duration-200 w-full"
        >
          <LogoutIcon />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
