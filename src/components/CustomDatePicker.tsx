import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDate = new Date(year, month, day);
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isSelectedDay = (day: number | null) => {
    if (!day) return false;
    const selected = new Date(value);
    return (
      day === selected.getDate() &&
      currentMonth.getMonth() === selected.getMonth() &&
      currentMonth.getFullYear() === selected.getFullYear()
    );
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="relative">
      {/* Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-base text-[#f3d9e0] font-['Plus_Jakarta_Sans'] cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-rose-300" />
        <span>{formatDisplayDate(value)}</span>
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Popup */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-[#1a0812]/95 backdrop-blur-md border border-rose-800/40 rounded-xl shadow-2xl p-4 w-80">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-rose-900/30 transition-colors text-rose-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-[#fcedf0] font-['Cormorant_Garamond']">
                  {months[currentMonth.getMonth()]}
                </div>
                <div className="text-sm text-rose-300">
                  {currentMonth.getFullYear()}
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-rose-900/30 transition-colors text-rose-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-xs text-rose-400/70 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={!day}
                  className={`
                    aspect-square rounded-lg text-sm transition-all
                    ${!day ? 'invisible' : ''}
                    ${isSelectedDay(day) 
                      ? 'bg-gradient-to-br from-rose-600 to-rose-500 text-white font-bold shadow-lg scale-110' 
                      : isToday(day)
                      ? 'bg-rose-900/40 text-rose-200 font-semibold border border-rose-500/50'
                      : 'text-[#f3d9e0] hover:bg-rose-900/30 hover:scale-105'
                    }
                  `}
                >
                  {day}
                  {isSelectedDay(day) && (
                    <div className="text-xs">♥</div>
                  )}
                </button>
              ))}
            </div>

            {/* Cute Footer */}
            <div className="mt-4 pt-3 border-t border-rose-800/30 text-center">
              <p className="text-xs text-rose-300/60 font-['Caveat'] italic">
                Pick a special day ♥
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
