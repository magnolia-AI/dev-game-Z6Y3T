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
  const { status } = useGameStore();
  const { camera } = useThree();
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  
  // Physics body for the chassis
  const [ref, api] = useBox(() => ({
    mass: 1000, 
    position,
    args: [2, 0.8, 3],
  }), useRef<THREE.Group>(null));

  const turretRef = useRef<THREE.Group>(null!);
  const barrelRef = useRef<THREE.Mesh>(null!);
  
  const velocity = useRef([0, 0, 0]);
  const rotation = useRef([0, 0, 0]);

  useEffect(() => {
    const unsubVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubRot = api.rotation.subscribe((r) => (rotation.current = r));
    return () => {
      unsubVel();
      unsubRot();
    };
  }, [api]);

  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code.toLowerCase()]: true, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code.toLowerCase()]: false, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlayer]);

  useFrame((state) => {
    if (!ref.current) return;

    if (isPlayer && status === "playing") {
      const forward = (keys["w"] || keys["arrowup"] ? 1 : 0) - (keys["s"] || keys["arrowdown"] ? 1 : 0);
      const turn = (keys["a"] || keys["arrowleft"] ? 1 : 0) - (keys["d"] || keys["arrowright"] ? 1 : 0);

      if (turn !== 0) {
        api.angularVelocity.set(0, turn * ROTATION_SPEED, 0);
      } else {
        api.angularVelocity.set(0, 0, 0);
      }

      const currentRotation = new THREE.Euler(rotation.current[0], rotation.current[1], rotation.current[2]);
      const driveDirection = new THREE.Vector3(0, 0, 1).applyEuler(currentRotation);
      
      if (forward !== 0) {
        const v = driveDirection.multiplyScalar(forward * TANK_SPEED);
        api.velocity.set(v.x, velocity.current[1], v.z);
      } else {
        api.velocity.set(0, velocity.current[1], 0);
      }

      const raycaster = state.raycaster;
      const mouse = state.mouse;
      raycaster.setFromCamera(mouse, camera);

      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const targetPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, targetPoint);

      if (turretRef.current) {
        const worldPos = new THREE.Vector3();
        turretRef.current.getWorldPosition(worldPos);
        const directionToTarget = new THREE.Vector3().subVectors(targetPoint, worldPos);
        directionToTarget.y = 0;
        
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          directionToTarget.normalize()
        );
        
        const parentQuat = new THREE.Quaternion().setFromEuler(currentRotation);
        const localQuat = parentQuat.invert().multiply(targetQuaternion);
        turretRef.current.quaternion.slerp(localQuat, 0.1);
      }

      const tankPos = new THREE.Vector3();
      ref.current.getWorldPosition(tankPos);
      
      const cameraOffset = new THREE.Vector3(0, 8, -12).applyEuler(currentRotation);
      const targetCameraPos = tankPos.clone().add(cameraOffset);
      
      camera.position.lerp(targetCameraPos, 0.1);
      camera.lookAt(tankPos);
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

