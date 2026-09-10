import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Clock,
  UserPlus,
  FileCheck,
  CalendarMinus,
  AlertCircle,
  Plus,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';

export const HrExecutiveDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // HR Executive KPIs
  const execKpis = [
    { title: "Today's Attendance", value: '236 / 248', change: '95.1%', isPositive: true, subtext: '12 Absent', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { title: 'Pending Requests', value: '6', change: 'Action Required', isNeutral: true, subtext: 'Leaves & Claims', icon: Clock, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' },
    { title: 'New Onboardings', value: '4', change: '2 This Week', isPositive: true, subtext: 'Welcome Kits Ready', icon: UserPlus, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { title: 'Docs to Verify', value: '7', change: 'Compliance', isNeutral: true, subtext: 'Passport & Tax', icon: FileCheck, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
    { title: 'Leave Reviews', value: '5', change: 'Review Queue', isNeutral: true, subtext: 'Awaiting HR Sig', icon: CalendarMinus, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { title: 'Employee Issues', value: '3', change: 'Open Tickets', isNeutral: true, subtext: 'HR Helpdesk', icon: AlertCircle, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
  ];

  // Daily Operational Tasks
  const operationalTasks = [
    { id: 1, title: 'Verify I-9 / W-4 for James Miller', category: 'Compliance', status: 'Pending', priority: 'High' },
    { id: 2, title: 'Prepare Welcome Kit & Asset Handover for Liam Vance', category: 'Onboarding', status: 'In Progress', priority: 'High' },
    { id: 3, title: 'Audit attendance logs for missing clock-outs', category: 'Attendance', status: 'Pending', priority: 'Medium' },
    { id: 4, title: 'Issue company ID badge for Sophia Davis', category: 'Assets', status: 'Completed', priority: 'Normal' },
  ];

  // Live Employee Activity Feed
  const liveActivities = [
    { user: 'Rahul Sharma', action: 'Clocked in at 09:12 AM (In Office)', time: '10m ago' },
    { user: 'Priya Nair', action: 'Applied for 2 days Casual Leave', time: '25m ago' },
    { user: 'James Miller', action: 'Uploaded Direct Deposit Authorization form', time: '1h ago' },
    { user: 'Sarah Wilson', action: 'Completed quarterly feedback review', time: '2h ago' },
    { user: 'Liam Garcia', action: 'Submitted travel expense claim ($340)', time: '3h ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER: HR Executive Operations */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Daily Operations</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">HR Executive Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Operations Workspace <span className="text-2xl">📋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daily employee operations, onboarding checklists, document audits, and helpdesk inquiries.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard Employee</span>
          </button>
          <button
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
          >
            <span>Live Attendance Log</span>
          </button>
        </div>
      </div>

      {/* 6 OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {execKpis.map((kpi, idx) => {
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
                  kpi.isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* OPERATIONAL CHECKLIST & LIVE ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Operational Checklist */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Today's HR Action Checklist</h3>
            <span className="text-[10px] font-bold text-blue-600">3 of 4 Incomplete</span>
          </div>

          <div className="space-y-3">
            {operationalTasks.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    t.status === 'Completed' ? 'bg-emerald-500' : t.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <p className={`font-semibold text-xs ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{t.title}</p>
                    <p className="text-[10px] text-slate-400">{t.category} • Priority: {t.priority}</p>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Task status updated for: ${t.title}`)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {t.status === 'Completed' ? 'Done' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Employee Activity Stream */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Live Activity Stream</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</span>
          </div>

          <div className="space-y-3">
            {liveActivities.map((act, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-none">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{act.user}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.action}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
