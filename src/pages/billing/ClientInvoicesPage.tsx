import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Button, Select, Column } from '../../components/ui';
import { FileText, Plus, Search, CheckCircle, Clock } from 'lucide-react';
import { financeService } from '../../services/financeService';
import { ClientInvoice } from '../../types/finance';

export const ClientInvoicesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [activeViewTab, setActiveViewTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        client: '', date: '', dueDate: '', amount: '',
        invoiceId: '', currency: 'USD', paymentTerms: 'Net 30', status: 'Pending', poReference: ''
    });

    const loadData = async () => {
        setInvoices(await financeService.getClientInvoices());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!formData.client || !formData.amount) return;

        if (isEditing && editingId) {
            await financeService.updateInvoice(editingId, {
                client: formData.client,
                date: formData.date || new Date().toISOString().split('T')[0],
                dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
                amount: Number(formData.amount) || 0,
                status: formData.status as any
            });
        } else {
            await financeService.addInvoice({
                client: formData.client,
                date: formData.date || new Date().toISOString().split('T')[0],
                dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
                amount: Number(formData.amount) || 0,
                status: (formData.status as any) || 'Pending'
            });
        }

        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            client: '', date: '', dueDate: '', amount: '',
            invoiceId: '', currency: 'USD', paymentTerms: 'Net 30', status: 'Pending', poReference: ''
        });
        loadData();
    };

    const columns: Column<ClientInvoice>[] = [
        { accessorKey: 'invoiceId', header: 'Invoice #', cell: (row: ClientInvoice) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{row.invoiceId}</span> },
        { accessorKey: 'client', header: 'Client' },
        { accessorKey: 'date', header: 'Issue Date' },
        { accessorKey: 'dueDate', header: 'Due Date' },
        { accessorKey: 'amount', header: 'Amount', cell: (row: ClientInvoice) => <span className="font-bold text-slate-900 dark:text-white">${(row.amount || 0).toLocaleString()}</span> },
        {
            accessorKey: 'status', header: 'Status', cell: (row: ClientInvoice) => {
                const isPaid = row.status === 'Paid';
                const colors = isPaid ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400';

                return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold rounded-full w-max ${colors}`}>
                        {isPaid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <select
                            value={row.status}
                            onChange={async (e) => {
                                await financeService.updateInvoice(row.id, { status: e.target.value as any });
                                loadData();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent text-[10px] font-bold uppercase outline-none appearance-none cursor-pointer border-none p-0 pr-1"
                        >
                            <option value="Draft">DRAFT</option>
                            <option value="Pending">PENDING</option>
                            <option value="Sent">SENT</option>
                            <option value="Paid">PAID</option>
                            <option value="Overdue">OVERDUE</option>
                        </select>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-6 w-6 text-indigo-600" /> Client Invoices
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bill your customers directly from approved projects or quotations.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({
                                client: '', date: '', dueDate: '', amount: '',
                                invoiceId: '', currency: 'USD', paymentTerms: 'Net 30', status: 'Pending', poReference: ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Generate Invoice
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={invoices}
                    onRowClick={(row) => setSelectedInvoice(row)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit Commercial Invoice" : "Issue Commercial Invoice"}
                description={isEditing ? "Modify existing invoice parameters." : "Generate a detailed billing document against rendered services or goods."}
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel Document</Button>
                        <Button variant="primary" onClick={handleSave}>{isEditing ? "Save Analysis" : "Execute Invoice Engine"}</Button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[600px] overflow-y-auto custom-scrollbar">
                    {/* Primary Entity Header */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Client Identity & Linkage</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="External Reference ID (Optional PO #)" placeholder="e.g. PO-8891-B" value={formData.poReference} onChange={(e) => setFormData({ ...formData, poReference: e.target.value })} />
                            <Select label="Registered Corporate Entity" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} options={[{ value: 'Acme Corp', label: 'Acme Corporation' }, { value: 'Initech', label: 'Initech Systems' }, { value: 'Soylent', label: 'Soylent Biotech' }]} />
                        </div>
                    </div>

                    {/* Timeline Data */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Timeline Settings</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Issuance Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            <Input label="Due / Expiration Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
                            <Select label="Global Payment Terms" value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} options={[{ value: 'Net 15', label: 'Net 15 Days' }, { value: 'Net 30', label: 'Net 30 Days' }, { value: 'Net 60', label: 'Net 60 Days' }]} />
                            <Select label="Settlement Currency" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} options={[{ value: 'USD', label: 'USD - US Dollar' }, { value: 'INR', label: 'INR - Indian Rupee' }, { value: 'EUR', label: 'EUR - Euro' }, { value: 'GBP', label: 'GBP - British Pound' }, { value: 'AUD', label: 'AUD - Australian Dollar' }, { value: 'SGD', label: 'SGD - Singapore Dollar' }]} />
                        </div>
                    </div>

                    {/* Topline Values */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Summary Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Pre-Calculated Total Liability ($)" type="number" placeholder="1000" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                            <Select label="Invoice Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Draft', label: 'Draft / Unsent' }, { value: 'Pending', label: 'Pending / Sent' }, { value: 'Paid', label: 'Settled & Paid' }, { value: 'Overdue', label: 'Overdue / Defaulted' }]} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title="Invoice Analysis Terminal"
                description="Monitor lifecycle, aging, and settlement."
                size="xl"
            >
                {selectedInvoice && (
                    <div className="flex flex-col h-[70vh] bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-indigo-500">
                            <FileText style={{ width: '200px', height: '200px' }} />
                        </div>

                        <div className="bg-gradient-to-r from-blue-950 to-indigo-900 dark:from-slate-950 dark:to-slate-900 p-6 text-white shrink-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black">
                                        <FileText className="h-6 w-6 text-indigo-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedInvoice.invoiceId}</h3>
                                            <span className={`border px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${selectedInvoice.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>{selectedInvoice.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 mb-1">
                                            Billed to <span className="font-bold text-white">{selectedInvoice.client}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => {
                                        setFormData({
                                            client: selectedInvoice!.client,
                                            date: selectedInvoice!.date,
                                            dueDate: selectedInvoice!.dueDate,
                                            amount: String(selectedInvoice!.amount || 0),
                                            invoiceId: selectedInvoice!.invoiceId,
                                            currency: 'USD',
                                            paymentTerms: 'Net 30',
                                            status: selectedInvoice!.status || 'Pending',
                                            poReference: ''
                                        });
                                        setIsEditing(true);
                                        setEditingId(selectedInvoice!.id);
                                        setSelectedInvoice(null);
                                        setIsModalOpen(true);
                                    }}>Edit Invoice</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => { }}>Share</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-indigo-900 hover:bg-slate-100 transition-colors" onClick={() => setSelectedInvoice(null)}>Exit Analyzer</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Total Liability</p>
                                    <p className="text-xl font-bold">${(selectedInvoice.amount || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Issue Origin</p>
                                    <p className="text-xl font-bold font-mono text-sm pt-0.5">{selectedInvoice.date}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Due Deadline</p>
                                    <p className="text-xl font-bold font-mono text-sm pt-0.5 text-rose-300">{selectedInvoice.dueDate}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Line Items</p>
                                    <p className="text-xl font-bold">5</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
                            {['overview', 'ledger items', 'payment portal', 'dunning history'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveViewTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeViewTab === tab ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 relative z-10">
                            {activeViewTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 dark:bg-slate-500"></div>
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Chronological Profile</h4>

                                            <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                                                <div className="relative pl-6">
                                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/50" />
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">Invoice Issued</p>
                                                    <p className="text-xs text-slate-500">{selectedInvoice.date} via Automated Cron</p>
                                                </div>
                                                <div className="relative pl-6">
                                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-slate-50 dark:ring-slate-900/50" />
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">Payment Expiration</p>
                                                    <p className="text-xs text-slate-500">{selectedInvoice.dueDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                                            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 pb-2 flex items-center justify-between">Automated Dunning</h4>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed mb-4">Reminders are actively scheduled based on corporate aging timelines.</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <span className="text-emerald-600 dark:text-emerald-500">Notice 1 (T-7)</span>
                                                    <span className="text-emerald-400">Scheduled</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <span className="text-emerald-600 dark:text-emerald-500">Notice 2 (T+1)</span>
                                                    <span className="text-emerald-400">Scheduled</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeViewTab !== 'overview' && (
                                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Architecting View Layout</h3>
                                    <p className="text-sm max-w-sm">No tabular representations loaded for '{activeViewTab}'. The data infrastructure resolves asynchronously upon client execution.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
