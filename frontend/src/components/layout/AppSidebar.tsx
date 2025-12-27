import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  BarChart3,
  Settings,
  Activity,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: Upload, label: "Upload Scan", path: "/upload" },
  { icon: Eye, label: "Explainability", path: "/explainability" },
  { icon: History, label: "Scan History", path: "/history" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user?.fullName) return 'User';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0]} ${names[names.length - 1]}`;
    }
    return names[0];
  };

  const getRoleDisplay = () => {
    if (!user?.role) return 'User';
    const roleMap: Record<string, string> = {
      radiologist: 'Radiologist',
      physician: 'Physician',
      researcher: 'Medical Researcher',
      admin: 'Hospital Admin',
    };
    return roleMap[user.role] || 'User';
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold whitespace-nowrap">
              <span className="text-sidebar-foreground">Med</span>
              <span className="text-primary">Vision</span>
            </span>
          )}
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
            {getUserInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">{getRoleDisplay()}</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            className="w-full mt-3 justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
