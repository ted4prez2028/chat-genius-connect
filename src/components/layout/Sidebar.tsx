
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Store,
  Settings,
  FileText,
  UserCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "DASHBOARD", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "MANAGE ACCOUNTS", path: "/dashboard/accounts", icon: <Users className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "CHAT SUPPORT", path: "/dashboard/chat", icon: <MessageSquare className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "CALENDAR VIEW", path: "/dashboard/calendar", icon: <Calendar className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "MANAGE BRANDS", path: "/dashboard/brands", icon: <Store className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "CONFIGURATIONS", path: "/dashboard/settings", icon: <Settings className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "EVENT LOGS", path: "/dashboard/logs", icon: <FileText className="w-5 h-5 mr-2 text-white/70" /> },
    { name: "USER PROFILE", path: "/dashboard/profile", icon: <UserCircle className="w-5 h-5 mr-2 text-white/70" /> },
  ];

  return (
    <div className="w-64 bg-[#1a1a1a] text-white h-screen flex flex-col fixed">
      <div className="p-6 border-b border-gray-800">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors text-white hover:text-brand-yellow",
                isActive(item.path) ? "text-brand-yellow border-l-4 border-brand-yellow pl-5" : ""
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center px-6 py-3 text-sm font-medium text-white hover:text-brand-yellow transition-colors w-full"
        >
          <LogOut className="w-5 h-5 mr-2" />
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
