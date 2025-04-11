// src/components/instructor/QuizList.tsx
import React from 'react';
import { Quiz } from '@/types/course';
import { HelpCircle } from 'lucide-react'; // Icon for quizzes
import { Badge } from '@/components/ui/badge'; // To display question count

interface QuizListProps {
  quizzes: Quiz[];
  // Add functions for edit/delete later if needed
  // onEditQuiz: (quizId: string) => void;
  // onDeleteQuiz: (quizId: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  if (!quizzes || quizzes.length === 0) {
    return <p className="text-sm text-muted-foreground mt-2">No quizzes added yet.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2 border-b pb-1">Knowledge Checks (Quizzes)</h4>
      <ul className="list-none pl-0 space-y-1">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="flex items-center justify-between text-sm p-2 border rounded hover:bg-muted/50">
            <div className="flex items-center overflow-hidden mr-2">
              <HelpCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
              <span className="truncate" title={quiz.title}>
                {quiz.title}
             </span>
            </div>
            <div className="flex items-center flex-shrink-0">
                {/* Display number of questions */}
                <Badge variant="outline" className="mr-2">{quiz.questions.length} Questions</Badge>
                {/* Placeholder View Button */}
                <Button variant="outline" size="sm" disabled title="View/Edit Quiz (Not Implemented)">View</Button>
                {/* Placeholder for Edit/Delete buttons */}
                {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1"> E </Button> */}
                {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0"> D </Button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
