
import React from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  endCall: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  endCall,
}) => {
  return (
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
  );
};

export default VideoControls;
