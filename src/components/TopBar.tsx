import React, { useState } from 'react';
import { UNIVERSE_CONFIG } from '../config';
import { sound } from '../utils/audio';

interface TopBarProps {
  onOpenMoonLetter: () => void;
  onOpenSurprise: () => void;
  onOpenCustomizer: () => void;
  memoriesVisitedCount: number;
  totalMemoriesCount: number;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMoonLetter,
  onOpenSurprise,
  onOpenCustomizer,
  memoriesVisitedCount,
  totalMemoriesCount,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const handleDownloadHtml = () => {
    sound.playTwinkle();
    const link = document.createElement('a');
    link.href = '/our-universe.html';
    link.download = 'our-universe.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-[#050816]/75 backdrop-blur-md select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="font-serif text-lg sm:text-xl font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F472B6] to-white whitespace-nowrap">
          Our Universe
        </span>
        <span className="text-xs text-[#F472B6]">❤️</span>
      </div>

      {/* Zone 2: Clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-white/70">
        <button
          onClick={() => {
            sound.playTwinkle();
            onOpenMoonLetter();
          }}
          className="hover:text-[#FDE68A] transition-colors whitespace-nowrap"
        >
          Moon Letter 💌
        </button>

        <button
          onClick={() => {
            sound.playTwinkle();
            onOpenSurprise();
          }}
          className="hover:text-[#F472B6] transition-colors whitespace-nowrap"
        >
          Heart Constellation ✨
        </button>

        <button
          onClick={() => {
            sound.playTwinkle();
            onOpenCustomizer();
          }}
          className="hover:text-[#BAE6FD] transition-colors whitespace-nowrap"
        >
          Photos & Memories 📷
        </button>

        <button
          onClick={handleDownloadHtml}
          className="text-[#FDE68A] hover:underline transition-colors whitespace-nowrap"
          title="Download single-file offline HTML"
        >
          Download HTML 📥
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        {/* Memory discovery counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80">
          <span>⭐</span>
          <span>{memoriesVisitedCount}/{totalMemoriesCount}</span>
        </div>

        {/* Download Button on Mobile / Small screens */}
        <button
          onClick={handleDownloadHtml}
          className="flex sm:hidden p-2 rounded-full bg-white/5 border border-white/10 text-[#FDE68A] text-xs"
          title="Download HTML"
        >
          📥
        </button>

        {/* Audio Toggle with Animated Visualizer */}
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            isAudioPlaying
              ? 'bg-[#1E1B4B]/80 border-[#F472B6]/50 text-[#FDE68A] shadow-[0_0_15px_rgba(244,114,182,0.3)]'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
          title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isAudioPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#FDE68A] animate-[bounce_0.8s_infinite] h-2" />
              <span className="w-0.5 bg-[#F472B6] animate-[bounce_0.6s_infinite_0.2s] h-3" />
              <span className="w-0.5 bg-[#FDE68A] animate-[bounce_0.7s_infinite_0.4s] h-2.5" />
            </div>
          ) : (
            <span>🔇</span>
          )}
          <span className="hidden sm:inline">{isAudioPlaying ? 'Music On' : 'Muted'}</span>
        </button>

        {/* Mobile quick actions */}
        <button
          onClick={onOpenMoonLetter}
          className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white text-sm"
          title="Moon Letter"
        >
          🌙
        </button>
      </div>
    </header>
  );
};
