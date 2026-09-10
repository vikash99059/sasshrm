import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { attendanceService } from '../../services/attendanceService';
import { Card, CardHeader, CardTitle, Button, Badge, Avatar } from '../../components/ui';
import {
  Clock,
  Play,
  Square,
  Coffee,
  MapPin,
  Wifi,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ClockInPage: React.FC = () => {
  const {
    currentUser,
    isClockedIn,
    clockInTime,
    secondsElapsed,
    setClockInState,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Break Timer
  useEffect(() => {
    let interval: any = null;
    if (isOnBreak) {
      interval = setInterval(() => setBreakSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak]);

  const handleToggleClockIn = async () => {
    if (!isClockedIn) {
      await attendanceService.clockIn(
        currentUser.id,
        currentUser.name,
        currentUser.avatar,
        currentUser.departmentName || 'Engineering'
      );
      setClockInState(true, new Date().toISOString());
    } else {
      await attendanceService.clockOut(currentUser.id);
      setClockInState(false);
      setIsOnBreak(false);
    }
  };

  const formatSeconds = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Web Attendance Check-In
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Record your daily working hours, break sessions, and shifts.
        </p>
      </div>

      {/* Main Interactive Check-in Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer & Big Action Button */}
        <Card className="md:col-span-2 p-8 text-center flex flex-col items-center justify-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {formatDate(currentTime.toISOString(), 'EEEE, MMMM dd, yyyy')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </h2>
          </div>

          {/* Pulsing Active Working Ring */}
          <div className="relative flex items-center justify-center">
            {isClockedIn && (
              <div className="absolute h-48 w-48 rounded-full bg-blue-500/15 animate-ping" />
            )}
            <div
              className={`h-44 w-44 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                isClockedIn
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 shadow-glow'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 text-slate-400'
              }`}
            >
              <Clock className={`h-8 w-8 mb-1 ${isClockedIn ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-2xl font-black font-mono">
                {isClockedIn ? formatSeconds(secondsElapsed) : '00:00:00'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isClockedIn ? (isOnBreak ? 'On Break' : 'Working') : 'Not Checked In'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
            <Button
              size="lg"
              variant={isClockedIn ? 'danger' : 'primary'}
              onClick={handleToggleClockIn}
              className="flex-1 py-3 text-sm font-bold shadow-lg"
              leftIcon={isClockedIn ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
            >
              {isClockedIn ? 'Clock Out Now' : 'Clock In Now'}
            </Button>

            {isClockedIn && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsOnBreak(!isOnBreak)}
                className="py-3 text-sm"
                leftIcon={<Coffee className="h-4 w-4 text-amber-500" />}
              >
                {isOnBreak ? 'End Break' : 'Take Break'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-dark-border w-full justify-around">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-500" /> San Francisco HQ
            </span>
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-emerald-500" /> 192.168.1.104
            </span>
          </div>
        </Card>

        {/* Right 1 Col: Today's Shift & Summary Details */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Today's Shift Rota</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Shift Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">General Shift</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Timing</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Break Allowance</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">60 mins</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Grace Time</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">15 mins</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Check-In Time</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {isClockedIn && clockInTime ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Break Logged</span>
                <span className="font-mono font-semibold text-amber-600">
                  {formatSeconds(breakSeconds)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Attendance Status</span>
                <Badge variant={isClockedIn ? 'success' : 'neutral'} size="sm" dot>
                  {isClockedIn ? 'Active (Present)' : 'Pending'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
