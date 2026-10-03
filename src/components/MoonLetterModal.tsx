import React from 'react';
import { UNIVERSE_CONFIG } from '../config';

interface MoonLetterModalProps {
  onClose: () => void;
}

export const MoonLetterModal: React.FC<MoonLetterModalProps> = ({ onClose }) => {
  const { moonLetter } = UNIVERSE_CONFIG;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050816]/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Letter Card (Warm Parchment / Cosmic Letter Style) */}
      <div
        className="relative w-full max-w-xl bg-gradient-to-b from-[#16122E] via-[#0F0D24] to-[#0A071A] border-2 border-[#FDE68A]/40 rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_rgba(253,230,138,0.25)] text-[#FFFBEB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Decorative Golden Border Pattern */}
        <div className="absolute inset-2 border border-[#FDE68A]/20 rounded-xl pointer-events-none" />

        {/* Ambient Moon Glow behind letter */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#FDE68A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#F472B6]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors text-sm"
          aria-label="Close letter"
        >
          ✕
        </button>

        {/* Wax Seal / Stamp Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#991B1B] via-[#DC2626] to-[#F87171] border border-[#FDE68A]/50 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <span className="text-xl">🌙</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#FDE68A]/75 mt-2 font-sans font-medium">
            Written in the Moonlight
          </span>
        </div>

        {/* Letter Body in Elegant Handwritten Style */}
        <div className="space-y-4 text-center sm:text-left z-10 relative">
          {/* Salutation */}
          <h2 className="font-serif italic text-2xl sm:text-3xl text-[#FDE68A] font-medium tracking-wide">
            {moonLetter.salutation}
          </h2>

          {/* Paragraphs */}
          <div className="space-y-3 font-serif text-lg sm:text-xl text-[#F8FAFC]/90 leading-relaxed font-light">
            {moonLetter.paragraphs.map((p, idx) => (
              <p key={idx} className="drop-shadow-sm">
                {p}
              </p>
            ))}
          </div>

          {/* Sign off */}
          <div className="pt-6 text-right">
            <p className="font-serif italic text-base text-[#FDE68A]/80">{moonLetter.closing}</p>
            <p className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1 tracking-wider">
              {moonLetter.signOffName} ❤️
            </p>
          </div>
        </div>

        {/* Footer Seal */}
        <div className="mt-8 pt-4 border-t border-[#FDE68A]/15 flex items-center justify-between text-[11px] text-white/40 font-sans">
          <span>OUR UNIVERSE · FOREVER</span>
          <span>✦ ✦ ✦</span>
          <button
            onClick={onClose}
            className="text-[#FDE68A]/80 hover:text-[#FDE68A] hover:underline"
          >
            Fold Letter & Return
          </button>
        </div>
      </div>
    </div>
  );
};
