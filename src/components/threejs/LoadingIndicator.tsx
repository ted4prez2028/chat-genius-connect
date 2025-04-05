
import React from "react";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <group position={[0, -1.5, 0]}>
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color="#FF9AA2" />
      </mesh>
      <pointLight position={[0, 0, 1]} intensity={0.5} color="#FF9AA2" />
    </group>
  );
};

export default LoadingIndicator;
