import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CalendarMinus,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  Receipt,
  Flame,
  Cake,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { DashboardHeroBanner } from '../../../components/common/DashboardHeroBanner';
import { Button, Badge, Modal } from '../../../components/ui';
import { managerService } from '../../../services/managerService';

export const ManagerDashboardView: React.FC = () => {
  const navigate = useNavigate();

  // Dynamic service data
  const teamMembers = managerService.getTeamMembers();
  const [leaves, setLeaves] = useState(managerService.getTeamLeaves());
  const [regs, setRegs] = useState(managerService.getRegularizationRequests());
  const [ots, setOts] = useState(managerService.getTeamOvertime());
  const [expenses, setExpenses] = useState(managerService.getTeamExpenses());
  const tasks = managerService.getTeamTasks();
  const goals = managerService.getTeamGoals();
  const requisitions = managerService.getManpowerRequests();

  // Quick modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isKudosModalOpen, setIsKudosModalOpen] = useState(false);

  // Quick Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(teamMembers[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Quick Kudos Form
  const [kudosEmployee, setKudosEmployee] = useState(teamMembers[0]?.id || '');
  const [kudosBadge, setKudosBadge] = useState('Sprint MVP 🏆');
  const [kudosText, setKudosText] = useState('');

  // Calculations
  const presentCount = teamMembers.filter((m) => m.todayStatus === 'Present').length;
  const onLeaveCount = teamMembers.filter((m) => m.todayStatus === 'On-Leave').length;
  const lateCount = teamMembers.filter((m) => m.todayStatus === 'Late').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const pendingRegs = regs.filter((r) => r.status === 'Pending');
  const pendingOts = ots.filter((o) => o.status === 'Pending');
  const pendingExpenses = expenses.filter((e) => e.status === 'Pending');
  const totalPendingApprovals =
    pendingLeaves.length + pendingRegs.length + pendingOts.length + pendingExpenses.length;

  const attendanceChartData = [
    { day: 'Mon', present: 5, late: 1, leave: 0 },
    { day: 'Tue', present: 6, late: 0, leave: 0 },
    { day: 'Wed', present: 4, late: 1, leave: 1 },
    { day: 'Thu', present: 5, late: 0, leave: 1 },
    { day: 'Fri', present: 5, late: 1, leave: 0 },
  ];

  const upcomingBirthdays = [
    { name: 'Sophia Davis', date: 'Sep 22', role: 'Lead Architect', avatar: teamMembers[0]?.avatar },
    { name: 'Liam Vance', date: 'Oct 04', role: 'Full Stack Engineer', avatar: teamMembers[1]?.avatar }
  ];

  const upcomingHolidays = [
    { title: 'Gandhi Jayanti', date: 'Oct 02, 2026', type: 'Public Holiday' },
    { title: 'Dussehra / Vijayadashami', date: 'Oct 20, 2026', type: 'Festival Holiday' }
  ];

  const handleApproveLeave = (id: string) => {
    managerService.approveLeaveRequest(id);
    setLeaves(managerService.getTeamLeaves());
  };

  const handleRejectLeave = (id: string) => {
    managerService.rejectLeaveRequest(id);
    setLeaves(managerService.getTeamLeaves());
  };

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = teamMembers.find((m) => m.id === taskAssignee);
    if (!emp || !taskTitle) return;

    managerService.createTeamTask({
      title: taskTitle,
      description: 'Delegated directly from Manager Dashboard quick action.',
      assigneeId: emp.id,
      assigneeName: emp.name,
      assigneeAvatar: emp.avatar,
      priority: taskPriority,
      status: 'To-Do',
      dueDate: taskDueDate || '2026-09-30',
      progress: 0
    });

    setIsTaskModalOpen(false);
    setTaskTitle('');
    navigate('/manager/tasks');
  };

  const handleCreateQuickKudos = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = teamMembers.find((m) => m.id === kudosEmployee);
    if (!emp || !kudosText) return;

    managerService.addSpotRecognition({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      badgeTitle: kudosBadge,
      category: 'Leadership',
      points: 300,
      citation: kudosText,
      awardedDate: 'Today'
    });

    setIsKudosModalOpen(false);
    setKudosText('');
    navigate('/manager/performance');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Hero Banner */}
      <DashboardHeroBanner
        customGreeting="Welcome back, Engineering Manager"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs"
              onClick={() => setIsKudosModalOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
              Give Kudos
            </Button>
            <Button
              size="sm"
              className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-semibold shadow"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Delegate Task
            </Button>
          </div>
        }
      />

      {/* 6 High Impact KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => navigate('/manager/team')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Team Strength</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamMembers.length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% Allocated</p>
        </div>

        <div
          onClick={() => navigate('/manager/attendance')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Present Today</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {presentCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">In Office / Active</p>
        </div>

        <div
          onClick={() => navigate('/manager/attendance')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Late Arrivals</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {lateCount}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Check-in past 09:30</p>
        </div>

        <div
          onClick={() => navigate('/manager/leave')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>On Leave Today</span>
            <CalendarMinus className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {onLeaveCount}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Scheduled PTO</p>
        </div>

        <div
          onClick={() => navigate('/manager/approvals')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-300 dark:border-amber-800/60 shadow-sm hover:shadow-md transition cursor-pointer bg-gradient-to-br from-white to-amber-50/40 dark:from-gray-800 dark:to-amber-950/20"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
            <span>Pending Approvals</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {totalPendingApprovals}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Action Required</p>
        </div>

        <div
          onClick={() => navigate('/manager/tasks')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Sprint Velocity</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            92%
          </div>
          <p className="text-[11px] text-purple-600 mt-1">Tasks on schedule</p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Team Roster + Attendance Area Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Team Status Roster */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Live Direct Reports Roster
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Today's presence, check-in timestamps, and active projects
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => navigate('/manager/team')}
              >
                View 360 Team <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          member.todayStatus === 'Present'
                            ? 'bg-emerald-500'
                            : member.todayStatus === 'Late'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {member.name}
                        </h4>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {member.designation}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Project: <strong className="text-gray-700 dark:text-gray-300">{member.project}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs text-gray-400 block">Check-In</span>
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {member.checkInTime}
                      </span>
                    </div>
                    <Badge
                      variant={
                        member.todayStatus === 'Present'
                          ? 'success'
                          : member.todayStatus === 'Late'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {member.todayStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Trend Chart */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Weekly Attendance & Punctuality Trend
                </h3>
                <p className="text-xs text-gray-500">
                  Daily headcount breakdown (Present vs Late vs On-Leave)
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                Avg 94.6% Attendance
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceChartData}>
                  <defs>
                    <linearGradient id="presentColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="lateColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#presentColor)"
                    name="Present On Time"
                  />
                  <Area
                    type="monotone"
                    dataKey="late"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#lateColor)"
                    name="Late Arrivals"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Pending Approvals Queue + Birthdays & Holidays + Headcount */}
        <div className="space-y-6">
          {/* Quick Pending Approvals Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  Pending Authorizations ({totalPendingApprovals})
                </h3>
              </div>
              <button
                onClick={() => navigate('/manager/approvals')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Approvals Hub
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {pendingLeaves.slice(0, 3).map((l) => (
                <div key={l.id} className="p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={l.employeeAvatar}
                        alt={l.employeeName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {l.employeeName}
                      </span>
                    </div>
                    <Badge variant="info" size="sm">{l.leaveType}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {l.startDate} ({l.days} days) • "{l.reason}"
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleRejectLeave(l.id)}
                      className="px-2.5 py-1 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveLeave(l.id)}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}

              {pendingExpenses.slice(0, 2).map((exp) => (
                <div key={exp.id} className="p-3.5 space-y-2 text-xs bg-emerald-50/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {exp.employeeName}
                    </span>
                    <span className="font-bold text-emerald-600">${exp.amount.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {exp.category}: {exp.description}
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => navigate('/manager/expenses')}
                      className="px-2.5 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded"
                    >
                      Review Claim
                    </button>
                  </div>
                </div>
              ))}

              {totalPendingApprovals === 0 && (
                <div className="p-8 text-center text-xs text-gray-500">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1.5" />
                  All requests processed!
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Birthdays & Public Holidays */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
                <Cake className="h-4 w-4" />
                <span>Upcoming Team Birthdays</span>
              </div>
              <div className="space-y-2">
                {upcomingBirthdays.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <img src={b.avatar} alt={b.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-gray-900 dark:text-white">{b.name}</span>
                    </div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{b.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Upcoming Holidays</span>
              </div>
              <div className="space-y-2">
                {upcomingHolidays.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg">
                    <span className="font-semibold text-gray-900 dark:text-white">{h.title}</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hiring / Requisitions Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <span>Hiring & Requisitions</span>
              </div>
              <button
                onClick={() => navigate('/manager/hiring')}
                className="text-xs text-emerald-600 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {requisitions.map((req) => (
                <div key={req.id} className="p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{req.jobTitle}</span>
                    <Badge variant={req.status === 'Approved' ? 'success' : 'neutral'} size="sm">
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 mt-0.5">{req.count} open headcount • {req.urgency} Priority</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Delegate Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Delegate Sprint Task"
      >
        <form onSubmit={handleCreateQuickTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Assignee
            </label>
            <select
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement Webhook Retries for Payments"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="High">High Priority 🔥</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Kudos Modal */}
      <Modal
        isOpen={isKudosModalOpen}
        onClose={() => setIsKudosModalOpen(false)}
        title="Award Spot Kudos to Direct Report"
      >
        <form onSubmit={handleCreateQuickKudos} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Team Member
            </label>
            <select
              value={kudosEmployee}
              onChange={(e) => setKudosEmployee(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kudos Badge
            </label>
            <input
              type="text"
              required
              value={kudosBadge}
              onChange={(e) => setKudosBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Appreciation Message
            </label>
            <textarea
              rows={3}
              required
              value={kudosText}
              onChange={(e) => setKudosText(e.target.value)}
              placeholder="Why are they being celebrated today?"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => setIsKudosModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Kudos
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
