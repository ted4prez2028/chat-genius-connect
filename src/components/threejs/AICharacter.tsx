
import React from "react";
import { Canvas } from "@react-three/fiber";
import AIScene from "./AIScene";

interface AICharacterProps {
  isLoading?: boolean;
  isConnected?: boolean;
  isSpeaking?: boolean;
}

const AICharacter: React.FC<AICharacterProps> = ({ 
  isLoading = false,
  isConnected = false,
  isSpeaking = false
}) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <AIScene 
          isLoading={isLoading} 
          isConnected={isConnected} 
          isSpeaking={isSpeaking} 
        />
      </Canvas>
    </div>
  );
};

export default AICharacter;
