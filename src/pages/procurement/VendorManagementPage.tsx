import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Button, Select } from '../../components/ui';
import { Package, Search, Plus, ExternalLink } from 'lucide-react';
import { procurementService, Vendor } from '../../services/procurementService';

export const VendorManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [activeViewTab, setActiveViewTab] = useState('profile');

    const [formData, setFormData] = useState({
        name: '', category: 'Hardware', contact: '', email: '',
        taxId: '', paymentTerms: 'Net 30', address: ''
    });

    const loadData = () => {
        setVendors(procurementService.getVendors());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        if (!formData.name || !formData.contact) return;

        procurementService.addVendor({
            name: formData.name,
            category: formData.category,
            contact: formData.contact,
            email: formData.email
        });

        setIsModalOpen(false);
        setFormData({ name: '', category: 'Hardware', contact: '', email: '', taxId: '', paymentTerms: 'Net 30', address: '' });
        loadData();
    };

    const columns = [
        { accessorKey: 'vendorId', header: 'Vendor ID', cell: (row: Vendor) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{row.vendorId}</span> },
        { accessorKey: 'name', header: 'Vendor Name', cell: (row: Vendor) => <span className="font-bold text-slate-900 dark:text-white">{row.name}</span> },
        { accessorKey: 'category', header: 'Category' },
        { accessorKey: 'contact', header: 'Contact Person' },
        {
            accessorKey: 'status', header: 'Status', cell: (row: Vendor) => (
                <span className="px-2 py-1 text-[10px] uppercase font-bold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {row.status}
                </span>
            )
        },
        {
            accessorKey: 'actions', header: '', cell: () => (
                <div className="flex items-center justify-end text-slate-400">
                    <ExternalLink className="h-4 w-4 hover:text-indigo-600 cursor-pointer" />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Package className="h-6 w-6 text-emerald-600" /> Vendor Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Register and manage suppliers, contractors, and procurement partners.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add Vendor
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={vendors}
                    onRowClick={(row) => setSelectedVendor(row)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register Global Vendor"
                description="Securely onboard a procurement entity into the supply chain."
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel Onboarding</Button>
                        <Button variant="primary" onClick={handleSave}>Execute Registration</Button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[550px] overflow-y-auto custom-scrollbar">
                    {/* Entity Identification */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Corporate Identity</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input label="Registered Entity Name" placeholder="e.g. Dell Enterprise Solutions" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <Select label="Primary Supply Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={[{ value: 'Hardware', label: 'Hardware & Infrastructure' }, { value: 'Software/Cloud', label: 'Softtware & Cloud SaaS' }, { value: 'Services', label: 'Professional Services' }, { value: 'Supplies', label: 'General Office Supplies' }]} />
                            <Input label="Taxpayer Registration (TIN / VAT)" placeholder="TIN-XXXX-991" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                            <div className="col-span-2">
                                <Input label="Headquarters Address" placeholder="123 Corporate Blvd..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Operational Contacts */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Account Management</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Account Executive / Director" placeholder="Mark Smith" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required />
                            <Input label="Primary Communication Base" type="email" placeholder="msmith@enterprise.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            <Select label="Settlement Priority" value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} options={[{ value: 'Net 15', label: 'Net 15 (Expedited)' }, { value: 'Net 30', label: 'Net 30 (Standard)' }, { value: 'Net 45', label: 'Net 45 (Deferred)' }]} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedVendor}
                onClose={() => setSelectedVendor(null)}
                title="Vendor Intelligence Panel"
                description="360° view of supply chain partner metrics."
                size="xl"
            >
                {selectedVendor && (
                    <div className="flex flex-col h-[70vh] bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-emerald-500">
                            <Package style={{ width: '200px', height: '200px' }} />
                        </div>

                        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 dark:from-slate-950 dark:to-slate-900 p-6 text-white shrink-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black">
                                        <Package className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedVendor.name}</h3>
                                            <span className="border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">{selectedVendor.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            <span className="text-emerald-200 uppercase tracking-widest text-[10px] items-center flex gap-1 font-bold"><ExternalLink className="h-3 w-3" /> DIRECT TIER-1 SOURCE</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Audit Compliance</Button>
                                    <Button variant="primary" className="bg-white text-emerald-900 hover:bg-slate-100" onClick={() => setSelectedVendor(null)}>Close Terminal</Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10">
                            {['profile', 'purchase orders', 'settlements', 'risk score'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveViewTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeViewTab === tab ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 relative z-10">
                            {activeViewTab === 'profile' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Blueprint</p>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white mb-2">{selectedVendor.category}</p>
                                            <p className="text-xs text-slate-500 font-medium">Strategic supply chain operational node.</p>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">System Vendor ID</p>
                                            <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{selectedVendor.vendorId}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Direct Communication Matrix</h4>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key Account Director</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedVendor.contact}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Corporate Relay Point</p>
                                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{selectedVendor.email || 'Restricted / Classified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeViewTab !== 'profile' && (
                                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Secure Channel Lock</h3>
                                    <p className="text-sm max-w-sm">The module '{activeViewTab}' requires synchronization with the ERP warehouse. Live feeds will project here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
