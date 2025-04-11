import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCourses } from "@/contexts/CourseContext";
import { BookOpen, FileUp, Users, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const InstructorDashboard = () => {
  const { currentUser } = useUser();
  const { courses, enrollments, getCoursesByInstructor } = useCourses();

  if (!currentUser) return null;

  const instructorCourses = getCoursesByInstructor(currentUser.id);
  
  // Calculate total students across all instructor's courses
  const totalStudents = enrollments
    .filter(enrollment => 
      instructorCourses.some(course => course.id === enrollment.courseId)
    )
    .reduce((acc, enrollment) => {
      if (!acc.includes(enrollment.userId)) {
        acc.push(enrollment.userId);
      }
      return acc;
    }, [] as string[])
    .length;

  // Calculate total resources across all instructor's courses
  const totalResources = instructorCourses.reduce(
    (acc, course) => acc + course.modules.reduce(
      (moduleAcc, module) => moduleAcc + module.resources.length, 0
    ), 0
  );

  // Calculate average progress across all enrollments in instructor's courses
  const avgProgress = enrollments
    .filter(enrollment => 
      instructorCourses.some(course => course.id === enrollment.courseId)
    )
    .reduce((acc, enrollment, index, array) => 
      acc + enrollment.progress / array.length, 0
    );

  // Enhanced chart data
  const chartData = instructorCourses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    const avgCourseProgress = courseEnrollments.length 
      ? courseEnrollments.reduce((acc, e) => acc + e.progress, 0) / courseEnrollments.length
      : 0;
    
    const moduleCompletion = course.modules.map(module => {
      const completedCount = enrollments
        .filter(e => e.courseId === course.id)
        .filter(e => e.completedModules.includes(module.id))
        .length;
      return {
        name: module.title,
        value: completedCount
      };
    });

    return {
      name: course.title,
      students: courseEnrollments.length,
      avgProgress: Math.round(avgCourseProgress),
      moduleCompletion
    };
  });

  // Calculate completion trends (last 7 days)
  const completionTrends = instructorCourses.map(course => {
    const dailyProgress = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString(),
        progress: Math.floor(Math.random() * 20) // Mock data - replace with real data
      };
    });
    return {
      courseId: course.id,
      courseTitle: course.title,
      data: dailyProgress
    };
  });

  return (
    <AppLayout requiredRole="instructor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your courses, students, and teaching resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {instructorCourses.length === 1 ? "Course" : "Courses"} created by you
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled across your courses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resources
              </CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResources}</div>
              <p className="text-xs text-muted-foreground">
                PDFs and videos in your courses
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="course-stats">
          <TabsList>
            <TabsTrigger value="course-stats">Course Statistics</TabsTrigger>
            <TabsTrigger value="student-progress">Student Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="course-stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>
                  Enrollment and completion rates per course
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <BarChart 
                  data={chartData}
                  index="name"
                  categories={["students", "avgProgress"]}
                  colors={["primary", "secondary"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={48}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {instructorCourses.map((course) => {
                const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                const avgCourseProgress = courseEnrollments.length 
                  ? courseEnrollments.reduce((acc, e) => acc + e.progress, 0) / courseEnrollments.length
                  : 0;
                
                return (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{course.title}</CardTitle>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {courseEnrollments.length} {courseEnrollments.length === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                      <CardDescription className="line-clamp-1">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Average Progress
                            </span>
                            <span>{Math.round(avgCourseProgress)}%</span>
                          </div>
                          <Progress value={avgCourseProgress} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>Modules: {course.modules.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileUp className="h-4 w-4" />
                            <span>Resources: {course.modules.reduce((acc, m) => acc + m.resources.length, 0)}</span>
                          </div>
                        </div>
                        
                        <Link to={`/instructor/courses/${course.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                          >
                            View Course Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="student-progress" className="space-y-4">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  Average completion across all your courses: {Math.round(avgProgress)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={avgProgress} className="h-2 mb-6" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {instructorCourses.map(course => {
                    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                    
                    return (
                      <div key={course.id}>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {course.title}
                        </h3>
                        
                        {courseEnrollments.length > 0 ? (
                          courseEnrollments.map(enrollment => {
                            const studentName = enrollment.userId === "1" ? "Alex Student" : `Student ${enrollment.userId}`;
                            
                            return (
                              <Card key={enrollment.id} className="mb-2">
                                <CardContent className="py-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="font-medium">{studentName}</div>
                                    <div className="text-sm">{enrollment.progress}%</div>
                                  </div>
                                  <Progress value={enrollment.progress} className="h-1.5" />
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Last active: {new Date().toLocaleDateString()}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">No students enrolled yet</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default InstructorDashboard;
