
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
  
  // Enhanced realistic skin tone with subsurface scattering effect
  const skinTone = new THREE.Color("#FFDBAC");
  // More natural blonde hair color with highlights
  const blondeHairColor = new THREE.Color("#F7DC9F");
  const blondeHighlightColor = new THREE.Color("#FFECBD");
  // Realistic bright blue eyes with depth
  const eyeColor = new THREE.Color("#5DA9E9");
  // Natural pink lips with subtle gloss effect
  const lipColor = new THREE.Color("#EB9C9C");

  // Head animation with more natural and subtle movements
  useFrame((state) => {
    if (!headRef.current || !eyesRef.current || !hairRef.current || !lipsRef.current) return;
    
    if (headMovement) {
      // More subtle and natural idle animation with randomized micro-movements
      const time = state.clock.getElapsedTime();
      headRef.current.position.y = Math.sin(time * 0.3) * 0.03 + Math.sin(time * 0.7) * 0.01;
      headRef.current.rotation.z = Math.sin(time * 0.3) * 0.02 + Math.cos(time * 0.5) * 0.01;
      
      // More realistic hair movement with slight delay and physics simulation
      hairRef.current.rotation.z = Math.sin(time * 0.4 - 0.1) * 0.015;
      hairRef.current.position.y = Math.sin(time * 0.35 - 0.05) * 0.008;
      hairRef.current.rotation.x = Math.sin(time * 0.25) * 0.01;
    }
    
    if (isSpeaking) {
      // Enhanced speaking animation with micro-expressions
      const time = state.clock.getElapsedTime();
      // Natural jaw movement when speaking
      lipsRef.current.scale.y = 0.8 + Math.sin(time * 8) * 0.2 + Math.sin(time * 12) * 0.05;
      // Subtle head movements during speech for realism
      headRef.current.rotation.y = Math.sin(time * 2) * 0.05 + Math.sin(time * 3.7) * 0.02;
      headRef.current.rotation.x = Math.sin(time * 1.5) * 0.025 + Math.cos(time * 2.3) * 0.015;
      
      // Hair follows head movement with natural physics
      hairRef.current.rotation.y = Math.sin(time * 2 - 0.15) * 0.03;
      hairRef.current.rotation.x = Math.sin(time * 1.5 - 0.2) * 0.02;
      
      // Subtle eye movements during speech
      eyesRef.current.rotation.y = Math.sin(time * 2.5) * 0.1;
    } else {
      lipsRef.current.scale.y = 1;
    }
    
    // More realistic blinking with random intervals
    const time = state.clock.getElapsedTime();
    const blinkPhase = (Math.sin(time * 0.5) + Math.sin(time * 0.3) + Math.sin(time * 0.7)) / 3;
    if (blinkPhase > 0.95) {
      eyesRef.current.scale.y = 0.1;
    } else {
      eyesRef.current.scale.y = 1;
    }
    
    // Occasional eye movement with more natural randomization
    if (!isSpeaking && headMovement) {
      eyesRef.current.rotation.y = Math.sin(time * 0.3) * 0.3 + Math.sin(time * 0.17) * 0.1;
      eyesRef.current.rotation.x = Math.sin(time * 0.23) * 0.1;
    }
  });

  return (
    <group ref={headRef}>
      {/* Enhanced head with more detailed geometry for realism */}
      <mesh castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={skinTone} 
          roughness={0.4} 
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Enhanced Hair component */}
      <HairStyles ref={hairRef} blondeHairColor={blondeHairColor} blondeHighlightColor={blondeHighlightColor} />
      
      {/* Enhanced Eyes component */}
      <EyesFeatures ref={eyesRef} eyeColor={eyeColor} blondeHairColor={blondeHairColor} />
      
      {/* Enhanced nose with more natural shape */}
      <mesh position={[0, 0, 0.95]} rotation={[Math.PI * 0.1, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      
      {/* Enhanced Lips component */}
      <LipsFeatures ref={lipsRef} lipColor={lipColor} />
      
      {/* Enhanced Earrings */}
      <Earrings />
    </group>
  );
};

// Forward ref components for the head features with enhanced details
const HairStyles = React.forwardRef<THREE.Group, { blondeHairColor: THREE.Color, blondeHighlightColor: THREE.Color }>(
  ({ blondeHairColor, blondeHighlightColor }, ref) => (
    <group ref={ref} position={[0, 0.2, 0]}>
      {/* Main hair volume with more detailed and layered geometry */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[1.1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial 
          color={blondeHairColor} 
          roughness={0.6} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Enhanced hair highlights layer with better texturing */}
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
      
      {/* Enhanced hair strands on sides with more detailed geometry */}
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
      
      {/* Enhanced hair bangs with more definition and layering */}
      <mesh position={[0, 0.65, 0.5]} rotation={[Math.PI * 0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.3, 0.15]} />
        <meshStandardMaterial 
          color={blondeHairColor} 
          roughness={0.6} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Enhanced side swept bangs with better styling */}
      <mesh position={[-0.7, 0.6, 0.4]} rotation={[Math.PI * 0.05, 0, Math.PI * -0.1]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.1]} />
        <meshStandardMaterial 
          color={blondeHighlightColor} 
          roughness={0.5} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Additional hair detail layers for more realism */}
      <mesh position={[0.6, 0.55, 0.45]} rotation={[Math.PI * 0.07, 0, Math.PI * 0.08]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.08]} />
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
      {/* Enhanced eyes with improved materials and details */}
      <Eye position={[-0.3, 0, 0]} eyeColor={eyeColor} />
      <Eye position={[0.3, 0, 0]} eyeColor={eyeColor} />
      
      {/* Enhanced sculpted eyebrows with more natural shape */}
      <mesh position={[-0.3, 0.15, 0.1]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[0.2, 0.025, 0.02]} />
        <meshStandardMaterial color={blondeHairColor} />
      </mesh>
      
      <mesh position={[0.3, 0.15, 0.1]} rotation={[0, 0, -Math.PI * 0.08]}>
        <boxGeometry args={[0.2, 0.025, 0.02]} />
        <meshStandardMaterial color={blondeHairColor} />
      </mesh>
      
      {/* Enhanced eyelashes for added realism */}
      <mesh position={[-0.3, 0.12, 0.15]} rotation={[Math.PI * 0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.01, 0.01]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      <mesh position={[0.3, 0.12, 0.15]} rotation={[Math.PI * 0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.01, 0.01]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Additional eyelashes for more realism */}
      <mesh position={[-0.3, 0.11, 0.16]} rotation={[Math.PI * 0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.008, 0.008]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      <mesh position={[0.3, 0.11, 0.16]} rotation={[Math.PI * 0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.008, 0.008]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
);

const Eye: React.FC<{ position: [number, number, number], eyeColor: THREE.Color }> = ({ position, eyeColor }) => (
  <mesh position={position}>
    {/* Enhanced eye with more realistic materials */}
    <sphereGeometry args={[0.12, 32, 32]} />
    <meshStandardMaterial color="white" roughness={0.2} />
    
    {/* Enhanced blue iris with better depth and texturing */}
    <mesh position={[0, 0, 0.08]}>
      <sphereGeometry args={[0.08, 32, 32]} />
      <meshStandardMaterial color={eyeColor} roughness={0.1} metalness={0.1} />
      
      {/* Enhanced pupil with multiple light reflections */}
      <mesh position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial color="black" />
        
        {/* Multiple catch lights for more realistic eye shine */}
        <mesh position={[0.02, 0.02, 0.03]} scale={[0.015, 0.015, 0.01]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        
        <mesh position={[-0.01, 0.01, 0.03]} scale={[0.008, 0.008, 0.005]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </mesh>
    </mesh>
  </mesh>
);

const LipsFeatures = React.forwardRef<THREE.Group, { lipColor: THREE.Color }>(
  ({ lipColor }, ref) => (
    <group ref={ref} position={[0, -0.3, 0.85]}>
      {/* Enhanced upper lip with more realistic shape */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.06, 0.1]} />
        <meshStandardMaterial 
          color={lipColor} 
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Enhanced lower lip with more depth and subtle shading */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <meshStandardMaterial 
          color={new THREE.Color(lipColor).multiplyScalar(0.9)} 
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Subtle lip highlight for more realistic appearance */}
      <mesh position={[0, -0.01, 0.05]} scale={[0.25, 0.01, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={new THREE.Color(lipColor).multiplyScalar(1.1)} 
          roughness={0.1}
          metalness={0.2}
          transparent={true}
          opacity={0.5}
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
    {/* Enhanced earring with more realistic gold material */}
    <torusGeometry args={[0.08, 0.02, 12, 24]} />
    <meshStandardMaterial 
      color="#FFD700" 
      metalness={0.9} 
      roughness={0.1} 
      envMapIntensity={1.5}
    />
    
    {/* Enhanced diamond on earring with better sparkle effect */}
    <mesh position={[0, -0.1, 0]}>
      <octahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial 
        color="white" 
        metalness={0.7} 
        roughness={0.05}
        envMapIntensity={2}
      />
      
      {/* Sparkle effect */}
      <mesh scale={[0.01, 0.01, 0.01]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </mesh>
  </mesh>
);

export default AvatarHead;
