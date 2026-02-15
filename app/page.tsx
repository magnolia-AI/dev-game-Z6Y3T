'use client';

import GameScene from '@/components/game/game-scene';
import { GameOverlay } from '@/components/game/game-overlay';

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* 3D Game World */}
      <GameScene />
      
      {/* 2D HUD / Overlays */}
      <GameOverlay />
    </main>
  );
}

