import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Button, Badge } from '../../components/ui';

export const SaasRevenueAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  const mrrTrend = [
    { month: 'Dec', mrr: 98000, newMrr: 12000, expansion: 4000, churn: -1200 },
    { month: 'Jan', mrr: 107000, newMrr: 14000, expansion: 5000, churn: -1000 },
    { month: 'Feb', mrr: 114000, newMrr: 13000, expansion: 4500, churn: -800 },
    { month: 'Mar', mrr: 121000, newMrr: 15000, expansion: 6000, churn: -1100 },
    { month: 'Apr', mrr: 126500, newMrr: 14500, expansion: 5500, churn: -900 },
    { month: 'May', mrr: 128450, newMrr: 16000, expansion: 6800, churn: -1400 },
  ];

  const planRevenueBreakdown = [
    { name: 'Enterprise Tier', revenue: 81000, share: '63.0%', growth: '+18.4%' },
    { name: 'Business Pro', revenue: 32500, share: '25.3%', growth: '+12.1%' },
    { name: 'Starter Tier', revenue: 14950, share: '11.7%', growth: '+8.2%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Revenue Analytics & Financial Modeling
            </h1>
            <Badge variant="success">ARR: $1.54M</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            MRR expansion, Net Revenue Retention (NRR), customer lifetime value (LTV), and churn analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last 12 Months">Last 12 Months</option>
            <option value="Year to Date">Year to Date (2024)</option>
          </select>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1.5" />
            Export Financial Report
          </Button>
        </div>
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Current MRR</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">$128,450</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM growth
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Net Revenue Retention (NRR)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">114.8%</div>
          <span className="text-xs text-slate-400 mt-1">Expansion outpacing churn</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Revenue / Account (ARPA)</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">$2,676/mo</div>
          <span className="text-xs text-slate-400 mt-1">Across 48 tenant orgs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue Churn</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">1.2%</div>
          <span className="text-xs text-emerald-600 font-medium mt-1">Industry benchmark: 3.5%</span>
        </div>
      </div>

      {/* Main MRR Growth Area Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">MRR Growth Trajectory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly recurring income trajectory over time</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mrrTrend}>
              <defs>
                <linearGradient id="mrrRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'MRR']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={3} fill="url(#mrrRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown by Tier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planRevenueBreakdown.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
              <Badge variant="primary">{item.share}</Badge>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
              ${item.revenue.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>MoM Expansion:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SaasRevenueAnalyticsPage;
