/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UNIVERSE_CONFIG, MemoryItem, HiddenLoveNote } from './config';
import { OpeningScreen } from './components/OpeningScreen';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { TopBar } from './components/TopBar';
import { MemoryModal } from './components/MemoryModal';
import { MoonLetterModal } from './components/MoonLetterModal';
import { HiddenNoteModal } from './components/HiddenNoteModal';
import { FinalSurpriseModal } from './components/FinalSurpriseModal';
import { PhotoCustomizerModal } from './components/PhotoCustomizerModal';
import { sound } from './utils/audio';
import { getCustomPhotos } from './utils/photoStorage';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showMoonLetter, setShowMoonLetter] = useState<boolean>(false);
  const [selectedHiddenNote, setSelectedHiddenNote] = useState<HiddenLoveNote | null>(null);
  const [showFinalSurprise, setShowFinalSurprise] = useState<boolean>(false);
  const [showPhotoCustomizer, setShowPhotoCustomizer] = useState<boolean>(false);
  const [isConstellationGlowing, setIsConstellationGlowing] = useState<boolean>(false);
  const [visitedMemoryIds, setVisitedMemoryIds] = useState<Set<string>>(new Set());
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Load any saved custom photos from localStorage on mount
  useEffect(() => {
    setCustomPhotos(getCustomPhotos());
  }, []);

  // Keyboard shortcut: Escape closes active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMemory(null);
        setShowMoonLetter(false);
        setSelectedHiddenNote(null);
        setShowFinalSurprise(false);
        setShowPhotoCustomizer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When a memory is selected
  const handleSelectMemory = useCallback((memory: MemoryItem) => {
    setSelectedMemory(memory);
    setVisitedMemoryIds((prev) => {
      const next = new Set(prev);
      next.add(memory.id);
      return next;
    });
  }, []);

  // Navigate between memories in the modal
  const handleNavigateMemory = (direction: 'next' | 'prev') => {
    if (!selectedMemory) return;
    const memories = UNIVERSE_CONFIG.memories;
    const currentIndex = memories.findIndex((m) => m.id === selectedMemory.id);
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % memories.length
        : (currentIndex - 1 + memories.length) % memories.length;

    handleSelectMemory(memories[nextIndex]);
  };

  const handlePhotoUpdated = (memoryId: string, dataUrl: string) => {
    setCustomPhotos((prev) => ({
      ...prev,
      [memoryId]: dataUrl,
    }));
  };

  const handleResetPhotos = () => {
    setCustomPhotos({});
  };

  const handleToggleAudio = () => {
    const playing = sound.togglePlay(UNIVERSE_CONFIG.audio.customAudioUrl);
    setIsAudioPlaying(playing);
  };

  const handleEnterUniverse = () => {
    setHasEntered(true);
    setIsAudioPlaying(true);
  };

  const handleSurpriseClosed = () => {
    setShowFinalSurprise(false);
    setIsConstellationGlowing(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050816] text-[#F8FAFC]">
      {/* 1. Cinematic Opening Screen */}
      {!hasEntered ? (
        <OpeningScreen onEnter={handleEnterUniverse} />
      ) : (
        /* 2. Interactive Galaxy Experience */
        <div className="relative w-full h-full">
          {/* Top Bar Navigation */}
          <TopBar
            onOpenMoonLetter={() => setShowMoonLetter(true)}
            onOpenSurprise={() => setShowFinalSurprise(true)}
            onOpenCustomizer={() => setShowPhotoCustomizer(true)}
            memoriesVisitedCount={visitedMemoryIds.size}
            totalMemoriesCount={UNIVERSE_CONFIG.memories.length}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
          />

          {/* Galaxy Canvas */}
          <GalaxyCanvas
            onSelectMemory={handleSelectMemory}
            onOpenMoonLetter={() => setShowMoonLetter(true)}
            onSelectHiddenNote={(note) => setSelectedHiddenNote(note)}
            isConstellationGlowing={isConstellationGlowing}
            onTriggerSurprise={() => setShowFinalSurprise(true)}
          />

          {/* Quick Floating Hint at bottom left */}
          <aside aria-label="Interactive guide" className="fixed bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1026]/70 backdrop-blur-md border border-white/10 text-xs text-white/60 pointer-events-none">
            <span>✨</span>
            <span>Drag to explore · Click stars & moon · Scroll to zoom</span>
          </aside>

          {/* Celebration Heart Badge (bottom center when surprise unlocked) */}
          {isConstellationGlowing && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED]/80 via-[#EC4899]/90 to-[#FDE68A]/80 border border-[#FDE68A] text-xs font-medium text-white shadow-[0_0_25px_rgba(244,114,182,0.6)]">
                <span>❤️</span>
                <span>Constellation of Us Glowing Forever</span>
                <span>✨</span>
              </div>
            </div>
          )}

          {/* MODALS */}

          {/* 1. Memory Modal */}
          {selectedMemory && (
            <MemoryModal
              memory={selectedMemory}
              customPhotoUrl={customPhotos[selectedMemory.id]}
              onClose={() => setSelectedMemory(null)}
              onNavigate={handleNavigateMemory}
              onPhotoUpdated={handlePhotoUpdated}
            />
          )}

          {/* 2. Moon Letter Modal */}
          {showMoonLetter && (
            <MoonLetterModal onClose={() => setShowMoonLetter(false)} />
          )}

          {/* 3. Hidden Love Note Modal */}
          {selectedHiddenNote && (
            <HiddenNoteModal
              note={selectedHiddenNote}
              onClose={() => setSelectedHiddenNote(null)}
            />
          )}

          {/* 4. Final Surprise Modal */}
          {showFinalSurprise && (
            <FinalSurpriseModal onClose={handleSurpriseClosed} />
          )}

          {/* 5. Memory Gallery / Photo Customizer */}
          {showPhotoCustomizer && (
            <PhotoCustomizerModal
              customPhotos={customPhotos}
              onPhotoUpdated={handlePhotoUpdated}
              onResetPhotos={handleResetPhotos}
              onClose={() => setShowPhotoCustomizer(false)}
              onSelectMemory={handleSelectMemory}
            />
          )}
        </div>
      )}
    </main>
  );
}
