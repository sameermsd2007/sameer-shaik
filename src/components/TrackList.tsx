import { INITIAL_TRACKS } from '../types';

export default function TrackList({ activeIndex, onSelect }: { activeIndex: number, onSelect: (index: number) => void }) {
  return (
    <div className="space-y-2">
      {INITIAL_TRACKS.map((track, i) => (
        <div 
          key={track.id}
          onClick={() => onSelect(i)}
          className={`track-card ${i === activeIndex ? 'active' : 'hover:bg-white/5'}`}
        >
          <div className="text-sm font-semibold truncate transition-colors">
            {track.title}
          </div>
          <div className="text-[11px] opacity-60 truncate">
            AI-GEN // {track.artist}
          </div>
        </div>
      ))}
    </div>
  );
}
