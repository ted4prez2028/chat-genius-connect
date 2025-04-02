
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";
import { toast } from "sonner";
import Peer from "simple-peer";

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

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  // AI avatar phrases
  const aiPhrases = [
    "Hello! I'm your Food Truck Community AI assistant. How can I help you today?",
    "I can help you book a food truck for your event or answer questions about our vendors.",
    "Would you like information about our most popular food trucks?",
    "Did you know we have over 50 different food trucks in our network?",
    "I can help you with scheduling, menu options, or special dietary requirements.",
    "Is there anything specific about our food truck community you'd like to learn?",
  ];

  useEffect(() => {
    if (isOpen) {
      initializeMedia();
      
      // Simulate AI greeting after 1 second
      const timer = setTimeout(() => {
        const greeting = aiPhrases[0];
        setAiResponses([greeting]);
        speakText(greeting);
      }, 1000);
      
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
      
      // Create AI video stream (would be replaced with actual AI avatar)
      const aiVideoElement = document.createElement('video');
      aiVideoElement.src = "/avatars/ai-avatar.mp4";
      aiVideoElement.loop = true;
      aiVideoElement.muted = true;
      aiVideoElement.play().catch(err => console.error("Error playing AI video:", err));
      
      // Create a canvas to capture the video as a stream
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      // Create a MediaStream from the canvas
      const aiStream = canvas.captureStream(30);
      
      // Animation loop to draw the video to the canvas
      const drawVideo = () => {
        if (ctx && !aiVideoElement.paused && !aiVideoElement.ended) {
          ctx.drawImage(aiVideoElement, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawVideo);
        }
      };
      
      aiVideoElement.onplay = () => {
        drawVideo();
      };
      
      setRemoteStream(aiStream);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = aiStream;
      }
      
      // Set connected state after a slight delay to simulate connection establishment
      setTimeout(() => {
        setIsConnected(true);
        toast.success("Connected to AI assistant");
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
      
      // AI response to being muted/unmuted
      if (!isMuted) {
        const response = "I notice you've muted your microphone. Let me know when you're ready to speak again.";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "I can hear you again. How can I help you?";
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
      
      // AI response to video being turned off/on
      if (!isVideoOff) {
        const response = "I see you've turned off your camera. That's fine, I can still hear you.";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "Nice to see you again!";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }
    }
  };

  const endCall = () => {
    cleanupMedia();
    onClose();
    toast.info("Call ended");
  };

  const speakText = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAiSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
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
        if (Math.random() > 0.6 && aiResponses.length < 3) {
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
        <div className="p-4 bg-brand-pink text-white flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2">
              <AvatarImage src="/avatars/ai-assistant.png" alt="AI Assistant" />
              <AvatarFallback className="bg-purple-800">AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Food Truck AI Assistant</h3>
              <p className="text-xs opacity-80">{isConnected ? "Connected" : "Connecting..."}</p>
            </div>
          </div>
          <div>
            {isAiSpeaking && (
              <span className="mr-3 text-xs bg-white text-brand-pink py-1 px-2 rounded-full animate-pulse">
                Speaking...
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gray-900">
            {remoteStream && (
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
            )}
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-60 text-white rounded-lg text-sm">
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
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="text-2xl">{user?.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-60 text-white rounded-lg text-sm">
              {user?.displayName || 'You'}
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
