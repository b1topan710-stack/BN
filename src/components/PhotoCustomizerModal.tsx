import React, { useRef, useState } from 'react';
import { UNIVERSE_CONFIG, MemoryItem } from '../config';
import { saveCustomPhoto, clearCustomPhotos } from '../utils/photoStorage';
import { sound } from '../utils/audio';

interface PhotoCustomizerModalProps {
  customPhotos: Record<string, string>;
  onPhotoUpdated: (memoryId: string, dataUrl: string) => void;
  onResetPhotos: () => void;
  onClose: () => void;
  onSelectMemory: (mem: MemoryItem) => void;
}

export const PhotoCustomizerModal: React.FC<PhotoCustomizerModalProps> = ({
  customPhotos,
  onPhotoUpdated,
  onResetPhotos,
  onClose,
  onSelectMemory,
}) => {
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerUpload = (memId: string) => {
    setActiveMemoryId(memId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeMemoryId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveCustomPhoto(activeMemoryId, dataUrl);
        onPhotoUpdated(activeMemoryId, dataUrl);
        sound.playTwinkle();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050816]/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0B1026]/95 border border-[#F472B6]/30 rounded-2xl p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(124,58,237,0.25)] flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#F8FAFC]">
              Our Memory Gallery & Photographs
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Customize photos for Nisumii & Bitopan's celestial memory stars
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Memory Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
          {UNIVERSE_CONFIG.memories.map((mem) => {
            const currentImg = customPhotos[mem.id] || mem.photoUrl;
            return (
              <div
                key={mem.id}
                className="group relative rounded-xl border border-white/10 bg-[#050816] overflow-hidden flex flex-col hover:border-[#F472B6]/50 transition-all"
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={currentImg}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-[#FDE68A] font-medium">
                    {mem.category}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[#F8FAFC] truncate">{mem.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-2 mt-1">{mem.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectMemory(mem);
                      }}
                      className="text-[#FDE68A] hover:underline text-[11px]"
                    >
                      View in Star ✨
                    </button>
                    <button
                      onClick={() => handleTriggerUpload(mem.id)}
                      className="px-2 py-1 rounded bg-[#1E1B4B] hover:bg-[#2D2866] border border-white/10 text-[11px] text-white"
                    >
                      Swap Photo 📷
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & reset */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
          <span>Photos are automatically saved to your browser</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset all uploaded photos to default cosmic illustrations?")) {
                  clearCustomPhotos();
                  onResetPhotos();
                  sound.playTwinkle();
                }
              }}
              className="hover:text-red-400 underline transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#1E1B4B] hover:bg-[#2D2866] text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
