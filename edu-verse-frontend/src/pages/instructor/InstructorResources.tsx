
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Pencil, Plus, Trash, Upload, Video } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useCourses, Resource } from "@/contexts/CourseContext";
import { useToast } from "@/hooks/use-toast";

const InstructorResources = () => {
  const { currentUser } = useUser();
  const { courses, getCoursesByInstructor, addResource } = useCourses();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"pdf" | "video">("pdf");
  const [url, setUrl] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  if (!currentUser) return null;

  const instructorCourses = getCoursesByInstructor(currentUser.id);

  // Get all resources across all courses
  const allResources = instructorCourses.flatMap(course => 
    course.modules.flatMap(module => 
      module.resources.map(resource => ({
        ...resource,
        courseName: course.title,
        moduleName: module.title
      }))
    )
  );

  const resetForm = () => {
    setTitle("");
    setType("pdf");
    setUrl("");
    setSelectedCourse("");
    setSelectedModule("");
    setOpen(false);
  };

  const handleAddResource = () => {
    if (!title || !url || !selectedCourse || !selectedModule) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addResource(
      currentUser.id,
      selectedCourse,
      selectedModule,
      { title, type, url, moduleId: selectedModule }
    );

    toast({
      title: "Success",
      description: "Resource added successfully",
    });

    resetForm();
  };

  return (
    <AppLayout requiredRole="instructor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
            <p className="text-muted-foreground">
              Manage and upload learning resources for your courses.
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Upload a new learning resource for your students.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Resource Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter resource title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Select value={type} onValueChange={(value: "pdf" | "video") => setType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Resource URL</Label>
                  <Input
                    id="url"
                    placeholder="Enter resource URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select 
                    value={selectedCourse} 
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCourse && (
                  <div className="space-y-2">
                    <Label htmlFor="module">Module</Label>
                    <Select 
                      value={selectedModule} 
                      onValueChange={setSelectedModule}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a module" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses
                          .find((c) => c.id === selectedCourse)
                          ?.modules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all-resources">
          <TabsList>
            <TabsTrigger value="all-resources">All Resources</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {allResources.length > 0 ? (
                allResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                        {resource.type === "pdf" ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : (
                          <Video className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <CardDescription className="line-clamp-1">
                        {resource.courseName} · {resource.moduleName}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        View
                      </Button>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No resources yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your first resource to help your students learn.
                  </p>
                  <Button 
                    onClick={() => setOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pdfs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {allResources.filter(r => r.type === "pdf").length > 0 ? (
                allResources
                  .filter(r => r.type === "pdf")
                  .map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{resource.title}</CardTitle>
                          <FileText className="h-5 w-5 text-red-500" />
                        </div>
                        <CardDescription className="line-clamp-1">
                          {resource.courseName} · {resource.moduleName}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(resource.url, "_blank")}
                        >
                          View
                        </Button>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No PDF resources yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add your first PDF resource.
                  </p>
                  <Button 
                    onClick={() => setOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add PDF
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {allResources.filter(r => r.type === "video").length > 0 ? (
                allResources
                  .filter(r => r.type === "video")
                  .map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{resource.title}</CardTitle>
                          <Video className="h-5 w-5 text-blue-500" />
                        </div>
                        <CardDescription className="line-clamp-1">
                          {resource.courseName} · {resource.moduleName}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(resource.url, "_blank")}
                        >
                          View
                        </Button>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <Video className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No video resources yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add your first video resource.
                  </p>
                  <Button 
                    onClick={() => setOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default InstructorResources;
