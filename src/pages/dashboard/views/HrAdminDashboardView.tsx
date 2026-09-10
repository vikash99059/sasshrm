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
  Cake,
  Award,
  CheckCircle2,
  FileCheck,
  AlertCircle,
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
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';

export const HrAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState('May 20 - May 26, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // HR Admin KPIs
  const hrKpis = [
    { title: 'Total Employees', value: '248', change: '+12%', isPositive: true, subtext: 'vs last week: 221', icon: Users, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400', stroke: '#3B82F6', spark: [{ v: 210 }, { v: 218 }, { v: 224 }, { v: 220 }, { v: 235 }, { v: 242 }, { v: 248 }] },
    { title: 'Present Today', value: '236', change: '+8%', isPositive: true, subtext: 'vs yesterday: 218', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400', stroke: '#10B981', spark: [{ v: 200 }, { v: 212 }, { v: 225 }, { v: 218 }, { v: 230 }, { v: 228 }, { v: 236 }] },
    { title: 'On Leave', value: '12', change: '-4%', isPositive: false, subtext: 'vs yesterday: 16', icon: CalendarMinus, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400', stroke: '#F43F5E', spark: [{ v: 18 }, { v: 16 }, { v: 14 }, { v: 15 }, { v: 13 }, { v: 14 }, { v: 12 }] },
    { title: 'New Joiners', value: '8', change: '+25%', isPositive: true, subtext: 'This Month', icon: UserPlus, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400', stroke: '#6366F1', spark: [{ v: 3 }, { v: 4 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 7 }, { v: 8 }] },
    { title: 'Pending HR Requests', value: '14', change: '5 Urgent', isNeutral: true, subtext: 'Leaves & Docs', icon: Clock, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400', stroke: '#F59E0B', spark: [{ v: 8 }, { v: 10 }, { v: 12 }, { v: 11 }, { v: 14 }, { v: 13 }, { v: 14 }] },
    { title: 'Open Positions', value: '5', change: '+40%', isPositive: true, subtext: 'Active Requisitions', icon: Briefcase, iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400', stroke: '#06B6D4', spark: [{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }] },
  ];

  // Attendance Line Chart Data
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

  // Department Distribution Data
  const deptData = [
    { name: 'Engineering', value: 28, color: '#3B82F6' },
    { name: 'Marketing', value: 16, color: '#06B6D4' },
    { name: 'HR', value: 12, color: '#10B981' },
    { name: 'Sales', value: 14, color: '#F59E0B' },
    { name: 'Finance', value: 10, color: '#EC4899' },
    { name: 'Operations', value: 8, color: '#8B5CF6' },
  ];

  // Recent Joiners
  const recentEmployeesList = [
    { id: 'EMP-01', name: 'James Miller', department: 'Marketing', joiningDate: 'May 20, 2024', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-02', name: 'Sophia Davis', department: 'Engineering', joiningDate: 'May 18, 2024', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-03', name: 'William Brown', department: 'Sales', joiningDate: 'May 16, 2024', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-04', name: 'Olivia Wilson', department: 'HR', joiningDate: 'May 14, 2024', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-05', name: 'Liam Garcia', department: 'Finance', joiningDate: 'May 12, 2024', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  ];

  // Document Verifications Queue
  const docQueue = [
    { title: 'Tax Exemption W-4 Form', employee: 'James Miller', time: '1h ago', status: 'Pending Review' },
    { title: 'Passport / Work Authorization', employee: 'Sophia Davis', time: '3h ago', status: 'Pending Review' },
    { title: 'Direct Deposit Void Check', employee: 'William Brown', time: '5h ago', status: 'Verified' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER: HR Admin Greeting & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Human Resources</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">HR Admin Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            HR Admin Workspace <span className="text-2xl">👥</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organization-wide employee management, leave governance, onboarding, and compliance records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={() => navigate('/leave/requests')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
          >
            <span>HR Approvals</span>
          </button>
        </div>
      </div>

      {/* 6 HR ADMIN KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {hrKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 truncate">{kpi.title}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  kpi.isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                  kpi.isNeutral ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* ROW 2: ATTENDANCE & LEAVE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Organization Attendance Trend</h2>
              <p className="text-[11px] text-slate-400">Daily attendance across all departments</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hrAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 250]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Area type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#hrAtt)" dot={{ r: 3, fill: '#3B82F6' }} />
                <Line type="monotone" dataKey="absent" stroke="#F43F5E" strokeWidth={2} dot={{ r: 3, fill: '#F43F5E' }} />
                <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Leave Allocation</h2>
            <span className="text-[10px] font-bold text-slate-400">186 Total Leaves</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-2">
            <div className="relative h-44 w-44 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leaveData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">186</span>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Leaves</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              {leaveData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-2">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums flex-shrink-0">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: RECENT JOINERS & DOCUMENT VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Joiners */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Recent New Joiners</h3>
            <button onClick={() => navigate('/employees')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All Directory ↗</button>
          </div>
          <div className="space-y-3">
            {recentEmployeesList.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                    <p className="text-[10px] text-slate-400">{emp.department}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{emp.joiningDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Verification Queue */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Document Compliance Queue</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-950/40 dark:text-amber-300">3 Pending</span>
          </div>

          <div className="space-y-3">
            {docQueue.map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{doc.title}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Submitted by {doc.employee} • {doc.time}</p>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button onClick={() => alert('Document verified!')} className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                    Verify Doc
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      <Modal isOpen={isAddEmployeeOpen} onClose={() => setIsAddEmployeeOpen(false)} title="Add New Employee" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); alert('Employee added to organization!'); setIsAddEmployeeOpen(false); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required placeholder="Liam" />
            <Input label="Last Name" required placeholder="Vance" />
          </div>
          <Input label="Work Email" type="email" required placeholder="liam.vance@acme.corp" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" options={[{ value: 'eng', label: 'Engineering' }, { value: 'mkt', label: 'Marketing' }, { value: 'sales', label: 'Sales' }]} />
            <Input label="Designation" placeholder="Fullstack Developer" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Employee Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
