
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { useVoiceDetection } from "@/hooks/useVoiceDetection";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import AIVideo from "./AIVideo";
import { 
  aiPhrases, 
  getInitialGreeting, 
  getMuteResponse, 
  getVideoResponse, 
  getVoiceDetectionResponse, 
  getConnectedResponse 
} from "@/data/aiResponses";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(true);
  
  const {
    localStream,
    isConnected,
    isMuted,
    isVideoOff,
    localVideoRef,
    initializeMedia,
    cleanupMedia,
    toggleMute,
    toggleVideo,
    setIsConnected
  } = useMediaDevices();
  
  const {
    userSpeaking,
    userVoiceDetected,
    setUserVoiceDetected,
    speakText,
    isAiSpeaking
  } = useVoiceDetection({ localStream, isMuted });

  useEffect(() => {
    if (isOpen) {
      initializeMedia();
      
      const timer = setTimeout(() => {
        setIsAiLoading(false);
        const greeting = getInitialGreeting();
        setAiResponses([greeting]);
        speakText(greeting);
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        cleanupMedia();
      };
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isConnected && aiResponses.length === 1) {
      const response = getConnectedResponse();
      setAiResponses(prev => [...prev, response]);
      speakText(response);
    }
  }, [isConnected]);
  
  useEffect(() => {
    if (userSpeaking && !userVoiceDetected && !isMuted) {
      setUserVoiceDetected(true);
      
      if (aiResponses.length < 3) {
        const response = getVoiceDetectionResponse();
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }
    }
  }, [userSpeaking, userVoiceDetected, isMuted]);
  
  useEffect(() => {
    if (!isAiSpeaking && Math.random() > 0.6 && aiResponses.length < 3) {
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * aiPhrases.length);
        const randomPhrase = aiPhrases[randomIndex];
        setAiResponses(prev => [...prev, randomPhrase]);
        speakText(randomPhrase);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAiSpeaking]);

  const handleToggleMute = () => {
    toggleMute();
    const response = getMuteResponse(isMuted);
    setAiResponses(prev => [...prev, response]);
    speakText(response);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    const response = getVideoResponse(isVideoOff);
    setAiResponses(prev => [...prev, response]);
    speakText(response);
  };

  const endCall = () => {
    cleanupMedia();
    onClose();
    toast.info("Call ended with Olivia, your Food Truck specialist");
  };

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
            {userSpeaking && !isMuted && (
              <span className="mr-3 text-xs bg-green-500 text-white py-1 px-2 rounded-full animate-pulse">
                Hearing you...
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <AIVideo
            isAiLoading={isAiLoading}
            isConnected={isConnected}
            isAiSpeaking={isAiSpeaking}
            currentAiResponse={aiResponses.length > 0 ? aiResponses[aiResponses.length - 1] : ""}
          />
          
          <LocalVideo
            localVideoRef={localVideoRef}
            localStream={localStream}
            isVideoOff={isVideoOff}
            userName={user?.name}
            userAvatar={user?.avatar}
            userSpeaking={userSpeaking}
            isMuted={isMuted}
          />
        </div>
        
        <VideoControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          toggleMute={handleToggleMute}
          toggleVideo={handleToggleVideo}
          endCall={endCall}
        />
      </div>
    </div>
  );
};

export default VideoCall;
