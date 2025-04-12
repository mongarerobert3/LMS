
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "file" | "link";
  url?: string;
  filePath?: string;
  moduleId: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  type: 'file' | 'text';
  prompt?: string;
  filePath?: string;
  moduleId: string;
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

export interface Module {
  id: string;
  title: string;
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
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

interface Student {
  id: string;
  name: string;
  email: string;
  lastActivity?: string;
  completedModules: string[];
}

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  enrollInCourse: (userId: string, courseId: string) => void;
  getEnrolledCourses: (userId: string) => Course[];
  getCoursesByInstructor: (instructorId: string) => Course[];
  getCourseStudents: (courseId: string) => Student[];
  addResource: (instructorId: string, courseId: string, moduleId: string, resource: Omit<Resource, "id">) => void;
  addQuiz: (instructorId: string, courseId: string, moduleId: string, quiz: Omit<Quiz, "id">) => void;
  updateProgress: (userId: string, courseId: string, progress: number, completedModuleId?: string) => void;
  toggleModuleCompletion: (userId: string, courseId: string, moduleId: string) => string | null; // Return potential badge ID or null
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites.",
    instructor: "Taylor Teacher",
    instructorId: "2",
    thumbnail: "/placeholder.svg",
    duration: "8 weeks",
    modules: [
      {
        id: "m1",
        title: "HTML Fundamentals",
        resources: [
          {
            id: "r1",
            title: "HTML Basics PDF",
            type: "pdf",
            url: "#",
            moduleId: "m1"
          },
          {
            id: "r2",
            title: "Introduction to Tags",
            type: "video",
            url: "#",
            moduleId: "m1"
          }
        ],
        assignments: [
          {
            id: "a1",
            title: "Create a Simple Webpage",
            description: "Build a simple webpage with at least 5 different HTML elements.",
            dueDate: "2025-05-01",
            moduleId: "m1",
            points: 10,
            type: 'file'
          }
        ],
        quizzes: []
      },
      {
        id: "m2",
        title: "CSS Styling",
        resources: [
          {
            id: "r3",
            title: "CSS Selectors Guide",
            type: "pdf",
            url: "#",
            moduleId: "m2"
          }
        ],
        assignments: [
          {
            id: "a2",
            title: "Style Your Webpage",
            description: "Add CSS styling to your HTML webpage from the previous assignment.",
            dueDate: "2025-05-15",
            moduleId: "m2",
            points: 15,
            type: 'file'
          }
        ],
        quizzes: []
      }
    ],
    enrollments: []
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Dive deep into JavaScript with advanced concepts and frameworks.",
    instructor: "Taylor Teacher",
    instructorId: "2",
    thumbnail: "/placeholder.svg",
    duration: "10 weeks",
    modules: [
      {
        id: "m3",
        title: "ES6 Features",
        resources: [
          {
            id: "r4",
            title: "Modern JavaScript Guide",
            type: "pdf",
            url: "#",
            moduleId: "m3"
          }
        ],
        assignments: [
          {
            id: "a3",
            title: "ES6 Conversion Project",
            description: "Convert an existing JavaScript codebase to use ES6 features.",
            dueDate: "2025-06-01",
            moduleId: "m3",
            points: 20,
            type: 'file'
          }
        ],
        quizzes: []
      }
    ],
    enrollments: []
  },
  {
    id: "3",
    title: "React Fundamentals",
    description: "Learn the fundamentals of building applications with React.",
    instructor: "Taylor Teacher",
    instructorId: "2",
    thumbnail: "/placeholder.svg",
    duration: "6 weeks",
    modules: [
      {
        id: "m4",
        title: "React Basics",
        resources: [
          {
            id: "r5",
            title: "Introduction to React",
            type: "video",
            url: "#",
            moduleId: "m4"
          }
        ],
        assignments: [
          {
            id: "a4",
            title: "Create a React Component",
            description: "Build a reusable React component with props and state.",
            dueDate: "2025-06-15",
            moduleId: "m4",
            points: 15,
            type: 'file'
          }
        ],
        quizzes: []
      }
    ],
    enrollments: []
  }
];

// Mock data for initial enrollments
const mockEnrollments: Enrollment[] = [
  {
    id: "e1",
    userId: "1",
    courseId: "1",
    enrollmentDate: "2025-04-01",
    progress: 25,
    completedModules: ["m1"]
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


  return (
    <CourseContext.Provider
      value={{
        courses,
        enrollments,
        enrollInCourse,
        getEnrolledCourses,
        getCoursesByInstructor,
        getCourseStudents,
        addResource,

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

