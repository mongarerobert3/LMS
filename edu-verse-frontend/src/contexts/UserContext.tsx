
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  badges: Badge[]; // Add badges array
}

// --- Badge System ---
export interface Badge {
  id: string;
  title: string;
  description: string;
  message: string;
  icon: string; // Emoji or URL
  earned: boolean;
  dateEarned?: string;
}

// Mock Badge Data
const mockBadges: Badge[] = [
  { id: "b1", title: "Faithful Starter", description: "Completed your first module!", message: "✨ Well done! Every step forward is progress on your journey. Keep walking in truth!", icon: "🌱", earned: false },
  { id: "b2", title: "Weekly Walker", description: "Logged in 7 days in a row!", message: "🌟 Consistency is key! You've shown great dedication this week.", icon: "🚶", earned: false },
  { id: "b3", title: "Completed in Christ", description: "Finished your first course!", message: "📖 Hallelujah! You've unlocked new wisdom. 'I can do all things through Christ who strengthens me.' - Phil 4:13", icon: "🏆", earned: false },
  { id: "b4", title: "Prayer Partner", description: "Engaged in discussion forum 5 times.", message: "🙏 Fellowship strengthens faith. Thank you for encouraging others!", icon: "🤝", earned: false },
  { id: "b5", title: "Resource Explorer", description: "Viewed 10 different resources.", message: "💡 Seeking knowledge is a virtue. Keep exploring the riches of His word!", icon: "🗺️", earned: false },
  { id: "b6", title: "Assignment Achiever", description: "Submitted 3 assignments.", message: "✅ Diligence bears fruit! Your efforts are seen.", icon: "✍️", earned: false },
];
// --- End Badge System ---


interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  navigate: (path: string) => void;
}

export const UserProvider = ({ children, navigate }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock login functionality - in a real app, this would call an API
  const login = (email: string, password: string) => {
    setIsLoading(true);
    console.log("Login function called with email:", email, "and password:", password);
    
    // Simulate API call
    setTimeout(() => {
      let user: User | null = null;

      // Mock users for demo
      if (email === "student@example.com" && password === "password") {
        user = {
          id: "1",
          name: "Alex Student",
          email: "student@example.com",
          role: "student",
          avatar: "/placeholder.svg",
          // Assign some mock badges (can be dynamic later)
          badges: mockBadges.map((b, i) => ({ ...b, earned: i < 1 })) // Earn first badge for demo
        };
      } else if (email === "instructor@example.com" && password === "password") {
        user = {
          id: "2",
          name: "Taylor Teacher",
          email: "instructor@example.com",
          role: "instructor",
          avatar: "/placeholder.svg",
          badges: [] // Instructors might not earn student badges
        };
      } else if (email === "admin@example.com" && password === "password") {
        user = {
          id: "3",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          avatar: "/placeholder.svg",
          badges: [] // Admins might not earn student badges
        };
      }

      setCurrentUser(user);
      setIsLoading(false);

      console.log("User after login:", user);

      if (user) {
        switch (user.role) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "instructor":
            navigate("/instructor/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/"); // Redirect to login if role is unknown
        }
      }
    }, 1000);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
