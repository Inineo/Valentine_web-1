import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrubVideo } from './ScrubVideo';
import { ScrapbookLayer } from './ScrapbookLayer';
import { FloatingParticles } from './FloatingParticles';
import { MousePosition } from '../types';
import { ChevronDown, Volume2, VolumeX, RotateCcw, Heart, Sparkles } from 'lucide-react';

export const ValentineExperience: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Optimized Scroll Listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalScroll > 0 ? Math.min(Math.max(currentScroll / totalScroll, 0), 1) : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pointer position tracker (normalized -1 to 1 from screen center)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }, [isReducedMotion]);

  // Subtle synthesized ambient romantic sound generator via Web Audio API
  const toggleAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.connect(ctx.destination);

        // Gentle harmonic chord drone (warm F# major 9th)
        const notes = [185.0, 233.08, 277.18, 349.23, 440.0];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle slow LFO vibrato
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.2 + idx * 0.05;
          lfoGain.gain.value = 1.5;
          lfo.connect(osc.frequency);
          lfo.start();

          noteGain.gain.setValueAtTime(0.02 / notes.length, ctx.currentTime);
          osc.connect(noteGain);
          noteGain.connect(gainNode);
          osc.start();
        });

        audioCtxRef.current = ctx;
        audioGainRef.current = gainNode;
        setIsAudioPlaying(true);
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        setIsAudioPlaying(true);
      } else if (isAudioPlaying) {
        audioGainRef.current?.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsAudioPlaying(false);
        }, 250);
      } else {
        audioCtxRef.current.resume();
        audioGainRef.current?.gain.setTargetAtTime(0.04, audioCtxRef.current.currentTime, 0.2);
        setIsAudioPlaying(true);
      }
    } catch {
      // Audio context might fail silently if autoplay blocked
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToStart = () => {
    window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  };

  // Visibility states for story progression
  // 0 - 15%: Title only
  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.15));
  // 90 - 100%: Final Screen message
  const finalScreenOpacity = scrollProgress >= 0.88 ? Math.min(1, (scrollProgress - 0.88) / 0.09) : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[500vh] bg-[#0d0408] text-[#f7f2ee] select-none"
    >
      {/* Fixed Fullscreen Viewport Layer */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Cinematic Scroll-Controlled Background Video */}
        <ScrubVideo
          scrollProgress={scrollProgress}
          videoSrc="/videos/flower.mp4"
          isReducedMotion={isReducedMotion}
        />

        {/* Ambient Petals and Floating Particles */}
        <FloatingParticles isReducedMotion={isReducedMotion} />

        {/* Interactive Physical Scrapbook Collage Layer */}
        <ScrapbookLayer
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          isReducedMotion={isReducedMotion}
        />

        {/* --- Phase 0–15%: Initial Title Screen --- */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translate3d(0, ${scrollProgress * -60}px, 0)`,
            pointerEvents: scrollProgress < 0.12 ? 'auto' : 'none',
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 transition-opacity duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/30 text-rose-200/90 text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Cinematic Scrapbook</span>
            </div>

            <h1 className="font-['Cormorant_Garamond'] text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-[#fcedf0] drop-shadow-lg leading-tight">
              Happy Valentine’s Day
            </h1>

            <p className="mt-4 font-['Caveat'] text-2xl sm:text-3xl text-rose-200/85 tracking-wide">
              a timeline of our favourite quiet memories
            </p>

            <button
              type="button"
              onClick={scrollToStart}
              className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d8b4be] hover:text-[#fff] transition-colors group cursor-pointer"
            >
              <span>Scroll to unveil scrapbook</span>
              <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* --- Phase 90–100%: Final Screen Romantic Message --- */}
        <div
          style={{
            opacity: finalScreenOpacity,
            transform: `translate3d(0, ${(1 - finalScreenOpacity) * 20}px, 0)`,
            pointerEvents: scrollProgress >= 0.88 ? 'auto' : 'none',
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-40 transition-opacity duration-500"
        >
          {/* Subtle darkening backdrop card to ensure ultimate legibility over completed collage */}
          <div className="relative max-w-xl mx-auto px-8 py-10 rounded-2xl bg-[#14060c]/75 backdrop-blur-md border border-rose-900/30 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-950/60 border border-rose-700/40 flex items-center justify-center mb-5 text-[#e57088] shadow-inner">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>

            <p className="font-['Cormorant_Garamond'] italic text-2xl sm:text-3xl text-[#f3d9e0] leading-relaxed">
              &ldquo;Some memories are worth keeping forever.&rdquo;
            </p>

            <div className="mt-4 h-px w-20 mx-auto bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />

            <h2 className="mt-4 font-['Caveat'] text-3xl sm:text-4xl text-[#ffc5d3] font-bold tracking-wide">
              Happy Valentine&apos;s Day ♥
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#bda4ac] font-['Plus_Jakarta_Sans'] font-light">
              Every chapter with you is my favorite story.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3d1221] hover:bg-[#52192d] text-[#ffe6ed] text-xs font-medium tracking-wider uppercase transition-all shadow-md hover:scale-105 cursor-pointer border border-rose-700/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Relive Journey</span>
              </button>
            </div>
          </div>
        </div>

        {/* Persistent Floating Controls (Sound & Timeline Indicator) */}
        <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-40 flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isAudioPlaying ? 'Mute ambient melody' : 'Play ambient melody'}
            className="w-10 h-10 rounded-full bg-[#1e0a12]/80 backdrop-blur-md border border-rose-900/40 text-rose-200 flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#2e101d] transition-all cursor-pointer"
            title={isAudioPlaying ? 'Mute ambient melody' : 'Play ambient melody'}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-rose-300" /> : <VolumeX className="w-4 h-4 text-rose-400/60" />}
          </button>
        </div>

        {/* Minimal Scroll Progress Indicator at Bottom */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-auto">
          <div className="w-36 sm:w-48 h-1 rounded-full bg-rose-950/60 border border-rose-900/30 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-rose-700 via-rose-400 to-rose-300 transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-rose-200/60 font-mono">
            <span>{Math.round(scrollProgress * 100)}%</span>
            <span>•</span>
            <span>
              {scrollProgress < 0.15
                ? 'Prologue'
                : scrollProgress < 0.35
                ? 'First spark'
                : scrollProgress < 0.55
                ? 'Shared moments'
                : scrollProgress < 0.75
                ? 'Golden memories'
                : scrollProgress < 0.9
                ? 'Heartstrings'
                : 'Forever'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
