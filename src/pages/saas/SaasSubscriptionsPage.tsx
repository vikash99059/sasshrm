import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Download,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface SubscriptionItem {
  id: string;
  tenantName: string;
  domain: string;
  plan: 'Enterprise' | 'Business Pro' | 'Starter' | 'Trial';
  status: 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
  billingCycle: 'Monthly' | 'Annual';
  amount: number;
  seatsUsed: number;
  seatsAllocated: number;
  startDate: string;
  nextRenewal: string;
  autoRenew: boolean;
}

export const SaasSubscriptionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
    { id: 'SUB-1001', tenantName: 'Apex Global Corp', domain: 'apex.saas-hrm.com', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', amount: 4800, seatsUsed: 480, seatsAllocated: 500, startDate: 'Nov 14, 2023', nextRenewal: 'Nov 14, 2026', autoRenew: true },
    { id: 'SUB-1002', tenantName: 'Nexlify Technologies', domain: 'nexlify.saas-hrm.com', plan: 'Enterprise', status: 'Active', billingCycle: 'Monthly', amount: 3400, seatsUsed: 340, seatsAllocated: 400, startDate: 'Dec 01, 2023', nextRenewal: 'Jun 01, 2024', autoRenew: true },
    { id: 'SUB-1003', tenantName: 'HyperFlow Logistics', domain: 'hyperflow.saas-hrm.com', plan: 'Business Pro', status: 'Active', billingCycle: 'Annual', amount: 1850, seatsUsed: 185, seatsAllocated: 200, startDate: 'Oct 22, 2023', nextRenewal: 'Oct 22, 2026', autoRenew: true },
    { id: 'SUB-1004', tenantName: 'Aether Cloud Labs', domain: 'aether.saas-hrm.com', plan: 'Business Pro', status: 'Active', billingCycle: 'Monthly', amount: 1200, seatsUsed: 120, seatsAllocated: 150, startDate: 'Jan 10, 2024', nextRenewal: 'Jun 10, 2024', autoRenew: true },
    { id: 'SUB-1005', tenantName: 'Zenith BioPharm', domain: 'zenith.saas-hrm.com', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', amount: 6500, seatsUsed: 650, seatsAllocated: 750, startDate: 'Sep 30, 2023', nextRenewal: 'Sep 30, 2026', autoRenew: true },
    { id: 'SUB-1006', tenantName: 'Veritas Fintech', domain: 'veritas.saas-hrm.com', plan: 'Starter', status: 'Active', billingCycle: 'Monthly', amount: 450, seatsUsed: 45, seatsAllocated: 50, startDate: 'Aug 18, 2023', nextRenewal: 'Jun 18, 2024', autoRenew: true },
    { id: 'SUB-1007', tenantName: 'Starlight Media', domain: 'starlight.saas-hrm.com', plan: 'Trial', status: 'Trial', billingCycle: 'Monthly', amount: 0, seatsUsed: 28, seatsAllocated: 50, startDate: 'May 10, 2024', nextRenewal: 'May 24, 2024 (Expiring)', autoRenew: false },
    { id: 'SUB-1008', tenantName: 'OmniVanguard Logistics', domain: 'omni.saas-hrm.com', plan: 'Enterprise', status: 'Past Due', billingCycle: 'Monthly', amount: 2900, seatsUsed: 290, seatsAllocated: 300, startDate: 'Feb 15, 2024', nextRenewal: 'Past Due (Grace)', autoRenew: false },
  ]);

  const toggleAutoRenew = (id: string) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, autoRenew: !s.autoRenew } : s));
  };

  const filtered = subscriptions.filter(s => {
    const matchSearch = s.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || s.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchPlan = planFilter === 'ALL' || s.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const activePaidMRR = subscriptions.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Customer Subscriptions
            </h1>
            <Badge variant="primary">{subscriptions.length} Organizations</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage active tenant contracts, seat usage quotas, renewal calendars, and automated billing terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1.5" />
            Export Subscriptions
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Subscriptions MRR</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">${activePaidMRR.toLocaleString()}/mo</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+14.2% MoM growth</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Paid Tenants</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {subscriptions.filter(s => s.status === 'Active').length} Orgs
          </div>
          <span className="text-xs text-slate-400">92% Retention Rate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Trials</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
            {subscriptions.filter(s => s.status === 'Trial').length} Tenants
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Conversion pipeline</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Past Due / Grace</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {subscriptions.filter(s => s.status === 'Past Due').length} Tenant
          </div>
          <span className="text-xs text-rose-500 font-medium">Automated dunning email sent</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenant or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Plans</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Business Pro">Business Pro</option>
            <option value="Starter">Starter</option>
            <option value="Trial">Trial</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Past Due">Past Due</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Tenant Organization</th>
                <th className="py-3.5 px-4">Plan & Tier</th>
                <th className="py-3.5 px-4">Subscription Status</th>
                <th className="py-3.5 px-4">MRR / Amount</th>
                <th className="py-3.5 px-4">Seats Consumption</th>
                <th className="py-3.5 px-4">Renewal Date</th>
                <th className="py-3.5 px-4">Auto-Renew</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                        {sub.tenantName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{sub.tenantName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{sub.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={sub.plan === 'Enterprise' ? 'primary' : sub.plan === 'Business Pro' ? 'info' : sub.plan === 'Starter' ? 'warning' : 'neutral'}>
                      {sub.plan} ({sub.billingCycle})
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      sub.status === 'Trial' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        sub.status === 'Active' ? 'bg-emerald-500' :
                        sub.status === 'Trial' ? 'bg-purple-500' : 'bg-rose-500'
                      }`} />
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    {sub.amount > 0 ? `$${sub.amount.toLocaleString()}/mo` : 'Free Trial'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${(sub.seatsUsed / sub.seatsAllocated) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {sub.seatsUsed}/{sub.seatsAllocated}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-xs">
                    {sub.nextRenewal}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleAutoRenew(sub.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        sub.autoRenew
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {sub.autoRenew ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SaasSubscriptionsPage;
