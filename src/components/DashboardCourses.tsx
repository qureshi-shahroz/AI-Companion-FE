import { BookOpen, Clock, User, Star, Users, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/hooks/useAIChat";

interface DashboardCoursesProps {
  courses: Course[];
  aiMessage?: string;
}

export const DashboardCourses = ({ courses, aiMessage }: DashboardCoursesProps) => {
  return (
    <div className="space-y-6">
      {aiMessage && (
        <Card className="bg-secondary/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{aiMessage}</p>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Recommended Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1 line-clamp-2">{course.title}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{course.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>
                  <Button size="sm" className="text-xs">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

