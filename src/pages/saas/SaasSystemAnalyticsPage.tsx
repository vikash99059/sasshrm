import React from 'react';
import {
  Server,
  Database,
  Activity,
  ShieldCheck,
  Cpu,
  HardDrive,
  Globe,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Badge, Button } from '../../components/ui';

export const SaasSystemAnalyticsPage: React.FC = () => {
  const latencyTrend = [
    { time: '10:00', latency: 42, rps: 1800 },
    { time: '11:00', latency: 38, rps: 2100 },
    { time: '12:00', latency: 45, rps: 2450 },
    { time: '13:00', latency: 40, rps: 2300 },
    { time: '14:00', latency: 36, rps: 2200 },
    { time: '15:00', latency: 38, rps: 2400 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Telemetry & Platform Health
            </h1>
            <Badge variant="success">All Systems Operational</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time server cluster monitoring, database I/O performance, Kubernetes node status, and API traffic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            <Radio className="h-4 w-4 mr-1.5 text-emerald-500 animate-pulse" />
            Live Telemetry (1s)
          </Button>
        </div>
      </div>

      {/* Cluster KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Platform Uptime</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">99.98%</div>
          <span className="text-xs text-slate-400">Last 90 days SLA</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">p95 API Latency</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">38 ms</div>
          <span className="text-xs text-slate-400">Target &lt; 80ms</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Requests</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">2,400 RPS</div>
          <span className="text-xs text-slate-400">Peak: 4,800 RPS</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Cluster Error Rate</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">0.001%</div>
          <span className="text-xs text-emerald-600 font-medium">SOC2 Certified</span>
        </div>
      </div>

      {/* Latency & Throughput Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">API Latency & Traffic Throughput</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Response time (ms) vs Requests Per Second</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={latencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} name="Latency (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Kubernetes Cluster (8 Nodes)</h3>
            </div>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Avg CPU Load</span>
              <span className="font-bold text-slate-900 dark:text-white">28.4%</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Memory Allocation</span>
              <span className="font-bold text-slate-900 dark:text-white">42.1 GB / 96 GB</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">PostgreSQL Multi-Tenant DB</h3>
            </div>
            <Badge variant="success">Primary + 2 Replicas</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Active Pool Connections</span>
              <span className="font-bold text-slate-900 dark:text-white">124 / 500</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Replication Lag</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">0.4 ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cloudflare CDN & Edge</h3>
            </div>
            <Badge variant="success">Global Edge Up</Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Cache Hit Ratio</span>
              <span className="font-bold text-slate-900 dark:text-white">94.8%</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>DDoS Mitigation</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">0 Threats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SaasSystemAnalyticsPage;
