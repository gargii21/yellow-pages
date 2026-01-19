// Calendar.jsx
import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Get array of 12 months starting from current month
  const getMonthsArray = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(currentMonth.add(i, 'month'));
    }
    return months;
  };

  // Generate calendar for a specific month
  const generateCalendar = (month) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const startDay = startOfMonth.day(); // 0 = Sunday, 6 = Saturday
    const daysInMonth = endOfMonth.date();
    
    const weeks = [];
    let week = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(month).date(day);
      week.push(date);
      
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    
    // Add empty cells for remaining days in last week
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const months = getMonthsArray();
  const isToday = (date) => date && dayjs().isSame(date, 'day');
  const isSelected = (date) => date && selectedDate.isSame(date, 'day');

  // Handle click on date button
  const handleDateClick = (date, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        // Close if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#fadf44] rounded-2xl shadow-2xl p-6 max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-handwritten text-black">Select a Date</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-2xl font-handwritten text-black hover:opacity-70"
          >
            ✕
          </button>
        </div>
        
        {/* Month Navigation */}
        <div className="flex justify-between mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMonth(currentMonth.subtract(12, 'month'));
            }}
            className="px-4 py-2 font-handwritten text-black bg-white/30 hover:bg-white/40 rounded-lg"
          >
            ← Previous Year
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentMonth(currentMonth.add(12, 'month'));
            }}
            className="px-4 py-2 font-handwritten text-black bg-white/30 hover:bg-white/40 rounded-lg"
          >
            Next Year →
          </button>
        </div>
        
        {/* Calendar Grid - 3 months per row */}
        <div className="grid grid-cols-3 gap-6">
          {months.map((month, monthIndex) => (
            <div key={monthIndex} className="bg-white/20 rounded-xl p-4">
              {/* Month Header */}
              <h3 className="text-xl font-handwritten text-black text-center mb-3">
                {month.format('MMMM YYYY')}
              </h3>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center font-handwritten text-black/70 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="space-y-1">
                {generateCalendar(month).map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((date, dayIndex) => (
                      <div key={dayIndex} className="text-center">
                        {date ? (
                          <button
                            onClick={(e) => handleDateClick(date, e)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-handwritten text-sm transition-all cursor-pointer
                              ${isToday(date) ? 'bg-[#FFDE21] border-2 border-black' : ''}
                              ${isSelected(date) ? 'bg-black text-[#fadf44]' : 'hover:bg-white/30 text-black'}
                              ${date.month() !== month.month() ? 'text-black/40' : ''}
                            `}
                          >
                            {date.date()}
                          </button>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Current Date Indicator */}
        <div className="mt-6 pt-4 border-t border-black/20">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFDE21] border border-black"></div>
              <span className="font-handwritten text-black">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-black"></div>
              <span className="font-handwritten text-black">Selected Date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;