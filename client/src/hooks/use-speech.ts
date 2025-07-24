import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useSpeech() {
  const { toast } = useToast();

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;

      // Try to use a child-friendly voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('child') ||
        voice.name.toLowerCase().includes('young')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        toast({
          title: "Speech not available",
          description: "Unable to play audio. Please check your browser settings.",
          variant: "destructive",
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return { speak };
}
