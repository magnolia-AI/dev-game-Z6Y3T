"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, Stars, ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Tank } from "./tank";
import { Ground } from "./ground";
import { useGameStore } from "@/hooks/use-game-store";
import { Button } from "@/components/ui/button";

export default function GameScene() {
  const { score, health, status, resetGame } = useGameStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const isGameOver = status === "game-over";

  return (
    <div className="relative w-full h-screen bg-[#050505]">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border shadow-lg pointer-events-none">
        <div className="text-foreground font-mono text-lg">
          HEALTH: <span className={health < 30 ? "text-destructive" : "text-primary"}>{health}%</span>
        </div>
        <div className="text-foreground font-mono text-lg">
          SCORE: <span className="text-primary">{score}</span>
        </div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
          <h1 className="text-6xl font-black text-destructive mb-4 tracking-tighter">BATTLE ENDED</h1>
          <p className="text-2xl font-mono text-muted-foreground mb-8">FINAL SCORE: {score}</p>
          <Button size="lg" onClick={() => resetGame()} className="px-8 py-6 text-xl">
            REDEPLOY TANK
          </Button>
        </div>
      )}

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
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground font-mono text-sm bg-background/50 px-6 py-2 rounded-full border border-border backdrop-blur-sm">
        [W/A/S/D] MOVE • [MOUSE] AIM • [SPACE] FIRE
      </div>
    </div>
  );
}

