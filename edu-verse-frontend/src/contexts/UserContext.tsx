
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

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
          avatar: "/placeholder.svg"
        };
      } else if (email === "instructor@example.com" && password === "password") {
        user = {
          id: "2",
          name: "Taylor Teacher",
          email: "instructor@example.com",
          role: "instructor",
          avatar: "/placeholder.svg"
        };
      } else if (email === "admin@example.com" && password === "password") {
        user = {
          id: "3",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          avatar: "/placeholder.svg"
        };
      }

      setCurrentUser(user);
      setIsLoading(false);

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
