"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, Stars, ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Tank } from "./tank";
import { Ground } from "./ground";
import { Bullet } from "./bullet";

export default function GameScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <GameContent />;
}

function GameContent() {
  const { bullets, removeBullet } = useGameStore();

  return (
    <div className="absolute inset-0 bg-[#050505]">
      <Canvas shadows camera={{ position: [20, 20, 20], fov: 45 }}>
        <color attach="background" args={["#050505"]} />
        <Suspense fallback={null}>
          {/* Atmosphere */}
          <Sky 
            sunPosition={[100, 10, 100]} 
            turbidity={0.1}
            rayleigh={0.5}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight
            position={[50, 50, 25]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />

          <Physics 
            gravity={[0, -9.81, 0]} 
            defaultContactMaterial={{ friction: 0.1, restitution: 0.3 }}
          >
            <Ground />
            
            {/* Player Tank */}
            <Tank isPlayer position={[0, 1, 0]} />
            
            {/* AI Enemy Tanks */}
            <Tank position={[20, 1, 20]} color="#ef4444" />
            <Tank position={[-25, 1, -15]} color="#ef4444" />
            <Tank position={[15, 1, -25]} color="#ef4444" />

            {/* Bullets */}
            {bullets.map((bullet) => (
              <Bullet 
                key={bullet.id}
                {...bullet}
                onHit={() => removeBullet(bullet.id)}
              />
            ))}
          </Physics>

          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.4} 
            scale={100} 
            blur={2} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
          
          <OrbitControls 
            makeDefault 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={10} 
            maxDistance={100} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
