// src/components/instructor/AddResourceModal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Resource } from '@/types/course'; // Import Resource type

// Define the type for the data passed back on submission
export type NewResourceData = Omit<Resource, 'id'>;

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resourceData: NewResourceData) => void;
  moduleId: string | null; // To know which module we're adding to
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onAddResource, moduleId }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Resource['type']>('pdf'); // Default type
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setType('pdf');
      setUrl('');
      setError('');
    }
  }, [isOpen]);

  const handleTypeChange = (value: string) => {
      const newType = value as Resource['type'];
      setType(newType);
      setUrl('');
      setError('');
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Resource title cannot be empty.');
      return;
    }

    if (!url.trim()) {
      setError('URL cannot be empty.');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    if (!moduleId) {
      setError('Module ID is missing');
      return;
    }

    const resourceData: NewResourceData = { 
      title: title.trim(), 
      type, 
      url: url.trim(),
      moduleId 
    };

    onAddResource(resourceData);
    // Parent component handles closing the modal
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]"> {/* Increased width slightly */}
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            Fill in the details for the new resource for this module.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="res-title" className="text-right">
                Title
              </Label>
              <Input
                id="res-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., React Docs Link"
              />
            </div>

            {/* Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="res-type" className="text-right">
                Type
              </Label>
              <Select onValueChange={handleTypeChange} value={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="res-url" className="text-right">
                URL
              </Label>
              <Input
                id="res-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                placeholder={type === 'video' ? "https://youtube.com/watch?v=..." : "https://example.com/document.pdf"}
              />
            </div>

            {/* Error Message */}
            {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!moduleId}>Save Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceModal;
