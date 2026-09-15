import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const RecruitmentAnalyticsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'quarter' | 'custom'>('quarter');

  // Chart Data
  const funnelData = [
    { stage: 'Applications', candidates: 420, fill: '#3b82f6' },
    { stage: 'Screening', candidates: 285, fill: '#60a5fa' },
    { stage: 'Shortlisted', candidates: 142, fill: '#818cf8' },
    { stage: 'Interview', candidates: 86, fill: '#a855f7' },
    { stage: 'Selected', candidates: 34, fill: '#ec4899' },
    { stage: 'Offer Sent', candidates: 22, fill: '#f59e0b' },
    { stage: 'Joined', candidates: 18, fill: '#10b981' },
  ];

  const sourceData = [
    { name: 'LinkedIn Jobs', value: 165, color: '#0ea5e9' },
    { name: 'Career Page', value: 110, color: '#3b82f6' },
    { name: 'Employee Referrals', value: 75, color: '#10b981' },
    { name: 'Job Portals (Indeed)', value: 45, color: '#f59e0b' },
    { name: 'Staffing Agencies', value: 25, color: '#8b5cf6' },
  ];

  const monthlyHiringTrend = [
    { month: 'Jan', applications: 210, interviews: 48, hired: 9 },
    { month: 'Feb', applications: 280, interviews: 62, hired: 12 },
    { month: 'Mar', applications: 340, interviews: 74, hired: 14 },
    { month: 'Apr', applications: 310, interviews: 68, hired: 11 },
    { month: 'May', applications: 390, interviews: 85, hired: 16 },
    { month: 'Jun', applications: 420, interviews: 92, hired: 18 },
  ];

  const departmentOpenings = [
    { department: 'Engineering', positions: 8, filled: 5 },
    { department: 'Product & Design', positions: 4, filled: 3 },
    { department: 'Marketing', positions: 3, filled: 2 },
    { department: 'Sales & Growth', positions: 5, filled: 3 },
    { department: 'Human Resources', positions: 2, filled: 1 },
  ];

  const recruiterPerformance = [
    { name: 'Elena Rostova', rolesManaged: 12, candidatesScreened: 145, offersExtended: 10, hired: 8, avgDaysToHire: 21 },
    { name: 'Marcus Vance', rolesManaged: 8, candidatesScreened: 98, offersExtended: 7, hired: 5, avgDaysToHire: 26 },
    { name: 'Rachel Green', rolesManaged: 6, candidatesScreened: 84, offersExtended: 5, hired: 4, avgDaysToHire: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Recruitment Intelligence & ATS Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic recruitment KPI reporting, velocity indicators, conversion rates, and sourcing ROI.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {(['today', 'week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-3 py-1.5 rounded-md capitalize transition ${
                  dateFilter === period
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'overview', label: 'Recruitment Overview' },
          { key: 'sources', label: 'Source Analytics' },
          { key: 'time-to-hire', label: 'Time to Hire' },
          { key: 'cost', label: 'Cost per Hire' },
          { key: 'funnel', label: 'Hiring Funnel' },
          { key: 'performance', label: 'Recruiter Performance' },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Avg Time to Hire</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> -3.4 days
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">22.8 Days</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Industry Benchmark: 34 Days</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Offer Acceptance Rate</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">87.5%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">21 Accepted of 24 Sent</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Average Cost Per Hire</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> -11%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">$2,840</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Direct + Agency + Software</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Joining Confirmation</span>
            <span className="text-[10px] font-bold text-blue-600 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> 100%
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">18 / 18</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Zero no-shows this quarter</p>
        </Card>
      </div>

      {/* Charts Row 1: Funnel & Sourcing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Full ATS Hiring Funnel */}
        <Card className="p-4 border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Candidate Conversion Funnel
              </h3>
              <p className="text-[11px] text-slate-500">Volume through progressive ATS qualification gates</p>
            </div>
            <Badge variant="primary" size="sm">
              4.3% Net Yield
            </Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#33415522" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="candidates" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Applications by Source */}
        <Card className="p-4 border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Applications by Sourcing Channel
              </h3>
              <p className="text-[11px] text-slate-500">Inbound candidate origins and platform efficacy</p>
            </div>
            <Badge variant="neutral" size="sm">
              420 Sourced
            </Badge>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-[11px] text-slate-600 dark:text-slate-400">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2: Monthly Hiring Trend & Open Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend Area Chart */}
        <Card className="p-4 border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Monthly Recruitment Velocity & Hires
            </h3>
            <p className="text-[11px] text-slate-500">Applicant flow vs. completed onboards</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyHiringTrend}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415522" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApp)" />
                <Area type="monotone" dataKey="hired" stroke="#10b981" fillOpacity={1} fill="url(#colorHired)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recruiter Performance Table */}
        <Card className="p-4 border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recruiter Productivity & Turnaround Score
              </h3>
              <p className="text-[11px] text-slate-500">SLA adherence, candidate throughput, and fill velocity</p>
            </div>
            <Badge variant="success" size="sm">Top Performance</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border text-[11px] font-bold text-slate-400">
                  <th className="pb-2">Recruiter</th>
                  <th className="pb-2">Roles</th>
                  <th className="pb-2">Screened</th>
                  <th className="pb-2">Offers</th>
                  <th className="pb-2">Hires</th>
                  <th className="pb-2">Avg Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recruiterPerformance.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{r.name}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.rolesManaged}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.candidatesScreened}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.offersExtended}</td>
                    <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">{r.hired}</td>
                    <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">{r.avgDaysToHire} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
