
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCourses } from "@/contexts/CourseContext";
import { BookOpen, FileCheck, Settings, User, Users } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { currentUser } = useUser();
  const { courses, enrollments } = useCourses();

  if (!currentUser) return null;

  // Mock user data for admin view
  const mockUsers = [
    {
      id: "1",
      name: "Alex Student",
      email: "student@example.com",
      role: "student",
      status: "active",
      enrolledCourses: enrollments.filter(e => e.userId === "1").length,
      lastActive: "2025-04-10"
    },
    {
      id: "2",
      name: "Taylor Teacher",
      email: "instructor@example.com",
      role: "instructor",
      status: "active",
      createdCourses: courses.filter(c => c.instructorId === "2").length,
      lastActive: "2025-04-11"
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      lastActive: "2025-04-11"
    },
    {
      id: "4",
      name: "Jamie Student",
      email: "jamie@example.com",
      role: "student",
      status: "inactive",
      enrolledCourses: 0,
      lastActive: "2025-03-25"
    },
    {
      id: "5",
      name: "Sam Teacher",
      email: "sam@example.com",
      role: "instructor",
      status: "pending",
      createdCourses: 0,
      lastActive: "N/A"
    }
  ];

  return (
    <AppLayout requiredRole="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, courses, and system settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered in the platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => u.role === "student" && u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Learning on the platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Available on the platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enrollments
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">
                Active course enrollments
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View and manage all users in the system
                    </CardDescription>
                  </div>
                  <Button>Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "admin" 
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100" 
                                : user.role === "instructor" 
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.status === "active" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : user.status === "inactive" 
                                  ? "bg-gray-100 text-gray-800 hover:bg-gray-100" 
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === "student" ? (
                            <div>
                              <div className="text-sm font-medium">
                                {user.enrolledCourses} courses
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last active: {user.lastActive}
                              </div>
                            </div>
                          ) : user.role === "instructor" ? (
                            <div>
                              <div className="text-sm font-medium">
                                {user.createdCourses} courses
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last active: {user.lastActive}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Last active: {user.lastActive}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>
                      View and manage all courses in the system
                    </CardDescription>
                  </div>
                  <Button>Add Course</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Duration: {course.duration}
                          </div>
                        </TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>
                          {enrollments.filter(e => e.courseId === course.id).length}
                        </TableCell>
                        <TableCell>{course.modules.length}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure global system settings
                    </CardDescription>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <div className="font-medium">Platform Name</div>
                          <div className="text-sm text-muted-foreground">
                            Change the name of your learning platform
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Configure system email notifications
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3">
                        <div>
                          <div className="font-medium">Default User Settings</div>
                          <div className="text-sm text-muted-foreground">
                            Set default configuration for new users
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Course Settings</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div>
                          <div className="font-medium">Default Course Categories</div>
                          <div className="text-sm text-muted-foreground">
                            Manage course categorization
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3">
                        <div>
                          <div className="font-medium">Enrollment Settings</div>
                          <div className="text-sm text-muted-foreground">
                            Configure enrollment policies
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
