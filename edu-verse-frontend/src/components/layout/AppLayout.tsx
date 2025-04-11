import React, { useState } from "react"; // Import useState
import { useUser, Badge } from "@/contexts/UserContext"; // Import Badge type
import { Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";
import BibleCrosswordModal from "@/components/puzzle/BibleCrosswordModal";
import BadgeDisplayModal from "@/components/badges/BadgeDisplayModal"; // Import badge modal

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "student" | "instructor" | "admin" | Array<"student" | "instructor" | "admin">;
}

const AppLayout = ({ children, requiredRole }: AppLayoutProps) => {
  const { currentUser } = useUser();
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false); // State for badge modal
  const [earnedBadgeToShow, setEarnedBadgeToShow] = useState<Badge | null>(null); // State for badge data

  // Function to trigger the badge display modal
  const showBadgeModal = (badge: Badge) => {
     setEarnedBadgeToShow(badge);
     setIsBadgeModalOpen(true);
  }

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
    <> {/* Use Fragment to render modal alongside layout */}
      <div className="min-h-screen bg-lms-background flex w-full">
        {/* Pass function to open puzzle modal to sidebar */}
        <AppSidebar openPuzzleModal={() => setIsPuzzleModalOpen(true)} />
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      {/* Render the puzzle modal and pass the badge modal trigger */}
      <BibleCrosswordModal
        isOpen={isPuzzleModalOpen}
        onClose={() => setIsPuzzleModalOpen(false)}
        showBadgeModal={showBadgeModal} // Pass function down
      />
      {/* Render the badge modal */}
      <BadgeDisplayModal
        badge={earnedBadgeToShow}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </>
  );
};

export default AppLayout;
