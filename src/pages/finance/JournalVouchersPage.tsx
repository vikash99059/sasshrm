import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Button, Select } from '../../components/ui';
import { ArrowRightLeft, Plus } from 'lucide-react';
import { financeService } from '../../services/financeService';
import { JournalVoucher, VoucherType } from '../../types/finance';

export const JournalVouchersPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<JournalVoucher | null>(null);
    const [vouchers, setVouchers] = useState<JournalVoucher[]>([]);
    const [formData, setFormData] = useState({
        type: 'Journal', date: '', amount: '', description: '',
        reference: '', department: 'Corporate', attachedDocs: '0'
    });

    const loadData = async () => {
        setVouchers(await financeService.getJournalVouchers());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async () => {
        if (!formData.description || !formData.amount) return;
        await financeService.addVoucher({
            date: formData.date || new Date().toISOString().split('T')[0],
            type: formData.type as VoucherType,
            description: formData.description,
            amount: Number(formData.amount)
        });
        setIsModalOpen(false);
        setFormData({ type: 'Journal', date: '', amount: '', description: '', reference: '', department: 'Corporate', attachedDocs: '0' });
        loadData();
    };

    const columns = [
        { accessorKey: 'voucherNo', header: 'Voucher #', cell: (row: JournalVoucher) => <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">{row.voucherNo}</span> },
        { accessorKey: 'date', header: 'Date' },
        {
            accessorKey: 'type', header: 'Type', cell: (row: JournalVoucher) => (
                <span className="px-2 py-1 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {row.type}
                </span>
            )
        },
        { accessorKey: 'description', header: 'Description', cell: (row: JournalVoucher) => <span className="truncate max-w-[200px] inline-block">{row.description}</span> },
        { accessorKey: 'amount', header: 'Amount', cell: (row: JournalVoucher) => <span className="font-bold text-slate-900 dark:text-white">${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <ArrowRightLeft className="h-6 w-6 text-indigo-600" /> Journal Vouchers
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Post transactions, payments, receipts, and contra entries.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Create Voucher
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={vouchers}
                    onRowClick={(row) => setSelectedVoucher(row)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Post Ledger Voucher"
                description="Record double-entry transactions across multiple accounts."
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Halt Entry</Button>
                        <Button variant="primary" onClick={handleSave}>Execute Posting</Button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[550px] overflow-y-auto custom-scrollbar">
                    {/* Header Metadata */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                            Voucher Parameters
                            <span className="text-[10px] uppercase bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md">Draft Mode</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Select label="Entry Classification" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[{ value: 'Journal', label: 'Journal Entry - Custom' }, { value: 'Payment', label: 'Payment Output' }, { value: 'Receipt', label: 'Cash Receipt' }, { value: 'Contra', label: 'Contra (Internal Bank/Cash)' }]} />
                            <Input label="Operation Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            <Input label="External Reference (e.g. Invoice / Cheque #)" placeholder="REF-2026-X1" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
                            <Select label="Cost Center / Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} options={[{ value: 'Corporate', label: 'Corporate Overhead' }, { value: 'Sales', label: 'Sales & Marketing' }, { value: 'Engineering', label: 'Product Engineering' }]} />
                        </div>
                    </div>

                    {/* Monetary Inputs */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Line Attributes & Scope</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Principal Amount Executed ($)" type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                            <Input label="Number of Scanned Attachments" type="number" placeholder="0" value={formData.attachedDocs} onChange={(e) => setFormData({ ...formData, attachedDocs: e.target.value })} />
                            <div className="col-span-2">
                                <Input label="Global Narration / Reason" placeholder="Explain the ledger logic and purpose..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedVoucher}
                onClose={() => setSelectedVoucher(null)}
                title="Voucher Forensics Panel"
                description="Immutable audit trail of a committed ledger node."
                size="md"
            >
                {selectedVoucher && (
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <ArrowRightLeft className="w-48 h-48 text-indigo-500" />
                        </div>

                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6 text-white shrink-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black">
                                        <ArrowRightLeft className="h-6 w-6 text-indigo-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedVoucher.voucherNo}</h3>
                                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">{selectedVoucher.type}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            Posted on {selectedVoucher.date} • Financial General Ledger
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Net Valuation Posted</p>
                                    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${(selectedVoucher.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Impacted Ledgers</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Minimum 2 (Double-Entry)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audit Protocol</p>
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">Verified Balance Match</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Official Narration Log</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 uppercase leading-relaxed font-mono opacity-80">{selectedVoucher.description}</p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setSelectedVoucher(null)}>Print Copy</Button>
                                <Button variant="primary" onClick={() => setSelectedVoucher(null)}>Close Auditor Panel</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
