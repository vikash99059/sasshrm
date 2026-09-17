import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ShieldCheck,
  Server,
  Activity,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BarChart3,
  CreditCard,
  Sparkles,
  Database,
  Lightbulb,
  FileText,
  CheckCircle2,
  Lock,
  Layers,
  FileSpreadsheet,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';
import { DashboardHeroBanner } from '../../../components/common/DashboardHeroBanner';

export const SaasOwnerDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<'Last 6 Months' | 'This Year' | 'Last 12 Months'>('Last 6 Months');
  const [revenueDropdownOpen, setRevenueDropdownOpen] = useState(false);
  const [tenantFilter, setTenantFilter] = useState<'All Tenants' | 'Paid' | 'Trial'>('All Tenants');
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  // Revenue Trend Data for the dual-line chart (Apr - Sep)
  const revenueGrowthData = [
    { month: 'Apr', mrr: 48000, revenue: 58000 },
    { month: 'May', mrr: 62000, revenue: 74000 },
    { month: 'Jun', mrr: 75000, revenue: 88000 },
    { month: 'Jul', mrr: 95000, revenue: 110000 },
    { month: 'Aug', mrr: 112000, revenue: 132000 },
    { month: 'Sep', mrr: 128450, revenue: 152000 },
  ];

  // Tenant Plan Distribution for Donut Chart
  const tenantDonutData = [
    { name: 'Paid', value: 42, color: '#00B074', percentage: '87.5%' },
    { name: 'Trial', value: 6, color: '#3B82F6', percentage: '12.5%' },
  ];

  // Recent Tenants list
  const recentTenants = [
    { id: 'TNT-001', name: 'Acme Corp', status: 'Paid', created: 'Sep 12, 2026' },
    { id: 'TNT-002', name: 'Skyline Tech', status: 'Trial', created: 'Sep 10, 2026' },
    { id: 'TNT-003', name: 'Global Solutions', status: 'Paid', created: 'Sep 08, 2026' },
    { id: 'TNT-004', name: 'NextGen Ltd', status: 'Paid', created: 'Sep 05, 2026' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* 1. TOP HERO BANNER + WORK TIMER */}
      <DashboardHeroBanner
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddTenantOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white px-3.5 py-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Tenant</span>
            </button>

            <button
              onClick={() => navigate('/saas/analytics')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <BarChart3 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>View Analytics</span>
            </button>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                <span>Your Platform. Your Growth.</span>
                <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300 max-w-[210px] leading-tight mt-0.5">
                Manage tenants, users and organizations from one powerful dashboard.
              </p>
            </div>
            {/* Growth Graphic */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <TrendingUp className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        }
      />

      {/* =========================================================================
          2. 5 KPI METRIC CARDS (MATCHING REFERENCE IMAGE)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1: Monthly Recurring (MRR) */}
        <div className="rounded-2xl border border-emerald-100/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  MONTHLY RECURRING (MRR)
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 text-xs font-bold">
                $
              </div>
            </div>

            <div className="mt-2">
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                $128,450
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <span>↑ 14.2% MoM</span>
              </span>

              {/* Sparkline curve */}
              <div className="w-16 h-6 flex items-center">
                <svg className="w-full h-full" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M 0 16 Q 15 14, 25 8 T 45 6 T 60 2"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Annualized: $1.5M
            </span>
          </div>
        </div>

        {/* KPI 2: Total Organizations */}
        <div className="rounded-2xl border border-purple-100/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700/60 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  TOTAL ORGANIZATIONS
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 text-xs font-bold">
                <Building2 className="h-3 w-3" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                48
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <span>↑ 5 this month</span>
              </span>

              {/* Sparkline curve */}
              <div className="w-16 h-6 flex items-center">
                <svg className="w-full h-full" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M 0 16 Q 15 14, 25 10 T 45 4 T 60 2"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              42 Paid • 6 In Trial
            </span>
          </div>
        </div>

        {/* KPI 3: Active Platform Users */}
        <div className="rounded-2xl border border-blue-100/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  ACTIVE PLATFORM USERS
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 text-xs font-bold">
                <Users className="h-3 w-3" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                12,840
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <span>↑ 8.6% growth</span>
              </span>

              {/* Sparkline curve */}
              <div className="w-16 h-6 flex items-center">
                <svg className="w-full h-full" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M 0 16 Q 15 12, 30 8 T 50 6 T 60 2"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Across 48 Tenants
            </span>
          </div>
        </div>

        {/* KPI 4: Platform Churn Rate */}
        <div className="rounded-2xl border border-amber-100/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700/60 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  PLATFORM CHURN RATE
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 text-xs font-bold">
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                1.2%
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <span>↓ 0.4% improvement</span>
              </span>

              {/* Sparkline curve */}
              <div className="w-16 h-6 flex items-center">
                <svg className="w-full h-full" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M 0 16 Q 15 14, 30 10 T 50 6 T 60 3"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Industry benchmark 2.8%
            </span>
          </div>
        </div>

        {/* KPI 5: Platform Uptime */}
        <div className="rounded-2xl border border-rose-100/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col justify-between hover:border-rose-300 dark:hover:border-rose-700/60 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <Server className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  PLATFORM UPTIME
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 text-xs font-bold">
                <Server className="h-3 w-3" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                99.98%
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                All systems operational
              </span>

              {/* Sparkline curve */}
              <div className="w-16 h-6 flex items-center">
                <svg className="w-full h-full" viewBox="0 0 60 20" fill="none">
                  <path
                    d="M 0 16 Q 15 14, 30 10 T 50 4 T 60 2"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Avg latency: 120ms
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. BOTTOM 3-CARD MAIN DASHBOARD SECTION
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: Revenue & MRR Growth (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            {/* Header + Dropdown */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Revenue & MRR Growth
                </h2>
              </div>

              <div className="relative">
                <button
                  onClick={() => setRevenueDropdownOpen(!revenueDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  <span>{revenuePeriod}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
                {revenueDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                    {(['Last 6 Months', 'This Year', 'Last 12 Months'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setRevenuePeriod(p);
                          setRevenueDropdownOpen(false);
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

            {/* Legend */}
            <div className="flex items-center gap-4 mb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                MRR
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Total Revenue
              </span>
            </div>

            {/* Chart + Side Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Chart (7 Cols) */}
              <div className="sm:col-span-7 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: '#94A3B8' }}
                      domain={[0, 200000]}
                      ticks={[0, 50000, 100000, 150000, 200000]}
                      tickFormatter={(v) => `$${v / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '11px' }}
                      formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="mrr" stroke="#3B82F6" strokeWidth={2.5} fill="url(#mrrGradient)" dot={{ r: 3, fill: '#3B82F6' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: '#8B5CF6' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Side Summary Block (5 Cols) */}
              <div className="sm:col-span-5 space-y-3 pl-1 sm:pl-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Current MRR</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">$128,450</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↑ 14.2%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Total Revenue</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">$842,660</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↑ 12.8%</span>
                  </div>
                </div>

                {/* Target badge */}
                <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white flex-shrink-0">
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block leading-tight">
                      On track for
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
                      $1.5M annual run rate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Tenant Overview (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            {/* Header + Dropdown */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tenant Overview
                </h2>
              </div>

              <div className="relative">
                <button
                  onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  <span>{tenantFilter}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
                {tenantDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-slide-down dark:border-slate-800 dark:bg-dark-card z-50">
                    {(['All Tenants', 'Paid', 'Trial'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setTenantFilter(p);
                          setTenantDropdownOpen(false);
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

            {/* Donut Chart with Center Stat + Legend */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="relative h-28 w-28 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tenantDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {tenantDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">48</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">Organizations</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="space-y-2 text-xs pr-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00B074]" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Paid</span>
                  <span className="font-bold text-slate-900 dark:text-white ml-auto">42 (87.5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Trial</span>
                  <span className="font-bold text-slate-900 dark:text-white ml-auto">6 (12.5%)</span>
                </div>
              </div>
            </div>

            {/* Recent Tenants Mini-Table */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 pb-1.5 px-1">
                <span>Recent Tenants</span>
                <span className="text-right">Status / Created</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentTenants.map((tenant) => (
                  <div key={tenant.id} className="py-1.5 px-1 flex items-center justify-between text-xs hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-blue-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">{tenant.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tenant.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                        {tenant.status}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {tenant.created}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: System Health & Pro Tip (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3.5">
          {/* Top: System Health Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  System Health
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                All Good
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Database Cluster</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  Healthy
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Application Nodes</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  8 Nodes Up
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Security & Compliance</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
                  SOC2 Type II
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Platform Performance</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  Normal
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: Pro Tip Card with Gradient Background */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white p-4 shadow-md relative overflow-hidden flex flex-col justify-between">
            {/* Background Watermark Graphic */}
            <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none">
              <TrendingUp className="h-28 w-28 text-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100 mb-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-300" />
                <span>Pro Tip</span>
              </div>
              <p className="text-[11px] font-medium text-blue-100/90 leading-relaxed">
                Enable auto-scaling to handle traffic spikes and improve performance by 30%.
              </p>
            </div>

            <div className="relative z-10 pt-3">
              <button
                onClick={() => navigate('/saas/analytics')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 text-[11px] font-bold backdrop-blur-md transition-all cursor-pointer"
              >
                <span>View Recommendations</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Provision New Tenant Modal */}
      <Modal
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        title="Provision New Tenant Organization"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Tenant Organization provisioned successfully.');
            setIsAddTenantOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Organization Legal Name" placeholder="e.g. Acronis Global Inc." required />
          <Input label="Subdomain Identifier" placeholder="acronis" helperText="Will be provisioned at yourdomain.saas-hrm.com" required />
          <Select
            label="Subscription Tier"
            options={[
              { value: 'enterprise', label: 'Enterprise Plan ($10/user/mo)' },
              { value: 'business', label: 'Business Pro Plan ($8/user/mo)' },
              { value: 'starter', label: 'Starter Tier ($5/user/mo)' },
              { value: 'trial', label: '14-Day Full Access Trial' },
            ]}
          />
          <Input label="Initial User Seats" type="number" defaultValue="50" required />
          <Input label="Primary Admin Full Name" placeholder="Jane Doe" required />
          <Input label="Primary Admin Work Email" type="email" placeholder="admin@organization.com" required />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddTenantOpen(false)}>Cancel</Button>
            <Button type="submit">Create Organization</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SaasOwnerDashboardView;
