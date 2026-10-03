# OUR UNIVERSE 🌌❤️
### A Celestial Romantic Interactive Experience for Nisumii & Bitopan

A cinematic, interactive galaxy created with love. Explore glowing stars, orbiting planets carrying real memories, a luminous moon with a handwritten letter, hidden whispers in the starlight, and an unlockable glowing heart constellation.

---

## ✨ Features

- **Cinematic Opening Screen**: Screenshot-worthy deep-space canvas with twinkling stars, drifting colorful nebulas, shooting stars, and emotional sequential text reveal.
- **Interactive Living Galaxy**:
  - Deep space with procedural nebulas and 1,200 multi-depth stars.
  - 6 Orbiting Memory Planets with 3D sphere lighting, rings, and orbital paths.
  - The Luminous Moon with an emotional handwritten letter for Nisumii.
  - Interconnected Heart-Shaped Constellation.
  - Hidden Love Notes hidden among tiny twinkling stars.
  - Shooting stars and floating cosmic dust.
- **Memories & Photographs**:
  - Pre-configured with Bitopan and Nisumii's special moments (The First Day in Class, Looking at you from behind, The Township Function, Why I Love You, Our Future, and The Quiet Truth).
  - High-fidelity cinematic celestial illustrations by default.
  - In-app **Photo Manager**: Easily upload or swap any photo directly from your device (automatically saved to your browser!).
- **Audio Experience**:
  - Built-in Web Audio API romantic acoustic piano & ambient celestial synthesizer.
  - Zero external dependencies or broken links.
  - Twinkle sound effects, warp whoosh, moon chime, and constellation unlock chords.
  - Visual animated equalizer toggle (Mute / Unmute).
  - Support for custom MP3 soundtrack via configuration or upload.
- **The Final Surprise**:
  - Cinematic revelation when the heart constellation flares into radiant gold and rose starlight: *"And if I had a thousand universes to choose from... I'd still choose you. ❤️"*
- **Desktop & Mobile Responsive**:
  - Mouse drag, wheel zoom, click navigation.
  - Mobile touch drag, pinch-to-zoom, and tap navigation.

---

## 🎨 How to Personalize

All text, names, dates, memories, and messages are configured in:
`src/config.ts`

### 1. Changing Names & Opening Text
Open `src/config.ts` and modify:
```typescript
export const UNIVERSE_CONFIG = {
  yourName: "Bitopan",
  herName: "Nisumii😚",
  tagline: "Our own little universe.",
  opening: {
    line1: "Somewhere in this enormous universe...",
    line2: "I found my favorite person. ❤️",
    buttonText: "ENTER OUR UNIVERSE ✨",
  },
  ...
}
```

### 2. Changing or Adding Memories
Inside `UNIVERSE_CONFIG.memories`, each memory has:
- `category`: "Our Beginning", "My Favorite Memory", etc.
- `title`: Name of the memory
- `description`: The story or message
- `caption`: Photo caption
- `planetColor`: Hex color for the planet
- `photoUrl`: Default photo or illustration path

### 3. Adding Your Own Photos
You have two easy ways:
1. **Directly in the App**: Click **Photos & Memories 📷** in the top bar (or "Change Photo" on any memory card) to upload photos straight from your phone or computer.
2. **In Code**: Place your photos into `src/assets/images/` and import them in `src/config.ts`.

### 4. Custom Music
To use an external song instead of the built-in piano synthesizer:
Place an audio file in `public/music.mp3` and set:
```typescript
audio: {
  customAudioUrl: "/music.mp3",
  defaultVolume: 0.65,
}
```

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` (or the port shown in your terminal).
