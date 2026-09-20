import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScrapbookItem, MousePosition } from '../types';

interface PolaroidProps {
  item: ScrapbookItem;
  mousePos: MousePosition;
  isReducedMotion?: boolean;
  onSelect?: (item: ScrapbookItem) => void;
  viewportWidth: number;
}

export const Polaroid: React.FC<PolaroidProps> = ({
  item,
  mousePos,
  isReducedMotion = false,
  onSelect,
  viewportWidth,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Pointer parallax calculation: depth (0.1 to 1.0) maps to 8-12px for foreground
  const maxParallax = isReducedMotion ? 0 : 8 + item.depth * 5; // 8 - 13px
  const parallaxX = mousePos.x * maxParallax;
  const parallaxY = mousePos.y * maxParallax;

  return (
    <motion.div
      id={`polaroid-${item.id}`}
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        zIndex: isHovered ? 50 : item.zIndex,
      }}
      animate={{
        x: parallaxX,
        y: parallaxY,
        rotate: isHovered ? currentRotation * 0.4 : currentRotation,
        scale: isHovered ? currentScale * 1.04 : currentScale,
      }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 24,
        mass: 0.8,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect && onSelect(item)}
      className="absolute cursor-pointer select-none group touch-manipulation origin-center"
    >
      {/* Physical Polaroid Card */}
      <div
        className={`relative w-52 sm:w-60 md:w-64 p-3 pb-6 sm:pb-7 rounded-[2px] transition-all duration-300
          ${isHovered ? 'polaroid-shadow-hover -translate-y-1.5' : 'polaroid-shadow'}
          bg-[#fcfaf7] border border-[#eee7dc]`}
      >
        {/* Subtle physical paper texture & aged gloss reflection */}
        <div className="absolute inset-0 bg-film-grain opacity-25 rounded-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f3ece0]/20 via-white/40 to-transparent pointer-events-none rounded-[2px]" />

        {/* Polaroid Inner Photo Container with matte border bevel */}
        <div className="relative w-full aspect-square bg-[#22171c] overflow-hidden rounded-[1px] shadow-inner">
          {/* Subtle loading placeholder shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#2d1b22] animate-pulse flex items-center justify-center">
              <span className="text-xs text-[#a8828f] font-serif italic">developing photo...</span>
            </div>
          )}

          {item.image && (
            <img
              src={item.image}
              alt={item.caption || 'Valentine memory'}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover filter contrast-[1.03] saturate-[1.08] transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-95' : 'opacity-0'
              }`}
            />
          )}

          {/* Vignette on photo itself for vintage analog warmth */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#10080c]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-amber-900/10 mix-blend-color pointer-events-none" />
        </div>

        {/* Handwritten Caption Section */}
        {item.caption && (
          <div className="pt-3 px-1 text-center">
            <p className="font-['Caveat'] text-[#3b2a31] text-lg sm:text-xl leading-tight tracking-wide antialiased">
              {item.caption}
            </p>
          </div>
        )}

        {/* Subtle corner thumb-tack or tape hint on hover */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 washi-tape opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};
