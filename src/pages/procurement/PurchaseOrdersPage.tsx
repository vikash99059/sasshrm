import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Button, Select } from '../../components/ui';
import { ShoppingCart, Plus, Search, CheckCircle, Clock } from 'lucide-react';
import { procurementService, PurchaseOrder, Vendor } from '../../services/procurementService';

export const PurchaseOrdersPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
    const [pos, setPos] = useState<PurchaseOrder[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [activeViewTab, setActiveViewTab] = useState('summary');

    const [formData, setFormData] = useState({
        vendorName: '', deliveryDate: '', amount: '', itemsSummary: '',
        poNumber: '', requestorId: 'REQ-HRMS', budgetCode: 'OPEX-01'
    });

    const loadData = () => {
        setPos(procurementService.getPurchaseOrders());
        setVendors(procurementService.getVendors());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        if (!formData.vendorName || !formData.amount) return;

        procurementService.addPurchaseOrder({
            vendorName: formData.vendorName,
            deliveryDate: formData.deliveryDate || new Date().toISOString().split('T')[0],
            amount: Number(formData.amount),
            itemsSummary: formData.itemsSummary
        });

        setIsModalOpen(false);
        setFormData({ vendorName: '', deliveryDate: '', amount: '', itemsSummary: '', poNumber: '', requestorId: 'REQ-HRMS', budgetCode: 'OPEX-01' });
        loadData();
    };

    const columns = [
        { accessorKey: 'poNumber', header: 'PO #', cell: (row: PurchaseOrder) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{row.poNumber}</span> },
        { accessorKey: 'vendorName', header: 'Vendor' },
        { accessorKey: 'date', header: 'Issue Date' },
        { accessorKey: 'amount', header: 'Total Value', cell: (row: PurchaseOrder) => <span className="font-bold text-slate-900 dark:text-white">${(row.amount || 0).toLocaleString()}</span> },
        {
            accessorKey: 'status', header: 'Status', cell: (row: PurchaseOrder) => {
                const isApproved = row.status === 'Approved';
                return (
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold rounded-full w-max ${isApproved ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                        {isApproved ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {row.status}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-emerald-600" /> Purchase Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Issue and track POs sent to vendors for required materials and services.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search POs..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <Plus className="h-4 w-4" /> Raise PO
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={pos}
                    onRowClick={(row) => setSelectedPo(row)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Authorize Purchase Order"
                description="Draft and issue a formal commercial procurement request."
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Discard Draft</Button>
                        <Button variant="primary" onClick={handleSave}>Execute Order Engine</Button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[600px] overflow-y-auto custom-scrollbar">
                    {/* Logistics Map */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Logistical Mapping</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Select label="Authorized Global Vendor" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} options={vendors.map(v => ({ value: v.name, label: v.name }))} />
                            <Input label="Target Delivery / ETA Date" type="date" value={formData.deliveryDate} onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })} required />
                        </div>
                    </div>

                    {/* Financial Clearance */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Financial Encumbrance</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Committed Capital / Cost ($)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                            <Select label="Budget Clearance Node" value={formData.budgetCode} onChange={(e) => setFormData({ ...formData, budgetCode: e.target.value })} options={[{ value: 'OPEX-01', label: 'OPEX - Operational Spend' }, { value: 'CAPEX-00', label: 'CAPEX - Capital Asset' }, { value: 'RND-X', label: 'R&D / Labs' }]} />
                            <div className="col-span-2">
                                <Input label="Procurement Scope (Bill of Materials / Services)" placeholder="Deploy details of line items here..." value={formData.itemsSummary} onChange={(e) => setFormData({ ...formData, itemsSummary: e.target.value })} required />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedPo}
                onClose={() => setSelectedPo(null)}
                title="Procurement Order Studio"
                description="PO lineage, fulfillment pipeline, and financial settlement tracking."
                size="xl"
            >
                {selectedPo && (
                    <div className="flex flex-col h-[75vh] bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-rose-500">
                            <ShoppingCart style={{ width: '200px', height: '200px' }} />
                        </div>

                        <div className="bg-gradient-to-r from-red-950 to-rose-900 dark:from-slate-950 dark:to-slate-900 p-6 text-white shrink-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black">
                                        <ShoppingCart className="h-6 w-6 text-rose-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedPo.poNumber}</h3>
                                            <span className={`border px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${selectedPo.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>{selectedPo.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            Assigned to <span className="text-white font-bold">{selectedPo.vendorName}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Push to Vendor</Button>
                                    <Button variant="primary" className="bg-white text-rose-900 hover:bg-slate-100" onClick={() => setSelectedPo(null)}>Close Studio</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-rose-200 uppercase tracking-wider mb-1">Capital Lock</p>
                                    <p className="text-xl font-bold">${(selectedPo.amount || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-rose-200 uppercase tracking-wider mb-1">Initiation Stamp</p>
                                    <p className="text-xl font-bold font-mono text-sm pt-0.5">{selectedPo.date}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-rose-200 uppercase tracking-wider mb-1">Logistics / ETA</p>
                                    <p className="text-xl font-bold font-mono text-sm pt-0.5 text-blue-300">{selectedPo.deliveryDate}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-rose-200 uppercase tracking-wider mb-1">Received Parts</p>
                                    <p className="text-xl font-bold">0 / 12</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
                            {['summary', 'line items', 'approval chain', 'goods receipt'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveViewTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeViewTab === tab ? 'border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 relative z-10">
                            {activeViewTab === 'summary' && (
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 dark:bg-slate-500"></div>
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Requisition Details</h4>
                                            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 opacity-90 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">{selectedPo.itemsSummary}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-rose-50 dark:bg-rose-950/20 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm flex flex-col justify-between h-full">
                                            <div>
                                                <h4 className="font-bold text-rose-900 dark:text-rose-100 pb-2">Authority Signature</h4>
                                                <p className="text-sm text-rose-700 dark:text-rose-400 leading-relaxed mb-4">Issued under global OPEX delegation limits.</p>
                                            </div>
                                            <div className="flex items-center gap-3 opacity-60">
                                                <div className="h-8 w-8 rounded-full bg-rose-200 dark:bg-rose-800 flex items-center justify-center font-bold text-rose-900 dark:text-white border-pulse opacity-50">S</div>
                                                <div>
                                                    <p className="text-xs font-bold text-rose-900 dark:text-rose-100 uppercase tracking-widest">System Executed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeViewTab !== 'summary' && (
                                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <ShoppingCart className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sync Request Pending</h3>
                                    <p className="text-sm max-w-sm">Detailed views for '{activeViewTab}' are dynamically mapped via an asynchronous WMS callback.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
