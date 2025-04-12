import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import ResourceItem from "./ResourceItem";
import AssignmentItem from "./AssignmentItem";
import { Module } from "@/contexts/CourseContext";
import { Progress } from "@/components/ui/progress";

interface ModuleAccordionProps {
  modules: Module[];
  completedModules?: string[];
  onAddResource?: (moduleId: string) => void;
  onAddAssignment?: (moduleId: string) => void;
  onAddQuiz?: (moduleId: string) => void;
  setSelectedModule?: (module: Module | null) => void;
}

const ModuleAccordion = ({ 
  modules, 
  completedModules = [],
  onAddResource,
  onAddAssignment,
  onAddQuiz,
  setSelectedModule
}: ModuleAccordionProps) => {
  return (
    <Accordion type="multiple" className="w-full">
      {modules.map((module) => {
        const isCompleted = completedModules.includes(module.id);

        const handleModuleClick = () => {
          if (setSelectedModule) setSelectedModule(module);
        };

        return (
          <AccordionItem value={module.id} key={module.id}>
            <AccordionTrigger className="hover:bg-gray-50 px-4 py-3" onClick={handleModuleClick}>
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center">
                  <div className="font-medium">{module.title}</div>
                  {isCompleted && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">{module.resources.length} resources</span>
                  <span className="mr-2">{module.assignments.length} assignments</span>
                  <span>{module.quizzes.length} quizzes</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {module.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Resources</h4>
                  <div className="space-y-2">
                    {module.resources.map((resource) => (
                      <ResourceItem key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {module.assignments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Assignments</h4>
                  <div>
                    {module.assignments.map((assignment) => (
                      <AssignmentItem key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                {onAddResource && (
                  <button 
                    onClick={() => onAddResource(module.id)}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    Add Resource
                  </button>
                )}
                {onAddAssignment && (
                  <button 
                    onClick={() => onAddAssignment(module.id)}
                    className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    Add Assignment
                  </button>
                )}
                {onAddQuiz && (
                  <button 
                    onClick={() => onAddQuiz(module.id)}
                    className="text-sm px-3 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                  >
                    Add Quiz
                  </button>
                )}
              </div>

              {!isCompleted && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Module Progress</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ModuleAccordion;
