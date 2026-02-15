"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky, Stars, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { Tank } from "./tank";
import { Ground } from "./ground";
import { useGameStore } from "@/hooks/use-game-store";
import { Button } from "@/components/ui/button";

export default function GameScene() {
  const { score, health, isGameOver, resetGame } = useGameStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-screen bg-background">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border shadow-lg">
        <div className="text-foreground font-bold">Health: {health}%</div>
        <div className="text-foreground font-bold">Score: {score}</div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
          <h1 className="text-4xl font-bold text-destructive mb-4">GAME OVER</h1>
          <p className="text-xl text-muted-foreground mb-8">Your score: {score}</p>
          <Button size="lg" onClick={() => resetGame()}>
            Restart Battle
          </Button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <Physics gravity={[0, -9.81, 0]}>
            <Ground />
            <Tank isPlayer position={[0, 2, 0]} />
            
            {/* Enemy Tanks */}
            <Tank position={[10, 2, 10]} color="red" />
            <Tank position={[-15, 2, -5]} color="red" />
            <Tank position={[5, 2, -15]} color="red" />
          </Physics>
          
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground text-sm bg-background/50 px-4 py-2 rounded-full border border-border">
        WASD to Move • Space to Shoot (Coming Soon) • Mouse to Look Around
      </div>
    </div>
  );
}

