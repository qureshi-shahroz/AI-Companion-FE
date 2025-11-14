import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { RoadmapCard } from "./RoadmapCard";
import { CourseCard } from "./CourseCard";
import { TodoCard } from "./TodoCard";
import { ProgressCard } from "./ProgressCard";

export const ContentArea = () => {
  const [hasContent] = useState(true); // Set to true to show sample data

  // Mock data for demonstration
  const roadmapSteps = [
    {
      title: "Learn the fundamentals",
      description: "Build a strong foundation with core concepts and principles",
      completed: true,
    },
    {
      title: "Practice daily",
      description: "Dedicate 30 minutes each day to hands-on practice",
      completed: true,
    },
    {
      title: "Build a project",
      description: "Apply your knowledge by creating something meaningful",
      completed: false,
    },
    {
      title: "Join a community",
      description: "Connect with others on the same journey",
      completed: false,
    },
  ];

  const courses = [
    {
      title: "Introduction to Personal Growth",
      difficulty: "Beginner" as const,
      duration: "4 weeks",
      rating: 4.8,
      tags: ["Mindset", "Habits"],
      thumbnail: "🌱",
    },
    {
      title: "Advanced Goal Setting",
      difficulty: "Intermediate" as const,
      duration: "6 weeks",
      rating: 4.9,
      tags: ["Planning", "Strategy"],
      thumbnail: "🎯",
    },
    {
      title: "Leadership Mastery",
      difficulty: "Advanced" as const,
      duration: "8 weeks",
      rating: 4.7,
      tags: ["Leadership", "Management"],
      thumbnail: "👑",
    },
  ];

  const todos = [
    { title: "Review yesterday's progress", completed: true, priority: "medium" as const },
    { title: "Complete daily learning module", completed: false, priority: "high" as const },
    { title: "Practice new skill for 30 minutes", completed: false, priority: "high" as const },
    { title: "Journal about today's insights", completed: false, priority: "low" as const },
  ];

  const progressItems = [
    { label: "Overall Progress", percentage: 65, color: "primary" },
    { label: "Current Week Goals", percentage: 80, color: "success" },
    { label: "Monthly Milestone", percentage: 45, color: "accent" },
  ];

  if (!hasContent) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8 content-fade-in">
      {/* Roadmap Section */}
      <RoadmapCard steps={roadmapSteps} />

      {/* Courses Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Recommended Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>

      {/* Todo and Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodoCard todos={todos} />
        <ProgressCard items={progressItems} />
      </div>
    </div>
  );
};
