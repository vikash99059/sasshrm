import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Users,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Clock,
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
} from 'recharts';
import { formatCurrency } from '../../utils';

export const ReportsPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRange, setSelectedRange] = useState('2024');

  const headcountGrowth = [
    { month: 'Jan', employees: 88 },
    { month: 'Feb', employees: 96 },
    { month: 'Mar', employees: 104 },
    { month: 'Apr', employees: 115 },
    { month: 'May', employees: 124 },
  ];

  const departmentDistribution = [
    { name: 'Engineering', count: 54, value: 44, color: '#3B82F6' },
    { name: 'Marketing', count: 22, value: 18, color: '#EC4899' },
    { name: 'Sales', count: 16, value: 13, color: '#F59E0B' },
    { name: 'Finance', count: 14, value: 11, color: '#10B981' },
    { name: 'Human Resources', count: 12, value: 10, color: '#8B5CF6' },
    { name: 'Operations', count: 6, value: 4, color: '#06B6D4' },
  ];

  const downloadableReports = [
    { title: 'Employee Master Registry', desc: 'Full profile records, departments, and bank details', format: 'CSV / Excel', size: '1.4 MB', icon: Users },
    { title: 'Attendance & Overtime Ledger', desc: 'Daily clock-in matrix, working hours, and late marks', format: 'Excel Sheet', size: '2.8 MB', icon: Clock },
    { title: 'Payroll Reconciliation Report', desc: 'Monthly gross, taxes, PF deductions, and net payouts', format: 'PDF / CSV', size: '3.1 MB', icon: DollarSign },
    { title: 'Quarterly Expense Audits', desc: 'Approved claims, project allocations, and receipts', format: 'CSV', size: '950 KB', icon: FileSpreadsheet },
  ];

  const handleExport = (type: 'pdf' | 'csv') => {
    alert(`Exporting high-resolution ${type.toUpperCase()} analytics report package...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Workforce Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time business intelligence, headcount growth curves, and downloadable audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} leftIcon={<Download className="h-4 w-4" />}>
            Export PDF
          </Button>
          <Button size="sm" onClick={() => handleExport('csv')} leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 dark:border-dark-border dark:bg-dark-card shadow-sm text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Filter Analytics:</span>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-dark-border dark:bg-dark-card"
        >
          <option value="2024">Year to Date (2024)</option>
          <option value="q1">Q1 2024</option>
          <option value="q2">Q2 2024</option>
          <option value="2023">Full Year 2023</option>
        </select>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-dark-border dark:bg-dark-card"
        >
          <option value="all">All Departments (124 Employees)</option>
          <option value="Engineering">Engineering (54)</option>
          <option value="Marketing">Marketing (22)</option>
          <option value="Finance">Finance (14)</option>
          <option value="Sales">Sales (16)</option>
        </select>
      </div>

      {/* Charts Row: Headcount Growth + Department Distribution (Matching Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Headcount Growth Trend */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Headcount Growth Trend</CardTitle>
              <p className="text-xs text-slate-500">Active full-time workforce expansion</p>
            </div>
            <Badge variant="success">+40.9% YTD Expansion</Badge>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountGrowth}>
                <defs>
                  <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [`${val} Members`, 'Active Headcount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="employees" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorEmp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution Donut */}
        <Card className="space-y-4 flex flex-col justify-between">
          <CardHeader>
            <div>
              <CardTitle>Department Headcount</CardTitle>
              <p className="text-xs text-slate-500">Share across business units</p>
            </div>
          </CardHeader>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">124</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-dark-border text-xs">
            {departmentDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Downloadable Ready Reports Package */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Scheduled Audit & Export Packages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {downloadableReports.map((report, idx) => {
            const Icon = report.icon;
            return (
              <Card key={idx} hoverEffect className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{report.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{report.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{report.size}</span>
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')} leftIcon={<Download className="h-3 w-3" />}>
                    Download
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
