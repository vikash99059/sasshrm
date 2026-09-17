import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  X,
  RotateCcw,
  UserCheck,
  Building2,
  Layers,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Modal, Button, Badge, Card } from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { employeeService } from '../../services/employeeService';
import { Team, Department, Employee } from '../../types';

// ─── Color Presets ────────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { label: 'Blue',    value: '#3B82F6' },
  { label: 'Indigo',  value: '#6366F1' },
  { label: 'Purple',  value: '#8B5CF6' },
  { label: 'Pink',    value: '#EC4899' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Amber',   value: '#F59E0B' },
  { label: 'Cyan',    value: '#06B6D4' },
  { label: 'Rose',    value: '#F43F5E' },
];

// ─── Form Interface ───────────────────────────────────────────────────────────
interface TeamFormData {
  name: string;
  departmentId: string;
  department: string;
  leadEmployeeId: string;
  leadName: string;
  leadRole: string;
  memberIds: string[];
  color: string;
  description: string;
}

const DEFAULT_FORM: TeamFormData = {
  name: '',
  departmentId: '',
  department: '',
  leadEmployeeId: '',
  leadName: '',
  leadRole: '',
  memberIds: [],
  color: '#3B82F6',
  description: '',
};

// ─── Multi-select Member Picker ───────────────────────────────────────────────
interface MemberPickerProps {
  employees: Employee[];
  selectedIds: string[];
  leadEmployeeId: string;
  onChange: (ids: string[]) => void;
  color: string;
}

const MemberPicker: React.FC<MemberPickerProps> = ({ employees, selectedIds, leadEmployeeId, onChange, color }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = employees.filter(emp => {
    const name = emp.fullName || `${emp.firstName} ${emp.lastName}`;
    return name.toLowerCase().includes(search.toLowerCase()) || emp.designation.toLowerCase().includes(search.toLowerCase());
  });

  const toggle = (empId: string) => {
    if (selectedIds.includes(empId)) {
      onChange(selectedIds.filter(id => id !== empId));
    } else {
      onChange([...selectedIds, empId]);
    }
  };

  const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[36px]"
      >
        <span className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedEmployees.length === 0 ? (
            <span className="text-slate-400">Select team members...</span>
          ) : (
            selectedEmployees.map(emp => (
              <span
                key={emp.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {emp.fullName?.split(' ')[0] || emp.firstName}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); toggle(emp.id); }}
                  className="hover:opacity-70"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))
          )}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={() => onChange(employees.map(e => e.id))}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
            >
              Select All
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear All
            </button>
            <span className="ml-auto text-[10px] text-slate-400">{selectedIds.length} selected</span>
          </div>

          {/* Employee list */}
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4">No employees found</p>
            ) : (
              filtered.map(emp => {
                const name = emp.fullName || `${emp.firstName} ${emp.lastName}`;
                const isSelected = selectedIds.includes(emp.id);
                const isLead = emp.id === leadEmployeeId;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => toggle(emp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                  >
                    {/* Avatar initials */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: isSelected ? color : '#94A3B8' }}
                    >
                      {name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{emp.designation} · {emp.department}</p>
                    </div>
                    {isLead && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 shrink-0">Lead</span>
                    )}
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${isSelected ? 'border-0' : 'border-slate-300 dark:border-slate-600'}`}
                      style={isSelected ? { backgroundColor: color } : {}}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<TeamFormData>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Load Data ──────────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [teamList, deptList, empList] = await Promise.all([
        employeeService.getTeams(),
        employeeService.getDepartments(),
        employeeService.getEmployees(),
      ]);
      setTeams(teamList);
      setDepartments(deptList);
      setEmployees(empList);
    } catch (err) {
      console.error('Failed to load teams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── KPIs ───────────────────────────────────────────────────────────────────
  const totalMembers = useMemo(() => teams.reduce((s, t) => s + (t.memberCount || 0), 0), [teams]);
  const uniqueDepts  = useMemo(() => new Set(teams.map(t => t.departmentId)).size, [teams]);
  const teamsWithLead = useMemo(() => teams.filter(t => t.leadName && t.leadName !== 'Not Assigned').length, [teams]);

  // ─── Filter ─────────────────────────────────────────────────────────────────
  const filteredTeams = useMemo(() => {
    return teams.filter(t => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.leadName.toLowerCase().includes(q) || t.department.toLowerCase().includes(q);
      const matchDept   = deptFilter === 'ALL' || t.departmentId === deptFilter;
      return matchSearch && matchDept;
    });
  }, [teams, searchQuery, deptFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || deptFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setDeptFilter('ALL');
  };

  // ─── Open Add Modal ──────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingTeam(null);
    setFormData(DEFAULT_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const handleOpenEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name:            team.name,
      departmentId:    team.departmentId || '',
      department:      team.department,
      leadEmployeeId:  team.leadEmployeeId || '',
      leadName:        team.leadName,
      leadRole:        team.leadRole,
      memberIds:       team.memberIds || [],
      color:           team.color,
      description:     team.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // ─── Department Select Handler ────────────────────────────────────────────────
  const handleDeptSelect = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    setFormData(prev => ({ ...prev, departmentId: deptId, department: dept?.name || '' }));
  };

  // ─── Lead Select Handler ─────────────────────────────────────────────────────
  const handleLeadSelect = (empId: string) => {
    if (!empId) {
      setFormData(prev => ({ ...prev, leadEmployeeId: '', leadName: 'Not Assigned', leadRole: '' }));
      return;
    }
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      // Auto-add lead to members if not already present
      const newMemberIds = formData.memberIds.includes(emp.id)
        ? formData.memberIds
        : [...formData.memberIds, emp.id];
      setFormData(prev => ({
        ...prev,
        leadEmployeeId: emp.id,
        leadName:       emp.fullName || `${emp.firstName} ${emp.lastName}`,
        leadRole:       emp.designation || '',
        memberIds:      newMemberIds,
      }));
    }
  };

  // ─── Validate ────────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim())  errors.name       = 'Team name is required';
    if (!formData.departmentId) errors.department = 'Please select a department';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload: Partial<Team> = {
        name:           formData.name.trim(),
        departmentId:   formData.departmentId,
        department:     formData.department,
        leadName:       formData.leadName || 'Not Assigned',
        leadRole:       formData.leadRole.trim(),
        leadEmployeeId: formData.leadEmployeeId || undefined,
        memberIds:      formData.memberIds,
        memberCount:    formData.memberIds.length,
        color:          formData.color,
        description:    formData.description.trim(),
      };
      if (editingTeam) {
        await employeeService.updateTeam(editingTeam.id, payload);
        showToast(`Team "${formData.name}" updated successfully!`);
      } else {
        await employeeService.createTeam(payload);
        showToast(`Team "${formData.name}" created successfully!`);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;
    try {
      await employeeService.deleteTeam(teamToDelete.id);
      showToast(`Team "${teamToDelete.name}" deleted.`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete team.');
    } finally {
      setIsDeleteOpen(false);
      setTeamToDelete(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-blue-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeaderCard
        title="Teams & Pods"
        subtitle="Manage cross-functional squads, reporting pods, and team lead assignments across departments."
        icon={Users}
        badge={<Badge variant="primary" size="sm">{teams.length} Active Teams</Badge>}
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 text-xs font-bold"
          >
            Create Team
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Teams</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{teams.length}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All active
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Members</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalMembers}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Across all teams</p>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Depts Covered</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{uniqueDepts}</h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Departments spanned</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lead Coverage</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{teamsWithLead} / {teams.length}</h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                {teams.length > 0 ? `${Math.round((teamsWithLead / teams.length) * 100)}% with leads` : '0%'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by team name, department, or lead..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters} className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs py-2">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Teams Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters ? 'No teams match your search or filter criteria.' : 'No teams have been created yet.'}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={resetFilters} className="text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear Filters
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={handleOpenAdd} className="text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Create First Team
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Teams Grid */}
      {filteredTeams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const hasLead = team.leadName && team.leadName !== 'Not Assigned';
            const leadInitials = team.leadName.split(' ').map(w => w[0] || '').join('').substring(0, 2).toUpperCase();
            // Resolve member employees for avatar stack
            const memberEmployees = employees.filter(e => (team.memberIds || []).includes(e.id));

            return (
              <Card
                key={team.id}
                className="bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex flex-col overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group"
              >
                {/* Color stripe */}
                <div className="h-1.5 w-full" style={{ backgroundColor: team.color }} />

                <div className="p-5 flex flex-col flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5"
                        style={{ backgroundColor: team.color + '20', color: team.color }}
                      >
                        {team.department || 'No Department'}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {team.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleOpenEdit(team)} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDeleteClick(team)} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {team.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed -mt-1">
                      {team.description}
                    </p>
                  )}

                  {/* Team Lead */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-dark-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Team Lead</p>
                    {hasLead ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ backgroundColor: team.color }}>
                          {leadInitials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{team.leadName}</p>
                          {team.leadRole && <p className="text-[11px] text-slate-500 dark:text-slate-400">{team.leadRole}</p>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Unassigned</span>
                    )}
                  </div>

                  {/* Footer: member avatar stack + count */}
                  <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs mt-auto">
                    <div className="flex items-center gap-2">
                      {/* Avatar stack */}
                      {memberEmployees.length > 0 && (
                        <div className="flex items-center -space-x-2">
                          {memberEmployees.slice(0, 4).map(emp => (
                            <div
                              key={emp.id}
                              title={emp.fullName || emp.firstName}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center text-white text-[9px] font-bold shadow-xs"
                              style={{ backgroundColor: team.color }}
                            >
                              {(emp.fullName || emp.firstName).charAt(0)}
                            </div>
                          ))}
                          {memberEmployees.length > 4 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-card bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">
                              +{memberEmployees.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{team.memberCount}</span> Members
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{team.createdAt ? `Since ${team.createdAt}` : 'Active'}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? `Edit Team — ${editingTeam.name}` : 'Create New Team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Team Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Platform Reliability Squad"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.name && <p className="text-rose-500 text-[11px] mt-1">{formErrors.name}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.departmentId}
              onChange={e => handleDeptSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {formErrors.department && <p className="text-rose-500 text-[11px] mt-1">{formErrors.department}</p>}
          </div>

          {/* Team Lead */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Team Lead</label>
            <select
              value={formData.leadEmployeeId}
              onChange={e => handleLeadSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">— Not Assigned —</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName || `${emp.firstName} ${emp.lastName}`} — {emp.designation}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Lead's Role / Title</label>
            <input
              type="text"
              value={formData.leadRole}
              onChange={e => setFormData(prev => ({ ...prev, leadRole: e.target.value }))}
              placeholder="e.g. Engineering Manager"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Member Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Team Members
              {formData.memberIds.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: formData.color }}>
                  {formData.memberIds.length}
                </span>
              )}
            </label>
            <MemberPicker
              employees={employees}
              selectedIds={formData.memberIds}
              leadEmployeeId={formData.leadEmployeeId}
              onChange={ids => setFormData(prev => ({ ...prev, memberIds: ids }))}
              color={formData.color}
            />
            <p className="text-[11px] text-slate-400 mt-1">Team size is auto-calculated from selected members.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief purpose or focus of this team..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Team Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                  title={c.label}
                  className={`w-7 h-7 rounded-full transition-all duration-150 ring-offset-2 flex items-center justify-center ${formData.color === c.value ? 'ring-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: c.value, ...(formData.color === c.value ? { outlineColor: c.value } as any : {}) }}
                >
                  {formData.color === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} size="sm">Cancel</Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="font-bold">
              {isSubmitting ? 'Saving...' : editingTeam ? 'Update Team' : 'Create Team'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Delete Confirmation ─────────────────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Team">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{teamToDelete?.name}"</span>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-0">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Team
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default TeamsPage;
