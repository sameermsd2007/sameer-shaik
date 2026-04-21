export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number; // in seconds
  color: string;
  bpm: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
}

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;

export const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'CyberSynth AI',
    cover: 'https://picsum.photos/seed/cyber1/400/400',
    duration: 184,
    color: 'var(--color-neon-green)',
    bpm: 120
  },
  {
    id: '2',
    title: 'Digital Rain',
    artist: 'Matrix Echo',
    cover: 'https://picsum.photos/seed/cyber2/400/400',
    duration: 215,
    color: 'var(--color-neon-cyan)',
    bpm: 128
  },
  {
    id: '3',
    title: 'Purple Paradox',
    artist: 'RetroFuture',
    cover: 'https://picsum.photos/seed/cyber3/400/400',
    duration: 192,
    color: 'var(--color-neon-purple)',
    bpm: 110
  }
];
