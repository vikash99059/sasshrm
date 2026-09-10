import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Receipt,
  Award,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface AdjustmentItem {
  id: string;
  employeeName: string;
  department: string;
  type: 'Performance Bonus' | 'Overtime Pay' | 'Travel Reimbursement' | 'Tax Deduction' | 'Health Insurance Adjustment';
  category: 'Addition' | 'Deduction';
  amount: number;
  effectiveCycle: string;
  status: 'Approved' | 'Pending' | 'Applied';
  note: string;
}

export const PayrollAdjustmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Addition' | 'Deduction'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [adjustments, setAdjustments] = useState<AdjustmentItem[]>([
    { id: 'ADJ-1', employeeName: 'David Miller', department: 'Engineering', type: 'Overtime Pay', category: 'Addition', amount: 640.0, effectiveCycle: 'May 2024', status: 'Approved', note: '8.0h weekend deployment overtime' },
    { id: 'ADJ-2', employeeName: 'Sarah Wilson', department: 'Marketing', type: 'Performance Bonus', category: 'Addition', amount: 1500.0, effectiveCycle: 'May 2024', status: 'Approved', note: 'Q1 Product Launch Spot Award' },
    { id: 'ADJ-3', employeeName: 'Elena Rostova', department: 'Product', type: 'Travel Reimbursement', category: 'Addition', amount: 420.5, effectiveCycle: 'May 2024', status: 'Pending', note: 'UX Research client visit flight tickets' },
    { id: 'ADJ-4', employeeName: 'Marcus Vance', department: 'Operations', type: 'Health Insurance Adjustment', category: 'Deduction', amount: 120.0, effectiveCycle: 'May 2024', status: 'Applied', note: 'Dependent addition premium' },
    { id: 'ADJ-5', employeeName: 'James Wilson', department: 'Sales', type: 'Performance Bonus', category: 'Addition', amount: 2800.0, effectiveCycle: 'May 2024', status: 'Approved', note: 'Enterprise quota Q1 overachievement' },
  ]);

  const filtered = adjustments.filter(item => {
    const matchSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalAdditions = adjustments.filter(a => a.category === 'Addition').reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = adjustments.filter(a => a.category === 'Deduction').reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Salary Adjustments & Claims
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage variable pay, spot bonuses, overtime compensation, expense claims, and customized deductions.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Adjustment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Additions / Bonuses</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            +${totalAdditions.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400">4 Approved additions for May cycle</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Custom Deductions</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            -${totalDeductions.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400">Voluntary benefit additions</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {adjustments.filter(a => a.status === 'Pending').length} Request
          </div>
          <span className="text-xs text-slate-400">Requires finance confirmation</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or adjustment type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'Addition', 'Deduction'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Adjustments' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Adjustment Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Effective Cycle</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((adj) => (
                <tr key={adj.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    {adj.employeeName}
                    <div className="text-[11px] text-slate-400 font-normal">{adj.department}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {adj.type}
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{adj.note}</div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={adj.category === 'Addition' ? 'success' : 'danger'}>
                      {adj.category}
                    </Badge>
                  </td>
                  <td className={`py-4 px-4 font-bold text-sm ${adj.category === 'Addition' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {adj.category === 'Addition' ? '+' : '-'}${adj.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{adj.effectiveCycle}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      {adj.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-rose-600 transition-colors">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Adjustment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Salary Adjustment / Bonus"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }} className="space-y-4">
          <Input label="Employee Full Name" placeholder="e.g. David Miller" required />
          <Select
            label="Adjustment Type"
            options={[
              { value: 'bonus', label: 'Spot Performance Bonus' },
              { value: 'overtime', label: 'Overtime Compensation' },
              { value: 'expense', label: 'Expense Reimbursement' },
              { value: 'deduction', label: 'Custom Deduction' },
            ]}
          />
          <Input label="Amount ($)" type="number" placeholder="500" required />
          <Input label="Effective Payroll Cycle" defaultValue="May 2024" required />
          <Input label="Approval Note / Memo" placeholder="Reason for this salary adjustment" required />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Adjustment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default PayrollAdjustmentsPage;
