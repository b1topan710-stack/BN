import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UNIVERSE_CONFIG, MemoryItem, HiddenLoveNote } from '../config';
import { sound } from '../utils/audio';

interface GalaxyCanvasProps {
  onSelectMemory: (memory: MemoryItem) => void;
  onOpenMoonLetter: () => void;
  onSelectHiddenNote: (note: HiddenLoveNote) => void;
  isConstellationGlowing: boolean;
  onTriggerSurprise?: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  life: number;
  maxLife: number;
}

interface ConstellationPoint {
  x: number;
  y: number;
  label?: string;
  size: number;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  onSelectMemory,
  onOpenMoonLetter,
  onSelectHiddenNote,
  isConstellationGlowing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera state
  const cameraRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    zoom: 1,
    targetZoom: 1,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cameraStartX: 0,
    cameraStartY: 0,
    pinchDist: 0,
  });

  // Hovered item tooltip
  const [hoveredLabel, setHoveredLabel] = useState<{
    text: string;
    subtext?: string;
    screenX: number;
    screenY: number;
    type: 'planet' | 'moon' | 'secret' | 'heart';
  } | null>(null);

  // Entities
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Constellation heart points (centered around x: 380, y: -220 in galaxy coordinates)
  const heartCenter = { x: 340, y: -200 };
  const heartPointsRef = useRef<ConstellationPoint[]>([]);

  // Initialize stars & heart constellation
  useEffect(() => {
    // Generate 1200 background stars
    const stars: Star[] = [];
    const colors = ['#FFFFFF', '#E0E7FF', '#FDE68A', '#FBCFE8', '#BAE6FD', '#DDD6FE'];
    for (let i = 0; i < 1200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 50 + Math.pow(Math.random(), 0.7) * 2200;
      stars.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    starsRef.current = stars;

    // Heart constellation points (parametric heart curve)
    const heartPts: ConstellationPoint[] = [];
    const numPoints = 16;
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      // Parametric equations for a heart
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const scale = 5.5;
      heartPts.push({
        x: heartCenter.x + hx * scale,
        y: heartCenter.y + hy * scale,
        size: 3.5,
      });
    }
    heartPointsRef.current = heartPts;
  }, []);

  // Responsive canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      timeRef.current += dt;
      const time = timeRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;

      // Smooth camera interpolation
      const cam = cameraRef.current;
      cam.x += (cam.targetX - cam.x) * 0.08;
      cam.y += (cam.targetY - cam.y) * 0.08;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.08;

      ctx.save();
      ctx.clearRect(0, 0, w, h);

      // Deep space base fill
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, w, h);

      // Coordinate transform for galaxy space
      ctx.translate(w / 2, h / 2);
      ctx.scale(cam.zoom * dpr, cam.zoom * dpr);
      ctx.translate(-cam.x, -cam.y);

      // 1. NEBULA CLOUDS (Procedural soft cosmic dust)
      drawNebulas(ctx, time);

      // 2. BACKGROUND STARS (Multi-depth twinkling)
      drawStars(ctx, time);

      // 3. SHOOTING STARS
      updateAndDrawShootingStars(ctx, dt);

      // 4. CENTRAL GALAXY CORE & LOGO
      drawCentralCore(ctx, time);

      // 5. HEART CONSTELLATION
      drawHeartConstellation(ctx, time, isConstellationGlowing);

      // 6. ORBIT PATHS & PLANETS (Memory Stars)
      drawPlanets(ctx, time);

      // 7. THE MOON
      drawMoon(ctx, time);

      // 8. HIDDEN LOVE NOTES
      drawHiddenNotes(ctx, time);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isConstellationGlowing]);

  // --- DRAWING FUNCTIONS ---

  const drawNebulas = (ctx: CanvasRenderingContext2D, time: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const lobes = [
      { x: -180 + Math.sin(time * 0.15) * 40, y: -120 + Math.cos(time * 0.12) * 30, r: 650, color: 'rgba(124, 58, 237, 0.18)' }, // Purple
      { x: 220 + Math.cos(time * 0.18) * 50, y: 140 + Math.sin(time * 0.14) * 40, r: 720, color: 'rgba(236, 72, 153, 0.15)' }, // Pink
      { x: 320 + Math.sin(time * 0.11) * 35, y: -220 + Math.cos(time * 0.16) * 30, r: 580, color: 'rgba(244, 114, 182, 0.14)' }, // Soft Rose (Heart area)
      { x: -300 + Math.cos(time * 0.13) * 45, y: 260 + Math.sin(time * 0.1) * 35, r: 600, color: 'rgba(6, 182, 212, 0.12)' }, // Cyan
      { x: 0, y: 0, r: 450, color: 'rgba(253, 230, 138, 0.09)' }, // Center gold warm glow
    ];

    lobes.forEach(lobe => {
      const grad = ctx.createRadialGradient(lobe.x, lobe.y, 0, lobe.x, lobe.y, lobe.r);
      grad.addColorStop(0, lobe.color);
      grad.addColorStop(0.5, lobe.color.replace(/[\d\.]+\)$/, '0.06)'));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lobe.x, lobe.y, lobe.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  const drawStars = (ctx: CanvasRenderingContext2D, time: number) => {
    const stars = starsRef.current;
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.phase);
      const alpha = Math.max(0.1, star.baseAlpha + twinkle * 0.35);

      ctx.fillStyle = star.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow for larger stars
      if (star.size > 1.4 && alpha > 0.6) {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  const updateAndDrawShootingStars = (ctx: CanvasRenderingContext2D, dt: number) => {
    // Randomly spawn a shooting star
    if (Math.random() < dt * 0.25 && shootingStarsRef.current.length < 3) {
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = 600 + Math.random() * 400;
      const speed = 700 + Math.random() * 500;
      const trajectory = startAngle + Math.PI + (Math.random() - 0.5) * 0.6;
      shootingStarsRef.current.push({
        x: Math.cos(startAngle) * startDist,
        y: Math.sin(startAngle) * startDist,
        dx: Math.cos(trajectory) * speed,
        dy: Math.sin(trajectory) * speed,
        length: 120 + Math.random() * 80,
        speed,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.6,
      });
    }

    // Update and draw existing shooting stars
    const remaining: ShootingStar[] = [];
    for (let i = 0; i < shootingStarsRef.current.length; i++) {
      const s = shootingStarsRef.current[i];
      s.life += dt;
      if (s.life < s.maxLife) {
        s.x += s.dx * dt;
        s.y += s.dy * dt;
        const progress = s.life / s.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        const tailX = s.x - (s.dx / s.speed) * s.length;
        const tailY = s.y - (s.dy / s.speed) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
        grad.addColorStop(0.3, `rgba(244, 114, 182, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(124, 58, 237, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        remaining.push(s);
      }
    }
    shootingStarsRef.current = remaining;
  };

  const drawCentralCore = (ctx: CanvasRenderingContext2D, time: number) => {
    ctx.save();

    // Swirling galactic center core
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 95);
    const pulse = 1 + Math.sin(time * 1.5) * 0.08;
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    coreGrad.addColorStop(0.2, 'rgba(253, 230, 138, 0.8)');
    coreGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.35)');
    coreGrad.addColorStop(0.8, 'rgba(124, 58, 237, 0.15)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 95 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Rotating cosmic spiral arms around core
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.15)';
    ctx.lineWidth = 1.5;
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      const armOffset = (arm * Math.PI * 2) / 3 + time * 0.08;
      for (let r = 20; r < 120; r += 4) {
        const theta = armOffset + (r / 30);
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;
        if (r === 20) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Two names & tagline in galaxy center
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Couple Names
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText(`${UNIVERSE_CONFIG.yourName} ❤️ ${UNIVERSE_CONFIG.herName}`, 0, -8);

    // Tagline
    ctx.font = 'italic 12px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(253, 230, 138, 0.9)';
    ctx.shadowColor = 'rgba(253, 230, 138, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fillText(UNIVERSE_CONFIG.tagline, 0, 14);

    ctx.restore();
  };

  const drawHeartConstellation = (
    ctx: CanvasRenderingContext2D,
    time: number,
    isGlowing: boolean
  ) => {
    const pts = heartPointsRef.current;
    if (pts.length < 2) return;

    ctx.save();
    const pulse = isGlowing ? 1 + Math.sin(time * 3) * 0.15 : 1 + Math.sin(time * 1.2) * 0.05;
    const baseColor = isGlowing ? 'rgba(244, 114, 182, 0.85)' : 'rgba(244, 114, 182, 0.35)';

    // Connecting lines
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = isGlowing ? 2.5 : 1.2;
    ctx.shadowColor = isGlowing ? '#F472B6' : '#7C3AED';
    ctx.shadowBlur = isGlowing ? 18 : 6;

    ctx.beginPath();
    for (let i = 0; i <= pts.length; i++) {
      const pt = pts[i % pts.length];
      // Scale around heart center
      const px = heartCenter.x + (pt.x - heartCenter.x) * pulse;
      const py = heartCenter.y + (pt.y - heartCenter.y) * pulse;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Constellation stars
    pts.forEach((pt, idx) => {
      const px = heartCenter.x + (pt.x - heartCenter.x) * pulse;
      const py = heartCenter.y + (pt.y - heartCenter.y) * pulse;
      const starGlow = Math.sin(time * 2 + idx * 0.5) * 0.3 + 0.7;

      ctx.fillStyle = isGlowing ? '#FDE68A' : '#FFFFFF';
      ctx.shadowColor = isGlowing ? '#FDE68A' : '#F472B6';
      ctx.shadowBlur = isGlowing ? 14 : 6;
      ctx.beginPath();
      ctx.arc(px, py, (isGlowing ? pt.size * 1.4 : pt.size) * starGlow, 0, Math.PI * 2);
      ctx.fill();
    });

    // Label for the heart
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isGlowing ? '#FDE68A' : 'rgba(253, 230, 138, 0.7)';
    ctx.shadowBlur = isGlowing ? 8 : 4;
    ctx.fillText("Constellation of Us", heartCenter.x, heartCenter.y + 75 * pulse);

    ctx.restore();
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D, time: number) => {
    UNIVERSE_CONFIG.memories.forEach((mem) => {
      ctx.save();

      // Orbit ellipse
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, mem.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Current position on orbit
      const currentAngle = time * mem.orbitSpeed * 30 + (mem.orbitRadius * 0.1);
      const px = Math.cos(currentAngle) * mem.orbitRadius;
      const py = Math.sin(currentAngle) * mem.orbitRadius;

      // Outer atmosphere halo
      const haloGrad = ctx.createRadialGradient(px, py, mem.size * 0.8, px, py, mem.size * 2.8);
      haloGrad.addColorStop(0, `${mem.planetColor}66`);
      haloGrad.addColorStop(0.6, `${mem.planetColor}22`);
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(px, py, mem.size * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Planet Sphere 3D shading
      // Light source comes from the central galactic core (0,0)
      const lightAngle = Math.atan2(-py, -px);
      const lightOffsetX = Math.cos(lightAngle) * (mem.size * 0.35);
      const lightOffsetY = Math.sin(lightAngle) * (mem.size * 0.35);

      const sphereGrad = ctx.createRadialGradient(
        px + lightOffsetX,
        py + lightOffsetY,
        mem.size * 0.1,
        px,
        py,
        mem.size
      );
      sphereGrad.addColorStop(0, '#FFFFFF');
      sphereGrad.addColorStop(0.3, mem.planetColor);
      sphereGrad.addColorStop(0.85, darkenColor(mem.planetColor, 0.5));
      sphereGrad.addColorStop(1, '#050816');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(px, py, mem.size, 0, Math.PI * 2);
      ctx.fill();

      // Planetary rings (if enabled)
      if (mem.hasRings) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(0.35);
        ctx.scale(1, 0.3);
        ctx.strokeStyle = `${mem.planetColor}aa`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, mem.size * 1.9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Memory Category / Title Label
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F8FAFC';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(mem.category, px, py + mem.size + 16);

      ctx.restore();
    });
  };

  const drawMoon = (ctx: CanvasRenderingContext2D, time: number) => {
    // Fixed celestial position in upper-left quadrant
    const mx = -400;
    const my = -240;
    const moonRadius = 26;

    ctx.save();

    // Ethereal lunar aura
    const moonAura = ctx.createRadialGradient(mx, my, moonRadius * 0.8, mx, my, moonRadius * 3.5);
    const pulse = 1 + Math.sin(time * 1.4) * 0.06;
    moonAura.addColorStop(0, 'rgba(253, 230, 138, 0.45)');
    moonAura.addColorStop(0.4, 'rgba(253, 230, 138, 0.15)');
    moonAura.addColorStop(1, 'transparent');
    ctx.fillStyle = moonAura;
    ctx.beginPath();
    ctx.arc(mx, my, moonRadius * 3.5 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // 3D Lunar Body
    const moonGrad = ctx.createRadialGradient(mx - 8, my - 8, 2, mx, my, moonRadius);
    moonGrad.addColorStop(0, '#FFFBEB');
    moonGrad.addColorStop(0.6, '#FDE68A');
    moonGrad.addColorStop(0.85, '#D97706');
    moonGrad.addColorStop(1, '#1E1B4B');

    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(mx, my, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle craters
    ctx.fillStyle = 'rgba(180, 83, 9, 0.2)';
    ctx.beginPath();
    ctx.arc(mx - 6, my + 4, 4.5, 0, Math.PI * 2);
    ctx.arc(mx + 8, my - 6, 3, 0, Math.PI * 2);
    ctx.arc(mx + 5, my + 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE68A';
    ctx.shadowColor = 'rgba(253, 230, 138, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText("Nisumii's Letter 💌", mx, my + moonRadius + 18);

    ctx.restore();
  };

  const drawHiddenNotes = (ctx: CanvasRenderingContext2D, time: number) => {
    UNIVERSE_CONFIG.hiddenNotes.forEach((note, idx) => {
      const nx = note.xRatio * 700;
      const ny = note.yRatio * 500;
      const sparkle = Math.sin(time * 3 + idx * 1.2) * 0.4 + 0.6;

      ctx.save();
      // Pulsing starlight ring
      ctx.strokeStyle = `rgba(253, 230, 138, ${sparkle * 0.6})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nx, ny, 8 * sparkle, 0, Math.PI * 2);
      ctx.stroke();

      // Twinkling core star
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FDE68A';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Subtle diffraction cross
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(nx - 7, ny);
      ctx.lineTo(nx + 7, ny);
      ctx.moveTo(nx, ny - 7);
      ctx.lineTo(nx, ny + 7);
      ctx.stroke();

      ctx.restore();
    });
  };

  // Helper: darken hex color for 3D sphere gradient shading
  const darkenColor = (hex: string, factor: number) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    let r = (num >> 16) * factor;
    let g = ((num >> 8) & 0x00FF) * factor;
    let b = (num & 0x0000FF) * factor;
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  };

  // --- INTERACTIVITY (HIT TESTING & DRAGGING) ---

  const getGalaxyCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    const cam = cameraRef.current;

    // Invert translation and zoom
    const gx = (canvasX - window.innerWidth / 2) / cam.zoom + cam.x;
    const gy = (canvasY - window.innerHeight / 2) / cam.zoom + cam.y;
    return { x: gx, y: gy };
  }, []);

  const findHoveredObject = useCallback((gx: number, gy: number, clientX: number, clientY: number) => {
    const time = timeRef.current;

    // Check Moon
    const mx = -400;
    const my = -240;
    const moonDist = Math.hypot(gx - mx, gy - my);
    if (moonDist < 36) {
      setHoveredLabel({
        text: "Special Letter",
        subtext: `For ${UNIVERSE_CONFIG.herName} ❤️`,
        screenX: clientX,
        screenY: clientY,
        type: 'moon',
      });
      return { type: 'moon' as const };
    }

    // Check Memory Planets
    for (const mem of UNIVERSE_CONFIG.memories) {
      const angle = time * mem.orbitSpeed * 30 + (mem.orbitRadius * 0.1);
      const px = Math.cos(angle) * mem.orbitRadius;
      const py = Math.sin(angle) * mem.orbitRadius;
      const dist = Math.hypot(gx - px, gy - py);
      if (dist < mem.size + 14) {
        setHoveredLabel({
          text: mem.title,
          subtext: mem.category,
          screenX: clientX,
          screenY: clientY,
          type: 'planet',
        });
        return { type: 'planet' as const, memory: mem, px, py };
      }
    }

    // Check Hidden Love Notes
    for (const note of UNIVERSE_CONFIG.hiddenNotes) {
      const nx = note.xRatio * 700;
      const ny = note.yRatio * 500;
      const dist = Math.hypot(gx - nx, gy - ny);
      if (dist < 18) {
        setHoveredLabel({
          text: "Secret Love Note ✨",
          subtext: "Click to reveal whisper",
          screenX: clientX,
          screenY: clientY,
          type: 'secret',
        });
        return { type: 'secret' as const, note };
      }
    }

    // Check Heart Constellation center
    const heartDist = Math.hypot(gx - heartCenter.x, gy - heartCenter.y);
    if (heartDist < 70) {
      setHoveredLabel({
        text: "Constellation of Us",
        subtext: "Connected in starlight ✨",
        screenX: clientX,
        screenY: clientY,
        type: 'heart',
      });
      return { type: 'heart' as const };
    }

    setHoveredLabel(null);
    return null;
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraRef.current.isDragging = true;
    cameraRef.current.dragStartX = e.clientX;
    cameraRef.current.dragStartY = e.clientY;
    cameraRef.current.cameraStartX = cameraRef.current.targetX;
    cameraRef.current.cameraStartY = cameraRef.current.targetY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const cam = cameraRef.current;
    if (cam.isDragging) {
      const dx = (e.clientX - cam.dragStartX) / cam.zoom;
      const dy = (e.clientY - cam.dragStartY) / cam.zoom;
      cam.targetX = cam.cameraStartX - dx;
      cam.targetY = cam.cameraStartY - dy;
    } else {
      const { x: gx, y: gy } = getGalaxyCoordinates(e.clientX, e.clientY);
      findHoveredObject(gx, gy, e.clientX, e.clientY);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const cam = cameraRef.current;
    const moved = Math.hypot(e.clientX - cam.dragStartX, e.clientY - cam.dragStartY);
    cam.isDragging = false;

    // If mouse was clicked without significant drag, trigger selection
    if (moved < 6) {
      const { x: gx, y: gy } = getGalaxyCoordinates(e.clientX, e.clientY);
      const hit = findHoveredObject(gx, gy, e.clientX, e.clientY);
      if (hit) {
        sound.playTwinkle();
        if (hit.type === 'moon') {
          sound.playMoonChime();
          // Pan camera slightly towards moon
          cam.targetX = -400;
          cam.targetY = -240;
          cam.targetZoom = 1.25;
          onOpenMoonLetter();
        } else if (hit.type === 'planet') {
          sound.playCardOpen();
          // Smooth focus zoom on selected planet
          cam.targetX = hit.px;
          cam.targetY = hit.py;
          cam.targetZoom = 1.35;
          onSelectMemory(hit.memory);
        } else if (hit.type === 'secret') {
          sound.playTwinkle();
          onSelectHiddenNote(hit.note);
        }
      }
    }
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const cam = cameraRef.current;
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.min(Math.max(cam.targetZoom * zoomFactor, 0.45), 2.8);
    cam.targetZoom = newZoom;
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const cam = cameraRef.current;
    if (e.touches.length === 1) {
      cam.isDragging = true;
      cam.dragStartX = e.touches[0].clientX;
      cam.dragStartY = e.touches[0].clientY;
      cam.cameraStartX = cam.targetX;
      cam.cameraStartY = cam.targetY;
    } else if (e.touches.length === 2) {
      cam.pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const cam = cameraRef.current;
    if (e.touches.length === 1 && cam.isDragging) {
      const dx = (e.touches[0].clientX - cam.dragStartX) / cam.zoom;
      const dy = (e.touches[0].clientY - cam.dragStartY) / cam.zoom;
      cam.targetX = cam.cameraStartX - dx;
      cam.targetY = cam.cameraStartY - dy;
    } else if (e.touches.length === 2) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (cam.pinchDist > 0) {
        const factor = newDist / cam.pinchDist;
        cam.targetZoom = Math.min(Math.max(cam.targetZoom * factor, 0.45), 2.8);
      }
      cam.pinchDist = newDist;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const cam = cameraRef.current;
    if (cam.isDragging && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const moved = Math.hypot(touch.clientX - cam.dragStartX, touch.clientY - cam.dragStartY);
      if (moved < 8) {
        const { x: gx, y: gy } = getGalaxyCoordinates(touch.clientX, touch.clientY);
        const hit = findHoveredObject(gx, gy, touch.clientX, touch.clientY);
        if (hit) {
          sound.playTwinkle();
          if (hit.type === 'moon') {
            sound.playMoonChime();
            cam.targetX = -400;
            cam.targetY = -240;
            cam.targetZoom = 1.25;
            onOpenMoonLetter();
          } else if (hit.type === 'planet') {
            sound.playCardOpen();
            cam.targetX = hit.px;
            cam.targetY = hit.py;
            cam.targetZoom = 1.35;
            onSelectMemory(hit.memory);
          } else if (hit.type === 'secret') {
            sound.playTwinkle();
            onSelectHiddenNote(hit.note);
          }
        }
      }
    }
    cam.isDragging = false;
    cam.pinchDist = 0;
  };

  // Zoom controls for UI buttons
  const zoomIn = () => {
    cameraRef.current.targetZoom = Math.min(cameraRef.current.targetZoom * 1.3, 2.8);
  };
  const zoomOut = () => {
    cameraRef.current.targetZoom = Math.max(cameraRef.current.targetZoom * 0.77, 0.45);
  };
  const resetCamera = () => {
    cameraRef.current.targetX = 0;
    cameraRef.current.targetY = 0;
    cameraRef.current.targetZoom = 1;
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#050816]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Floating Tooltip */}
      {hoveredLabel && (
        <div
          className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: hoveredLabel.screenX, top: hoveredLabel.screenY - 12 }}
        >
          <div className="bg-[#0B1026]/90 backdrop-blur-md border border-[#F472B6]/40 px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(244,114,182,0.3)] text-center whitespace-nowrap">
            <p className="text-xs font-semibold text-white tracking-wide">{hoveredLabel.text}</p>
            {hoveredLabel.subtext && (
              <p className="text-[10px] text-[#FDE68A]/90 font-serif italic">{hoveredLabel.subtext}</p>
            )}
          </div>
        </div>
      )}

      {/* Galaxy Viewport Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="w-10 h-10 rounded-full bg-[#0B1026]/80 hover:bg-[#1E1B4B] border border-white/10 hover:border-[#F472B6]/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95 text-lg"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="w-10 h-10 rounded-full bg-[#0B1026]/80 hover:bg-[#1E1B4B] border border-white/10 hover:border-[#F472B6]/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95 text-lg"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={resetCamera}
          title="Center Galaxy"
          className="w-10 h-10 rounded-full bg-[#0B1026]/80 hover:bg-[#1E1B4B] border border-white/10 hover:border-[#FDE68A]/50 text-[#FDE68A] flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95 text-xs font-medium"
          aria-label="Center camera"
        >
          🎯
        </button>
      </div>
    </div>
  );
};
