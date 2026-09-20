import React from 'react';
import { motion } from 'motion/react';
import { ScrapbookItem, MousePosition } from '../types';

interface PaperNoteProps {
  item: ScrapbookItem;
  mousePos: MousePosition;
  isReducedMotion?: boolean;
  viewportWidth: number;
}

export const PaperNote: React.FC<PaperNoteProps> = ({
  item,
  mousePos,
  isReducedMotion = false,
  viewportWidth,
}) => {
  // Determine responsive coordinates
  let currentX = item.x;
  let currentY = item.y;
  let currentScale = item.scale;
  let currentRotation = item.rotation;

  if (viewportWidth < 640 && item.responsive?.mobile) {
    currentX = item.responsive.mobile.x;
    currentY = item.responsive.mobile.y;
    if (item.responsive.mobile.scale !== undefined) {
      currentScale = item.responsive.mobile.scale;
    }
    if (item.responsive.mobile.rotation !== undefined) {
      currentRotation = item.responsive.mobile.rotation;
    }
  } else if (viewportWidth < 1024 && item.responsive?.tablet) {
    currentX = item.responsive.tablet.x;
    currentY = item.responsive.tablet.y;
    if (item.responsive.tablet.scale !== undefined) {
      currentScale = item.responsive.tablet.scale;
    }
    if (item.responsive.tablet.rotation !== undefined) {
      currentRotation = item.responsive.tablet.rotation;
    }
  }

  // Parallax: middle layer moves 4–7px, fragments move 2-4px
  const maxParallax = isReducedMotion ? 0 : 3 + item.depth * 4;
  const parallaxX = mousePos.x * maxParallax;
  const parallaxY = mousePos.y * maxParallax;

  // Render standalone Washi Tape piece
  if (item.type === 'tape') {
    const tapeBg =
      item.tapeColor === 'rose'
        ? 'washi-tape-pink'
        : item.tapeColor === 'kraft'
        ? 'bg-[#d6b797]/70 border-x-2 border-dashed border-[#b38f6b]/50'
        : 'washi-tape';

    return (
      <motion.div
        id={`tape-${item.id}`}
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          zIndex: item.zIndex,
        }}
        animate={{
          x: parallaxX,
          y: parallaxY,
          rotate: currentRotation,
          scale: currentScale,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="absolute pointer-events-none select-none"
      >
        <div className={`w-16 sm:w-24 h-5 sm:h-6 ${tapeBg} shadow-sm transform -rotate-1`} />
      </motion.div>
    );
  }

  // Render decorative subtle Heart / Stamp
  if (item.type === 'heart') {
    return (
      <motion.div
        id={`heart-${item.id}`}
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          zIndex: item.zIndex,
        }}
        animate={{
          x: parallaxX,
          y: parallaxY,
          rotate: currentRotation,
          scale: currentScale,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="absolute pointer-events-none select-none opacity-85 hover:opacity-100 transition-opacity"
      >
        <div className="relative flex items-center justify-center p-2">
          {/* Delicate watercolor / pressed heart motif */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-[#d8687d] drop-shadow-md filter saturate-90"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="absolute text-[9px] font-['Caveat'] text-white/90 font-medium">love</span>
        </div>
      </motion.div>
    );
  }

  // Render small Paper Fragment (e.g. date ticket, postage stamp)
  if (item.type === 'fragment') {
    return (
      <motion.div
        id={`fragment-${item.id}`}
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          zIndex: item.zIndex,
        }}
        animate={{
          x: parallaxX,
          y: parallaxY,
          rotate: currentRotation,
          scale: currentScale,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="absolute pointer-events-none select-none"
      >
        <div className="relative px-3 py-1.5 bg-[#e8ded2] text-[#4d3a43] border border-[#d2c4b4] rounded-[1px] shadow-sm">
          <p className="font-mono text-[10px] tracking-widest uppercase opacity-75">
            {item.noteText}
          </p>
        </div>
      </motion.div>
    );
  }

  // Render Torn Paper Note Card
  const paperColors = {
    torn: 'bg-[#faf6f0] text-[#33222a] border-[#ebdccf]',
    blush: 'bg-[#f7edf0] text-[#422530] border-[#ecd3dc]',
    parchment: 'bg-[#f5eedc] text-[#3e2e28] border-[#dfd4be]',
    kraft: 'bg-[#e4d4c3] text-[#382620] border-[#ccb8a4]',
    lined: 'bg-[#fcfaf5] text-[#2c1d24] border-[#e8dfcf]',
  };

  const selectedStyle = paperColors[item.paperStyle || 'torn'];

  return (
    <motion.div
      id={`paper-note-${item.id}`}
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        zIndex: item.zIndex,
      }}
      animate={{
        x: parallaxX,
        y: parallaxY,
        rotate: currentRotation,
        scale: currentScale,
      }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 24,
        mass: 0.8,
      }}
      className="absolute select-none cursor-default group"
    >
      <div
        className={`relative p-4 sm:p-5 max-w-[220px] sm:max-w-[260px] rounded-[3px] border shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1 ${selectedStyle} torn-edge`}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-film-grain opacity-20 pointer-events-none" />

        {/* Small tape anchor on top */}
        <div className="absolute -top-2.5 left-6 w-12 h-3.5 washi-tape opacity-80" />

        {/* Handwritten primary note */}
        <p className="font-['Caveat'] text-2xl sm:text-3xl leading-snug font-semibold text-[#2f1b23]">
          &ldquo;{item.noteText}&rdquo;
        </p>

        {/* Optional delicate subtext */}
        {item.subText && (
          <p className="mt-2 font-['Cormorant_Garamond'] italic text-xs sm:text-sm text-[#70525e] tracking-wide border-t border-[#dfcfc2]/60 pt-1.5">
            {item.subText}
          </p>
        )}
      </div>
    </motion.div>
  );
};
