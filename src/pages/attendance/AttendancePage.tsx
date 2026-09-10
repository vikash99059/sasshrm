import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types';
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
} from '../../components/ui';
import {
  UserCheck,
  UserX,
  Clock,
  Calendar,
  Home,
  Briefcase,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils';
import { useAppStore } from '../../store/useAppStore';

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState('May 2024');
  const navigate = useNavigate();
  const { isClockedIn } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      const [recs, st] = await Promise.all([
        attendanceService.getRecords(),
        attendanceService.getTodayStats(),
      ]);
      setRecords(recs);
      setStats(st);
    };
    loadData();
  }, []);

  const columns: Column<AttendanceRecord>[] = [
    {
      header: 'Employee Name',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.employeeAvatar} name={row.employeeName} size="sm" status="online" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.employeeName}</p>
            <p className="text-[10px] text-slate-400">{row.department}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => <span className="text-xs">{formatDate(row.date)}</span>,
      sortable: true,
    },
    {
      header: 'Clock In',
      accessorKey: 'clockIn',
      cell: (row) => <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">{row.clockIn}</span>,
    },
    {
      header: 'Clock Out',
      accessorKey: 'clockOut',
      cell: (row) => <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">{row.clockOut}</span>,
    },
    {
      header: 'Working Hours',
      accessorKey: 'workingHours',
      cell: (row) => (
        <span className="text-xs font-semibold">{row.workingHours > 0 ? `${row.workingHours} hrs` : '--'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'Present'
              ? 'success'
              : row.status === 'Late'
              ? 'warning'
              : row.status === 'On Leave'
              ? 'info'
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
  ];

  // 31-day mock attendance calendar grid for May 2024
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const isWeekend = dayNum % 7 === 5 || dayNum % 7 === 6;
    let status = 'present';
    if (isWeekend) status = 'weekend';
    else if (dayNum === 18) status = 'late';
    else if (dayNum === 20) status = 'leave';
    else if (dayNum === 27) status = 'holiday';
    return { day: dayNum, status };
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Clock-in Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attendance & Time Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time biometric attendance logs, shift rosters, and web check-in logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-slate-300">
            May 20, 2024
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/clock-in')}
            variant={isClockedIn ? 'danger' : 'primary'}
            leftIcon={isClockedIn ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
          >
            {isClockedIn ? 'Clock Out Now' : 'Live Clock In'}
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Present"
          value={stats?.present || 112}
          change="+4%"
          isPositive={true}
          icon={<UserCheck className="h-4 w-4 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Absent"
          value={stats?.absent || 4}
          change="-1%"
          isPositive={true}
          icon={<UserX className="h-4 w-4 text-rose-600" />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
        />
        <StatCard
          title="Late"
          value={stats?.late || 6}
          change="+2%"
          isPositive={false}
          icon={<Clock className="h-4 w-4 text-amber-600" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          title="Half Day"
          value={stats?.halfDay || 3}
          change="0%"
          isPositive={true}
          icon={<Briefcase className="h-4 w-4 text-indigo-600" />}
          iconBgColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
        />
        <StatCard
          title="On Leave"
          value={stats?.onLeave || 8}
          change="-2%"
          isPositive={true}
          icon={<Calendar className="h-4 w-4 text-purple-600" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          title="Remote (WFH)"
          value={stats?.wfh || 5}
          change="+5%"
          isPositive={true}
          icon={<Home className="h-4 w-4 text-cyan-600" />}
          iconBgColor="bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
        />
      </div>

      {/* Attendance Matrix Calendar + Today's Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance Calendar Matrix (Matching Reference) */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Attendance Calendar</CardTitle>
              <p className="text-xs text-slate-500">May 2024 overview</p>
            </div>
            <span className="text-xs font-bold text-blue-600">May 2024</span>
          </CardHeader>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="font-bold text-slate-400 text-[10px]">{day}</span>
            ))}

            {daysInMonth.map((d) => (
              <div
                key={d.day}
                className={`h-9 rounded-lg flex flex-col items-center justify-center font-semibold text-xs transition-all ${
                  d.status === 'present'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : d.status === 'late'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : d.status === 'leave'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : d.status === 'holiday'
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                    : 'bg-slate-50 text-slate-400 dark:bg-slate-800/40 dark:text-slate-500'
                }`}
              >
                <span>{d.day}</span>
                {d.status === 'present' && <span className="h-1 w-1 rounded-full bg-emerald-500" />}
                {d.status === 'late' && <span className="h-1 w-1 rounded-full bg-amber-500" />}
                {d.status === 'leave' && <span className="h-1 w-1 rounded-full bg-blue-500" />}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] pt-3 border-t border-slate-100 dark:border-dark-border justify-between">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Present</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Late</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Leave</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Holiday</span>
          </div>
        </Card>

        {/* Today's Attendance Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Attendance Logs</h3>
            <span className="text-xs text-slate-400">124 Checked-In Records</span>
          </div>
          <DataTable
            columns={columns}
            data={records}
            searchKey="employeeName"
            searchPlaceholder="Search attendance logs..."
            pageSize={5}
            exportFileName="daily_attendance.csv"
          />
        </div>
      </div>
    </div>
  );
};
