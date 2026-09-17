import React, { useState, useEffect } from 'react';
import { Card, DataTable, Modal, Input, Select, Button, Column } from '../../components/ui';
import { Building2, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { Customer } from '../../types/crm';

export const CustomersDatabasePage: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [vendors, setVendors] = useState<Customer[]>([]);
    const [formData, setFormData] = useState({
        name: '', contact: '', email: '', industry: 'Software', revenue: '',
        legalName: '', customerType: 'Corporate', phone: '', website: '',
        registrationNumber: '', taxId: '', address: '', paymentTerms: 'Net 30',
        status: 'Active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeViewTab, setActiveViewTab] = useState('overview');

    const loadData = () => {
        setCustomers(crmService.getCustomers());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        if (!formData.name || !formData.contact) return;

        if (isEditing && editingId) {
            crmService.updateCustomer(editingId, {
                name: formData.name,
                contact: formData.contact,
                email: formData.email,
                industry: formData.industry,
                revenue: Number(formData.revenue) || 0,
                status: formData.status as any || 'Active'
            });
        } else {
            crmService.addCustomer({
                name: formData.name,
                contact: formData.contact,
                email: formData.email,
                industry: formData.industry,
                revenue: Number(formData.revenue) || 0,
                status: formData.status as any || 'Active'
            });
        }

        setIsAddModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            name: '', contact: '', email: '', industry: 'Software', revenue: '',
            legalName: '', customerType: 'Corporate', phone: '', website: '',
            registrationNumber: '', taxId: '', address: '', paymentTerms: 'Net 30',
            status: 'Active'
        });
        loadData();
    };


    const columns: Column<Customer>[] = [
        { accessorKey: 'customerId', header: 'Client ID', cell: (row: Customer) => <span className="font-mono text-[11px] text-slate-400">{row.customerId}</span> },
        {
            accessorKey: 'name',
            header: 'Company Name',
            cell: (row: Customer) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{row.name}</p>
                        <p className="text-[#1bd] text-[10px] text-slate-500">{row.industry}</p>
                    </div>
                </div>
            )
        },
        { accessorKey: 'contact', header: 'Primary Contact' },
        {
            accessorKey: 'status', header: 'Status', cell: (row: Customer) => (
                <div className="flex border border-transparent hover:border-slate-200 dark:hover:border-slate-700 w-max rounded-full transition-colors">
                    <select
                        value={row.status}
                        onChange={(e) => {
                            crmService.updateCustomer(row.id, { status: e.target.value as any });
                            loadData();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full appearance-none outline-none cursor-pointer border-none bg-transparent ${row.status === 'Active' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'}`}
                    >
                        <option value="Active">ACTIVE</option>
                        <option value="Inactive">INACTIVE</option>
                    </select>
                </div>
            )
        },
        { accessorKey: 'revenue', header: 'LTV / Revenue', cell: (row: Customer) => <span className="font-bold text-slate-900 dark:text-white">${(row.revenue || 0).toLocaleString()}</span> },
        {
            header: '', cell: () => (
                <div className="flex items-center gap-2 justify-end text-slate-400">
                    <Mail className="h-4 w-4 hover:text-indigo-600 cursor-pointer" />
                    <Phone className="h-4 w-4 hover:text-indigo-600 cursor-pointer" />
                    <ExternalLink className="h-4 w-4 hover:text-indigo-600 cursor-pointer" />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Customer Database
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Master list of all acquired clients, lifetime values, and contacts.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setFormData({
                                name: '', contact: '', email: '', industry: 'Software', revenue: '',
                                legalName: '', customerType: 'Corporate', phone: '', website: '',
                                registrationNumber: '', taxId: '', address: '', paymentTerms: 'Net 30',
                                status: 'Active'
                            });
                            setIsAddModalOpen(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <Building2 className="h-4 w-4" /> Add Company
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={customers}
                    onRowClick={(row) => setSelectedCustomer(row)}
                />
            </Card>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={isEditing ? "Update Master Customer Profile" : "Register Master Customer Profile"}
                description={isEditing ? "Modify corporate, financial, and contact configurations." : "Input complete corporate, financial, and contact details."}
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl" onClick={() => setIsAddModalOpen(false)}>Cancel Registration</button>
                        <button className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl" onClick={handleSave}>{isEditing ? "Apply Changes" : "Confirm Entity"}</button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4 h-[600px] overflow-y-auto custom-scrollbar">
                    {/* Basic Company Section */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Business Identity</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Company / Entity Name" placeholder="e.g. Acme Corporation" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <Input label="Legal Entity Name" placeholder="Acme Global Inc." value={formData.legalName} onChange={(e) => setFormData({ ...formData, legalName: e.target.value })} />
                            <Select label="Customer Classification" value={formData.customerType} onChange={(e) => setFormData({ ...formData, customerType: e.target.value })} options={[{ value: 'Corporate', label: 'B2B (Corporate)' }, { value: 'Retail', label: 'B2C (Retail)' }, { value: 'Government', label: 'Government / Public Sector' }]} />
                            <Select label="Industry Sector" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} options={[{ value: 'Software', label: 'Software & Technology' }, { value: 'Finance', label: 'Financial Services' }, { value: 'Healthcare', label: 'Healthcare' }, { value: 'Retail', label: 'Retail & E-commerce' }, { value: 'Manufacturing', label: 'Manufacturing' }, { value: 'Hardware', label: 'Hardware' }, { value: 'BioTech', label: 'BioTech' }]} />
                            {isEditing && <Select label="Operation Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'Active', label: 'Active - Billing Enabled' }, { value: 'Inactive', label: 'Inactive - Suspended' }]} />}
                        </div>
                    </div>

                    {/* Tax & Commercial Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Financial & Commercial Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Business Registration Number (CIN)" placeholder="e.g. U72900KA2026PTC..." value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} />
                            <Input label="Tax ID (GST/VAT/PAN)" placeholder="e.g. 29AAAAA0000Z1Z5" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                            <Select label="Agreed Payment Terms" value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} options={[{ value: 'Net 15', label: 'Net 15 Days' }, { value: 'Net 30', label: 'Net 30 Days' }, { value: 'Net 60', label: 'Net 60 Days' }, { value: 'Advance', label: 'Full Payment in Advance' }]} />
                            <Input label="Projected / Current LTV Revenue ($)" type="number" placeholder="50000" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} />
                        </div>
                    </div>

                    {/* Contact Identity */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Primary Contact Authority</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Focal Point Name" placeholder="Jane Doe" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required />
                            <Input label="Professional Email" type="email" placeholder="jane@acme.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            <Input label="Direct Phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            <Input label="Corporate Domain" placeholder="https://acmecorp.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                        </div>
                    </div>

                    {/* Address Identity */}
                    <div className="space-y-4 pb-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Headquarters Address</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <Input label="Complete Registered Address" placeholder="100 Silicon Way, Suite 400..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                title="Customer Unified Console"
                description="360° overview of relationship, finances, and active contacts."
                size="xl"
            >
                {selectedCustomer && (
                    <div className="flex flex-col h-[70vh] bg-slate-50 dark:bg-slate-900 rounded-b-2xl overflow-hidden w-full">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-slate-950 dark:to-indigo-950 p-6 text-white shrink-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center font-black text-3xl text-white">
                                        {selectedCustomer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-2xl tracking-tight leading-none">{selectedCustomer.name}</h3>
                                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">{selectedCustomer.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-indigo-200 flex items-center gap-2">
                                            ID: {selectedCustomer.customerId} • Corporate Entity • Key Account
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => {
                                        setFormData({
                                            name: selectedCustomer!.name,
                                            contact: selectedCustomer!.contact,
                                            email: selectedCustomer!.email || '',
                                            industry: selectedCustomer!.industry || 'Software',
                                            revenue: String(selectedCustomer!.revenue || 0),
                                            legalName: '',
                                            customerType: 'Corporate',
                                            phone: '',
                                            website: '',
                                            registrationNumber: '',
                                            taxId: '',
                                            address: '',
                                            paymentTerms: 'Net 30',
                                            status: selectedCustomer!.status || 'Active'
                                        });
                                        setIsEditing(true);
                                        setEditingId(selectedCustomer!.id);
                                        setSelectedCustomer(null);
                                        setIsAddModalOpen(true);
                                    }}>Edit Customer</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors" onClick={() => { }}>Generate Invoice</button>
                                    <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-indigo-900 hover:bg-slate-100 transition-colors" onClick={() => setSelectedCustomer(null)}>Close Overview</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Lifetime Revenue</p>
                                    <p className="text-xl font-bold">${(selectedCustomer.revenue || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Outstanding</p>
                                    <p className="text-xl font-bold">$12,450</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Active Projects</p>
                                    <p className="text-xl font-bold">3</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">Credit Days limits</p>
                                    <p className="text-xl font-bold">Net 30</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Bar */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0">
                            {['overview', 'contacts', 'invoices', 'opportunities', 'documents'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveViewTab(tab)}
                                    className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeViewTab === tab ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* View Panels */}
                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900">
                            {activeViewTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Corporate Intelligence</h4>
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Classification</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedCustomer.industry}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key Regulatory Identifiers</p>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">GST: 29AAAAA0000Z1Z5</p>
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">PAN: AAAAA0000B</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">Primary Contact <Button variant="ghost" className="h-6 text-[10px]">Edit Contact</Button></h4>
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Executive Name</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedCustomer.contact}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Email</p>
                                                        <p className="text-sm flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer"><Mail className="h-3.5 w-3.5" /> {selectedCustomer.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeViewTab !== 'overview' && (
                                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Records Evaluated</h3>
                                    <p className="text-sm max-w-sm">No linked datastores found for {activeViewTab} correlated to this customer yet. Interact with module logic directly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
