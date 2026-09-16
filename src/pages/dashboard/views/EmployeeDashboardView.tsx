import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { ROLE_PERSONAS } from '../../../config/roleDashboardConfig';
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
  Play,
  Square,
  Sparkles,
  Check,
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
import { DashboardHeroBanner } from '../../../components/common/DashboardHeroBanner';

export const EmployeeDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    currentRole,
    isClockedIn,
    clockInTime,
    secondsElapsed,
    setClockInState,
  } = useAppStore();

  const currentPersona = ROLE_PERSONAS[currentRole] || ROLE_PERSONAS.employee;
  const isGenericMock =
    !currentUser?.name ||
    currentUser.name === 'EMPLOYEE User' ||
    currentUser.name.toLowerCase().includes('employee');
  const employeeName = isGenericMock ? 'Sarah Wilson' : currentUser.name;
  const employeeAvatar =
    currentUser?.avatar ||
    currentPersona.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';
  const employeeDesignation =
    currentUser?.designation || currentPersona.designation || 'Senior Product Designer';
  const employeeDepartment =
    currentUser?.departmentName || currentPersona.department || 'Design & Engineering';
  const employeeId = isGenericMock
    ? 'EMP-0412'
    : currentUser?.employeeId ||
    (currentUser?.id ? `EMP-${currentUser.id.replace(/\D/g, '').padStart(4, '0')}` : 'EMP-0412');

  // Periods & Dropdowns
  const [attendancePeriod, setAttendancePeriod] = useState<'Last 7 Days' | 'This Month'>('Last 7 Days');
  const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);
  const [leavePeriod, setLeavePeriod] = useState<'This Month' | 'Last Month' | 'This Year'>('This Month');
  const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);

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
    { id: 2, text: 'Submit expense report', dueDate: 'May 20, 2024', priority: 'Medium', completed: false },
    { id: 3, text: 'Update personal information', dueDate: 'May 28, 2024', priority: 'Low', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Attendance Overview Line Chart Data
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
    { name: 'Others', value: 1, percentage: '4%', color: '#06B6D4' },
  ];

  // Employee Working Hours Data
  const workingHoursData = [
    { day: 'Mon', hours: 8.0, display: '8h', target: 8.0 },
    { day: 'Tue', hours: 7.75, display: '7h 45m', target: 8.0 },
    { day: 'Wed', hours: 8.0, display: '8h', target: 8.0 },
    { day: 'Thu', hours: 7.5, display: '7h 30m', target: 8.0 },
    { day: 'Fri', hours: 8.0, display: '8h', target: 8.0 },
  ];

  // Recent Payslips List
  const recentPayslips = [
    { month: 'May 2024', amount: '$4,560', status: 'Paid' },
    { month: 'Apr 2024', amount: '$4,320', status: 'Paid' },
    { month: 'Mar 2024', amount: '$4,280', status: 'Paid' },
  ];

  // Upcoming Birthdays
  const birthdaysList = [
    {
      name: 'Emily Davis',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Michael Taylor',
      department: 'Sales',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Olivia Martinez',
      department: 'Design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // Work Anniversaries
  const anniversariesList = [
    {
      name: 'Daniel Anderson',
      years: '3 years',
      date: 'May 21',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sophia Martinez',
      years: '2 years',
      date: 'May 26',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'James Wilson',
      years: '5 years',
      date: 'May 30',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* TOP HERO BANNER + WORK TIMER */}
      <DashboardHeroBanner />

      {/* =========================================================================
          MAIN 12-COLUMN DASHBOARD GRID
         ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT / CENTER CONTENT AREA (Span 9 Columns) */}
        <div className="xl:col-span-9 space-y-6">
          {/* ROW 1: 5 PRIMARY SUMMARY / KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. Leave Balance */}
            <div
              onClick={() => navigate('/leave')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between hover-card-lift transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
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
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Total: 24 days</span>
                </div>
              </div>
            </div>

            {/* 2. Today's Attendance */}
            <div
              onClick={() => navigate('/attendance')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between hover-card-lift transition-all duration-200 cursor-pointer group"
            >
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
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>On Time</span>
                </div>
              </div>
            </div>

            {/* 3. Pending Approvals */}
            <div
              onClick={() => navigate('/leave/requests')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between cursor-pointer hover:border-purple-200 dark:hover:border-purple-800 hover-card-lift transition-all duration-200 group"
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
              onClick={() => navigate('/tasks')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 hover-card-lift transition-all duration-200 group"
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
            <div
              onClick={() => navigate('/leave/holidays')}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between hover-card-lift transition-all duration-200 cursor-pointer group"
            >
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

          {/* ROW 2: ATTENDANCE OVERVIEW (LINE CHART) + LEAVE OVERVIEW (DONUT CHART) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attendance Overview Card (Span 7) */}
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
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  >
                    <span>{attendancePeriod}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {attendanceDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                      {(['Last 7 Days', 'This Month'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setAttendancePeriod(p);
                            setAttendanceDropdownOpen(false);
                          }}
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
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
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94A3B8' }}
                      domain={[0, 200]}
                      ticks={[0, 50, 100, 150, 200]}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl bg-slate-900 p-2.5 text-xs text-white shadow-xl">
                              <p className="font-bold text-slate-200 mb-1">{label}</p>
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px] py-0.5">
                                  <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    {entry.name}:
                                  </span>
                                  <span className="font-bold">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      name="Present"
                      dataKey="present"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#3B82F6' }}
                    />
                    <Line
                      type="monotone"
                      name="Absent"
                      dataKey="absent"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F43F5E' }}
                    />
                    <Line
                      type="monotone"
                      name="Late"
                      dataKey="late"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F59E0B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Overview Donut Card (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave Overview</h2>
                <div className="relative">
                  <button
                    onClick={() => setLeaveDropdownOpen(!leaveDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
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
                          className="w-full px-2 py-1 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-2">
                {/* Donut Chart with Center Stat */}
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
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">TOTAL LEAVES</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none my-0.5">24</span>
                  </div>
                </div>

                {/* Legend with Values and Percentages */}
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

          {/* ROW 3: WORKING HOURS (BAR CHART) + MY TASKS (INTERACTIVE CHECKLIST) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Working Hours Bar Chart (Span 7) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Working Hours</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recent daily working duration</p>
                </div>

                {/* Average, Target, and Progress Metric */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Average</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">7h 48m</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Target</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">8h 00m</span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                    <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '97%' }} />
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">97%</span>
                  </div>
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workingHoursData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: '#94A3B8' }}
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      tickFormatter={(v) => `${v}h`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl bg-slate-900 p-2 text-xs text-white shadow-xl">
                              <p className="font-bold">{data.day}</p>
                              <p className="text-blue-400 font-semibold">Hours: {data.display}</p>
                              <p className="text-slate-400 text-[10px]">Target: {data.target}h</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="hours"
                      fill="#3B82F6"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom day labels with hours summary */}
              <div className="flex items-center justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                {workingHoursData.map((d, i) => (
                  <div key={i} className="text-center">
                    <span className="text-slate-400 block text-[10px]">{d.day}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{d.display}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tasks Checklist Card (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Tasks</h3>
                  <p className="text-[10px] text-slate-400">Action items assigned to you</p>
                </div>
                <button
                  onClick={() => navigate('/tasks')}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3 my-auto">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={cn(
                      'flex items-start justify-between gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none',
                      t.completed
                        ? 'bg-slate-50/60 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800'
                        : 'bg-white border-slate-200/80 hover:border-blue-200 dark:bg-dark-card dark:border-slate-800 dark:hover:border-slate-700'
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={cn(
                          'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md border transition-colors',
                          t.completed
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                        )}
                      >
                        {t.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-xs font-bold leading-tight truncate',
                            t.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          )}
                        >
                          {t.text}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Due {t.dueDate}</p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0',
                        t.priority === 'High'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          : t.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      )}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center">
                Click any task to toggle status
              </div>
            </div>
          </div>

          {/* ROW 4: 3 ACTIONABLE BOTTOM WIDGETS (RECENT PAYSLIPS, BIRTHDAYS, ANNIVERSARIES) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 1. Recent Payslips */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent Payslips</h3>
                <button
                  onClick={() => navigate('/payroll/payslips')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
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

            {/* 2. Upcoming Birthdays */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Birthdays</h3>
                <button
                  onClick={() => navigate('/employees')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
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

            {/* 3. Work Anniversaries */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Work Anniversaries</h3>
                <button
                  onClick={() => navigate('/employees')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
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

        {/* =========================================================================
            RIGHT INFORMATION PANEL (Span 3 Columns)
           ========================================================================= */}
        <div className="xl:col-span-3 space-y-5">
          {/* 1. Motivation Card: You're doing great! */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-5 text-white shadow-md">
            <div className="relative z-10 max-w-[70%]">
              <h3 className="text-base font-extrabold leading-tight">You're doing great!</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Keep up the good work and achieve your goals.
              </p>
            </div>
            <div className="absolute right-3 -bottom-1 z-0 opacity-90">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-3xl">👨‍💻</span>
              </div>
            </div>
          </div>

          {/* 2. Quick Actions (6 Grid) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <button
                onClick={() => navigate('/clock-in')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Clock className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Clock In/Out</span>
              </button>

              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Apply Leave</span>
              </button>

              <button
                onClick={() => navigate('/payroll/payslips')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
              >
                <FileText className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">View Payslip</span>
              </button>

              <button
                onClick={() => navigate('/operations/expenses')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Submit Expense</span>
              </button>

              <button
                onClick={() => navigate('/operations/documents')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
              >
                <UploadCloud className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Upload Doc</span>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 cursor-pointer"
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
                onClick={() => navigate('/announcements')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
              >
                View All →
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
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
              >
                View Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEventsList.map((e, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center h-10 w-10 flex-shrink-0 rounded-xl border text-center font-bold leading-none',
                      e.isBirthday
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                    )}
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

      {/* =========================================================================
          APPLY LEAVE QUICK MODAL
         ========================================================================= */}
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason (Optional)
            </label>
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
