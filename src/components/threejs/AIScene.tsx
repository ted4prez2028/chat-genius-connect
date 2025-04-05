
import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AIAvatar from "./AIAvatar";

interface AISceneProps {
  isLoading: boolean;
  isConnected: boolean;
  isSpeaking: boolean;
}

const AIScene: React.FC<AISceneProps> = ({ 
  isLoading = false,
  isConnected = false,
  isSpeaking = false
}) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 3.5);
  }, [camera]);
  
  return (
    <>
      {/* Enhanced lighting for more photorealistic appearance */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.6} />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="white" />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.4}
        maxPolarAngle={Math.PI / 2 + 0.4}
      />
      <AIAvatar 
        isLoading={isLoading} 
        isConnected={isConnected} 
        isSpeaking={isSpeaking} 
      />
    </>
  );
};

export default AIScene;
