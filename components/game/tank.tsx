"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { useGameStore } from "@/hooks/use-game-store";

interface TankProps {
  position?: [number, number, number];
  isPlayer?: boolean;
  color?: string;
}

const TANK_SPEED = 8;
const ROTATION_SPEED = 2.5;

export const Tank: React.FC<TankProps> = ({ 
  position = [0, 0.5, 0], 
  isPlayer = false,
  color
}) => {
  const { status, addBullet } = useGameStore();
  const { camera } = useThree();
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  
  // Physics body for the chassis
  const [ref, api] = useBox(() => ({
    mass: 1000, 
    position,
    args: [2, 0.8, 3],
    name: isPlayer ? "player" : "enemy",
  }), useRef<THREE.Group>(null));

  const turretRef = useRef<THREE.Group>(null!);
  const barrelRef = useRef<THREE.Mesh>(null!);
  
  const velocity = useRef([0, 0, 0]);
  const rotation = useRef([0, 0, 0]);
  const lastShotTime = useRef(0);
  const playerPos = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const unsubVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubRot = api.rotation.subscribe((r) => (rotation.current = r));
    return () => {
      unsubVel();
      unsubRot();
    };
  }, [api]);

  // Track player position for AI tanks
  useFrame((state) => {
    if (isPlayer) {
      if (ref.current) {
        ref.current.getWorldPosition(playerPos.current);
      }
    } else {
      // Find the player tank if we aren't it
      const playerBody = state.scene.getObjectByName("player");
      if (playerBody) {
        playerBody.getWorldPosition(playerPos.current);
      }
    }
  });

  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code.toLowerCase()]: true, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code.toLowerCase()]: false, [e.key.toLowerCase()]: false }));
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && barrelRef.current && status === "playing") {
        const barrelWorldPos = new THREE.Vector3();
        const barrelWorldQuat = new THREE.Quaternion();
        barrelRef.current.getWorldPosition(barrelWorldPos);
        barrelRef.current.getWorldQuaternion(barrelWorldQuat);
        
        const shootDir = new THREE.Vector3(0, 1, 0).applyQuaternion(barrelWorldQuat);
        const shootVel = shootDir.multiplyScalar(30);
        
        addBullet({
          position: [barrelWorldPos.x, barrelWorldPos.y, barrelWorldPos.z],
          velocity: [shootVel.x, shootVel.y, shootVel.z],
          owner: "player"
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isPlayer, status, addBullet]);

  useFrame((state) => {
    if (!ref.current) return;

    if (isPlayer && status === "playing") {
      // ... player logic remains ...
    } else if (!isPlayer && status === "playing") {
      // AI Logic
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      
      const directionToPlayer = new THREE.Vector3().subVectors(playerPos.current, worldPos);
      directionToPlayer.y = 0;
      const distanceToPlayer = directionToPlayer.length();

      if (distanceToPlayer < 40) {
        // Rotate turret towards player
        if (turretRef.current) {
          const turretWorldPos = new THREE.Vector3();
          turretRef.current.getWorldPosition(turretWorldPos);
          const dir = new THREE.Vector3().subVectors(playerPos.current, turretWorldPos);
          dir.y = 0;
          
          const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            dir.normalize()
          );
          
          const currentRotation = new THREE.Euler(rotation.current[0], rotation.current[1], rotation.current[2]);
          const parentQuat = new THREE.Quaternion().setFromEuler(currentRotation);
          const localQuat = parentQuat.invert().multiply(targetQuaternion);
          turretRef.current.quaternion.slerp(localQuat, 0.05);
        }

        // Shoot periodically
        const now = state.clock.getElapsedTime();
        if (now - lastShotTime.current > 2 + Math.random() * 2) {
          if (barrelRef.current) {
            const barrelWorldPos = new THREE.Vector3();
            const barrelWorldQuat = new THREE.Quaternion();
            barrelRef.current.getWorldPosition(barrelWorldPos);
            barrelRef.current.getWorldQuaternion(barrelWorldQuat);
            
            const shootDir = new THREE.Vector3(0, 1, 0).applyQuaternion(barrelWorldQuat);
            const shootVel = shootDir.multiplyScalar(20);
            
            addBullet({
              position: [barrelWorldPos.x, barrelWorldPos.y, barrelWorldPos.z],
              velocity: [shootVel.x, shootVel.y, shootVel.z],
              owner: "enemy"
            });
            lastShotTime.current = now;
          }
        }
      }
    }
  });

  const baseColor = color || (isPlayer ? "#2d5a27" : "#8b0000");
  const turretColor = color ? new THREE.Color(color).multiplyScalar(1.2).getStyle() : (isPlayer ? "#3d7a36" : "#a52a2a");

  return (
    <group ref={ref as any}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 3]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      <mesh position={[-1.1, -0.2, 0]}>
        <boxGeometry args={[0.3, 0.5, 3.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[1.1, -0.2, 0]}>
        <boxGeometry args={[0.3, 0.5, 3.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <group position={[0, 0.7, 0]} ref={turretRef as any}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.6, 1.4]} />
          <meshStandardMaterial color={turretColor} />
        </mesh>
        
        <mesh 
          position={[0, 0, 1.2]} 
          rotation={[Math.PI / 2, 0, 0]} 
          ref={barrelRef as any}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.15, 2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
};
