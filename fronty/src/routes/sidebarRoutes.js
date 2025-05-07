
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import StoreIcon from "@mui/icons-material/Store";

export const sidebarRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
    roles: ["admin"],  
  },
  {
    name: "Store",
    path: "/store",
    icon: StoreIcon,
    roles: ["client"], 
  },
  {
    name: "Settings",
    path: "/settings",
    icon: SettingsIcon,
    roles: ["admin", "client"],
  },
];
