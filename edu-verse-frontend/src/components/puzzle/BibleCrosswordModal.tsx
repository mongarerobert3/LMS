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
import { X, Save, Share2, Check, Loader2, AlertTriangle } from "lucide-react"; // Added Loader2, AlertTriangle
import { useToast } from "@/hooks/use-toast";
import { Badge, useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils"; // Import cn utility

// Define expected puzzle data structure
interface PuzzleClue {
  num: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  len: number;
}
interface PuzzleData {
  title: string;
  gridSize: number;
  grid: number[][];
  clues: {
    across: PuzzleClue[];
    down: PuzzleClue[];
  };
}

interface BibleCrosswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  showBadgeModal: (badge: Badge) => void;
}

// Helper to generate initial state for inputs based on fetched data
const generateInitialInputState = (grid?: number[][]) => {
  const initialState: { [key: string]: string } = {};
  if (!grid) return initialState;
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 1) {
        initialState[`${r}-${c}`] = "";
      }
    });
  });
  return initialState;
};

const BibleCrosswordModal: React.FC<BibleCrosswordModalProps> = ({ isOpen, onClose, showBadgeModal }) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null); // State for fetched data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const { toast } = useToast();
  const { currentUser } = useUser();

  // Fetch puzzle data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchPuzzle = async () => {
        setIsLoading(true);
        setError(null);
        setPuzzleData(null); // Clear previous data
        setInputValues({}); // Clear previous inputs
        try {
          // Fetch from backend (running on port 3001)
          const response = await fetch('http://localhost:3001/api/puzzle');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: PuzzleData = await response.json();
          setPuzzleData(data);
          setInputValues(generateInitialInputState(data.grid)); // Initialize inputs based on fetched grid
        } catch (e) {
          console.error("Failed to fetch puzzle:", e);
          setError("Failed to load puzzle. Please try again later.");
          if (e instanceof Error) {
             setError(`Failed to load puzzle: ${e.message}`);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchPuzzle();
    }
  }, [isOpen]); // Re-fetch when isOpen changes to true

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) => {
    const { value } = e.target;
    const key = `${r}-${c}`;
    const newValue = value.toUpperCase().slice(0, 1);

    setInputValues(prev => ({
      ...prev,
      [key]: newValue,
    }));

    // Advance focus if a letter was entered
    if (newValue && puzzleData) {
      let nextR = r;
      let nextC = c;
      if (currentDirection === 'across') {
        nextC++;
      } else {
        nextR++;
      }

      // Ensure next cell is within bounds and is a white cell
      if (
        nextR < puzzleData.gridSize &&
        nextC < puzzleData.gridSize &&
        puzzleData.grid[nextR]?.[nextC] === 1
      ) {
        const nextInput = document.getElementById(`cell-${nextR}-${nextC}`);
        nextInput?.focus();
      }
    }
  };

  const handleFocus = (r: number, c: number) => {
    setActiveCell({ r, c });
    // If the user clicks the *same* cell again, toggle direction
    if (activeCell?.r === r && activeCell?.c === c) {
      setCurrentDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setActiveCell({ r, c });
      // TODO: Potentially determine initial direction based on surrounding cells or previous state
      // For now, default to across unless it's clearly a down-only start?
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (!puzzleData) return;

    let nextR = r;
    let nextC = c;
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        nextR--;
        moved = true;
        break;
      case 'ArrowDown':
        nextR++;
        moved = true;
        break;
      case 'ArrowLeft':
        nextC--;
        moved = true;
        break;
      case 'ArrowRight':
        nextC++;
        moved = true;
        break;
      case 'Backspace':
      case 'Delete':
        // If the current cell is empty, move backwards
        if (!inputValues[`${r}-${c}`]) {
          if (currentDirection === 'across') {
            nextC--;
          } else {
            nextR--;
          }
          moved = true;
        }
        // Note: The default input behavior will handle deleting the character if present.
        // We only handle moving focus if the cell was already empty.
        break;
      case 'Enter': // Toggle direction on Enter
      case ' ': // Toggle direction on Space
        e.preventDefault(); // Prevent space from typing a space
        setCurrentDirection(prev => prev === 'across' ? 'down' : 'across');
        break;
      default:
        // Allow typing characters
        return;
    }

    if (moved) {
      e.preventDefault(); // Prevent default arrow key behavior (like scrolling)

      // Find the next valid white cell in the direction moved
      while (
        nextR >= 0 && nextR < puzzleData.gridSize &&
        nextC >= 0 && nextC < puzzleData.gridSize
      ) {
        if (puzzleData.grid[nextR]?.[nextC] === 1) {
          const nextInput = document.getElementById(`cell-${nextR}-${nextC}`);
          nextInput?.focus();
          return; // Stop searching once a valid cell is found and focused
        }
        // If it's a black cell, keep moving in the same direction (this might need refinement)
        if (e.key === 'ArrowUp' || (e.key === 'Backspace' && currentDirection === 'down')) nextR--;
        else if (e.key === 'ArrowDown') nextR++;
        else if (e.key === 'ArrowLeft' || (e.key === 'Backspace' && currentDirection === 'across')) nextC--;
        else if (e.key === 'ArrowRight') nextC++;
        else break; // Stop if it wasn't an arrow or backspace key that initiated the move
      }
    }
  };


  const getClueNumber = (r: number, c: number): number | null => {
     if (!puzzleData) return null;
     const acrossClue = puzzleData.clues.across.find(clue => clue.row === r && clue.col === c);
     if (acrossClue) return acrossClue.num;
     const downClue = puzzleData.clues.down.find(clue => clue.row === r && clue.col === c);
     if (downClue) return downClue.num;
     return null;
  }

  // Helper to find cells belonging to the current word
  const getActiveWordCells = (): { r: number; c: number }[] => {
    if (!activeCell || !puzzleData) return [];

    const { r: startR, c: startC } = activeCell;
    const cells: { r: number; c: number }[] = [];

    if (currentDirection === 'across') {
      // Find the start of the word horizontally
      let c = startC;
      while (c >= 0 && puzzleData.grid[startR]?.[c] === 1) {
        c--;
      }
      c++; // Move back to the first valid cell

      // Add all cells in the word horizontally
      while (c < puzzleData.gridSize && puzzleData.grid[startR]?.[c] === 1) {
        cells.push({ r: startR, c });
        c++;
      }
    } else { // currentDirection === 'down'
      // Find the start of the word vertically
      let r = startR;
      while (r >= 0 && puzzleData.grid[r]?.[startC] === 1) {
        r--;
      }
      r++; // Move back to the first valid cell

      // Add all cells in the word vertically
      while (r < puzzleData.gridSize && puzzleData.grid[r]?.[startC] === 1) {
        cells.push({ r, c: startC });
        r++;
      }
    }
    return cells;
  };

  const handleClueClick = (clue: PuzzleClue, direction: 'across' | 'down') => {
    setCurrentDirection(direction);
    setActiveCell({ r: clue.row, c: clue.col });
    const targetInput = document.getElementById(`cell-${clue.row}-${clue.col}`);
    targetInput?.focus();
  };


  const renderGrid = () => {
    if (!puzzleData) return null; // Don't render grid if no data
    const activeWordCells = getActiveWordCells(); // Get cells for highlighting
    return (
      <div
        className="grid border-2 border-gray-600 bg-white shadow-lg mx-auto relative"
        style={{
          gridTemplateColumns: `repeat(${puzzleData.gridSize}, minmax(30px, 1fr))`,
          width: 'fit-content',
          maxWidth: '95%',
        }}
      >
        {puzzleData.grid.flat().map((cell, index) => {
          const r = Math.floor(index / puzzleData.gridSize);
          const c = index % puzzleData.gridSize;
          const clueNum = getClueNumber(r, c);
          const isActive = activeCell?.r === r && activeCell?.c === c;
          const isPartOfActiveWord = activeWordCells.some(cell => cell.r === r && cell.c === c);

          return (
            <div
              key={index}
              className={cn(
                "relative flex items-center justify-center border border-gray-300 aspect-square transition-colors duration-150",
                cell === 1 ? 'bg-white' : 'bg-gray-800',
                // Apply highlighting: active cell gets ring, active word gets light bg
                isPartOfActiveWord && !isActive && 'bg-lms-purple/10', // Light purple for word cells
                isActive && 'bg-lms-purple/25 ring-2 ring-lms-purple ring-inset' // Darker purple + ring for active cell
              )}
              style={{ minWidth: '30px', minHeight: '30px' }}
            >
              {cell === 1 ? (
                <>
                 {clueNum && <span className="absolute top-0 left-0.5 text-[8px] font-bold text-gray-500 select-none">{clueNum}</span>}
                  <input
                    id={`cell-${r}-${c}`} // Add ID for focusing
                    type="text"
                    maxLength={1}
                    value={inputValues[`${r}-${c}`] || ""}
                    onChange={(e) => handleInputChange(e, r, c)}
                    onFocus={() => handleFocus(r, c)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    className="w-full h-full text-center text-sm font-bold uppercase border-none outline-none bg-transparent rounded-none p-0" // Removed focus ring here, handled by parent div
                    aria-label={`Cell ${r+1},${c+1}${clueNum ? `, Clue ${clueNum}` : ''}`}
                    disabled={isLoading} // Disable input while loading
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
     if (!puzzleData) return false; // Cannot check without data
     try {
        for (const clue of puzzleData.clues.across) {
            let enteredWord = "";
            for (let i = 0; i < clue.len; i++) {
                enteredWord += inputValues[`${clue.row}-${clue.col + i}`] || " ";
            }
            if (enteredWord.trim().toUpperCase() !== clue.answer.toUpperCase()) {
                return false;
            }
        }
        for (const clue of puzzleData.clues.down) {
            let enteredWord = "";
            for (let i = 0; i < clue.len; i++) {
                enteredWord += inputValues[`${clue.row + i}-${clue.col}`] || " ";
            }
            if (enteredWord.trim().toUpperCase() !== clue.answer.toUpperCase()) {
                return false;
            }
        }
        return true;
     } catch (e) {
        console.error("Error checking answers:", e);
        return false; // Treat errors during check as incorrect
     }
  }

  const handleSubmit = () => {
      if (!puzzleData) return; // Don't submit if no data

      const isCorrect = checkAnswers();
      if (isCorrect) {
          toast({
              title: "✅ Puzzle Solved!",
              description: "Amazing work! You've pieced together the words of faith.",
          });
          const puzzleBadge = currentUser?.badges.find(b => b.id === 'b7');
          if (puzzleBadge) {
             const earnedPuzzleBadge = { ...puzzleBadge, earned: true, dateEarned: new Date().toISOString() };
             showBadgeModal(earnedPuzzleBadge);
          }
          onClose();
      } else {
          toast({
              title: "🤔 Not Quite Right",
              description: "Some answers are incorrect. Keep trying!",
              variant: "destructive",
          });
      }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-lms-purple mb-4" />
          <p>Generating your puzzle...</p>
        </div>
      );
    }
    if (error) {
       return (
         <div className="flex flex-col items-center justify-center h-60 text-red-600">
           <AlertTriangle className="h-8 w-8 mb-4" />
           <p className="font-semibold">Error Loading Puzzle</p>
           <p className="text-sm text-center mt-1">{error}</p>
         </div>
       );
    }
    if (!puzzleData) {
       return (
         <div className="flex items-center justify-center h-60">
           <p>No puzzle data available.</p>
         </div>
       );
    }
    // Render puzzle if data is loaded
    return (
       <>
         <DialogHeader className="p-6 pb-4 text-center bg-gradient-to-b from-amber-100 to-white">
           <img src="/placeholder.svg" alt="Scroll" className="h-16 w-auto mx-auto mb-2 opacity-70"/>
           <DialogTitle className="text-2xl font-bold text-yellow-800">{puzzleData.title}</DialogTitle>
           <DialogDescription>
             Test your knowledge of the Bible! Fill in the grid based on the clues below.
           </DialogDescription>
         </DialogHeader>

         <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 flex justify-center items-start pt-4">
             {renderGrid()}
           </div>
           <div className="md:col-span-1 space-y-4 text-sm">
             <div>
               <h4 className="font-semibold mb-2 border-b pb-1">Across</h4>
               <ul className="space-y-1 list-inside max-h-60 overflow-y-auto pr-2"> {/* Added scroll */}
                 {puzzleData.clues.across.map(clue => (
                   <li
                     key={`a-${clue.num}`}
                     className="cursor-pointer hover:text-lms-purple p-1 rounded transition-colors"
                     onClick={() => handleClueClick(clue, 'across')}
                   >
                     <strong>{clue.num}.</strong> {clue.clue}
                   </li>
                 ))}
               </ul>
             </div>
             <div>
               <h4 className="font-semibold mb-2 border-b pb-1">Down</h4>
               <ul className="space-y-1 list-inside max-h-60 overflow-y-auto pr-2"> {/* Added scroll */}
                 {puzzleData.clues.down.map(clue => (
                   <li
                     key={`d-${clue.num}`}
                     className="cursor-pointer hover:text-lms-purple p-1 rounded transition-colors"
                     onClick={() => handleClueClick(clue, 'down')}
                   >
                     <strong>{clue.num}.</strong> {clue.clue}
                   </li>
                 ))}
               </ul>
             </div>
           </div>
         </div>
       </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0" onInteractOutside={(e) => e.preventDefault()}>
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
           {renderContent()}
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2">
             <div className="text-xs text-gray-500">Challenge a friend!</div>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => alert("Save feature coming soon!")} disabled={isLoading || !!error}>
                    <Save className="h-4 w-4 mr-1"/> Save Progress
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Share feature coming soon!")} disabled={isLoading || !!error}>
                    <Share2 className="h-4 w-4 mr-1"/> Share
                </Button>
                 <Button size="sm" onClick={handleSubmit} disabled={isLoading || !!error || !puzzleData}>
                    <Check className="h-4 w-4 mr-1"/> Submit Puzzle
                </Button>
             </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BibleCrosswordModal;
