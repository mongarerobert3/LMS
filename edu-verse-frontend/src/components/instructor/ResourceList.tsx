// src/components/instructor/ResourceList.tsx
import React from 'react';
import { Resource } from '@/contexts/CourseContext'; // Use the context's Resource type
import { FileText, Link as LinkIcon, Video } from 'lucide-react'; // Icons for different types

interface ResourceListProps {
  resources: Resource[];
  // Add functions for edit/delete later if needed
  // onEditResource: (resourceId: string) => void;
  // onDeleteResource: (resourceId: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return <p className="text-sm text-muted-foreground mt-2">No resources added yet.</p>;
  }

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
      case 'link':
        return <LinkIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />;
      case 'video':
        return <Video className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2 border-b pb-1">Resources</h4>
      <ul className="list-none pl-0 space-y-1">
        {resources.map(resource => (
          <li key={resource.id} className="flex items-center justify-between text-sm p-2 border rounded hover:bg-muted/50">
            <div className="flex items-center overflow-hidden mr-2">
              {getIcon(resource.type)}
              {resource.type === 'link' || resource.type === 'video' ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                  title={resource.url} // Show full URL on hover
                >
                  {resource.title}
                </a>
              ) : (
                <span className="truncate" title={resource.filePath}>
                  {resource.title} {resource.filePath ? `(${resource.filePath.split(/[\\/]/).pop()})` : ''}
                  {/* TODO: Add download link/handler for files */}
                </span>
              )}
            </div>
            {/* Placeholder for Edit/Delete buttons */}
            {/* <div className="flex-shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 mr-1"> E </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"> D </Button>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
