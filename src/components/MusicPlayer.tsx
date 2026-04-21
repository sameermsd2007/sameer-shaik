import { useState, useEffect } from 'react';
import { Track, INITIAL_TRACKS } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function MusicPlayer({ activeColor, track }: { activeColor: string, track: Track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev + 1) % track.duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center justify-between">
      {/* Track Info */}
      <div className="w-[200px]">
        <div className="text-sm font-bold truncate">{track.title}</div>
        <div className="text-[11px] opacity-60 truncate">{track.artist}</div>
      </div>

      {/* Controls & Progress */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-[500px]">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <div className="control-btn">
            <SkipBack size={18} fill="white" />
          </div>
          <div 
            className="control-btn !bg-neon-cyan !border-none"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause size={24} fill="black" className="text-black" />
            ) : (
              <Play size={24} fill="black" className="text-black ml-1" />
            )}
          </div>
          <div className="control-btn">
            <SkipForward size={18} fill="white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="font-mono text-[10px] w-8 text-right">{formatTime(progress)}</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative">
            <motion.div 
               className="absolute left-0 top-0 h-full bg-neon-cyan rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${(progress / track.duration) * 100}%` }}
               transition={{ ease: "linear" }}
            />
          </div>
          <span className="font-mono text-[10px] w-8">{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-[200px] flex justify-end">
        <Volume2 size={20} className="opacity-60" />
      </div>
    </div>
  );
}
