import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatPanel } from "@/components/ChatPanel";
import { ChatToggleButton } from "@/components/ChatToggleButton";
import { EmptyState } from "@/components/EmptyState";
import { Loader } from "@/components/Loader";
import { CourseList } from "@/components/CourseList";
import { FinancialPlan } from "@/components/FinancialPlan";
import { TodoPlan30Days } from "@/components/TodoPlan30Days";
import { Roadmap } from "@/components/Roadmap";
import { SuggestionSummary } from "@/components/SuggestionSummary";
import { useChatContext } from "@/contexts/ChatContext";
import { Sparkles } from "lucide-react";
import type { ChatResponse, LegacyChatResponse } from "@/hooks/useAIChat";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { response, command, setCommand, loading } = useChatContext();
  const navigate = useNavigate();

  // Handle redirects
  useEffect(() => {
    if (command && command.action === 'redirect') {
      navigate(command.url);
    }
  }, [command, navigate]);

  // Extract command from response
  useEffect(() => {
    if (response) {
      if ('command' in response) {
        // Command protocol response
        setCommand(response.command);
      } else {
        // Legacy response - convert to command format
        const legacyResponse = response as LegacyChatResponse;
        const responseType = legacyResponse.responseType || legacyResponse.type;
        
        if (responseType === 'financial_plan' && legacyResponse.data) {
          setCommand({
            action: 'show_component',
            component: 'FinancialPlan',
            props: {
              goal: legacyResponse.data.goal,
              targetAmount: legacyResponse.data.targetAmount,
              currency: legacyResponse.data.currency,
              timeline: legacyResponse.data.timeline,
              startDate: legacyResponse.data.startDate,
              endDate: legacyResponse.data.endDate,
              dailyTasks: legacyResponse.data.dailyTasks,
              summary: legacyResponse.data.summary,
            },
          });
        } else if (responseType === 'courses' && legacyResponse.courses) {
          setCommand({
            action: 'show_component',
            component: 'CourseList',
            props: {
              goal: legacyResponse.prompt,
              courses: legacyResponse.courses,
            },
          });
        } else if (responseType === 'todo_list') {
          setCommand({
            action: 'text_reply',
            text: legacyResponse.response || '',
          });
        } else {
          setCommand({
            action: 'text_reply',
            text: legacyResponse.response || '',
          });
        }
      }
    } else {
      setCommand(null);
    }
  }, [response, setCommand, navigate]);

  const renderComponent = (componentName: string, props: any) => {
    switch (componentName) {
      case 'CourseList':
        return <CourseList {...props} />;
      case 'FinancialPlan':
        return <FinancialPlan {...props} />;
      case 'TodoPlan30Days':
        return <TodoPlan30Days {...props} />;
      case 'Roadmap':
        return <Roadmap {...props} />;
      case 'SuggestionSummary':
        return <SuggestionSummary {...props} />;
      default:
        return <div className="text-muted-foreground">Unknown component: {componentName}</div>;
    }
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size={64} />
        </div>
      );
    }

    if (!command) {
      return <EmptyState />;
    }

    switch (command.action) {
      case 'show_component':
        return renderComponent(command.component, command.props);
      
      case 'redirect':
        // Handle redirect in useEffect
        return <div className="flex items-center justify-center min-h-[60vh]">Redirecting...</div>;
      
      case 'text_reply':
        return (
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm whitespace-pre-wrap">{command.text}</p>
            </div>
          </div>
        );
      
      default:
        return <EmptyState />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Growth Companion</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Your personal AI guide to achieving your goals
          </p>
        </div>
      </header>

      {/* Main Layout with Chat */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {renderDashboardContent()}
          </div>
        </main>

        {/* Chat Panel */}
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>

      {/* Chat Toggle Button */}
      {!isChatOpen && <ChatToggleButton onClick={() => setIsChatOpen(true)} />}
    </div>
  );
};

export default Index;
