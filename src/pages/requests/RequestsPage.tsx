import React, { useState } from 'react';
import {
  FileQuestion,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  FileText,
  Send,
  Laptop,
  Briefcase,
  Calendar,
  DollarSign,
  X,
} from 'lucide-react';

interface EmployeeRequest {
  id: string;
  type: 'Equipment' | 'Certificate' | 'Leave' | 'Reimbursement' | 'Shift Swap';
  title: string;
  reason: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  approver: string;
}

export const RequestsPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<'Equipment' | 'Certificate' | 'Reimbursement' | 'Shift Swap'>('Equipment');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestReason, setRequestReason] = useState('');

  const [requests, setRequests] = useState<EmployeeRequest[]>([
    {
      id: 'req-1',
      type: 'Equipment',
      title: 'Ergonomic Standing Desk & Second Monitor Request',
      reason: 'Needed for remote workspace setup to increase sprint productivity.',
      submittedDate: 'Sep 05, 2025',
      status: 'Approved',
      approver: 'David Vance (Operations)',
    },
    {
      id: 'req-2',
      type: 'Certificate',
      title: 'Employment Verification Letter for Visa Processing',
      reason: 'Official company letter stating employment tenure and compensation.',
      submittedDate: 'Sep 08, 2025',
      status: 'Under Review',
      approver: 'Sneha Gupta (HR Director)',
    },
    {
      id: 'req-3',
      type: 'Shift Swap',
      title: 'Shift Swap with Rahul Sharma for Sep 15th',
      reason: 'Personal family emergency, Rahul agreed to cover the morning on-call shift.',
      submittedDate: 'Yesterday',
      status: 'Pending',
      approver: 'Amit Verma (Manager)',
    },
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim() || !requestReason.trim()) return;

    const newReq: EmployeeRequest = {
      id: `req-${Date.now()}`,
      type: requestType,
      title: requestTitle,
      reason: requestReason,
      submittedDate: 'Today',
      status: 'Pending',
      approver: 'HR Operations Desk',
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setRequestTitle('');
    setRequestReason('');
  };

  const filteredRequests = requests.filter(
    (r) => filterType === 'all' || r.type === filterType
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Company Requests & Approvals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit and track equipment requests, certificates, shift swaps, and approvals
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                  {req.type}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {req.title}
                </h3>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${
                  req.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : req.status === 'Under Review'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {req.status === 'Approved' ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {req.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {req.reason}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Submitted: {req.submittedDate}</span>
              <span>Approver: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{req.approver}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-blue-600" />
                Submit Employee Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Equipment">Hardware / Office Equipment</option>
                  <option value="Certificate">Employment / Experience Certificate</option>
                  <option value="Shift Swap">Shift Swap Request</option>
                  <option value="Reimbursement">Reimbursement Claim</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  placeholder="e.g. Ergonomic chair / Salary Certificate"
                  className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason / Purpose
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide details for the request..."
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <span>Submit Request</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
