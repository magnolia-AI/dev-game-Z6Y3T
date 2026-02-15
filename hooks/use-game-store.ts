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

  // Game Status Actions
  startGame: () => set({ status: 'playing', health: 100, score: 0 }),
  
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
    score: 0 
  }),

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

