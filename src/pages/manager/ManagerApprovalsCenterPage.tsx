import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge } from '../../components/ui';
import {
  CheckSquare,
  Clock,
  Calendar,
  Receipt,
  CheckCircle2,
  XCircle,
  Briefcase,
  AlertTriangle,
  Flame,
  Check,
  CheckCheck
} from 'lucide-react';
import {
  managerService,
  TeamLeaveApplication,
  AttendanceRegularizationRequest,
  OvertimeLog,
  TeamExpenseClaim
} from '../../services/managerService';

export const ManagerApprovalsCenterPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'leave' | 'regularization' | 'overtime' | 'expense'>('all');
  const [leaves, setLeaves] = useState<TeamLeaveApplication[]>(managerService.getTeamLeaves());
  const [regs, setRegs] = useState<AttendanceRegularizationRequest[]>(managerService.getRegularizationRequests());
  const [ots, setOts] = useState<OvertimeLog[]>(managerService.getTeamOvertime());
  const [expenses, setExpenses] = useState<TeamExpenseClaim[]>(managerService.getTeamExpenses());

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const pendingRegs = regs.filter((r) => r.status === 'Pending');
  const pendingOts = ots.filter((o) => o.status === 'Pending');
  const pendingExpenses = expenses.filter((e) => e.status === 'Pending');

  const totalPending =
    pendingLeaves.length + pendingRegs.length + pendingOts.length + pendingExpenses.length;

  const handleApproveLeave = (id: string) => {
    managerService.approveLeaveRequest(id);
    setLeaves(managerService.getTeamLeaves());
  };

  const handleRejectLeave = (id: string) => {
    managerService.rejectLeaveRequest(id);
    setLeaves(managerService.getTeamLeaves());
  };

  const handleApproveReg = (id: string) => {
    managerService.approveRegularization(id);
    setRegs(managerService.getRegularizationRequests());
  };

  const handleRejectReg = (id: string) => {
    managerService.rejectRegularization(id);
    setRegs(managerService.getRegularizationRequests());
  };

  const handleApproveOt = (id: string) => {
    managerService.approveOvertime(id);
    setOts(managerService.getTeamOvertime());
  };

  const handleRejectOt = (id: string) => {
    managerService.rejectOvertime(id);
    setOts(managerService.getTeamOvertime());
  };

  const handleApproveExpense = (id: string) => {
    managerService.approveExpenseClaim(id);
    setExpenses(managerService.getTeamExpenses());
  };

  const handleRejectExpense = (id: string) => {
    managerService.rejectExpenseClaim(id);
    setExpenses(managerService.getTeamExpenses());
  };

  const handleApproveAll = () => {
    if (window.confirm(`Are you sure you want to approve all ${totalPending} pending requests?`)) {
      pendingLeaves.forEach((l) => managerService.approveLeaveRequest(l.id));
      pendingRegs.forEach((r) => managerService.approveRegularization(r.id));
      pendingOts.forEach((o) => managerService.approveOvertime(o.id));
      pendingExpenses.forEach((e) => managerService.approveExpenseClaim(e.id));

      setLeaves(managerService.getTeamLeaves());
      setRegs(managerService.getRegularizationRequests());
      setOts(managerService.getTeamOvertime());
      setExpenses(managerService.getTeamExpenses());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Unified Approvals Command Center"
        subtitle="One consolidated decision hub to review, authorize, or reject all pending team leaves, attendance corrections, overtime shifts, and expense claims."
        actions={
          totalPending > 0 ? (
            <Button
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold shadow"
              onClick={handleApproveAll}
            >
              <CheckCheck className="h-4 w-4 mr-2 text-emerald-600" />
              Approve All ({totalPending})
            </Button>
          ) : undefined
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterType('leave')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterType === 'leave'
              ? 'bg-blue-50/80 border-blue-400 dark:bg-blue-950/30'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Leave Requests
            </span>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingLeaves.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Vacation, sick & casual</p>
        </button>

        <button
          onClick={() => setFilterType('regularization')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterType === 'regularization'
              ? 'bg-amber-50/80 border-amber-400 dark:bg-amber-950/30'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Missing Punches
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingRegs.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Attendance corrections</p>
        </button>

        <button
          onClick={() => setFilterType('overtime')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterType === 'overtime'
              ? 'bg-purple-50/80 border-purple-400 dark:bg-purple-950/30'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Overtime Logs
            </span>
            <Flame className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingOts.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Extra shift authorizations</p>
        </button>

        <button
          onClick={() => setFilterType('expense')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterType === 'expense'
              ? 'bg-emerald-50/80 border-emerald-400 dark:bg-emerald-950/30'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Expense Claims
            </span>
            <Receipt className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingExpenses.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Travel & reimbursements</p>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Pending ({totalPending})
          </button>
          <button
            onClick={() => setFilterType('leave')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'leave'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Leaves ({pendingLeaves.length})
          </button>
          <button
            onClick={() => setFilterType('regularization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'regularization'
                ? 'bg-amber-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Punches ({pendingRegs.length})
          </button>
          <button
            onClick={() => setFilterType('overtime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'overtime'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Overtime ({pendingOts.length})
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'expense'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Expenses ({pendingExpenses.length})
          </button>
        </div>
      </div>

      {/* Main Unified Stream */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
        {/* Leaves */}
        {(filterType === 'all' || filterType === 'leave') &&
          pendingLeaves.map((item) => (
            <div
              key={`leave-${item.id}`}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.employeeAvatar}
                  alt={item.employeeName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      LEAVE REQUEST
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.employeeName}</h4>
                    <span className="text-xs text-gray-500">({item.leaveType})</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    <strong>Duration:</strong> {item.startDate} to {item.endDate} ({item.days} days) • <em>"{item.reason}"</em>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Applied: {item.appliedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectLeave(item.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleApproveLeave(item.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}

        {/* Regularizations */}
        {(filterType === 'all' || filterType === 'regularization') &&
          pendingRegs.map((item) => (
            <div
              key={`reg-${item.id}`}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.employeeAvatar}
                  alt={item.employeeName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      PUNCH CORRECTION
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.employeeName}</h4>
                    <span className="text-xs text-gray-500">({item.date})</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    <strong>Proposed:</strong> {item.requestedCheckIn} → {item.requestedCheckOut} (Original was: {item.originalCheckIn || 'Missing'} - {item.originalCheckOut || 'Missing'})
                  </p>
                  <p className="text-xs text-gray-500 italic mt-0.5">"{item.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectReg(item.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleApproveReg(item.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}

        {/* Overtime */}
        {(filterType === 'all' || filterType === 'overtime') &&
          pendingOts.map((item) => (
            <div
              key={`ot-${item.id}`}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.employeeAvatar}
                  alt={item.employeeName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                      OVERTIME LOG
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.employeeName}</h4>
                    <span className="text-xs text-purple-600 font-semibold">+{item.hours} hrs (${item.payoutEstimate.toFixed(2)})</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    <strong>Shift:</strong> {item.date} • <strong>Project:</strong> {item.projectTask}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectOt(item.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleApproveOt(item.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}

        {/* Expenses */}
        {(filterType === 'all' || filterType === 'expense') &&
          pendingExpenses.map((item) => (
            <div
              key={`exp-${item.id}`}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.employeeAvatar}
                  alt={item.employeeName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      EXPENSE REIMBURSEMENT
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.employeeName}</h4>
                    <span className="text-xs text-emerald-600 font-bold">${item.amount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    <strong>{item.category}:</strong> {item.description} ({item.expenseDate})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectExpense(item.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleApproveExpense(item.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              </div>
            </div>
          ))}

        {totalPending === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Caught Up!</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no pending manager approvals in your queue right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
