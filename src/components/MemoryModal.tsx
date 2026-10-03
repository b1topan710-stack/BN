import React, { useRef, useState } from 'react';
import { MemoryItem, UNIVERSE_CONFIG } from '../config';
import { sound } from '../utils/audio';
import { saveCustomPhoto } from '../utils/photoStorage';

interface MemoryModalProps {
  memory: MemoryItem;
  customPhotoUrl?: string;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onPhotoUpdated: (memoryId: string, dataUrl: string) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  customPhotoUrl,
  onClose,
  onNavigate,
  onPhotoUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const displayPhoto = customPhotoUrl || memory.photoUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveCustomPhoto(memory.id, dataUrl);
        onPhotoUpdated(memory.id, dataUrl);
        setImageError(false);
        sound.playTwinkle();
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePrev = () => {
    sound.playTwinkle();
    setImageError(false);
    onNavigate('prev');
  };

  const handleNext = () => {
    sound.playTwinkle();
    setImageError(false);
    onNavigate('next');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050816]/80 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-[#0B1026]/95 border border-[#F472B6]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(124,58,237,0.25)] text-white overflow-hidden max-h-[90vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#F472B6]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: memory.planetColor, boxShadow: `0 0 10px ${memory.planetColor}` }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-[#FDE68A] font-semibold">
                {memory.category}
              </span>
              {memory.date && (
                <>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-xs text-white/50">{memory.date}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F8FAFC] tracking-wide font-normal">
              {memory.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors text-lg"
            aria-label="Close memory modal"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto pr-1 space-y-4 my-2 z-10 custom-scrollbar">
          {/* Photograph Frame */}
          <div className="relative group rounded-xl overflow-hidden border border-[#F472B6]/25 bg-[#050816] shadow-lg">
            {!imageError ? (
              <img
                src={displayPhoto}
                alt={memory.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-56 sm:h-72 object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-56 sm:h-72 bg-gradient-to-br from-[#1E1B4B] via-[#0B1026] to-[#050816] flex flex-col items-center justify-center p-6 text-center">
                <span className="text-4xl mb-2">🌌</span>
                <p className="font-serif text-lg text-[#FDE68A]">{memory.title}</p>
                <p className="text-xs text-white/60 mt-1 max-w-sm">{memory.caption}</p>
              </div>
            )}

            {/* Gradient Scrim for caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Photo Caption & Replace Button */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <span className="text-white/80 italic font-serif text-sm drop-shadow-md truncate pr-2">
                {memory.caption}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 px-2.5 py-1 rounded bg-[#0B1026]/80 hover:bg-[#1E1B4B] border border-white/20 text-[#FDE68A] text-[11px] font-medium backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                title="Upload or change this memory photo"
              >
                {isUploading ? 'Loading...' : '📷 Change Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Memory Emotional Description */}
          <p className="text-base sm:text-lg font-serif text-white/90 leading-relaxed italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
            "{memory.description}"
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10 text-xs text-white/60">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            ← Previous Memory
          </button>

          <span className="font-mono text-xs text-[#FDE68A]/80">
            {UNIVERSE_CONFIG.memories.findIndex((m) => m.id === memory.id) + 1} / {UNIVERSE_CONFIG.memories.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            Next Memory →
          </button>
        </div>
      </div>
    </div>
  );
};
