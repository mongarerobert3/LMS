import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddModuleModal from '@/components/instructor/AddModuleModal';
import AddResourceModal, { NewResourceData } from '@/components/instructor/AddResourceModal';
import AddAssignmentModal, { NewAssignmentData } from '@/components/instructor/AddAssignmentModal';
import AddQuizModal, { NewQuizData } from '@/components/instructor/AddQuizModal';
import { Course, Module, NewModuleData, Resource, Assignment, Quiz } from '@/types/course';
import ResourceList from '@/components/instructor/ResourceList';
import AssignmentList from '@/components/instructor/AssignmentList';
import QuizList from '@/components/instructor/QuizList';
import ModuleAccordion from '@/components/courses/ModuleAccordion';
import StudentProgressTable from '@/components/instructor/StudentProgressTable';

// Mock data structure - replace with actual API call
const mockCourse: Course = {
  id: '1',
  title: 'Introduction to Web Development',
  description: 'Learn the fundamentals of HTML, CSS, and JavaScript.',
  modules: [
    { id: 'm1', title: 'Module 1: HTML Basics', resources: [], assignments: [], quizzes: [] },
    { id: 'm2', title: 'Module 2: CSS Fundamentals', resources: [], assignments: [], quizzes: [] },
  ],
};

const InstructorCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false); // State for resource modal
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false); // State for assignment modal
  const [showAddQuizModal, setShowAddQuizModal] = useState(false); // State for quiz modal
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null); // State for target module ID

  useEffect(() => {
    // TODO: Replace with actual API call to fetch course details by courseId
    console.log(`Fetching course details for ID: ${courseId}`);
    // Simulate API call
    setTimeout(() => {
      // Find the course - in a real app, the API would handle this
      if (courseId === mockCourse.id) {
        setCourse(mockCourse);
      } else {
        // Handle course not found
        setCourse(null); // Or redirect, show error message
      }
      setLoading(false);
    }, 500);
  }, [courseId]);

  const handleAddModule = (newModuleData: NewModuleData) => { // Use imported type
    // TODO: Implement API call to add module
    console.log('Adding module:', newModuleData);
    // Update state locally (optimistic update or after API success)
    if (course) {
        const newModule: Module = {
            ...newModuleData,
            id: `m${Date.now()}`, // Temporary ID generation
            resources: [],
            assignments: [],
            quizzes: [],
        };
        setCourse({ ...course, modules: [...course.modules, newModule] });
    }
    setShowAddModuleModal(false);
  };

  // Handler to open the Add Resource modal
  const openAddResourceModal = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setShowAddResourceModal(true);
  };

  // Handler to add the resource to the specific module
  const handleAddResource = (newResourceData: NewResourceData) => {
    // TODO: Implement API call to add resource to the specific module
    console.log(`Adding resource to module ${currentModuleId}:`, newResourceData);
    if (course && currentModuleId) {
      const updatedModules = course.modules.map(module => {
        if (module.id === currentModuleId) {
          const newResource: Resource = {
            ...newResourceData,
            id: `r${Date.now()}`, // Temporary ID generation
          };
          return { ...module, resources: [...module.resources, newResource] };
        }
        return module;
      });
      setCourse({ ...course, modules: updatedModules });
    }
    setShowAddResourceModal(false); // Close modal
    setCurrentModuleId(null); // Reset current module ID
  };

  // Handler to open the Add Assignment modal
  const openAddAssignmentModal = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setShowAddAssignmentModal(true);
  };

  // Handler to add the assignment to the specific module
  const handleAddAssignment = (newAssignmentData: NewAssignmentData) => {
    // TODO: Implement API call to add assignment
    console.log(`Adding assignment to module ${currentModuleId}:`, newAssignmentData);
    if (course && currentModuleId) {
      const updatedModules = course.modules.map(module => {
        if (module.id === currentModuleId) {
          const newAssignment: Assignment = {
            ...newAssignmentData,
            id: `a${Date.now()}`, // Temporary ID generation
          };
          return { ...module, assignments: [...module.assignments, newAssignment] };
        }
        return module;
      });
      setCourse({ ...course, modules: updatedModules });
    }
    setShowAddAssignmentModal(false); // Close modal
    setCurrentModuleId(null); // Reset current module ID
  };

  // Handler to open the Add Quiz modal
  const openAddQuizModal = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setShowAddQuizModal(true);
  };

   // Handler to add the quiz to the specific module
   const handleAddQuiz = (newQuizData: NewQuizData) => {
    // TODO: Implement API call to add quiz
    console.log(`Adding quiz to module ${currentModuleId}:`, newQuizData);
    if (course && currentModuleId) {
      const updatedModules = course.modules.map(module => {
        if (module.id === currentModuleId) {
          const newQuiz: Quiz = {
            ...newQuizData,
            id: `q${Date.now()}`, // Temporary ID generation
          };
          return { ...module, quizzes: [...module.quizzes, newQuiz] };
        }
        return module;
      });
      setCourse({ ...course, modules: updatedModules });
    }
    setShowAddQuizModal(false); // Close modal
    setCurrentModuleId(null); // Reset current module ID
  };


  if (loading) {
    return <div>Loading course details...</div>; // Replace with Skeleton loader
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.description}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Modules</h2>
        <Button onClick={() => setShowAddModuleModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </div>

      {course.modules.length > 0 ? (
        <ModuleAccordion 
          modules={course.modules}
          onAddResource={openAddResourceModal}
          onAddAssignment={openAddAssignmentModal}
          onAddQuiz={openAddQuizModal}
        />
      ) : (
        <p>No modules added yet.</p>
      )}

      {/* Student Progress Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentProgressTable courseId={courseId} />
        </CardContent>
      </Card>

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={showAddModuleModal}
        onClose={() => setShowAddModuleModal(false)}
        onAddModule={handleAddModule}
      />

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={showAddResourceModal}
        onClose={() => {
          setShowAddResourceModal(false);
          setCurrentModuleId(null); // Reset module ID on close
        }}
        onAddResource={handleAddResource}
        moduleId={currentModuleId}
      />

      {/* Add Assignment Modal */}
      <AddAssignmentModal
        isOpen={showAddAssignmentModal}
        onClose={() => {
            setShowAddAssignmentModal(false);
            setCurrentModuleId(null); // Reset module ID on close
        }}
        onAddAssignment={handleAddAssignment}
        moduleId={currentModuleId}
      />

      {/* Add Quiz Modal */}
      <AddQuizModal
        isOpen={showAddQuizModal}
        onClose={() => {
            setShowAddQuizModal(false);
            setCurrentModuleId(null); // Reset module ID on close
        }}
        onAddQuiz={handleAddQuiz}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default InstructorCourseDetail;
