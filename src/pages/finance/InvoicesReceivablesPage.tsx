import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { Invoice, InvoiceStatus, InvoiceItem } from '../../types';
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
  FileText,
  Plus,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Eye,
  Send,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const InvoicesReceivablesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Enterprise SaaS HRM License (Q3)', hsnSacCode: '998314', quantity: 1, unitPrice: 250000, taxRate: 18, taxAmount: 45000, total: 295000 },
  ]);

  const loadInvoices = async () => {
    const list = await financeService.getInvoices();
    setInvoices(list);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', hsnSacCode: '998314', quantity: 1, unitPrice: 0, taxRate: 18, taxAmount: 0, total: 0 },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[idx], [field]: value };
    const qty = field === 'quantity' ? Number(value) : item.quantity;
    const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
    const taxRate = field === 'taxRate' ? Number(value) : item.taxRate;
    const sub = qty * price;
    const tax = Math.round(sub * (taxRate / 100));
    item.taxAmount = tax;
    item.total = sub + tax;
    updated[idx] = item;
    setItems(updated);
  };

  const calculatedSubTotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const calculatedTax = items.reduce((s, i) => s + i.taxAmount, 0);
  const calculatedTotal = calculatedSubTotal + calculatedTax;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.createInvoice({
      clientName,
      clientEmail,
      clientGstin,
      clientAddress,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items,
      subTotal: calculatedSubTotal,
      cgst: Math.round(calculatedTax / 2),
      sgst: Math.round(calculatedTax / 2),
      igst: 0,
      totalTax: calculatedTax,
      totalAmount: calculatedTotal,
      paidAmount: 0,
      balanceDue: calculatedTotal,
      status: 'Sent',
      paymentTerms,
    });
    setIsCreateModalOpen(false);
    setClientName('');
    setClientEmail('');
    setClientGstin('');
    setClientAddress('');
    loadInvoices();
  };

  const handleMarkAsPaid = async (inv: Invoice) => {
    await financeService.updateInvoiceStatus(inv.id, 'Paid', inv.totalAmount);
    loadInvoices();
    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice({ ...inv, status: 'Paid', paidAmount: inv.totalAmount, balanceDue: 0 });
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalReceivables = invoices.reduce((s, i) => s + i.balanceDue, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice Number',
      accessorKey: 'invoiceNumber',
      cell: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
            {row.invoiceNumber}
          </span>
          <p className="text-[10px] text-slate-400">Issued: {formatDate(row.issueDate)}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Client & Entity',
      accessorKey: 'clientName',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.clientName}</p>
          <p className="text-[10px] text-slate-400">{row.clientGstin ? `GSTIN: ${row.clientGstin}` : row.clientEmail}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Total Value',
      accessorKey: 'totalAmount',
      cell: (row) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Balance Due',
      accessorKey: 'balanceDue',
      cell: (row) => (
        <span className={`text-xs font-bold ${row.balanceDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`}>
          {formatCurrency(row.balanceDue)}
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
        const variants: Record<InvoiceStatus, 'success' | 'warning' | 'danger' | 'primary' | 'neutral'> = {
          Paid: 'success',
          'Partially Paid': 'warning',
          Sent: 'primary',
          Overdue: 'danger',
          Draft: 'neutral',
          Cancelled: 'neutral',
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
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
            onClick={() => setSelectedInvoice(row)}
            title="View Invoice"
          >
            <Eye className="h-3.5 w-3.5 text-slate-600" />
          </Button>
          {row.status !== 'Paid' && (
            <Button
              size="sm"
              variant="outline"
              className="p-1.5 h-7 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 border-emerald-200"
              onClick={() => handleMarkAsPaid(row)}
            >
              Collect
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Invoicing & Accounts Receivable"
        subtitle="Manage customer invoices, automated GST calculations, collections, receivables aging, and instant receipt generation."
        icon={FileText}
        badge={<Badge variant="primary">{invoices.length} Invoices Active</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Create Tax Invoice
          </Button>
        }
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Receivables Due"
          value={formatCurrency(totalReceivables)}
          icon={<Clock className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          change="Pending Collection"
          isPositive={false}
        />
        <StatCard
          title="Collections Received"
          value={formatCurrency(totalPaid)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="+14.2% this month"
          isPositive={true}
        />
        <StatCard
          title="Overdue Invoices"
          value={overdueCount.toString()}
          icon={<AlertCircle className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          change="Action Required"
          isPositive={overdueCount === 0}
        />
        <StatCard
          title="Average DSO"
          value="24 Days"
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Days Sales Outstanding"
          isPositive={true}
        />
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Sent', 'Partially Paid', 'Paid', 'Overdue'] as const).map((st) => (
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
              placeholder="Search invoice number or client..."
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
        data={filteredInvoices}
        pageSize={10}
      />

      {/* CREATE INVOICE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Professional Tax Invoice"
        description="Add client billing details, HSN/SAC line items, and GST taxes."
        size="lg"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Organization Name"
              placeholder="e.g. Acme Corp Pvt Ltd"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              label="Billing Email"
              type="email"
              placeholder="billing@acme.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Client GSTIN"
              placeholder="29AABCU9603R1ZM"
              value={clientGstin}
              onChange={(e) => setClientGstin(e.target.value)}
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Select
              label="Payment Terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              options={[
                { value: 'Due on Receipt', label: 'Due on Receipt' },
                { value: 'Net 15', label: 'Net 15 Days' },
                { value: 'Net 30', label: 'Net 30 Days' },
                { value: 'Net 45', label: 'Net 45 Days' },
              ]}
            />
          </div>

          <Input
            label="Client Billing Address"
            placeholder="Registered address, City, Pincode"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />

          {/* LINE ITEMS */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Line Items & Services</h4>
              <Button type="button" size="sm" variant="outline" onClick={handleAddItem} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Add Item
              </Button>
            </div>

            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                <div className="col-span-5">
                  <input
                    placeholder="Description / Service"
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    placeholder="HSN/SAC"
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                    value={item.hsnSacCode}
                    onChange={(e) => handleItemChange(idx, 'hsnSacCode', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Unit Price"
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2 text-right text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.total)}
                </div>
                <div className="col-span-1 text-center">
                  <button type="button" onClick={() => handleRemoveItem(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-3 text-xs space-y-1 flex-col items-end">
              <div className="flex justify-between w-64 text-slate-500">
                <span>Sub-Total:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(calculatedSubTotal)}</span>
              </div>
              <div className="flex justify-between w-64 text-slate-500">
                <span>GST (18%):</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(calculatedTax)}</span>
              </div>
              <div className="flex justify-between w-64 text-sm font-bold text-blue-600 dark:text-blue-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculatedTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Issue Tax Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW INVOICE MODAL */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          size="lg"
        >
          <div className="space-y-6 p-2">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">SAAS ENTERPRISE HRM</h3>
                <p className="text-xs text-slate-400">GSTIN: 29AAECS1234F1ZA</p>
                <p className="text-xs text-slate-400">Bangalore, Karnataka, India</p>
              </div>
              <div className="text-right">
                <Badge variant={selectedInvoice.status === 'Paid' ? 'success' : 'primary'} size="md">
                  {selectedInvoice.status}
                </Badge>
                <p className="text-xs text-slate-500 mt-1">Issue Date: {formatDate(selectedInvoice.issueDate)}</p>
                <p className="text-xs text-slate-500">Due Date: {formatDate(selectedInvoice.dueDate)}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To:</p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedInvoice.clientName}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">{selectedInvoice.clientAddress}</p>
              {selectedInvoice.clientGstin && (
                <p className="text-xs font-mono text-slate-500 mt-1">Client GSTIN: {selectedInvoice.clientGstin}</p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Description</th>
                    <th className="p-2.5">HSN/SAC</th>
                    <th className="p-2.5">Rate</th>
                    <th className="p-2.5">Tax (18%)</th>
                    <th className="p-2.5 text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-medium">{item.description}</td>
                      <td className="p-2.5 font-mono">{item.hsnSacCode}</td>
                      <td className="p-2.5">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-2.5">{formatCurrency(item.taxAmount)}</td>
                      <td className="p-2.5 text-right font-bold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">
                <p>Payment Terms: {selectedInvoice.paymentTerms}</p>
                <p className="text-[11px] text-slate-400">Electronic Computer Generated Tax Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Grand Total Amount</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(selectedInvoice.totalAmount)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" size="sm" leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
                Print PDF
              </Button>
              {selectedInvoice.status !== 'Paid' && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => handleMarkAsPaid(selectedInvoice)}>
                  Mark Collected / Paid
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
