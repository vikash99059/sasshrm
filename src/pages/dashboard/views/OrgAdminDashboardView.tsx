import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CalendarMinus,
  UserPlus,
  Clock,
  Briefcase,
  Calendar,
  Plus,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  Cake,
  Award,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileCheck,
  FileSpreadsheet,
  Download,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

export const OrgAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('May 20 - May 26, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [attendancePeriod, setAttendancePeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);
  const [leavePeriod, setLeavePeriod] = useState<'This Month' | 'Last Month' | 'This Year'>('This Month');
  const [leaveDropdownOpen, setLeaveDropdownOpen] = useState(false);
  const [growthPeriod, setGrowthPeriod] = useState<'Last 6 Months' | 'Last 12 Months' | 'This Year'>('Last 6 Months');
  const [growthDropdownOpen, setGrowthDropdownOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState<'All Departments' | 'Engineering' | 'Marketing' | 'Sales'>('All Departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // 6 Org Admin KPI Cards
  const kpiCards = [
    { title: 'Total Employees', value: '248', change: '+12%', isPositive: true, subtext: 'vs last week: 221', icon: Users, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400', strokeColor: '#3B82F6', sparkline: [{ v: 210 }, { v: 218 }, { v: 224 }, { v: 220 }, { v: 235 }, { v: 242 }, { v: 248 }] },
    { title: 'Present Today', value: '236', change: '+8%', isPositive: true, subtext: 'vs yesterday: 218', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400', strokeColor: '#10B981', sparkline: [{ v: 200 }, { v: 212 }, { v: 225 }, { v: 218 }, { v: 230 }, { v: 228 }, { v: 236 }] },
    { title: 'On Leave', value: '12', change: '-4%', isPositive: false, subtext: 'vs yesterday: 16', icon: CalendarMinus, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400', strokeColor: '#F43F5E', sparkline: [{ v: 18 }, { v: 16 }, { v: 14 }, { v: 15 }, { v: 13 }, { v: 14 }, { v: 12 }] },
    { title: 'New Employees', value: '8', change: '+25%', isPositive: true, subtext: 'vs last month: 6', icon: UserPlus, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400', strokeColor: '#6366F1', sparkline: [{ v: 3 }, { v: 4 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 7 }, { v: 8 }] },
    { title: 'Pending Approvals', value: '6', change: '0%', isNeutral: true, subtext: 'vs yesterday: 6', icon: Clock, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400', strokeColor: '#F59E0B', sparkline: [{ v: 5 }, { v: 6 }, { v: 7 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 6 }] },
    { title: 'Open Positions', value: '5', change: '+40%', isPositive: true, subtext: 'vs last month: 3', icon: Briefcase, iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400', strokeColor: '#06B6D4', sparkline: [{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }] },
  ];

  // Attendance Overview Line Chart Data
  const attendanceData = [
    { date: 'May 20', present: 160, absent: 85, late: 45 },
    { date: 'May 21', present: 185, absent: 90, late: 50 },
    { date: 'May 22', present: 170, absent: 80, late: 40 },
    { date: 'May 23', present: 235, absent: 95, late: 60 },
    { date: 'May 24', present: 215, absent: 90, late: 55 },
    { date: 'May 25', present: 180, absent: 75, late: 35 },
    { date: 'May 26', present: 230, absent: 100, late: 70 },
  ];

  // Leave Overview Donut Data
  const leaveData = [
    { name: 'Approved', value: 68, percentage: '36.6%', color: '#3B82F6' },
    { name: 'Pending', value: 48, percentage: '25.8%', color: '#10B981' },
    { name: 'Rejected', value: 12, percentage: '6.5%', color: '#F59E0B' },
    { name: 'Cancelled', value: 8, percentage: '4.3%', color: '#EF4444' },
    { name: 'Others', value: 50, percentage: '26.9%', color: '#8B5CF6' },
  ];

  // Growth Data
  const growthData = [
    { month: 'Jan', total: 140, newHires: 18 },
    { month: 'Feb', total: 180, newHires: 24 },
    { month: 'Mar', total: 220, newHires: 32 },
    { month: 'Apr', total: 260, newHires: 38 },
    { month: 'May', total: 290, newHires: 42 },
    { month: 'Jun', total: 320, newHires: 48 },
    { month: 'Jul', total: 360, newHires: 55 },
  ];

  // Department Distribution
  const deptData = [
    { name: 'Engineering', value: 28, color: '#3B82F6' },
    { name: 'Marketing', value: 16, color: '#06B6D4' },
    { name: 'HR', value: 12, color: '#10B981' },
    { name: 'Sales', value: 14, color: '#F59E0B' },
    { name: 'Finance', value: 10, color: '#EC4899' },
    { name: 'Operations', value: 8, color: '#8B5CF6' },
  ];

  // Top Performing Departments
  const topPerformers = [
    { name: 'Engineering', percentage: 92, barGradient: 'from-blue-500 to-indigo-600' },
    { name: 'Marketing', percentage: 78, barGradient: 'from-purple-500 to-violet-600' },
    { name: 'Sales', percentage: 72, barGradient: 'from-teal-400 to-emerald-500' },
    { name: 'Finance', percentage: 68, barGradient: 'from-amber-400 to-orange-500' },
    { name: 'HR', percentage: 61, barGradient: 'from-yellow-400 to-amber-500' },
    { name: 'Operations', percentage: 55, barGradient: 'from-pink-500 to-rose-500' },
  ];

  // Recent Joiners List
  const recentEmployeesList = [
    { id: 'EMP-01', name: 'James Miller', department: 'Marketing', joiningDate: 'May 20, 2024', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-02', name: 'Sophia Davis', department: 'Engineering', joiningDate: 'May 18, 2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-03', name: 'William Brown', department: 'Sales', joiningDate: 'May 16, 2024', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-04', name: 'Olivia Wilson', department: 'HR', joiningDate: 'May 14, 2024', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-05', name: 'Liam Garcia', department: 'Finance', joiningDate: 'May 12, 2024', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  ];

  // Pending Approvals
  const pendingApprovalsList = [
    { title: 'Leave Requests', count: '3 pending', icon: CalendarMinus, color: 'text-amber-600', bg: 'bg-amber-50', badgeBg: 'bg-amber-50 text-amber-600' },
    { title: 'Expense Claims', count: '2 pending', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', badgeBg: 'bg-blue-50 text-blue-600' },
    { title: 'Timesheet Approval', count: '1 pending', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', badgeBg: 'bg-purple-50 text-purple-600' },
    { title: 'Recruitment Approval', count: '1 pending', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', badgeBg: 'bg-emerald-50 text-emerald-600' },
    { title: 'Document Verification', count: '1 pending', icon: FileCheck, color: 'text-rose-600', bg: 'bg-rose-50', badgeBg: 'bg-rose-50 text-rose-600' },
  ];

  // Upcoming Birthdays
  const birthdaysList = [
    { name: 'Sarah Wilson', department: 'Marketing', date: 'May 25', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'James Miller', department: 'Engineering', date: 'May 30', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Emily Davis', department: 'HR', date: 'Jun 02', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Michael Taylor', department: 'Sales', date: 'Jun 05', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  // Work Anniversaries
  const anniversariesList = [
    { name: 'David Anderson', department: 'Engineering', years: '3 years', date: 'May 22', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sophia Martinez', department: 'Marketing', years: '1 year', date: 'May 24', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Robert Thomas', department: 'Sales', years: '5 years', date: 'May 28', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  ];

  // Right Sidebar Notifications
  const recentNotificationsList = [
    { title: 'Leave Approved', desc: "Sarah Wilson's leave request has been approved.", time: '30m ago', icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-600' },
    { title: 'New Employee', desc: 'James Miller has joined the Marketing team.', time: '2h ago', icon: UserPlus, iconBg: 'bg-blue-50 text-blue-600' },
    { title: 'Payroll Processed', desc: 'April payroll has been processed successfully.', time: '5h ago', icon: DollarSign, iconBg: 'bg-teal-50 text-teal-600' },
    { title: 'Interview Scheduled', desc: 'Interview with John Doe at 10:00 AM.', time: '6h ago', icon: Calendar, iconBg: 'bg-purple-50 text-purple-600' },
    { title: 'Document Expiry', desc: 'Passport will expire in 15 days.', time: '8h ago', icon: AlertCircle, iconBg: 'bg-amber-50 text-amber-600' },
  ];

  // Upcoming Events
  const upcomingEventsList = [
    { month: 'MAY', day: '28', title: 'Executive Board Meeting', time: '10:00 AM - 11:00 AM', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { month: 'MAY', day: '29', title: 'Product Roadmap Sync', time: '02:00 PM - 04:00 PM', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { month: 'MAY', day: '30', title: 'Birthday - Sarah Wilson', time: 'All Day', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { month: 'JUN', day: '02', title: 'Quarterly HR Governance', time: '11:00 AM - 12:00 PM', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  // Recent Activities
  const recentActivitiesList = [
    { user: 'Rahul Sharma', action: 'Updated employee profile', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { user: 'Priya Nair', action: 'Applied for leave', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { user: 'Finance Team', action: 'Expense claim approved', time: '4h ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { user: 'System', action: 'Automated backup completed', time: '5h ago', isSystem: true },
    { user: 'Amit Patel', action: 'Joined the company', time: '6h ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Executive Portal</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Organization Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Organization Command Center <span className="text-2xl">🏢</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete executive snapshot of headcount, operational attendance, growth metrics and financial approvals.
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{dateRange}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN MAIN DASHBOARD CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT / CENTER CONTENT (Span 9 Columns) */}
        <div className="xl:col-span-9 space-y-6">
          {/* 6 KPI CARDS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {kpiCards.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-blue-200 dark:border-slate-800 dark:bg-dark-card transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {kpi.title}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {kpi.value}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        kpi.isNeutral ? 'bg-amber-50 text-amber-600' :
                        kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{kpi.subtext}</p>
                </div>
              );
            })}
          </div>

          {/* ROW 2: ATTENDANCE OVERVIEW + LEAVE OVERVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
                  <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Present</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Absent</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Late</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="orgPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 250]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#orgPresent)" dot={{ r: 3, fill: '#3B82F6' }} />
                    <Line type="monotone" dataKey="absent" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E' }} />
                    <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave Overview</h2>
                <span className="text-[10px] font-bold text-slate-400">This Month</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-2">
                <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leaveData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                        {leaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none my-0.5">186</span>
                    <span className="text-[10px] text-slate-400">Leaves</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2.5 min-w-0">
                  {leaveData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 tabular-nums">
                        <span className="w-7 text-right font-bold text-slate-900 dark:text-white">{item.value}</span>
                        <span className="w-14 text-right text-[11px] text-slate-400 font-medium">({item.percentage})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: EMPLOYEE GROWTH + DEPARTMENT DISTRIBUTION + TOP PERFORMERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Employee Growth</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 400]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                    <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={14} />
                    <Line type="monotone" dataKey="newHires" stroke="#6366F1" strokeWidth={2} dot={{ r: 2 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Department Distribution</h3>
              <div className="flex items-center justify-between gap-2 my-auto">
                <div className="relative h-36 w-36 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deptData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={3} dataKey="value">
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">248</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[11px] min-w-0 pl-1">
                  {deptData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="truncate">{d.name}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Top Performing Departments</h3>
              <div className="space-y-2.5">
                {topPerformers.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-600 dark:text-slate-300">{p.name}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{p.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${p.barGradient}`} style={{ width: `${p.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 4: 4 WIDGET CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent Employees</h3>
                <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-2.5">
                {recentEmployeesList.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={emp.avatar} alt={emp.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-[11px] leading-tight">{emp.name}</p>
                        <p className="text-[10px] text-slate-400">{emp.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{emp.joiningDate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Pending Approvals</h3>
                <button onClick={() => navigate('/approvals')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-2">
                {pendingApprovalsList.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1 rounded-xl">
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">{app.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.badgeBg}`}>{app.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Birthdays</h3>
                <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-2.5">
                {birthdaysList.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={b.avatar} alt={b.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-[11px] leading-tight">{b.name}</p>
                        <p className="text-[10px] text-slate-400">{b.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-rose-50 px-2 py-0.5 rounded-full">{b.date} 🎂</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Work Anniversaries</h3>
                <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-2.5">
                {anniversariesList.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={a.avatar} alt={a.name} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-[11px] leading-tight">{a.name}</p>
                        <p className="text-[10px] text-slate-400">{a.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{a.years} 🎖️</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INFORMATION PANEL (Span 3 Columns) */}
        <div className="xl:col-span-3 space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4">Recent Notifications</h3>
            <div className="space-y-3.5">
              {recentNotificationsList.map((n, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4">Upcoming Executive Events</h3>
            <div className="space-y-3">
              {upcomingEventsList.map((e, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`flex flex-col items-center justify-center h-10 w-10 flex-shrink-0 rounded-xl border font-bold ${e.color}`}>
                    <span className="text-[8px] uppercase">{e.month}</span>
                    <span className="text-sm">{e.day}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{e.title}</p>
                    <p className="text-[10px] text-slate-400">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivitiesList.map((act, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {act.isSystem ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-black">⚡</div>
                  ) : (
                    <img src={act.avatar} alt={act.user} className="h-7 w-7 rounded-full object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{act.user}</p>
                    <p className="text-[11px] text-slate-500 truncate">{act.action}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
