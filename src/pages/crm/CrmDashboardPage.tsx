import React, { useState, useEffect } from 'react';
import { Card, Modal, Input, Button, Select } from '../../components/ui';
import { Target, Users, Building2, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { Lead } from '../../types/crm';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const mockChartData = [
    { month: 'Jan', value: 14000 },
    { month: 'Feb', value: 25000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 45000 },
    { month: 'May', value: 38000 },
    { month: 'Jun', value: 62000 },
];

export const CrmDashboardPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);

    // Form State
    const [formData, setFormData] = useState({ companyName: '', contactName: '', email: '', stage: 'New Lead', value: '' });

    const loadData = () => {
        setLeads(crmService.getLeads());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        if (!formData.companyName || !formData.contactName) return;

        crmService.addLead({
            companyName: formData.companyName,
            contactName: formData.contactName,
            email: formData.email,
            stage: formData.stage as any,
            value: Number(formData.value) || 0,
            industry: 'Unknown'
        });

        setIsModalOpen(false);
        setFormData({ companyName: '', contactName: '', email: '', stage: 'New Lead', value: '' });
        loadData();
    };

    const activeLeads = leads.length;
    const pipelineValue = leads.reduce((acc, l) => acc + (l.value || 0), 0);
    const customersCount = crmService.getCustomers().length;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">CRM Dashboard</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Monitor your sales pipeline, leads, and customer acquisition metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                    >
                        <Target className="h-4 w-4" /> Add New Lead
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Total Active Leads', value: activeLeads.toString(), icon: Users, color: 'text-blue-600' },
                    { title: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
                    { title: 'Conversion Rate', value: '18.4%', icon: TrendingUp, color: 'text-amber-500' },
                    { title: 'Active Customers', value: customersCount.toString(), icon: Building2, color: 'text-violet-600' }
                ].map((stat, idx) => (
                    <Card key={idx} className="p-5 flex items-center justify-between border-slate-200/60 shadow-sm dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-6 shadow-sm min-h-[300px]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-slate-400" /> Revenue Forecast
                    </h3>
                    <div className="h-64 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Pipeline Snapshot</h3>
                    <div className="space-y-4 flex-1">
                        {leads.slice(-4).reverse().map(lead => (
                            <div key={lead.id} onClick={() => setSelectedLead(lead)} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700/80">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lead.companyName}</h4>
                                    <p className="text-[11px] font-medium text-slate-500">{lead.contactName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">${lead.value.toLocaleString()}</p>
                                    <p className="text-[10px] uppercase font-bold text-emerald-500">{lead.stage}</p>
                                </div>
                            </div>
                        ))}
                        {leads.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No active leads</p>}
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Lead Opportunity Details"
                description="Comprehensive view of pipeline progression."
                size="md"
                footer={
                    <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="primary" onClick={() => setSelectedLead(null)}>Close Window</Button>
                    </div>
                }
            >
                {selectedLead && (
                    <div className="space-y-6 px-2 py-4 text-left">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Building2 className="h-4 w-4 text-indigo-500" /> {selectedLead.companyName}
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Name</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-slate-400" /> {selectedLead.contactName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Value</p>
                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">${(selectedLead.value || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stage</p>
                                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/40 px-2.5 py-1 rounded-md">{selectedLead.stage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Quick Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Lead Opportunity"
                description="Register a new prospect into the sales pipeline from the dashboard."
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel Application</Button>
                        <Button variant="primary" onClick={handleSave}>Initialize Lead</Button>
                    </div>
                }
            >
                <div className="space-y-6 px-2 py-4">
                    {/* Company Overview Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-indigo-500" /> Corporate Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Registered Company Name"
                                placeholder="e.g. Globex Corporation"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                            />
                            <Input
                                label="Estimated Opportunity Value (USD)"
                                type="number"
                                placeholder="50000"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Contact Person Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-500" /> Executive Contact
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Primary Contact Name"
                                placeholder="John Doe"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                required
                            />
                            <Input
                                label="Secure Email Address"
                                type="email"
                                placeholder="john@globex.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Pipeline Status */}
                    <div className="pt-2">
                        <Select
                            label="Initial Pipeline Stage"
                            value={formData.stage}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            options={[
                                { value: 'New Lead', label: 'New Lead' },
                                { value: 'Contacted', label: 'Contacted' },
                                { value: 'Qualified', label: 'Qualified' }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
