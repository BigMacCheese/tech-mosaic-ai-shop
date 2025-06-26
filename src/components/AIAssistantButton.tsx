
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIAssistantButton = () => {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        size="lg"
        className="h-16 w-16 rounded-full tech-gradient hover:opacity-90 transition-all duration-300 animate-float shadow-2xl neon-glow"
        onClick={() => {
          console.log("AI Assistant clicked - feature coming soon!");
        }}
      >
        <Bot className="h-8 w-8 text-white animate-pulse-slow" />
      </Button>
    </div>
  );
};

export default AIAssistantButton;
