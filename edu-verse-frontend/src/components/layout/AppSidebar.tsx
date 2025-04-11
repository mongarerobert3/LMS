
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger // Import SidebarTrigger
} from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpen, 
  FileText, 
  Home, 
  LogOut, 
  Settings, 
  UserPlus, 
  Users, 
  Video 
} from "lucide-react";

const AppSidebar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    switch (currentUser.role) {
      case "student":
        return [
          { title: "Dashboard", icon: Home, path: "/student/dashboard" },
          { title: "My Courses", icon: BookOpen, path: "/student/courses" },
          { title: "Sunday Sermon", icon: Video, path: "#" }, // Added Sermon link
        ];
      case "instructor":
        return [
          { title: "Dashboard", icon: Home, path: "/instructor/dashboard" },
          { title: "My Courses", icon: BookOpen, path: "/instructor/courses" },
          { title: "Student Progress", icon: BarChart3, path: "/instructor/students" },
        ];
      case "admin":
        return [
          { title: "Dashboard", icon: Home, path: "/admin/dashboard" },
          { title: "Manage Users", icon: Users, path: "/admin/users" },
          { title: "Manage Courses", icon: BookOpen, path: "/admin/courses" },
          { title: "Settings", icon: Settings, path: "/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarContent>
        {/* Header with Title and Collapse Trigger */}
        <div className="flex items-center justify-between p-4 mb-4 border-b">
           <h1 className="text-xl font-bold text-lms-purple">EduVerse</h1>
           {/* Add the trigger button */}
           <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? "bg-sidebar-accent" : ""}
                  >
                    <button 
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center"
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center text-red-500"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
