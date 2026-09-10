import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  Server,
  Activity,
  Plus,
  ArrowRight,
  Download,
  AlertTriangle,
  Globe,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  BarChart3,
  CreditCard
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
  Tooltip
} from 'recharts';
import { Modal, Input, Select, Button, Badge } from '../../../components/ui';

export const SaasOwnerDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('ALL');

  // SaaS KPIs
  const saasKpis = [
    { title: 'Monthly Recurring (MRR)', value: '$128,450', change: '+14.2% MoM', isPositive: true, subtext: 'Annualized: $1.54M ARR', icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { title: 'Total Organizations', value: '48', change: '+5 this month', isPositive: true, subtext: '42 Paid · 6 In Trial', icon: Building2, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { title: 'Active Platform Users', value: '12,840', change: '+8.6% growth', isPositive: true, subtext: 'Across 48 Tenants', icon: Users, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { title: 'Platform Churn Rate', value: '1.2%', change: '-0.4% improvement', isPositive: true, subtext: 'Industry benchmark: 3.5%', icon: TrendingUp, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400' },
    { title: 'Platform Uptime', value: '99.98%', change: 'All systems operational', isPositive: true, subtext: 'Avg latency: 42ms', icon: Server, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
    { title: 'Pending Upgrades', value: '7', change: 'Pipeline potential: $14k', isNeutral: true, subtext: 'Trial to Enterprise', icon: CreditCard, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' },
  ];

  // Revenue trend (6 months)
  const revenueTrend = [
    { month: 'Dec', enterprise: 58000, business: 28000, starter: 12000, total: 98000 },
    { month: 'Jan', enterprise: 64000, business: 30000, starter: 13000, total: 107000 },
    { month: 'Feb', enterprise: 69000, business: 31500, starter: 13500, total: 114000 },
    { month: 'Mar', enterprise: 74000, business: 33000, starter: 14000, total: 121000 },
    { month: 'Apr', enterprise: 78000, business: 34000, starter: 14500, total: 126500 },
    { month: 'May', enterprise: 81000, business: 32500, starter: 14950, total: 128450 },
  ];

  // Plan distribution
  const planBreakdown = [
    { name: 'Enterprise Plan', count: 18, mrr: 81000, color: '#3b82f6' },
    { name: 'Business Pro', count: 16, mrr: 32500, color: '#10b981' },
    { name: 'Starter Tier', count: 8, mrr: 14950, color: '#f59e0b' },
    { name: 'Trial (14-Day)', count: 6, mrr: 0, color: '#8b5cf6' },
  ];

  // Tenant Organizations List
  const tenantOrgs = [
    { id: 'TNT-001', name: 'Apex Global Corp', domain: 'apex.saas-hrm.com', plan: 'Enterprise', status: 'Active', users: 480, maxUsers: 500, mrr: '$4,800/mo', renewal: 'Nov 14, 2026', owner: 'Robert Langdon' },
    { id: 'TNT-002', name: 'Nexlify Technologies', domain: 'nexlify.saas-hrm.com', plan: 'Enterprise', status: 'Active', users: 340, maxUsers: 400, mrr: '$3,400/mo', renewal: 'Dec 01, 2026', owner: 'Sophia Chen' },
    { id: 'TNT-003', name: 'HyperFlow Logistics', domain: 'hyperflow.saas-hrm.com', plan: 'Business Pro', status: 'Active', users: 185, maxUsers: 200, mrr: '$1,850/mo', renewal: 'Oct 22, 2026', owner: 'Marcus Vance' },
    { id: 'TNT-004', name: 'Aether Cloud Labs', domain: 'aether.saas-hrm.com', plan: 'Business Pro', status: 'Active', users: 120, maxUsers: 150, mrr: '$1,200/mo', renewal: 'Jan 10, 2027', owner: 'Elena Rostova' },
    { id: 'TNT-005', name: 'Zenith BioPharm', domain: 'zenith.saas-hrm.com', plan: 'Enterprise', status: 'Active', users: 650, maxUsers: 750, mrr: '$6,500/mo', renewal: 'Sep 30, 2026', owner: 'Dr. Arthur Sterling' },
    { id: 'TNT-006', name: 'Veritas Fintech', domain: 'veritas.saas-hrm.com', plan: 'Starter', status: 'Active', users: 45, maxUsers: 50, mrr: '$450/mo', renewal: 'Aug 18, 2026', owner: 'Chloe Davis' },
    { id: 'TNT-007', name: 'Starlight Media', domain: 'starlight.saas-hrm.com', plan: 'Trial', status: 'Trial', users: 28, maxUsers: 50, mrr: '$0 (Trial)', renewal: 'Exp in 5 days', owner: 'Jordan Blake' },
    { id: 'TNT-008', name: 'OmniVanguard Logistics', domain: 'omni.saas-hrm.com', plan: 'Enterprise', status: 'Past Due', users: 290, maxUsers: 300, mrr: '$2,900/mo', renewal: 'Expired (Grace)', owner: 'Victor Vance' },
  ];

  const filteredTenants = tenantOrgs.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'ALL' || tenant.plan.toUpperCase().includes(planFilter);
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-400/30">
            <Globe className="w-3.5 h-3.5" /> Multi-Tenant Platform Master
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">SaaS Platform Headquarters</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Global monitoring for 48 active tenant organizations, subscription tier analytics, recurring billing, and infrastructure telemetry.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Platform Analytics
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 font-semibold"
            onClick={() => setIsAddTenantOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Provision Tenant Org
          </Button>
        </div>
      </div>

      {/* SaaS Platform KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {saasKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                  {kpi.change}
                </span>
                <span className="text-slate-400 dark:text-slate-500 truncate max-w-[110px]" title={kpi.subtext}>{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Row: Revenue Trend Chart & Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recurring Revenue Trend (MRR)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly subscription income by tier</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">Enterprise</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">Business</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">Starter</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="busGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'MRR']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="enterprise" stackId="1" stroke="#3b82f6" fill="url(#entGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="business" stackId="1" stroke="#10b981" fill="url(#busGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="starter" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Tier Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tier Breakdown</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">48 total organizations</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planBreakdown}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {planBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val} Orgs`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {planBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{item.count} orgs</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.mrr ? `$${(item.mrr / 1000).toFixed(1)}k` : 'Trial'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Tenant Organization Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tenant Organizations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live provisioning, subscription status and seat consumption</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="ENTERPRISE">Enterprise</option>
              <option value="BUSINESS">Business</option>
              <option value="STARTER">Starter</option>
              <option value="TRIAL">Trial</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Tenant Name</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Active Seats</th>
                <th className="py-3.5 px-4">MRR</th>
                <th className="py-3.5 px-4">Renewal / Expiry</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{tenant.name}</div>
                        <div className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                          {tenant.domain}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={tenant.plan === 'Enterprise' ? 'primary' : tenant.plan === 'Business Pro' ? 'info' : tenant.plan === 'Starter' ? 'warning' : 'neutral'}>
                      {tenant.plan}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      tenant.status === 'Trial' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tenant.status === 'Active' ? 'bg-emerald-500' :
                        tenant.status === 'Trial' ? 'bg-purple-500' : 'bg-rose-500'
                      }`} />
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${(tenant.users / tenant.maxUsers) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {tenant.users}/{tenant.maxUsers}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    {tenant.mrr}
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                    {tenant.renewal}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Health & Infrastructure Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Database Cluster</h3>
            </div>
            <Badge variant="success">Healthy</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">PostgreSQL 16 Primary + 2 Read Replicas</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>CPU Utilization</span>
              <span className="font-semibold text-slate-900 dark:text-white">24.5%</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Storage Used</span>
              <span className="font-semibold text-slate-900 dark:text-white">342 GB / 2 TB</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Application Nodes</h3>
            </div>
            <Badge variant="success">8 Nodes Up</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Kubernetes Cluster (us-east-1 & eu-central-1)</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Avg Latency (p95)</span>
              <span className="font-semibold text-slate-900 dark:text-white">42ms</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Error Rate</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">0.002%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Security & Compliance</h3>
            </div>
            <Badge variant="info">SOC2 Type II</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Automated threat detection active</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Failed Logins (24h)</span>
              <span className="font-semibold text-slate-900 dark:text-white">12 (Blocked)</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>SSL / Cert Expiry</span>
              <span className="font-semibold text-slate-900 dark:text-white">284 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tenant Modal */}
      <Modal
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        title="Provision New Tenant Organization"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsAddTenantOpen(false); }} className="space-y-4">
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
