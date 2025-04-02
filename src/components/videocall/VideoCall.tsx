
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";
import { toast } from "sonner";
import Peer from "simple-peer";
import AICharacter from "@/components/threejs/AICharacter";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  // Enhanced AI assistant phrases with more personality
  const aiPhrases = [
    "Hi there! I'm Olivia, your Food Truck Community AI assistant. How can I brighten your day with some delicious food truck options?",
    "I'd be thrilled to help you book the perfect food truck for your event. What kind of cuisine are you craving?",
    "Did you know our top-rated food truck this month serves amazing fusion tacos? I've heard they're absolutely to die for!",
    "We have over 50 unique food trucks in our network - everything from gourmet grilled cheese to authentic Ethiopian cuisine!",
    "I can help with scheduling, special dietary requirements, or finding the perfect menu for your event. Just let me know what you need!",
    "Between us, the secret to a successful food truck event is variety. Have you considered booking multiple trucks with complementary menus?",
    "The weather looks perfect this weekend for an outdoor food event. Would you like me to check which trucks are available?",
    "I'm excited to help make your food truck experience amazing! What can I tell you about our services?"
  ];

  useEffect(() => {
    if (isOpen) {
      initializeMedia();
      
      // Simulate AI greeting after 1 second
      const timer = setTimeout(() => {
        setIsAiLoading(false);
        const greeting = aiPhrases[0];
        setAiResponses([greeting]);
        speakText(greeting);
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        cleanupMedia();
      };
    }
  }, [isOpen]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Set connected state after a slight delay to simulate connection establishment
      setTimeout(() => {
        setIsConnected(true);
        toast.success("Connected to Olivia, your AI assistant");
      }, 1500);
      
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast.error("Could not access camera or microphone");
    }
  };

  const cleanupMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    setIsConnected(false);
    setRemoteStream(null);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      
      // AI response to being muted/unmuted with more personality
      if (!isMuted) {
        const response = "I see you've muted your microphone. No worries! I'll be right here when you're ready to chat again. Take your time!";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "Oh, welcome back! I can hear you again. What food truck questions can I help you with?";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
      
      // AI response to video being turned off/on with more personality
      if (!isVideoOff) {
        const response = "Camera turned off, but that's totally fine! Sometimes it's nice to just focus on the conversation.";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "There you are! It's lovely to see your face again!";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }
    }
  };

  const endCall = () => {
    cleanupMedia();
    onClose();
    toast.info("Call ended with Olivia");
  };

  const speakText = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAiSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.2; // Slightly higher pitch for female voice
      utterance.volume = 1;
      
      // Use a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || voice.name.includes('woman')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onend = () => {
        setIsAiSpeaking(false);
        
        // Randomly decide if AI should continue speaking after a pause
        if (Math.random() > 0.5 && aiResponses.length < 3) {
          setTimeout(() => {
            const randomPhrase = aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
            setAiResponses(prev => [...prev, randomPhrase]);
            speakText(randomPhrase);
          }, 2000);
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="p-4 bg-pink-500 text-white flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2 border-2 border-white">
              <AvatarImage src="/avatars/ai-assistant.png" alt="Olivia - AI Assistant" />
              <AvatarFallback className="bg-purple-300 text-pink-700">OL</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Olivia - Food Truck AI Assistant</h3>
              <p className="text-xs opacity-80">{isConnected ? "Connected" : "Connecting..."}</p>
            </div>
          </div>
          <div>
            {isAiSpeaking && (
              <span className="mr-3 text-xs bg-white text-pink-500 py-1 px-2 rounded-full animate-pulse">
                Speaking...
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gradient-to-b from-pink-50 to-purple-100">
            {/* Enhanced AI Avatar using Three.js */}
            <div className="w-full h-full">
              <AICharacter 
                isLoading={isAiLoading}
                isConnected={isConnected}
                isSpeaking={isAiSpeaking}
              />
            </div>
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-pink-500 bg-opacity-80 text-white rounded-lg text-sm">
              {aiResponses.length > 0 && aiResponses[aiResponses.length - 1]}
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gray-900">
            {localStream && (
              <video
                ref={localVideoRef}
                className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`}
                autoPlay
                playsInline
                muted
              />
            )}
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="text-2xl">{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-60 text-white rounded-lg text-sm">
              {user?.name || 'You'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 p-4 border-t">
          <Button
            onClick={toggleMute}
            variant="outline"
            className={`rounded-full p-3 ${isMuted ? 'bg-red-100' : ''}`}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            onClick={toggleVideo}
            variant="outline"
            className={`rounded-full p-3 ${isVideoOff ? 'bg-red-100' : ''}`}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          
          <Button
            onClick={endCall}
            variant="destructive"
            className="rounded-full p-3"
          >
            <Phone className="rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
