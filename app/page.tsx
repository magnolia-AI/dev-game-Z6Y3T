'use client';

import { Suspense } from 'react';
import GameScene from '@/components/game/game-scene';
import { GameOverlay } from '@/components/game/game-overlay';
import { Loading } from '@/components/loading';

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* 3D Game World wrapped in Suspense for asset loading */}
      <Suspense fallback={<Loading />}>
        <GameScene />
      </Suspense>
      
      {/* 2D HUD / Overlays */}
      <GameOverlay />
    </main>
  );
}

