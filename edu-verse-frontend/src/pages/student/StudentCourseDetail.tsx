
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useCourses, Module } from "@/contexts/CourseContext"; // Import Module type
// import ModuleAccordion from "@/components/courses/ModuleAccordion"; // Remove ModuleAccordion import
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { CheckCircle } from "lucide-react"; // Import CheckCircle icon

const StudentCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { courses, enrollments } = useCourses();
  // const [selectedModule, setSelectedModule] = useState(null); // Remove selectedModule state

  if (!currentUser || !courseId) return null;

  const course = courses.find((c) => c.id === courseId);
  
  if (!course) {
    return (
      <AppLayout requiredRole="student">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate("/student/courses")}>
            Back to Courses
          </Button>
        </div>
      </AppLayout>
    );
  }

  const enrollment = enrollments.find(
    (e) => e.courseId === courseId && e.userId === currentUser.id
  );

  if (!enrollment) {
    return (
      <AppLayout requiredRole="student">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Not Enrolled</h2>
          <p className="text-gray-500 mb-4">You're not enrolled in this course.</p>
          <Button onClick={() => navigate("/student/courses")}>
            Back to Courses
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requiredRole="student">
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/courses")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Course Progress</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="font-medium">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2 mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Completed Modules</p>
                    <p className="text-xl font-bold">{enrollment.completedModules.length} / {course.modules.length}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Resources</p>
                    <p className="text-xl font-bold">
                      {course.modules.reduce((acc, module) => acc + module.resources.length, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Assignments</p>
                    <p className="text-xl font-bold">
                      {course.modules.reduce((acc, module) => acc + module.assignments.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
              {course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((module: Module) => {
                    const isCompleted = enrollment.completedModules.includes(module.id);
                    return (
                      <Link
                        key={module.id}
                        to={`/student/courses/${courseId}/modules/${module.id}`}
                        className="block"
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex items-center justify-between">
                            <span className="font-medium">{module.title}</span>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No modules available for this course.</p>
              )}
            </div>
          </div>

          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
                  <p>{course.instructor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p>{course.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Enrolled On</h3>
                  <p>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Modules</h3>
                  <p>{course.modules.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentCourseDetail;
