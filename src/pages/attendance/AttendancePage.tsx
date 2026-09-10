import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  CalendarCheck,
  CalendarX,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Check,
  LogOut,
  CalendarDays,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '../../utils';
import { Modal } from '../../components/ui';

interface DayAttendance {
  day: number;
  month: 'prev' | 'current' | 'next';
  status?: 'present' | 'absent' | 'leave';
  checkIn?: string;
  checkOut?: string;
  hours?: string;
}

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { isClockedIn } = useAppStore();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(3); // 3 = April
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [isFullCalendarModalOpen, setIsFullCalendarModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const months = [
    'January 2025',
    'February 2025',
    'March 2025',
    'April 2025',
    'May 2025',
    'June 2025',
  ];

  // Calendar days matching April 2025 in the reference image
  // April 1, 2025 starts on Tuesday. March has 31 days (Sunday 30, Monday 31).
  const aprilDays: DayAttendance[] = [
    { day: 30, month: 'prev' },
    { day: 31, month: 'prev' },
    { day: 1, month: 'current', status: 'present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { day: 2, month: 'current', status: 'present', checkIn: '09:12 AM', checkOut: '06:05 PM', hours: '8h 53m' },
    { day: 3, month: 'current', status: 'present', checkIn: '08:58 AM', checkOut: '06:00 PM', hours: '9h 02m' },
    { day: 4, month: 'current', status: 'absent' }, // Absent (Red dot)
    { day: 5, month: 'current', status: 'present', checkIn: '09:15 AM', checkOut: '01:30 PM', hours: '4h 15m' },
    { day: 6, month: 'current', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 7, month: 'current', status: 'present', checkIn: '09:10 AM', checkOut: '06:15 PM', hours: '9h 05m' },
    { day: 8, month: 'current', status: 'present', checkIn: '09:12 AM', checkOut: '06:08 PM', hours: '8h 56m' }, // Selected day in image
    { day: 9, month: 'current', status: 'present', checkIn: '09:04 AM', checkOut: '06:11 PM', hours: '9h 07m' },
    { day: 10, month: 'current', status: 'present', checkIn: '09:18 AM', checkOut: '06:20 PM', hours: '9h 02m' },
    { day: 11, month: 'current', status: 'leave' }, // Leave (Purple dot)
    { day: 12, month: 'current', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 13, month: 'current', status: 'present', checkIn: '09:14 AM', checkOut: '06:12 PM', hours: '8h 58m' },
    { day: 14, month: 'current', status: 'present', checkIn: '09:05 AM', checkOut: '06:08 PM', hours: '9h 03m' },
    { day: 15, month: 'current', status: 'present', checkIn: '09:11 AM', checkOut: '06:19 PM', hours: '9h 08m' },
    { day: 16, month: 'current', status: 'absent' }, // Absent (Red dot)
    { day: 17, month: 'current', status: 'present', checkIn: '09:02 AM', checkOut: '06:00 PM', hours: '8h 58m' },
    { day: 18, month: 'current', status: 'present', checkIn: '09:20 AM', checkOut: '06:25 PM', hours: '9h 05m' },
    { day: 19, month: 'current', status: 'present', checkIn: '09:05 AM', checkOut: '06:05 PM', hours: '9h 00m' },
    { day: 20, month: 'current', status: 'present', checkIn: '09:10 AM', checkOut: '06:14 PM', hours: '9h 04m' },
    { day: 21, month: 'current', status: 'present', checkIn: '09:08 AM', checkOut: '06:10 PM', hours: '9h 02m' },
    { day: 22, month: 'current', status: 'present', checkIn: '09:15 AM', checkOut: '06:18 PM', hours: '9h 03m' },
    { day: 23, month: 'current', status: 'present', checkIn: '09:00 AM', checkOut: '06:02 PM', hours: '9h 02m' },
    { day: 24, month: 'current', status: 'present', checkIn: '09:07 AM', checkOut: '06:10 PM', hours: '9h 03m' },
    { day: 25, month: 'current', status: 'absent' }, // Absent (Red dot)
    { day: 26, month: 'current', status: 'present', checkIn: '09:12 AM', checkOut: '06:15 PM', hours: '9h 03m' },
    { day: 27, month: 'current', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 28, month: 'current', status: 'present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { day: 29, month: 'current', status: 'present', checkIn: '09:10 AM', checkOut: '06:12 PM', hours: '9h 02m' },
    { day: 30, month: 'current', status: 'present', checkIn: '09:08 AM', checkOut: '06:15 PM', hours: '9h 07m' },
    { day: 1, month: 'next' },
    { day: 2, month: 'next' },
    { day: 3, month: 'next' },
  ];

  const currentSelectedDayData = aprilDays.find(
    (d) => d.day === selectedDay && d.month === 'current'
  );

  return (
    <div className="space-y-6 animate-page-enter">
      {/* =========================================================================
          TOP HEADER: ICON + TITLE + SUBTITLE & 3D CLOCK/CALENDAR ILLUSTRATION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon, Title and Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Attendance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track your daily attendance, view your attendance history and manage your time effectively.
            </p>
          </div>
        </div>

        {/* Right: Soft 3D Clock & Calendar Illustration matching reference */}
        <div className="hidden md:flex items-center justify-end relative pr-4">
          <div className="relative flex items-center justify-center">
            {/* Ambient Soft Glow Behind Graphic */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-sky-300/20 to-blue-500/20 rounded-full blur-xl pointer-events-none" />

            {/* SVG 3D Clock & Calendar Graphic */}
            <svg width="130" height="75" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft Leaf Decorative Background */}
              <path d="M15 50C25 40 38 45 42 60C30 65 20 62 15 50Z" fill="#BFDBFE" fillOpacity="0.6" />
              <path d="M145 25C135 15 122 20 118 35C130 40 140 37 145 25Z" fill="#BFDBFE" fillOpacity="0.5" />
              <path d="M155 45C142 38 135 48 136 62C148 62 154 55 155 45Z" fill="#93C5FD" fillOpacity="0.5" />

              {/* 3D Round Clock Base */}
              <circle cx="65" cy="46" r="32" fill="url(#clockGrad)" filter="url(#clockShadow)" />
              <circle cx="65" cy="46" r="28" fill="#F8FAFC" />
              <circle cx="65" cy="46" r="24" fill="white" />
              {/* Clock Hands */}
              <circle cx="65" cy="46" r="2.5" fill="#2563EB" />
              <line x1="65" y1="46" x2="65" y2="30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="65" y1="46" x2="77" y2="40" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

              {/* 3D Slanted Calendar */}
              <g transform="translate(85, 24) rotate(8)">
                <rect x="0" y="4" width="44" height="48" rx="7" fill="url(#calBodyGrad)" filter="url(#calShadow)" />
                <rect x="0" y="0" width="44" height="15" rx="5" fill="#2563EB" />
                {/* Spiral ring binders */}
                <circle cx="10" cy="2" r="2.5" fill="#CBD5E1" stroke="#3B82F6" strokeWidth="1" />
                <circle cx="22" cy="2" r="2.5" fill="#CBD5E1" stroke="#3B82F6" strokeWidth="1" />
                <circle cx="34" cy="2" r="2.5" fill="#CBD5E1" stroke="#3B82F6" strokeWidth="1" />
                {/* Calendar grid dots */}
                <rect x="6" y="20" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="15" y="20" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="24" y="20" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="33" y="20" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />

                <rect x="6" y="28" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="15" y="28" width="6" height="5" rx="1.5" fill="#2563EB" />
                <rect x="24" y="28" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="33" y="28" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />

                <rect x="6" y="36" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="15" y="36" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="24" y="36" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
                <rect x="33" y="36" width="6" height="5" rx="1.5" fill="#94A3B8" opacity="0.6" />
              </g>

              <defs>
                <linearGradient id="clockGrad" x1="40" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="calBodyGrad" x1="0" y1="0" x2="44" y2="52" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#F1F5F9" />
                </linearGradient>
                <filter id="clockShadow" x="25" y="10" width="80" height="80" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1E40AF" floodOpacity="0.25" />
                </filter>
                <filter id="calShadow" x="-5" y="0" width="56" height="60" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.15" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP 4 KPI STAT CARDS (COMPACT HEIGHT, ICON & METRIC IN ONE ROW BESIDE)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Present Days */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs flex-shrink-0">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Present Days
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  18
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> 12%
            </span>
          </div>
        </div>

        {/* 2. Absent Days */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400 shadow-xs flex-shrink-0">
              <CalendarX className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Absent Days
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  2
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <ArrowDownRight className="h-3 w-3 stroke-[2.5]" /> 50%
            </span>
          </div>
        </div>

        {/* 3. Leave Days */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-xs flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Leave Days
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  1
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> 0%
            </span>
          </div>
        </div>

        {/* 4. Total Working Hours */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Total Working Hours
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  144.5 hrs
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> 8%
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION:
          LEFT: ATTENDANCE CALENDAR (WIDE)
          RIGHT: TODAY'S ATTENDANCE + SUMMARY DONUT + RECENT ACTIVITY
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: ATTENDANCE CALENDAR
           ======================================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          
          {/* Card Header & Controls */}
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Attendance Calendar
            </h2>

            <div className="flex items-center gap-2">
              {/* Previous Month */}
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentMonthIndex === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next Month */}
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.min(months.length - 1, prev + 1))}
                disabled={currentMonthIndex === months.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Month Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                  className="flex items-center gap-2 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-dark-border dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <span>{months[currentMonthIndex]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {monthDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-toast-slide dark:border-dark-border dark:bg-dark-card z-30">
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        onClick={() => {
                          setCurrentMonthIndex(idx);
                          setMonthDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          currentMonthIndex === idx
                            ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Weekday Header Columns */}
          <div className="grid grid-cols-7 gap-1.5 py-2 px-1 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* 7-Column Calendar Grid Matrix */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {aprilDays.map((item, index) => {
              const isSelected = item.month === 'current' && item.day === selectedDay;
              const isOtherMonth = item.month !== 'current';

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isOtherMonth) setSelectedDay(item.day);
                  }}
                  className={cn(
                    'h-14 sm:h-16 rounded-xl p-2 flex flex-col justify-between transition-all duration-150 relative cursor-pointer group',
                    isOtherMonth
                      ? 'bg-transparent text-slate-300 dark:text-slate-600 cursor-default opacity-60'
                      : isSelected
                      ? 'bg-blue-50/70 border-2 border-blue-600 dark:bg-blue-950/40 dark:border-blue-500 shadow-2xs'
                      : 'border border-slate-100 bg-slate-50/30 hover:border-slate-300 hover:bg-white dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-800/60'
                  )}
                >
                  {/* Top Day Number (Selected is a blue circle with white text) */}
                  <div className="flex items-center justify-start">
                    {isSelected ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
                        {item.day}
                      </span>
                    ) : (
                      <span className={cn('text-xs font-semibold', isOtherMonth ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200')}>
                        {item.day}
                      </span>
                    )}
                  </div>

                  {/* Centered Status Dot */}
                  <div className="flex items-center justify-center pb-1">
                    {item.status === 'present' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950/80" />
                    )}
                    {item.status === 'absent' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-rose-100 dark:ring-rose-950/80" />
                    )}
                    {item.status === 'leave' && (
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 ring-2 ring-purple-100 dark:ring-purple-950/80" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Card Footer: Status Legends & View Full Calendar */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Status Legend Pills */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> Leave
              </span>
            </div>

            {/* View Full Calendar Link */}
            <button
              onClick={() => setIsFullCalendarModalOpen(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold transition-colors cursor-pointer"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: 3 STACKED CARDS
            1. TODAY'S ATTENDANCE
            2. ATTENDANCE SUMMARY (DONUT)
            3. RECENT ACTIVITY
           ======================================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          
          {/* 1. Today's Attendance Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Attendance
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Wed, Apr 08, 2025
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Present
              </span>
            </div>

            {/* 3 Metric Boxes (Check In, Check Out, Working Hours) */}
            <div className="space-y-2.5">
              {/* Row: Check In & Check Out */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Check In */}
                <div className="flex items-center gap-2.5 rounded-xl bg-blue-50/50 p-3 border border-blue-100/60 dark:bg-blue-950/20 dark:border-blue-900/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Check In
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono leading-tight">
                      09:12 AM
                    </span>
                  </div>
                </div>

                {/* Check Out */}
                <div className="flex items-center gap-2.5 rounded-xl bg-blue-50/50 p-3 border border-blue-100/60 dark:bg-blue-950/20 dark:border-blue-900/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Check Out
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono leading-tight">
                      06:08 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Width Box: Working Hours */}
              <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-3 border border-blue-100/60 dark:bg-blue-950/20 dark:border-blue-900/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300 flex-shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Working Hours
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono leading-tight">
                    8h 56m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Attendance Summary Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attendance Summary
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">This Month</p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>View Report</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Circular Donut & Breakdown Stats */}
            <div className="flex items-center gap-5 pt-1">
              {/* Left: SVG Circular Donut with 90% */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F1F5F9"
                    strokeWidth="9"
                    fill="transparent"
                    className="dark:stroke-slate-800"
                  />
                  {/* Absent Arc (Red) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#EF4444"
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset="227"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                  {/* Leave Arc (Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#A855F7"
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset="240"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                  {/* Present Arc (Green ~ 90%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="9"
                    strokeDasharray="251.2"
                    strokeDashoffset="35"
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                {/* Center Percentage & Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                    90%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">
                    Attendance Rate
                  </span>
                </div>
              </div>

              {/* Right: Legend Breakdown */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">18 days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">2 days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-purple-500" /> Leave
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">1 day</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-dark-border">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-blue-400" /> Total Working Days
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">21 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Recent Activity Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* List of Recent Activities */}
            <div className="space-y-3 pt-1">
              {/* Item 1: Checked In */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-2xs flex-shrink-0">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Checked In
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Today, 09:12 AM
                  </p>
                </div>
              </div>

              {/* Item 2: Checked Out */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs flex-shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Checked Out
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Today, 06:08 PM
                  </p>
                </div>
              </div>

              {/* Item 3: Leave Approved */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-2xs flex-shrink-0">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Leave Approved
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Apr 05, 2025 • Casual Leave
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR FULL CALENDAR & REPORT DETAIL VIEWS
         ========================================================================= */}
      {/* 1. Full Calendar Modal */}
      <Modal
        isOpen={isFullCalendarModalOpen}
        onClose={() => setIsFullCalendarModalOpen(false)}
        title="Full Attendance Calendar History"
        description="Detailed record of monthly attendance, clock-in timings, and duration."
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-dark-border">
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              April 2025 Comprehensive Breakdown
            </span>
            <span className="text-xs text-slate-400">Total: 30 days recorded</span>
          </div>

          <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
            {aprilDays
              .filter((d) => d.month === 'current')
              .map((d) => (
                <div
                  key={d.day}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-dark-border text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-dark-card font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
                      {d.day}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        April {d.day}, 2025
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {d.hours ? `Logged ${d.hours}` : d.status === 'absent' ? 'Absent recorded' : 'Approved Leave'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                      d.status === 'present'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : d.status === 'absent'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    )}
                  >
                    {d.status === 'present' ? 'Present' : d.status === 'absent' ? 'Absent' : 'Leave'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* 2. Attendance Summary Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Monthly Attendance Summary Report"
        description="Executive attendance metrics and departmental compliance rates."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
            <p className="font-bold text-blue-900 dark:text-blue-300">
              Attendance Performance: Excellent (90%)
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              You are currently above the required organizational minimum attendance standard of 85%.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-500">Total Scheduled Working Days</span>
              <span className="font-bold text-slate-900 dark:text-white">21 days</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-500">Days Present</span>
              <span className="font-bold text-emerald-600">18 days (85.7%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-500">Days Absent</span>
              <span className="font-bold text-rose-600">2 days (9.5%)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-500">Approved Leaves</span>
              <span className="font-bold text-purple-600">1 day (4.8%)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Average Daily Working Hours</span>
              <span className="font-bold text-blue-600">8h 48m</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* 3. Recent Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Full Biometric & Web Activity Logs"
        description="All timestamped check-in and check-out logs for the past 30 days."
        size="md"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          {[
            { title: 'Checked Out', time: 'Today, 06:08 PM', type: 'out' },
            { title: 'Checked In', time: 'Today, 09:12 AM', type: 'in' },
            { title: 'Checked Out', time: 'Yesterday, 06:15 PM', type: 'out' },
            { title: 'Checked In', time: 'Yesterday, 09:05 AM', type: 'in' },
            { title: 'Leave Approved', time: 'Apr 05, 2025 • Casual Leave', type: 'leave' },
            { title: 'Checked Out', time: 'Apr 03, 06:00 PM', type: 'out' },
            { title: 'Checked In', time: 'Apr 03, 08:58 AM', type: 'in' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-dark-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    item.type === 'in'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.type === 'out'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  )}
                >
                  {item.type === 'in' ? '✓' : item.type === 'out' ? '→' : '★'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.time}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Web Portal</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
