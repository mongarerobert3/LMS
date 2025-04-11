
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Assignment } from "@/contexts/CourseContext";

interface AssignmentItemProps {
  assignment: Assignment;
}

const AssignmentItem = ({ assignment }: AssignmentItemProps) => {
  // Function to check if assignment is due soon (within 3 days)
  const isDueSoon = () => {
    const today = new Date();
    const dueDate = new Date(assignment.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Function to check if assignment is overdue
  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(assignment.dueDate);
    return today > dueDate;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{assignment.title}</CardTitle>
          <span className="font-medium text-sm">
            {assignment.points} points
          </span>
        </div>
        <CardDescription className="text-sm">{assignment.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span 
            className={
              isOverdue() 
                ? "text-red-500 font-medium" 
                : isDueSoon() 
                  ? "text-orange-500 font-medium" 
                  : "text-gray-500"
            }
          >
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
            {isOverdue() && " (Overdue)"}
            {isDueSoon() && !isOverdue() && " (Due Soon)"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant={isOverdue() ? "destructive" : "default"}
        >
          {isOverdue() ? "Submit Late" : "Submit Assignment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssignmentItem;
