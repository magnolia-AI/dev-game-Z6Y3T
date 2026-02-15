"use client";

import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "@/hooks/use-game-store";

interface BulletProps {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  owner: "player" | "enemy";
  onHit?: () => void;
}

export function Bullet({ id, position, velocity, owner, onHit }: BulletProps) {
  const { damagePlayer, addScore, removeBullet } = useGameStore();
  
  const [ref] = useSphere(() => ({
    mass: 0.1,
    position,
    velocity,
    args: [0.1], // radius
    onCollide: (e) => {
      const targetName = e.body.name;

      // Handle damage logic based on who fired the bullet
      if (owner === "player") {
        if (targetName === "enemy") {
          addScore(10);
        }
      } else if (owner === "enemy") {
        if (targetName === "player") {
          damagePlayer(10);
        }
      }
      
      // Trigger the destruction of the bullet
      removeBullet(id);
      if (onHit) onHit();
    },
  }), useRef<THREE.Mesh>(null));

  // Automatic cleanup after 3 seconds if no collision occurs
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeBullet(id);
      if (onHit) onHit();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [id, onHit, removeBullet]);

  return (
    <mesh ref={ref} castShadow name={`${owner}-bullet`}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial 
        color={owner === "player" ? "#ffff00" : "#ff4444"} 
        emissive={owner === "player" ? "#ffff00" : "#ff4444"}
        emissiveIntensity={2}
      />
    </mesh>
  );
}
