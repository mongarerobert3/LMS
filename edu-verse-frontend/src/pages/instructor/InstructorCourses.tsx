import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AppLayout from '@/components/layout/AppLayout';
import { useUser } from '@/contexts/UserContext';
import { useCourses, Course } from '@/contexts/CourseContext';
import CourseCard from '@/components/courses/CourseCard';

const InstructorCourses: React.FC = () => {
  const { currentUser } = useUser();
  const { getCoursesByInstructor } = useCourses(); // Get function from context
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]); // State for courses
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // Simulate fetching or directly get courses
      const courses = getCoursesByInstructor(currentUser.id); 
      setAssignedCourses(courses);
      setLoading(false);
    }
  }, [currentUser, getCoursesByInstructor]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Assigned Courses</h1>
        
        {loading && <p>Loading courses...</p>}
        
        {!loading && assignedCourses.length === 0 && (
          <p>You are not currently assigned to any courses.</p>
        )}

        {!loading && assignedCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedCourses.map(course => (
              <Link key={course.id} to={`/instructor/courses/${course.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
                <CourseCard course={course} /> 
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InstructorCourses;
