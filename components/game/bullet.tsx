"use client";

import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface BulletProps {
  position: [number, number, number];
  velocity: [number, number, number];
  onHit?: () => void;
}

export function Bullet({ position, velocity, onHit }: BulletProps) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position,
    velocity,
    args: [0.2],
    onCollide: (e) => {
      if (onHit) onHit();
    }
  }), useRef<THREE.Mesh>(null));

  useFrame((state, delta) => {
    // Bullets expire after 2 seconds or handle that in the parent
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.2]} />
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={2} />
    </mesh>
  );
}

