import React, { useState } from 'react';
import {
  DollarSign,
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';

interface InvoiceItem {
  id: string;
  tenantName: string;
  domain: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}

export const SaasBillingInvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const invoices: InvoiceItem[] = [
    { id: 'INV-01', tenantName: 'Apex Global Corp', domain: 'apex.saas-hrm.com', invoiceNumber: 'INV-2024-0089', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 4800.0, paymentMethod: 'ACH Direct Debit (•••• 8912)', status: 'Paid' },
    { id: 'INV-02', tenantName: 'Nexlify Technologies', domain: 'nexlify.saas-hrm.com', invoiceNumber: 'INV-2024-0090', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 3400.0, paymentMethod: 'Visa (•••• 4242)', status: 'Paid' },
    { id: 'INV-03', tenantName: 'HyperFlow Logistics', domain: 'hyperflow.saas-hrm.com', invoiceNumber: 'INV-2024-0091', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 1850.0, paymentMethod: 'MasterCard (•••• 9831)', status: 'Paid' },
    { id: 'INV-04', tenantName: 'Aether Cloud Labs', domain: 'aether.saas-hrm.com', invoiceNumber: 'INV-2024-0092', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 1200.0, paymentMethod: 'Visa (•••• 1120)', status: 'Paid' },
    { id: 'INV-05', tenantName: 'Zenith BioPharm', domain: 'zenith.saas-hrm.com', invoiceNumber: 'INV-2024-0093', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 6500.0, paymentMethod: 'ACH Wire Transfer', status: 'Paid' },
    { id: 'INV-06', tenantName: 'OmniVanguard Logistics', domain: 'omni.saas-hrm.com', invoiceNumber: 'INV-2024-0094', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 2900.0, paymentMethod: 'Visa (•••• 3099)', status: 'Failed' },
    { id: 'INV-07', tenantName: 'Veritas Fintech', domain: 'veritas.saas-hrm.com', invoiceNumber: 'INV-2024-0095', issueDate: 'May 01, 2024', dueDate: 'May 15, 2024', amount: 450.0, paymentMethod: 'MasterCard (•••• 5542)', status: 'Paid' },
  ];

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Billing, Invoices & Payment Gateway
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor Stripe transactions, tenant invoice statements, tax remittance, and payment gateway receipts.
          </p>
        </div>

        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1.5" />
          Export All Invoices
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">May Collections</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">${totalCollected.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">98.2% Collection Rate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Paid Invoices</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {invoices.filter(i => i.status === 'Paid').length}
          </div>
          <span className="text-xs text-slate-400">Processed via Stripe</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Failed Charges</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {invoices.filter(i => i.status === 'Failed').length} ($2,900)
          </div>
          <span className="text-xs text-rose-500 font-medium">Card expired error</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gateway Health</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">100%</div>
          <span className="text-xs text-slate-400">Stripe Webhooks Active</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenant or invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Paid', 'Pending', 'Failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Invoice Number</th>
                <th className="py-3.5 px-4">Tenant</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Receipt / PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {inv.tenantName}
                    <div className="text-[11px] text-slate-400 font-mono font-normal">{inv.domain}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{inv.issueDate}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{inv.paymentMethod}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white text-sm">
                    ${inv.amount.toLocaleString()}.00
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      inv.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === 'Paid' ? 'bg-emerald-500' :
                        inv.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SaasBillingInvoicesPage;
