
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';

export const useVoiceAssistant = (selectedProduct?: Product | null) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognized:', transcript);
      setTranscript(transcript);
      setIsListening(false);
      
      // Send to Gemini
      await sendToGemini(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    return recognition;
  }, []);

  const sendToGemini = async (message: string) => {
    try {
      console.log('Sending message to Gemini:', message);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message,
          selectedProduct: selectedProduct
        }
      });

      if (error) {
        console.error('Error calling Gemini function:', error);
        speak('Lo siento, hubo un error al procesar tu pregunta.');
        return;
      }

      const response = data?.response || 'Lo siento, no pude procesar tu pregunta.';
      console.log('Gemini response:', response);
      speak(response);

    } catch (error) {
      console.error('Error in sendToGemini:', error);
      speak('Lo siento, hubo un error al procesar tu pregunta.');
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('Speech synthesis started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech synthesis ended');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current = window.speechSynthesis;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [initializeSpeechRecognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const startAssistant = useCallback(() => {
    // First, greet the user
    speak('¡Hola! Soy tu asistente de TechStock. ¿En qué puedo ayudarte hoy?');
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    stopSpeaking,
    startAssistant
  };
};
