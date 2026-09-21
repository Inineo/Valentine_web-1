import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface CustomTimePickerProps {
  value: string; // HH:MM format
  onChange: (time: string) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const [selectedHour, selectedMinute] = value.split(':').map(v => parseInt(v));

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(v => parseInt(v));
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeStr);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1">
      {/* Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-base text-[#f3d9e0] font-['Plus_Jakarta_Sans'] cursor-pointer w-full"
      >
        <Clock className="w-4 h-4 text-rose-300 flex-shrink-0" />
        <span>{formatTime(value)}</span>
      </button>

      {/* Dropdown Time Picker */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Time Picker Popup */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-[#1a0812]/95 backdrop-blur-md border border-rose-800/40 rounded-xl shadow-2xl p-4 w-72">
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-[#fcedf0] font-['Cormorant_Garamond']">
                Select Time
              </div>
              <div className="text-sm text-rose-300">
                {formatTime(value)}
              </div>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hours Column */}
              <div>
                <div className="text-xs text-rose-400/70 font-medium mb-2 text-center">Hour</div>
                <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-rose-800/50">
                  {hours.map(hour => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleTimeSelect(hour, selectedMinute)}
                      className={`
                        aspect-square rounded-lg text-sm transition-all
                        ${hour === selectedHour
                          ? 'bg-gradient-to-br from-rose-600 to-rose-500 text-white font-bold shadow-lg scale-110'
                          : 'text-[#f3d9e0] hover:bg-rose-900/30 hover:scale-105'
                        }
                      `}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div>
                <div className="text-xs text-rose-400/70 font-medium mb-2 text-center">Minute</div>
                <div className="space-y-2">
                  {minutes.map(minute => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleTimeSelect(selectedHour, minute)}
                      className={`
                        w-full py-3 rounded-lg text-sm transition-all
                        ${minute === selectedMinute
                          ? 'bg-gradient-to-br from-rose-600 to-rose-500 text-white font-bold shadow-lg'
                          : 'text-[#f3d9e0] hover:bg-rose-900/30'
                        }
                      `}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cute Footer */}
            <div className="mt-4 pt-3 border-t border-rose-800/30 text-center">
              <p className="text-xs text-rose-300/60 font-['Caveat'] italic">
                Perfect timing ♥
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
