import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { TeamMember } from '../../types';
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
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Laptop,
  Plus,
  Eye,
  Layers,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ManagerTeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'In Meeting' | 'On Leave'>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'orgChart'>('grid');

  const loadMembers = async () => {
    const list = await managerService.getTeamMembers();
    setTeamMembers(list);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = teamMembers.filter((m) => {
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const presentCount = teamMembers.filter((m) => m.attendanceToday === 'Present' || m.attendanceToday === 'Late').length;
  const onLeaveCount = teamMembers.filter((m) => m.status === 'On Leave').length;
  const remoteCount = teamMembers.filter((m) => m.workMode === 'Remote').length;

  const columns: Column<TeamMember>[] = [
    {
      header: 'Employee & Role',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="md" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.designation} • <span className="font-mono">{row.employeeCode}</span></p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Work Mode & Location',
      accessorKey: 'workMode',
      cell: (row) => (
        <div>
          <Badge variant={row.workMode === 'Remote' ? 'primary' : 'neutral'} size="sm">
            {row.workMode}
          </Badge>
          <p className="text-[10px] text-slate-400 mt-0.5">{row.location}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Active Project',
      accessorKey: 'activeProject',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs block">
          {row.activeProject}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Performance Score',
      accessorKey: 'performanceScore',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{row.performanceScore}%</span>
          <div className="w-16 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${row.performanceScore}%` }} />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Today Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'Online' ? 'success' : row.status === 'In Meeting' ? 'warning' : row.status === 'On Leave' ? 'danger' : 'neutral'
          }
          size="sm"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          className="p-1 h-7 text-[11px] font-bold text-blue-600 border-blue-200"
          onClick={() => setSelectedMember(row)}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View 360
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="My Team & Direct Reports Directory"
        subtitle="Manage engineering team members, 360 employee profiles, skill allocations, and reporting hierarchy."
        icon={Users}
        badge={<Badge variant="primary">{teamMembers.length} Direct Reports</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('orgChart')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'orgChart' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Org Hierarchy
              </button>
            </div>
          </div>
        }
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Strength"
          value={teamMembers.length.toString()}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Core Engineering Squad"
          isPositive={true}
        />
        <StatCard
          title="Present Today"
          value={presentCount.toString()}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change={`${Math.round((presentCount / (teamMembers.length || 1)) * 100)}% Attendance Rate`}
          isPositive={true}
        />
        <StatCard
          title="On Leave Today"
          value={onLeaveCount.toString()}
          icon={<Clock className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          change="Covered by Handover"
          isPositive={false}
        />
        <StatCard
          title="Remote / Distributed"
          value={remoteCount.toString()}
          icon={<Laptop className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Syncing via Slack"
          isPositive={true}
        />
      </div>

      {/* FILTER & SEARCH */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Online', 'In Meeting', 'On Leave'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by name, skill, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>
      </Card>

      {/* VIEW MODE 1: GRID CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md dark:border-slate-800 dark:bg-dark-card transition-all hover-card-lift flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={member.avatar} name={member.name} size="lg" />
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        member.status === 'Online'
                          ? 'bg-emerald-500'
                          : member.status === 'In Meeting'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{member.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{member.designation}</p>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      {member.employeeCode}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    member.status === 'Online' ? 'success' : member.status === 'In Meeting' ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {member.status}
                </Badge>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 4).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Meta details */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Active Project:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                    {member.activeProject}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location:
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{member.location}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 border-blue-200"
                onClick={() => setSelectedMember(member)}
              >
                View 360 Employee Profile
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: TABLE */}
      {viewMode === 'table' && (
        <DataTable columns={columns} data={filteredMembers} pageSize={10} />
      )}

      {/* VIEW MODE 3: ORG HIERARCHY */}
      {viewMode === 'orgChart' && (
        <Card className="p-6 space-y-6">
          <div className="text-center max-w-sm mx-auto p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30">
            <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" name="You (Engineering Manager)" size="lg" className="mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">You (Engineering Manager)</h3>
            <p className="text-xs text-slate-500">Core Engineering & Infrastructure Squad</p>
            <Badge variant="primary" size="sm" className="mt-2">Department Lead</Badge>
          </div>

          <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700 mx-auto" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center hover:border-blue-400 transition-all cursor-pointer"
              >
                <Avatar src={member.avatar} name={member.name} size="md" className="mx-auto mb-2" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{member.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{member.designation}</p>
                <Badge variant={member.status === 'Online' ? 'success' : 'neutral'} size="sm" className="mt-2 text-[9px]">
                  {member.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 360 PROFILE SLIDEOUT MODAL */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={`360 Profile: ${selectedMember.name}`}
          size="lg"
        >
          <div className="space-y-5 p-1 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
                  <Badge variant="primary" size="sm">{selectedMember.employeeCode}</Badge>
                </div>
                <p className="text-slate-500 font-medium">{selectedMember.designation} • {selectedMember.department}</p>
                <div className="flex items-center gap-4 text-slate-400 text-[11px] pt-1">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selectedMember.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selectedMember.phone}</span>
                </div>
              </div>
            </div>

            {/* 360 KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-slate-500">Performance Score</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{selectedMember.performanceScore}%</p>
                <span className="text-[10px] text-emerald-700">Top Quartile</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <span className="text-slate-500">Leave Balance</span>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400">{selectedMember.leavesRemaining} Days</p>
                <span className="text-[10px] text-slate-400">Paid Leave Avail.</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <span className="text-slate-500">Tenure</span>
                <p className="text-lg font-black text-purple-600 dark:text-purple-400">2.2 Yrs</p>
                <span className="text-[10px] text-slate-400">Joined {formatDate(selectedMember.joiningDate)}</span>
              </div>
            </div>

            {/* Skills & Project */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Technical Skill Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((s, idx) => (
                  <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Project */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Current Sprint Focus</span>
              <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedMember.activeProject}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
