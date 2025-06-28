
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { Product } from "@/hooks/useProducts";

interface AIAssistantButtonProps {
  selectedProduct?: Product | null;
}

const AIAssistantButton = ({ selectedProduct }: AIAssistantButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  
  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    stopSpeaking,
    startAssistant
  } = useVoiceAssistant(selectedProduct);

  const handleToggleAssistant = () => {
    if (!isActive) {
      // Start the assistant
      setIsActive(true);
      startAssistant();
    } else {
      // Stop everything
      setIsActive(false);
      stopListening();
      stopSpeaking();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Voice controls - only show when assistant is active */}
      {isActive && (
        <div className="flex flex-col gap-2">
          {/* Microphone toggle */}
          <Button
            size="sm"
            variant={isListening ? "destructive" : "secondary"}
            onClick={handleMicToggle}
            className="h-12 w-12 rounded-full shadow-lg"
            disabled={isSpeaking}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          {/* Speaker toggle */}
          <Button
            size="sm"
            variant={isSpeaking ? "destructive" : "secondary"}
            onClick={handleSpeakToggle}
            className="h-12 w-12 rounded-full shadow-lg"
            disabled={isListening}
          >
            {isSpeaking ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      {/* Main assistant button */}
      <Button
        size="lg"
        onClick={handleToggleAssistant}
        className={`h-16 w-16 rounded-full shadow-lg transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90'
        }`}
      >
        <div className="relative">
          {/* AI Icon */}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          </div>
          
          {/* Status indicators */}
          {isListening && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          {isSpeaking && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
      </Button>

      {/* Status text */}
      {isActive && (
        <div className="text-xs text-center text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
          {isListening && "Escuchando..."}
          {isSpeaking && "Hablando..."}
          {!isListening && !isSpeaking && "Listo"}
        </div>
      )}
    </div>
  );
};

export default AIAssistantButton;
