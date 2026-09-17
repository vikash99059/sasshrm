import React, { useState } from 'react';
import { Card, DataTable, Modal, Input, Select } from '../../components/ui';
import { Briefcase, Download, Filter, Target, Plus } from 'lucide-react';

export const ProjectCostingPage: React.FC = () => {
    const [projects, setProjects] = useState([
        { id: 1, projectId: 'PRJ-801', name: 'ERP Implementation', budget: 150000, actual: 120400, variance: 29600, status: 'On Track' },
        { id: 2, projectId: 'PRJ-802', name: 'Office Renovation', budget: 45000, actual: 51200, variance: -6200, status: 'Over Budget' },
        { id: 3, projectId: 'PRJ-803', name: 'Cloud Migration', budget: 85000, actual: 35000, variance: 50000, status: 'On Track' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', budget: '', actual: '', status: 'On Track' });

    const handleSave = () => {
        if (!formData.name) return;
        const b = Number(formData.budget) || 0;
        const a = Number(formData.actual) || 0;
        const v = b - a;
        if (isEditing && selectedProject) {
            setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, name: formData.name, budget: b, actual: a, variance: v, status: formData.status } : p));
        } else {
            setProjects([...projects, {
                id: Date.now(),
                projectId: `PRJ-80${projects.length + 4}`,
                name: formData.name,
                budget: b,
                actual: a,
                variance: v,
                status: formData.status
            }]);
        }
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedProject(null);
        setFormData({ name: '', budget: '', actual: '', status: 'On Track' });
    };

    const columns = [
        { key: 'projectId', header: 'Project Code', render: (val: string) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{val}</span> },
        { key: 'name', header: 'Project Name', render: (val: string) => <span className="font-bold text-slate-900 dark:text-white">{val}</span> },
        { key: 'budget', header: 'Allocated Budget', render: (val: number) => <span className="font-medium text-slate-600 dark:text-slate-400">${val.toLocaleString()}</span> },
        { key: 'actual', header: 'Actual Cost (Burn)', render: (val: number) => <span className="font-bold text-slate-900 dark:text-white">${val.toLocaleString()}</span> },
        {
            key: 'variance', header: 'Variance', render: (val: number) => {
                const isNegative = val < 0;
                return (
                    <span className={`font-bold ${isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isNegative ? '-' : '+'}${Math.abs(val).toLocaleString()}
                    </span>
                );
            }
        },
        {
            key: 'status', header: 'Status', render: (val: string, row: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <select
                        value={val}
                        onChange={(e) => {
                            setProjects(projects.map(p => p.id === row.id ? { ...p, status: e.target.value } : p));
                        }}
                        className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full w-max appearance-none outline-none cursor-pointer border-none ${val === 'On Track' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'}`}
                    >
                        <option value="On Track">ON TRACK</option>
                        <option value="Over Budget">OVER BUDGET</option>
                    </select>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Target className="h-6 w-6 text-amber-600" /> Project Costing
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Track resource burn rates and spending against allocated project budgets.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setIsEditing(false); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 transition-colors">
                        <Plus className="h-4 w-4" /> Add Project
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable columns={columns} data={projects} keyField="id" onRowClick={(row) => setSelectedProject(row)} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Project Costing' : 'Initialize Project Costing'}
                description={isEditing ? 'Update burn rates and budgets.' : 'Allocate new capital towards initiatives.'}
                size="md"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
                        <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl" onClick={handleSave}>{isEditing ? 'Update Project' : 'Allocate Capital'}</button>
                    </div>
                }
            >
                <div className="space-y-4 px-2 py-4">
                    <Input label="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Allocated Budget" type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required />
                    <Input label="Actual Cost (Burn)" type="number" value={formData.actual} onChange={(e) => setFormData({ ...formData, actual: e.target.value })} required />
                    <Select label="Project Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'On Track', label: 'On Track' }, { value: 'Over Budget', label: 'Over Budget' }]} />
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title="Project Analysis"
                description="View capital allocation metrics."
                size="md"
                footer={
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
                        <button className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl" onClick={() => {
                            setFormData({ name: selectedProject.name, budget: selectedProject.budget, actual: selectedProject.actual, status: selectedProject.status });
                            setIsEditing(true);
                            setIsModalOpen(true);
                        }}>Edit Project</button>
                        <button className="px-4 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl" onClick={() => setSelectedProject(null)}>Close</button>
                    </div>
                }
            >
                {selectedProject && (
                    <div className="p-6 space-y-4">
                        <h3 className="font-bold text-xl">{selectedProject.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400">BUDGET</p>
                                <p className="font-bold">${selectedProject.budget.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400">ACTUAL SPEND</p>
                                <p className="font-bold">${selectedProject.actual.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
