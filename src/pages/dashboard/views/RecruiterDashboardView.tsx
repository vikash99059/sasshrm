import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  Video,
  ChevronDown,
  Star,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';

export const RecruiterDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  // Recruiter KPIs
  const recruiterKpis = [
    { title: 'Open Positions', value: '12', change: '+3 new', isPositive: true, subtext: '5 Active Pipelines', icon: Briefcase, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { title: 'Total Candidates', value: '148', change: '+24 this week', isPositive: true, subtext: 'Active in ATS', icon: Users, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { title: 'Interviews Today', value: '6', change: '2 Completed', isNeutral: true, subtext: '4 Upcoming', icon: Calendar, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
    { title: 'Offers Sent', value: '4', change: '3 Accepted', isPositive: true, subtext: '1 Pending Reply', icon: UserCheck, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { title: 'Hired This Month', value: '8', change: 'Goal: 10', isPositive: true, subtext: '80% of Target', icon: CheckCircle2, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400' },
    { title: 'Avg Time to Hire', value: '18 Days', change: '-4 Days', isPositive: true, subtext: 'Industry: 26d', icon: Clock, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' },
  ];

  // Recruitment Funnel Data
  const funnelData = [
    { stage: 'Applied', count: 148, fill: '#3B82F6' },
    { stage: 'Screening', count: 96, fill: '#6366F1' },
    { stage: 'Shortlisted', count: 48, fill: '#8B5CF6' },
    { stage: 'Interview', count: 28, fill: '#EC4899' },
    { stage: 'Technical', count: 16, fill: '#F59E0B' },
    { stage: 'Offer', count: 6, fill: '#10B981' },
    { stage: 'Hired', count: 4, fill: '#059669' },
  ];

  // Sourcing Channels
  const sourceData = [
    { name: 'LinkedIn Jobs', value: 45, color: '#0077B5' },
    { name: 'Employee Referrals', value: 25, color: '#10B981' },
    { name: 'Job Portals (Indeed)', value: 20, color: '#6366F1' },
    { name: 'Company Website', value: 10, color: '#F59E0B' },
  ];

  // Candidate Pipeline Stages
  const candidateStages = [
    { name: 'Applied', count: 38, color: 'bg-blue-500' },
    { name: 'Screening', count: 24, color: 'bg-indigo-500' },
    { name: 'Shortlisted', count: 18, color: 'bg-purple-500' },
    { name: 'Interview', count: 12, color: 'bg-pink-500' },
    { name: 'Technical', count: 8, color: 'bg-amber-500' },
    { name: 'HR Round', count: 5, color: 'bg-orange-500' },
    { name: 'Selected', count: 4, color: 'bg-emerald-500' },
    { name: 'Joined', count: 3, color: 'bg-teal-600' },
  ];

  // Today's Interviews Schedule
  const interviewsToday = [
    { time: '10:00 AM', candidate: 'Ethan Hunt', role: 'Staff React Engineer', interviewer: 'Alex Johnson', stage: 'System Design', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { time: '11:30 AM', candidate: 'Clara Oswald', role: 'Senior Product Designer', interviewer: 'Sarah Wilson', stage: 'Portfolio Review', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { time: '02:00 PM', candidate: 'Marcus Vance', role: 'DevOps Lead', interviewer: 'David Miller', stage: 'Technical Round 2', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { time: '04:00 PM', candidate: 'Zoe Saldana', role: 'Marketing Strategist', interviewer: 'Rachel Green', stage: 'Culture Fit', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ];

  // Active Job Openings
  const activeJobs = [
    { title: 'Lead Fullstack Architect', dept: 'Engineering', applicants: 34, location: 'Remote', urgency: 'High' },
    { title: 'Senior Product Designer', dept: 'Design', applicants: 28, location: 'San Francisco, CA', urgency: 'Medium' },
    { title: 'DevOps / SRE Engineer', dept: 'Infrastructure', applicants: 19, location: 'Remote / Hybrid', urgency: 'High' },
    { title: 'Enterprise Account Executive', dept: 'Sales', applicants: 22, location: 'New York, NY', urgency: 'Normal' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER: Recruiter Greeting & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Talent Acquisition</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Recruiter ATS Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Recruiter Workspace <span className="text-2xl">🎯</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active candidate pipelines, live interview schedules, and open requisition tracking.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </button>
          <button
            onClick={() => navigate('/recruitment/candidates')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
          >
            <span>Candidate Kanban</span>
          </button>
        </div>
      </div>

      {/* 6 RECRUITER KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {recruiterKpis.map((kpi, idx) => {
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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* RECRUITMENT PIPELINE FLOW (8 STAGES) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Candidate Pipeline Stages</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Distribution of 148 candidates across the full recruitment funnel</p>
          </div>
          <button onClick={() => navigate('/recruitment/candidates')} className="text-xs font-bold text-blue-600 hover:text-blue-700">Open Kanban ↗</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {candidateStages.map((stage, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 flex flex-col justify-between text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">{stage.name}</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{stage.count}</span>
              <span className="text-[9px] text-slate-400 mt-0.5">candidates</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS ROW: FUNNEL + SOURCING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recruitment Funnel Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recruitment Conversion Funnel</h2>
              <p className="text-[11px] text-slate-400">Application conversion rates through each stage</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/40 dark:text-emerald-300">5.4% Overall Hire Rate</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sourcing Channel Distribution */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Applicant Source Channels</h2>
            <span className="text-[10px] font-bold text-slate-400">Q2 Sourcing</span>
          </div>

          <div className="flex items-center justify-between gap-3 my-auto">
            <div className="relative h-40 w-40 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-lg font-black text-slate-900 dark:text-white">148</span>
                <span className="block text-[8px] uppercase font-bold text-slate-400">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {sourceData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INTERVIEWS TODAY & OPEN JOBS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interviews Today */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Interviews Scheduled Today</h3>
            <button onClick={() => navigate('/recruitment/interviews')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Calendar ↗</button>
          </div>

          <div className="space-y-3">
            {interviewsToday.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.candidate} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.candidate}</p>
                    <p className="text-[10px] text-slate-400">{item.role} • {item.stage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950/40 dark:text-blue-300">{item.time}</span>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Video className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Requisitions */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Open Job Requisitions</h3>
            <button onClick={() => navigate('/recruitment/jobs')} className="text-[10px] font-bold text-blue-600 hover:text-blue-700">All Jobs ↗</button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeJobs.map((job, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{job.title}</p>
                  <p className="text-[10px] text-slate-400">{job.dept} • {job.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{job.applicants} Applicants</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    job.urgency === 'High' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POST JOB MODAL */}
      <Modal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} title="Post New Job Opening" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); alert('Job opening posted successfully!'); setIsPostJobOpen(false); }} className="space-y-4">
          <Input label="Job Title" placeholder="e.g. Senior Security Architect" required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" options={[{ value: 'eng', label: 'Engineering' }, { value: 'mkt', label: 'Marketing' }, { value: 'sales', label: 'Sales' }]} />
            <Select label="Workplace Type" options={[{ value: 'remote', label: 'Full Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'onsite', label: 'On-site' }]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Experience Level" placeholder="e.g. 5+ Years" />
            <Input label="Salary Range ($)" placeholder="e.g. $120,000 - $150,000" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsPostJobOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish Job Opening</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
