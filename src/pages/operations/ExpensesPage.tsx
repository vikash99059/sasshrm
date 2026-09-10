import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { ExpenseClaim } from '../../types';
import {
  DataTable,
  Column,
  Badge,
  Button,
  Avatar,
  Modal,
  Input,
  Select,
  StatCard,
} from '../../components/ui';
import { Receipt, Plus, DollarSign, CheckCircle2, Clock, FileText, Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';
import { useAppStore } from '../../store/useAppStore';

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseClaim[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<'Travel' | 'Meals' | 'Software' | 'Equipment' | 'Office Supplies'>('Software');
  const [amount, setAmount] = useState(150);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Core Engineering');

  const { currentUser } = useAppStore();

  const loadExpenses = async () => {
    const list = await operationsService.getExpenses();
    setExpenses(list);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await operationsService.createExpense({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      category,
      amount,
      date,
      description,
      project,
    });
    setIsModalOpen(false);
    setDescription('');
    loadExpenses();
  };

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected' | 'Reimbursed') => {
    await operationsService.updateExpenseStatus(id, status, currentUser.name);
    loadExpenses();
  };

  const columns: Column<ExpenseClaim>[] = [
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.employeeAvatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.project}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => <Badge variant="primary" size="sm">{row.category}</Badge>,
      sortable: true,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row) => <span className="font-bold text-xs text-slate-900 dark:text-white">{formatCurrency(row.amount)}</span>,
      sortable: true,
    },
    {
      header: 'Expense Date',
      accessorKey: 'date',
      cell: (row) => <span className="text-xs text-slate-500">{formatDate(row.date)}</span>,
      sortable: true,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={row.description}>
          {row.description}
        </p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'Approved'
              ? 'info'
              : row.status === 'Reimbursed'
              ? 'success'
              : row.status === 'Pending'
              ? 'warning'
              : 'danger'
          }
          size="sm"
          dot
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Action',
      cell: (row) => (
        row.status === 'Pending' ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleUpdateStatus(row.id, 'Approved')}
              className="p-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50"
              title="Approve Claim"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleUpdateStatus(row.id, 'Rejected')}
              className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50"
              title="Reject Claim"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">By {row.approverName || 'HR'}</span>
        )
      ),
    },
  ];

  const totalClaimed = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalReimbursed = expenses.filter(e => e.status === 'Reimbursed').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Expense Claims & Reimbursements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit business expenditure claims, review receipts, and disburse reimbursements.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Submit Expense Claim
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Claims Volume"
          value={formatCurrency(totalClaimed)}
          icon={<Receipt className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Reimbursed to Date"
          value={formatCurrency(totalReimbursed)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Approval"
          value={expenses.filter(e => e.status === 'Pending').length}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchKey="employeeName"
        searchPlaceholder="Search expense claims..."
        pageSize={6}
        exportFileName="expense_claims.csv"
      />

      {/* Submit Claim Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Expense Claim"
        description="Provide expenditure details and project allocation for reimbursement."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateExpense}>
              Submit for Approval
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'Software', label: 'Software / Subscriptions' },
                { value: 'Travel', label: 'Travel & Flights' },
                { value: 'Meals', label: 'Client Meals & Entertainment' },
                { value: 'Equipment', label: 'Hardware / Equipment' },
                { value: 'Office Supplies', label: 'Office Supplies' },
              ]}
            />
            <Input
              label="Amount ($ USD)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expense Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Project / Cost Center"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Core Engineering"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Business Justification
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the purpose of the expense..."
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
