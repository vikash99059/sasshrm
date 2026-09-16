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
  ChevronDown,
  TrendingUp,
  Cake,
  Award,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileCheck,
  Download,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Send,
  MoreVertical,
  Sliders,
  Filter,
  BarChart3,
  Search,
  ChevronRight,
  ExternalLink,
  Gift,
  PartyPopper
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
import { DashboardHeroBanner } from '../../../components/common/DashboardHeroBanner';

export const OrgAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();

  // Filter & dropdown states
  const [dateRange, setDateRange] = useState('This Week (Sep 14 - Sep 20, 2026)');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [attendancePeriod, setAttendancePeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Add employee form
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [empRole, setEmpRole] = useState('Software Engineer');
  const [empJoinDate, setEmpJoinDate] = useState('2026-10-01');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 6 Executive Org Admin KPI Cards with sparkline trends
  const kpiCards = [
    {
      title: 'Total Workforce',
      value: '248',
      change: '+12.4%',
      isPositive: true,
      subtext: 'vs last month (221)',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400',
      strokeColor: '#3B82F6',
      sparkline: [{ v: 210 }, { v: 218 }, { v: 224 }, { v: 220 }, { v: 235 }, { v: 242 }, { v: 248 }]
    },
    {
      title: 'Present Today',
      value: '236',
      change: '95.1%',
      isPositive: true,
      subtext: '12 on approved leave',
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
      strokeColor: '#10B981',
      sparkline: [{ v: 200 }, { v: 212 }, { v: 225 }, { v: 218 }, { v: 230 }, { v: 228 }, { v: 236 }]
    },
    {
      title: 'On Leave',
      value: '12',
      change: '-4.2%',
      isPositive: false,
      subtext: '8 planned • 4 sick leaves',
      icon: CalendarMinus,
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400',
      strokeColor: '#F43F5E',
      sparkline: [{ v: 18 }, { v: 16 }, { v: 14 }, { v: 15 }, { v: 13 }, { v: 14 }, { v: 12 }]
    },
    {
      title: 'New Hires (Q3)',
      value: '18',
      change: '+28.5%',
      isPositive: true,
      subtext: '8 onboarded this month',
      icon: UserPlus,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400',
      strokeColor: '#6366F1',
      sparkline: [{ v: 3 }, { v: 6 }, { v: 8 }, { v: 11 }, { v: 14 }, { v: 16 }, { v: 18 }]
    },
    {
      title: 'Pending Approvals',
      value: '6',
      change: 'Action',
      isNeutral: true,
      subtext: '3 leaves • 2 expenses • 1 doc',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
      strokeColor: '#F59E0B',
      sparkline: [{ v: 8 }, { v: 7 }, { v: 9 }, { v: 7 }, { v: 8 }, { v: 6 }, { v: 6 }]
    },
    {
      title: 'Open Requisitions',
      value: '5',
      change: 'Active',
      isPositive: true,
      subtext: '42 candidates in pipeline',
      icon: Briefcase,
      iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400',
      strokeColor: '#06B6D4',
      sparkline: [{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }]
    },
  ];

  // Attendance Overview Line Chart Data
  const attendanceData = [
    { date: 'Mon, Sep 14', present: 232, absent: 16, late: 8 },
    { date: 'Tue, Sep 15', present: 238, absent: 10, late: 12 },
    { date: 'Wed, Sep 16', present: 236, absent: 12, late: 9 },
    { date: 'Thu, Sep 17', present: 240, absent: 8, late: 14 },
    { date: 'Fri, Sep 18', present: 235, absent: 13, late: 11 },
    { date: 'Sat, Sep 19', present: 195, absent: 53, late: 5 },
    { date: 'Sun, Sep 20', present: 180, absent: 68, late: 4 },
  ];

  // Leave Overview Donut Data
  const leaveData = [
    { name: 'Approved', value: 68, percentage: '36.6%', color: '#3B82F6' },
    { name: 'Pending Review', value: 48, percentage: '25.8%', color: '#10B981' },
    { name: 'Rejected', value: 12, percentage: '6.5%', color: '#F59E0B' },
    { name: 'Cancelled', value: 8, percentage: '4.3%', color: '#EF4444' },
    { name: 'Maternity / Paternity', value: 50, percentage: '26.9%', color: '#8B5CF6' },
  ];

  // Growth Data
  const growthData = [
    { month: 'Apr', headcount: 210, newHires: 12 },
    { month: 'May', headcount: 221, newHires: 15 },
    { month: 'Jun', headcount: 228, newHires: 14 },
    { month: 'Jul', headcount: 236, newHires: 16 },
    { month: 'Aug', headcount: 242, newHires: 18 },
    { month: 'Sep', headcount: 248, newHires: 20 },
  ];

  // Department Distribution
  const deptData = [
    { name: 'Engineering', count: 98, percentage: '39.5%', color: '#3B82F6' },
    { name: 'Marketing', count: 42, percentage: '16.9%', color: '#06B6D4' },
    { name: 'Sales & BD', count: 38, percentage: '15.3%', color: '#F59E0B' },
    { name: 'Human Resources', count: 28, percentage: '11.3%', color: '#10B981' },
    { name: 'Finance & Legal', count: 24, percentage: '9.7%', color: '#EC4899' },
    { name: 'Operations', count: 18, percentage: '7.3%', color: '#8B5CF6' },
  ];

  // Top Performing Departments
  const topPerformers = [
    { name: 'Engineering & DevOps', rating: '96%', score: 96, barGradient: 'from-blue-500 to-indigo-600', lead: 'Sarah Chen' },
    { name: 'Product Marketing', rating: '91%', score: 91, barGradient: 'from-cyan-400 to-blue-500', lead: 'Alex Vance' },
    { name: 'Enterprise Sales', rating: '88%', score: 88, barGradient: 'from-emerald-400 to-teal-600', lead: 'Michael Chang' },
    { name: 'Finance & Accounting', rating: '84%', score: 84, barGradient: 'from-amber-400 to-orange-500', lead: 'Priya Sharma' },
    { name: 'People & Culture', rating: '82%', score: 82, barGradient: 'from-purple-400 to-pink-500', lead: 'Jessica Miller' },
  ];

  // Recent Joiners List (4 Items)
  const recentEmployeesList = [
    { id: 'EMP-0881', name: 'James Miller', role: 'Staff Marketing Lead', department: 'Marketing', joiningDate: 'Sep 12, 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-0882', name: 'Sophia Davis', role: 'Senior React Architect', department: 'Engineering', joiningDate: 'Sep 08, 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-0883', name: 'William Brown', role: 'Account Executive', department: 'Sales & BD', joiningDate: 'Sep 04, 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-0884', name: 'Olivia Wilson', role: 'HR Business Partner', department: 'Human Resources', joiningDate: 'Aug 28, 2026', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ];

  // Pending Approvals (4 Items)
  const pendingApprovalsList = [
    { title: 'Annual Leave Requests', count: '3 pending', subtitle: '3 awaiting review', icon: CalendarMinus, iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60', route: '/leave/manage' },
    { title: 'Executive Expense Claims', count: '2 pending', subtitle: '2 awaiting approval', icon: DollarSign, iconBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400', badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60', route: '/payroll' },
    { title: 'Overtime & Shift Logs', count: '1 pending', subtitle: '1 timesheet signoff', icon: Clock, iconBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400', badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60', route: '/attendance' },
    { title: 'Hiring Requisitions', count: '1 pending', subtitle: '1 position approval', icon: UserPlus, iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60', route: '/recruitment' },
  ];

  // Upcoming Birthdays (4 Items)
  const birthdaysList = [
    { name: 'Sarah Wilson', department: 'Marketing', date: 'Tomorrow 🎂', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'James Miller', department: 'Engineering', date: 'Sep 22 🎂', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Emily Davis', department: 'Human Resources', date: 'Sep 25 🎂', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Michael Taylor', department: 'Sales & BD', date: 'Oct 02 🎂', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  // Work Anniversaries (4 Items)
  const anniversariesList = [
    { name: 'David Anderson', department: 'Engineering', years: '4 Years', medal: '🎖️', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sophia Martinez', department: 'Marketing', years: '2 Years', medal: '🎖️', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Robert Thomas', department: 'Sales & BD', years: '5 Years', medal: '🏆', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { name: 'Priya Sharma', department: 'Finance & Legal', years: '3 Years', medal: '🎖️', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  ];

  // Right Sidebar Notifications
  const recentNotificationsList = [
    { title: 'Leave Approved', desc: "Sarah Wilson's annual leave request was approved.", time: '15m ago', icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
    { title: 'New Employee Joined', desc: 'James Miller has onboarded in Marketing.', time: '2h ago', icon: UserPlus, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
    { title: 'Payroll Dispatched', desc: 'August salary disbursement confirmed.', time: '4h ago', icon: DollarSign, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400' },
    { title: 'Compliance Audit Ready', desc: 'Q3 statutory compliance verified (100%).', time: '6h ago', icon: ShieldCheck, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  ];

  // Upcoming Events
  const upcomingEventsList = [
    { month: 'SEP', day: '18', title: 'Executive Townhall & Q3 Review', time: '10:00 AM - 11:30 AM', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { month: 'SEP', day: '22', title: 'Product Roadmap & Engineering Sync', time: '02:00 PM - 03:30 PM', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    { month: 'SEP', day: '25', title: 'All-Hands Global Celebration', time: '04:00 PM - 05:00 PM', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  ];

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Employee ${empName} added and onboarding portal invite dispatched!`);
    setIsAddEmployeeOpen(false);
    setEmpName('');
    setEmpEmail('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-800 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HERO BANNER + WORK TIMER */}
      <DashboardHeroBanner
        employeeName="Apex Global Corp - Admin"
        employeeDesignation="Organization Administrator"
        employeeDepartment="Executive Leadership & Workforce Ops"
        employeeId="ORG-8890"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white px-3.5 py-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Employee</span>
            </button>

            <button
              onClick={() => showToast('Generating organization executive monthly report...')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => navigate('/organization/structure')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Org Tree</span>
            </button>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                <span>Enterprise Workforce Hub</span>
                <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 max-w-[210px] leading-tight mt-0.5">
                Full-suite organization governance, headcount analytics and approvals.
              </p>
            </div>
            {/* Executive Badge */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        }
      />

      {/* 2. 6 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-blue-300/80 dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                if (kpi.title.includes('Workforce')) navigate('/employees');
                else if (kpi.title.includes('Present')) navigate('/attendance');
                else if (kpi.title.includes('Leave')) navigate('/leave/manage');
                else if (kpi.title.includes('Approvals')) navigate('/approvals');
                else if (kpi.title.includes('Requisitions')) navigate('/recruitment');
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-xl ${kpi.iconBg} flex-shrink-0 shadow-2xs`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {kpi.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      kpi.isNeutral
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                        : kpi.isPositive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{kpi.subtext}</p>
                <div className="h-4 w-12 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.sparkline}>
                      <Line type="monotone" dataKey="v" stroke={kpi.strokeColor} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID (9 Col Main + 3 Col Sidebar) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER CONTENT (Span 9 Columns) */}
        <div className="xl:col-span-9 space-y-6">
          {/* ROW 1: ATTENDANCE OVERVIEW (Col 7) + LEAVE OVERVIEW (Col 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attendance Chart */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Workforce Attendance Analytics</h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      95.1% Avg
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time daily presence, late arrivals and absentees</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
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
                      <linearGradient id="orgPresentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.15} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 260]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #1E293B', color: '#fff', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#orgPresentGrad)" dot={{ r: 3, fill: '#3B82F6' }} />
                    <Line type="monotone" dataKey="absent" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E' }} />
                    <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Peak Shift Presence: <strong>240 Staff (Thu)</strong></span>
                <button onClick={() => navigate('/attendance')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Full Timesheets →
                </button>
              </div>
            </div>

            {/* Leave Overview Donut */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave & Absence Distribution</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approved vs. pending requests</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                  This Month
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-2">
                <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leaveData} cx="50%" cy="50%" innerRadius={52} outerRadius={74} paddingAngle={4} dataKey="value">
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
                    <span className="text-[10px] text-slate-400">Days Logged</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2 min-w-0">
                  {leaveData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 tabular-nums">
                        <span className="w-6 text-right font-bold text-slate-900 dark:text-white">{item.value}</span>
                        <span className="w-12 text-right text-[10px] text-slate-400 font-medium">({item.percentage})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
                <button onClick={() => navigate('/leave/manage')} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Manage Leave Requests →
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: 3-COL ANALYTICS (Headcount Growth + Department Distribution + Top Performers) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Headcount Growth */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Headcount Velocity</h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+18% YoY</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Net additions over past 6 months</p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#94A3B8" opacity={0.15} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 300]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                    <Bar dataKey="headcount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                <span>Current: <strong>248</strong></span>
                <span>Target: <strong>300 (Q4)</strong></span>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Department Breakdown</h3>
                <span className="text-[10px] font-bold text-slate-400">6 Teams</span>
              </div>

              <div className="flex items-center justify-between gap-2 my-auto py-2">
                <div className="relative h-32 w-32 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deptData} cx="50%" cy="50%" innerRadius={36} outerRadius={52} paddingAngle={3} dataKey="count">
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-base font-black text-slate-900 dark:text-white leading-none">248</span>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[10px] min-w-0 pl-1">
                  {deptData.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="truncate">{d.name}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1 text-right">
                <button onClick={() => navigate('/organization/departments')} className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  View Departments →
                </button>
              </div>
            </div>

            {/* Top Performing Departments */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Department Performance</h3>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">KPI Rating</span>
              </div>

              <div className="space-y-2.5">
                {topPerformers.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{p.rating}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${p.barGradient}`} style={{ width: `${p.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-right">
                <button onClick={() => navigate('/performance')} className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Performance Reviews →
                </button>
              </div>
            </div>
          </div>

          {/* ROW 3: 4 OPERATIONAL HUB CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* 1. Recent Employees */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">New Onboarding</h3>
                  </div>
                  <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {recentEmployeesList.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => navigate('/employees')}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-850/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 transition-all text-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/60 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {emp.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60 text-[10px] font-semibold flex-shrink-0 shadow-2xs whitespace-nowrap">
                        {emp.joiningDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Pending Approvals */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Pending Actions</h3>
                  </div>
                  <button onClick={() => navigate('/approvals')} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Review All
                  </button>
                </div>

                <div className="space-y-2">
                  {pendingApprovalsList.map((app, idx) => {
                    const AppIcon = app.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => navigate(app.route)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-850/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 transition-all text-xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-2 rounded-xl ${app.iconBg} flex-shrink-0`}>
                            <AppIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {app.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{app.subtitle}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex-shrink-0 shadow-2xs whitespace-nowrap ${app.badgeBg}`}>
                          {app.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Upcoming Birthdays */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      <Cake className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Celebrations</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Birthdays</span>
                </div>

                <div className="space-y-2">
                  {birthdaysList.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-850/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={b.avatar} alt={b.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-rose-200 dark:ring-rose-900/60 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                            {b.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{b.department}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Birthday greetings sent to ${b.name}! 🎉`)}
                        className="px-2.5 py-0.5 rounded-full font-bold text-[10px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        {b.date}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Work Anniversaries */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Milestones</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Tenure</span>
                </div>

                <div className="space-y-2">
                  {anniversariesList.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-850/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={a.avatar} alt={a.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-200 dark:ring-amber-900/60 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {a.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{a.department}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-800/60 flex-shrink-0 shadow-2xs whitespace-nowrap">
                        {a.years} {a.medal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT EXECUTIVE SIDEBAR (Span 3 Columns) */}
        <div className="xl:col-span-3 space-y-5">
          {/* Executive Broadcast Card */}
          <div className="rounded-2xl border border-blue-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-4 sm:p-5 text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Executive Broadcast</span>
              </div>
              <h4 className="text-sm font-black leading-snug">Company-Wide Policy & Announcement Dispatch</h4>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                Send instant push notices or company memos directly to all 248 staff members.
              </p>
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Publish Memo</span>
              </button>
            </div>
          </div>

          {/* Recent Executive Notifications */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Organization Feed</h3>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Live</span>
            </div>
            <div className="space-y-3">
              {recentNotificationsList.map((n, idx) => {
                const Icon = n.icon;
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className={`p-1.5 rounded-lg ${n.iconBg} flex-shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Executive Events */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Executive Calendar</h3>
              <button onClick={() => navigate('/events')} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">All Events</button>
            </div>
            <div className="space-y-3">
              {upcomingEventsList.map((e, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`flex flex-col items-center justify-center h-10 w-10 flex-shrink-0 rounded-xl border font-bold ${e.color}`}>
                    <span className="text-[8px] uppercase tracking-wider">{e.month}</span>
                    <span className="text-sm leading-none">{e.day}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{e.title}</p>
                    <p className="text-[10px] text-slate-400">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      <Modal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        title="Add New Organization Employee"
        description="Onboard a new staff member and send automated self-service portal credentials."
        size="lg"
      >
        <form onSubmit={handleAddEmployeeSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. eleanor@apex.saas-hrm.com"
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales & BD">Sales & BD</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Legal">Finance & Legal</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Job Role
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Joining Date
            </label>
            <input
              type="date"
              value={empJoinDate}
              onChange={(e) => setEmpJoinDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddEmployeeOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Complete Onboarding
            </Button>
          </div>
        </form>
      </Modal>

      {/* EXECUTIVE BROADCAST MODAL */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Publish Organization Memo"
        description="Broadcast a high-priority memo, notice, or event invitation across the organization."
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject / Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Townhall & Policy Updates"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Broadcast Message Body
            </label>
            <textarea
              rows={4}
              placeholder="Type your official announcement here..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBroadcastModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                showToast('Executive memo dispatched to all 248 staff members!');
                setIsBroadcastModalOpen(false);
              }}
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Dispatch Broadcast
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrgAdminDashboardView;

