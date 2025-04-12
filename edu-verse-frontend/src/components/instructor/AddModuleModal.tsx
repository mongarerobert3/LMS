// src/components/instructor/AddModuleModal.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // We might not use DialogTrigger directly if opened programmatically
  DialogClose, // To close the dialog
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (moduleData: { title: string }) => void; // Pass only necessary data
}

const AddModuleModal: React.FC<AddModuleModalProps> = ({ isOpen, onClose, onAddModule }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Module title cannot be empty.');
      return;
    }
    setError('');
    onAddModule({ title });
    setTitle(''); // Reset title after adding
    // onClose(); // The parent component will close it via the state update
  };

  // Handle programmatic opening/closing via the 'open' prop
  // We also need an onOpenChange handler to sync state if the user closes it via overlay click or Esc key
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose(); // Call the parent's close handler
      setTitle(''); // Reset form on close
      setError('');
    }
    // We don't need to handle the 'open === true' case as the parent controls opening
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogTrigger is usually used for user-initiated opening,
          but here we control it via the 'isOpen' prop */}
      {/* <DialogTrigger asChild>
        <Button variant="outline">Add Module</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>
            Enter the title for the new module. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Introduction to React"
              />
            </div>
            {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            {/* DialogClose can be used for a simple cancel button */}
            <DialogClose asChild>
               <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Module</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModuleModal;
