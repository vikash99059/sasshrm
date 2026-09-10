import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { cn } from '../../../utils';
import {
  Calendar,
  Clock,
  FileText,
  CheckSquare,
  Palmtree,
  ChevronDown,
  ArrowRight,
  Gift,
  UploadCloud,
  ShoppingBag,
  User,
  Users,
  Megaphone,
  Check,
  Play,
  Square,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Modal, Input, Select, Button } from '../../../components/ui';

export const EmployeeDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { isClockedIn, clockInTime, secondsElapsed, setClockInState } = useAppStore();

  // Filter States
  const [dateRange, setDateRange] = useState('May 20, 2024 (Mon)');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [attendancePeriod, setAttendancePeriod] = useState<'Last 7 Days' | 'Last 30 Days' | 'This Month'>('Last 7 Days');
  const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);
  const [leavePeriod, setLeavePeriod] = useState<'This Month' | 'Last Month' | 'This Year'>('This Month');
  const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);
  const [growthPeriod, setGrowthPeriod] = useState<'Last 6 Months' | 'Last 12 Months' | 'This Year'>('Last 6 Months');
  const [growthDropdownOpen, setGrowthDropdownOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState<'All Departments' | 'Engineering' | 'Marketing' | 'Sales'>('All Departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  // Live Timer Format Helper
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

  // Quick Action Modal (Apply Leave)
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Annual Leave',
    startDate: '2024-05-27',
    endDate: '2024-05-28',
    reason: '',
  });

  // Interactive Tasks Checkboxes
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete performance review', dueDate: 'May 22, 2024', priority: 'High', completed: false },
    { id: 2, text: 'Submit expense report', dueDate: 'May 24, 2024', priority: 'Medium', completed: false },
    { id: 3, text: 'Update personal information', dueDate: 'May 28, 2024', priority: 'Low', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Attendance Overview Line Chart Data (Last 7 Days)
  const attendanceData = [
    { date: 'May 14', present: 80, absent: 50, late: 25 },
    { date: 'May 15', present: 125, absent: 65, late: 35 },
    { date: 'May 16', present: 120, absent: 60, late: 30 },
    { date: 'May 17', present: 145, absent: 70, late: 40 },
    { date: 'May 18', present: 135, absent: 65, late: 35 },
    { date: 'May 19', present: 130, absent: 60, late: 30 },
    { date: 'May 20', present: 160, absent: 75, late: 45 },
  ];

  // Leave Overview Donut Data for Employee
  const employeeLeaveData = [
    { name: 'Approved', value: 12, percentage: '50%', color: '#10B981' },
    { name: 'Pending', value: 6, percentage: '25%', color: '#F59E0B' },
    { name: 'Rejected', value: 3, percentage: '12%', color: '#EF4444' },
    { name: 'Cancelled', value: 2, percentage: '8%', color: '#6366F1' },
    { name: 'Others', value: 1, percentage: '4%', color: '#3B82F6' },
  ];

  // Employee Growth Combined Bar + Line Chart Data (Dec - May)
  const growthData = [
    { month: 'Dec', total: 70, newHires: 18 },
    { month: 'Jan', total: 85, newHires: 22 },
    { month: 'Feb', total: 110, newHires: 28 },
    { month: 'Mar', total: 105, newHires: 26 },
    { month: 'Apr', total: 125, newHires: 32 },
    { month: 'May', total: 145, newHires: 38 },
  ];

  // Department Distribution Donut Data
  const deptData = [
    { name: 'Engineering', value: 28, color: '#3B82F6' },
    { name: 'Marketing', value: 16, color: '#06B6D4' },
    { name: 'HR', value: 12, color: '#F59E0B' },
    { name: 'Sales', value: 14, color: '#EF4444' },
    { name: 'Finance', value: 10, color: '#8B5CF6' },
    { name: 'Operations', value: 8, color: '#38BDF8' },
  ];

  // Recent Payslips List
  const recentPayslips = [
    { month: 'May 2024', amount: '$4,560', status: 'Paid' },
    { month: 'Apr 2024', amount: '$4,320', status: 'Paid' },
    { month: 'Mar 2024', amount: '$4,280', status: 'Paid' },
  ];

  // Upcoming Birthdays
  const birthdaysList = [
    { name: 'Emily Davis', department: 'Marketing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Michael Taylor', department: 'Sales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Olivia Martinez', department: 'Design', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  ];

  // Work Anniversaries
  const anniversariesList = [
    { name: 'Daniel Anderson', years: '3 years', date: 'May 21', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sophia Martinez', years: '2 years', date: 'May 26', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'James Wilson', years: '5 years', date: 'May 30', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  ];

  // Announcements List
  const announcementsList = [
    {
      title: 'Office will be closed on May 25, 2024',
      subtitle: 'Public Holiday',
      time: '2 hours ago',
      icon: Megaphone,
    },
    {
      title: 'New HR Policy Update',
      subtitle: 'Please review the updated policy.',
      time: '5 hours ago',
      icon: FileText,
    },
    {
      title: 'Team Building Event',
      subtitle: 'Join us for the annual team event.',
      time: '1 day ago',
      icon: Users,
    },
  ];

  // Upcoming Events List
  const upcomingEventsList = [
    { month: 'MAY', day: '22', title: 'Team Meeting', time: '10:00 AM - 11:00 AM', isBirthday: false },
    { month: 'MAY', day: '24', title: 'Product Training', time: '02:00 PM - 04:00 PM', isBirthday: false },
    { month: 'MAY', day: '27', title: 'Sarah Wilson - Birthday', time: 'All Day', isBirthday: true },
    { month: 'JUN', day: '02', title: 'Performance Review', time: '10:00 AM - 12:00 PM', isBirthday: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* =========================================================================
          ENHANCED EMPLOYEE HERO CARD: LEFT PHOTO + CENTER INFO + RIGHT LIVE TIMER BOX
         ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* LEFT & CENTER COMBINED: Profile Photo + Employee Details */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 flex-1">
            {/* Left: Employee Photo Card */}
            <div className="relative flex-shrink-0 self-start sm:self-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Sarah Wilson"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-4 ring-blue-500/15 shadow-md"
              />
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900',
                  isClockedIn ? 'bg-emerald-500 ring-2 ring-emerald-400/40 animate-pulse' : 'bg-slate-300'
                )}
                title={isClockedIn ? 'Currently Clocked In' : 'Not Clocked In'}
              />
            </div>

            {/* Center: Greeting, Role & Details */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Good morning, Sarah Wilson <span className="text-xl sm:text-2xl">🌤️</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                  EMP-0412
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="text-blue-600 dark:text-blue-400 font-bold">Senior Product Designer</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>Design & Engineering</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">Full-Time</span>
              </div>

              {/* Schedule, Date & Punch State Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-blue-500" /> Shift: 09:00 AM – 06:00 PM (Regular)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Today: {dateRange}
                </span>
                {isClockedIn ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Punched In at {formattedPunchInTime}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Shift Not Started
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT END: LIVE CLOCK-IN RUNNING TIMER BOX & PUNCH IN / OUT ACTION */}
          <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/20 dark:from-slate-800/90 dark:to-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 shadow-xs min-w-[250px] sm:min-w-[280px]">
            {/* Box Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className={cn('h-4 w-4', isClockedIn ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-slate-400')} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  WORK TIMER
                </span>
              </div>
              {isClockedIn ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-extrabold text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> LIVE
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-bold text-[10px]">
                  READY
                </span>
              )}
            </div>

            {/* Live Running Time Clock */}
            <div className="my-1 text-center sm:text-left">
              <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider flex items-center justify-center sm:justify-start gap-1">
                {formatTimerHMS(secondsElapsed)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {isClockedIn ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ● Started at {formattedPunchInTime} • Counting
                  </span>
                ) : (
                  'Ready to start today’s shift'
                )}
              </p>
            </div>

            {/* Interactive Punch In / Punch Out Button */}
            <button
              onClick={handlePunchToggle}
              className={cn(
                'w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
                isClockedIn
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-600/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25'
              )}
            >
              {isClockedIn ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>PUNCH OUT</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>PUNCH IN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT / CENTER CONTENT (Span 9 Columns) */}
        <div className="xl:col-span-9 space-y-6">
          {/* ROW 1: 5 EMPLOYEE STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. Leave Balance */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Leave Balance</span>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">18</span>
                  <span className="text-xs text-slate-400 font-medium">days left</span>
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: '75%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Total: 24 days</span>
                </div>
              </div>
            </div>

            {/* 2. Today's Attendance */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Today's Attendance</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Present
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                  09:15 AM - 05:45 PM
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>❖</span>
                  <span>On Time</span>
                </div>
              </div>
            </div>

            {/* 3. Pending Approvals */}
            <div
              onClick={() => navigate('/leave')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between cursor-pointer hover:border-purple-200 dark:hover:border-purple-800 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pending Approvals</span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">2</span>
                    <span className="text-xs text-slate-400 font-medium">requests</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-2">
                  1 Leave • 1 Expense
                </p>
              </div>
            </div>

            {/* 4. My Tasks */}
            <div
              onClick={() => navigate('/performance/goals')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">My Tasks</span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">3</span>
                    <span className="text-xs text-slate-400 font-medium">pending</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-2">
                  1 High • 2 Normal
                </p>
              </div>
            </div>

            {/* 5. Next Holiday */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                  <Palmtree className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Next Holiday</span>
              </div>

              <div className="mt-3">
                <span className="text-base font-bold text-slate-900 dark:text-white">May 25, 2024</span>
                <p className="text-[11px] text-slate-400 font-medium">Saturday</p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    Memorial Day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: ATTENDANCE OVERVIEW + LEAVE OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attendance Overview Card */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Present
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Absent
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Late
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setAttendanceDropdownOpen(!attendanceDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>{attendancePeriod}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {attendanceDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                      {(['Last 7 Days', 'Last 30 Days', 'This Month'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setAttendancePeriod(p);
                            setAttendanceDropdownOpen(false);
                          }}
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 200]} ticks={[0, 50, 100, 150, 200]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Line type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: '#3B82F6' }} />
                    <Line type="monotone" dataKey="absent" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E' }} />
                    <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Overview Donut Card */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave Overview</h2>
                <div className="relative">
                  <button
                    onClick={() => setLeaveDropdownOpen(!leaveDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>{leavePeriod}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {leaveDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                      {(['This Month', 'Last Month', 'This Year'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setLeavePeriod(p);
                            setLeaveDropdownOpen(false);
                          }}
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-2">
                <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employeeLeaveData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {employeeLeaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '10px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Leaves</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none my-0.5">24</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2 min-w-0">
                  {employeeLeaveData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 tabular-nums">
                        <span className="w-6 text-right font-bold text-slate-900 dark:text-white">{item.value}</span>
                        <span className="w-12 text-right text-[11px] text-slate-400 font-medium">({item.percentage})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: EMPLOYEE GROWTH + DEPARTMENT DISTRIBUTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Employee Growth */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Employee Growth</h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-blue-500" />
                      Total Employees
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      New Hires
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setGrowthDropdownOpen(!growthDropdownOpen)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>{growthPeriod}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </button>
                  {growthDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                      {(['Last 6 Months', 'Last 12 Months', 'This Year'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setGrowthPeriod(p);
                            setGrowthDropdownOpen(false);
                          }}
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 200]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                    <Line type="monotone" dataKey="newHires" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Department Distribution */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Department Distribution</h3>
                <div className="relative">
                  <button
                    onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>{deptFilter}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                  </button>
                  {deptDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                      {(['All Departments', 'Engineering', 'Marketing', 'Sales'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setDeptFilter(p);
                            setDeptDropdownOpen(false);
                          }}
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 my-auto">
                <div className="relative h-36 w-36 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={58}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '10px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '10px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">248</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[11px] min-w-0 pl-1">
                  {deptData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate min-w-0">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="truncate">{d.name}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 4: 4 ACTIONABLE WIDGET CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Recent Payslips */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent Payslips</h3>
                <button
                  onClick={() => navigate('/payroll/payslips')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
                >
                  View All ↗
                </button>
              </div>

              <div className="space-y-2.5">
                {recentPayslips.map((ps, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">{ps.month}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{ps.amount}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {ps.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tasks */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Tasks</h3>
                <button
                  onClick={() => navigate('/performance/goals')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
                >
                  View All ↗
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTask(t.id)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className={`text-[11px] font-semibold leading-tight truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {t.text}
                        </p>
                        <p className="text-[9px] text-slate-400">Due {t.dueDate}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                        t.priority === 'High'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          : t.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Upcoming Birthdays */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Birthdays</h3>
                <button
                  onClick={() => navigate('/employees')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
                >
                  View All ↗
                </button>
              </div>

              <div className="space-y-2.5">
                {birthdaysList.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={b.avatar} alt={b.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-[11px] leading-tight">{b.name}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{b.department}</p>
                      </div>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/40">
                      <Gift className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Work Anniversaries */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Work Anniversaries</h3>
                <button
                  onClick={() => navigate('/employees')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
                >
                  View All ↗
                </button>
              </div>

              <div className="space-y-2.5">
                {anniversariesList.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={a.avatar} alt={a.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-[11px] leading-tight">{a.name}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{a.years}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INFORMATION PANEL (Span 3 Columns) */}
        <div className="xl:col-span-3 space-y-5">
          {/* 1. Motivation Card: You're doing great! */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-5 text-white shadow-md">
            <div className="relative z-10 max-w-[65%]">
              <h3 className="text-base font-extrabold leading-tight">You're doing great!</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Keep up the good work and achieve your goals.
              </p>
            </div>
            <div className="absolute right-3 -bottom-1 z-0 opacity-90">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-4xl">👨‍💻</span>
              </div>
            </div>
          </div>

          {/* 2. Quick Actions (6 Grid) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <button
                onClick={() => navigate('/clock-in')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <Clock className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Clock In/Out</span>
              </button>

              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Apply Leave</span>
              </button>

              <button
                onClick={() => navigate('/payroll/payslips')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <FileText className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">View Payslip</span>
              </button>

              <button
                onClick={() => navigate('/operations/expenses')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <ShoppingBag className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Submit Expense</span>
              </button>

              <button
                onClick={() => navigate('/operations/documents')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <UploadCloud className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Upload Doc</span>
              </button>

              <button
                onClick={() => navigate('/employees/EMP001')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <User className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">View Profile</span>
              </button>
            </div>
          </div>

          {/* 3. Announcements */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Announcements</h3>
              <button
                onClick={() => navigate('/calendar')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
              >
                View All ↗
              </button>
            </div>

            <div className="space-y-3.5">
              {announcementsList.map((anc, idx) => {
                const AnconIcon = anc.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <AnconIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{anc.title}</p>
                        <span className="text-[9px] text-slate-400 flex-shrink-0">{anc.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {anc.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Upcoming Events */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
              <button
                onClick={() => navigate('/calendar')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5"
              >
                View Calendar ↗
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEventsList.map((e, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`flex flex-col items-center justify-center h-10 w-10 flex-shrink-0 rounded-xl border text-center font-bold leading-none ${
                      e.isBirthday
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-tighter">{e.month}</span>
                    <span className="text-sm">{e.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{e.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY LEAVE QUICK MODAL */}
      <Modal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        title="Apply for Leave"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Leave request submitted for ${leaveForm.type}!`);
            setIsApplyLeaveOpen(false);
          }}
          className="space-y-4"
        >
          <Select
            label="Leave Type"
            value={leaveForm.type}
            onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
            options={[
              { value: 'Annual Leave', label: 'Annual Leave (18 days remaining)' },
              { value: 'Sick Leave', label: 'Sick Leave (8 days remaining)' },
              { value: 'Casual Leave', label: 'Casual Leave (4 days remaining)' },
              { value: 'Unpaid Leave', label: 'Unpaid Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason (Optional)</label>
            <textarea
              rows={3}
              placeholder="Brief reason for your leave request..."
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsApplyLeaveOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
