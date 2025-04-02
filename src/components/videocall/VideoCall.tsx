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
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [userVoiceDetected, setUserVoiceDetected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const aiPhrases = [
    "Hi there! I'm Olivia, your Food Truck Community specialist. I can help you discover amazing food trucks for your events or assist you with our dashboard features.",
    "Our platform connects you with over 50 unique food trucks across multiple cuisines. Would you like me to walk you through our booking process?",
    "I see you're on the brands page! This is where you can manage your brand identity and customize how your food truck events look to customers.",
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
      
      const timer = setTimeout(() => {
        setIsAiLoading(false);
        const greeting = "Hi there! I'm Olivia, your Food Truck Community specialist. I can see you're exploring our brands page! This section helps you manage your food truck branding, logos, and color schemes. How can I assist you today?";
        setAiResponses([greeting]);
        speakText(greeting);
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        cleanupMedia();
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }
  }, [isOpen]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setupVoiceDetection(stream);
      
      setTimeout(() => {
        setIsConnected(true);
        toast.success("Connected to Olivia, your Food Truck specialist");
        
        const response = "Great! I can see and hear you now. Welcome to our virtual assistant service! I'm Olivia, and I'm here to help with anything related to our food truck platform. What can I help you with today?";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      }, 1500);
      
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast.error("Could not access camera or microphone. Please check your device permissions.");
    }
  };

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
      
      if (newUserSpeaking && !userVoiceDetected) {
        setUserVoiceDetected(true);
        
        if (!isMuted && aiResponses.length < 3) {
          const response = "I can hear you! Feel free to ask me about managing your food truck brands, customizing your vendor profile, or any other feature on our platform.";
          setAiResponses(prev => [...prev, response]);
          speakText(response);
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(detectVoice);
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
    setUserVoiceDetected(false);
    setUserSpeaking(false);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      
      if (!isMuted) {
        const response = "I see you've muted your microphone. No problem! While we're on pause, I can mention that our brands section lets you customize your vendor profile with logos, color schemes, and marketing materials. Just let me know when you're ready to chat again!";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "Great, I can hear you again! Were you interested in learning about how to customize your brand profile or did you have questions about other aspects of our platform?";
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
      
      if (!isVideoOff) {
        const response = "I see you've turned your camera off. That's fine! Did you know you can upload custom brand assets in the brands section? You can add logos, banners, and even promotional images for your food truck business.";
        setAiResponses(prev => [...prev, response]);
        speakText(response);
      } else {
        const response = "There you are! Welcome back. In the brands section, you can create multiple brand profiles if you manage different food truck concepts or events.";
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
        
        if (Math.random() > 0.6 && aiResponses.length < 3) {
          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * aiPhrases.length);
            const randomPhrase = aiPhrases[randomIndex];
            setAiResponses(prev => [...prev, randomPhrase]);
            speakText(randomPhrase);
          }, 2000);
        }
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
          <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gradient-to-b from-pink-50 to-purple-100">
            <AICharacter 
              isLoading={isAiLoading}
              isConnected={isConnected}
              isSpeaking={isAiSpeaking}
            />
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-pink-500 bg-opacity-80 text-white rounded-lg text-sm">
              {aiResponses.length > 0 && aiResponses[aiResponses.length - 1]}
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gray-900">
            {localStream ? (
              <video
                ref={localVideoRef}
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="text-2xl">{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
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
              {user?.name || 'You'} {userSpeaking && !isMuted && <span className="text-green-400 animate-pulse">●</span>}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 p-4 border-t">
          <Button
            onClick={toggleMute}
            variant="outline"
            className={`rounded-full p-3 ${isMuted ? 'bg-red-100 text-red-500' : ''}`}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          
          <Button
            onClick={toggleVideo}
            variant="outline"
            className={`rounded-full p-3 ${isVideoOff ? 'bg-red-100 text-red-500' : ''}`}
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
