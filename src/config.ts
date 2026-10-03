/**
 * OUR UNIVERSE 🌌❤️ - CONFIGURATION FILE
 * 
 * You can easily edit any text, names, dates, memories, love notes, 
 * photos, and audio in this file. 
 * Everything updates automatically in the universe!
 */

// Import generated cinematic illustrations as defaults
import classroomImg from '@/src/assets/images/first_day_classroom_1791044459920.jpg';
import sittingBehindImg from '@/src/assets/images/sitting_behind_you_1791044473203.jpg';
import townshipImg from '@/src/assets/images/township_function_1791044486150.jpg';
import heartConstellationImg from '@/src/assets/images/heart_constellation_1791044500210.jpg';

export interface MemoryItem {
  id: string;
  category: string;
  title: string;
  date?: string;
  description: string;
  photoUrl: string;
  caption: string;
  planetColor: string; // Hex color for the planet
  orbitRadius: number; // Distance from center
  orbitSpeed: number; // Speed of orbit
  size: number; // Visual radius on canvas
  hasRings?: boolean;
}

export interface HiddenLoveNote {
  id: string;
  message: string;
  xRatio: number; // -1 to 1 relative to center
  yRatio: number; // -1 to 1 relative to center
}

export interface UniverseConfig {
  yourName: string;
  herName: string;
  tagline: string;
  
  // Opening Screen
  opening: {
    line1: string;
    line2: string;
    buttonText: string;
    hintText: string;
  };

  // Audio settings
  audio: {
    // If you have a custom music file in public/assets or an mp3 URL, specify it here.
    // Otherwise, the built-in cinematic piano/ambient synthesizer plays smoothly!
    customAudioUrl?: string;
    defaultVolume: number;
  };

  // Celestial Memory Stars (Planets & Beacons)
  memories: MemoryItem[];

  // Moon Letter addressed to her
  moonLetter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signOffName: string;
  };

  // Hidden Love Notes sprinkled across the cosmos
  hiddenNotes: HiddenLoveNote[];

  // Final Surprise
  finalSurprise: {
    line1: string;
    line2: string;
    buttonText: string;
    badgeText: string;
    image: string;
  };
}

export const UNIVERSE_CONFIG: UniverseConfig = {
  yourName: "Bitopan",
  herName: "Nisumii😚",
  tagline: "Our own little universe.",

  // Opening cinematic screen text
  opening: {
    line1: "Somewhere in this enormous universe...",
    line2: "I found my favorite person. ❤️",
    buttonText: "ENTER OUR UNIVERSE ✨",
    hintText: "Put on headphones for the full celestial experience",
  },

  // Audio soundtrack
  audio: {
    customAudioUrl: "", // Leave empty to use the built-in peaceful romantic piano synthesizer
    defaultVolume: 0.65,
  },

  // Interactive Celestial Memory Objects
  memories: [
    {
      id: "memory-1",
      category: "Our Beginning",
      title: "The First Day in Class",
      date: "Day One",
      description: "You know I was the first to talk with you from our class when it was your first day. From that very first conversation, you brought a warmth that completely changed my world.",
      photoUrl: classroomImg,
      caption: "The start of something unforgettable ✨",
      planetColor: "#F59E0B", // Warm gold / amber
      orbitRadius: 180,
      orbitSpeed: 0.0007,
      size: 14,
      hasRings: true,
    },
    {
      id: "memory-2",
      category: "My Favorite Memory",
      title: "Looking at You from Behind",
      date: "Every Sweet Afternoon",
      description: "You know I was looking at you all day when I sat behind you at class. Every time you turned or smiled, time seemed to stand completely still.",
      photoUrl: sittingBehindImg,
      caption: "You were the only view that mattered 🌸",
      planetColor: "#EC4899", // Rose pink
      orbitRadius: 260,
      orbitSpeed: 0.0005,
      size: 16,
      hasRings: false,
    },
    {
      id: "memory-3",
      category: "The Best Day",
      title: "Township Function Magic",
      date: "Our Unforgettable Day",
      description: "The day we met at the function in township was honestly my best day. Seeing you there, laughing together amidst the crowd and lights, made me realize just how deeply I cherish you.",
      photoUrl: townshipImg,
      caption: "My happiest memory under the evening lights 🏮",
      planetColor: "#8B5CF6", // Violet nebula
      orbitRadius: 340,
      orbitSpeed: 0.00035,
      size: 18,
      hasRings: true,
    },
    {
      id: "memory-4",
      category: "Why I Love You",
      title: "Your Smile & Your Heart",
      date: "Always & Forever",
      description: "I love the way your eyes crinkle when you laugh, how you make ordinary moments feel like pure starlight, and the quiet comfort you bring just by being in my life.",
      photoUrl: sittingBehindImg,
      caption: "Pure, radiant, and true 💫",
      planetColor: "#06B6D4", // Luminous cyan
      orbitRadius: 420,
      orbitSpeed: 0.00028,
      size: 15,
      hasRings: false,
    },
    {
      id: "memory-5",
      category: "Our Future",
      title: "A Thousand New Tomorrows",
      date: "The Journey Ahead",
      description: "No matter where life takes us or what challenges arise, my dream is simple: to hold your hand, explore the world together, and keep creating memories under every sky.",
      photoUrl: classroomImg,
      caption: "Written in the constellations 🌌",
      planetColor: "#10B981", // Emerald celestial
      orbitRadius: 490,
      orbitSpeed: 0.00022,
      size: 17,
      hasRings: true,
    },
    {
      id: "memory-6",
      category: "A Little Secret",
      title: "The Quiet Truth",
      date: "Every Single Day",
      description: "Even when I don't say it out loud, you are the very first thought in my mind when I wake up and the calmest peace before I fall asleep. You are my safe haven.",
      photoUrl: townshipImg,
      caption: "A whisper between the stars 🌙",
      planetColor: "#F43F5E", // Soft ruby
      orbitRadius: 560,
      orbitSpeed: 0.00018,
      size: 13,
      hasRings: false,
    },
  ],

  // Interactive Moon letter addressed to Nisumii
  moonLetter: {
    salutation: "Hey, Nisumii😚. ❤️",
    paragraphs: [
      "Out of all the stars in the universe, you are the one I keep coming back to.",
      "I made this little universe just for you, filled with tiny pieces of what you mean to me.",
      "No matter how big the universe gets, I hope you always remember that you have a special place in mine.",
    ],
    closing: "With all my love,",
    signOffName: "Bitopan",
  },

  // Tiny hidden love notes floating in the galaxy
  hiddenNotes: [
    {
      id: "note-1",
      message: "You make ordinary days feel so special.",
      xRatio: 0.35,
      yRatio: -0.42,
    },
    {
      id: "note-2",
      message: "My favorite notification is always yours. 💌",
      xRatio: -0.45,
      yRatio: 0.38,
    },
    {
      id: "note-3",
      message: "If I could choose again, I'd still want to meet you every time.",
      xRatio: 0.52,
      yRatio: 0.28,
    },
    {
      id: "note-4",
      message: "You are my favorite part of this universe. ✨",
      xRatio: -0.28,
      yRatio: -0.52,
    },
    {
      id: "note-5",
      message: "Every smile of yours adds another star to my sky.",
      xRatio: 0.12,
      yRatio: 0.58,
    },
  ],

  // Final Surprise Sequence
  finalSurprise: {
    line1: "And if I had a thousand universes to choose from...",
    line2: "I'd still choose you. ❤️",
    buttonText: "STAY IN OUR UNIVERSE ✨",
    badgeText: "Constellation of Nisumii & Bitopan Forever",
    image: heartConstellationImg,
  },
};
