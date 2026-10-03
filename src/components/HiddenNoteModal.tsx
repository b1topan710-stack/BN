import React from 'react';
import { HiddenLoveNote, UNIVERSE_CONFIG } from '../config';

interface HiddenNoteModalProps {
  note: HiddenLoveNote;
  onClose: () => void;
}

export const HiddenNoteModal: React.FC<HiddenNoteModalProps> = ({ note, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050816]/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-[#0B1026]/95 border border-[#FDE68A]/40 rounded-2xl p-6 sm:p-8 text-center text-white shadow-[0_0_40px_rgba(253,230,138,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FDE68A]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Twinkling star icon */}
        <div className="w-12 h-12 rounded-full bg-[#1E1B4B] border border-[#FDE68A]/40 mx-auto mb-4 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(253,230,138,0.3)] animate-pulse">
          ✨
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#FDE68A]/80 font-sans font-medium">
          A Secret Starlight Whisper
        </span>

        {/* Note Content */}
        <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#F8FAFC] leading-relaxed">
          "{note.message}"
        </p>

        <p className="mt-4 text-xs font-sans text-white/50 tracking-wider">
          From {UNIVERSE_CONFIG.yourName} with love ❤️
        </p>

        {/* Keep Exploring Button */}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-full bg-[#1E1B4B] hover:bg-[#2D2866] border border-[#F472B6]/40 text-xs uppercase tracking-widest text-[#F8FAFC] transition-colors"
        >
          Keep Exploring
        </button>
      </div>
    </div>
  );
};
