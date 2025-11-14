import { Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TodoPlan30DaysProps } from "@/hooks/useAIChat";

export const TodoPlan30Days = ({ goal, plan, startDate, endDate }: TodoPlan30DaysProps) => {
  return (
    <div className="space-y-6">
      {/* Goal Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            30-Day Plan: {goal}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(startDate).toLocaleDateString()}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside">
            {plan.map((item, idx) => (
              <li key={idx} className="text-sm text-foreground p-3 rounded-lg bg-secondary/50 border border-border">
                <span className="font-medium">Day {idx + 1}:</span> {item}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

