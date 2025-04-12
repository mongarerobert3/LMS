import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/contexts/UserContext"; // Assuming Badge type is exported from UserContext
import { X } from "lucide-react";

interface BadgeDisplayModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDisplayModal: React.FC<BadgeDisplayModalProps> = ({ badge, isOpen, onClose }) => {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 border-2 border-yellow-400 shadow-xl rounded-lg relative overflow-hidden">
         {/* Subtle glow effect (example using box-shadow) */}
         <div className="absolute inset-0 rounded-lg box-border border-4 border-transparent shadow-[0_0_20px_5px_rgba(251,191,36,0.5)] pointer-events-none"></div>

         {/* Close Button */}
         <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

        <DialogHeader className="pt-8 text-center"> {/* Added padding top */}
           {/* Large Icon/Emoji */}
           <div className="text-6xl mb-4 mx-auto">{badge.icon}</div>
          <DialogTitle className="text-2xl font-bold text-yellow-800">{badge.title}</DialogTitle>
          <DialogDescription className="text-amber-700 mt-1">
            {badge.description}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2 text-center">
          <p className="text-lg text-gray-700">{badge.message}</p>
           {badge.dateEarned && (
             <p className="text-xs text-gray-500 mt-4">Earned on: {new Date(badge.dateEarned).toLocaleDateString()}</p>
           )}
        </div>
         {/* Footer could be used for sharing later */}
         {/* <DialogFooter className="sm:justify-center">
           <Button type="button" variant="secondary" onClick={onClose}>
             Close
           </Button>
         </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default BadgeDisplayModal;
