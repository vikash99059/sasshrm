import React, { useState, useEffect } from 'react';
import { Card, Modal, Input, Button, Select } from '../../components/ui';
import { Mail, Phone, Calendar, Plus, Users, Building2 } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { Lead, LeadStage } from '../../types/crm';

export const LeadsKanbanPage: React.FC = () => {
    const stages: LeadStage[] = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'];
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState({ companyName: '', contactName: '', email: '', stage: 'New Lead', value: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const loadLeads = () => {
        setLeads(crmService.getLeads());
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleSave = () => {
        if (!formData.companyName || !formData.contactName) return;

        if (isEditing && editingId) {
            crmService.updateLead(editingId, {
                companyName: formData.companyName,
                contactName: formData.contactName,
                email: formData.email,
                stage: formData.stage as LeadStage,
                value: Number(formData.value) || 0
            });
        } else {
            crmService.addLead({
                companyName: formData.companyName,
                contactName: formData.contactName,
                email: formData.email,
                stage: formData.stage as LeadStage,
                value: Number(formData.value) || 0,
                industry: 'Unknown'
            });
        }

        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ companyName: '', contactName: '', email: '', stage: 'New Lead', value: '' });
        loadLeads();
    };

    const handleStageChange = (leadId: string, newStage: LeadStage) => {
        crmService.updateLeadStage(leadId, newStage);
        loadLeads();
    };

    return (
        <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Lead CRM Pipeline
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage your opportunities and move them towards closing.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 flex-1 scrollbar-thin">
                {stages.map((stage) => {
                    const stageLeads = leads.filter((l) => l.stage === stage);
                    return (
                        <div key={stage} className="flex-shrink-0 w-72 rounded-2xl bg-slate-100/70 p-3 flex flex-col dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
                            <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{stage}</h3>
                                </div>
                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                                    {stageLeads.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-1 pb-4">
                                {stageLeads.map((lead) => (
                                    <Card key={lead.id} onClick={() => setSelectedLead(lead)} className="p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 border-slate-200 dark:border-slate-800 transition-colors shadow-sm bg-white dark:bg-[#0F172A]">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{lead.companyName}</h4>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{lead.contactName}</p>
                                            </div>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md">
                                                ${(lead.value || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-indigo-600 transition-colors"><Mail className="h-3.5 w-3.5" /></button>
                                                <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-indigo-600 transition-colors"><Phone className="h-3.5 w-3.5" /></button>
                                                <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-indigo-600 transition-colors"><Calendar className="h-3.5 w-3.5" /></button>
                                            </div>
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[10px] bg-slate-100 dark:bg-slate-800 border-none rounded py-1 px-2 focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
                                                value={lead.stage}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleStageChange(lead.id, e.target.value as LeadStage);
                                                }}
                                            >
                                                {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </Card>
                                ))}
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingId(null);
                                        setFormData({ companyName: '', contactName: '', email: '', stage, value: '' });
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full py-2.5 mt-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Lead
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View Details Modal */}
            <Modal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Lead Management Profile"
                description="Comprehensive view of opportunity and client information."
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => {
                            setFormData({
                                companyName: selectedLead!.companyName,
                                contactName: selectedLead!.contactName,
                                email: selectedLead!.email || '',
                                stage: selectedLead!.stage,
                                value: String(selectedLead!.value || 0)
                            });
                            setIsEditing(true);
                            setEditingId(selectedLead!.id);
                            setSelectedLead(null);
                            setIsModalOpen(true);
                        }}>Edit Lead</Button>
                        <Button variant="primary" onClick={() => setSelectedLead(null)}>Close Window</Button>
                    </div>
                }
            >
                {selectedLead && (
                    <div className="space-y-6 px-2 py-2 text-left">
                        {/* Header Banner */}
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden text-white shadow-md">
                            <div className="relative z-10 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                        <Building2 className="h-8 w-8 text-white drop-shadow-sm" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">{selectedLead.companyName}</h3>
                                        <p className="text-indigo-100 font-medium text-sm flex items-center gap-2 mt-1">
                                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-sm">{selectedLead.stage}</span>
                                            <span>Corporate Account</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-1">Opportunity Value</p>
                                    <p className="text-2xl font-black ext-white drop-shadow-md">${(selectedLead.value || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 p-1 gap-6">
                            {/* Left Column: Contact & Basic Info */}
                            <div className="space-y-5">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-slate-400" /> Point of Contact
                                </h4>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Contact Name</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedLead.contactName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Work Email</p>
                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline cursor-pointer"><Mail className="h-3.5 w-3.5" /> {selectedLead.email || 'contact@client.com'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +1 (555) 019-3824</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Company & CRM Data */}
                            <div className="space-y-5">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-slate-400" /> Company Intelligence
                                </h4>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Sector</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedLead.industry || 'Technology / Software'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Interaction</p>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Today, 10:45 AM</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lead Source</p>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Inbound Organic Form</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit Lead Opportunity" : "Create New Lead Opportunity"}
                description={isEditing ? "Update prospect details." : "Register a new prospect into the sales pipeline."}
                size="lg"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200/60 dark:bg-slate-900/50 dark:border-slate-800/60">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave}>{isEditing ? "Save Changes" : "Initialize Lead"}</Button>
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
                            options={stages.map(s => ({ value: s, label: s }))}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
