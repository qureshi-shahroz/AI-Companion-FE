import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  label: string;
  percentage: number;
  color: string;
}

interface ProgressCardProps {
  items: ProgressItem[];
}

export const ProgressCard = ({ items }: ProgressCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-success" />
        <h2 className="text-2xl font-bold text-card-foreground">Progress Overview</h2>
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-primary">{item.percentage}%</span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
