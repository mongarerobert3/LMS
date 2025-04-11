// src/components/instructor/AddAssignmentModal.tsx
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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select
import { Assignment } from '@/types/course'; // Import Assignment type

// Define the type for the data passed back on submission
export type NewAssignmentData = Omit<Assignment, 'id'>;

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAssignment: (assignmentData: NewAssignmentData) => void;
  moduleId: string | null; // To know which module we're adding to
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, onAddAssignment, moduleId }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Assignment['type']>('text'); // Default to text
  const [prompt, setPrompt] = useState(''); // For text type
  const [file, setFile] = useState<File | null>(null); // For file type
  const [dueDate, setDueDate] = useState(''); // Keep as string for input type="date"
  const [points, setPoints] = useState<number | '' >(''); // Allow empty string for input
  const [error, setError] = useState('');

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setType('text');
      setPrompt('');
      setFile(null);
      setDueDate('');
      setPoints('');
      setError('');
    }
  }, [isOpen]);

  const handleTypeChange = (value: string) => {
    const newType = value as Assignment['type'];
    setType(newType);
    // Reset other fields when type changes
    setPrompt('');
    setFile(null);
    setError('');
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setPrompt(''); // Clear prompt if file is selected
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or positive integers
    if (value === '' || /^[0-9]\d*$/.test(value)) {
       setPoints(value === '' ? '' : parseInt(value, 10));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Assignment title cannot be empty.');
      return;
    }
    if (!dueDate) {
        setError('Due date must be selected.');
        return;
    }
    if (points === '' || points < 0) {
        setError('Points must be a non-negative number.');
        return;
    }

    let assignmentData: NewAssignmentData;

    if (type === 'text') {
        if (!prompt.trim()) {
            setError('Assignment prompt cannot be empty for text type.');
            return;
        }
        assignmentData = {
            title: title.trim(),
            type,
            prompt: prompt.trim(),
            dueDate,
            points: Number(points),
        };
    } else if (type === 'file') {
        if (!file) {
            setError('Please select a file for file type assignment.');
            return;
        }
        // In a real app, handle file upload here and get back a filePath
        console.log('Simulating file upload for assignment:', file.name);
        assignmentData = {
            title: title.trim(),
            type,
            filePath: `assignments/${moduleId}/${file.name}`, // Placeholder path
            dueDate,
            points: Number(points),
        };
    } else {
        setError('Invalid assignment type.'); // Should not happen
        return;
    }


    onAddAssignment(assignmentData);
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
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogDescription>
            Fill in the details for the new assignment for this module.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-title" className="text-right">
                Title
              </Label>
              <Input
                id="assign-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Chapter 1 Homework"
              />
            </div>

             {/* Type */}
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-type" className="text-right">
                Type
              </Label>
              <Select onValueChange={handleTypeChange} value={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Prompt</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prompt (for text type) */}
            {type === 'text' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assign-prompt" className="text-right">
                        Prompt
                    </Label>
                    <Textarea
                        id="assign-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter assignment instructions or questions here..."
                        rows={4}
                    />
                </div>
            )}

            {/* File Input (for file type) */}
            {type === 'file' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assign-file" className="text-right">
                        File
                    </Label>
                    <Input
                        id="assign-file"
                        type="file"
                        onChange={handleFileChange}
                        className="col-span-3"
                    />
                </div>
            )}
            {/* Display selected file name */}
            {file && type === 'file' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3 text-sm text-muted-foreground">
                        Selected: {file.name}
                    </div>
                </div>
             )}


            {/* Due Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-due-date" className="text-right">
                Due Date
              </Label>
              <Input
                id="assign-due-date"
                type="date" // Use date input type
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Points */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assign-points" className="text-right">
                Points
              </Label>
              <Input
                id="assign-points"
                type="number" // Use number input type
                min="0" // Set minimum value
                value={points}
                onChange={handlePointsChange}
                className="col-span-3"
                placeholder="e.g., 100"
              />
            </div>

            {/* Error Message */}
            {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!moduleId}>Save Assignment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentModal;
