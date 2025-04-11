import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Save, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge, useUser } from "@/contexts/UserContext"; // Import Badge and useUser

interface BibleCrosswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  showBadgeModal: (badge: Badge) => void; // Add prop for triggering badge modal
}

// --- Static Puzzle Data (Placeholder) ---
// NOTE: Grid needs actual clue numbers and answers mapped for checking
// This is a simplified example for structure
const puzzleData = {
  title: "Crossword of Faith",
  gridSize: 10,
  grid: [ // 0: block, 1: empty cell
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0], // G E N E S I S
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // D   V   A
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0], // N O A H   M A R Y
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0], // D   D       E
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1], // V   E   P E T E R
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1], // I       T       L
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // S I N A I   W E P T
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0], //     O   O
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0], //     N   N
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  clues: {
    across: [
      { num: 1, clue: "First book of the Bible (7)", answer: "GENESIS", row: 0, col: 2, len: 7 },
      { num: 3, clue: "He built an ark (4)", answer: "NOAH", row: 2, col: 0, len: 4 },
      { num: 5, clue: "Disciple who denied Jesus (5)", answer: "PETER", row: 4, col: 4, len: 5 },
      { num: 7, clue: "Location of the Ten Commandments (5)", answer: "SINAI", row: 6, col: 0, len: 5 },
      { num: 8, clue: "Shortest verse: 'Jesus ____' (4)", answer: "WEPT", row: 6, col: 7, len: 4 },
    ],
    down: [
      { num: 1, clue: "Garden where Adam and Eve lived (4)", answer: "EDEN", row: 0, col: 2, len: 4 },
      { num: 2, clue: "Mother of Jesus (4)", answer: "MARY", row: 0, col: 6, len: 4 },
      { num: 4, clue: "He fought Goliath (5)", answer: "DAVID", row: 2, col: 0, len: 5 },
      { num: 6, clue: "Last book of the Bible (10)", answer: "REVELATION", row: 2, col: 9, len: 10 }, // Needs grid adjustment
      { num: 9, clue: "A type of prayer communication (10)", answer: "INTERCESSION", row: 0, col: 4, len: 10 }, // Needs grid adjustment
    ],
  },
};
// --- End Static Puzzle Data ---

// Helper to generate initial state for inputs
const generateInitialInputState = () => {
  const initialState: { [key: string]: string } = {};
  puzzleData.grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 1) {
        initialState[`${r}-${c}`] = "";
      }
    });
  });
  return initialState;
};

const BibleCrosswordModal: React.FC<BibleCrosswordModalProps> = ({ isOpen, onClose, showBadgeModal }) => { // Destructure showBadgeModal
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>(generateInitialInputState());
  const { toast } = useToast();
  const { currentUser } = useUser(); // Get currentUser to access badges

  // Reset inputs when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputValues(generateInitialInputState());
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) => {
    const { value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [`${r}-${c}`]: value.toUpperCase().slice(0, 1), // Ensure single uppercase letter
    }));
    // TODO: Add focus shifting logic here (e.g., on input, move to next cell)
  };

  // Function to get clue number for a cell (simplified)
  const getClueNumber = (r: number, c: number): number | null => {
     const acrossClue = puzzleData.clues.across.find(clue => clue.row === r && clue.col === c);
     if (acrossClue) return acrossClue.num;
     const downClue = puzzleData.clues.down.find(clue => clue.row === r && clue.col === c);
     if (downClue) return downClue.num;
     return null;
  }

  // Basic grid rendering with inputs
  const renderGrid = () => {
    return (
      <div
        className="grid border-2 border-gray-600 bg-white shadow-lg mx-auto relative" // Added relative for clue numbers
        style={{
          gridTemplateColumns: `repeat(${puzzleData.gridSize}, minmax(30px, 1fr))`, // Slightly larger cells
          width: 'fit-content',
          maxWidth: '95%',
        }}
      >
        {puzzleData.grid.flat().map((cell, index) => {
          const r = Math.floor(index / puzzleData.gridSize);
          const c = index % puzzleData.gridSize;
          const clueNum = getClueNumber(r, c);

          return (
            <div
              key={index}
              className={`relative flex items-center justify-center border border-gray-300 aspect-square ${
                cell === 1 ? 'bg-white' : 'bg-gray-800'
              }`}
              style={{ minWidth: '30px', minHeight: '30px' }}
            >
              {cell === 1 ? (
                <>
                 {clueNum && <span className="absolute top-0 left-0.5 text-[8px] font-bold text-gray-500">{clueNum}</span>}
                  <input
                    type="text"
                    maxLength={1}
                    value={inputValues[`${r}-${c}`] || ""}
                    onChange={(e) => handleInputChange(e, r, c)}
                    className="w-full h-full text-center text-sm font-bold uppercase border-none outline-none focus:ring-1 focus:ring-lms-purple rounded-none"
                    aria-label={`Cell ${r+1},${c+1}`}
                  />
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  const checkAnswers = (): boolean => {
     for (const clue of puzzleData.clues.across) {
        let enteredWord = "";
        for (let i = 0; i < clue.len; i++) {
            enteredWord += inputValues[`${clue.row}-${clue.col + i}`] || " "; // Use space for empty
        }
        if (enteredWord.trim().toUpperCase() !== clue.answer.toUpperCase()) {
            console.log(`Across ${clue.num} incorrect. Expected: ${clue.answer}, Got: ${enteredWord}`);
            return false;
        }
     }
     for (const clue of puzzleData.clues.down) {
        let enteredWord = "";
        for (let i = 0; i < clue.len; i++) {
            enteredWord += inputValues[`${clue.row + i}-${clue.col}`] || " ";
        }
         if (enteredWord.trim().toUpperCase() !== clue.answer.toUpperCase()) {
            console.log(`Down ${clue.num} incorrect. Expected: ${clue.answer}, Got: ${enteredWord}`);
            return false;
        }
     }
     return true;
  }

  const handleSubmit = () => {
      const isCorrect = checkAnswers();
      if (isCorrect) {
          toast({
              title: "✅ Puzzle Solved!",
              description: "Amazing work! You've pieced together the words of faith.",
          });
          // Trigger badge modal ('b7' - Puzzle Master)
          const puzzleBadge = currentUser?.badges.find(b => b.id === 'b7');
          if (puzzleBadge) {
             // Simulate earning it
             const earnedPuzzleBadge = { ...puzzleBadge, earned: true, dateEarned: new Date().toISOString() };
             showBadgeModal(earnedPuzzleBadge);
             // TODO: Persist earned status
          }
          onClose(); // Close puzzle on success
      } else {
          toast({
              title: "🤔 Not Quite Right",
              description: "Some answers are incorrect. Keep trying!",
              variant: "destructive",
          });
      }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0" onInteractOutside={(e) => e.preventDefault()}> {/* Wider modal */}
         <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-gray-500 hover:text-gray-800 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

        <ScrollArea className="max-h-[85vh]">
            <DialogHeader className="p-6 pb-4 text-center bg-gradient-to-b from-amber-100 to-white">
                 <img src="/placeholder.svg" alt="Scroll" className="h-16 w-auto mx-auto mb-2 opacity-70"/>
                <DialogTitle className="text-2xl font-bold text-yellow-800">{puzzleData.title}</DialogTitle>
                <DialogDescription>
                    Test your knowledge of the Bible! Fill in the grid based on the clues below.
                </DialogDescription>
            </DialogHeader>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex justify-center items-start pt-4"> {/* Added padding top */}
                    {renderGrid()}
                </div>

                <div className="md:col-span-1 space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-2 border-b pb-1">Across</h4>
                        <ul className="space-y-1 list-inside">
                            {puzzleData.clues.across.map(c => <li key={`a-${c.num}`}><strong>{c.num}.</strong> {c.clue}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 border-b pb-1">Down</h4>
                        <ul className="space-y-1 list-inside">
                            {puzzleData.clues.down.map(c => <li key={`d-${c.num}`}><strong>{c.num}.</strong> {c.clue}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2">
             <div className="text-xs text-gray-500">Challenge a friend!</div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => alert("Save feature coming soon!")}>
                    <Save className="h-4 w-4 mr-1"/> Save Progress
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Share feature coming soon!")}>
                    <Share2 className="h-4 w-4 mr-1"/> Share
                </Button>
                 <Button size="sm" onClick={handleSubmit}>
                    <Check className="h-4 w-4 mr-1"/> Submit Puzzle
                </Button>
             </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BibleCrosswordModal;
