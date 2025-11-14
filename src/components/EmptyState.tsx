import { Sparkles } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] content-fade-in">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          Tell me about your goals
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          I'll build a personalized plan just for you ✨
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Ready to help you grow
        </div>
      </div>
    </div>
  );
};
