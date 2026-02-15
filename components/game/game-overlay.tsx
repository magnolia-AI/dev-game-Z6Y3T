'use client';

import { useGameStore } from '@/hooks/use-game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Trophy, RefreshCw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GameOverlay() {
  const { status, health, score, resetGame, startGame } = useGameStore();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6">
      {/* Top HUD */}
      <div className="flex w-full items-start justify-between">
        {/* Health Section */}
        <Card className="pointer-events-auto flex items-center gap-4 bg-card/80 p-3 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2">
            <Heart className={cn("h-5 w-5", health < 30 ? "animate-pulse text-destructive" : "text-primary")} />
            <span className="font-bold tabular-nums text-foreground">{health}%</span>
          </div>
          <Progress value={health} className="w-32 h-2" />
        </Card>

        {/* Score Section */}
        <Card className="pointer-events-auto flex items-center gap-3 bg-card/80 p-3 backdrop-blur-sm border-border text-foreground">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Score</span>
            <span className="font-bold tabular-nums leading-none">{score}</span>
          </div>
        </Card>
      </div>

      {/* Center Screen Overlays */}
      <div className="flex flex-1 items-center justify-center">
        {status === 'game-over' && (
          <Card className="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-6 bg-card/95 p-8 text-center shadow-2xl backdrop-blur-md border-border">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-destructive">GAME OVER</h2>
              <p className="text-muted-foreground font-medium">Your tank was destroyed!</p>
            </div>
            
            <div className="grid grid-cols-1 w-full gap-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <span className="text-sm font-semibold text-muted-foreground uppercase">Final Score</span>
                <span className="text-2xl font-bold text-foreground">{score}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full gap-2 font-bold shadow-lg"
              onClick={resetGame}
            >
              <RefreshCw className="h-4 w-4" />
              DEPLOY AGAIN
            </Button>
          </Card>
        )}

        {status === 'idle' && (
          <Card className="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-6 bg-card/95 p-8 text-center shadow-2xl backdrop-blur-md border-border">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-primary italic">TANK ARENA</h1>
              <p className="text-muted-foreground font-medium">Use WASD to move, Mouse to target and shoot.</p>
            </div>
            
            <Button 
              size="lg" 
              className="group w-full gap-2 font-bold shadow-lg"
              onClick={startGame}
            >
              <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
              START MISSION
            </Button>
          </Card>
        )}
      </div>

      {/* Instructions / Bottom Hint */}
      {status === 'playing' && (
        <div className="mt-auto flex justify-center">
          <div className="rounded-full bg-background/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/60 backdrop-blur-sm border border-border/50">
            [WASD] MOVE • [SPACE/LEFT CLICK] FIRE • [ESC] PAUSE
          </div>
        </div>
      )}
    </div>
  );
}

