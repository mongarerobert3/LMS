
import React, { useState, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCourses } from "@/contexts/CourseContext"; // Import course context hook
import { Bell, Search, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const TopNavbar = () => {
  const { currentUser } = useUser();
  const { allCourses } = useCourses(); // Get all courses
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim() || !allCourses) {
      return [];
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(lowerCaseQuery) ||
      course.description?.toLowerCase().includes(lowerCaseQuery)
      // Add more fields to search if needed (e.g., instructor)
    );
  }, [searchQuery, allCourses]);

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger />
        {/* Search Popover */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="ml-4 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setIsPopoverOpen(true); // Open popover when typing starts
                  } else {
                    setIsPopoverOpen(false); // Close if input is empty
                  }
                }}
                onFocus={() => { if (searchQuery.trim()) setIsPopoverOpen(true); }} // Open on focus if there's text
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lms-purple focus:border-transparent w-[200px] md:w-[300px]"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] md:w-[364px] p-0" align="start">
            <Command shouldFilter={false}> {/* We do manual filtering */}
              <CommandInput placeholder="Type course name..." value={searchQuery} onValueChange={setSearchQuery} disabled /> {/* Input is handled above */}
              <CommandList>
                <CommandEmpty>{filteredCourses.length === 0 && searchQuery ? 'No courses found.' : 'Type to search courses.'}</CommandEmpty>
                {filteredCourses.length > 0 && (
                  <CommandGroup heading="Courses">
                    {filteredCourses.map((course) => (
                      <CommandItem
                        key={course.id}
                        value={course.title} // Value for potential Command filtering/selection
                        onSelect={() => {
                          navigate(`/student/courses/${course.id}`);
                          setIsPopoverOpen(false);
                          setSearchQuery(""); // Clear search after selection
                        }}
                        className="cursor-pointer"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{course.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <Link to="/student/settings" className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded-md">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;
