
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Pin, PinOff } from "lucide-react"; // Import Pin icons
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useCourses, Course } from "@/contexts/CourseContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
}

const CourseCard = ({ course, enrolled = false }: CourseCardProps) => {
  const navigate = useNavigate();
  const { currentUser, setPinnedCourse } = useUser(); // Get setPinnedCourse
  const { enrollInCourse } = useCourses();
  const isPinned = currentUser?.pinnedCourseId === course.id;

  const handleEnroll = () => {
    if (!currentUser) return;
    enrollInCourse(currentUser.id, course.id);
  };

  const handleViewCourse = () => {
    navigate(`/student/courses/${course.id}`);
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!currentUser) return;
    setPinnedCourse(currentUser.id, isPinned ? null : course.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 relative"> {/* Added relative positioning */}
       {/* Pin Button - Only show if enrolled */}
       {enrolled && currentUser && (
         <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white rounded-full"
                  onClick={handlePinToggle}
                >
                  {isPinned ? (
                    <PinOff className="h-4 w-4 text-lms-purple" />
                  ) : (
                    <Pin className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">{isPinned ? "Unpin Course" : "Pin Course"}</span>
                </Button>
             </TooltipTrigger>
             <TooltipContent>
               <p>{isPinned ? "Unpin Course" : "Pin Course"}</p>
             </TooltipContent>
           </Tooltip>
         </TooltipProvider>
       )}

      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
         {/* Pinned Indicator */}
         {isPinned && (
            <div className="absolute bottom-0 left-0 right-0 bg-lms-purple/80 text-white text-xs font-bold text-center py-0.5">
                PINNED
            </div>
         )}
      </div>
      <CardHeader className="pb-2 pt-4"> {/* Adjusted padding */}
        <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {course.modules.length} Modules
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {course.modules.reduce((acc, module) => acc + module.resources.length, 0)} Resources
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        {enrolled ? (
          <Button 
            onClick={handleViewCourse} 
            className="w-full bg-lms-blue hover:bg-lms-blue/90"
          >
            Continue Learning
          </Button>
        ) : (
          <Button 
            onClick={handleEnroll} 
            className="w-full bg-lms-purple hover:bg-lms-purple/90"
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
