import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RoadmapStep {
  title: string;
  description: string;
  completed: boolean;
}

interface RoadmapCardProps {
  steps: RoadmapStep[];
}

export const RoadmapCard = ({ steps }: RoadmapCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Your Personalized Roadmap</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${step.completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
