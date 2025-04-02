
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
  // This is a photorealistic blonde woman avatar representation
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const hairRef = useRef<THREE.Group>(null);
  const lipsRef = useRef<THREE.Group>(null);
  
  // Head animation with more natural movements
  useFrame((state) => {
    if (!headRef.current || !eyesRef.current || !hairRef.current || !lipsRef.current) return;
    
    if (headMovement) {
      // More subtle and natural idle animation
      headRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
      headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
      
      // More realistic hair movement with slight delay from head movement
      hairRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.015;
      hairRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.35) * 0.008;
    }
    
    if (isSpeaking) {
      // More natural speaking animation
      lipsRef.current.scale.y = 0.8 + Math.sin(state.clock.getElapsedTime() * 8) * 0.2;
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.025;
      
      // Hair follows head movement with slight delay
      hairRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2 - 0.15) * 0.03;
    } else {
      lipsRef.current.scale.y = 1;
    }
    
    // More realistic blinking occasionally
    if (Math.sin(state.clock.getElapsedTime() * 0.5) > 0.97) {
      eyesRef.current.scale.y = 0.1;
    } else {
      eyesRef.current.scale.y = 1;
    }
    
    // Occasional eye movement
    if (!isSpeaking && headMovement) {
      eyesRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
    }
  });

  // Enhanced photorealistic materials
  // Blonde hair color with highlights
  const blondeHairColor = new THREE.Color("#F7DC9F");
  const blondeHighlightColor = new THREE.Color("#FFECBD");
  // More natural skin tone
  const skinTone = new THREE.Color("#FFDBAC");
  // Bright blue eyes
  const eyeColor = new THREE.Color("#5DA9E9");
  // Natural pink lips
  const lipColor = new THREE.Color("#EB9C9C");

  return (
    <group>
      {/* Head with enhanced geometry */}
      <group ref={headRef}>
        <mesh castShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color={skinTone} 
            roughness={0.4} 
            metalness={0.1}
            envMapIntensity={0.8}
          />
        </mesh>
        
        {/* Enhanced blonde hairstyle with volume and layers */}
        <group ref={hairRef} position={[0, 0.2, 0]}>
          {/* Main hair volume with more detailed geometry */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[1.1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.6} 
              metalness={0.3}
            />
          </mesh>
          
          {/* Hair highlights layer */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <sphereGeometry args={[1.11, 48, 48, 0, Math.PI * 1.5, 0, Math.PI * 0.4]} />
            <meshStandardMaterial 
              color={blondeHighlightColor} 
              roughness={0.5} 
              metalness={0.3}
              transparent={true}
              opacity={0.6}
            />
          </mesh>
          
          {/* Enhanced hair strands on sides */}
          <mesh position={[-0.9, -0.3, 0]} rotation={[0, 0, Math.PI * 0.1]} castShadow>
            <cylinderGeometry args={[0.12, 0.22, 1.4, 16]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.6} 
              metalness={0.3}
            />
          </mesh>
          
          <mesh position={[0.9, -0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]} castShadow>
            <cylinderGeometry args={[0.12, 0.22, 1.4, 16]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.6} 
              metalness={0.3}
            />
          </mesh>
          
          {/* Hair bangs with more definition */}
          <mesh position={[0, 0.65, 0.5]} rotation={[Math.PI * 0.1, 0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.3, 0.15]} />
            <meshStandardMaterial 
              color={blondeHairColor} 
              roughness={0.6} 
              metalness={0.3}
            />
          </mesh>
          
          {/* Side swept bangs for more styling */}
          <mesh position={[-0.7, 0.6, 0.4]} rotation={[Math.PI * 0.05, 0, Math.PI * -0.1]} castShadow>
            <boxGeometry args={[0.6, 0.15, 0.1]} />
            <meshStandardMaterial 
              color={blondeHighlightColor} 
              roughness={0.5} 
              metalness={0.3}
            />
          </mesh>
        </group>
        
        {/* Enhanced eyes with more detail */}
        <group ref={eyesRef} position={[0, 0.2, 0.85]}>
          {/* Left eye with improved materials */}
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" roughness={0.2} />
            
            {/* Enhanced blue iris */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color={eyeColor} roughness={0.1} metalness={0.1} />
              
              {/* Pupil with light reflection */}
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.04, 32, 32]} />
                <meshStandardMaterial color="black" />
                
                {/* Catch light */}
                <mesh position={[0.02, 0.02, 0.03]} scale={[0.015, 0.015, 0.01]}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshBasicMaterial color="white" />
                </mesh>
              </mesh>
            </mesh>
          </mesh>
          
          {/* Right eye with improved materials */}
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="white" roughness={0.2} />
            
            {/* Enhanced blue iris */}
            <mesh position={[0, 0, 0.08]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <meshStandardMaterial color={eyeColor} roughness={0.1} metalness={0.1} />
              
              {/* Pupil with light reflection */}
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.04, 32, 32]} />
                <meshStandardMaterial color="black" />
                
                {/* Catch light */}
                <mesh position={[0.02, 0.02, 0.03]} scale={[0.015, 0.015, 0.01]}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshBasicMaterial color="white" />
                </mesh>
              </mesh>
            </mesh>
          </mesh>
          
          {/* More sculpted eyebrows */}
          <mesh position={[-0.3, 0.15, 0.1]} rotation={[0, 0, Math.PI * 0.08]}>
            <boxGeometry args={[0.2, 0.025, 0.02]} />
            <meshStandardMaterial color={blondeHairColor} />
          </mesh>
          
          <mesh position={[0.3, 0.15, 0.1]} rotation={[0, 0, -Math.PI * 0.08]}>
            <boxGeometry args={[0.2, 0.025, 0.02]} />
            <meshStandardMaterial color={blondeHairColor} />
          </mesh>
          
          {/* Eyelashes for added realism */}
          <mesh position={[-0.3, 0.12, 0.15]} rotation={[Math.PI * 0.1, 0, 0]}>
            <boxGeometry args={[0.22, 0.01, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          <mesh position={[0.3, 0.12, 0.15]} rotation={[Math.PI * 0.1, 0, 0]}>
            <boxGeometry args={[0.22, 0.01, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        
        {/* Enhanced nose with more natural shape */}
        <mesh position={[0, 0, 0.95]} rotation={[Math.PI * 0.1, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 16]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        
        {/* Enhanced lips with better shape and animation */}
        <group ref={lipsRef} position={[0, -0.3, 0.85]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.35, 0.06, 0.1]} />
            <meshStandardMaterial 
              color={lipColor} 
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
          
          {/* Lower lip with slightly darker shade */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.08]} />
            <meshStandardMaterial 
              color={new THREE.Color(lipColor).multiplyScalar(0.9)} 
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        </group>
        
        {/* Enhanced earrings */}
        <mesh position={[-1.05, 0, 0]} rotation={[0, Math.PI * 0.5, 0]}>
          <torusGeometry args={[0.08, 0.02, 12, 24]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          
          {/* Small diamond on earring */}
          <mesh position={[0, -0.1, 0]}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color="white" metalness={0.5} roughness={0.1} />
          </mesh>
        </mesh>
        
        <mesh position={[1.05, 0, 0]} rotation={[0, Math.PI * 0.5, 0]}>
          <torusGeometry args={[0.08, 0.02, 12, 24]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          
          {/* Small diamond on earring */}
          <mesh position={[0, -0.1, 0]}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color="white" metalness={0.5} roughness={0.1} />
          </mesh>
        </mesh>
      </group>
      
      {/* Loading indicator with animation */}
      {isLoading && (
        <group position={[0, -1.5, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.5, 0.7, 32]} />
            <meshStandardMaterial color="#FF9AA2" />
          </mesh>
          <pointLight position={[0, 0, 1]} intensity={0.5} color="#FF9AA2" />
        </group>
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
