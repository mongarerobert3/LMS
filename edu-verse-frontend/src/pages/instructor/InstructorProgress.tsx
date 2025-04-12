import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StudentProgressTable from '@/components/instructor/StudentProgressTable';

const InstructorProgress: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {courseId && <StudentProgressTable courseId={courseId} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProgress;
