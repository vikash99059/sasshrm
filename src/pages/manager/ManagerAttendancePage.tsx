import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { TeamMember, AttendanceRegularizationRequest, OvertimeLog } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  StatCard,
  Avatar,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Zap,
  Check,
  X,
  TrendingUp,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ManagerAttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roster' | 'regularizations' | 'overtime'>('roster');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [regularizations, setRegularizations] = useState<AttendanceRegularizationRequest[]>([]);
  const [overtimeLogs, setOvertimeLogs] = useState<OvertimeLog[]>([]);

  const loadData = async () => {
    const [members, regs, ots] = await Promise.all([
      managerService.getTeamMembers(),
      managerService.getRegularizations(),
      managerService.getOvertimeLogs(),
    ]);
    setTeamMembers(members);
    setRegularizations(regs);
    setOvertimeLogs(ots);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveReg = async (id: string) => {
    await managerService.updateRegularizationStatus(id, 'Approved');
    loadData();
  };

  const handleRejectReg = async (id: string) => {
    await managerService.updateRegularizationStatus(id, 'Rejected');
    loadData();
  };

  const handleApproveOt = async (id: string) => {
    await managerService.updateOvertimeStatus(id, 'Approved');
    loadData();
  };

  const handleRejectOt = async (id: string) => {
    await managerService.updateOvertimeStatus(id, 'Rejected');
    loadData();
  };

  const presentCount = teamMembers.filter(m => m.attendanceToday === 'Present' || m.attendanceToday === 'Late').length;
  const lateCount = teamMembers.filter(m => m.attendanceToday === 'Late').length;
  const pendingRegsCount = regularizations.filter(r => r.status === 'Pending').length;
  const pendingOtHours = overtimeLogs.filter(o => o.status === 'Pending').reduce((s, o) => s + o.hours, 0);

  const rosterColumns: Column<TeamMember>[] = [
    {
      header: 'Employee',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.designation}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Today Check-In',
      accessorKey: 'checkInTime',
      cell: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.checkInTime || '—'}
          </span>
          {row.attendanceToday === 'Late' && (
            <p className="text-[10px] text-amber-600 font-medium">Late by 48m</p>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Shift & Mode',
      accessorKey: 'workMode',
      cell: (row) => (
        <div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">09:00 AM - 06:00 PM</span>
          <p className="text-[10px] text-slate-400">{row.workMode}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Attendance Status',
      accessorKey: 'attendanceToday',
      cell: (row) => {
        const variants: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
          Present: 'success',
          Late: 'warning',
          'On Leave': 'danger',
          Absent: 'neutral',
        };
        return <Badge variant={variants[row.attendanceToday] || 'neutral'}>{row.attendanceToday}</Badge>;
      },
      sortable: true,
    },
  ];

  const regColumns: Column<AttendanceRegularizationRequest>[] = [
    {
      header: 'Employee',
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
      header: 'Date & Type',
      accessorKey: 'date',
      cell: (row) => (
        <div>
          <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{formatDate(row.date)}</p>
          <Badge variant="primary" size="sm">{row.type}</Badge>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Requested Timings & Reason',
      accessorKey: 'reason',
      cell: (row) => (
        <div className="max-w-md">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.requestedCheckIn} → {row.requestedCheckOut}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{row.reason}</p>
        </div>
      ),
    },
    {
      header: 'Status & Action',
      accessorKey: 'id',
      cell: (row) => (
        <div>
          {row.status === 'Pending' ? (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                className="p-1 h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApproveReg(row.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-1 h-7 text-[11px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => handleRejectReg(row.id)}
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
        title="Team Attendance & Time Regularization"
        subtitle="Live team check-in status, missing punch regularization approvals, and overtime log tracking."
        icon={Clock}
        badge={<Badge variant="primary">{teamMembers.length} Employees</Badge>}
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present Today"
          value={presentCount.toString()}
          icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Checked In"
          isPositive={true}
        />
        <StatCard
          title="Late Logins Today"
          value={lateCount.toString()}
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Emily Clark (09:48 AM)"
          isPositive={false}
        />
        <StatCard
          title="Regularization Requests"
          value={pendingRegsCount.toString()}
          icon={<Clock className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Awaiting Approval"
          isPositive={pendingRegsCount === 0}
        />
        <StatCard
          title="Pending Overtime"
          value={`${pendingOtHours} hrs`}
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Weekend Hotfix Deploy"
          isPositive={true}
        />
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          1. Today's Team Roster
        </button>
        <button
          onClick={() => setActiveTab('regularizations')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'regularizations'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          2. Attendance Regularization Requests ({pendingRegsCount})
        </button>
        <button
          onClick={() => setActiveTab('overtime')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'overtime'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          3. Overtime Approvals ({overtimeLogs.filter(o => o.status === 'Pending').length})
        </button>
      </div>

      {/* TAB 1: ROSTER */}
      {activeTab === 'roster' && (
        <DataTable columns={rosterColumns} data={teamMembers} pageSize={10} />
      )}

      {/* TAB 2: REGULARIZATIONS */}
      {activeTab === 'regularizations' && (
        <DataTable columns={regColumns} data={regularizations} pageSize={10} />
      )}

      {/* TAB 3: OVERTIME */}
      {activeTab === 'overtime' && (
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Overtime Hours Submission & Review</h3>
            <Badge variant="primary">Overtime Multiplier: 1.5x Base</Badge>
          </div>

          <div className="space-y-3">
            {overtimeLogs.map((ot) => (
              <div
                key={ot.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={ot.avatar} name={ot.employeeName} size="md" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{ot.employeeName}</h4>
                    <p className="text-slate-500 font-medium">Project: {ot.project} • {ot.hours} Hours on {formatDate(ot.date)}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ot.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-slate-400">Est. Payout:</span>
                    <p className="font-bold text-emerald-600">₹{ot.hours * (ot.ratePerHour || 450)}</p>
                  </div>
                  {ot.status === 'Pending' ? (
                    <div className="flex gap-1.5">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => handleApproveOt(ot.id)}>
                        Approve OT
                      </Button>
                      <Button size="sm" variant="outline" className="text-rose-600 border-rose-200" onClick={() => handleRejectOt(ot.id)}>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Badge variant={ot.status === 'Approved' ? 'success' : 'danger'}>{ot.status}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
