import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ROLE_PERSONAS } from '../../config/roleDashboardConfig';
import { Calendar, Clock } from 'lucide-react';
import { WorkTimerWidget } from './WorkTimerWidget';

export interface DashboardHeroBannerProps {
    /** Optional custom title or sub-designation overrides if needed */
    customGreeting?: string;
    className?: string;
}

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = ({ className = '' }) => {
    const {
        currentUser,
        currentRole,
        isClockedIn,
        clockInTime,
    } = useAppStore();

    const currentPersona = ROLE_PERSONAS[currentRole] || ROLE_PERSONAS.employee;

    const isGenericMock =
        !currentUser?.name ||
        currentUser.name === 'EMPLOYEE User' ||
        currentUser.name.toLowerCase().includes('employee') ||
        currentUser.name.toLowerCase().includes('admin');

    const employeeName = isGenericMock
        ? (currentPersona.name || 'Rahul Sharma')
        : currentUser.name;

    const employeeAvatar =
        currentUser?.avatar ||
        currentPersona.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';

    const employeeDesignation =
        currentUser?.designation || currentPersona.designation || 'Senior Software Engineer';

    const employeeDepartment =
        currentUser?.departmentName || currentPersona.department || 'Engineering';

    const employeeId =
        currentUser?.employeeId ||
        (currentUser?.id ? `EMP${currentUser.id.replace(/\D/g, '').padStart(3, '0')}` : 'EMP001');

    // Greeting based on time of day
    const hour = new Date().getHours();
    const greetingPrefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // Formatted punch-in time if active
    const formattedPunchInTime = clockInTime
        ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : '09:15 AM';

    // Formatted today date e.g. "Thu, May 22, 2025" or current date
    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch ${className}`}>
            {/* LEFT: Employee Welcome Hero Card (Col 8/9 on desktop) */}
            <div className="lg:col-span-8 xl:col-span-9 relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-[#E2EFFF] to-[#D5E8FE] px-4 py-3.5 sm:px-6 sm:py-4 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/50 flex flex-col justify-center min-h-[140px]">
                {/* WAVY & CLOUDY FLOWING BACKGROUND */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                    <div className="absolute -right-8 -top-12 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/45 via-sky-200/40 to-white/70 blur-3xl dark:from-blue-900/30 dark:via-sky-950/20 dark:to-indigo-950/30" />
                    <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-64 w-72 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/50 to-white/60 blur-2xl dark:from-slate-800/40 dark:via-blue-950/30 dark:to-slate-900/40" />
                    <div className="absolute left-1/3 -bottom-10 h-52 w-96 rounded-full bg-blue-100/50 blur-2xl dark:bg-blue-950/25" />

                    {/* Layered Translucent SVG Waves */}
                    <svg
                        className="absolute inset-0 h-full w-full object-cover"
                        viewBox="0 0 1200 240"
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="heroWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.7" />
                                <stop offset="50%" stopColor="#BFDBFE" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.3" />
                            </linearGradient>
                            <linearGradient id="heroWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.85" />
                                <stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.55" />
                                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
                            fill="url(#heroWave1)"
                        />
                        <path
                            d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
                            fill="url(#heroWave2)"
                        />
                    </svg>
                </div>

                {/* HERO CONTENT */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                        {/* Avatar with Online Dot */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={employeeAvatar}
                                alt={employeeName}
                                className="h-13 w-13 sm:h-14 sm:w-14 rounded-2xl object-cover ring-2 ring-white/90 dark:ring-slate-700 shadow-sm"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#00B074] ring-2 ring-white dark:ring-slate-900 shadow-xs" />
                        </div>

                        <div className="space-y-1">
                            {/* Greeting + Employee ID Badge */}
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>{greetingPrefix}, {employeeName}</span>
                                    <span className="text-xl sm:text-2xl">👏</span>
                                </h1>
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-[10px] font-extrabold font-mono tracking-wider uppercase">
                                    {employeeId}
                                </span>
                            </div>

                            {/* Designation • Department • Full-Time */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{employeeDesignation}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span>{employeeDepartment}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-slate-500 dark:text-slate-400">Full-Time</span>
                            </div>

                            {/* Date, Shift, and Status Chips */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5 bg-white/75 dark:bg-slate-800/75 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/60 shadow-2xs">
                                    <Calendar className="h-3 w-3 text-blue-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                                        {todayFormatted}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-white/75 dark:bg-slate-800/75 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/60 shadow-2xs">
                                    <Clock className="h-3 w-3 text-blue-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                                        Shift: 09:00 AM - 06:00 PM
                                    </span>
                                </div>

                                {isClockedIn ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Punched In at {formattedPunchInTime}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/75 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium text-[11px] border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        Shift Not Started
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Inspirational quote text */}
                    <div className="hidden lg:flex flex-col items-end justify-center text-right pr-2 select-none">
                        <span className="text-xl sm:text-2xl font-serif italic font-black text-blue-900/90 dark:text-blue-100 tracking-tight drop-shadow-2xs">
                            Great Things Ahead
                        </span>
                        <span className="text-[11px] font-semibold text-blue-700/80 dark:text-blue-300/80">
                            Let's make today count ✨
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Work Timer Card (Col 4/3 on desktop) */}
            <div className="lg:col-span-4 xl:col-span-3 flex">
                <WorkTimerWidget className="w-full" />
            </div>
        </div>
    );
};
