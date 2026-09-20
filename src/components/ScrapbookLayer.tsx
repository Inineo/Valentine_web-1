import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrapbookItem, MousePosition } from '../types';
import { scrapbookItems } from '../data/scrapbookData';
import { Polaroid } from './Polaroid';
import { PaperNote } from './PaperNote';
import { X, Heart, Sparkles } from 'lucide-react';

interface ScrapbookLayerProps {
  scrollProgress: number;
  mousePos: MousePosition;
  isReducedMotion?: boolean;
}

export const ScrapbookLayer: React.FC<ScrapbookLayerProps> = ({
  scrollProgress,
  mousePos,
  isReducedMotion = false,
}) => {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [selectedItem, setSelectedItem] = useState<ScrapbookItem | null>(null);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id="scrapbook-interactive-layer"
      className="fixed inset-0 w-full h-full pointer-events-none z-20 overflow-hidden"
    >
      {/* Container for absolute positioned scrapbook elements */}
      <div className="relative w-full h-full pointer-events-auto">
        {scrapbookItems.map((item) => {
          // Calculation of enter progress
          const enterThreshold = item.enterProgress;
          const peakThreshold = item.peakProgress || enterThreshold + 0.08;

          // Compute normalized reveal: 0 (not revealed) to 1 (fully revealed)
          let reveal = 0;
          if (scrollProgress >= peakThreshold) {
            reveal = 1;
          } else if (scrollProgress > enterThreshold) {
            reveal = (scrollProgress - enterThreshold) / (peakThreshold - enterThreshold);
          }

          if (reveal <= 0.01) return null;

          // Easing for placement
          const opacity = Math.min(1, reveal * 1.2);
          const yOffset = (1 - reveal) * 28; // enters floating downwards
          const scaleMultiplier = 0.9 + reveal * 0.1;

          return (
            <div
              key={item.id}
              style={{
                opacity,
                transform: `translate3d(0, ${yOffset}px, 0) scale(${scaleMultiplier})`,
                transition: isReducedMotion ? 'opacity 0.2s ease' : 'none',
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="w-full h-full relative pointer-events-auto">
                {item.type === 'polaroid' ? (
                  <Polaroid
                    item={item}
                    mousePos={mousePos}
                    isReducedMotion={isReducedMotion}
                    onSelect={setSelectedItem}
                    viewportWidth={viewportWidth}
                  />
                ) : (
                  <PaperNote
                    item={item}
                    mousePos={mousePos}
                    isReducedMotion={isReducedMotion}
                    viewportWidth={viewportWidth}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Polaroid Inspection Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full bg-[#fdfaf5] p-5 pb-8 rounded-[4px] polaroid-shadow border border-[#ded4c5] cursor-default"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close photo inspection"
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#2a131a] text-[#f7e6ea] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative w-full aspect-square bg-[#1a0e13] rounded-[2px] overflow-hidden shadow-inner">
                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.caption || 'Valentine memory'}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/25 pointer-events-none" />
              </div>

              {selectedItem.caption && (
                <div className="mt-4 text-center">
                  <p className="font-['Caveat'] text-2xl sm:text-3xl text-[#2d1b22] font-semibold">
                    {selectedItem.caption}
                  </p>
                  <p className="mt-1 font-['Cormorant_Garamond'] italic text-sm text-[#876572] flex items-center justify-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-[#d8687d] text-[#d8687d]" />
                    <span>Cherished keepsake</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#d8687d]" />
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
