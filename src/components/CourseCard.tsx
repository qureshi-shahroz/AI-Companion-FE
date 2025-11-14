import { Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  tags: string[];
  thumbnail: string;
}

export const CourseCard = ({ title, difficulty, duration, rating, tags, thumbnail }: CourseCardProps) => {
  const difficultyColors = {
    Beginner: "bg-success/20 text-success-foreground border-success/30",
    Intermediate: "bg-accent/20 text-accent-foreground border-accent/30",
    Advanced: "bg-destructive/20 text-destructive-foreground border-destructive/30",
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-soft transition-all hover:scale-105">
      <div className="h-32 bg-gradient-to-br from-primary-light to-primary overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-4xl">
          {thumbnail}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-card-foreground flex-1">{title}</h3>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-accent" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
          <Badge variant="outline" className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
