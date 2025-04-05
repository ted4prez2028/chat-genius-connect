
import { useState, useRef, useEffect } from "react";

interface UseVoiceDetectionProps {
  localStream: MediaStream | null;
  isMuted: boolean;
}

interface UseVoiceDetectionReturn {
  userSpeaking: boolean;
  userVoiceDetected: boolean;
  setUserVoiceDetected: React.Dispatch<React.SetStateAction<boolean>>;
  speakText: (text: string) => void;
  isAiSpeaking: boolean;
}

export const useVoiceDetection = ({ 
  localStream, 
  isMuted 
}: UseVoiceDetectionProps): UseVoiceDetectionReturn => {
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [userVoiceDetected, setUserVoiceDetected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (localStream) {
      setupVoiceDetection(localStream);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [localStream]);

  const setupVoiceDetection = (stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      detectVoice();
    } catch (err) {
      console.error("Error setting up voice detection:", err);
    }
  };

  const detectVoice = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
    
    const threshold = 30;
    const newUserSpeaking = average > threshold;
    
    if (newUserSpeaking !== userSpeaking) {
      setUserSpeaking(newUserSpeaking);
    }
    
    animationFrameRef.current = requestAnimationFrame(detectVoice);
  };

  const speakText = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAiSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Tessa') ||
        voice.name.includes('Fiona')
      );
      
      if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0];
      }
      
      utterance.onend = () => {
        setIsAiSpeaking(false);
      };
      
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          const updatedFemaleVoices = updatedVoices.filter(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Karen') ||
            voice.name.includes('Tessa') ||
            voice.name.includes('Fiona')
          );
          
          if (updatedFemaleVoices.length > 0) {
            utterance.voice = updatedFemaleVoices[0];
          }
          
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return {
    userSpeaking,
    userVoiceDetected,
    setUserVoiceDetected,
    speakText,
    isAiSpeaking
  };
};
