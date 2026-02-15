"use client";

import { usePlane } from "@react-three/cannon";
import { useRef } from "react";
import * as THREE from "three";

export function Ground() {
  const [ref] = usePlane(
    () => ({
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, 0, 0],
      type: "Static",
    }),
    useRef<THREE.Mesh>(null)
  );

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        color="#2a2a2a" 
        roughness={0.8}
        metalness={0.2}
      />
      {/* Visual grid for orientation */}
      <gridHelper args={[100, 50, "#444", "#222"]} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}

