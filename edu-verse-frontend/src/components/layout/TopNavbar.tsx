
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopNavbar = () => {
  const { currentUser } = useUser();

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger />
        <div className="ml-4 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lms-purple focus:border-transparent w-[200px] md:w-[300px]"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
