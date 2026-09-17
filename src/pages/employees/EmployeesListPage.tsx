import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { Employee, Department } from '../../types';
import {
  Card,
  Badge,
  Button,
  Avatar,
  Modal,
  Input,
  Select,
} from '../../components/ui';
import {
  Users,
  Plus,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Search,
  LayoutGrid,
  List,
  Grid3X3,
  Calendar,
  MapPin,
  Briefcase,
  UserCheck,
  Download,
  RotateCcw,
  X,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowUpDown,
  Laptop,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const EmployeesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || 'all';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Modes: 'table' | 'grid' | 'compact' (small box view)
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'compact'>('grid');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>(initialDept);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'date_desc' | 'dept_asc' | 'id_asc'>('name_asc');

  // Modal & Toast states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Employee Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship'>('Full-time');
  const [workLocation, setWorkLocation] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [officeLocation, setOfficeLocation] = useState('Headquarters');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [avatar, setAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [empList, deptList] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getDepartments(),
      ]);
      setEmployees(empList);
      setDepartments(deptList);
    } catch (err) {
      console.error('Failed to load employee directory', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update filter if URL query param changes
  useEffect(() => {
    if (initialDept && initialDept !== 'all') {
      setSelectedDept(initialDept);
    }
  }, [initialDept]);

  // Executive KPI summary metrics
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave' || e.status === 'Probation').length;
  const remoteCount = employees.filter((e) => e.workLocation === 'Remote' || e.workLocation === 'Hybrid').length;

  // Filtered and Sorted employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (emp.fullName || `${emp.firstName} ${emp.lastName}`).toLowerCase().includes(q);
          const matchEmail = (emp.email || '').toLowerCase().includes(q);
          const matchId = (emp.employeeId || emp.id || '').toLowerCase().includes(q);
          const matchDept = (emp.department || '').toLowerCase().includes(q);
          const matchDesig = (emp.designation || '').toLowerCase().includes(q);
          const matchPhone = (emp.phone || '').toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchId && !matchDept && !matchDesig && !matchPhone) {
            return false;
          }
        }

        // Department
        if (selectedDept !== 'all' && emp.department !== selectedDept) return false;

        // Status
        if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;

        // Employment Type
        if (selectedType !== 'all' && emp.employmentType !== selectedType) return false;

        // Work Location
        if (selectedWorkLocation !== 'all' && emp.workLocation !== selectedWorkLocation) return false;

        return true;
      })
      .sort((a, b) => {
        const nameA = a.fullName || `${a.firstName} ${a.lastName}`;
        const nameB = b.fullName || `${b.firstName} ${b.lastName}`;

        if (sortBy === 'name_asc') return nameA.localeCompare(nameB);
        if (sortBy === 'name_desc') return nameB.localeCompare(nameA);
        if (sortBy === 'date_desc') {
          return new Date(b.joiningDate || 0).getTime() - new Date(a.joiningDate || 0).getTime();
        }
        if (sortBy === 'dept_asc') {
          return (a.department || '').localeCompare(b.department || '');
        }
        if (sortBy === 'id_asc') {
          return (a.employeeId || a.id).localeCompare(b.employeeId || b.id);
        }
        return 0;
      });
  }, [employees, searchQuery, selectedDept, selectedStatus, selectedType, selectedWorkLocation, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDept !== 'all' ||
    selectedStatus !== 'all' ||
    selectedType !== 'all' ||
    selectedWorkLocation !== 'all' ||
    sortBy !== 'name_asc';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedWorkLocation('all');
    setSortBy('name_asc');
  };

  // Create new employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await employeeService.createEmployee({
        firstName,
        lastName,
        email,
        phone,
        department,
        designation,
        employmentType,
        workLocation,
        officeLocation,
        joiningDate,
        avatar:
          avatar.trim() ||
          `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        status: 'Active',
      });

      showToast(`Employee "${created.fullName}" onboarded successfully!`);
      setIsAddModalOpen(false);

      // Reset Form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAvatar('');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to onboard employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteClick = (emp: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      showToast(`Employee "${employeeToDelete.fullName}" removed.`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove employee.');
    } finally {
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) {
      showToast('No employees to export.');
      return;
    }
    const headers = ['Employee ID', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Type', 'Location', 'Status', 'Joining Date'];
    const rows = filteredEmployees.map((e) => [
      `"${e.employeeId || e.id}"`,
      `"${e.fullName || `${e.firstName} ${e.lastName}`}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.department || ''}"`,
      `"${e.designation || ''}"`,
      `"${e.employmentType || ''}"`,
      `"${e.workLocation || ''}"`,
      `"${e.status || ''}"`,
      `"${e.joiningDate || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employee_directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredEmployees.length} employee records.`);
  };

  const getDepartmentColor = (deptName: string) => {
    const found = departments.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
    return found?.color || '#3B82F6';
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-blue-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Employee Directory
                </h1>
                <Badge variant="primary" size="sm">
                  {totalCount} Total Members
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage organization workforce, departmental rosters, roles, and 360° talent profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: View Switcher, Export, Add Employee */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher (Table / Grid / Small Box) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View (Dense List)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'table'
                ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View (Executive Profile Cards)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'grid'
                ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('compact')}
              title="Small Box View (High Density Overview)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'compact'
                ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Small Box</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs bg-white/90 dark:bg-dark-card/90 shadow-2xs hover:bg-white"
          >
            Export
          </Button>

          {/* Add New Employee CTA */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 text-xs font-bold"
          >
            Add New Employee
          </Button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Workforce</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Across {departments.length} departments
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active On Duty</p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}% Active</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remote & Hybrid</p>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{remoteCount}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Flexible arrangement
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">On Leave / Probation</p>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{onLeaveCount}</h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                Temporarily absent / pending
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by employee name, ID, email, designation, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.employeeCount})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
            </select>

            {/* Employment Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium hidden sm:block"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="date_desc">Newest Joining</option>
              <option value="dept_asc">Department (A → Z)</option>
              <option value="id_asc">Employee ID</option>
            </select>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs py-2"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter Sub-bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-850">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredEmployees.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{totalCount}</strong> employees
          </span>
          <span className="text-[11px] text-slate-400">
            Active view: <strong className="text-blue-600 dark:text-blue-400 capitalize">{viewMode} Mode</strong>
          </span>
        </div>
      </Card>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Employees Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No employee profiles match the current search keywords or selected filter criteria.'
              : 'No employees have been added to the organization yet.'}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={resetAllFilters} className="text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Onboard First Employee
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 1. VIEW MODE A: PREMIUM CORPORATE TABLE VIEW                              */}
      {/* ========================================================================= */}
      {viewMode === 'table' && filteredEmployees.length > 0 && (
        <Card className="overflow-hidden bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-dark-border">
                <tr>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Profile & Member</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joining Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {filteredEmployees.map((row) => {
                  const deptColor = getDepartmentColor(row.department || '');
                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/employees/${row.id}`)}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition"
                    >
                      {/* Employee ID */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {row.employeeId || row.id}
                      </td>

                      {/* Profile & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={row.avatar}
                            name={row.fullName || `${row.firstName} ${row.lastName}`}
                            size="md"
                            status={row.status === 'Active' ? 'online' : 'offline'}
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                              {row.fullName || `${row.firstName} ${row.lastName}`}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{row.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: deptColor }}
                          />
                          {row.department}
                        </span>
                      </td>

                      {/* Designation */}
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
                        {row.designation}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {row.phone || '—'}
                      </td>

                      {/* Joining Date */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(row.joiningDate)}
                      </td>

                      {/* Employment Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {row.employmentType || 'Full-time'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            row.status === 'Active'
                              ? 'success'
                              : row.status === 'On Leave'
                                ? 'info'
                                : 'warning'
                          }
                          size="sm"
                          dot
                        >
                          {row.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => navigate(`/employees/${row.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                            title="View 360° Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(row, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW MODE B: EXECUTIVE GRID CARDS VIEW                                 */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const deptColor = getDepartmentColor(emp.department || '');
            const fullName = emp.fullName || `${emp.firstName} ${emp.lastName}`;

            return (
              <Card
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="p-5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600/60 cursor-pointer group relative overflow-hidden"
              >
                {/* Accent Top Border Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: deptColor }}
                />

                <div className="space-y-4 pt-1">
                  {/* Top Header: ID & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                      {emp.employeeId || emp.id}
                    </span>
                    <Badge
                      variant={
                        emp.status === 'Active'
                          ? 'success'
                          : emp.status === 'On Leave'
                            ? 'info'
                            : 'warning'
                      }
                      size="sm"
                      dot
                    >
                      {emp.status}
                    </Badge>
                  </div>

                  {/* Employee Avatar & Identity */}
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      src={emp.avatar}
                      name={fullName}
                      size="lg"
                      status={emp.status === 'Active' ? 'online' : 'offline'}
                      className="shadow-sm ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {fullName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                        {emp.designation}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: deptColor }}
                        />
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {emp.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact & Details Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-dark-border space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    {emp.phone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        {emp.employmentType || 'Full-time'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {emp.workLocation || 'Hybrid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div
                  className="pt-3 mt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Joined {formatDate(emp.joiningDate)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(emp, e)}
                      title="Remove Employee"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>360° Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE C: COMPACT "SMALL BOX" VIEW                                  */}
      {/* ========================================================================= */}
      {viewMode === 'compact' && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {filteredEmployees.map((emp) => {
            const deptColor = getDepartmentColor(emp.department || '');
            const fullName = emp.fullName || `${emp.firstName} ${emp.lastName}`;

            return (
              <Card
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}`)}
                className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex flex-col justify-between items-center text-center transition-all duration-200 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer group relative"
              >
                {/* Status Dot Top Right */}
                <span
                  className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-dark-card ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  title={`Status: ${emp.status}`}
                />

                {/* Avatar with Department Ring */}
                <div className="relative mt-1 mb-2">
                  <div
                    className="p-0.5 rounded-full"
                    style={{ backgroundColor: deptColor }}
                  >
                    <Avatar
                      src={emp.avatar}
                      name={fullName}
                      size="md"
                      className="ring-2 ring-white dark:ring-dark-card"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="w-full space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight truncate group-hover:text-blue-600 transition">
                    {fullName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {emp.designation}
                  </p>
                </div>

                {/* Department Pill & ID */}
                <div className="w-full mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-400 font-semibold truncate max-w-[55px]">
                    {emp.employeeId || emp.id}
                  </span>
                  <span
                    className="px-1.5 py-0.2 rounded font-bold truncate max-w-[70px]"
                    style={{
                      backgroundColor: `${deptColor}18`,
                      color: deptColor,
                    }}
                  >
                    {emp.department}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NEW EMPLOYEE MODAL                                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        description="Fill in organizational and profile details to onboard a new employee into the directory."
        size="lg"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          {/* Section: Basic Information */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              1. Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Marcus"
                required
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Vance"
                required
              />
              <Input
                label="Official Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m.vance@company.com"
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 342-1001"
                required
              />
            </div>
          </div>

          {/* Section: Department & Role */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              2. Department & Job Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Designation / Role Title"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Work Location
                </label>
                <select
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Joining & Photo */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              3. Onboarding Date & Avatar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Joining Date"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
              <Input
                label="Avatar Photo URL (Optional)"
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-bold px-4"
            >
              {isSubmitting ? (
                <span>Onboarding...</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Onboard Employee</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Employee"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-xs">
                Are you sure you want to remove this employee?
              </h4>
              <p className="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5">
                Employee <strong>{employeeToDelete?.fullName}</strong> ({employeeToDelete?.employeeId || employeeToDelete?.id}) will be deleted from the active directory.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={confirmDeleteEmployee}
              className="bg-rose-600 hover:bg-rose-700 text-white border-transparent text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
