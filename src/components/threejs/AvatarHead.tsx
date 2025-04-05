
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AvatarHeadProps {
  isSpeaking: boolean;
  headMovement: boolean;
}

const AvatarHead: React.FC<AvatarHeadProps> = ({ isSpeaking, headMovement }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const hairRef = useRef<THREE.Group>(null);
  const lipsRef = useRef<THREE.Group>(null);
  
  // Natural skin tone
  const skinTone = new THREE.Color("#FFDBAC");
  // Blonde hair color with highlights
  const blondeHairColor = new THREE.Color("#F7DC9F");
  const blondeHighlightColor = new THREE.Color("#FFECBD");
  // Bright blue eyes
  const eyeColor = new THREE.Color("#5DA9E9");
  // Natural pink lips
  const lipColor = new THREE.Color("#EB9C9C");

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

  return (
    <group ref={headRef}>
      {/* Head with enhanced geometry */}
      <mesh castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={skinTone} 
          roughness={0.4} 
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Hair component */}
      <HairStyles ref={hairRef} blondeHairColor={blondeHairColor} blondeHighlightColor={blondeHighlightColor} />
      
      {/* Eyes component */}
      <EyesFeatures ref={eyesRef} eyeColor={eyeColor} blondeHairColor={blondeHairColor} />
      
      {/* Nose with natural shape */}
      <mesh position={[0, 0, 0.95]} rotation={[Math.PI * 0.1, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      
      {/* Lips component */}
      <LipsFeatures ref={lipsRef} lipColor={lipColor} />
      
      {/* Earrings */}
      <Earrings />
    </group>
  );
};

// Forward ref components for the head features
const HairStyles = React.forwardRef<THREE.Group, { blondeHairColor: THREE.Color, blondeHighlightColor: THREE.Color }>(
  ({ blondeHairColor, blondeHighlightColor }, ref) => (
    <group ref={ref} position={[0, 0.2, 0]}>
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
  )
);

const EyesFeatures = React.forwardRef<THREE.Group, { eyeColor: THREE.Color, blondeHairColor: THREE.Color }>(
  ({ eyeColor, blondeHairColor }, ref) => (
    <group ref={ref} position={[0, 0.2, 0.85]}>
      {/* Left eye with improved materials */}
      <Eye position={[-0.3, 0, 0]} eyeColor={eyeColor} />
      
      {/* Right eye with improved materials */}
      <Eye position={[0.3, 0, 0]} eyeColor={eyeColor} />
      
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
  )
);

const Eye: React.FC<{ position: [number, number, number], eyeColor: THREE.Color }> = ({ position, eyeColor }) => (
  <mesh position={position}>
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
);

const LipsFeatures = React.forwardRef<THREE.Group, { lipColor: THREE.Color }>(
  ({ lipColor }, ref) => (
    <group ref={ref} position={[0, -0.3, 0.85]}>
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
  )
);

const Earrings: React.FC = () => (
  <>
    <EarringSide position={[-1.05, 0, 0]} />
    <EarringSide position={[1.05, 0, 0]} />
  </>
);

const EarringSide: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <mesh position={position} rotation={[0, Math.PI * 0.5, 0]}>
    <torusGeometry args={[0.08, 0.02, 12, 24]} />
    <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
    
    {/* Small diamond on earring */}
    <mesh position={[0, -0.1, 0]}>
      <octahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="white" metalness={0.5} roughness={0.1} />
    </mesh>
  </mesh>
);

export default AvatarHead;
