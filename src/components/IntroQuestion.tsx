/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

interface IntroQuestionProps {
  onAccept: () => void;
}

const noTexts = [
  "No",
  "Are you sure? 🥺",
  "Really? Think again! 😭",
  "Please?",
  "Give it a chance!",
  "You cannot say no! 😉"
];

export function IntroQuestion({ onAccept }: IntroQuestionProps) {
  const [yesScale, setYesScale] = useState(1);
  const [noClicks, setNoClicks] = useState(0);
  const [noOffset, setNoOffset] = useState(0);
  const [noOpacity, setNoOpacity] = useState(1);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const [btnOriginalWidth, setBtnOriginalWidth] = useState(0);
  const [btnOriginalHeight, setBtnOriginalHeight] = useState(0);

  useEffect(() => {
    if (yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      setBtnOriginalWidth(rect.width);
      setBtnOriginalHeight(rect.height);
    }
  }, []);

  const handleNoClick = () => {
    const newNoClicks = noClicks + 1;
    setNoClicks(newNoClicks);

    if (btnOriginalWidth === 0 || btnOriginalHeight === 0) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate target scale to cover screen (same as reference)
    const targetScale = Math.max(vw / btnOriginalWidth, vh / btnOriginalHeight) * 2.0;
    const scaleStep = (targetScale - 1) / 12;
    
    const newYesScale = yesScale + scaleStep;
    setYesScale(newYesScale);

    // Calculate offset based on Yes button growth (same as reference)
    const yesOutwardGrowth = (newYesScale - 1) * (btnOriginalWidth / 2);
    const offset = yesOutwardGrowth + 30 + (newNoClicks * 15);
    setNoOffset(offset);

    // Hide No button when Yes covers screen
    if (newYesScale >= targetScale) {
      setNoOpacity(0);
    }
  };

  const currentNoText = noTexts[noClicks % noTexts.length];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Main Question */}
        <div className="mb-16">
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-tight animate-fade-in">
            Will you be my
          </h1>
          <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-pink-500 bg-clip-text text-transparent mt-2 animate-fade-in-delay">
            valentine?
          </h1>
        </div>

        {/* Buttons Container */}
        <div className="flex items-center justify-center gap-8 min-h-[150px] relative">
          {/* Yes Button - grows on No click */}
          <button
            ref={yesButtonRef}
            onClick={onAccept}
            className="relative px-10 py-5 bg-gradient-to-r from-pink-500 to-red-500 text-white font-sans font-bold text-lg rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group z-10"
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformOrigin: 'center center',
            }}
          >
            <span className="relative z-10">Yes</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* No Button - slides to the right */}
          <button
            onClick={handleNoClick}
            className="relative px-10 py-5 bg-gray-800/80 text-gray-300 font-sans font-bold text-lg rounded-full shadow-xl hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm border border-white/20"
            style={{
              transform: `translateX(${noOffset}px)`,
              transition: 'transform 0.4s ease-out, opacity 0.3s ease',
              opacity: noOpacity,
              pointerEvents: noOpacity === 0 ? 'none' : 'auto',
            }}
          >
            {currentNoText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
