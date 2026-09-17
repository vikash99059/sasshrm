import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { attendanceService } from '../../services/attendanceService';
import confetti from 'canvas-confetti';
import {
  Clock,
  Play,
  Square,
  Coffee,
  MapPin,
  Wifi,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Zap,
  Timer,
  Activity,
  ArrowRight,
  Compass,
  Building2,
  Laptop,
  Check,
  Sun,
  Flame,
  ChevronRight,
  BarChart3,
  Download,
  AlertCircle,
  FileCheck,
  TrendingUp,
  History,
  BadgePercent
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatDate } from '../../utils';

export const ClockInPage: React.FC = () => {
  const {
    currentUser,
    isClockedIn,
    clockInTime,
    secondsElapsed,
    isOnBreak,
    breakSecondsElapsed,
    totalBreakSeconds,
    setClockInState,
    toggleBreak,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [workMode, setWorkMode] = useState<'Office' | 'Remote' | 'Client Site'>('Office');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#F59E0B']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.7 },
        colors: ['#EC4899', '#8B5CF6', '#14B8A6']
      });
    }, 180);

    setShowCelebrationBanner(true);
    setTimeout(() => setShowCelebrationBanner(false), 4500);
  };

  const handleToggleClockIn = async () => {
    if (!isClockedIn) {
      triggerCelebration();
      await attendanceService.clockIn(
        currentUser.id,
        currentUser.name,
        currentUser.avatar,
        currentUser.departmentName || 'Engineering'
      );
      setClockInState(true, new Date().toISOString());
      showToast(`🎉 Punch In Successful! Checked in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`);
    } else {
      await attendanceService.clockOut(currentUser.id);
      setClockInState(false);
      showToast('Shift completed! Clocked out successfully.');
    }
  };

  const handleBreakToggle = () => {
    toggleBreak();
    if (!isOnBreak) {
      showToast('Break session started.');
    } else {
      showToast('Break ended. Resumed active work timer!');
    }
  };

  const formatSeconds = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalBreakDisplaySeconds = totalBreakSeconds + (isOnBreak ? breakSecondsElapsed : 0);

  // Target workday = 8 hours (28800 seconds)
  const targetWorkSeconds = 28800;
  const progressPercentage = Math.min(100, Math.round((secondsElapsed / targetWorkSeconds) * 100));

  // Weekly Hours Expended Chart Data (Mon - Sun)
  const weeklyHoursData = [
    { day: 'Mon', hoursWorked: 8.4, breakTime: 0.8, target: 8.0 },
    { day: 'Tue', hoursWorked: 8.2, breakTime: 0.7, target: 8.0 },
    { day: 'Wed', hoursWorked: 7.9, breakTime: 1.0, target: 8.0 },
    { day: 'Thu', hoursWorked: 8.5, breakTime: 0.6, target: 8.0 },
    { day: 'Fri', hoursWorked: 8.1, breakTime: 0.9, target: 8.0 },
    { day: 'Sat', hoursWorked: 0.0, breakTime: 0.0, target: 0.0 },
    { day: 'Sun', hoursWorked: 0.0, breakTime: 0.0, target: 0.0 },
  ];

  // Attendance Compliance Distribution Data
  const complianceData = [
    { name: 'On-Time (Present)', value: 18, color: '#10B981' },
    { name: 'Remote / WFH', value: 3, color: '#3B82F6' },
    { name: 'Approved Leave', value: 1, color: '#8B5CF6' },
    { name: 'Late Arrival', value: 0, color: '#F59E0B' },
  ];

  // Recent 7-Day Attendance Log History
  const recentLogs = [
    { date: 'Sep 16, 2026 (Today)', shift: 'General Shift', inTime: isClockedIn && clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '09:00 AM', outTime: isClockedIn ? '--:--' : '06:00 PM', breakDuration: formatSeconds(totalBreakDisplaySeconds), effectiveWork: formatSeconds(Math.max(0, secondsElapsed - totalBreakDisplaySeconds)), status: isClockedIn ? 'Working (Live)' : 'Present', statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { date: 'Sep 15, 2026', shift: 'General Shift', inTime: '09:05 AM', outTime: '06:18 PM', breakDuration: '00:48:10', effectiveWork: '08:24:50', status: 'On-Time', statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { date: 'Sep 14, 2026', shift: 'General Shift', inTime: '09:02 AM', outTime: '06:12 PM', breakDuration: '00:52:00', effectiveWork: '08:18:00', status: 'On-Time', statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { date: 'Sep 11, 2026', shift: 'General Shift', inTime: '08:58 AM', outTime: '06:30 PM', breakDuration: '00:45:00', effectiveWork: '08:47:00', status: 'Overtime (+30m)', statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { date: 'Sep 10, 2026', shift: 'General Shift', inTime: '09:12 AM', outTime: '06:05 PM', breakDuration: '01:00:00', effectiveWork: '07:53:00', status: 'Grace In (09:12)', statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    { date: 'Sep 09, 2026', shift: 'Remote Shift', inTime: '09:00 AM', outTime: '06:00 PM', breakDuration: '00:50:00', effectiveWork: '08:10:00', status: 'Remote (WFH)', statusColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  ];

  return (
    <div className="w-full space-y-5 pb-12 animate-in fade-in duration-300">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl backdrop-blur-md border border-slate-800 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CELEBRATION BANNER */}
      {showCelebrationBanner && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-md flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold tracking-tight">Punch-In Registered! Welcome, {currentUser.name.split(' ')[0]} 🎉</h3>
              <p className="text-[11px] text-emerald-100">
                Attendance and geofenced timestamp logged for today's shift. Have a productive day!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCelebrationBanner(false)}
            className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-bold transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PREMIUM CLOUDY WAVE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-[#E2EFFF] to-[#D5E8FE] p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-gradient-to-r dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0F172A]">
        {/* WAVY & CLOUDY FLOWING BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Light Mode Ambient Glows */}
          <div className="dark:hidden absolute -right-8 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-blue-300/45 via-sky-200/40 to-white/70 blur-3xl" />
          <div className="dark:hidden absolute right-1/4 top-1/2 -translate-y-1/2 h-52 w-60 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/50 to-white/60 blur-2xl" />
          <div className="dark:hidden absolute left-1/3 -bottom-10 h-44 w-72 rounded-full bg-blue-100/50 blur-2xl" />

          {/* Dark Mode Ambient Glows */}
          <div className="hidden dark:block absolute -right-8 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
          <div className="hidden dark:block absolute right-1/4 top-1/2 -translate-y-1/2 h-52 w-60 rounded-full bg-gradient-to-tr from-sky-500/10 via-blue-600/10 to-transparent blur-2xl" />
          <div className="hidden dark:block absolute left-1/3 -bottom-10 h-44 w-72 rounded-full bg-blue-900/20 blur-2xl" />

          {/* Light Mode Layered Translucent SVG Waves */}
          <svg
            className="absolute inset-0 h-full w-full object-cover dark:hidden"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="clockWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#BFDBFE" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="clockWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
              fill="url(#clockWave1)"
            />
            <path
              d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
              fill="url(#clockWave2)"
            />
          </svg>

          {/* Dark Mode Layered Subtle Midnight SVG Waves */}
          <svg
            className="absolute inset-0 h-full w-full object-cover hidden dark:block opacity-60"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="clockWaveDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="clockWaveDark2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#172554" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
              fill="url(#clockWaveDark1)"
            />
            <path
              d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
              fill="url(#clockWaveDark2)"
            />
          </svg>
        </div>

        {/* BANNER CONTENT (Z-10) */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs backdrop-blur-md border border-white/80 dark:border-slate-700 flex-shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Attendance Check-In & Time Overview
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Live Geofence
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                Automated web punch tracking, biometric shift alignment & weekly time metrics
              </p>
            </div>
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* WORK MODE TOGGLE */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-slate-700/80 shadow-2xs text-xs font-semibold">
              {(['Office', 'Remote', 'Client Site'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setWorkMode(mode);
                    showToast(`Work location mode set to: ${mode}`);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    workMode === mode
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {mode === 'Office' && <Building2 className="w-3.5 h-3.5" />}
                  {mode === 'Remote' && <Laptop className="w-3.5 h-3.5" />}
                  {mode === 'Client Site' && <Compass className="w-3.5 h-3.5" />}
                  <span>{mode}</span>
                </button>
              ))}
            </div>

            {/* EXPORT TIMESHEET BUTTON */}
            <button
              onClick={() => showToast('Exporting monthly attendance report (PDF)...')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md border border-white/80 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export Timesheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: MAIN CLOCK COCKPIT & LIVE SESSION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT 7-COLS: COMPACT DIAL & ACTIONS */}
        <div className="md:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-4 relative overflow-hidden">
          
          {/* Subtle Ambient Background Glow */}
          <div className={`absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
            isOnBreak
              ? 'bg-amber-400/10'
              : isClockedIn
              ? 'bg-emerald-500/10'
              : 'bg-blue-500/10'
          }`} />

          {/* TOP CURRENT DATE & STATUS BADGE */}
          <div className="flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {formatDate(currentTime.toISOString(), 'EEE, MMM dd, yyyy')}
              </span>
            </div>

            {isOnBreak ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800/60 shadow-2xs animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ON BREAK
              </span>
            ) : isClockedIn ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                WORKING
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                STANDBY
              </span>
            )}
          </div>

          {/* REFINED COMPACT CLOCK & DIAL */}
          <div className="flex flex-col items-center justify-center my-1 z-10">
            {/* Live Clock Display */}
            <div className="text-center mb-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </h2>
            </div>

            {/* Compact Refined Circular Ring */}
            <div className="relative flex items-center justify-center">
              {isClockedIn && (
                <div
                  className={`absolute h-36 w-36 rounded-full animate-ping opacity-15 transition-all ${
                    isOnBreak ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              )}

              <div
                className={`h-32 w-32 rounded-full border-3 flex flex-col items-center justify-center p-2 transition-all duration-300 shadow-sm ${
                  isOnBreak
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                    : isClockedIn
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700/70 dark:bg-slate-800/50 text-slate-400'
                }`}
              >
                {isOnBreak ? (
                  <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 mb-0.5">
                    <Coffee className="h-4 w-4 animate-pulse" />
                  </div>
                ) : (
                  <div className={`p-1.5 rounded-xl mb-0.5 ${
                    isClockedIn
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                      : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Clock className={`h-4 w-4 ${isClockedIn ? 'animate-pulse' : ''}`} />
                  </div>
                )}

                <span className="text-lg font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                  {isOnBreak
                    ? formatSeconds(breakSecondsElapsed)
                    : isClockedIn
                    ? formatSeconds(secondsElapsed)
                    : '00:00:00'}
                </span>

                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {isOnBreak ? 'On Break' : isClockedIn ? 'Working' : 'Not Checked In'}
                </span>
              </div>
            </div>

            {/* Daily Target Progress Bar */}
            {isClockedIn && (
              <div className="w-full max-w-xs mt-3.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Target (8h 00m)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* COMPACT ACTION BUTTONS */}
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleToggleClockIn}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer ${
                  isClockedIn
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                {isClockedIn ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-white" />
                    <span>Clock Out</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Clock In Now</span>
                  </>
                )}
              </button>

              {isClockedIn && (
                <button
                  onClick={handleBreakToggle}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                    isOnBreak
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100'
                      : 'border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {isOnBreak ? (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current text-blue-600 dark:text-blue-400" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="h-3.5 w-3.5 text-amber-500" />
                      <span>Take Break</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* GPS & Network Verified Strip */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">San Francisco HQ (Geofenced ✓)</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 5-COLS: SHIFT ROTA & SUMMARY */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* 1. TODAY'S SHIFT ROTA */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Today's Shift Rota</h3>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[9px]">
                General
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Timing</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Break Allowance</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">60 mins</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 text-[11px]">Grace Time</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">15 mins</span>
              </div>
            </div>
          </div>

          {/* 2. TODAY'S ATTENDANCE SUMMARY */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Session Summary</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                isOnBreak
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                  : isClockedIn
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {isOnBreak ? 'On Break' : isClockedIn ? 'Present' : 'Pending'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Check-In Time</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                  {isClockedIn && clockInTime
                    ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                    : '--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Break Logged</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 text-[11px]">
                  {formatSeconds(totalBreakDisplaySeconds)}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 text-[11px]">Productive Hours</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  {formatSeconds(Math.max(0, secondsElapsed - totalBreakDisplaySeconds))}
                </span>
              </div>
            </div>
          </div>

          {/* 3. TODAY'S PUNCH TIMELINE */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white pb-1.5 border-b border-slate-100 dark:border-slate-800">
              Today's Activity Log
            </h3>
            
            <div className="space-y-2 text-xs">
              {isClockedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-0.5 rounded-full bg-emerald-500 text-white flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Punch In</span>
                    </div>
                    <span className="font-mono font-bold text-[10px] text-slate-500">
                      {clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '09:00 AM'}
                    </span>
                  </div>

                  {totalBreakSeconds > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-0.5 rounded-full bg-amber-500 text-white flex-shrink-0">
                          <Coffee className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Break Taken</span>
                      </div>
                      <span className="font-mono font-bold text-[10px] text-amber-600">
                        {formatSeconds(totalBreakSeconds)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-0.5 rounded-full bg-blue-500 text-white flex-shrink-0 animate-pulse">
                        <Activity className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px]">Working Live</span>
                    </div>
                    <span className="font-mono font-bold text-[10px] text-blue-600 dark:text-blue-400">
                      Active
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-2 text-center text-slate-400 text-xs">
                  <p className="text-[11px]">No punches recorded yet today.</p>
                  <p className="text-[10px] text-slate-400">Click "Clock In Now" to begin.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: 4 WEEKLY WORK TIME & ATTENDANCE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Week Total Hours</span>
            <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">38.5h</span>
              <span className="text-[10px] text-slate-400">/ 40.0h</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: '96.2%' }} />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Avg Daily Punch In</span>
            <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Sun className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">09:04 AM</span>
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
              98.2% On-Time Compliance
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Break Expended</span>
            <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Coffee className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">4h 15m</span>
              <span className="text-[10px] text-slate-400">/ 5h cap</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Overtime Credits</span>
            <span className="p-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Flame className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">+2h 30m</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Accrued for September Payroll
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: VISUAL ATTENDANCE ANALYTICS (HOURS WORKED + COMPLIANCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Hours Expended Bar Chart */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Weekly Working Hours Expended</h2>
              <p className="text-[10px] text-slate-400">Daily logged productive hours vs. 8h standard target</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Worked Hours
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Break Hours
              </span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="hoursWorked" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Work Hours" barSize={16} />
                <Bar dataKey="breakTime" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Break Hours" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Attendance Compliance Pie */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">September Attendance Rate</h2>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">98.4%</span>
          </div>

          <div className="flex items-center justify-between gap-3 my-auto py-1">
            <div className="relative h-28 w-28 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complianceData} cx="50%" cy="50%" innerRadius={32} outerRadius={46} paddingAngle={3} dataKey="value">
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">22</span>
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Days</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[10px] min-w-0">
              {complianceData.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}d</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              onClick={() => showToast('Attendance regularization request portal opened')}
              className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Request Regularization →
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: RECENT 7-DAY ATTENDANCE TIME TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <History className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent Attendance & Punch Logs</h3>
              <p className="text-[10px] text-slate-400">Detailed breakdown of in/out timestamps, breaks, and productive durations</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Past 7 Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Shift</th>
                <th className="py-2 px-3">Punch In</th>
                <th className="py-2 px-3">Punch Out</th>
                <th className="py-2 px-3">Total Breaks</th>
                <th className="py-2 px-3">Effective Work</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white text-[11px] whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                    {log.shift}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200 text-[11px] whitespace-nowrap">
                    {log.inTime}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 dark:text-slate-200 text-[11px] whitespace-nowrap">
                    {log.outTime}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-600 dark:text-amber-400 text-[11px] whitespace-nowrap">
                    {log.breakDuration}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white text-[11px] whitespace-nowrap">
                    {log.effectiveWork}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${log.statusColor}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
