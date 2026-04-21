import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Point, Direction, GRID_SIZE, CANVAS_SIZE } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Direction = 'UP';

export default function SnakeGame({ onScoreUpdate, accentColor }: { onScoreUpdate: (score: number) => void, accentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-highscore') || '0'),
    isGameOver: false,
    isPaused: true,
    speed: 150
  });

  const nextDirection = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      const currentDir = nextDirection.current;

      switch (currentDir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE ||
        prev.snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snake-highscore', prev.score.toString());
        }
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;

      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        onScoreUpdate(newScore);
        newSpeed = Math.max(80, 150 - Math.floor(newScore / 50) * 10);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: currentDir,
        speed: newSpeed
      };
    });
  }, [gameState.isPaused, gameState.isGameOver, generateFood, onScoreUpdate]);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(moveSnake, gameState.speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameState.speed]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== 'DOWN') nextDirection.current = 'UP'; break;
        case 'ArrowDown': if (gameState.direction !== 'UP') nextDirection.current = 'DOWN'; break;
        case 'ArrowLeft': if (gameState.direction !== 'RIGHT') nextDirection.current = 'LEFT'; break;
        case 'ArrowRight': if (gameState.direction !== 'LEFT') nextDirection.current = 'RIGHT'; break;
        case 'w': case 'W': if (gameState.direction !== 'DOWN') nextDirection.current = 'UP'; break;
        case 's': case 'S': if (gameState.direction !== 'UP') nextDirection.current = 'DOWN'; break;
        case 'a': case 'A': if (gameState.direction !== 'RIGHT') nextDirection.current = 'LEFT'; break;
        case 'd': case 'D': if (gameState.direction !== 'LEFT') nextDirection.current = 'RIGHT'; break;
        case ' ': 
          setGameState(p => ({ ...p, isPaused: !p.isPaused }));
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  // Render
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake (cyan from theme)
    gameState.snake.forEach((segment, i) => {
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      ctx.shadowBlur = 0;
    });

    // Draw food (pink from theme)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * GRID_SIZE + GRID_SIZE / 2,
      gameState.food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [gameState, accentColor]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      highScore: parseInt(localStorage.getItem('snake-highscore') || '0'),
      isGameOver: false,
      isPaused: false,
      speed: 150
    });
    nextDirection.current = INITIAL_DIRECTION;
    onScoreUpdate(0);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Canvas Container */}
      <div className="relative p-1 bg-[#0a0a0a] border-2 border-[#333] scanlines">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-[#0a0a0a]"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />

        {/* Overlay States */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10"
            >
              <h2 className="text-4xl font-display font-bold text-red-500 mb-6 tracking-tighter neon-text-pink">GAME OVER</h2>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full border border-white/20 transition-all font-display uppercase tracking-widest text-sm"
              >
                <RefreshCw size={18} /> Retry System
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10"
            >
              <button 
                onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
                className="p-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <Play size={48} className="fill-white" />
              </button>
              <p className="mt-4 font-mono text-[10px] opacity-50 uppercase tracking-[0.3em]">Standby - Press Space</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
