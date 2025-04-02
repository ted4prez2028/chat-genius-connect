
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
  // This is a simplified avatar representing a blonde woman character
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const hairRef = useRef<THREE.Group>(null);
  
  // Head bobbing animation
  useFrame((state) => {
    if (!headRef.current || !eyesRef.current || !hairRef.current) return;
    
    if (headMovement) {
      // Gentle idle animation
      headRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
      
      // Add subtle hair movement
      hairRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.7) * 0.02;
      hairRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.01;
    }
    
    if (isSpeaking) {
      // More expressive speaking animation
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 4) * 0.08;
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 3) * 0.04;
      
      // Hair follows head movement with slight delay
      hairRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 4 - 0.2) * 0.05;
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

  // Blonde hair color
  const blondeHairColor = new THREE.Color("#FFD700");
  // Skin tone
  const skinTone = new THREE.Color("#FFDBAC");
  // Eye color (blue)
  const eyeColor = new THREE.Color("#5DA9E9");
  // Lip color (soft pink)
  const lipColor = new THREE.Color("#FF9AA2");

  return (
    <group>
      {/* Head */}
      <group ref={headRef}>
        <mesh castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={skinTone} 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Hair - blonde woman hairstyle */}
        <group ref={hairRef} position={[0, 0.2, 0]}>
          {/* Main hair volume */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.8} 
              metalness={0.2}
            />
          </mesh>
          
          {/* Hair strands on sides */}
          <mesh position={[-0.9, -0.3, 0]} rotation={[0, 0, Math.PI * 0.1]} castShadow>
            <cylinderGeometry args={[0.15, 0.3, 1.2, 8]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.8} 
              metalness={0.2}
            />
          </mesh>
          
          <mesh position={[0.9, -0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]} castShadow>
            <cylinderGeometry args={[0.15, 0.3, 1.2, 8]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.8} 
              metalness={0.2}
            />
          </mesh>
          
          {/* Hair bangs */}
          <mesh position={[0, 0.65, 0.5]} rotation={[Math.PI * 0.1, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.3, 0.2]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.8} 
              metalness={0.2}
            />
          </mesh>
        </group>
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.2, 0.85]}>
          {/* Left eye */}
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" />
            
            {/* Blue iris */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color={eyeColor} />
              
              {/* Pupil */}
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.04, 32, 32]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" />
            
            {/* Blue iris */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color={eyeColor} />
              
              {/* Pupil */}
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.04, 32, 32]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </mesh>
          
          {/* Eyebrows */}
          <mesh position={[-0.3, 0.15, 0.1]} rotation={[0, 0, Math.PI * 0.1]}>
            <boxGeometry args={[0.2, 0.03, 0.02]} />
            <meshStandardMaterial color={blondeHairColor} />
          </mesh>
          
          <mesh position={[0.3, 0.15, 0.1]} rotation={[0, 0, -Math.PI * 0.1]}>
            <boxGeometry args={[0.2, 0.03, 0.02]} />
            <meshStandardMaterial color={blondeHairColor} />
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.95]} rotation={[Math.PI * 0.1, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 12]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        
        {/* Mouth */}
        <mesh 
          position={[0, -0.3, 0.85]} 
          rotation={[0, 0, isSpeaking ? Math.sin(Date.now() * 0.01) * 0.2 : 0]}
        >
          <boxGeometry args={[0.4, isSpeaking ? 0.15 : 0.05, 0.1]} />
          <meshStandardMaterial color={lipColor} />
        </mesh>
        
        {/* Earrings */}
        <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI * 0.5, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        <mesh position={[1.05, 0, 0]} rotation={[0, Math.PI * 0.5, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Loading indicator */}
      {isLoading && (
        <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#FF9AA2" />
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
