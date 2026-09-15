import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Building2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';
import { ManpowerRequirement } from '../../types';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

export const ManpowerRequirementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'workforce';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [requirements, setRequirements] = useState<ManpowerRequirement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<ManpowerRequirement | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [requiredHeadcount, setRequiredHeadcount] = useState(1);
  const [existingHeadcount, setExistingHeadcount] = useState(5);
  const [requiredDate, setRequiredDate] = useState('2025-07-31');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [reason, setReason] = useState('');
  const [budget, setBudget] = useState('$130,000 - $160,000 / year');

  const loadRequirements = async () => {
    const list = await recruitmentService.getManpowerRequirements();
    setRequirements(list);
  };

  useEffect(() => {
    loadRequirements();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await recruitmentService.createManpowerRequirement({
      position,
      department,
      requiredHeadcount: Number(requiredHeadcount),
      existingHeadcount: Number(existingHeadcount),
      requiredDate,
      priority,
      reason,
      budgetAllocated: budget,
    });
    setIsCreateOpen(false);
    setPosition('');
    setReason('');
    loadRequirements();
  };

  const handleStatusChange = async (id: string, newStatus: ManpowerRequirement['approvalStatus']) => {
    await recruitmentService.updateManpowerStatus(id, newStatus, 'Elena Rostova (Recruiter Review)');
    loadRequirements();
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, approvalStatus: newStatus });
    }
  };

  const handleCreateRequisitionFromReq = (req: ManpowerRequirement) => {
    navigate(`/recruiter/requisitions?fromReq=${req.id}&title=${encodeURIComponent(req.position)}&dept=${encodeURIComponent(req.department)}`);
  };

  // Filtered requirements
  const filtered = requirements.filter((item) => {
    // Tab filter
    if (activeTab === 'pending' && item.approvalStatus !== 'Pending Approval') return false;
    if (activeTab === 'departments' && deptFilter !== 'All' && item.department !== deptFilter) return false;

    // Standard filters
    if (deptFilter !== 'All' && item.department !== deptFilter) return false;
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && item.approvalStatus !== statusFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.position.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.requestedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Recruitment</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Manpower Requirements</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Manpower Requirements</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {requirements.length} Requests
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review department headcount requests, workload justifications, and initiate hiring requisitions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Manpower Request</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'workforce', label: 'Workforce Requests', count: requirements.length },
          { id: 'departments', label: 'Department Requirements', count: requirements.filter(r => r.department === 'Engineering').length },
          { id: 'positions', label: 'Position Requirements', count: requirements.reduce((acc, r) => acc + r.requiredHeadcount, 0) },
          { id: 'pending', label: 'Pending Approvals', count: requirements.filter(r => r.approvalStatus === 'Pending Approval').length, badge: 'urgent' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search position, request ID, requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Select
          label=""
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Departments' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Product & Design', label: 'Product & Design' },
            { value: 'Sales & Growth', label: 'Sales & Growth' },
            { value: 'Customer Success', label: 'Customer Success' },
          ]}
        />

        <Select
          label=""
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Priorities' },
            { value: 'Urgent', label: 'Urgent' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
        />

        <Select
          label=""
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Pending Approval', label: 'Pending Approval' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
        />
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">Req. / Curr.</th>
                <th className="py-3 px-3">Required Date</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Requested By</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    <div>
                      <span>{item.position}</span>
                      <span className="block text-[10px] text-slate-400 font-normal truncate max-w-xs">
                        {item.budgetAllocated}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {item.department}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    <span className="text-blue-600 dark:text-blue-400 font-black">+{item.requiredHeadcount}</span>
                    <span className="text-slate-400 font-normal"> / {item.existingHeadcount}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {item.requiredDate}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : item.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.requestedBy}</p>
                    <p className="text-[10px] text-slate-400">{item.requestedByRole}</p>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        item.approvalStatus === 'Approved'
                          ? 'success'
                          : item.approvalStatus === 'Rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                      dot
                    >
                      {item.approvalStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedReq(item);
                          setIsDetailsOpen(true);
                        }}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {item.approvalStatus === 'Approved' ? (
                        <button
                          onClick={() => handleCreateRequisitionFromReq(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 text-[11px] font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Requisition</span>
                        </button>
                      ) : item.approvalStatus === 'Pending Approval' ? (
                        <button
                          onClick={() => handleStatusChange(item.id, 'Approved')}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No manpower requirements match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Submit Manpower Headcount Request" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Position Title"
            placeholder="e.g. Lead Systems Reliability Architect"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product & Design', label: 'Product & Design' },
                { value: 'Sales & Growth', label: 'Sales & Growth' },
                { value: 'Customer Success', label: 'Customer Success' },
                { value: 'Finance', label: 'Finance' },
              ]}
            />
            <Select
              label="Hiring Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: 'Urgent', label: 'Urgent' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Required Headcount"
              type="number"
              value={requiredHeadcount}
              onChange={(e) => setRequiredHeadcount(Number(e.target.value))}
              min={1}
            />
            <Input
              label="Current Team Size"
              type="number"
              value={existingHeadcount}
              onChange={(e) => setExistingHeadcount(Number(e.target.value))}
              min={0}
            />
            <Input
              label="Target Need Date"
              type="date"
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              required
            />
          </div>
          <Input
            label="Allocated Annual Budget"
            placeholder="e.g. $140,000 - $170,000 / year"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business Justification & Goals
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this headcount is required, key projects, and revenue/delivery impact..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Manpower Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* DETAILS MODAL */}
      {selectedReq && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={`Manpower Request: ${selectedReq.id}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedReq.position}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedReq.department} • Requested by {selectedReq.requestedBy} ({selectedReq.requestedByRole})
                </p>
              </div>
              <Badge
                variant={
                  selectedReq.approvalStatus === 'Approved'
                    ? 'success'
                    : selectedReq.approvalStatus === 'Rejected'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
                dot
              >
                {selectedReq.approvalStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">HEADCOUNT NEED</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">+{selectedReq.requiredHeadcount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">CURRENT TEAM</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{selectedReq.existingHeadcount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">PRIORITY</span>
                <span className="text-sm font-black text-amber-600">{selectedReq.priority}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TARGET DATE</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{selectedReq.requiredDate}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Business Justification</h4>
              <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                {selectedReq.reason}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Allocated Budget</h4>
              <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                {selectedReq.budgetAllocated}
              </p>
            </div>

            {selectedReq.approvedBy && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-medium">
                Approved by: <span className="font-bold">{selectedReq.approvedBy}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {selectedReq.approvalStatus === 'Pending Approval' && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(selectedReq.id, 'Approved')}
                    >
                      Approve Request
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(selectedReq.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedReq.approvalStatus === 'Approved' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleCreateRequisitionFromReq(selectedReq);
                    }}
                  >
                    Convert to Job Requisition →
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
