
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video";
  url: string;
  moduleId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  moduleId: string;
  points: number;
}

export interface Module {
  id: string;
  title: string;
  resources: Resource[];
  assignments: Assignment[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  completedModules: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  thumbnail: string;
  duration: string;
  modules: Module[];
  enrollments: Enrollment[];
}

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  enrollInCourse: (userId: string, courseId: string) => void;
  getEnrolledCourses: (userId: string) => Course[];
  getCoursesByInstructor: (instructorId: string) => Course[];
  addResource: (instructorId: string, courseId: string, moduleId: string, resource: Omit<Resource, "id">) => void;
  updateProgress: (userId: string, courseId: string, progress: number, completedModuleId?: string) => void;
  toggleModuleCompletion: (userId: string, courseId: string, moduleId: string) => string | null; // Return potential badge ID or null
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Mock data for church-themed courses
const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Foundations of Faith: Old Testament Survey",
    description: "Explore the key narratives, figures, and theological themes of the Old Testament.",
    instructor: "Pastor John",
    instructorId: "i1",
    thumbnail: "/placeholder.svg", // Replace with actual image path if available
    duration: "8 weeks",
    modules: [
      {
        id: "c1m1",
        title: "Genesis: Beginnings",
        resources: [
          { id: "c1r1", title: "Creation Story Explained (Video)", type: "video", url: "#", moduleId: "c1m1" },
          { id: "c1r2", title: "Patriarchs Overview (PDF)", type: "pdf", url: "#", moduleId: "c1m1" },
        ],
        assignments: [
          { id: "c1a1", title: "Reflection on Creation", description: "Write a short reflection on the significance of the Genesis creation account.", dueDate: "2025-05-10", moduleId: "c1m1", points: 10 },
        ],
      },
      {
        id: "c1m2",
        title: "Exodus: Deliverance",
        resources: [
          { id: "c1r3", title: "The Ten Commandments (PDF)", type: "pdf", url: "#", moduleId: "c1m2" },
        ],
        assignments: [
          { id: "c1a2", title: "Moses' Leadership Quiz", description: "Answer multiple-choice questions about Moses' role.", dueDate: "2025-05-24", moduleId: "c1m2", points: 15 },
        ],
      },
    ],
    enrollments: [],
  },
  {
    id: "c2",
    title: "Life of Christ: New Testament Gospels",
    description: "Study the life, teachings, death, and resurrection of Jesus Christ as presented in the Gospels.",
    instructor: "Dr. Mary",
    instructorId: "i2",
    thumbnail: "/placeholder.svg", // Replace with actual image path if available
    duration: "10 weeks",
    modules: [
      {
        id: "c2m1",
        title: "Birth and Early Life",
        resources: [
          { id: "c2r1", title: "Nativity Narratives Compared (PDF)", type: "pdf", url: "#", moduleId: "c2m1" },
        ],
        assignments: [
          { id: "c2a1", title: "Gospel Harmony Exercise", description: "Compare the accounts of Jesus' birth in Matthew and Luke.", dueDate: "2025-06-05", moduleId: "c2m1", points: 20 },
        ],
      },
      {
        id: "c2m2",
        title: "Ministry and Miracles",
        resources: [
          { id: "c2r2", title: "Parables of Jesus (Video)", type: "video", url: "#", moduleId: "c2m2" },
          { id: "c2r3", title: "Understanding Miracles (PDF)", type: "pdf", url: "#", moduleId: "c2m2" },
        ],
        assignments: [
          { id: "c2a2", title: "Parable Analysis", description: "Choose one parable and explain its meaning and application.", dueDate: "2025-06-19", moduleId: "c2m2", points: 15 },
        ],
      },
    ],
    enrollments: [],
  },
  {
    id: "c3",
    title: "Spiritual Disciplines for Everyday Life",
    description: "Learn practical ways to cultivate your relationship with God through prayer, study, and service.",
    instructor: "Pastor John",
    instructorId: "i1",
    thumbnail: "/placeholder.svg", // Replace with actual image path if available
    duration: "6 weeks",
    modules: [
      {
        id: "c3m1",
        title: "The Discipline of Prayer",
        resources: [
          { id: "c3r1", title: "Models of Prayer (Video)", type: "video", url: "#", moduleId: "c3m1" },
          { id: "c3r2", title: "Prayer Journal Guide (PDF)", type: "pdf", url: "#", moduleId: "c3m1" },
        ],
        assignments: [
          { id: "c3a1", title: "Start a Prayer Journal", description: "Keep a prayer journal for one week and reflect on the experience.", dueDate: "2025-07-01", moduleId: "c3m1", points: 10 },
        ],
      },
    ],
    enrollments: [],
  },
];

// Mock data for initial enrollments (adjust if needed for new course IDs)
const mockEnrollments: Enrollment[] = [
  {
    id: "e1",
    userId: "1", // Assuming user '1' exists
    courseId: "c1", // Enroll user '1' in the first church-themed course
    enrollmentDate: "2025-04-10",
    progress: 0, // Start with 0 progress
    completedModules: []
  }
];

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);

  const enrollInCourse = (userId: string, courseId: string) => {
    // Check if already enrolled
    const existingEnrollment = enrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );

    if (existingEnrollment) return;

    const newEnrollment: Enrollment = {
      id: `e${enrollments.length + 1}`,
      userId,
      courseId,
      enrollmentDate: new Date().toISOString().split('T')[0],
      progress: 0,
      completedModules: []
    };

    setEnrollments([...enrollments, newEnrollment]);
  };

  const getEnrolledCourses = (userId: string): Course[] => {
    const userEnrollments = enrollments.filter((e) => e.userId === userId);
    return courses.filter((course) => 
      userEnrollments.some((enrollment) => enrollment.courseId === course.id)
    );
  };

  const getCoursesByInstructor = (instructorId: string): Course[] => {
    return courses.filter((course) => course.instructorId === instructorId);
  };

  const addResource = (
    instructorId: string,
    courseId: string,
    moduleId: string,
    resource: Omit<Resource, "id">
  ) => {
    setCourses(
      courses.map((course) => {
        if (course.id === courseId && course.instructorId === instructorId) {
          return {
            ...course,
            modules: course.modules.map((module) => {
              if (module.id === moduleId) {
                return {
                  ...module,
                  resources: [
                    ...module.resources,
                    { ...resource, id: `r${Date.now()}` }
                  ]
                };
              }
              return module;
            })
          };
        }
        return course;
      })
    );
  };

  const updateProgress = (
    userId: string,
    courseId: string,
    progress: number,
    completedModuleId?: string
  ) => {
    setEnrollments(
      enrollments.map((enrollment) => {
        if (enrollment.userId === userId && enrollment.courseId === courseId) {
          const completedModules = completedModuleId
            ? [...enrollment.completedModules, completedModuleId]
            : enrollment.completedModules;

          return {
            ...enrollment,
            progress,
            completedModules
          };
        }
        return enrollment;
      })
    );
  };

  const toggleModuleCompletion = (userId: string, courseId: string, moduleId: string): string | null => {
    let newlyEarnedCourseBadgeId: string | null = null; // Store ID of badge earned by completing the course

    setEnrollments(
      enrollments.map((enrollment) => {
        if (enrollment.userId === userId && enrollment.courseId === courseId) {
          const course = courses.find(c => c.id === courseId);
          if (!course) return enrollment;

          let updatedCompletedModules: string[];
          const isCurrentlyCompleted = enrollment.completedModules.includes(moduleId);

          if (isCurrentlyCompleted) {
            // Mark as incomplete
            updatedCompletedModules = enrollment.completedModules.filter(id => id !== moduleId);
          } else {
            // Mark as complete
            updatedCompletedModules = [...enrollment.completedModules, moduleId];
            // Check if this completion finishes the course
            if (updatedCompletedModules.length === course.modules.length && course.modules.length > 0) {
               // Award "Completed in Christ" badge (ID 'b3')
               newlyEarnedCourseBadgeId = 'b3';
               console.log(`Course "${course.title}" completed by user ${userId}! Award badge 'b3'.`);
               // In a real app, you'd call a function here to update the user's badge status persistently.
            }
          }

          const totalModules = course.modules.length;
          const newProgress = totalModules > 0
            ? Math.round((updatedCompletedModules.length / totalModules) * 100)
            : 0;

          return {
            ...enrollment,
            completedModules: updatedCompletedModules,
            progress: newProgress,
          };
        }
        return enrollment;
      })
    );

     // This state update happens asynchronously, so we return the badge ID directly
     // if it was determined within the synchronous part of the map.
     return newlyEarnedCourseBadgeId;
  };


  return (
    <CourseContext.Provider
      value={{
        courses,
        enrollments,
        enrollInCourse,
        getEnrolledCourses,
        getCoursesByInstructor,
        addResource,
        updateProgress,
        toggleModuleCompletion, // Updated function name
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
