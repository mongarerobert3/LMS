import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlayCircle } from "lucide-react";

// Placeholder data - replace with actual data fetching later
const sermonData = {
  title: "Finding Strength in Faith",
  speaker: "Pastor John Doe",
  date: "Last Sunday",
  thumbnailUrl: "/placeholder.svg", // Replace with actual thumbnail URL
  sermonUrl: "#", // Replace with actual sermon link (e.g., YouTube, Vimeo)
};

const SermonCard = () => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={sermonData.thumbnailUrl}
            alt={sermonData.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-1">{sermonData.title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-3">
          {sermonData.speaker} - {sermonData.date}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-lms-purple hover:bg-lms-purple/90">
          <a href={sermonData.sermonUrl} target="_blank" rel="noopener noreferrer">
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Sermon
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SermonCard;
