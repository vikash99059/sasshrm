import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { TeamLeaveApplication, TeamMember } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  Modal,
  StatCard,
  Avatar,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Users,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ManagerLeavePage: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<TeamLeaveApplication[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'balances' | 'availability'>('requests');

  const loadData = async () => {
    const [reqs, members] = await Promise.all([
      managerService.getLeaveRequests(),
      managerService.getTeamMembers(),
    ]);
    setLeaveRequests(reqs);
    setTeamMembers(members);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await managerService.updateLeaveStatus(id, 'Approved');
    loadData();
  };

  const handleReject = async (id: string) => {
    await managerService.updateLeaveStatus(id, 'Rejected');
    loadData();
  };

  const pendingCount = leaveRequests.filter(l => l.status === 'Pending').length;
  const onLeaveToday = teamMembers.filter(m => m.status === 'On Leave').length;

  const requestColumns: Column<TeamLeaveApplication>[] = [
    {
      header: 'Team Member',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.avatar} name={row.employeeName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.employeeCode}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Leave Type & Duration',
      accessorKey: 'leaveType',
      cell: (row) => (
        <div>
          <Badge variant={row.leaveType === 'Sick' ? 'danger' : 'primary'} size="sm">
            {row.leaveType} Leave ({row.days} {row.days === 1 ? 'Day' : 'Days'})
          </Badge>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
            {formatDate(row.startDate)} → {formatDate(row.endDate)}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Reason & Handover',
      accessorKey: 'reason',
      cell: (row) => (
        <div className="max-w-md text-xs">
          <p className="text-slate-800 dark:text-slate-200 font-medium">{row.reason}</p>
          {row.handoverTo && (
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              Handover to: {row.handoverTo}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Status & Decision',
      accessorKey: 'id',
      cell: (row) => (
        <div>
          {row.status === 'Pending' ? (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                className="p-1 h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApprove(row.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-1 h-7 text-[11px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => handleReject(row.id)}
              >
                Reject
              </Button>
            </div>
          ) : (
            <Badge variant={row.status === 'Approved' ? 'success' : 'danger'} size="sm">
              {row.status}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Team Leave & Availability Management"
        subtitle="Review leave applications, team coverage heatmaps, remaining quotas, and planned holiday calendars."
        icon={CalendarDays}
        badge={<Badge variant="primary">{pendingCount} Pending Requests</Badge>}
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Leave Requests"
          value={pendingCount.toString()}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Action Required"
          isPositive={pendingCount === 0}
        />
        <StatCard
          title="On Leave Today"
          value={onLeaveToday.toString()}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="James Miller"
          isPositive={true}
        />
        <StatCard
          title="Team Availability Rate"
          value="93%"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Sprint Capacity Healthy"
          isPositive={true}
        />
        <StatCard
          title="Next Public Holiday"
          value="17 June"
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Bakrid / Eid al-Adha"
          isPositive={true}
        />
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          1. Leave Requests Queue ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'balances'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          2. Team Leave Balances
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'availability'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          3. Team Availability Heatmap
        </button>
      </div>

      {/* TAB 1: REQUESTS */}
      {activeTab === 'requests' && (
        <DataTable columns={requestColumns} data={leaveRequests} pageSize={10} />
      )}

      {/* TAB 2: BALANCES */}
      {activeTab === 'balances' && (
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Direct Reports Leave Ledger</h3>
              <p className="text-xs text-slate-400">Total remaining paid annual, casual, and sick leave balances</p>
            </div>
            <Badge variant="neutral">Year 2024</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Employee</th>
                  <th className="p-2.5">Annual Leave</th>
                  <th className="p-2.5">Casual Leave</th>
                  <th className="p-2.5">Sick Leave</th>
                  <th className="p-2.5">Total Taken</th>
                  <th className="p-2.5 text-right rounded-r-lg">Available Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teamMembers.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Avatar src={m.avatar} name={m.name} size="xs" />
                      <span>{m.name}</span>
                    </td>
                    <td className="p-2.5 font-medium">8 Days</td>
                    <td className="p-2.5 font-medium">4 Days</td>
                    <td className="p-2.5 font-medium">4 Days</td>
                    <td className="p-2.5 text-slate-500">6 Days</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600">{m.leavesRemaining} Days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: AVAILABILITY */}
      {activeTab === 'availability' && (
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming 14-Day Team Coverage Heatmap</h3>
              <p className="text-xs text-slate-400">Green = Available (On-site/Remote), Amber = Public Holiday, Red = On Leave</p>
            </div>
            <Badge variant="success">93% Capacity</Badge>
          </div>

          <div className="space-y-3">
            {teamMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-4 text-xs">
                <div className="w-36 font-semibold truncate text-slate-800 dark:text-slate-200">{m.name}</div>
                <div className="flex-1 grid grid-cols-14 gap-1">
                  {Array.from({ length: 14 }).map((_, idx) => {
                    const isLeave = m.name === 'Sophia Davis' && idx >= 7 && idx <= 9;
                    const isJamesLeave = m.name === 'James Miller' && idx <= 1;
                    return (
                      <div
                        key={idx}
                        title={`Day ${idx + 1}`}
                        className={`h-7 rounded-md flex items-center justify-center font-bold text-[10px] ${
                          isLeave || isJamesLeave
                            ? 'bg-rose-500 text-white'
                            : idx === 5 || idx === 6 || idx === 12 || idx === 13
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {isLeave || isJamesLeave ? 'L' : idx === 5 || idx === 6 || idx === 12 || idx === 13 ? 'W' : 'A'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
