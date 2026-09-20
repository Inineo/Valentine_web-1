import React, { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  isReducedMotion?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  wobbleSpeed: number;
  wobbleAmplitude: number;
  wobbleOffset: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  isReducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Ensure petals reposition on resize
      petals.forEach(p => {
        if (p.x > width) p.x = width - 20;
        if (p.y > height) p.y = height - 20;
      });
    };
    window.addEventListener('resize', handleResize);

    const petalColors = [
      'rgba(244, 182, 194, 0.45)', // dusty pink
      'rgba(255, 215, 225, 0.35)', // soft blush
      'rgba(215, 120, 140, 0.30)', // rose
      'rgba(255, 240, 230, 0.40)', // warm cream
    ];

    // Create a curated set of 24 slow, gentle petals and dust motes
    const petals: Petal[] = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.012,
      vx: (Math.random() - 0.35) * 0.25,
      vy: Math.random() * 0.35 + 0.15,
      alpha: Math.random() * 0.3 + 0.2,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      wobbleSpeed: Math.random() * 0.02 + 0.008,
      wobbleAmplitude: Math.random() * 0.8 + 0.4,
      wobbleOffset: Math.random() * Math.PI * 2,
    }));

    let frameId: number;
    let time = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      // Soft delicate flower petal curve
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      // Ensure canvas and context are still valid
      if (!canvas || !ctx) {
        return;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (const p of petals) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmplitude;
        p.rotation += p.rotationSpeed;

        // Wrap around boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawPetal(p);
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) return null;

  return (
    <canvas
      id="floating-particles-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
