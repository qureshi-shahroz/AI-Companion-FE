import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface FinancialPlanData {
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
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: string;
  level: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  image: string;
}

// Command Protocol Types
export type CommandAction = 'show_component' | 'redirect' | 'text_reply';

export interface ShowComponentCommand {
  action: 'show_component';
  component: 'CourseList' | 'FinancialPlan' | 'TodoPlan30Days' | 'Roadmap' | 'SuggestionSummary';
  props: Record<string, any>;
}

export interface RedirectCommand {
  action: 'redirect';
  url: string;
}

export interface TextReplyCommand {
  action: 'text_reply';
  text: string;
}

export type Command = ShowComponentCommand | RedirectCommand | TextReplyCommand;

// Component Props Types
export interface CourseListProps {
  goal: string;
  duration?: string;
  courses: Course[];
}

export interface FinancialPlanProps {
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
}

export interface TodoPlan30DaysProps {
  goal: string;
  plan: string[];
  startDate: string;
  endDate: string;
}

export interface RoadmapProps {
  goal: string;
  milestones: string[];
}

export interface SuggestionSummaryProps {
  suggestions: string[];
}

// Chat Response (Command Protocol)
export interface ChatResponse {
  success: boolean;
  prompt: string;
  command: Command;
  timestamp: string;
}

// Legacy support (for backward compatibility)
export interface LegacyChatResponse {
  success: boolean;
  prompt: string;
  responseType?: 'text' | 'todo_list' | 'courses' | 'financial_plan';
  type?: 'text' | 'todo_list' | 'courses' | 'financial_plan';
  response?: string;
  courses?: Course[];
  aiMessage?: string;
  data?: FinancialPlanData;
  timestamp: string;
}

interface UseAIChatReturn {
  sendPrompt: (prompt: string) => Promise<ChatResponse | LegacyChatResponse>;
  loading: boolean;
  error: string | null;
}

export function useAIChat(): UseAIChatReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPrompt = async (prompt: string): Promise<ChatResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse | LegacyChatResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred';
      
      // Handle network errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please make sure the API is running.');
      } else {
        setError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendPrompt, loading, error };
}

