
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as coursesApi from "../api/courses";

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
  loading: boolean;
  error: string | null;
  enrollInCourse: (userId: string, courseId: string) => Promise<void>;
  getEnrolledCourses: (userId: string) => Course[];
  getCoursesByInstructor: (instructorId: string) => Promise<Course[]>;
  addResource: (instructorId: string, courseId: string, moduleId: string, resource: Omit<Resource, "id">) => Promise<void>;
  updateProgress: (userId: string, courseId: string, progress: number, completedModuleId?: string) => Promise<void>;
  toggleModuleCompletion: (userId: string, courseId: string, moduleId: string) => Promise<string | null>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);


export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesApi.getCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const enrollInCourse = async (userId: string, courseId: string) => {
    try {
      // Check if already enrolled
      const existingEnrollment = enrollments.find(
        (e) => e.userId === userId && e.courseId === courseId
      );

      if (existingEnrollment) return;

      // In a real app, you would call an API endpoint to enroll
      const newEnrollment: Enrollment = {
        id: `e${enrollments.length + 1}`,
        userId,
        courseId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        progress: 0,
        completedModules: []
      };

      setEnrollments([...enrollments, newEnrollment]);
    } catch (err) {
      setError('Failed to enroll in course');
    }
  };

  const getEnrolledCourses = (userId: string): Course[] => {
    const userEnrollments = enrollments.filter((e) => e.userId === userId);
    return courses.filter((course) => 
      userEnrollments.some((enrollment) => enrollment.courseId === course.id)
    );
  };

  const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
    try {
      const data = await coursesApi.getCoursesByInstructor(instructorId);
      return data;
    } catch (err) {
      setError('Failed to fetch instructor courses');
      return [];
    }
  };

  const addResource = async (
    instructorId: string,
    courseId: string,
    moduleId: string,
    resource: Omit<Resource, "id">
  ) => {
    try {
      const updatedCourse = await coursesApi.addModule(courseId, {
        ...resource,
        id: `r${Date.now()}`
      });
      
      setCourses(courses.map(c => 
        c.id === courseId ? updatedCourse : c
      ));
    } catch (err) {
      setError('Failed to add resource');
    }
  };

  const updateProgress = async (
    userId: string,
    courseId: string,
    progress: number,
    completedModuleId?: string
  ) => {
    try {
      // In a real app, you would call an API endpoint to update progress
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
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  const toggleModuleCompletion = async (userId: string, courseId: string, moduleId: string): Promise<string | null> => {
    try {
      let newlyEarnedCourseBadgeId: string | null = null;

      // In a real app, you would call an API endpoint to update module completion
      setEnrollments(
        enrollments.map((enrollment) => {
          if (enrollment.userId === userId && enrollment.courseId === courseId) {
            const course = courses.find(c => c.id === courseId);
            if (!course) return enrollment;

            let updatedCompletedModules: string[];
            const isCurrentlyCompleted = enrollment.completedModules.includes(moduleId);

            if (isCurrentlyCompleted) {
              updatedCompletedModules = enrollment.completedModules.filter(id => id !== moduleId);
            } else {
              updatedCompletedModules = [...enrollment.completedModules, moduleId];
              if (updatedCompletedModules.length === course.modules.length && course.modules.length > 0) {
                newlyEarnedCourseBadgeId = 'b3';
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

      return newlyEarnedCourseBadgeId;
    } catch (err) {
      setError('Failed to toggle module completion');
      return null;
    }
  };


  return (
    <CourseContext.Provider
      value={{
        courses,
        enrollments,
        loading,
        error,
        enrollInCourse,
        getEnrolledCourses,
        getCoursesByInstructor,
        addResource,
        updateProgress,
        toggleModuleCompletion,
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
