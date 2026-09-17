import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Select, Button } from '../../components/ui';
import { Column } from '../../components/ui/DataTable';
import { FileText, Plus, Search, FileSignature, Download, MoreVertical } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { Quotation, Customer } from '../../types/crm';

export const QuotationsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
    const [quotes, setQuotes] = useState<Quotation[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [activeViewTab, setActiveViewTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        companyName: '', date: '', validity: '', total: '', description: '',
        quoteNumber: '', contactPerson: '', salesRep: '', currency: 'USD',
        paymentTerms: 'Net 30', status: 'Draft'
    });

    const loadData = () => {
        setQuotes(crmService.getQuotations());
        setCustomers(crmService.getCustomers());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        if (!formData.companyName || !formData.total) return;

        if (isEditing && editingId) {
            crmService.updateQuotation(editingId, {
                companyName: formData.companyName,
                date: formData.date || new Date().toISOString().split('T')[0],
                validity: formData.validity,
                total: Number(formData.total) || 0,
                status: formData.status as any || 'Draft',
                description: formData.description
            });
        } else {
            crmService.addQuotation({
                companyName: formData.companyName,
                date: formData.date || new Date().toISOString().split('T')[0],
                validity: formData.validity,
                total: Number(formData.total) || 0,
                status: 'Draft',
                description: formData.description
            });
        }

        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            companyName: '', date: '', validity: '', total: '', description: '',
            quoteNumber: '', contactPerson: '', salesRep: '', currency: 'USD',
            paymentTerms: 'Net 30', status: 'Draft'
        });
        loadData();
    };

    const columns: Column<Quotation>[] = [
        { accessorKey: 'quotationId', header: 'Quote #', cell: (row: Quotation) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{row.quotationId}</span> },
        { accessorKey: 'companyName', header: 'Customer', cell: (row: Quotation) => <span className="font-bold text-slate-900 dark:text-white">{row.companyName}</span> },
        { accessorKey: 'date', header: 'Date Created' },
        { accessorKey: 'validity', header: 'Valid Until' },
        { accessorKey: 'total', header: 'Amount', cell: (row: Quotation) => <span className="font-bold text-blue-600 dark:text-blue-400">${(row.total || 0).toLocaleString()}</span> },
        {
            accessorKey: 'status', header: 'Status', cell: (row: Quotation) => {
                const colors: any = {
                    'Draft': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                    'Sent': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
                    'Accepted': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
                    'Rejected': 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                };
                return (
                    <select
                        value={row.status}
                        onChange={(e) => {
                            crmService.updateQuotation(row.id, { status: e.target.value as any });
                            loadData();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 outline-none appearance-none cursor-pointer py-1 text-[10px] uppercase font-bold rounded-full ${colors[row.status] || colors.Draft}`}
                    >
                        <option value="Draft">DRAFT</option>
                        <option value="Sent">SENT</option>
                        <option value="Accepted">ACCEPTED</option>
                        <option value="Rejected">REJECTED</option>
                    </select>
                );
            }
        },
        {
            header: '', cell: () => (
                <div className="flex items-center gap-2 justify-end text-slate-400">
                    <Download className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                    <MoreVertical className="h-4 w-4 hover:text-slate-700 cursor-pointer" />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <FileSignature className="h-6 w-6 text-blue-600" /> Quotations
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Create, send, and track commercial proposals to prospective clients.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search quotes..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({
                                companyName: '', date: '', validity: '', total: '', description: '',
                                quoteNumber: '', contactPerson: '', salesRep: '', currency: 'USD',
                                paymentTerms: 'Net 30', status: 'Draft'
                            });
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> New Quote
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={quotes}
                    onRowClick={(row) => setSelectedQuote(row)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit Commercial Quote" : "Draft Commercial Proposal"}
                description={isEditing ? "Modify quote specifications and status." : "Construct a formal quotation for an established corporate client."}
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors" onClick={() => setIsModalOpen(false)}>Discard Draft</button>
                        <button className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors" onClick={handleSave}>{isEditing ? "Update Quotation" : "Generate Quotation"}</button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[600px] overflow-y-auto custom-scrollbar">
                    {/* General Quotation Details */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Document Configuration</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="System Subject / Reference Identifier" placeholder="e.g. Q-2026-X81" value={formData.quoteNumber} onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })} />
                            <Select label="Target Corporate Account" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} options={customers.map(c => ({ value: c.name, label: c.name }))} />
                            <Input label="Point of Contact" placeholder="Executive Name" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                            <Input label="Responsible Sales Executive" placeholder="Account Manager" value={formData.salesRep} onChange={(e) => setFormData({ ...formData, salesRep: e.target.value })} />
                        </div>
                    </div>

                    {/* Timeline & Commercial Terms */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Terms & Phasing</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Quotation Issuance Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            <Input label="Offer Expiration / Validity Date" type="date" value={formData.validity} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} required />
                            <Select label="Agreed Payment Terms" value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} options={[{ value: 'Net 15', label: 'Net 15 Days' }, { value: 'Net 30', label: 'Net 30 Days' }, { value: 'Advance', label: '100% Upfront Advance' }]} />
                            <Select label="Base Commercial Currency" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} options={[{ value: 'USD', label: 'USD - US Dollar' }, { value: 'INR', label: 'INR - Indian Rupee' }, { value: 'EUR', label: 'EUR - Euro' }, { value: 'GBP', label: 'GBP - British Pound' }, { value: 'AUD', label: 'AUD - Australian Dollar' }, { value: 'CAD', label: 'CAD - Canadian Dollar' }, { value: 'SGD', label: 'SGD - Singapore Dollar' }]} />
                            {isEditing && <Select label="Quotation Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} options={[{ value: 'Draft', label: 'Draft' }, { value: 'Sent', label: 'Sent' }, { value: 'Accepted', label: 'Accepted' }, { value: 'Rejected', label: 'Rejected' }]} />}
                        </div>
                    </div>

                    {/* Items Overview */}
                    <div className="space-y-4 pb-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Aggregated Financials & Scope</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <Input label="Executive Summary / Primary Scope" placeholder="e.g., Enterprise Software Licensing 2026 Tier 3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            <Input label="Calculated Projected Total ($)" type="number" placeholder="5000" value={formData.total} onChange={(e) => setFormData({ ...formData, total: e.target.value })} required />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedQuote}
                onClose={() => setSelectedQuote(null)}
                title="Commercial Quote Nexus"
                description="Detailed contractual parameters and financial scoping."
                size="xl"
            >
                {selectedQuote && (
                    <div className="flex flex-col h-[70vh] bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-slate-950 dark:to-blue-950 p-6 text-white shrink-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black">
                                        <FileSignature className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedQuote.companyName}</h3>
                                            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">{selectedQuote.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-blue-100 flex items-center gap-2">
                                            Quote ID: {selectedQuote.quotationId} • Sales Agreement Outline
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => {
                                        setFormData({
                                            companyName: selectedQuote!.companyName,
                                            date: selectedQuote!.date,
                                            validity: selectedQuote!.validity,
                                            total: String(selectedQuote!.total || 0),
                                            description: selectedQuote!.description || '',
                                            quoteNumber: selectedQuote!.quotationId,
                                            contactPerson: '',
                                            salesRep: '',
                                            currency: 'USD',
                                            paymentTerms: 'Net 30',
                                            status: selectedQuote!.status,
                                        });
                                        setIsEditing(true);
                                        setEditingId(selectedQuote!.id);
                                        setSelectedQuote(null);
                                        setIsModalOpen(true);
                                    }}>Edit Quote</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => { }}>Extract PDF</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-indigo-900 hover:bg-slate-100 transition-colors" onClick={() => setSelectedQuote(null)}>Close Overview</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Total Valuation</p>
                                    <p className="text-xl font-bold">${(selectedQuote.total || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Validity Phase</p>
                                    <p className="text-xl font-bold">{selectedQuote.validity}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Total Line Items</p>
                                    <p className="text-xl font-bold">4</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Primary Rep</p>
                                    <p className="text-xl font-bold">M. Spencer</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Bar */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
                            {['overview', 'items array', 'approval node', 'milestone timeline', 'document vault'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveViewTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeViewTab === tab ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* View Panels */}
                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 relative">
                            {activeViewTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Core Structural Data</h4>
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Operational Scope Abstract</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{selectedQuote.description || 'Standard corporate software deployment and consulting agreement.'}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Chronology</p>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{selectedQuote.date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until Epoch</p>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 text-rose-600 font-semibold">{selectedQuote.validity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">Financial Pre-requisites</h4>
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Assessment</p>
                                                    <p className="text-xl font-black text-slate-900 dark:text-white">${(selectedQuote.total || 0).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Disbursement Stipulations</p>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Net 30 Days (from Invoice generation event)</p>
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
                                    <p className="text-sm max-w-sm">No tabular representations loaded for '{activeViewTab}'. The data infrastructure resolves asynchronously upon client ratification.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
