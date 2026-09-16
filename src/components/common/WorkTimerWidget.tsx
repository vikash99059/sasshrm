import React from 'react';
import { Clock, Play, Square, Coffee } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';

interface WorkTimerWidgetProps {
    className?: string;
}

export const WorkTimerWidget: React.FC<WorkTimerWidgetProps> = ({ className }) => {
    const {
        isClockedIn,
        clockInTime,
        secondsElapsed,
        isOnBreak,
        breakSecondsElapsed,
        totalBreakSeconds,
        setClockInState,
        toggleBreak,
    } = useAppStore();

    const formatTimerHMS = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formattedPunchInTime = clockInTime
        ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : '09:15 AM';

    const totalBreakMins = Math.floor(totalBreakSeconds / 60);

    const handlePunchToggle = () => {
        if (isClockedIn) {
            setClockInState(false);
        } else {
            setClockInState(true, new Date().toISOString());
        }
    };

    return (
        <div
            className={cn(
                'rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between min-w-[240px] transition-all',
                isOnBreak && 'border-amber-300/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800/60',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        WORK TIMER
                    </span>
                </div>
                {isOnBreak ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-bold text-[9px] tracking-wider uppercase border border-amber-300/60 dark:border-amber-800/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        ON BREAK
                    </span>
                ) : isClockedIn ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold text-[9px] tracking-wider uppercase border border-emerald-300/60 dark:border-emerald-800/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 font-bold text-[9px] tracking-wider uppercase">
                        READY
                    </span>
                )}
            </div>

            <div className="my-2">
                <div
                    className={cn(
                        'font-mono text-2xl sm:text-3xl font-black tracking-wider transition-colors',
                        isOnBreak ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                    )}
                >
                    {isOnBreak ? formatTimerHMS(breakSecondsElapsed) : formatTimerHMS(secondsElapsed)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {isOnBreak ? (
                        <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                            <Coffee className="h-3 w-3 inline" /> On Break • Work: {formatTimerHMS(secondsElapsed)}
                        </span>
                    ) : isClockedIn ? (
                        `Working • Started ${formattedPunchInTime}${totalBreakMins > 0 ? ` • Break: ${totalBreakMins}m` : ''}`
                    ) : (
                        "Ready to start today's shift"
                    )}
                </p>
            </div>

            {!isClockedIn ? (
                <button
                    onClick={handlePunchToggle}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold text-white bg-[#00B074] hover:bg-[#009668] shadow-xs shadow-emerald-500/20 transition-all cursor-pointer"
                >
                    <Play className="h-3 w-3 fill-current" />
                    <span>PUNCH IN</span>
                </button>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={toggleBreak}
                        className={cn(
                            'flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-[11px] font-bold text-white shadow-xs transition-all cursor-pointer',
                            isOnBreak
                                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                        )}
                    >
                        {isOnBreak ? (
                            <>
                                <Play className="h-3 w-3 fill-current" />
                                <span>RESUME</span>
                            </>
                        ) : (
                            <>
                                <Coffee className="h-3 w-3" />
                                <span>BREAK</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handlePunchToggle}
                        className="flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs shadow-rose-500/20 transition-all cursor-pointer"
                    >
                        <Square className="h-3 w-3 fill-current" />
                        <span>PUNCH OUT</span>
                    </button>
                </div>
            )}
        </div>
    );
};
