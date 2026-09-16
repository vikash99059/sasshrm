import React from 'react';
import { Clock, Play, Square } from 'lucide-react';
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
        setClockInState,
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
                'rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between min-w-[220px]',
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
                {isClockedIn ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold text-[9px] tracking-wider uppercase">
                        LIVE
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 font-bold text-[9px] tracking-wider uppercase">
                        READY
                    </span>
                )}
            </div>

            <div className="my-2">
                <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
                    {formatTimerHMS(secondsElapsed)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {isClockedIn ? `Working • Started at ${formattedPunchInTime}` : "Ready to start today's shift"}
                </p>
            </div>

            <button
                onClick={handlePunchToggle}
                className={cn(
                    'w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold text-white shadow-xs transition-all cursor-pointer',
                    isClockedIn
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                        : 'bg-[#00B074] hover:bg-[#009668] shadow-emerald-500/20'
                )}
            >
                {isClockedIn ? (
                    <>
                        <Square className="h-3 w-3 fill-current" />
                        <span>PUNCH OUT</span>
                    </>
                ) : (
                    <>
                        <Play className="h-3 w-3 fill-current" />
                        <span>PUNCH IN</span>
                    </>
                )}
            </button>
        </div>
    );
};
