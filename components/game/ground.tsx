"use client";

import { usePlane } from "@react-three/cannon";
import { useRef } from "react";
import * as THREE from "three";

export function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
}

