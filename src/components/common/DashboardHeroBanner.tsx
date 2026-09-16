import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ROLE_PERSONAS } from '../../config/roleDashboardConfig';
import { Calendar, Clock } from 'lucide-react';
import { WorkTimerWidget } from './WorkTimerWidget';

export interface DashboardHeroBannerProps {
    /** Optional custom title or sub-designation overrides if needed */
    customGreeting?: string;
    employeeName?: string;
    employeeDesignation?: string;
    employeeDepartment?: string;
    employeeId?: string;
    employeeAvatar?: string;
    className?: string;
    actions?: React.ReactNode;
    rightContent?: React.ReactNode;
}

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = ({
    className = '',
    actions,
    rightContent,
    employeeName: overrideName,
    employeeDesignation: overrideDesignation,
    employeeDepartment: overrideDepartment,
    employeeId: overrideId,
    employeeAvatar: overrideAvatar
}) => {
    const {
        currentUser,
        currentRole,
        isClockedIn,
        clockInTime,
        isOnBreak,
        breakSecondsElapsed,
    } = useAppStore();

    const formatTimerHMS = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentPersona = ROLE_PERSONAS[currentRole] || ROLE_PERSONAS.employee;

    const isGenericMock =
        !currentUser?.name ||
        currentUser.name === 'EMPLOYEE User' ||
        currentUser.name.toLowerCase().includes('employee') ||
        currentUser.name.toLowerCase().includes('admin');

    const employeeName = overrideName || (isGenericMock
        ? (currentPersona.name || 'Rahul Sharma')
        : currentUser.name);

    const employeeAvatar =
        overrideAvatar ||
        currentUser?.avatar ||
        currentPersona.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';

    const employeeDesignation =
        overrideDesignation ||
        currentUser?.designation || currentPersona.designation || 'Senior Software Engineer';

    const employeeDepartment =
        overrideDepartment ||
        currentUser?.departmentName || currentPersona.department || 'Engineering';

    const employeeId =
        overrideId ||
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
            <div className="lg:col-span-8 xl:col-span-9 relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-[#E2EFFF] to-[#D5E8FE] px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs dark:border-slate-800 dark:bg-gradient-to-r dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0F172A] flex flex-col justify-center">
                {/* WAVY & CLOUDY FLOWING BACKGROUND */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
                    {/* Light Mode Ambient Glows */}
                    <div className="dark:hidden absolute -right-8 -top-12 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/45 via-sky-200/40 to-white/70 blur-3xl" />
                    <div className="dark:hidden absolute right-1/4 top-1/2 -translate-y-1/2 h-64 w-72 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/50 to-white/60 blur-2xl" />
                    <div className="dark:hidden absolute left-1/3 -bottom-10 h-52 w-96 rounded-full bg-blue-100/50 blur-2xl" />

                    {/* Dark Mode Ambient Glows */}
                    <div className="hidden dark:block absolute -right-8 -top-12 h-80 w-80 rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
                    <div className="hidden dark:block absolute right-1/4 top-1/2 -translate-y-1/2 h-64 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-blue-600/10 to-transparent blur-2xl" />
                    <div className="hidden dark:block absolute left-1/3 -bottom-10 h-52 w-96 rounded-full bg-blue-900/20 blur-2xl" />

                    {/* Light Mode Layered Translucent SVG Waves */}
                    <svg
                        className="absolute inset-0 h-full w-full object-cover dark:hidden"
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

                    {/* Dark Mode Layered Subtle Midnight SVG Waves */}
                    <svg
                        className="absolute inset-0 h-full w-full object-cover hidden dark:block opacity-60"
                        viewBox="0 0 1200 240"
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="heroWaveDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
                            </linearGradient>
                            <linearGradient id="heroWaveDark2" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.75" />
                                <stop offset="50%" stopColor="#172554" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
                            fill="url(#heroWaveDark1)"
                        />
                        <path
                            d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
                            fill="url(#heroWaveDark2)"
                        />
                    </svg>
                </div>

                {/* HERO MAIN TOP ROW */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
                        {/* Avatar with Online Dot */}
                        <div className="relative flex-shrink-0 mt-0.5 sm:mt-0">
                            <img
                                src={employeeAvatar}
                                alt={employeeName}
                                className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl object-cover ring-2 ring-white/90 dark:ring-slate-700 shadow-sm"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#00B074] ring-2 ring-white dark:ring-slate-900 shadow-xs" />
                        </div>

                        <div className="space-y-1">
                            {/* Greeting + Employee ID Badge */}
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>{greetingPrefix}, {employeeName}</span>
                                    <span className="text-base sm:text-lg">👏</span>
                                </h1>
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/60 text-[10px] font-extrabold font-mono tracking-wider uppercase">
                                    {employeeId}
                                </span>
                            </div>

                            {/* Designation • Department • Full-Time */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{employeeDesignation}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-slate-700 dark:text-slate-200">{employeeDepartment}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-slate-500 dark:text-slate-400">Full-Time</span>
                            </div>

                            {/* Date, Shift, and Status Chips */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/80 shadow-2xs">
                                    <Calendar className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                    <span className="font-medium text-slate-700 dark:text-slate-200 text-[11px]">
                                        {todayFormatted}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/80 shadow-2xs">
                                    <Clock className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                    <span className="font-medium text-slate-700 dark:text-slate-200 text-[11px]">
                                        Shift: 09:00 AM - 06:00 PM
                                    </span>
                                </div>

                                {isOnBreak ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[11px] border border-amber-200/80 dark:border-amber-800/80 shadow-2xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        On Break ({formatTimerHMS(breakSecondsElapsed)})
                                    </span>
                                ) : isClockedIn ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Punched In at {formattedPunchInTime}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-medium text-[11px] border border-slate-200/60 dark:border-slate-700/80 shadow-2xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        Shift Not Started
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons directly underneath chips */}
                            {actions && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Custom rightContent or default inspirational quote text */}
                    {rightContent ? (
                        <div className="hidden md:flex items-center justify-end select-none flex-shrink-0 pl-2">
                            {rightContent}
                        </div>
                    ) : (
                        <div className="hidden xl:flex flex-col items-end justify-center text-right pr-2 select-none">
                            <span className="text-base sm:text-lg font-serif italic font-black text-blue-900/90 dark:text-blue-100 tracking-tight drop-shadow-2xs">
                                Great Things Ahead
                            </span>
                            <span className="text-[10px] font-semibold text-blue-700/80 dark:text-blue-300/80">
                                Let's make today count ✨
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Work Timer Card (Col 4/3 on desktop) */}
            <div className="lg:col-span-4 xl:col-span-3 flex">
                <WorkTimerWidget className="w-full" />
            </div>
        </div>
    );
};
