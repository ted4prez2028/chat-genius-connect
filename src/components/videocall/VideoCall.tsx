
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

  // Enhanced AI assistant phrases with detailed knowledge about the Food Truck platform
  const aiPhrases = [
    "Hi there! I'm Olivia, your Food Truck Community specialist. I can help you discover amazing food trucks for your events or assist you with our dashboard features.",
    "Our platform connects you with over 50 unique food trucks across multiple cuisines. Would you like me to walk you through our booking process?",
    "I see you're in the calendar view! This is perfect for scheduling multiple food truck events. You can drag and drop to reschedule, or click on a day to add a new booking.",
    "The dashboard provides real-time analytics on your food truck events. The summary cards at the top show your key metrics at a glance.",
    "Did you know our platform offers instant chat support with food truck vendors? It's perfect for discussing menu customizations or special requirements.",
    "The tags section on your dashboard helps categorize your events by cuisine type, event size, or budget range. It makes filtering and reporting much easier.",
    "Our Daily Sales Chart shows your booking trends over time. It's helpful for identifying peak seasons and planning your marketing efforts.",
    "The Package Sales table shows which of our booking packages are most popular. Premium packages include extra services like setup assistance and marketing support.",
    "Our payment processing is secure and supports multiple payment methods including credit cards, digital wallets, and even split payments for group events.",
    "I'd be happy to explain any aspect of our platform in more detail. Just let me know what you're interested in learning more about!"
  ];

  useEffect(() => {
    if (isOpen) {
      initializeMedia();
      
      // Simulate AI greeting after 1 second with knowledge of current page
      const timer = setTimeout(() => {
        setIsAiLoading(false);
        const greeting = "Hi there! I'm Olivia, your Food Truck Community specialist. I see you're exploring our calendar view! This is perfect for scheduling and managing your food truck events. How can I assist you today?";
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
        toast.success("Connected to Olivia, your Food Truck specialist");
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
      
      // AI response to being muted/unmuted with more personality and website knowledge
      if (!isMuted) {
        const response = "I see you've muted your microphone. No problem! While we're on pause, I can mention that our calendar view allows you to color-code events by cuisine type. Just let me know when you're ready to chat again!";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "Great, I can hear you again! Were you interested in learning about how to use the dashboard features or did you have questions about booking a food truck?";
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
      
      // AI response to video being turned off/on with more website knowledge
      if (!isVideoOff) {
        const response = "I see you've turned your camera off. That's fine! Did you know you can filter food trucks by dietary requirements like vegan, gluten-free, or nut-free options in our search?";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "There you are! Welcome back. The calendar view you're looking at now supports drag-and-drop functionality to easily reschedule your events.";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }
    }
  };

  const endCall = () => {
    cleanupMedia();
    onClose();
    toast.info("Call ended with Olivia, your Food Truck specialist");
  };

  const speakText = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAiSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.2; // Higher pitch for female voice
      utterance.volume = 1;
      
      // Force female voice selection
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
        
        // Randomly decide if AI should continue speaking with site knowledge
        if (Math.random() > 0.6 && aiResponses.length < 3) {
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * aiPhrases.length);
            const randomPhrase = aiPhrases[randomIndex];
            setAiResponses(prev => [...prev, randomPhrase]);
            speakText(randomPhrase);
          }, 2000);
        }
      };
      
      // Initialize voices if not loaded yet
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

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="p-4 bg-pink-500 text-white flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2 border-2 border-white">
              <AvatarImage src="/avatars/ai-assistant.png" alt="Olivia - Food Truck Specialist" />
              <AvatarFallback className="bg-purple-300 text-pink-700">OL</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Olivia - Food Truck Specialist</h3>
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
