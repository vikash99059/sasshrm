import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { ChartAccount, AccountCategory } from '../../types';
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
  Layers,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

export const ChartOfAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartAccount[]>([]);
  const [activeCategory, setActiveCategory] = useState<AccountCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AccountCategory>('Asset');
  const [subCategory, setSubCategory] = useState<any>('Current Asset');
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState('');

  const loadAccounts = async () => {
    const list = await financeService.getAccounts();
    setAccounts(list);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.createAccount({
      code,
      name,
      category,
      subCategory,
      currency: 'INR',
      balance: Number(balance),
      status: 'Active',
      description,
    });
    setIsCreateModalOpen(false);
    setCode('');
    setName('');
    setDescription('');
    setBalance(0);
    loadAccounts();
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesCat = activeCategory === 'All' || acc.category === activeCategory;
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.code.includes(searchQuery) ||
      acc.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalAssets = accounts.filter(a => a.category === 'Asset').reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.category === 'Liability').reduce((s, a) => s + a.balance, 0);
  const totalEquity = accounts.filter(a => a.category === 'Equity').reduce((s, a) => s + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.category === 'Revenue').reduce((s, a) => s + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.category === 'Expense').reduce((s, a) => s + a.balance, 0);

  const columns: Column<ChartAccount>[] = [
    {
      header: 'Account Code & Title',
      accessorKey: 'code',
      cell: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800/40">
              {row.code}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white text-xs">{row.name}</span>
            {row.isSystemAccount && (
              <Badge variant="neutral" size="sm" className="text-[10px]">System Locked</Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm">{row.description}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => {
        const catColors: Record<AccountCategory, string> = {
          Asset: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          Liability: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
          Equity: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
          Revenue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
          Expense: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${catColors[row.category]}`}>
            {row.category}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: 'Sub-Classification',
      accessorKey: 'subCategory',
      cell: (row) => <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{row.subCategory}</span>,
      sortable: true,
    },
    {
      header: 'Current Balance (INR)',
      accessorKey: 'balance',
      cell: (row) => (
        <span className={`text-xs font-bold ${row.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
          {formatCurrency(row.balance)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'} size="sm">
          {row.status}
        </Badge>
      ),
    },
  ];

  const categories: (AccountCategory | 'All')[] = ['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Chart of Accounts & General Ledger"
        subtitle="Master double-entry accounting taxonomy, ledger accounts, classification hierarchy, and current balances."
        icon={Layers}
        badge={<Badge variant="primary">{accounts.length} Accounts Registered</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Create Ledger Account
          </Button>
        }
      />

      {/* 5 ACCOUNT SUMMARY STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Assets"
          value={formatCurrency(totalAssets)}
          icon={<ArrowUpRight className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="+8.4% YTD"
          isPositive={true}
        />
        <StatCard
          title="Total Liabilities"
          value={formatCurrency(totalLiabilities)}
          icon={<ArrowDownRight className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Debts & Payables"
          isPositive={false}
        />
        <StatCard
          title="Owner Equity"
          value={formatCurrency(totalEquity)}
          icon={<ShieldCheck className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Net Worth"
          isPositive={true}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="SaaS & Services"
          isPositive={true}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<DollarSign className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          change="Operating & Payroll"
          isPositive={false}
        />
      </div>

      {/* FILTER TABS & SEARCH */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat} {cat !== 'All' && `(${accounts.filter(a => a.category === cat).length})`}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by code, account name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>
      </Card>

      {/* ACCOUNTS DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredAccounts}
        pageSize={10}
      />

      {/* CREATE ACCOUNT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New General Ledger Account"
        description="Configure account code, category, and initial opening balance."
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Account Code"
              placeholder="e.g. 1040, 5250"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Input
              label="Account Title"
              placeholder="e.g. SaaS Hosting Server Expense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as AccountCategory)}
              options={[
                { value: 'Asset', label: 'Asset (1000 - 1999)' },
                { value: 'Liability', label: 'Liability (2000 - 2999)' },
                { value: 'Equity', label: 'Equity (3000 - 3999)' },
                { value: 'Revenue', label: 'Revenue (4000 - 4999)' },
                { value: 'Expense', label: 'Expense (5000 - 5999)' },
              ]}
            />
            <Select
              label="Sub-Classification"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              options={[
                { value: 'Current Asset', label: 'Current Asset' },
                { value: 'Fixed Asset', label: 'Fixed Asset' },
                { value: 'Current Liability', label: 'Current Liability' },
                { value: 'Long-Term Liability', label: 'Long-Term Liability' },
                { value: 'Equity & Reserves', label: 'Equity & Reserves' },
                { value: 'Operating Revenue', label: 'Operating Revenue' },
                { value: 'Other Income', label: 'Other Income' },
                { value: 'Operating Expense', label: 'Operating Expense' },
                { value: 'Payroll Expense', label: 'Payroll Expense' },
              ]}
            />
          </div>

          <Input
            label="Opening Balance (INR)"
            type="number"
            placeholder="0"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
          />

          <Input
            label="Account Description"
            placeholder="Purpose, tax deductibility, or ledger notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Save Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
