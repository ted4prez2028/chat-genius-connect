
import React from "react";
import AICharacter from "@/components/threejs/AICharacter";

interface AIVideoProps {
  isAiLoading: boolean;
  isConnected: boolean;
  isAiSpeaking: boolean;
  currentAiResponse: string;
}

const AIVideo: React.FC<AIVideoProps> = ({
  isAiLoading,
  isConnected,
  isAiSpeaking,
  currentAiResponse,
}) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-64 lg:h-80 bg-gradient-to-b from-pink-50 to-purple-100">
      <AICharacter 
        isLoading={isAiLoading}
        isConnected={isConnected}
        isSpeaking={isAiSpeaking}
      />
      <div className="absolute bottom-2 left-2 right-2 p-2 bg-pink-500 bg-opacity-80 text-white rounded-lg text-sm">
        {currentAiResponse}
      </div>
    </div>
  );
};

export default AIVideo;
