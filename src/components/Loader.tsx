import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 48, className = "" }: LoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary" size={size} />
    </div>
  );
};

