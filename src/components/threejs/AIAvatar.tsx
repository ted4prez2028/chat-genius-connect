
import React from "react";
import AvatarHead from "./AvatarHead";
import LoadingIndicator from "./LoadingIndicator";

interface AIAvatarProps {
  isLoading: boolean;
  isConnected: boolean;
  isSpeaking: boolean;
  headMovement?: boolean;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ 
  isLoading = false, 
  isConnected = false, 
  isSpeaking = false,
  headMovement = true
}) => {
  return (
    <group>
      <AvatarHead isSpeaking={isSpeaking} headMovement={headMovement} />
      <LoadingIndicator isLoading={isLoading} />
    </group>
  );
};

export default AIAvatar;
