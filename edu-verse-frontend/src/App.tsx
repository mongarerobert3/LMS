import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { useNavigate } from "react-router-dom";

// Page imports
import Login from "./pages/Login";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import StudentModuleView from "./pages/student/StudentModuleView";
import StudentSettings from "./pages/student/StudentSettings"; // Import Settings page

// Instructor pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses"; // Added import
import InstructorCourseDetail from "./pages/instructor/InstructorCourseDetail";
import InstructorProgress from "./pages/instructor/InstructorProgress";
import InstructorResources from "./pages/instructor/InstructorResources";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const navigate = useNavigate();

  return (
    <UserProvider navigate={navigate}>
      <CourseProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/courses/:id" element={<StudentCourseDetail />} />
            <Route path="/student/modules/:id" element={<StudentModuleView />} />
            <Route path="/student/settings" element={<StudentSettings />} />

            {/* Instructor routes */}
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCourses />} />
            <Route path="/instructor/courses/:id" element={<InstructorCourseDetail />} />
            <Route path="/instructor/progress" element={<InstructorProgress />} />
            <Route path="/instructor/resources" element={<InstructorResources />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Redirect any other routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SidebarProvider>
      </CourseProvider>
    </UserProvider>
  );
};

export default App;
