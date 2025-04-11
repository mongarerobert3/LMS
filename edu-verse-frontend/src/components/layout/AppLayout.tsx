
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "student" | "instructor" | "admin" | Array<"student" | "instructor" | "admin">;
}

const AppLayout = ({ children, requiredRole }: AppLayoutProps) => {
  const { currentUser } = useUser();

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required, check if the user has that role
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!requiredRoles.includes(currentUser.role)) {
      // Redirect based on user's role
      switch (currentUser.role) {
        case "student":
          return <Navigate to="/student/dashboard" replace />;
        case "instructor":
          return <Navigate to="/instructor/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return (
    <div className="min-h-screen bg-lms-background flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
