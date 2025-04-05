
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LocalVideoProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  localStream: MediaStream | null;
  isVideoOff: boolean;
  userName: string | undefined;
  userAvatar: string | undefined;
  userSpeaking: boolean;
  isMuted: boolean;
}

const LocalVideo: React.FC<LocalVideoProps> = ({
  localVideoRef,
  localStream,
  isVideoOff,
  userName,
  userAvatar,
  userSpeaking,
  isMuted,
}) => {
  return (
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
            <AvatarImage src={userAvatar} alt={userName || 'User'} />
            <AvatarFallback className="text-2xl">{userName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      )}
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userAvatar} alt={userName || 'User'} />
            <AvatarFallback className="text-2xl">{userName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-60 text-white rounded-lg text-sm">
        {userName || 'You'} {userSpeaking && !isMuted && <span className="text-green-400 animate-pulse">●</span>}
      </div>
    </div>
  );
};

export default LocalVideo;
