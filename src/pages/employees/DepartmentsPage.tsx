import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { Department, Employee } from '../../types';
import { Card, Button, Badge, Modal } from '../../components/ui';
import {
  Building2,
  Plus,
  Users,
  ArrowRight,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  DollarSign,
  Briefcase,
  LayoutGrid,
  List,
  UserCheck,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

const COLOR_PRESETS = [
  { label: 'Blue', value: '#3B82F6', bg: 'bg-blue-500' },
  { label: 'Emerald', value: '#10B981', bg: 'bg-emerald-500' },
  { label: 'Purple', value: '#8B5CF6', bg: 'bg-purple-500' },
  { label: 'Pink', value: '#EC4899', bg: 'bg-pink-500' },
  { label: 'Amber', value: '#F59E0B', bg: 'bg-amber-500' },
  { label: 'Cyan', value: '#06B6D4', bg: 'bg-cyan-500' },
  { label: 'Indigo', value: '#6366F1', bg: 'bg-indigo-500' },
  { label: 'Rose', value: '#F43F5E', bg: 'bg-rose-500' },
  { label: 'Slate', value: '#64748B', bg: 'bg-slate-500' },
];

interface DepartmentFormData {
  name: string;
  code: string;
  color: string;
  headName: string;
  headOfDepartmentId: string;
  location: string;
  budget: number;
  description: string;
}

const DEFAULT_FORM_DATA: DepartmentFormData = {
  name: '',
  code: '',
  color: '#3B82F6',
  headName: '',
  headOfDepartmentId: '',
  location: 'Headquarters',
  budget: 150000,
  description: '',
};

export const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [headFilter, setHeadFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [sortBy, setSortBy] = useState<'members_desc' | 'name_asc' | 'code_asc' | 'budget_desc'>('members_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal states
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptList, empList] = await Promise.all([
        employeeService.getDepartments(),
        employeeService.getEmployees(),
      ]);
      setDepartments(deptList);
      setEmployees(empList);
    } catch (err) {
      console.error('Failed to load departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute total employees across departments
  const totalHeadcount = useMemo(() => {
    return departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0);
  }, [departments]);

  const totalBudget = useMemo(() => {
    return departments.reduce((sum, d) => sum + (d.budget || 0), 0);
  }, [departments]);

  const assignedHeadsCount = useMemo(() => {
    return departments.filter(
      (d) => d.headName && d.headName !== 'Not Assigned' && d.headName.trim() !== ''
    ).length;
  }, [departments]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingDepartment(null);
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      color: dept.color || '#3B82F6',
      headName: dept.headName || '',
      headOfDepartmentId: dept.headOfDepartmentId || '',
      location: dept.location || 'Headquarters',
      budget: dept.budget || 150000,
      description: dept.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto-generate Code from Department Name if code not customized
  const handleNameChange = (name: string) => {
    const isAutoGenerate =
      !editingDepartment && (!formData.code || formData.code === formData.name.substring(0, 3).toUpperCase());

    let suggestedCode = formData.code;
    if (isAutoGenerate && name.trim()) {
      const words = name.trim().split(/\s+/);
      if (words.length >= 2) {
        suggestedCode = words.map((w) => w[0]).join('').substring(0, 4).toUpperCase();
      } else {
        suggestedCode = name.substring(0, 3).toUpperCase();
      }
    }

    setFormData((prev) => ({
      ...prev,
      name,
      code: isAutoGenerate ? suggestedCode : prev.code,
    }));

    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  // Select head of department from employees
  const handleHeadSelect = (empId: string) => {
    if (!empId) {
      setFormData((prev) => ({ ...prev, headOfDepartmentId: '', headName: 'Not Assigned' }));
      return;
    }
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setFormData((prev) => ({
        ...prev,
        headOfDepartmentId: emp.id,
        headName: emp.fullName || `${emp.firstName} ${emp.lastName}`,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Department name is required';
    }
    if (!formData.code.trim()) {
      errors.code = 'Department code is required';
    } else if (formData.code.trim().length > 6) {
      errors.code = 'Code should be 2 to 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingDepartment) {
        await employeeService.updateDepartment(editingDepartment.id, {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          color: formData.color,
          headName: formData.headName || 'Not Assigned',
          headOfDepartmentId: formData.headOfDepartmentId,
          location: formData.location.trim(),
          budget: Number(formData.budget) || 0,
          description: formData.description.trim(),
        });
        showToast(`Department "${formData.name}" updated successfully!`);
      } else {
        await employeeService.createDepartment({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          color: formData.color,
          headName: formData.headName || 'Not Assigned',
          headOfDepartmentId: formData.headOfDepartmentId,
          location: formData.location.trim(),
          budget: Number(formData.budget) || 0,
          description: formData.description.trim(),
          employeeCount: 0,
        });
        showToast(`Department "${formData.name}" created successfully!`);
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save department', err);
      showToast(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleDeleteClick = (dept: Department) => {
    setDepartmentToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    try {
      await employeeService.deleteDepartment(departmentToDelete.id);
      showToast(`Department "${departmentToDelete.name}" deleted.`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete department.');
    } finally {
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  };

  // Filter and Sort Departments
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dept.name.toLowerCase().includes(q);
          const matchCode = dept.code.toLowerCase().includes(q);
          const matchHead = (dept.headName || '').toLowerCase().includes(q);
          const matchLoc = (dept.location || '').toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchHead && !matchLoc) return false;
        }

        // Head filter
        if (headFilter === 'assigned') {
          if (!dept.headName || dept.headName === 'Not Assigned') return false;
        } else if (headFilter === 'unassigned') {
          if (dept.headName && dept.headName !== 'Not Assigned') return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'members_desc') {
          return (b.employeeCount || 0) - (a.employeeCount || 0);
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'code_asc') {
          return a.code.localeCompare(b.code);
        }
        if (sortBy === 'budget_desc') {
          return (b.budget || 0) - (a.budget || 0);
        }
        return 0;
      });
  }, [departments, searchQuery, headFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || headFilter !== 'all' || sortBy !== 'members_desc';

  const resetFilters = () => {
    setSearchQuery('');
    setHeadFilter('all');
    setSortBy('members_desc');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-blue-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Departments
                </h1>
                <Badge variant="primary" size="sm">
                  {departments.length} Operational Units
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Organize company divisions, departmental budgets, headcount allocation, and leadership reporting lines.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-card text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="List View"
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-dark-card text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Department CTA */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAddModal}
            className="shadow-sm hover:shadow-md transition-all whitespace-nowrap text-xs font-bold py-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Department
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Departments</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {departments.length}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>All units active</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Headcount</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalHeadcount}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Assigned workforce
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Leadership Coverage</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {assignedHeadsCount} / {departments.length}
              </h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                {departments.length > 0
                  ? `${Math.round((assignedHeadsCount / departments.length) * 100)}% Heads assigned`
                  : '0%'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Allocated Budget</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(totalBudget || 900000)}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Annual budget pool
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search department name, code, or department head..."
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Leadership Filter */}
            <select
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Leadership</option>
              <option value="assigned">Head Assigned</option>
              <option value="unassigned">Head Pending</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="members_desc">Headcount (High → Low)</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="code_asc">Code (A → Z)</option>
              <option value="budget_desc">Budget (High → Low)</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs py-2"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-3">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Departments Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No departments match your search keywords or filter criteria.'
              : 'No departments have been set up yet in your organization.'}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={resetFilters} className="text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={handleOpenAddModal} className="text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create First Department
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 1. GRID VIEW MODE                                                         */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && filteredDepartments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => {
            const pct = totalHeadcount > 0 ? Math.round(((dept.employeeCount || 0) / totalHeadcount) * 100) : 0;
            const hasHead = dept.headName && dept.headName !== 'Not Assigned' && dept.headName.trim() !== '';

            return (
              <Card
                key={dept.id}
                className="p-5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 relative group"
              >
                {/* Top Row: Department Monogram, Name & Action Menu */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Monogram / Icon with Custom Background Color */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-black text-sm shadow-sm transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: dept.color || '#3B82F6' }}
                      >
                        {dept.code}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                          {dept.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {dept.code}
                          </span>
                          {dept.location && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {dept.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Edit / Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(dept)}
                        title="Edit Department"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(dept)}
                        title="Delete Department"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description (if present) */}
                  {dept.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {dept.description}
                    </p>
                  )}

                  {/* Department Head & Budget Information Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-dark-border space-y-2.5">
                    {/* Head of Department */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Department Head</span>
                      {hasHead ? (
                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: dept.color || '#3B82F6' }}
                          />
                          {dept.headName}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {/* Department Budget */}
                    {dept.budget !== undefined && dept.budget > 0 && (
                      <div className="flex items-center justify-between text-xs border-t border-slate-200/50 dark:border-slate-800 pt-2">
                        <span className="text-slate-400 font-medium">Annual Budget</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(dept.budget)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Headcount Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Headcount</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {dept.employeeCount || 0} Members{' '}
                        <span className="text-[11px] text-slate-400 font-normal">({pct}%)</span>
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(pct, 4)}%`,
                          backgroundColor: dept.color || '#3B82F6',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {dept.createdAt ? `Created ${dept.createdAt}` : 'Active Unit'}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/employees`)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group/btn"
                  >
                    <span>View Members</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLE / LIST VIEW MODE                                                 */}
      {/* ========================================================================= */}
      {viewMode === 'table' && filteredDepartments.length > 0 && (
        <Card className="overflow-hidden bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-dark-border">
                <tr>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Department Head</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Headcount</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {filteredDepartments.map((dept) => {
                  const pct = totalHeadcount > 0 ? Math.round(((dept.employeeCount || 0) / totalHeadcount) * 100) : 0;
                  const hasHead = dept.headName && dept.headName !== 'Not Assigned' && dept.headName.trim() !== '';

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                            style={{ backgroundColor: dept.color || '#3B82F6' }}
                          >
                            {dept.code}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {dept.name}
                            </span>
                            {dept.description && (
                              <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                                {dept.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {dept.code}
                      </td>
                      <td className="py-3 px-4">
                        {hasHead ? (
                          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: dept.color || '#3B82F6' }}
                            />
                            {dept.headName}
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 text-xs">Pending Assignment</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {dept.location || 'Headquarters'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            {dept.employeeCount || 0} Members
                          </Badge>
                          <span className="text-slate-400 text-[11px]">({pct}%)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {dept.budget ? formatCurrency(dept.budget) : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(dept)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(dept)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      {/* ADD / EDIT DEPARTMENT MODAL                                               */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? `Edit Department: ${editingDepartment.name}` : 'Create New Department'}
        description="Configure departmental details, leadership reporting line, and budget allocation."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Live Preview Monogram Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 transition-colors"
                style={{ backgroundColor: formData.color }}
              >
                {formData.code || 'DEP'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {formData.name || 'Department Name Preview'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Head: {formData.headName || 'Not Assigned'} • {formData.location || 'Headquarters'}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Budget</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                {formatCurrency(Number(formData.budget) || 0)}
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering & Tech, Product Design, Finance & Payroll"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {formErrors.name && (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.name}</p>
              )}
            </div>

            {/* Department Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ENG, FIN, MKT"
                maxLength={6}
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                }
                className={`w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.code ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {formErrors.code ? (
                <p className="text-[11px] text-rose-500 font-medium">{formErrors.code}</p>
              ) : (
                <p className="text-[10px] text-slate-400">Short unique 2-5 letter code identifier</p>
              )}
            </div>

            {/* Department Head Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department Head / Lead
              </label>
              <select
                value={formData.headOfDepartmentId}
                onChange={(e) => handleHeadSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">— Unassigned (Assign Later) —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName || `${emp.firstName} ${emp.lastName}`} ({emp.designation || 'Staff'})
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Campus */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Office Location / Branch
              </label>
              <input
                type="text"
                placeholder="e.g. Headquarters, Tech Hub, Remote"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Annual Budget */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Annual Budget Allocation ($)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                placeholder="150000"
                value={formData.budget}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Color Accent Presets */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: preset.value }))}
                    className={`h-7 w-7 rounded-full transition-transform flex items-center justify-center ${preset.bg} ${
                      formData.color.toLowerCase() === preset.value.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                        : 'opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                    title={preset.label}
                  >
                    {formData.color.toLowerCase() === preset.value.toLowerCase() && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}

                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white"
                  />
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            {/* Mission / Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department Charter / Description
              </label>
              <textarea
                rows={3}
                placeholder="Core responsibilities, departmental goals, and key objectives..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
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
                <span>Saving...</span>
              ) : editingDepartment ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Update Department</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Create Department</span>
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
        title="Delete Department"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-xs">
                Are you sure you want to delete this department?
              </h4>
              <p className="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5">
                Department <strong>{departmentToDelete?.name}</strong> ({departmentToDelete?.code}) will be removed.
              </p>
            </div>
          </div>

          {departmentToDelete && (departmentToDelete.employeeCount || 0) > 0 && (
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              <strong className="text-rose-600">{departmentToDelete.employeeCount} active employees</strong> belong to this department. You will need to reassign them to another department.
            </p>
          )}

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
              onClick={confirmDeleteDepartment}
              className="bg-rose-600 hover:bg-rose-700 text-white border-transparent text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Department
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
