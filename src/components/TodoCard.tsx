import { CheckSquare, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TodoItem {
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface TodoCardProps {
  todos: TodoItem[];
}

export const TodoCard = ({ todos }: TodoCardProps) => {
  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-accent/20 text-accent-foreground",
    high: "bg-destructive/20 text-destructive-foreground",
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Daily To-Do Plan</h2>
      <div className="space-y-3">
        {todos.map((todo, index) => (
          <div key={index} className="flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors">
            {todo.completed ? (
              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
              {todo.title}
            </span>
            <Badge variant="outline" className={priorityColors[todo.priority]}>
              {todo.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
