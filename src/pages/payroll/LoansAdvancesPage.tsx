import React, { useState, useEffect } from 'react';
import { loanAdvanceService } from '../../services/loanAdvanceService';
import { EmployeeLoan, LoanType } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  StatCard,
  Avatar,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const LoansAdvancesPage: React.FC = () => {
  const [loans, setLoans] = useState<EmployeeLoan[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Approved' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EmployeeLoan | null>(null);

  // Form State
  const [employeeName, setEmployeeName] = useState('Priya Sharma');
  const [employeeCode, setEmployeeCode] = useState('EMP002');
  const [department, setDepartment] = useState('Engineering');
  const [loanType, setLoanType] = useState<LoanType>('Salary Advance');
  const [principalAmount, setPrincipalAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(0);
  const [tenureMonths, setTenureMonths] = useState(3);
  const [purpose, setPurpose] = useState('');

  const loadLoans = async () => {
    const list = await loanAdvanceService.getLoans();
    setLoans(list);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    await loanAdvanceService.createLoan({
      employeeId: 'emp-custom',
      employeeName,
      employeeCode,
      department,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      loanType,
      principalAmount: Number(principalAmount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      disbursementDate: new Date().toISOString().split('T')[0],
      startMonthYear: '2024-06',
      status: 'Active',
      purpose,
    });
    setIsCreateModalOpen(false);
    setPurpose('');
    loadLoans();
  };

  const filteredLoans = loans.filter(l => {
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.loanType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalOutstanding = loans.reduce((s, l) => s + l.outstandingBalance, 0);
  const totalRepaid = loans.reduce((s, l) => s + l.amountRepaid, 0);
  const activeCount = loans.filter(l => l.status === 'Active').length;

  const columns: Column<EmployeeLoan>[] = [
    {
      header: 'Employee & Department',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.avatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.employeeCode} • {row.department}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Loan Facility',
      accessorKey: 'loanType',
      cell: (row) => (
        <div>
          <Badge variant="primary" size="sm">{row.loanType}</Badge>
          <p className="text-[10px] text-slate-400 mt-0.5">{row.interestRate}% Interest • {row.tenureMonths} Mos</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Principal Sanctioned',
      accessorKey: 'principalAmount',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white">
          {formatCurrency(row.principalAmount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Monthly EMI',
      accessorKey: 'monthlyEmi',
      cell: (row) => (
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrency(row.monthlyEmi)}/mo
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Outstanding Balance',
      accessorKey: 'outstandingBalance',
      cell: (row) => (
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(row.outstandingBalance)}
          </span>
          <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.round((row.amountRepaid / (row.totalRepayment || 1)) * 100)}%` }}
            />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Approved' ? 'primary' : 'neutral'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          className="p-1 h-7 text-[11px] font-bold text-blue-600 border-blue-200"
          onClick={() => setSelectedLoan(row)}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View Schedule
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Employee Loans & Salary Advances"
        subtitle="Manage salary advance requests, loan sanction approvals, subsidized interest policies, and automated payroll EMI deductions."
        icon={CreditCard}
        badge={<Badge variant="primary">{loans.length} Active Loans</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Sanction Loan / Advance
          </Button>
        }
      />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Outstanding Principal"
          value={formatCurrency(totalOutstanding)}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Pending Recovery"
          isPositive={false}
        />
        <StatCard
          title="Total Recovered via Payroll"
          value={formatCurrency(totalRepaid)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Auto-deducted in payslips"
          isPositive={true}
        />
        <StatCard
          title="Active Loan Accounts"
          value={activeCount.toString()}
          icon={<CreditCard className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Currently Servicing EMI"
          isPositive={true}
        />
        <StatCard
          title="Default Risk Rate"
          value="0.0%"
          icon={<AlertCircle className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="100% Payroll Deduction"
          isPositive={true}
        />
      </div>

      {/* FILTER & SEARCH */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Active', 'Approved', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search employee, ID, loan type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>
      </Card>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredLoans}
        pageSize={10}
      />

      {/* SANCTION LOAN MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Sanction Employee Loan or Salary Advance"
        description="Configure principal amount, tenure, and monthly EMI deduction policy."
      >
        <form onSubmit={handleCreateLoan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
            <Input
              label="Employee Code"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Facility Type"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as LoanType)}
              options={[
                { value: 'Salary Advance', label: 'Short-Term Salary Advance (0% Interest)' },
                { value: 'Home Relocation', label: 'Relocation Assistance (0% Interest)' },
                { value: 'Emergency Medical', label: 'Emergency Medical Loan (0% Interest)' },
                { value: 'Education Assistance', label: 'Education / Skill Assistance (4% Subsidized)' },
                { value: 'Personal Loan', label: 'Corporate Personal Loan (6% Interest)' },
              ]}
            />
            <Input
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Principal Amount (INR)"
              type="number"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(Number(e.target.value))}
              required
            />
            <Input
              label="Interest Rate (%)"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <Input
              label="Tenure (Months)"
              type="number"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Purpose & Justification"
            placeholder="e.g. Relocation deposit for Bangalore transfer"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Sanction & Disburse
            </Button>
          </div>
        </form>
      </Modal>

      {/* EMI SCHEDULE MODAL */}
      {selectedLoan && (
        <Modal
          isOpen={!!selectedLoan}
          onClose={() => setSelectedLoan(null)}
          title={`EMI Repayment Schedule: ${selectedLoan.employeeName}`}
          description={`${selectedLoan.loanType} • Principal: ${formatCurrency(selectedLoan.principalAmount)} • EMI: ${formatCurrency(selectedLoan.monthlyEmi)}/mo`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-xs">
              <div>
                <span className="text-slate-400">Total Sanctioned:</span>
                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedLoan.principalAmount)}</p>
              </div>
              <div>
                <span className="text-slate-400">Total Recovered:</span>
                <p className="font-bold text-emerald-600">{formatCurrency(selectedLoan.amountRepaid)}</p>
              </div>
              <div>
                <span className="text-slate-400">Remaining Balance:</span>
                <p className="font-bold text-amber-600">{formatCurrency(selectedLoan.outstandingBalance)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Inst. #</th>
                    <th className="p-2.5">Scheduled Month</th>
                    <th className="p-2.5">Principal</th>
                    <th className="p-2.5">Interest</th>
                    <th className="p-2.5">EMI Deduction</th>
                    <th className="p-2.5 text-right rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedLoan.schedule.length > 0 ? (
                    selectedLoan.schedule.map((item) => (
                      <tr key={item.installmentNumber}>
                        <td className="p-2.5 font-bold">{item.installmentNumber}</td>
                        <td className="p-2.5 font-medium">{item.monthYear}</td>
                        <td className="p-2.5">{formatCurrency(item.principalAmount)}</td>
                        <td className="p-2.5">{formatCurrency(item.interestAmount)}</td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{formatCurrency(item.emiAmount)}</td>
                        <td className="p-2.5 text-right">
                          <Badge variant={item.status === 'Paid' ? 'success' : 'neutral'} size="sm">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        First EMI scheduled for next monthly payroll cycle ({selectedLoan.startMonthYear})
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3">
              <Button size="sm" variant="outline" onClick={() => setSelectedLoan(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
