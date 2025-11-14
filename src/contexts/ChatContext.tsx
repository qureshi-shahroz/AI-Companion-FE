import { createContext, useContext, useState, ReactNode } from 'react';
import type { ChatResponse, LegacyChatResponse, Command } from '@/hooks/useAIChat';

interface ChatContextType {
  response: ChatResponse | LegacyChatResponse | null;
  command: Command | null;
  setResponse: (response: ChatResponse | LegacyChatResponse | null) => void;
  setCommand: (command: Command | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [response, setResponse] = useState<ChatResponse | LegacyChatResponse | null>(null);
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <ChatContext.Provider value={{ response, command, setResponse, setCommand, loading, setLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

