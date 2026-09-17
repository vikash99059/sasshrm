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
  FileText,
  Building2,
  Receipt,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
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
import { Modal, Input, Select, Button, Badge, Card, StatCard } from '../../../components/ui';
import { DashboardHeroBanner } from '../../../components/common/DashboardHeroBanner';
import { formatCurrency } from '../../../utils';

export const PayrollAdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
  const [batchStep, setBatchStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // 6 Primary Executive Finance & Payroll KPIs
  const financeKpis = [
    { title: 'Gross Revenue (YTD)', value: '₹2,18,90,000', change: '+18.4% YoY', isPositive: true, subtext: 'SaaS & Consulting', icon: TrendingUp, iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { title: 'Monthly Payroll Run', value: '₹34,65,000', change: '248 Employees', isPositive: true, subtext: 'May 2024 Cycle', icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { title: 'Accounts Receivable', value: '₹34,20,000', change: '4 Invoices Due', isNeutral: true, subtext: 'Avg DSO: 24 Days', icon: FileText, iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { title: 'Accounts Payable', value: '₹16,80,000', change: '6 Bills Pending', isNeutral: true, subtext: 'AWS, WeWork, Dell', icon: Receipt, iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' },
    { title: 'Net Profit Margin', value: '28.5%', change: '+4.2% QoQ', isPositive: true, subtext: 'PAT: ₹62.4L', icon: ShieldCheck, iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400' },
    { title: 'Compliance Health', value: '98%', change: 'All Returns Current', isPositive: true, subtext: 'PF, ESI, TDS, GST', icon: CheckCircle2, iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
  ];

  // 6-Month Cash Flow vs Outlay Trend
  const cashFlowTrend = [
    { month: 'Dec', revenue: 1650, payroll: 320, opex: 800, net: 530 },
    { month: 'Jan', revenue: 1720, payroll: 325, opex: 855, net: 540 },
    { month: 'Feb', revenue: 1810, payroll: 330, opex: 890, net: 590 },
    { month: 'Mar', revenue: 1950, payroll: 338, opex: 942, net: 670 },
    { month: 'Apr', revenue: 2050, payroll: 342, opex: 998, net: 710 },
    { month: 'May', revenue: 2190, payroll: 346, opex: 1074, net: 770 },
  ];

  // Department Payroll Allocation
  const deptPayroll = [
    { name: 'Engineering & Product', amount: 1650000, percentage: '48%', color: '#3B82F6' },
    { name: 'Sales & Growth', amount: 820000, percentage: '24%', color: '#10B981' },
    { name: 'Marketing & Design', amount: 450000, percentage: '13%', color: '#6366F1' },
    { name: 'Operations & HR', amount: 345000, percentage: '10%', color: '#F59E0B' },
    { name: 'Support & Admin', amount: 200000, percentage: '5%', color: '#EC4899' },
  ];

  // Statutory Health Items
  const statutoryDeadlines = [
    { title: 'EPF ECR Filing & Challan (May)', dueDate: '15th June 2024', status: 'Pending Approval', daysLeft: 7, priority: 'High' },
    { title: 'ESIC Monthly Return & Payment', dueDate: '15th June 2024', status: 'Generated', daysLeft: 7, priority: 'High' },
    { title: 'GSTR-3B Tax Return & Payment', dueDate: '20th June 2024', status: 'Draft Ready', daysLeft: 12, priority: 'Medium' },
    { title: 'TDS Salary Deposit (Sec 192)', dueDate: '07th June 2024', status: 'Paid & Reconciled', daysLeft: 0, priority: 'High' },
  ];

  const handleSimulateBatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBatchStep(3);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TOP HERO BANNER WITH QUICK ACTION BUTTONS */}
      <DashboardHeroBanner
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBatchStep(1);
                setIsRunPayrollOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white px-3 py-1.5 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Process Payroll Batch</span>
            </button>
            <button
              onClick={() => navigate('/finance/invoices')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>New Invoice</span>
            </button>
            <button
              onClick={() => navigate('/finance/statements')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>P&L Statement</span>
            </button>
          </div>
        }
      />

      {/* 6 EXECUTIVE FINANCE & PAYROLL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {financeKpis.map((kpi, idx) => {
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
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{kpi.value}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <span className="text-slate-400 truncate">{kpi.subtext}</span>
                <span className={`font-bold px-1.5 py-0.5 rounded-md ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS ROW: CASH FLOW TREND + DEPARTMENT ALLOCATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue & Operating Outlay Trajectory */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cash Flow & Financial Velocity (₹k)</h2>
              <p className="text-[11px] text-slate-400">Monthly gross revenues vs payroll disbursals and net surplus</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Gross Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Net Profit</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Payroll Outlay</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#colorGross)" name="Gross Revenue" />
                <Area type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} fill="url(#colorNet)" name="Net Profit" />
                <Bar dataKey="payroll" fill="#F59E0B" name="Payroll Outlay" barSize={14} radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Payroll Breakdown */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Department Payroll Split</h2>
            <p className="text-[11px] text-slate-400">Total monthly compensation by vertical</p>
          </div>

          <div className="space-y-2.5 my-3">
            {deptPayroll.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: item.percentage, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Monthly Cost:</span>
            <span className="font-black text-slate-900 dark:text-white">₹34,65,000</span>
          </div>
        </div>
      </div>

      {/* LOWER ROW: STATUTORY CALENDAR & QUICK MODULE ACCESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Statutory Compliance Health Watchdog */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Returns & Compliance Calendar</h2>
              <p className="text-[11px] text-slate-400">EPFO, ESIC, State PT, and TDS filing tracker</p>
            </div>
            <button
              onClick={() => navigate('/payroll/compliance')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              All Filings <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {statutoryDeadlines.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[10px] text-slate-400">Due: {item.dueDate}</p>
                </div>
                <Badge variant={item.status.includes('Paid') ? 'success' : item.status.includes('Generated') ? 'primary' : 'warning'} size="sm">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Lifecycle Shortcuts */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Finance & Payroll Modules</h2>
            <p className="text-[11px] text-slate-400">Instant navigation to core financial workflows</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => navigate('/finance/chart-of-accounts')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <Layers className="h-5 w-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Chart of Accounts</p>
              <p className="text-[10px] text-slate-400">General Ledger</p>
            </button>

            <button
              onClick={() => navigate('/finance/invoices')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <FileText className="h-5 w-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Receivables</p>
              <p className="text-[10px] text-slate-400">Invoices & Collections</p>
            </button>

            <button
              onClick={() => navigate('/finance/bills')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-amber-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <Receipt className="h-5 w-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Payables</p>
              <p className="text-[10px] text-slate-400">Vendor Bills & POs</p>
            </button>

            <button
              onClick={() => navigate('/finance/reconciliation')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-teal-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <Building2 className="h-5 w-5 text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Bank Reconciliation</p>
              <p className="text-[10px] text-slate-400">Auto-Matcher</p>
            </button>

            <button
              onClick={() => navigate('/payroll/loans')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-purple-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <CreditCard className="h-5 w-5 text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">Loans & Advances</p>
              <p className="text-[10px] text-slate-400">EMI Schedules</p>
            </button>

            <button
              onClick={() => navigate('/finance/gst')}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900/60 text-left transition-all hover:shadow-xs group cursor-pointer"
            >
              <FileSpreadsheet className="h-5 w-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900 dark:text-white">GST & Taxes</p>
              <p className="text-[10px] text-slate-400">GSTR-1 / 3B</p>
            </button>
          </div>
        </div>
      </div>

      {/* PROCESS BATCH PAYROLL MODAL STEPPER */}
      <Modal
        isOpen={isRunPayrollOpen}
        onClose={() => setIsRunPayrollOpen(false)}
        title="Execute Automated Payroll Batch Run"
        description="Verify attendance sync, variable pay adjustments, statutory taxes, and direct bank disbursals."
        size="lg"
      >
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 text-center text-xs">
            <div className={`p-2 rounded-lg font-bold ${batchStep >= 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-400'}`}>
              1. Attendance & LOP Sync
            </div>
            <div className={`p-2 rounded-lg font-bold ${batchStep >= 2 ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-400'}`}>
              2. Adjustments & Deductions
            </div>
            <div className={`p-2 rounded-lg font-bold ${batchStep >= 3 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-400'}`}>
              3. Bank Disbursal File
            </div>
          </div>

          {batchStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Active Employees:</span>
                  <span className="font-bold text-slate-900 dark:text-white">248 Employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unpaid Leave (LOP Days):</span>
                  <span className="font-bold text-amber-600">14 Days Across Org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Overtime Hours:</span>
                  <span className="font-bold text-emerald-600">82 Hours</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsRunPayrollOpen(false)}>Cancel</Button>
                <Button onClick={() => setBatchStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Next: Review Deductions
                </Button>
              </div>
            </div>
          )}

          {batchStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Salaries Total:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹42,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Provident Fund (EPF 12%):</span>
                  <span className="font-bold text-rose-600">-₹4,46,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Income Tax (TDS Sec 192):</span>
                  <span className="font-bold text-rose-600">-₹2,38,600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Professional Tax (PT):</span>
                  <span className="font-bold text-rose-600">-₹49,600</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-emerald-600 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Net Disbursable Amount:</span>
                  <span>₹34,65,400</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setBatchStep(1)}>Back</Button>
                <Button
                  onClick={handleSimulateBatch}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Executing Calculations...' : 'Execute Disbursal Run'}
                </Button>
              </div>
            </div>
          )}

          {batchStep === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Batch Payroll Executed Successfully</h3>
                <p className="text-xs text-slate-400 mt-1">248 Payslips generated & Direct Deposit NACH/NEFT file compiled.</p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={() => alert('Downloading Bank NACH / NEFT batch disbursement text file...')}
                >
                  Download Bank NEFT File
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={() => {
                    setIsRunPayrollOpen(false);
                    navigate('/payroll/payslips');
                  }}
                >
                  View All Payslips
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
