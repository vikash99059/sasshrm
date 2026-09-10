import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  CreditCard,
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Download,
  Plus,
  ArrowRight,
  Clock,
  PieChart as PieIcon,
  ShieldCheck,
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

export const PayrollAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();

  const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);

  // Payroll KPIs
  const payrollKpis = [
    { title: 'Total Payroll', value: '$384,500', change: '+4.2%', isPositive: true, subtext: 'May 2024 Cycle', icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { title: 'Gross Salaries', value: '$420,000', change: '248 Employees', isPositive: true, subtext: 'Avg $1,693/emp', icon: CreditCard, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { title: 'Net Disbursed', value: '$346,500', change: '82.5% of Gross', isPositive: true, subtext: 'Direct Deposit', icon: CheckCircle2, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400' },
    { title: 'Total Deductions', value: '$73,500', change: 'Taxes & Benefits', isNeutral: true, subtext: '17.5% Tax Rate', icon: TrendingUp, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { title: 'Processed Batches', value: '224 / 248', change: '90.3% Ready', isPositive: true, subtext: 'May Regular Batch', icon: FileSpreadsheet, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
    { title: 'Pending Issues', value: '2', change: 'Needs Action', isNeutral: true, subtext: 'Missing Bank Info', icon: AlertCircle, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' },
  ];

  // Payroll 6-Month Trend
  const payrollTrend = [
    { month: 'Dec', total: 340, net: 280, tax: 60 },
    { month: 'Jan', total: 355, net: 292, tax: 63 },
    { month: 'Feb', total: 362, net: 298, tax: 64 },
    { month: 'Mar', total: 370, net: 305, tax: 65 },
    { month: 'Apr', total: 378, net: 312, tax: 66 },
    { month: 'May', total: 385, net: 318, tax: 67 },
  ];

  // Department Payroll Breakdown
  const deptPayroll = [
    { name: 'Engineering', amount: 165000, percentage: '43%', color: '#3B82F6' },
    { name: 'Sales', amount: 95000, percentage: '25%', color: '#10B981' },
    { name: 'Marketing', amount: 62000, percentage: '16%', color: '#6366F1' },
    { name: 'Operations', amount: 38500, percentage: '10%', color: '#F59E0B' },
    { name: 'HR', amount: 24000, percentage: '6%', color: '#EC4899' },
  ];

  // Deduction Breakdown
  const deductionBreakdown = [
    { name: 'Federal & State Tax', value: 58, color: '#3B82F6' },
    { name: 'Health Insurance', value: 24, color: '#10B981' },
    { name: '401(k) Retirement', value: 12, color: '#F59E0B' },
    { name: 'Other Deductions', value: 6, color: '#8B5CF6' },
  ];

  // Pending Payroll Anomalies
  const pendingIssues = [
    { employee: 'Michael Taylor', issue: 'Missing Routing Number for direct deposit', department: 'Sales', severity: 'High' },
    { employee: 'Liam Garcia', issue: 'Overtime hours verification pending manager sign-off', department: 'Finance', severity: 'Medium' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER: Payroll Admin Greeting & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Finance & Payroll</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Payroll Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Payroll Workspace <span className="text-2xl">💰</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            May 2024 Payroll Batch • Scheduled Payday: May 31, 2024
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRunPayrollOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
          >
            <DollarSign className="h-4 w-4" />
            <span>Process Payroll Batch</span>
          </button>
          <button
            onClick={() => navigate('/payroll/payslips')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-dark-card dark:text-slate-200"
          >
            <span>All Payslips</span>
          </button>
        </div>
      </div>

      {/* 6 PAYROLL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {payrollKpis.map((kpi, idx) => {
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

      {/* CHARTS ROW: PAYROLL TREND + DEDUCTION BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Payroll Trend Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Payroll Expenditure ($k)</h2>
              <p className="text-[11px] text-slate-400">Total payroll vs Net disbursed across last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Gross Total</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Net Disbursed</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, 450]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} name="Gross Payroll ($k)" />
                <Bar dataKey="net" fill="#10B981" radius={[4, 4, 0, 0]} barSize={18} name="Net Salary ($k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deductions Breakdown Donut */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tax & Benefit Deductions</h2>
            <span className="text-[10px] font-bold text-slate-400">$73,500 Total</span>
          </div>

          <div className="flex items-center justify-between gap-3 my-auto">
            <div className="relative h-40 w-40 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deductionBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                    {deductionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#fff', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-lg font-black text-slate-900 dark:text-white">17.5%</span>
                <span className="block text-[8px] uppercase font-bold text-slate-400">Avg Tax</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {deductionBreakdown.map((s, idx) => (
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

      {/* DEPARTMENT PAYROLL TABLE & PENDING ISSUES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Department Payroll Breakdown */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Department Payroll Allocation</h3>
            <span className="text-[10px] font-bold text-blue-600">5 Departments</span>
          </div>

          <div className="space-y-3">
            {deptPayroll.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{d.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">${d.amount.toLocaleString()} ({d.percentage})</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: d.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Issues */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Pending Payroll Action Items</h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full dark:bg-rose-950/40 dark:text-rose-300">2 Items</span>
          </div>

          <div className="space-y-3">
            {pendingIssues.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{item.employee}</span>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded dark:bg-rose-950/40 dark:text-rose-300">{item.severity}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{item.issue}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Dept: {item.department}</span>
                  <button className="font-bold text-blue-600 hover:text-blue-700">Resolve →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RUN PAYROLL MODAL */}
      <Modal isOpen={isRunPayrollOpen} onClose={() => setIsRunPayrollOpen(false)} title="Execute Monthly Payroll Batch" size="md">
        <form onSubmit={(e) => { e.preventDefault(); alert('Payroll batch executed successfully! Payslips generated.'); setIsRunPayrollOpen(false); }} className="space-y-4">
          <Select label="Payroll Batch" options={[{ value: 'may-regular', label: 'May 2024 Regular Cycle (248 Employees)' }, { value: 'may-bonus', label: 'May 2024 Performance Bonus Batch' }]} />
          <Input label="Disbursement Date" type="date" required defaultValue="2024-05-31" />
          <Input label="Authorized Officer" defaultValue="Elena Rostova (Chief Payroll Officer)" readOnly />
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
            <strong>Total Amount:</strong> $346,500 Net to be disbursed across 248 bank accounts.
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsRunPayrollOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm & Process Batch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
