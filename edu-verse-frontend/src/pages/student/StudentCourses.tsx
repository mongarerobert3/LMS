
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCourses } from "@/contexts/CourseContext";
import CourseCard from "@/components/courses/CourseCard";
import { Card, CardContent } from "@/components/ui/card";

const StudentCourses = () => {
  const { currentUser } = useUser();
  const { courses, getEnrolledCourses } = useCourses();

  if (!currentUser) return null;

  const enrolledCourses = getEnrolledCourses(currentUser.id);
  const availableCourses = courses.filter(
    (course) => !enrolledCourses.some((ec) => ec.id === course.id)
  );

  return (
    <AppLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage your enrolled courses and discover new learning opportunities.
          </p>
        </div>

        <Tabs defaultValue="enrolled" className="space-y-4">
          <TabsList>
            <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="available">Available Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="space-y-4">
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} enrolled={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500 mb-2">You haven't enrolled in any courses yet.</p>
                  <p className="text-sm">Check out the available courses tab to find courses to enroll in.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            {availableCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">You've enrolled in all available courses!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StudentCourses;
