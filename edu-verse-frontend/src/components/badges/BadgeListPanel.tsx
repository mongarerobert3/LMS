import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/contexts/UserContext"; // Assuming Badge type is exported from UserContext
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2 } from "lucide-react";

interface BadgeListPanelProps {
  badges: Badge[];
  isOpen: boolean;
  onClose: () => void;
}

const BadgeListPanel: React.FC<BadgeListPanelProps> = ({ badges, isOpen, onClose }) => {
  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Badges</SheetTitle>
          <SheetDescription>
            Celebrate your achievements and keep growing in faith!
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6"> {/* Add padding-right to offset scrollbar */}
          <div className="py-4 space-y-4">
            {/* Earned Badges */}
            {earnedBadges.length > 0 && earnedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-300 rounded-lg shadow-sm">
                <span className="text-3xl mr-4">{badge.icon}</span>
                <div className="flex-grow">
                  <h4 className="font-semibold text-yellow-800">{badge.title}</h4>
                  <p className="text-xs text-amber-700">{badge.message}</p>
                   {badge.dateEarned && (
                     <p className="text-xs text-gray-500 mt-1">Earned: {new Date(badge.dateEarned).toLocaleDateString()}</p>
                   )}
                </div>
                <Button variant="ghost" size="sm" className="ml-2 text-gray-500 hover:text-gray-800">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            ))}

             {/* Locked Badges Separator */}
             {lockedBadges.length > 0 && earnedBadges.length > 0 && (
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">Locked Badges</span>
                    </div>
                </div>
             )}

            {/* Locked Badges */}
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm relative grayscale opacity-70">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                    <span className="text-white font-bold text-sm bg-gray-600 px-2 py-0.5 rounded">Locked</span>
                 </div>
                <span className="text-3xl mr-4">{badge.icon}</span>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-600">{badge.title}</h4>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
                 <Button variant="ghost" size="sm" className="ml-2 text-gray-400" disabled>
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BadgeListPanel;
