"use client";

import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "@/hooks/use-game-store";

const TANK_WIDTH = 2;
const TANK_HEIGHT = 1;
const TANK_LENGTH = 3;

export function Tank({ position = [0, 0, 0] as [number, number, number], isPlayer = false, color = "green" }) {
  const { camera } = useThree();
  const decrementHealth = useGameStore((state) => state.decrementHealth);
  
  const [chassisRef, chassisApi] = useBox(() => ({
    mass: 1500,
    position,
    args: [TANK_WIDTH, TANK_HEIGHT, TANK_LENGTH],
    onCollide: (e) => {
        // Handle collisions if needed
    }
  }), useRef<THREE.Group>(null));

  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shoot: false
  });

  useEffect(() => {
    if (!isPlayer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": setControls(c => ({ ...c, forward: true })); break;
        case "s": setControls(c => ({ ...c, backward: true })); break;
        case "a": setControls(c => ({ ...c, left: true })); break;
        case "d": setControls(c => ({ ...c, right: true })); break;
        case " ": setControls(c => ({ ...c, shoot: true })); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w": setControls(c => ({ ...c, forward: false })); break;
        case "s": setControls(c => ({ ...c, backward: false })); break;
        case "a": setControls(c => ({ ...c, left: false })); break;
        case "d": setControls(c => ({ ...c, right: false })); break;
        case " ": setControls(c => ({ ...c, shoot: false })); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlayer]);

  // Movement Logic
  useFrame((state) => {
    if (!chassisRef.current) return;

    const velocity = new THREE.Vector3();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    chassisRef.current.getWorldPosition(pos);
    chassisRef.current.getWorldQuaternion(quat);

    if (isPlayer) {
      // Simple movement for now (direct velocity/rotation for better control in prototype)
      const speed = 10;
      const turnSpeed = 2;
      
      let moveX = 0;
      let moveZ = 0;

      if (controls.forward) moveZ += speed;
      if (controls.backward) moveZ -= speed;
      
      const direction = new THREE.Vector3(0, 0, moveZ).applyQuaternion(quat);
      chassisApi.velocity.set(direction.x, -2, direction.z);

      if (controls.left) chassisApi.angularVelocity.set(0, turnSpeed, 0);
      else if (controls.right) chassisApi.angularVelocity.set(0, -turnSpeed, 0);
      else chassisApi.angularVelocity.set(0, 0, 0);

      // Camera follow
      const cameraOffset = new THREE.Vector3(0, 5, -10).applyQuaternion(quat);
      camera.position.lerp(pos.clone().add(cameraOffset), 0.1);
      camera.lookAt(pos);
    }
  });

  return (
    <group ref={chassisRef}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[TANK_WIDTH, TANK_HEIGHT, TANK_LENGTH]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Turret */}
      <mesh position={[0, TANK_HEIGHT, 0]} castShadow>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, TANK_HEIGHT, 1]} castShadow>
        <boxGeometry args={[0.2, 0.2, 1.5]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

