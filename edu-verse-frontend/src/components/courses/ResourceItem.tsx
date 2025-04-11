
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Video } from "lucide-react";
import { Resource } from "@/contexts/CourseContext";

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem = ({ resource }: ResourceItemProps) => {
  const handleResourceClick = () => {
    // In a real app, this might open a modal or a new page
    window.open(resource.url, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
      <div className="flex items-center">
        {resource.type === "pdf" ? (
          <FileText className="h-5 w-5 text-red-500 mr-3" />
        ) : (
          <Video className="h-5 w-5 text-blue-500 mr-3" />
        )}
        <div>
          <p className="font-medium">{resource.title}</p>
          <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleResourceClick}
      >
        View
      </Button>
    </div>
  );
};

export default ResourceItem;
