import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-soft bg-primary hover:bg-primary/90 pulse-gentle z-40"
    >
      <MessageCircle className="w-7 h-7 text-primary-foreground" />
    </Button>
  );
};
