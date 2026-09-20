import React, { useEffect, useRef, useState } from 'react';

interface ScrubVideoProps {
  scrollProgress: number; // 0 to 1
  videoSrc?: string;
  isReducedMotion?: boolean;
}

export const ScrubVideo: React.FC<ScrubVideoProps> = ({
  scrollProgress,
  videoSrc = '/videos/flower.mp4',
  isReducedMotion = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const targetTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Fallback canvas animation when video is loading or if error occurs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    let t = 0;

    const renderCanvas = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Deep romantic background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      // Soft burgundy to dusty rose to deep espresso
      bgGrad.addColorStop(0, '#38121d');
      bgGrad.addColorStop(0.4, '#240a13');
      bgGrad.addColorStop(0.8, '#14060b');
      bgGrad.addColorStop(1, '#0c0306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Procedural blossoming flower simulation controlled by scroll
      const bloomProgress = Math.min(Math.max(scrollProgress, 0), 1);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.22 * (0.8 + bloomProgress * 0.6);

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw soft blooming floral petals layers
      const petalLayers = 4;
      const petalsPerLayer = 8;

      for (let layer = petalLayers; layer >= 1; layer--) {
        const layerScale = 0.4 + (layer / petalLayers) * 0.6 + bloomProgress * 0.15;
        const layerAlpha = 0.18 + (layer / petalLayers) * 0.12;
        const rotOffset = t * 0.05 * (layer % 2 === 0 ? 1 : -1) + layer * 0.35 + bloomProgress * 0.8;

        for (let i = 0; i < petalsPerLayer; i++) {
          const angle = (i * Math.PI * 2) / petalsPerLayer + rotOffset;
          const dist = baseRadius * layerScale;

          ctx.save();
          ctx.rotate(angle);
          ctx.translate(0, dist * 0.5);

          const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, dist * 0.8);
          if (layer === 1) {
            grad.addColorStop(0, 'rgba(235, 120, 150, 0.4)');
            grad.addColorStop(1, 'rgba(180, 40, 75, 0.0)');
          } else if (layer === 2) {
            grad.addColorStop(0, 'rgba(215, 85, 115, 0.35)');
            grad.addColorStop(1, 'rgba(140, 25, 55, 0.0)');
          } else {
            grad.addColorStop(0, 'rgba(160, 45, 75, 0.25)');
            grad.addColorStop(1, 'rgba(80, 15, 35, 0.0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(0, 0, dist * 0.55, dist * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Center glowing bud
      const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 0.45);
      centerGrad.addColorStop(0, 'rgba(255, 210, 180, 0.45)');
      centerGrad.addColorStop(0.3, 'rgba(230, 95, 130, 0.3)');
      centerGrad.addColorStop(1, 'rgba(60, 10, 20, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      frameId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [scrollProgress]);

  // Handle video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setIsMetadataLoaded(true);
      setHasVideoError(false);
      // Immediately prime first frame
      if (video.duration) {
        video.currentTime = 0.001;
      }
    };

    const onError = () => {
      setHasVideoError(true);
      setIsMetadataLoaded(false);
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('error', onError);
    video.addEventListener('seeked', onSeeked);

    // If already loaded
    if (video.readyState >= 1 && video.duration) {
      setIsMetadataLoaded(true);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [videoSrc]);

  // Synchronize video currentTime to scroll progress smoothly
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMetadataLoaded || !video.duration || Number.isNaN(video.duration)) {
      return;
    }

    // Clamp progress
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 0.999);
    targetTimeRef.current = clampedProgress * video.duration;

    // Run smooth scrub animation loop
    const step = () => {
      if (!video || !video.duration) return;

      const target = targetTimeRef.current;
      const current = video.currentTime;
      const delta = target - current;

      // If noticeable difference and not currently blocked by seeking
      if (Math.abs(delta) > 0.02) {
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          // Smooth dampening towards target
          const nextTime = current + delta * (isReducedMotion ? 0.4 : 0.22);
          video.currentTime = Math.max(0, Math.min(video.duration, nextTime));
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [scrollProgress, isMetadataLoaded, isReducedMotion]);

  return (
    <div
      id="cinematic-video-container"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#10060a]"
    >
      {/* Background canvas fallback & ambient organic blooming glow */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isMetadataLoaded && !hasVideoError ? 'opacity-40' : 'opacity-100'
        }`}
      />

      {/* HTML5 Video Element scrubbed via currentTime */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isMetadataLoaded && !hasVideoError ? 'opacity-85' : 'opacity-0'
        }`}
      />

      {/* Soft romantic vignette and color tint overlay so scrapbook elements pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14080e]/60 via-[#1a0812]/40 to-[#0e0407]/80 mix-blend-multiply pointer-events-none" />

      {/* Warm cinematic rose/burgundy glow in the center */}
      <div className="absolute inset-0 bg-radial from-rose-950/20 via-transparent to-black/60 pointer-events-none" />

      {/* Subtle film grain texture overlay */}
      <div className="absolute inset-0 bg-film-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
