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
  const [type, setType] = useState<Resource['type']>('link'); // Default type
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  // Reset form when modal opens or closes, or when moduleId changes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setType('link');
      setUrl('');
      setFile(null);
      setError('');
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUrl(''); // Clear URL if file is selected
    }
  };

  const handleTypeChange = (value: string) => {
      const newType = value as Resource['type'];
      setType(newType);
      // Reset other fields when type changes
      setUrl('');
      setFile(null);
      setError('');
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Resource title cannot be empty.');
      return;
    }

    let resourceData: NewResourceData;

    if (type === 'link' || type === 'video') {
      if (!url.trim()) {
        setError(`URL cannot be empty for type '${type}'.`);
        return;
      }
      // Basic URL validation (can be improved)
      try {
        new URL(url);
      } catch (_) {
        setError('Please enter a valid URL (e.g., https://example.com).');
        return;
      }
      resourceData = { title: title.trim(), type, url: url.trim() };
    } else if (type === 'file') {
      if (!file) {
        setError('Please select a file.');
        return;
      }
      // In a real app, you'd handle file upload here and get back a filePath or URL
      console.log('Simulating file upload for:', file.name);
      resourceData = { title: title.trim(), type, filePath: `uploads/${moduleId}/${file.name}` }; // Placeholder path
    } else {
      setError('Invalid resource type selected.'); // Should not happen
      return;
    }

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
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL Input (for Link/Video) */}
            {(type === 'link' || type === 'video') && (
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
                  placeholder={type === 'link' ? "https://example.com" : "https://youtube.com/watch?v=..."}
                />
              </div>
            )}

            {/* File Input (for File) */}
            {type === 'file' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="res-file" className="text-right">
                  File
                </Label>
                <Input
                  id="res-file"
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
