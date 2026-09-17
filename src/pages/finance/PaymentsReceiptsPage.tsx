import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { PaymentReceiptVoucher } from '../../types';
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
  CreditCard,
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const PaymentsReceiptsPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<PaymentReceiptVoucher[]>([]);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Receipt' | 'Payment'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<'Receipt' | 'Payment'>('Receipt');
  const [partyName, setPartyName] = useState('');
  const [partyType, setPartyType] = useState<'Customer' | 'Vendor' | 'Employee' | 'Tax Authority'>('Customer');
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<any>('Bank Transfer (NEFT/RTGS)');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('HDFC Current A/c 8192');
  const [purpose, setPurpose] = useState('');

  const loadVouchers = async () => {
    const list = await financeService.getVouchers();
    setVouchers(list);
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.createVoucher({
      type,
      partyName,
      partyType,
      date: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      paymentMode,
      referenceNumber: referenceNumber || `TXN-${Date.now().toString().slice(-6)}`,
      bankAccount,
      status: 'Cleared',
      purpose,
    });
    setIsCreateModalOpen(false);
    setPartyName('');
    setAmount(0);
    setReferenceNumber('');
    setPurpose('');
    loadVouchers();
  };

  const filteredVouchers = vouchers.filter(v => {
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalReceipts = vouchers.filter(v => v.type === 'Receipt').reduce((s, v) => s + v.amount, 0);
  const totalPayments = vouchers.filter(v => v.type === 'Payment').reduce((s, v) => s + v.amount, 0);

  const columns: Column<PaymentReceiptVoucher>[] = [
    {
      header: 'Voucher Number & Date',
      accessorKey: 'voucherNumber',
      cell: (row) => (
        <div>
          <span className={`font-mono text-xs font-bold ${row.type === 'Receipt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {row.voucherNumber}
          </span>
          <p className="text-[10px] text-slate-400">{formatDate(row.date)}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row) => (
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
          row.type === 'Receipt'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
            : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300'
        }`}>
          {row.type === 'Receipt' ? <ArrowDownLeft className="h-3 w-3 text-emerald-600" /> : <ArrowUpRight className="h-3 w-3 text-blue-600" />}
          {row.type}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Party & Relation',
      accessorKey: 'partyName',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.partyName}</p>
          <span className="text-[10px] text-slate-400">{row.partyType} • {row.bankAccount}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Amount (INR)',
      accessorKey: 'amount',
      cell: (row) => (
        <span className={`text-xs font-bold ${row.type === 'Receipt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {row.type === 'Receipt' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Payment Mode',
      accessorKey: 'paymentMode',
      cell: (row) => (
        <div>
          <p className="text-xs text-slate-700 dark:text-slate-200">{row.paymentMode}</p>
          <p className="text-[10px] font-mono text-slate-400">{row.referenceNumber}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Reconciled' ? 'success' : 'primary'} size="sm">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Payments & Receipts Voucher Ledger"
        subtitle="Comprehensive dual voucher ledger tracking all inbound customer settlements and outbound operational disbursements."
        icon={CreditCard}
        badge={<Badge variant="primary">{vouchers.length} Vouchers Recorded</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Create Payment / Receipt Voucher
          </Button>
        }
      />

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Inbound Receipts"
          value={formatCurrency(totalReceipts)}
          icon={<ArrowDownLeft className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Customer Inflow"
          isPositive={true}
        />
        <StatCard
          title="Total Outbound Disbursements"
          value={formatCurrency(totalPayments)}
          icon={<ArrowUpRight className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Vendor & Operating Outflow"
          isPositive={false}
        />
        <StatCard
          title="Net Cash Settlement"
          value={formatCurrency(totalReceipts - totalPayments)}
          icon={<ShieldCheck className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Surplus Balance"
          isPositive={true}
        />
      </div>

      {/* FILTER TABS & SEARCH */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Receipt', 'Payment'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search voucher, party, ref..."
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
        data={filteredVouchers}
        pageSize={10}
      />

      {/* CREATE VOUCHER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Record Cash / Bank Voucher"
        description="Record money received from customer or payment disbursed to vendor."
      >
        <form onSubmit={handleCreateVoucher} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Voucher Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { value: 'Receipt', label: 'Inbound Receipt (Money In)' },
                { value: 'Payment', label: 'Outbound Payment (Money Out)' },
              ]}
            />
            <Select
              label="Party Classification"
              value={partyType}
              onChange={(e) => setPartyType(e.target.value as any)}
              options={[
                { value: 'Customer', label: 'Customer / Client' },
                { value: 'Vendor', label: 'Vendor / Supplier' },
                { value: 'Employee', label: 'Employee Reimbursement' },
                { value: 'Tax Authority', label: 'Tax Authority / Statutory' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Party Name"
              placeholder="e.g. Apex Technologies Pvt Ltd"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
            />
            <Input
              label="Voucher Amount (INR)"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment Mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              options={[
                { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                { value: 'UPI', label: 'UPI Instant Transfer' },
                { value: 'Credit Card', label: 'Corporate Credit Card' },
                { value: 'Cheque', label: 'Bank Cheque' },
                { value: 'Cash', label: 'Petty Cash' },
              ]}
            />
            <Input
              label="Bank Reference / UTR Number"
              placeholder="e.g. HDFCR520240518"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <Input
            label="Payment Purpose / Memo"
            placeholder="e.g. Full settlement of INV-2024-0089"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Save Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
