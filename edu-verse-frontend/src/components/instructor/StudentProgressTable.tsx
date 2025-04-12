import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/contexts/CourseContext';

interface StudentProgressTableProps {
  courseId: string;
}

const StudentProgressTable: React.FC<StudentProgressTableProps> = ({ courseId }) => {
  const { getCourseStudents } = useCourses();
  const students = getCourseStudents(courseId);

  const calculateProgress = (completedModules: string[], totalModules: number) => {
    return Math.round((completedModules.length / totalModules) * 100);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Completed Modules</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.lastActivity || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={calculateProgress(student.completedModules, 4)} 
                    className="w-[200px]"
                  />
                  <span>{calculateProgress(student.completedModules, 4)}%</span>
                </div>
              </TableCell>
              <TableCell>{student.completedModules.length}/4</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentProgressTable;
