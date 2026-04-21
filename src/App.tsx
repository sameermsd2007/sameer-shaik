/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Radio } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import TrackList from './components/TrackList';
import { INITIAL_TRACKS } from './types';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const currentTrack = INITIAL_TRACKS[trackIndex];
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background Ambience Pruned for precise design matching, but kept subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[150px]" />
      </div>

      {/* Main Container - Adjusted to fixed height feel from 디자인 */}
      <div className="z-10 w-full max-w-[1024px] h-[768px] flex flex-col relative shadow-2xl overflow-hidden border border-white/5 bg-transparent">
        
        {/* Header */}
        <header className="h-[60px] flex items-center px-10 justify-between border-bottom border-white/5 flex-shrink-0">
          <div className="neon-text-cyan font-display text-2xl font-black tracking-widest">
            SYNTHSNAKE
          </div>
          <div className="text-[12px] opacity-60 tracking-[1px] font-mono">
            v2.0.48 // SYSTEM ONLINE
          </div>
          <div className="font-mono neon-text-pink text-lg">
            {formatElapsedTime(elapsedTime)}
          </div>
        </header>

        {/* Layout Grid */}
        <main className="flex-1 grid grid-cols-[280px_1fr_280px] gap-5 px-10 py-5 overflow-hidden">
          
          {/* Left Column: Playlist */}
          <aside className="overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-[11px] uppercase tracking-[2px] mb-4 opacity-50 font-bold">
              Playlist
            </div>
            <TrackList activeIndex={trackIndex} onSelect={setTrackIndex} />
          </aside>

          {/* Center Column: The Game */}
          <section className="flex flex-col items-center justify-center p-4 border border-white/5 glass rounded-xl relative">
            <SnakeGame 
              onScoreUpdate={setCurrentScore} 
              accentColor={currentTrack.color} 
            />
            <div className="mt-5 text-center">
              <div className="text-[11px] uppercase tracking-[1px] opacity-50 mb-2 font-mono">
                Game Controls
              </div>
              <div className="text-[12px] opacity-80 font-mono">
                [W][A][S][D] or Arrows to Navigate
              </div>
            </div>
          </section>

          {/* Right Column: Stats */}
          <aside className="flex flex-col">
            <div className="stat-box">
              <div className="text-[11px] uppercase opacity-50 font-mono mb-1">Current Score</div>
              <div className="font-mono neon-text-cyan text-5xl font-bold">
                {currentScore.toString().padStart(4, '0')}
              </div>
            </div>

            <div className="stat-box">
              <div className="text-[11px] uppercase opacity-50 font-mono mb-1">High Score</div>
              <div className="font-mono text-2xl">
                {parseInt(localStorage.getItem('snake-highscore') || '0').toString().padStart(4, '0')}
              </div>
            </div>

            <div className="stat-box">
               <div className="text-[11px] uppercase opacity-50 font-mono mb-1">BPM Sync</div>
               <div className="font-mono neon-text-pink text-2xl">
                  {currentTrack.bpm.toFixed(1)}
               </div>
            </div>
          </aside>
        </main>

        {/* Footer: Player Controls */}
        <footer className="h-[100px] px-10 flex items-center border-t border-white/5 bg-black/40 flex-shrink-0">
          <MusicPlayer activeColor={currentTrack.color} track={currentTrack} />
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
