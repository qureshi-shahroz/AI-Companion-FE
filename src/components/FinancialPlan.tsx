import { Calendar, CheckCircle2, Clock, Target, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { FinancialPlanProps } from "@/hooks/useAIChat";

export const FinancialPlan = (props: FinancialPlanProps) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (dayIndex: number, taskIndex: number) => {
    const key = `${dayIndex}-${taskIndex}`;
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

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

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayIndex = props.dailyTasks.findIndex(day => day.date === today);
  const currentDay = todayIndex >= 0 ? props.dailyTasks[todayIndex] : props.dailyTasks[0];

  return (
    <div className="space-y-6">
      {/* Goal Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goal: {props.goal}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">{props.currency} {props.targetAmount}</span>
            </div>
            <span className="text-muted-foreground">in {props.timeline}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(props.startDate).toLocaleDateString()}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(props.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      {currentDay && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Today's Tasks - Day {currentDay.day} ({currentDay.dayOfWeek})
            </CardTitle>
            {currentDay.milestone && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">{currentDay.milestone}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {currentDay.tasks.map((task, taskIdx) => {
              const taskKey = `${todayIndex}-${taskIdx}`;
              const isCompleted = completedTasks.has(taskKey);
              
              return (
                <div
                  key={taskIdx}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted ? 'opacity-60 bg-muted/50' : getPriorityColor(task.priority)
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleTask(todayIndex, taskIdx)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold ${isCompleted ? 'line-through' : ''}`}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedTime}</span>
                        </div>
                        <span>•</span>
                        <span className="capitalize">{task.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* All Days - Scrollable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complete Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {props.dailyTasks.map((day, dayIdx) => {
              const isToday = day.date === today;
              
              return (
                <div
                  key={dayIdx}
                  className={`p-4 rounded-lg border ${
                    isToday ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">
                        Day {day.day} - {day.dayOfWeek}
                      </h4>
                      <p className="text-xs text-muted-foreground">{day.date}</p>
                    </div>
                    {isToday && (
                      <Badge variant="default" className="text-xs">Today</Badge>
                    )}
                  </div>
                  {day.milestone && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-primary/10 rounded">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary font-medium">{day.milestone}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {day.tasks.map((task, taskIdx) => {
                      const taskKey = `${dayIdx}-${taskIdx}`;
                      const isCompleted = completedTasks.has(taskKey);
                      
                      return (
                        <div
                          key={taskIdx}
                          className={`p-2 rounded border text-xs ${
                            isCompleted ? 'opacity-50 bg-muted/30' : getPriorityColor(task.priority)
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={isCompleted}
                              onCheckedChange={() => toggleTask(dayIdx, taskIdx)}
                              className="mt-0.5 h-3 w-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`font-medium ${isCompleted ? 'line-through' : ''}`}>
                                  {task.title}
                                </span>
                                <Badge variant="outline" className="text-[10px] px-1 py-0">
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground mb-1">{task.description}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{task.estimatedTime}</span>
                                <span>•</span>
                                <span className="capitalize">{task.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-sm">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="font-semibold">Total Days: </span>
            <span className="text-muted-foreground">{props.summary.totalDays}</span>
          </div>
          {props.summary.weeklyGoals.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">Weekly Goals:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {props.summary.weeklyGoals.map((goal, idx) => (
                  <li key={idx} className="text-xs">{goal}</li>
                ))}
              </ul>
            </div>
          )}
          {props.summary.keyStrategies.length > 0 && (
            <div>
              <h5 className="font-semibold mb-1">Key Strategies:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {props.summary.keyStrategies.map((strategy, idx) => (
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

