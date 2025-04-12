// src/components/instructor/AssignmentList.tsx
import React from 'react';
import { Assignment } from '@/types/course';
import { FilePenLine } from 'lucide-react'; // Icon for assignments
import { Badge } from '@/components/ui/badge'; // To display points

interface AssignmentListProps {
  assignments: Assignment[];
  // Add functions for edit/delete later if needed
  // onEditAssignment: (assignmentId: string) => void;
  // onDeleteAssignment: (assignmentId: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return <p className="text-sm text-muted-foreground mt-2">No assignments added yet.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2 border-b pb-1">Assignments</h4>
      <ul className="list-none pl-0 space-y-1">
        {assignments.map(assignment => (
          <li key={assignment.id} className="flex items-center justify-between text-sm p-2 border rounded hover:bg-muted/50">
            <div className="flex items-center overflow-hidden mr-2">
              <FilePenLine className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
              <span className="truncate" title={assignment.title}>
                {assignment.title}
              </span>
            </div>
            <div className="flex items-center flex-shrink-0">
               <span className="text-xs text-muted-foreground mr-2">Due: {assignment.dueDate}</span>
               <Badge variant="secondary" className="mr-2">{assignment.points} pts</Badge>
               {/* Placeholder for Edit/Delete buttons */}
               {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0 mr-1"> E </Button> */}
               {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0"> D </Button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
