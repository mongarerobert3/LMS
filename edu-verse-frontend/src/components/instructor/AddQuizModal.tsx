// src/components/instructor/AddQuizModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Quiz, Question } from '@/types/course'; // Import Quiz and Question types

// Define the type for the data passed back on submission
// Now includes the questions array
export type NewQuizData = Omit<Quiz, 'id'>;

interface AddQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuiz: (quizData: NewQuizData) => void;
  moduleId: string | null; // To know which module we're adding to
}

const AddQuizModal: React.FC<AddQuizModalProps> = ({ isOpen, onClose, onAddQuiz, moduleId }) => {
  const [title, setTitle] = useState('');
  // Removed questionCount state
  // We'll manage actual questions elsewhere for now
  const [error, setError] = useState('');

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      // Removed questionCount reset
      setError('');
    }
  }, [isOpen]);

  // Removed handleQuestionCountChange

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Quiz title cannot be empty.');
      return;
    }
    // Removed questionCount validation

    // Create quiz data with an empty questions array
    // Actual questions will be added/edited in a separate interface
    const quizData: NewQuizData = {
        title: title.trim(),
        questions: [], // Initialize with empty questions
    };

    onAddQuiz(quizData);
    // Parent component handles closing the modal
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Knowledge Check (Quiz)</DialogTitle>
          <DialogDescription>
            Fill in the details for the new quiz for this module.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quiz-title" className="text-right">
                Title
              </Label>
              <Input
                id="quiz-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Module 1 Check"
              />
            </div>

            {/* Question Count Input Removed */}
            {/* A more complex UI would be needed here to add questions directly */}
            <div className="grid grid-cols-4 items-center gap-4">
                 <p className="col-span-4 text-sm text-muted-foreground text-center">
                    (Questions can be added after creating the quiz)
                 </p>
            </div>


            {/* Error Message */}
            {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!moduleId}>Save Quiz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuizModal;
