import { Calendar, Target, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FinancialPlanMessageProps {
  data: {
    type: 'financial_plan';
    goal: string;
    targetAmount: string;
    currency: string;
    timeline: string;
    startDate: string;
    endDate: string;
    dailyTasks: Array<{
      date: string;
      day: number;
      dayOfWeek: string;
      tasks: Array<{
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        estimatedTime: string;
        category: string;
      }>;
      milestone?: string;
    }>;
    summary: {
      totalDays: number;
      weeklyGoals: string[];
      keyStrategies: string[];
    };
  };
}

export const FinancialPlanMessage = ({ data }: FinancialPlanMessageProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* Goal Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Financial Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold">
              {data.currency} {data.targetAmount}
            </span>
            <span className="text-muted-foreground">in {data.timeline}</span>
          </div>
          <p className="text-sm text-muted-foreground">{data.goal}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(data.startDate).toLocaleDateString()}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(data.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks - Show first 7 days */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Daily Action Plan</h4>
        {data.dailyTasks.slice(0, 7).map((day, idx) => (
          <Card key={idx} className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Day {day.day} - {day.dayOfWeek}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
              {day.milestone && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">{day.milestone}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {day.tasks.map((task, taskIdx) => (
                <div
                  key={taskIdx}
                  className={`p-3 rounded-lg border ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm font-semibold">{task.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{task.category}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {data.dailyTasks.length > 7 && (
          <p className="text-xs text-muted-foreground text-center">
            + {data.dailyTasks.length - 7} more days in your plan
          </p>
        )}
      </div>

      {/* Summary */}
      <Card className="bg-secondary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-semibold">Total Days: </span>
            <span className="text-muted-foreground">{data.summary.totalDays}</span>
          </div>
          {data.summary.weeklyGoals.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">Weekly Goals:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {data.summary.weeklyGoals.map((goal, idx) => (
                  <li key={idx} className="text-xs">{goal}</li>
                ))}
              </ul>
            </div>
          )}
          {data.summary.keyStrategies.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">Key Strategies:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {data.summary.keyStrategies.map((strategy, idx) => (
                  <li key={idx} className="text-xs">{strategy}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

