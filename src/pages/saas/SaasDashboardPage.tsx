import React, { useState, useEffect } from 'react';
import { saasService } from '../../services/saasService';
import { Organization, SubscriptionPlan } from '../../types';
import { StatCard, Card, CardHeader, CardTitle, Badge, Button, DataTable, Column } from '../../components/ui';
import {
  Building2,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
import { formatCurrency, formatDate } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';

export const SaasDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const s = await saasService.getStats();
      const o = await saasService.getOrganizations();
      setStats(s);
      setOrgs(o);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-slate-400">Loading SaaS Platform Telemetry...</div>;
  }

  const columns: Column<Organization>[] = [
    {
      header: 'Organization',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.logo} alt={row.name} className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-[11px] text-slate-400">{row.industry}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: (row) => (
        <span className="font-semibold text-xs text-blue-600 dark:text-blue-400">{row.plan}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'trial' ? 'warning' : 'danger'} dot>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Employees',
      cell: (row) => (
        <span className="font-medium">{row.totalEmployees} / {row.maxEmployees}</span>
      ),
    },
    {
      header: 'MRR',
      cell: (row) => (
        <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(row.monthlyFee)}/mo</span>
      ),
    },
    {
      header: 'Created On',
      accessorKey: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Good morning, Platform Admin ⚡
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening with your global HRM SaaS platform today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-slate-300">
            May 01 - May 31, 2024
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/saas/organizations')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organizations"
          value={stats.totalOrganizations}
          change="+12% vs last month"
          isPositive={true}
          icon={<Building2 className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Active Organizations"
          value={stats.activeOrganizations}
          change="+8% vs last month"
          isPositive={true}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Total Platform Users"
          value={stats.totalUsers.toLocaleString()}
          change="+15% active seats"
          isPositive={true}
          icon={<Users className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          change="+22% MRR Growth"
          isPositive={true}
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
        />
      </div>

      {/* Charts Section: Revenue Growth + Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Area Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Revenue Growth (MRR)</CardTitle>
              <p className="text-xs text-slate-500">Monthly recurring subscription volume</p>
            </div>
            <Badge variant="success">+22.4% Annualized</Badge>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subscription Distribution Donut Chart */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Plan Distribution</CardTitle>
              <p className="text-xs text-slate-500">By active tenant tiers</p>
            </div>
          </CardHeader>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.planDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">48</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Tenants</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {stats.planDistribution.map((plan: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                <span className="text-slate-600 dark:text-slate-400">{plan.name}</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">{plan.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Organizations + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Organizations Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Organizations</h3>
            <Link to="/saas/organizations" className="text-xs font-semibold text-blue-600 hover:underline">
              View All Organizations →
            </Link>
          </div>
          <DataTable
            columns={columns}
            data={orgs}
            searchKey="name"
            searchPlaceholder="Search tenant orgs..."
            pageSize={4}
          />
        </div>

        {/* System Health Status */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> System Health
            </CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {stats.systemHealth.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.service}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">{item.status}</span>
                  <span className="text-[10px] text-slate-400">{item.latency}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-dark-border text-center">
            <span className="text-[11px] text-slate-400 font-medium">Global CDN: 28 Edge Nodes Active</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
