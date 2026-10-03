/**
 * Romantic Celestial Audio Synthesizer & Web Audio Engine
 * High quality procedural ambient music & sound effects.
 * 100% self-contained: works offline, zero network dependencies.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private chordIndex = 0;
  private customAudio: HTMLAudioElement | null = null;

  // Romantic chord progression in Db / Ab / Fm / Gb
  // Frequencies in Hz for warm, dreamy piano chords
  private chords = [
    // Db maj7 (Db, F, Ab, C)
    [138.59, 277.18, 349.23, 415.30, 523.25],
    // Ab maj (Ab, C, Eb, G)
    [103.83, 207.65, 261.63, 311.13, 392.00],
    // Fm 7 (F, Ab, C, Eb)
    [87.31, 174.61, 207.65, 261.63, 311.13],
    // Gb maj9 (Gb, Bb, Db, F, Ab)
    [92.50, 185.00, 233.08, 277.18, 349.23, 415.30],
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCustomAudio(url: string) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (url) {
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = this.isMuted ? 0 : 0.65;
      if (this.isPlaying && !this.isMuted) {
        this.customAudio.play().catch(() => {});
      }
    }
  }

  public togglePlay(customUrl?: string): boolean {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(customUrl);
      return true;
    }
  }

  public start(customUrl?: string) {
    this.initContext();
    this.isPlaying = true;
    this.isMuted = false;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    }

    if (customUrl) {
      this.setCustomAudio(customUrl);
      return;
    }

    if (!this.loopTimer) {
      this.playNextChord();
      this.loopTimer = window.setInterval(() => {
        this.playNextChord();
      }, 4500);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime, 0.1);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : 0.65;
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isMuted;
  }

  private playNextChord() {
    if (!this.isPlaying || this.isMuted || !this.ctx || !this.masterGain) return;

    const currentNotes = this.chords[this.chordIndex % this.chords.length];
    this.chordIndex++;

    const now = this.ctx.currentTime;

    // Filter for warm cinematic piano body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.masterGain);

    // Play chord tones with subtle arpeggiation delay
    currentNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteDelay = idx * 0.08 + (Math.random() * 0.03);
      const noteTime = now + noteDelay;

      // Primary tone (triangle wave for piano warmth)
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Gentle sub-sine for depth
      const oscSub = this.ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(freq * 0.5, noteTime);

      // Shimmer overtone (soft bell)
      const oscBell = this.ctx.createOscillator();
      oscBell.type = 'sine';
      oscBell.frequency.setValueAtTime(freq * 2.003, noteTime);

      const noteGain = this.ctx.createGain();
      const velocity = 0.07 / (1 + idx * 0.2);
      noteGain.gain.setValueAtTime(0.0001, noteTime);
      noteGain.gain.exponentialRampToValueAtTime(velocity, noteTime + 0.12);
      noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, noteTime + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.00001, noteTime + 4.2);

      const bellGain = this.ctx.createGain();
      bellGain.gain.setValueAtTime(0.0001, noteTime);
      bellGain.gain.exponentialRampToValueAtTime(velocity * 0.25, noteTime + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.00001, noteTime + 1.8);

      osc.connect(noteGain);
      oscSub.connect(noteGain);
      oscBell.connect(bellGain);

      noteGain.connect(filter);
      bellGain.connect(filter);

      osc.start(noteTime);
      oscSub.start(noteTime);
      oscBell.start(noteTime);

      osc.stop(noteTime + 4.5);
      oscSub.stop(noteTime + 4.5);
      oscBell.stop(noteTime + 4.5);
    });

    // Random gentle high twinkle note
    if (Math.random() > 0.3) {
      const highFreq = currentNotes[Math.floor(Math.random() * currentNotes.length)] * 2;
      const twinkleTime = now + 1.8 + Math.random() * 1.2;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(highFreq, twinkleTime);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, twinkleTime);
      g.gain.exponentialRampToValueAtTime(0.03, twinkleTime + 0.04);
      g.gain.exponentialRampToValueAtTime(0.00001, twinkleTime + 2.2);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(twinkleTime);
      osc.stop(twinkleTime + 2.5);
    }
  }

  // --- INTERACTIVE SFX ---

  public playTwinkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const notes = [659.25, 783.99, 880, 1046.5, 1174.66];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  public playWarp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Cinematic deep whoosh
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(110, now + 2.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  public playCardOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.05, now + i * 0.05 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.05 + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 1.4);
    });
  }

  public playMoonChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.07, now + idx * 0.09 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.09 + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 2.2);
    });
  }

  public playHeartUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Harmonic romantic crescendo
    const notes = [277.18, 349.23, 415.30, 554.37, 698.46, 830.61, 1108.73];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 3.2);
    });
  }
}

export const sound = new RomanticAudioEngine();
