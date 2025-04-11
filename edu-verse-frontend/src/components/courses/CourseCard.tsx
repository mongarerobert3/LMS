
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useCourses, Course } from "@/contexts/CourseContext";

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
}

const CourseCard = ({ course, enrolled = false }: CourseCardProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { enrollInCourse } = useCourses();

  const handleEnroll = () => {
    if (!currentUser) return;
    enrollInCourse(currentUser.id, course.id);
  };

  const handleViewCourse = () => {
    navigate(`/student/courses/${course.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.thumbnail || "/placeholder.svg"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
        </div>
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
