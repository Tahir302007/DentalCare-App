import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { dentists } from '../data';
import { timeSlots } from '../data';

interface StepDateTimeProps {
  selectedDentistId: string;
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot: string;
  onSelectDate: (date: string) => void;
  onSelectTimeSlot: (slot: string) => void;
}

export default function StepDateTime({
  selectedDentistId,
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
}: StepDateTimeProps) {
  const dentist = useMemo(() => dentists.find(d => d.id === selectedDentistId), [selectedDentistId]);

  // Calendar States
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Helper to check if a dentist works on a given weekday
  const isDentistAvailableOnDay = (date: Date) => {
    if (!dentist) return true;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return dentist.availability.includes(dayName);
  };

  // Switch month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    const isCurrentMonthOrPast = currentYear === today.getFullYear() && currentMonth <= today.getMonth();
    if (isCurrentMonthOrPast) return; // Prevent going to past months

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    // Prefix padding from previous month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, date: null, isPast: true });
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      // Disable past days (comparing only dates, ignoring hours)
      const dateNoTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const isPast = dateNoTime < todayNoTime;
      const isSunday = dateObj.getDay() === 0; // Dentist closed on Sunday
      const preferred = isDentistAvailableOnDay(dateObj) && !isPast && !isSunday;

      days.push({
        day: d,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isPast,
        isSunday,
        preferred,
      });
    }

    return days;
  }, [currentYear, currentMonth, dentist, today]);

  const handleDaySelect = (dateStr: string) => {
    onSelectDate(dateStr);
  };

  const getDentistNotice = () => {
    if (!dentist) return null;
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-xs text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
        <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">{dentist.name}</span> works on: <span className="font-semibold">{dentist.availability.join(', ')}</span>.
          We have highlighted these days inside the calendar for your convenience.
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Choose Date & Time
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Pick a date and an available slot that works for you.
        </p>
      </div>

      {getDentistNotice()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar visualizer column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base font-heading">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentYear === today.getFullYear() && currentMonth <= today.getMonth()}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/80 text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels Grid */}
          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map(day => (
              <div key={day} className="text-xs font-semibold text-gray-400 dark:text-slate-500 py-1.5">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {calendarDays.map((item, index) => {
              if (!item.day || !item.date) {
                return <div key={`empty-${index}`} className="aspect-square"></div>;
              }

              const isSelected = selectedDate === item.date;
              const isPastOrSun = item.isPast || item.isSunday;

              return (
                <button
                  key={item.date}
                  type="button"
                  disabled={isPastOrSun}
                  onClick={() => handleDaySelect(item.date!)}
                  className={`aspect-square rounded-xl text-sm font-medium flex flex-col items-center justify-center relative transition-all duration-150 cursor-pointer
                    ${isPastOrSun 
                      ? 'text-gray-300 dark:text-slate-700 pointer-events-none' 
                      : isSelected
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : item.preferred
                          ? 'bg-indigo-50/50 hover:bg-indigo-100/80 dark:bg-indigo-950/15 dark:hover:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 hover:border-indigo-300 border border-dashed border-indigo-200 dark:border-indigo-900/40'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <span>{item.day}</span>
                  {/* Subtle indication for Dentist availability dots */}
                  {item.preferred && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-150 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50"></span>
              <span>Available working days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>Selected Date</span>
            </div>
          </div>
        </div>

        {/* Time slot column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex-1 flex flex-col">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3 font-heading flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-gray-400" />
              Available Slots
            </h3>
            
            {!selectedDate ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                <CalendarIcon className="w-9 h-9 text-gray-300 dark:text-slate-600 mb-2.5" />
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Select an active date from the calendar to display time slots.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Showing slots for: <span className="font-bold">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {timeSlots.map(slot => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        id={`time-slot-${slot.replace(':', '').replace(' ', '')}`}
                        type="button"
                        onClick={() => onSelectTimeSlot(slot)}
                        className={`py-3 px-4 rounded-xl text-xs font-semibold text-center border transition-all duration-150 cursor-pointer outline-none
                          ${isSelected
                            ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md transform scale-[1.02]'
                            : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }
                        `}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
