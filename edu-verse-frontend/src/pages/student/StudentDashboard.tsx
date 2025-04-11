
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useCourses } from "@/contexts/CourseContext";
import CourseCard from "@/components/courses/CourseCard";
import { Book, FileCheck, FileText, UserRound, Award } from "lucide-react"; // Import Award icon
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import BadgeListPanel from "@/components/badges/BadgeListPanel"; // Import BadgeListPanel
// import SermonCard from "@/components/dashboard/SermonCard"; // Remove SermonCard import

// --- Verse of the Day Feature ---
const inspirationalVerses = [
  "I can do all things through Christ who strengthens me. - Philippians 4:13",
  "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. - Jeremiah 29:11",
  "Trust in the Lord with all your heart, and do not lean on your own understanding. - Proverbs 3:5",
  "The Lord is my shepherd; I shall not want. - Psalm 23:1",
  "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go. - Joshua 1:9",
  "Commit your work to the Lord, and your plans will be established. - Proverbs 16:3",
];

const VERSE_ROTATION_INTERVAL = 180000; // 3 minutes in milliseconds
// --- End Verse of the Day Feature ---

const StudentDashboard = () => {
  const { currentUser } = useUser();
  const { courses, enrollments, getEnrolledCourses } = useCourses();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isBadgePanelOpen, setIsBadgePanelOpen] = useState(false); // State for panel visibility

  // --- Verse of the Day Logic ---
  useEffect(() => {
    // Set initial verse randomly
    setCurrentVerseIndex(Math.floor(Math.random() * inspirationalVerses.length));

    // Set interval for rotation
    const intervalId = setInterval(() => {
      setCurrentVerseIndex((prevIndex) => (prevIndex + 1) % inspirationalVerses.length);
    }, VERSE_ROTATION_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!currentUser) return null;

  const enrolledCourses = getEnrolledCourses(currentUser.id);
  const upcomingAssignments = enrolledCourses.flatMap(course =>
    course.modules.flatMap(module => 
      module.assignments.map(assignment => ({
        ...assignment,
        courseTitle: course.title
      }))
    )
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  .slice(0, 3);

  // Get the enrollment progress for each course
  const courseProgress = enrolledCourses.map(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === currentUser.id);
    return {
      courseId: course.id,
      title: course.title,
      progress: enrollment ? enrollment.progress : 0
    };
  });

  return (
    <AppLayout requiredRole="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name}!</h1>
          {/* Removed overview text */}
           {/* Verse of the Day Display */}
           <div className="mt-3"> {/* Added margin top for spacing */}
             <span className="text-xs uppercase tracking-wide text-yellow-700">Verse of the Day</span>
             <p className="text-sm text-muted-foreground italic mt-1">
               "{inspirationalVerses[currentVerseIndex]}"
             </p>
           </div>
        </div>

        {/* Responsive grid for stats cards - adjusted to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enrolled Courses
              </CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {enrolledCourses.length > 0 
                  ? "Continue your learning journey" 
                  : "Explore courses to enroll"}
              </p>
            </CardContent>
          </Card>

          {/* Badges Card - Added */}
          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setIsBadgePanelOpen(true)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Badges Earned
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentUser?.badges?.filter(b => b.earned).length ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                View your achievements
              </p>
            </CardContent>
          </Card>
          
          {/* Completed Modules Card Removed */}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Assignments
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingAssignments.length > 0 
                  ? "Due in the next few days" 
                  : "No pending assignments"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrolledCourses.length > 0
                  ? `${Math.round(
                      courseProgress.reduce((acc, course) => acc + course.progress, 0) / 
                      courseProgress.length
                    )}%`
                  : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-courses">
          <TabsList>
            <Link to="/student/dashboard?tab=my-courses"><TabsTrigger value="my-courses">My Courses</TabsTrigger></Link>
            <Link to="/student/dashboard?tab=assignments"><TabsTrigger value="assignments">Assignments</TabsTrigger></Link>
            <Link to="/student/dashboard?tab=explore"><TabsTrigger value="explore">Explore Courses</TabsTrigger></Link>
          </TabsList>
          
          <TabsContent value="my-courses" className="space-y-8"> {/* Increased spacing */}
            {/* Sermon Card Removed */}

            <h2 className="text-xl font-semibold mt-6">Course Progress</h2> {/* Added mt-6 back */}
            
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {courseProgress.map((course) => (
                  <Card key={course.courseId}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{course.title}</h3>
                        <span className="text-sm font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                  <p className="text-sm">Check out the "Explore Courses" tab to find courses to enroll in.</p>
                </CardContent>
              </Card>
            )}
            
            <h2 className="text-xl font-semibold mt-8">Enrolled Courses</h2>
            
            {enrolledCourses.length > 0 ? (
              /* Responsive grid for enrolled course cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} enrolled={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="assignments" className="space-y-4">
            <h2 className="text-xl font-semibold mt-6">Upcoming Assignments</h2>
            
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>{assignment.courseTitle}</CardDescription>
                        </div>
                        <div className="text-sm font-medium">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">You don't have any upcoming assignments.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="explore" className="space-y-4">
            <h2 className="text-xl font-semibold mt-6">Available Courses</h2>
            
            /* Responsive grid for available course cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses
                .filter(course =>
                  !enrollments.some(e => e.courseId === course.id && e.userId === currentUser.id)
                )
                .map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Render Badge Panel */}
      <BadgeListPanel
        badges={currentUser?.badges ?? []}
        isOpen={isBadgePanelOpen}
        onClose={() => setIsBadgePanelOpen(false)}
      />
    </AppLayout>
  );
};

export default StudentDashboard;
