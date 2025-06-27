
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
}

interface AIAssistantButtonProps {
  selectedProduct: Product | null;
}

const AIAssistantButton = ({ selectedProduct }: AIAssistantButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + " " + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedProduct && isActive) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  }, [selectedProduct, isActive]);

  const toggleAssistant = () => {
    setIsActive(!isActive);
    if (isActive) {
      // Deactivate everything
      setIsListening(false);
      setTranscript("");
      setShowRecommendations(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const mockRecommendations = selectedProduct 
    ? [
        { 
          id: 999, 
          name: `Premium ${selectedProduct.category} Alternative`, 
          price: selectedProduct.price + 200,
          image: "photo-1488590528505-98d2b5aba04b"
        },
        { 
          id: 998, 
          name: `Budget ${selectedProduct.category} Option`, 
          price: selectedProduct.price - 150,
          image: "photo-1518770660439-4636190af475"
        },
        { 
          id: 997, 
          name: `${selectedProduct.company} Upgraded Model`, 
          price: selectedProduct.price + 300,
          image: "photo-1531297484001-80022131f5a1"
        },
      ]
    : [];

  return (
    <>
      {/* Main AI Assistant Button - moved to top-left */}
      <div className="fixed top-6 left-6 z-[70]">
        <Button
          onClick={toggleAssistant}
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
            isActive 
              ? 'tech-gradient hover:opacity-90' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isActive ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Voice Interface - positioned below the button */}
      {isActive && (
        <div className="fixed top-24 left-6 z-[70]">
          <div className="glass-effect border border-primary/30 rounded-lg p-4 w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">AI Assistant</h3>
              <Button
                onClick={toggleListening}
                variant="outline"
                size="sm"
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                    : 'border-primary/30'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening..." : "Click the microphone to start"}
              </p>
              {transcript && (
                <div className="bg-secondary/20 rounded p-2">
                  <p className="text-sm font-medium mb-1">Transcript:</p>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Recommendations - positioned on the right side */}
      {showRecommendations && selectedProduct && (
        <div className="fixed top-24 right-6 z-[70]">
          <div className="glass-effect border border-primary/30 rounded-lg p-4 w-80">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Recommended for you
            </h3>
            <div className="space-y-3">
              {mockRecommendations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 hover:bg-secondary/20 rounded cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary/20 flex-shrink-0">
                    <img
                      src={`https://images.unsplash.com/${item.image}?w=100&h=100&fit=crop`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-primary font-semibold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantButton;
