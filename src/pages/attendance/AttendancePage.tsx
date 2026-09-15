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
    <div className="space-y-4 animate-page-enter">
      {/* =========================================================================
          TOP HEADER: ICON + TITLE + SUBTITLE & 3D CLOCK/CALENDAR ILLUSTRATION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Icon, Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Attendance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track your daily attendance, view your attendance history and manage your time effectively.
            </p>
          </div>
        </div>

        {/* Right: Big, Vibrant, Highly-Attractive 3D Clock & Calendar Illustration */}
        <div className="hidden md:flex items-center justify-end relative pr-2">
          <div className="relative flex items-center justify-center">
            {/* Ambient Multi-Tone Radiant Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/25 via-sky-400/25 to-indigo-500/20 rounded-full blur-xl pointer-events-none" />

            {/* Enlarged 3D Clock & Calendar Graphic */}
            <svg width="180" height="98" viewBox="0 0 215 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft Leaves Decorative Background */}
              <path d="M12 68C22 52 40 58 46 76C32 82 20 80 12 68Z" fill="#93C5FD" fillOpacity="0.5" />
              <path d="M198 30C185 18 168 25 162 44C178 50 192 46 198 30Z" fill="#60A5FA" fillOpacity="0.45" />
              <path d="M210 58C194 48 184 62 186 80C202 78 208 70 210 58Z" fill="#38BDF8" fillOpacity="0.55" />

              {/* Sparkle Stars */}
              <path d="M48 24L50 18L52 24L58 26L52 28L50 34L48 28L42 26L48 24Z" fill="#38BDF8" fillOpacity="0.8" />
              <path d="M174 15L175.5 10L177 15L182 16.5L177 18L175.5 23L174 18L169 16.5L174 15Z" fill="#60A5FA" fillOpacity="0.75" />

              {/* 3D Round Clock Base (Larger, High-Definition) */}
              <g transform="translate(10, 0)">
                {/* Outer Shadow Bezel */}
                <circle cx="70" cy="56" r="42" fill="url(#clockOuterBezelGrad)" filter="url(#clockDropShadow)" />
                {/* Metallic Chrome Ring */}
                <circle cx="70" cy="56" r="38" fill="url(#clockMetallicRingGrad)" />
                {/* Dial Face Background */}
                <circle cx="70" cy="56" r="33" fill="#FFFFFF" />
                <circle cx="70" cy="56" r="33" fill="url(#clockDialSoftGrad)" />

                {/* Dial Hour Tick Marks */}
                <circle cx="70" cy="28" r="2" fill="#2563EB" />
                <circle cx="98" cy="56" r="2" fill="#2563EB" />
                <circle cx="70" cy="84" r="2" fill="#2563EB" />
                <circle cx="42" cy="56" r="2" fill="#2563EB" />

                {/* Additional subtle minute ticks */}
                <circle cx="84" cy="32" r="1" fill="#93C5FD" />
                <circle cx="94" cy="42" r="1" fill="#93C5FD" />
                <circle cx="94" cy="70" r="1" fill="#93C5FD" />
                <circle cx="84" cy="80" r="1" fill="#93C5FD" />
                <circle cx="56" cy="80" r="1" fill="#93C5FD" />
                <circle cx="46" cy="70" r="1" fill="#93C5FD" />
                <circle cx="46" cy="42" r="1" fill="#93C5FD" />
                <circle cx="56" cy="32" r="1" fill="#93C5FD" />

                {/* Clock Hands: 10:10 Aesthetic Position */}
                <line x1="70" y1="56" x2="52" y2="38" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" filter="url(#handsShadow)" />
                <line x1="70" y1="56" x2="88" y2="44" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" filter="url(#handsShadow)" />
                {/* Second Hand (Cyan Accent) */}
                <line x1="70" y1="56" x2="70" y2="28" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" />

                {/* Center Chrome Nut */}
                <circle cx="70" cy="56" r="4" fill="#1E40AF" />
                <circle cx="70" cy="56" r="2" fill="#E2E8F0" />

                {/* Glossy Curved Glass Reflection Arc */}
                <path d="M 44 42 A 30 30 0 0 1 96 42 A 28 28 0 0 0 44 42 Z" fill="url(#clockGlossGrad)" opacity="0.6" />
              </g>

              {/* 3D Slanted Calendar (Enlarged, Rich isometric tilt) */}
              <g transform="translate(112, 22) rotate(6)">
                {/* Drop shadow & Calendar Backboard */}
                <rect x="0" y="6" width="60" height="66" rx="10" fill="url(#calBaseGrad)" filter="url(#calDropShadow)" />
                
                {/* Deep Royal Blue Header Spine */}
                <rect x="0" y="0" width="60" height="20" rx="8" fill="url(#calHeaderGrad)" />
                
                {/* Silver / Metallic Binding Rings */}
                <circle cx="12" cy="3" r="3" fill="#F8FAFC" stroke="#1D4ED8" strokeWidth="1.5" />
                <circle cx="30" cy="3" r="3" fill="#F8FAFC" stroke="#1D4ED8" strokeWidth="1.5" />
                <circle cx="48" cy="3" r="3" fill="#F8FAFC" stroke="#1D4ED8" strokeWidth="1.5" />

                {/* Calendar Grid Status Pills & Dates */}
                {/* Row 1 */}
                <rect x="8" y="27" width="8" height="6" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="20" y="27" width="8" height="6" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="32" y="27" width="8" height="6" rx="2" fill="#10B981" />
                <rect x="44" y="27" width="8" height="6" rx="2" fill="#93C5FD" opacity="0.6" />

                {/* Row 2 */}
                <rect x="8" y="38" width="8" height="6" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="20" y="38" width="8" height="6" rx="2" fill="#2563EB" />
                <rect x="32" y="38" width="8" height="6" rx="2" fill="#10B981" />
                <rect x="44" y="38" width="8" height="6" rx="2" fill="#8B5CF6" />

                {/* Row 3 */}
                <rect x="8" y="49" width="8" height="6" rx="2" fill="#10B981" />
                <rect x="20" y="49" width="8" height="6" rx="2" fill="#93C5FD" opacity="0.6" />
                <rect x="32" y="49" width="8" height="6" rx="2" fill="#2563EB" />
                <rect x="44" y="49" width="8" height="6" rx="2" fill="#10B981" />

                {/* Row 4 */}
                <rect x="8" y="60" width="8" height="5" rx="1.5" fill="#93C5FD" opacity="0.4" />
                <rect x="20" y="60" width="8" height="5" rx="1.5" fill="#93C5FD" opacity="0.4" />
                <rect x="32" y="60" width="8" height="5" rx="1.5" fill="#93C5FD" opacity="0.4" />
                <rect x="44" y="60" width="8" height="5" rx="1.5" fill="#93C5FD" opacity="0.4" />
              </g>

              {/* Floating 3D Check Badge over the setup */}
              <g transform="translate(150, 75)" filter="url(#badgeShadow)">
                <rect x="0" y="0" width="54" height="20" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <circle cx="10" cy="10" r="5.5" fill="#10B981" />
                <path d="M8 10L9.5 11.5L12.5 8.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <text x="19" y="13.5" fill="#0F172A" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">Present</text>
              </g>

              <defs>
                {/* Clock Bezel & Dial Gradients */}
                <linearGradient id="clockOuterBezelGrad" x1="30" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="0.5" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#1E3A8A" />
                </linearGradient>
                <linearGradient id="clockMetallicRingGrad" x1="40" y1="24" x2="100" y2="92" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F8FAFC" />
                  <stop offset="0.5" stopColor="#E2E8F0" />
                  <stop offset="1" stopColor="#CBD5E1" />
                </linearGradient>
                <linearGradient id="clockDialSoftGrad" x1="70" y1="23" x2="70" y2="89" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#EFF6FF" />
                </linearGradient>
                <linearGradient id="clockGlossGrad" x1="70" y1="30" x2="70" y2="50" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Calendar Gradients */}
                <linearGradient id="calBaseGrad" x1="0" y1="0" x2="60" y2="72" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#F8FAFC" />
                </linearGradient>
                <linearGradient id="calHeaderGrad" x1="0" y1="0" x2="60" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>

                {/* High Fidelity Drop Shadows */}
                <filter id="clockDropShadow" x="18" y="8" width="104" height="104" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1E40AF" floodOpacity="0.28" />
                </filter>
                <filter id="handsShadow" x="40" y="30" width="60" height="40" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
                <filter id="calDropShadow" x="-8" y="0" width="76" height="82" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.18" />
                </filter>
                <filter id="badgeShadow" x="-4" y="-2" width="62" height="28" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.12" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP 4 KPI STAT CARDS (COMPACT HEIGHT, BALANCED PADDING, SHARP ALIGNMENT)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Present Days */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs flex-shrink-0">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Present Days
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  18
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 block">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> 12%
            </span>
          </div>
        </div>

        {/* 2. Absent Days */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400 shadow-xs flex-shrink-0">
              <CalendarX className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Absent Days
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  2
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 block">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <ArrowDownRight className="h-3 w-3 stroke-[2.5]" /> 50%
            </span>
          </div>
        </div>

        {/* 3. Leave Days */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-xs flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Leave Days
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  1
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 block">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-purple-50 px-1.5 py-0.5 text-[11px] font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" /> 0%
            </span>
          </div>
        </div>

        {/* 4. Total Working Hours */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Total Working Hours
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  144.5 hrs
                </span>
              </div>
              <span className="text-[10.5px] text-slate-400 block">This Month</span>
            </div>
          </div>
          <div className="self-end pb-0.5">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: ATTENDANCE CALENDAR
           ======================================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          
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
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          {/* 1. Today's Attendance Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3.5">
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3.5">
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3">
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
