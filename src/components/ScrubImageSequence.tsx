import React, { useEffect, useRef, useState } from 'react';

interface ScrubImageSequenceProps {
  scrollProgress: number; // 0 to 1
  frameFolder: string;
  frameCount: number;
  framePrefix: string;
  frameExtension: string;
  isReducedMotion?: boolean;
}

export const ScrubImageSequence: React.FC<ScrubImageSequenceProps> = ({
  scrollProgress,
  frameFolder = '/frames/blooming',
  frameCount = 305,
  framePrefix = 'frame_',
  frameExtension = 'jpg',
  isReducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const auraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const currentFrameRef = useRef<number>(0);

  // Crossfade transition: both aura and image visible during transitions
  // This creates a morphing effect from aura to flower
  let imageOpacity = 0;
  let auraOpacity = 1;
  
  // Aura opacity: visible 0-16%, crossfades 16-19%, dims during flower 19-80%, crossfades back 80-83%
  if (scrollProgress < 0.16) {
    auraOpacity = 1;
    imageOpacity = 0;
  } else if (scrollProgress < 0.19) {
    // Crossfade 16-19%: both visible, aura dims as flower brightens
    const fadeProgress = (scrollProgress - 0.16) / 0.03;
    auraOpacity = 1 - (fadeProgress * 0.7); // Aura dims to 0.3 (not fully hidden for blend)
    imageOpacity = fadeProgress; // Image fades in 0 -> 1
  } else if (scrollProgress < 0.80) {
    // Flower dominant, aura subtle in background
    auraOpacity = 0.3;
    imageOpacity = 1;
  } else if (scrollProgress < 0.83) {
    // Crossfade 80-83%: flower dims as aura brightens
    const fadeProgress = (scrollProgress - 0.80) / 0.03;
    imageOpacity = 1 - fadeProgress; // Image fades out 1 -> 0
    auraOpacity = 0.3 + (fadeProgress * 0.7); // Aura brightens 0.3 -> 1
  } else {
    auraOpacity = 1;
    imageOpacity = 0;
  }

  // Preload all images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(4, '0');
      img.src = `${frameFolder}/${framePrefix}${frameNumber}.${frameExtension}`;
      
      img.onload = () => {
        loaded++;
        setLoadProgress(loaded / frameCount);
        if (loaded === frameCount) {
          setIsLoaded(true);
          console.log('All frames loaded!');
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame: ${img.src}`);
        loaded++;
        setLoadProgress(loaded / frameCount);
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [frameFolder, frameCount, framePrefix, frameExtension]);

  // Set up canvas size (runs once and on resize)
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]);

  // Draw current frame based on scroll progress
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Map scroll progress to frame index
    // Video plays from 19% to 77% scroll (when fully visible)
    // This gives time for fade in (16-19%) and fade out (80-83%) transitions
    let videoProgress = 0;
    if (scrollProgress < 0.19) {
      videoProgress = 0;
    } else if (scrollProgress <= 0.77) {
      // Play video from 19% to 77% scroll
      videoProgress = (scrollProgress - 0.19) / (0.77 - 0.19);
    } else {
      // Keep at last frame during fade out
      videoProgress = 1;
    }

    const frameIndex = Math.min(
      Math.floor(videoProgress * frameCount),
      frameCount - 1
    );

    // Only redraw if frame changed
    if (frameIndex === currentFrameRef.current) return;
    currentFrameRef.current = frameIndex;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to cover viewport (like CSS object-fit: cover)
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > canvasAspect) {
      // Image is wider - fit to height
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller - fit to width
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    // Manual adjustment: shift slightly left and up to align with aura
    const adjustX = -30; // Shift left
    const adjustY = -20; // Shift up
    
    offsetX += adjustX;
    offsetY += adjustY;

    // Draw the frame centered and covering viewport
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [scrollProgress, isLoaded, frameCount]);

  // Aura canvas animation - ALWAYS renders as background
  useEffect(() => {
    const canvas = auraCanvasRef.current;
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
      bgGrad.addColorStop(0, '#38121d');
      bgGrad.addColorStop(0.4, '#240a13');
      bgGrad.addColorStop(0.8, '#14060b');
      bgGrad.addColorStop(1, '#0c0306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Procedural blossoming flower simulation
      const bloomProgress = Math.min(Math.max(scrollProgress, 0), 1);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.22 * (0.8 + bloomProgress * 0.6);

      ctx.save();
      ctx.translate(centerX, centerY);

      const petalLayers = 4;
      const petalsPerLayer = 8;

      for (let layer = petalLayers; layer >= 1; layer--) {
        const layerScale = 0.4 + (layer / petalLayers) * 0.6 + bloomProgress * 0.15;
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
  }, [scrollProgress]); // Always active, depends on scrollProgress

  return (
    <div
      id="cinematic-image-sequence-container"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#10060a]"
    >
      {/* Aura canvas - always visible as background */}
      <canvas
        ref={auraCanvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: auraOpacity }}
      />

      {/* Image sequence canvas - fades in/out over aura */}
      {isLoaded && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full transition-opacity duration-300"
          style={{ 
            opacity: imageOpacity,
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-rose-200/80 text-sm font-mono">
            Loading frames... {Math.round(loadProgress * 100)}%
          </div>
        </div>
      )}

      {/* Tint overlays - removed auraOpacity control, always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14080e]/60 via-[#1a0812]/40 to-[#0e0407]/80 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-rose-950/20 via-transparent to-black/60 pointer-events-none" />

      {/* Film grain texture */}
      <div className="absolute inset-0 bg-film-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
