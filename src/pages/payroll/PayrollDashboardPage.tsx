import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord } from '../../types';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  DataTable,
  Column,
  Modal,
} from '../../components/ui';
import {
  DollarSign,
  CreditCard,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
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
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils';

export const PayrollDashboardPage: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPayroll = async () => {
    const [recs, sum] = await Promise.all([
      payrollService.getRecords(),
      payrollService.getPayrollSummary(),
    ]);
    setRecords(recs);
    setSummary(sum);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  const handleProcessBatch = async () => {
    setIsProcessing(true);
    await payrollService.processBatchPayroll('May 2024');
    setTimeout(() => {
      setIsProcessing(false);
      setBatchSuccess(true);
      loadPayroll();
    }, 1000);
  };

  const columns: Column<PayrollRecord>[] = [
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.employeeAvatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.department} • {row.employeeCode}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Gross Salary',
      accessorKey: 'grossSalary',
      cell: (row) => <span className="text-xs font-semibold">{formatCurrency(row.grossSalary)}</span>,
      sortable: true,
    },
    {
      header: 'Deductions & Tax',
      accessorKey: 'totalDeductions',
      cell: (row) => (
        <span className="text-xs font-semibold text-rose-600">-{formatCurrency(row.totalDeductions)}</span>
      ),
      sortable: true,
    },
    {
      header: 'Net Take-Home',
      accessorKey: 'netSalary',
      cell: (row) => (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.netSalary)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Payment Method',
      accessorKey: 'paymentMethod',
      cell: (row) => <span className="text-xs text-slate-500">{row.paymentMethod}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : 'warning'} size="sm" dot>
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedPayslip(row)}
          leftIcon={<FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />}
        >
          View Payslip
        </Button>
      ),
    },
  ];

  if (isLoading || !summary) {
    return <div className="p-8 text-center text-slate-400">Loading Payroll Engine...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payroll & Compensation Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated salary calculations, statutory tax withholdings, and payslip distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-slate-300">
            May 2024 Cycle
          </div>
          <Button
            size="sm"
            onClick={handleProcessBatch}
            isLoading={isProcessing}
            leftIcon={<CreditCard className="h-4 w-4" />}
          >
            Process Batch Payroll
          </Button>
        </div>
      </div>

      {batchSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between dark:bg-emerald-950/40 dark:border-emerald-800 animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Successfully executed batch payroll reconciliation for 124 employees. Direct deposit batch sent.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setBatchSuccess(false)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Cards Row (Matching Reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monthly Payroll"
          value={formatCurrency(summary.totalPayroll)}
          change="+4% vs last cycle"
          isPositive={true}
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Net Salaries Disbursed"
          value={formatCurrency(summary.netSalary)}
          change="100% processed"
          isPositive={true}
          icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Taxes & Deductions"
          value={formatCurrency(summary.totalDeductions)}
          change="PF + TDS + Insurance"
          isPositive={true}
          icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
        />
        <StatCard
          title="Employees Processed"
          value={`${summary.processedEmployees} / 124`}
          change="0 pending"
          isPositive={true}
          icon={<Users className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
      </div>

      {/* Charts Row: Payroll Trend Bar Chart + Salary Components Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Trend Bar Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Payroll Expenditure Trend</CardTitle>
              <p className="text-xs text-slate-500">6-month salary disbursement trend</p>
            </div>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthlyTrend} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Total Payroll']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Salary Components Donut Chart */}
        <Card className="space-y-4 flex flex-col justify-between">
          <CardHeader>
            <div>
              <CardTitle>Salary Components</CardTitle>
              <p className="text-xs text-slate-500">Breakdown of total expenditure</p>
            </div>
          </CardHeader>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.salaryComponents}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {summary.salaryComponents.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val)), 'Component']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white">$248k</span>
              <span className="text-[10px] text-slate-400 uppercase">Total</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-dark-border text-xs">
            {summary.salaryComponents.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payroll Records Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">May 2024 Employee Payroll Disbursed</h3>
        <DataTable
          columns={columns}
          data={records}
          searchKey="employeeName"
          searchPlaceholder="Search payslips..."
          pageSize={5}
          exportFileName="may_2024_payroll.csv"
        />
      </div>

      {/* Interactive Printable Payslip Viewer Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip — ${selectedPayslip.employeeName}`}
          description={`Salary Slip for ${selectedPayslip.month}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
                Print Payslip
              </Button>
              <Button size="sm" onClick={() => setSelectedPayslip(null)} leftIcon={<Download className="h-4 w-4" />}>
                Download PDF
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-2">
            {/* Payslip Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-dark-border">
              <div>
                <h3 className="text-lg font-bold text-blue-600">Acme Corporation Inc.</h3>
                <p className="text-slate-400">450 Mission Street, San Francisco, CA 94105</p>
                <p className="text-slate-400 font-mono mt-1">PAYSLIP NO: PSL-202405-{selectedPayslip.employeeCode}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedPayslip.month}</span>
                <Badge variant="success" size="sm" className="mt-1 block">PAID</Badge>
              </div>
            </div>

            {/* Employee Meta Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <span className="text-slate-400 block">Employee Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPayslip.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Employee Code</span>
                <span className="font-bold font-mono">{selectedPayslip.employeeCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department</span>
                <span className="font-bold">{selectedPayslip.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Designation</span>
                <span className="font-bold">{selectedPayslip.designation}</span>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-6">
              {/* Earnings */}
              <div className="space-y-2 border border-slate-200 dark:border-dark-border rounded-xl p-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-dark-border">
                  Earnings
                </h4>
                <div className="flex justify-between py-1">
                  <span>Basic Salary</span>
                  <span className="font-semibold">{formatCurrency(selectedPayslip.basicSalary)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-semibold">{formatCurrency(selectedPayslip.hra)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Special Allowances</span>
                  <span className="font-semibold">{formatCurrency(selectedPayslip.allowances)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Performance Bonus</span>
                  <span className="font-semibold">{formatCurrency(selectedPayslip.bonus)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-200 dark:border-dark-border font-bold text-slate-900 dark:text-white">
                  <span>Gross Earnings</span>
                  <span>{formatCurrency(selectedPayslip.grossSalary)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2 border border-slate-200 dark:border-dark-border rounded-xl p-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-dark-border">
                  Deductions
                </h4>
                <div className="flex justify-between py-1">
                  <span>Provident Fund (PF)</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(selectedPayslip.providentFund)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Income Tax (TDS)</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(selectedPayslip.taxDeduction)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Health Insurance</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(selectedPayslip.insuranceDeduction)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Professional Tax</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(selectedPayslip.otherDeductions)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-200 dark:border-dark-border font-bold text-rose-600">
                  <span>Total Deductions</span>
                  <span>-{formatCurrency(selectedPayslip.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Salary Total Box */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Net Salary Disbursed</span>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Directly transferred to Chase Bank Account ending in 8842</p>
              </div>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {formatCurrency(selectedPayslip.netSalary)}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
