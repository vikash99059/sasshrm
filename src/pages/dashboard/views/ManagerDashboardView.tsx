import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CalendarMinus,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  ChevronDown,
  Check,
  X,
  Target,
  Sparkles,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';

export const ManagerDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('This Week (May 20 - May 26)');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [isAssignGoalOpen, setIsAssignGoalOpen] = useState(false);

  // Manager KPI Cards
  const managerKpis = [
    { title: 'My Team', value: '14', change: '+2 new', isPositive: true, subtext: 'Engineering Squad', icon: Users, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400', stroke: '#3B82F6' },
    { title: 'Present Today', value: '12', change: '86%', isPositive: true, subtext: '2 On Leave', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400', stroke: '#10B981' },
    { title: 'On Leave', value: '2', change: '-1 vs last week', isPositive: false, subtext: 'Sophia & James', icon: CalendarMinus, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400', stroke: '#F43F5E' },
    { title: 'Leave Approvals', value: '3', change: 'Action Required', isNeutral: true, subtext: 'Pending Review', icon: Clock, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400', stroke: '#F59E0B' },
    { title: 'Pending Timesheets', value: '4', change: '4 to verify', isNeutral: true, subtext: 'Due Friday', icon: CheckCircle2, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400', stroke: '#8B5CF6' },
    { title: 'Team Performance', value: '92%', change: '+4% vs Q1', isPositive: true, subtext: 'Sprint on track', icon: TrendingUp, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400', stroke: '#06B6D4' },
  ];

  // Team Attendance Data
  const teamAttendanceData = [
    { day: 'Mon', present: 13, remote: 8, leave: 1 },
    { day: 'Tue', present: 14, remote: 7, leave: 0 },
    { day: 'Wed', present: 12, remote: 9, leave: 2 },
    { day: 'Thu', present: 13, remote: 8, leave: 1 },
    { day: 'Fri', present: 12, remote: 10, leave: 2 },
  ];

  // Team Goals Progress
  const teamGoals = [
    { title: 'Migrate Core API to Microservices', assignee: 'Alex Rivera', progress: 85, dueDate: 'May 30', status: 'On Track', color: 'from-blue-500 to-indigo-600' },
    { title: 'Optimize Database Query Indexes', assignee: 'Liam Vance', progress: 65, dueDate: 'Jun 05', status: 'In Progress', color: 'from-purple-500 to-violet-600' },
    { title: 'Security Pen Testing Fixes', assignee: 'Sophia Davis', progress: 95, dueDate: 'May 24', status: 'Almost Done', color: 'from-emerald-400 to-teal-500' },
    { title: 'Implement Realtime WebSockets', assignee: 'David Anderson', progress: 40, dueDate: 'Jun 15', status: 'In Progress', color: 'from-amber-400 to-orange-500' },
  ];

  // Direct Reports (Team Members)
  const [teamMembers] = useState([
    { id: 'TM-1', name: 'Sophia Davis', designation: 'Senior Backend Engineer', status: 'Online', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', hoursThisWeek: '38.5 hrs' },
    { id: 'TM-2', name: 'Liam Vance', designation: 'Fullstack Developer', status: 'In Meeting', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', hoursThisWeek: '40.0 hrs' },
    { id: 'TM-3', name: 'Alex Rivera', designation: 'DevOps Architect', status: 'Online', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', hoursThisWeek: '37.0 hrs' },
    { id: 'TM-4', name: 'James Miller', designation: 'Frontend Specialist', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', hoursThisWeek: '0 hrs' },
    { id: 'TM-5', name: 'Emily Clark', designation: 'QA Automation Engineer', status: 'Online', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', hoursThisWeek: '39.0 hrs' },
  ]);

  // Pending Leave Requests for Manager's Team
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-1', name: 'Sophia Davis', type: 'Annual Leave', dates: 'May 28 - May 30 (3 days)', reason: 'Family vacation' },
    { id: 'LR-2', name: 'Alex Rivera', type: 'Sick Leave', dates: 'May 23 (1 day)', reason: 'Doctor appointment' },
    { id: 'LR-3', name: 'Liam Vance', type: 'Casual Leave', dates: 'Jun 02 (1 day)', reason: 'Personal work' },
  ]);

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(leaveRequests.filter(r => r.id !== id));
    alert('Leave request approved for team member!');
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests(leaveRequests.filter(r => r.id !== id));
    alert('Leave request rejected.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER: Manager Greeting & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Engineering Team</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Manager Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Hello, David Miller <span className="text-2xl">⚡</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's the live overview and operational status of your 14 engineering team members.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAssignGoalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Assign Goal</span>
          </button>
          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
          >
            <span>Team Timesheets</span>
          </button>
        </div>
      </div>

      {/* 6 MANAGER KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {managerKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between"
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
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  kpi.isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                  kpi.isNeutral ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                  'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* CHARTS ROW: TEAM ATTENDANCE & TEAM GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Team Attendance Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Team Attendance & Working Modes</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct reports daily attendance (Mon - Fri)</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Office</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500" />Remote</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" />Leave</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 15]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Bar dataKey="present" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} name="In Office" />
                <Bar dataKey="remote" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={18} name="Remote" />
                <Bar dataKey="leave" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={18} name="On Leave" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Goals Progress Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Team Sprint OKRs</h2>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-950/40 dark:text-blue-300">Q2 Objectives</span>
          </div>

          <div className="space-y-3.5 my-auto">
            {teamGoals.map((g, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{g.title}</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">{g.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${g.color}`} style={{ width: `${g.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Assignee: {g.assignee}</span>
                  <span>Due {g.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS & APPROVAL PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Direct Team Members List */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">My Direct Reports (Engineering Squad)</h3>
            <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All 14 ↗</button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {teamMembers.map((tm) => (
              <div key={tm.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={tm.avatar} alt={tm.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{tm.name}</p>
                    <p className="text-[10px] text-slate-400">{tm.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tm.status === 'Online' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' :
                    tm.status === 'On Leave' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' :
                    'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'
                  }`}>
                    {tm.status}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 tabular-nums hidden sm:inline">{tm.hoursThisWeek}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Team Leave Approvals */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Pending Team Leave Approvals</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-950/40 dark:text-amber-300">{leaveRequests.length} Pending</span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{req.name}</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded dark:bg-blue-950/50 dark:text-blue-300">{req.type}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{req.dates}</p>
                <p className="text-[10px] text-slate-400 italic mt-0.5">"{req.reason}"</p>
                <div className="mt-2.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRejectLeave(req.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApproveLeave(req.id)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Check className="h-3 w-3" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ASSIGN GOAL MODAL */}
      <Modal isOpen={isAssignGoalOpen} onClose={() => setIsAssignGoalOpen(false)} title="Assign Team Goal" size="md">
        <form onSubmit={(e) => { e.preventDefault(); alert('Goal assigned to team member!'); setIsAssignGoalOpen(false); }} className="space-y-4">
          <Input label="Goal Title" placeholder="e.g. Implement End-to-End Tests" required />
          <Select label="Assignee" options={teamMembers.map(t => ({ value: t.name, label: `${t.name} (${t.designation})` }))} />
          <Input label="Target Due Date" type="date" required defaultValue="2024-06-15" />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAssignGoalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Assign Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
