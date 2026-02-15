import { create } from 'zustand';

interface GameState {
  // Stats
  health: number;
  score: number;
  
  // Game Status
  status: 'idle' | 'playing' | 'paused' | 'game-over';
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // Bullets
  bullets: Array<{ id: string; position: [number, number, number]; velocity: [number, number, number]; owner: "player" | "enemy" }>;
  addBullet: (bullet: { position: [number, number, number]; velocity: [number, number, number]; owner: "player" | "enemy" }) => void;
  removeBullet: (id: string) => void;
  
  // Stat Mutations
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  addScore: (points: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial State
  health: 100,
  score: 0,
  status: 'idle',
  bullets: [],

  // Game Status Actions
  startGame: () => set({ status: 'playing', health: 100, score: 0, bullets: [] }),
  
  pauseGame: () => set((state) => ({ 
    status: state.status === 'playing' ? 'paused' : state.status 
  })),
  
  resumeGame: () => set((state) => ({ 
    status: state.status === 'paused' ? 'playing' : state.status 
  })),
  
  endGame: () => set({ status: 'game-over' }),
  
  resetGame: () => set({ 
    status: 'playing', 
    health: 100, 
    score: 0,
    bullets: []
  }),

  // Bullet Actions
  addBullet: (bullet) => set((state) => ({
    bullets: [...state.bullets, { ...bullet, id: Math.random().toString(36).substr(2, 9) }]
  })),

  removeBullet: (id) => set((state) => ({
    bullets: state.bullets.filter((b) => b.id !== id)
  })),

  // Stat Mutations
  damagePlayer: (amount) => set((state) => {
    const nextHealth = Math.max(0, state.health - amount);
    return {
      health: nextHealth,
      status: nextHealth <= 0 ? 'game-over' : state.status
    };
  }),

  healPlayer: (amount) => set((state) => ({
    health: Math.min(100, state.health + amount)
  })),

  addScore: (points) => set((state) => ({
    score: state.score + points
  })),
}));
