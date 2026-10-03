import React, { useEffect, useState, useRef } from 'react';
import { UNIVERSE_CONFIG } from '../config';
import { sound } from '../utils/audio';

interface OpeningScreenProps {
  onEnter: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<number>(0);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background ambient starfield for opening screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars & cosmic dust
    const stars = Array.from({ length: 450 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    // Occasional shooting star
    let shootingStar: { x: number; y: number; dx: number; dy: number; life: number; maxLife: number } | null = null;

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0c122c');
      bgGrad.addColorStop(0.5, '#080d22');
      bgGrad.addColorStop(1, '#050816');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft breathing nebula clouds
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const neb1 = ctx.createRadialGradient(
        width * 0.45 + Math.sin(time * 0.5) * 30,
        height * 0.5 + Math.cos(time * 0.4) * 20,
        0,
        width * 0.45,
        height * 0.5,
        width * 0.55
      );
      neb1.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
      neb1.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)');
      neb1.addColorStop(1, 'transparent');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Twinkling stars
      for (const s of stars) {
        const twinkle = Math.sin(time * s.speed * 60 + s.phase);
        const a = Math.max(0.1, s.alpha + twinkle * 0.3);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting star logic
      if (!shootingStar && Math.random() < 0.008) {
        shootingStar = {
          x: Math.random() * width * 0.7,
          y: Math.random() * height * 0.4,
          dx: 500,
          dy: 300,
          life: 0,
          maxLife: 1.1,
        };
      }

      if (shootingStar) {
        shootingStar.life += 0.016;
        shootingStar.x += shootingStar.dx * 0.016;
        shootingStar.y += shootingStar.dy * 0.016;
        const progress = shootingStar.life / shootingStar.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        ctx.strokeStyle = `rgba(253, 230, 138, ${alpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - 90, shootingStar.y - 54);
        ctx.stroke();

        if (shootingStar.life >= shootingStar.maxLife) {
          shootingStar = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Text Reveal Timers
  useEffect(() => {
    // Stage 1: Line 1 appears
    const t1 = setTimeout(() => setStage(1), 600);
    // Stage 2: Line 2 appears
    const t2 = setTimeout(() => setStage(2), 2400);
    // Stage 3: Names and Enter button reveal
    const t3 = setTimeout(() => setStage(3), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleEnterClick = () => {
    sound.playWarp();
    sound.start();
    setIsWarping(true);
    setTimeout(() => {
      onEnter();
    }, 1100);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050816] select-none">
      {/* Dynamic Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#050816]/40 to-[#050816]/90 pointer-events-none" />

      {/* Center Cinematic Container */}
      <div
        className={`relative z-10 max-w-3xl mx-auto px-6 py-12 text-center transition-all duration-1000 ease-out ${
          isWarping ? 'scale-150 opacity-0 blur-md pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        {/* Subtle Celestial Badge */}
        <div
          className={`inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#F472B6]/20 bg-[#0B1026]/60 backdrop-blur-md shadow-[0_0_25px_rgba(244,114,182,0.15)] transition-all duration-1000 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDE68A] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#FDE68A]/90 font-medium">
            A Journey Through Starlight
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDE68A] animate-pulse" />
        </div>

        {/* Line 1: Somewhere in this enormous universe... */}
        <h1
          className={`font-serif text-3xl sm:text-5xl md:text-6xl text-[#F8FAFC] tracking-wide font-light transition-all duration-1000 ease-out drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ textWrap: 'balance' }}
        >
          {UNIVERSE_CONFIG.opening.line1}
        </h1>

        {/* Line 2: I found my favorite person. ❤️ */}
        <div
          className={`mt-6 transition-all duration-1000 ease-out delay-200 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p
            className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F472B6] to-[#E0E7FF] drop-shadow-[0_0_30px_rgba(244,114,182,0.5)] font-normal"
            style={{ textWrap: 'balance' }}
          >
            {UNIVERSE_CONFIG.opening.line2}
          </p>
        </div>

        {/* Subtitle: Bitopan & Nisumii */}
        <div
          className={`mt-8 transition-all duration-1000 ease-out ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-sm tracking-[0.2em] uppercase text-[#F8FAFC]/75 font-sans font-medium">
            {UNIVERSE_CONFIG.yourName}{' '}
            <span className="text-[#F472B6] mx-1">✦</span>{' '}
            {UNIVERSE_CONFIG.herName}
          </p>
        </div>

        {/* Animated Button */}
        <div
          className={`mt-10 transition-all duration-1000 ease-out delay-150 ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={handleEnterClick}
            className="group relative inline-flex items-center justify-center px-9 py-4 rounded-full bg-gradient-to-r from-[#7C3AED]/40 via-[#EC4899]/50 to-[#7C3AED]/40 hover:from-[#7C3AED]/70 hover:via-[#EC4899]/80 hover:to-[#7C3AED]/70 border border-[#F472B6]/50 hover:border-[#FDE68A] text-white font-medium text-sm sm:text-base tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(236,72,153,0.35)] hover:shadow-[0_0_50px_rgba(253,230,138,0.6)] hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <span className="relative z-10 flex items-center gap-2 drop-shadow-sm font-semibold text-white">
              {UNIVERSE_CONFIG.opening.buttonText}
            </span>
            <div className="absolute inset-0 rounded-full bg-[#FDE68A]/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />
          </button>

          {/* Quiet Audio Hint & Download HTML option */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#F8FAFC]/50 font-sans tracking-wide">
            <span>{UNIVERSE_CONFIG.opening.hintText}</span>
            <span className="hidden sm:inline">·</span>
            <a
              href="/our-universe.html"
              download="our-universe.html"
              className="text-[#FDE68A]/80 hover:text-[#FDE68A] hover:underline flex items-center gap-1 cursor-pointer"
              title="Download single-file offline HTML"
            >
              <span>Download Offline HTML 📥</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
