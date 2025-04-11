// src/types/course.ts

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'video'; // Example types
  url?: string; // For links or video URLs
  filePath?: string; // For uploaded files
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string; // Or Date object
  points: number;
  type: 'file' | 'text'; // Type of assignment
  prompt?: string; // For text-based assignments
  filePath?: string; // For file upload assignments (stores path after upload)
}

// Define structure for Quiz Questions
export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    text: string;
    options: QuestionOption[];
    // Could add question type (multiple choice, true/false) later
}

export interface Quiz {
  id: string;
  title: string;
  // questionCount: number; // Replaced by questions array length
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  // Potentially add instructorId, studentIds etc. later
}

// You might also want a type for the data passed to handleAddModule
export type NewModuleData = Omit<Module, 'id' | 'resources' | 'assignments' | 'quizzes'>;
