
import { Bot, Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { mockProducts, Product } from "@/data/mockProducts";

interface AIAssistantButtonProps {
  selectedProduct?: Product | null;
}

const AIAssistantButton = ({ selectedProduct }: AIAssistantButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript + ' ');
            console.log('Voice input:', finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Generate recommendations when a product is selected and AI is active
    if (selectedProduct && isActive) {
      const relatedProducts = mockProducts
        .filter(p => 
          p.id !== selectedProduct.id && 
          (p.category === selectedProduct.category || p.company === selectedProduct.company)
        )
        .slice(0, 3);
      setRecommendations(relatedProducts);
    } else {
      setRecommendations([]);
    }
  }, [selectedProduct, isActive]);

  const toggleAI = () => {
    setIsActive(!isActive);
    if (isActive) {
      // Deactivate AI
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript("");
      setRecommendations([]);
    }
  };

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported');
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

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <>
      {/* Main AI Assistant Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="lg"
          className={`h-16 w-16 rounded-full tech-gradient hover:opacity-90 transition-all duration-300 animate-float shadow-2xl neon-glow ${
            isActive ? 'ring-4 ring-primary/50' : ''
          }`}
          onClick={toggleAI}
        >
          <Bot className={`h-8 w-8 text-white ${isActive ? 'animate-pulse-slow' : ''}`} />
        </Button>
      </div>

      {/* AI Assistant Interface */}
      {isActive && (
        <div className="fixed bottom-24 left-6 z-40 w-80">
          <Card className="glass-effect border-primary/30 p-4 shadow-2xl animate-scale-in">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary animate-pulse-slow" />
                  <span className="font-semibold text-primary">AI Assistant Active</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-primary/20"
                  onClick={toggleAI}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Voice Input</span>
                  <Button
                    size="sm"
                    variant={isListening ? "destructive" : "default"}
                    className="tech-gradient"
                    onClick={toggleMicrophone}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isListening ? "Stop" : "Listen"}
                  </Button>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="glass-effect border-primary/20 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Transcript:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-xs"
                        onClick={clearTranscript}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground max-h-20 overflow-y-auto">
                      {transcript}
                    </p>
                  </div>
                )}

                {/* Listening Indicator */}
                {isListening && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    Listening...
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Product Recommendations */}
      {isActive && recommendations.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 w-72">
          <Card className="glass-effect border-primary/30 p-4 shadow-2xl animate-scale-in">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">AI Recommendations</span>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 glass-effect border-primary/20 rounded cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => console.log('Recommended product clicked:', product.name)}
                  >
                    <img
                      src={`https://images.unsplash.com/${product.image}?w=40&h=40&fit=crop`}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIAssistantButton;
