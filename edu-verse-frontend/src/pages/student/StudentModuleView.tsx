import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Video, CheckCircle } from "lucide-react";
import { useUser, Badge } from "@/contexts/UserContext"; // Correctly import Badge from UserContext
import { useCourses } from "@/contexts/CourseContext";
import { Module, Resource, Assignment } from "@/contexts/CourseContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AssignmentItem from "@/components/courses/AssignmentItem";
import { useToast } from "@/hooks/use-toast";
import BadgeDisplayModal from "@/components/badges/BadgeDisplayModal";

const StudentModuleView = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { currentUser, setLastAccessedCourse } = useUser(); // Get setLastAccessedCourse
  const { courses, enrollments, toggleModuleCompletion } = useCourses();
  const { toast } = useToast();
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [earnedBadgeToShow, setEarnedBadgeToShow] = useState<Badge | null>(null);

  const course = courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const enrollment = enrollments.find(e => e.userId === currentUser?.id && e.courseId === courseId);
  // Calculate completion status *after* ensuring enrollment exists
  const isModuleCompleted = enrollment?.completedModules.includes(moduleId ?? '') ?? false;

  // Effect to set the initial resource view
  useEffect(() => {
    if (module?.resources && module.resources.length > 0) {
      setCurrentResource(module.resources[0]);
    } else {
      setCurrentResource(null);
    }
  }, [module]);

  // Effect to set the last accessed course
  useEffect(() => {
    if (currentUser && courseId) {
      setLastAccessedCourse(currentUser.id, courseId);
    }
  }, [currentUser, courseId, setLastAccessedCourse]);

  // Guard clauses must come after hooks
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!course || !module) {
    return (
      <AppLayout requiredRole="student">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Module not found</h2>
          <p className="text-gray-500 mb-4">The module you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/student/courses/${courseId}`)}>
            Back to Course
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Ensure enrollment exists before proceeding (though AppLayout might handle this)
   if (!enrollment) {
     // Or redirect to course page / show an error
     return (
       <AppLayout requiredRole="student">
         <div className="text-center py-10">
           <h2 className="text-xl font-semibold mb-2">Enrollment not found</h2>
           <p className="text-gray-500 mb-4">Could not find your enrollment for this course.</p>
           <Button onClick={() => navigate(`/student/courses/${courseId}`)}>
             Back to Course
           </Button>
         </div>
       </AppLayout>
     );
   }


  const handleToggleComplete = () => {
    if (currentUser && courseId && moduleId && enrollment) {
      const wasFirstCompletion = !isModuleCompleted && enrollment.completedModules.length === 0;
      const earnedCourseBadgeId = toggleModuleCompletion(currentUser.id, courseId, moduleId);

      let badgeIdToShow: string | null = null;

      if (earnedCourseBadgeId) {
        badgeIdToShow = earnedCourseBadgeId;
      } else if (wasFirstCompletion) {
        badgeIdToShow = 'b1'; // "Faithful Starter"
      }

      if (!isModuleCompleted) {
         toast({
           title: "✨ Module Complete!",
           description: `Well done, disciple of faith! You've completed ${module?.title}. Keep walking in truth!`,
           variant: "default",
         });
      }

      if (badgeIdToShow) {
        const badgeData = currentUser.badges.find(b => b.id === badgeIdToShow);
        if (badgeData) {
          const badgeToShow = { ...badgeData, earned: true, dateEarned: new Date().toISOString() };
          setEarnedBadgeToShow(badgeToShow);
          setIsBadgeModalOpen(true);
          // TODO: Persist earned status
        }
      }
    }
  };

  const renderResourceContent = () => {
    if (!currentResource) {
      return <div className="flex items-center justify-center h-[450px] bg-gray-100 rounded-md"><p>Select a resource to view.</p></div>;
    }
    if (currentResource.url.endsWith('.pdf')) {
      return (
        <div className="border rounded-md overflow-hidden h-[600px]">
          <iframe src={currentResource.url} width="100%" height="100%" title={currentResource.title}></iframe>
        </div>
      );
    } else if (currentResource.url.includes('youtube.com') || currentResource.url.includes('youtu.be')) {
      const videoId = currentResource.url.split('v=')[1]?.split('&')[0] || currentResource.url.split('/').pop();
      return (
        <AspectRatio ratio={16 / 9} className="bg-muted border rounded-md overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={currentResource.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </AspectRatio>
      );
    } else {
      return (
         <div className="flex flex-col items-center justify-center h-[450px] bg-gray-100 rounded-md">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="mb-2 text-center">Cannot preview this resource type.</p>
            <a href={currentResource.url} target="_blank" rel="noopener noreferrer" className="text-lms-blue hover:underline">
              Open Resource: {currentResource.title}
            </a>
         </div>
      );
    }
  };

  return (
    <AppLayout requiredRole="student">
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/student/courses/${courseId}`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course: {course.title}
        </Button>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{module.title}</h1>
          <Button onClick={handleToggleComplete}>
            {isModuleCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Mark Incomplete
              </>
            ) : (
              "Mark as Complete"
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4 space-y-6">
             {renderResourceContent()}
            <Card>
                <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg bg-gray-50 text-center text-gray-500">
                        Discussion Forum (Coming Soon)
                    </div>
                </CardContent>
            </Card>
          </div>

          <div className="md:w-1/4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Module Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {module.resources.length > 0 ? (
                  module.resources.map((resource) => (
                    <Button
                      key={resource.id}
                      variant={currentResource?.id === resource.id ? "secondary" : "ghost"}
                      onClick={() => setCurrentResource(resource)}
                      className="w-full justify-start"
                    >
                      {resource.url.includes('youtube') || resource.url.includes('video') ? (
                        <Video className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {resource.title}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No resources for this module.</p>
                )}
              </CardContent>
            </Card>

            {module.assignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {module.assignments.map((assignment: Assignment) => (
                    <AssignmentItem key={assignment.id} assignment={assignment} />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <BadgeDisplayModal
        badge={earnedBadgeToShow}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </AppLayout>
  );
};

export default StudentModuleView;
