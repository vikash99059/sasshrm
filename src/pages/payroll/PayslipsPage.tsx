import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord } from '../../types';
import {
  DataTable,
  Column,
  Badge,
  Button,
  Avatar,
  Modal,
  StatCard,
  Input,
  Select,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  FileSpreadsheet,
  Download,
  Eye,
  Search,
  Printer,
  DollarSign,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const PayslipsPage: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('May 2024');

  const loadPayslips = async () => {
    const list = await payrollService.getRecords();
    setRecords(list);
  };

  useEffect(() => {
    loadPayslips();
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalGrossDisbursed = records.reduce((s, r) => s + r.grossSalary, 0);
  const totalNetDisbursed = records.reduce((s, r) => s + r.netSalary, 0);
  const totalDeductions = records.reduce((s, r) => s + r.totalDeductions, 0);

  const columns: Column<PayrollRecord>[] = [
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.employeeAvatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.employeeCode} • {row.department}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Pay Cycle',
      accessorKey: 'month',
      cell: (row) => <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{row.month}</span>,
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
        <span className="text-xs font-semibold text-rose-600">
          -{formatCurrency(row.totalDeductions)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Net In-Hand Salary',
      accessorKey: 'netSalary',
      cell: (row) => (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.netSalary)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : 'primary'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="p-1.5 h-7 w-7"
            onClick={() => setSelectedPayslip(row)}
            title="View Payslip"
          >
            <Eye className="h-3.5 w-3.5 text-slate-600" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="p-1.5 h-7 w-7"
            onClick={() => {
              setSelectedPayslip(row);
              setTimeout(() => window.print(), 300);
            }}
            title="Print PDF"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Employee Payslips Archive & Disbursal"
        subtitle="Access generated payslips, tax deductions, PDF salary vouchers, and automated employee email delivery."
        icon={FileSpreadsheet}
        badge={<Badge variant="primary">{records.length} Payslips Processed</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => alert('Sending payslip notifications to all active employees via email & portal...')}
            leftIcon={<Send className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Email All Payslips
          </Button>
        }
      />

      {/* 3 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Gross Salary"
          value={formatCurrency(totalGrossDisbursed)}
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="May 2024 Cycle"
          isPositive={true}
        />
        <StatCard
          title="Total Deductions (PF/PT/TDS)"
          value={formatCurrency(totalDeductions)}
          icon={<Calendar className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Statutory Retained"
          isPositive={false}
        />
        <StatCard
          title="Net Disbursed to Bank Accounts"
          value={formatCurrency(totalNetDisbursed)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="100% Direct Deposit"
          isPositive={true}
        />
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search employee, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Pay Cycle:</span>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-medium"
          >
            <option value="May 2024">May 2024</option>
            <option value="April 2024">April 2024</option>
            <option value="March 2024">March 2024</option>
          </select>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        pageSize={10}
      />

      {/* DETAILED PAYSLIP MODAL */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip - ${selectedPayslip.month}`}
          size="lg"
        >
          <div className="space-y-6 p-2">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">SAAS ENTERPRISE TECHNOLOGIES</h3>
                <p className="text-xs text-slate-400">Embassy TechVillage, Bellandur, Bengaluru 560103</p>
                <p className="text-xs text-slate-400 font-mono">TAN: BLRE12345A • GSTIN: 29AAECS1234F1ZA</p>
              </div>
              <div className="text-right">
                <Badge variant="success" size="md">PAID / DISBURSED</Badge>
                <p className="text-xs text-slate-500 mt-1">Disbursed: {formatDate(selectedPayslip.paymentDate)}</p>
              </div>
            </div>

            {/* Employee Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400">Employee Name:</span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedPayslip.employeeName}</p>
              </div>
              <div>
                <span className="text-slate-400">Employee ID:</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedPayslip.employeeCode}</p>
              </div>
              <div>
                <span className="text-slate-400">Department:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedPayslip.department}</p>
              </div>
              <div>
                <span className="text-slate-400">Payment Mode:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedPayslip.paymentMethod}</p>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 font-bold text-blue-600">Earnings Components</div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Basic Salary</span>
                    <span className="font-semibold">{formatCurrency(selectedPayslip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">House Rent Allowance (HRA)</span>
                    <span className="font-semibold">{formatCurrency(selectedPayslip.hra)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Special Allowances</span>
                    <span className="font-semibold">{formatCurrency(selectedPayslip.allowances)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Bonus & Incentives</span>
                    <span className="font-semibold">{formatCurrency(selectedPayslip.bonus)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white pt-2">
                    <span>Gross Earnings</span>
                    <span className="text-emerald-600">{formatCurrency(selectedPayslip.grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 p-2.5 font-bold text-rose-600">Deductions & Taxes</div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Provident Fund (EPF 12%)</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(selectedPayslip.providentFund)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Income Tax (TDS)</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(selectedPayslip.taxDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Professional Tax (PT)</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(selectedPayslip.otherDeductions)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Health Insurance</span>
                    <span className="font-semibold text-rose-600">-{formatCurrency(selectedPayslip.insuranceDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white pt-2">
                    <span>Total Deductions</span>
                    <span className="text-rose-600">-{formatCurrency(selectedPayslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Banner */}
            <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">NET SALARY PAYABLE</p>
                <p className="text-[11px] text-slate-400">Direct deposit credited to Bank of Baroda A/C ****8192</p>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(selectedPayslip.netSalary)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
                Print Payslip
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={() => alert('PDF payslip downloaded.')}>
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
