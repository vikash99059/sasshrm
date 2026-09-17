import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { VendorBill, BillStatus } from '../../types';
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
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Check,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const BillsPayablesPage: React.FC = () => {
  const [bills, setBills] = useState<VendorBill[]>([]);
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [billNumber, setBillNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorCategory, setVendorCategory] = useState('Cloud Hosting & Infrastructure');
  const [vendorGstin, setVendorGstin] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [poReference, setPoReference] = useState('');

  const loadBills = async () => {
    const list = await financeService.getBills();
    setBills(list);
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(amount) + Number(taxAmount);
    await financeService.createBill({
      billNumber,
      vendorName,
      vendorCategory,
      vendorGstin,
      billDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      items: [
        { id: '1', description: `${vendorCategory} services`, category: vendorCategory, quantity: 1, unitPrice: Number(amount), taxRate: 18, total },
      ],
      subTotal: Number(amount),
      taxAmount: Number(taxAmount),
      totalAmount: total,
      paidAmount: 0,
      status: 'Approved',
      poReference,
    });
    setIsCreateModalOpen(false);
    setBillNumber('');
    setVendorName('');
    setAmount(0);
    setTaxAmount(0);
    loadBills();
  };

  const handleApproveOrPay = async (bill: VendorBill, newStatus: BillStatus) => {
    await financeService.updateBillStatus(bill.id, newStatus, newStatus === 'Paid' ? bill.totalAmount : 0);
    loadBills();
  };

  const filteredBills = bills.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalOutstandingPayables = bills.filter(b => b.status !== 'Paid').reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);
  const totalSettled = bills.reduce((s, b) => s + b.paidAmount, 0);

  const columns: Column<VendorBill>[] = [
    {
      header: 'Bill Number',
      accessorKey: 'billNumber',
      cell: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {row.billNumber}
          </span>
          <p className="text-[10px] text-slate-400">{row.poReference || 'Direct Expense'}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Vendor & Category',
      accessorKey: 'vendorName',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.vendorName}</p>
          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {row.vendorCategory}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Bill Amount',
      accessorKey: 'totalAmount',
      cell: (row) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: (row) => <span className="text-xs text-slate-600 dark:text-slate-300">{formatDate(row.dueDate)}</span>,
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const variants: Record<BillStatus, 'success' | 'warning' | 'danger' | 'primary' | 'neutral'> = {
          Paid: 'success',
          Approved: 'primary',
          'Pending Approval': 'warning',
          Overdue: 'danger',
          Draft: 'neutral',
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Pending Approval' && (
            <Button
              size="sm"
              variant="outline"
              className="p-1 h-7 text-[11px] font-bold text-blue-600 border-blue-200"
              onClick={() => handleApproveOrPay(row, 'Approved')}
            >
              Approve
            </Button>
          )}
          {row.status === 'Approved' && (
            <Button
              size="sm"
              className="p-1 h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleApproveOrPay(row, 'Paid')}
            >
              Disburse Payment
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Bills & Accounts Payable"
        subtitle="Manage vendor bills, purchase order reconciliation, approval workflows, AP aging, and payment disbursements."
        icon={Receipt}
        badge={<Badge variant="primary">{bills.length} Bills Active</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Record Vendor Bill
          </Button>
        }
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Outstanding Payables"
          value={formatCurrency(totalOutstandingPayables)}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Pending Payout"
          isPositive={false}
        />
        <StatCard
          title="Disbursed This Month"
          value={formatCurrency(totalSettled)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Settled to Vendors"
          isPositive={true}
        />
        <StatCard
          title="Active Vendors"
          value="18"
          icon={<Building2 className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Approved Creditors"
          isPositive={true}
        />
        <StatCard
          title="Average DPO"
          value="31 Days"
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          change="Days Payable Outstanding"
          isPositive={true}
        />
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Pending Approval', 'Approved', 'Paid'] as const).map((st) => (
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
              placeholder="Search bill number or vendor..."
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
        data={filteredBills}
        pageSize={10}
      />

      {/* RECORD BILL MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Record Vendor Invoice & Bill"
        description="Add vendor bill reference, expense category, and payment due dates."
      >
        <form onSubmit={handleCreateBill} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vendor Bill Number"
              placeholder="e.g. AWS-INV-99214"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              required
            />
            <Input
              label="Vendor Organization Name"
              placeholder="e.g. Amazon Web Services Pvt Ltd"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              value={vendorCategory}
              onChange={(e) => setVendorCategory(e.target.value)}
              options={[
                { value: 'Cloud Hosting & Infrastructure', label: 'Cloud Hosting & Infrastructure' },
                { value: 'Real Estate & Facility', label: 'Real Estate & Facility Lease' },
                { value: 'Software & SaaS Tools', label: 'Software & SaaS Licenses' },
                { value: 'Hardware & Workstations', label: 'Hardware & IT Equipment' },
                { value: 'Legal & Professional Consulting', label: 'Legal & Professional Consulting' },
              ]}
            />
            <Input
              label="Purchase Order Ref (Optional)"
              placeholder="PO-2024-065"
              value={poReference}
              onChange={(e) => setPoReference(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Base Amount (INR)"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            <Input
              label="GST Tax Amount (INR)"
              type="number"
              placeholder="0"
              value={taxAmount}
              onChange={(e) => setTaxAmount(Number(e.target.value))}
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Record Bill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
