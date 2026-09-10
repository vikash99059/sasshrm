import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { LeaveRequest, LeaveBalance, Holiday } from '../../types';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  Tabs,
} from '../../components/ui';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  Calendar,
  Sparkles,
  Paperclip,
  Check,
  X,
} from 'lucide-react';
import { formatDate } from '../../utils';
import { useAppStore } from '../../store/useAppStore';

export const LeaveManagementPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Apply Form State
  const [leaveType, setLeaveType] = useState<'Annual' | 'Casual' | 'Sick' | 'Maternity' | 'Paternity'>('Casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const { currentUser } = useAppStore();

  const loadLeaveData = async () => {
    const [reqs, bal, hols] = await Promise.all([
      leaveService.getRequests(),
      leaveService.getEmployeeBalances(),
      leaveService.getHolidays(),
    ]);
    setRequests(reqs);
    setBalances(bal);
    setHolidays(hols);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeaveData();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    await leaveService.applyLeave({
      employeeId: currentUser.id,
      employeeCode: currentUser.employeeId || 'EMP001',
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.departmentName || 'Engineering',
      leaveType,
      startDate,
      endDate,
      days: 2,
      reason,
    });
    setIsApplyModalOpen(false);
    setReason('');
    loadLeaveData();
  };

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    await leaveService.updateStatus(id, status, currentUser.name);
    loadLeaveData();
  };

  const columns: Column<LeaveRequest>[] = [
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.employeeAvatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.department} • {row.employeeCode}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Leave Type',
      accessorKey: 'leaveType',
      cell: (row) => (
        <Badge
          variant={
            row.leaveType === 'Annual'
              ? 'primary'
              : row.leaveType === 'Casual'
              ? 'warning'
              : row.leaveType === 'Sick'
              ? 'danger'
              : 'info'
          }
          size="sm"
        >
          {row.leaveType}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Duration',
      cell: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">{row.days} {row.days === 1 ? 'day' : 'days'}</p>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={row.reason}>
          {row.reason}
        </p>
      ),
    },
    {
      header: 'Applied Date',
      accessorKey: 'appliedDate',
      cell: (row) => <span className="text-xs text-slate-400">{formatDate(row.appliedDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'Approved'
              ? 'success'
              : row.status === 'Pending'
              ? 'warning'
              : 'danger'
          }
          size="sm"
          dot
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Approvals',
      cell: (row) => (
        row.status === 'Pending' ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleUpdateStatus(row.id, 'Approved')}
              className="p-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
              title="Approve Leave"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleUpdateStatus(row.id, 'Rejected')}
              className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400"
              title="Reject Leave"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">By {row.approverName || 'HR Admin'}</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave & Time Off Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage employee time off requests, annual accruals, and company holiday calendars.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsApplyModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Stats Cards (Matching Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Annual Leave"
          value={`${balances?.annual.remaining || 12} Days`}
          subtitle={`Used: ${balances?.annual.used} of ${balances?.annual.total} total`}
          icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Casual Leave"
          value={`${balances?.casual.remaining || 8} Days`}
          subtitle={`Used: ${balances?.casual.used} of ${balances?.casual.total} total`}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          title="Sick Leave"
          value={`${balances?.sick.remaining || 9} Days`}
          subtitle={`Used: ${balances?.sick.used} of ${balances?.sick.total} total`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Requests"
          value={requests.filter((r) => r.status === 'Pending').length}
          subtitle="Awaiting manager review"
          icon={<Clock className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
      </div>

      {/* Tabs: Requests Queue / Holiday Calendar */}
      <div className="space-y-4">
        <Tabs
          tabs={[
            { id: 'requests', label: 'Leave Requests Queue', count: requests.length },
            { id: 'holidays', label: 'Company Holiday Calendar', count: holidays.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        {activeTab === 'requests' ? (
          <DataTable
            columns={columns}
            data={requests}
            searchKey="employeeName"
            searchPlaceholder="Search leave requests..."
            pageSize={6}
            exportFileName="leave_requests.csv"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {holidays.map((hol) => (
              <Card key={hol.id} hoverEffect className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{formatDate(hol.date)}</span>
                  <Badge variant="primary" size="sm">{hol.type}</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{hol.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{hol.day}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave / Time Off"
        description="Submit a leave request for approval by your reporting manager."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplyLeave}>
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as any)}
            options={[
              { value: 'Annual', label: 'Annual Leave (12 days remaining)' },
              { value: 'Casual', label: 'Casual Leave (8 days remaining)' },
              { value: 'Sick', label: 'Sick Leave (9 days remaining)' },
              { value: 'Maternity', label: 'Maternity Leave' },
              { value: 'Paternity', label: 'Paternity Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for Time Off
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context for your manager..."
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
