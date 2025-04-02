
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const AIAvatar = ({ 
  isLoading = false, 
  isConnected = false, 
  isSpeaking = false,
  headMovement = true
}) => {
  // This is a simplified avatar using a 3D sphere with eyes
  // In a real implementation, you would load a proper 3D model with animations
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  
  // Head bobbing animation
  useFrame((state) => {
    if (!headRef.current || !eyesRef.current) return;
    
    if (headMovement) {
      // Gentle idle animation
      headRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
    
    if (isSpeaking) {
      // More active speaking animation
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
    }
    
    // Blinking occasionally
    if (Math.sin(state.clock.getElapsedTime() * 0.5) > 0.95) {
      eyesRef.current.scale.y = 0.1;
    } else {
      eyesRef.current.scale.y = 1;
    }
    
    // Look around occasionally
    if (!isSpeaking && headMovement) {
      eyesRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  return (
    <group>
      {/* Head */}
      <group ref={headRef}>
        <mesh castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={isConnected ? "#8a2be2" : "#666666"} 
            roughness={0.7} 
            metalness={0.3}
          />
        </mesh>
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.2, 0.85]}>
          {/* Left eye */}
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.06, 32, 32]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.06, 32, 32]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh position={[0, -0.3, 0.85]} rotation={[0, 0, isSpeaking ? Math.sin(Date.now() * 0.01) * 0.3 : 0]}>
          <boxGeometry args={[0.5, isSpeaking ? 0.15 : 0.05, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      
      {/* Loading indicator */}
      {isLoading && (
        <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#8a2be2" />
        </mesh>
      )}
    </group>
  );
};

const Scene = ({ 
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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.5}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
      <AIAvatar 
        isLoading={isLoading} 
        isConnected={isConnected} 
        isSpeaking={isSpeaking} 
      />
    </>
  );
};

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
        <Scene 
          isLoading={isLoading} 
          isConnected={isConnected} 
          isSpeaking={isSpeaking} 
        />
      </Canvas>
    </div>
  );
};

export default AICharacter;
