import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowRight,
  User,
  Building2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface LeaveRequestItem {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export const LeaveRequestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [requests, setRequests] = useState<LeaveRequestItem[]>([
    {
      id: 'LR-101',
      employeeName: 'Sarah Wilson',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Marketing',
      leaveType: 'Annual Leave',
      startDate: '2024-05-27',
      endDate: '2024-05-29',
      durationDays: 3,
      reason: 'Family vacation and personal travel',
      status: 'Pending',
      appliedOn: 'May 18, 2024',
    },
    {
      id: 'LR-102',
      employeeName: 'David Miller',
      employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      leaveType: 'Sick Leave',
      startDate: '2024-05-20',
      endDate: '2024-05-21',
      durationDays: 2,
      reason: 'Medical appointment & recovery',
      status: 'Approved',
      appliedOn: 'May 16, 2024',
    },
    {
      id: 'LR-103',
      employeeName: 'Elena Rostova',
      employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      department: 'Product',
      leaveType: 'Casual Leave',
      startDate: '2024-05-24',
      endDate: '2024-05-24',
      durationDays: 1,
      reason: 'Attending family celebration',
      status: 'Pending',
      appliedOn: 'May 17, 2024',
    },
    {
      id: 'LR-104',
      employeeName: 'Marcus Vance',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Operations',
      leaveType: 'Annual Leave',
      startDate: '2024-06-01',
      endDate: '2024-06-05',
      durationDays: 5,
      reason: 'Summer holiday with family',
      status: 'Pending',
      appliedOn: 'May 19, 2024',
    },
    {
      id: 'LR-105',
      employeeName: 'Chloe Davis',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'Sales',
      leaveType: 'Unpaid Leave',
      startDate: '2024-05-15',
      endDate: '2024-05-18',
      durationDays: 4,
      reason: 'Extended personal leave',
      status: 'Rejected',
      appliedOn: 'May 10, 2024',
    },
  ]);

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const filtered = requests.filter(r => {
    const matchesSearch = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leave Requests Queue
            </h1>
            <Badge variant="warning">{requests.filter(r => r.status === 'Pending').length} Pending</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review, approve, or reject employee time-off applications and PTO requests.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsApplyModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Apply on Behalf
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pending Approvals</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {requests.filter(r => r.status === 'Pending').length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Requires manager / HR sign-off</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Approved This Month</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {requests.filter(r => r.status === 'Approved').length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Scheduled on company calendar</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Rejected / Cancelled</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {requests.filter(r => r.status === 'Rejected').length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Quota restored to balance</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or leave reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Dates & Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{req.employeeName}</div>
                        <div className="text-slate-400 text-[11px]">{req.department} · Applied {req.appliedOn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{req.leaveType}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {req.startDate} to {req.endDate}
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{req.durationDays} day(s)</span>
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      req.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        req.status === 'Approved' ? 'bg-emerald-500' :
                        req.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'Approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-semibold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Leave Application"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsApplyModalOpen(false); }} className="space-y-4">
          <Input label="Employee Full Name" placeholder="e.g. Sarah Wilson" required />
          <Select
            label="Leave Type"
            options={[
              { value: 'annual', label: 'Annual Leave (Paid)' },
              { value: 'sick', label: 'Sick Leave (Paid)' },
              { value: 'casual', label: 'Casual Leave (Paid)' },
              { value: 'maternity', label: 'Maternity / Paternity Leave' },
              { value: 'unpaid', label: 'Unpaid Leave' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" defaultValue="2024-05-27" required />
            <Input label="End Date" type="date" defaultValue="2024-05-29" required />
          </div>
          <Input label="Reason for Leave" placeholder="Describe the purpose of time off" required />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default LeaveRequestsPage;
