import { useState } from "react";
import { X, Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAIChat, type ChatResponse, type LegacyChatResponse, type FinancialPlanData, type Course } from "@/hooks/useAIChat";
import { useChatContext } from "@/contexts/ChatContext";
import { FinancialPlanMessage } from "@/components/FinancialPlanMessage";
import { CoursesMessage } from "@/components/CoursesMessage";
import { TodoListMessage } from "@/components/TodoListMessage";

interface BaseMessage {
  id: string;
  role: "user" | "assistant";
}

interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

interface FinancialPlanMessageType extends BaseMessage {
  type: "financial_plan";
  data: FinancialPlanData;
}

interface CoursesMessageType extends BaseMessage {
  type: "courses";
  courses: Course[];
  aiMessage?: string;
}

interface TodoListMessageType extends BaseMessage {
  type: "todo_list";
  content: string;
}

type Message = TextMessage | FinancialPlanMessageType | CoursesMessageType | TodoListMessageType;

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      type: "text",
      content: "Hi there! ✨ I'm your personal growth companion. Tell me about your goals, and I'll help you create a personalized roadmap to achieve them!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { sendPrompt, loading: hookLoading, error } = useAIChat();
  const { setResponse, setLoading, loading: contextLoading } = useChatContext();
  
  // Use context loading for dashboard, hook loading for chat UI
  const loading = hookLoading || contextLoading;

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: TextMessage = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue("");

    try {
      // Update loading state in context before API call
      setLoading(true);
      const data: ChatResponse | LegacyChatResponse = await sendPrompt(userInput);
      
      // Update context with response
      setResponse(data);
      
      // Handle command protocol or legacy response
      let aiMessage: Message;
      
      if ('command' in data) {
        // Command protocol response
        if (data.command.action === 'text_reply') {
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "text",
            content: data.command.text,
          };
        } else if (data.command.action === 'show_component') {
          // For show_component, show a message indicating what component was shown
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "text",
            content: `I've displayed the ${data.command.component} component on your dashboard.`,
          };
        } else {
          // Redirect command
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "text",
            content: `Redirecting to ${data.command.url}...`,
          };
        }
      } else {
        // Legacy response format
        const legacyData = data as LegacyChatResponse;
        const responseType = legacyData.responseType || legacyData.type || 'text';
        
        if (responseType === 'financial_plan' && legacyData.data) {
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "financial_plan",
            data: legacyData.data,
          };
        } else if (responseType === 'courses' && legacyData.courses) {
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "courses",
            courses: legacyData.courses,
            aiMessage: legacyData.aiMessage,
          };
        } else if (responseType === 'todo_list') {
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "todo_list",
            content: legacyData.response || '',
          };
        } else {
          // Regular text response
          aiMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "text",
            content: legacyData.response || 'No response received.',
          };
        }
      }
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // Error is already handled by the hook and displayed via error state
      setResponse(null);
      const errorMessage: TextMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        type: "text",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.role === "user") {
      return <span className="text-sm whitespace-pre-wrap">{message.content}</span>;
    }

    switch (message.type) {
      case "financial_plan":
        return <FinancialPlanMessage data={message.data} />;
      case "courses":
        return <CoursesMessage courses={message.courses} aiMessage={message.aiMessage} />;
      case "todo_list":
        return <TodoListMessage content={message.content} />;
      case "text":
      default:
        return <span className="text-sm whitespace-pre-wrap">{message.content}</span>;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Chat Panel */}
      <div 
        className={`
          fixed md:relative right-0 top-0 h-full
          bg-card md:border-l md:border-border shadow-soft z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${
            isOpen 
              ? 'translate-x-0 w-full md:w-[400px]' 
              : 'translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
          }
        `}
      >
        <div className={`flex flex-col h-full ${isOpen ? '' : 'md:hidden'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Your AI Companion</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "user" ? (
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground">
                      <span className="text-sm whitespace-pre-wrap">{message.content}</span>
                    </div>
                  ) : (
                    <div className="max-w-[95%] md:max-w-[85%]">
                      {(message.type === "text" || message.type === "todo_list") && (
                        <div className="rounded-2xl px-4 py-3 bg-secondary text-secondary-foreground">
                          {message.type === "text" && (
                            <Sparkles className="w-3 h-3 inline-block mr-1 mb-0.5" />
                          )}
                          {renderMessage(message)}
                        </div>
                      )}
                      {(message.type === "financial_plan" || message.type === "courses") && (
                        <div className="rounded-2xl px-4 py-3 bg-secondary text-secondary-foreground">
                          <Sparkles className="w-3 h-3 inline-block mr-1 mb-2" />
                          {renderMessage(message)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border space-y-2">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Share your goals..."
                className="flex-1 rounded-full bg-input border-border"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90"
                disabled={loading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
