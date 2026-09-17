import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { Designation, Department } from '../../types';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  Award,
  Plus,
  ArrowRight,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  LayoutGrid,
  List,
  Layers,
  DollarSign,
  RotateCcw,
  X,
  Sparkles,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

const SENIORITY_LEVELS = [
  { code: 'L1', name: 'L1 - Associate / Entry', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { code: 'L2', name: 'L2 - Junior / Specialist', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { code: 'L3', name: 'L3 - Mid-Level Professional', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' },
  { code: 'L4', name: 'L4 - Senior Specialist', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  { code: 'L5', name: 'L5 - Lead / Staff', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  { code: 'L6', name: 'L6 - Principal / Director', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  { code: 'L7', name: 'L7 - VP / Executive', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
];

interface DesignationFormData {
  title: string;
  departmentId: string;
  departmentName: string;
  level: string;
  bandTrack: 'IC' | 'Management' | 'Executive';
  salaryBandMin: number;
  salaryBandMax: number;
  description: string;
}

const DEFAULT_FORM: DesignationFormData = {
  title: '',
  departmentId: '',
  departmentName: '',
  level: 'L4',
  bandTrack: 'IC',
  salaryBandMin: 100000,
  salaryBandMax: 140000,
  description: '',
};

export const DesignationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode: 'grid' | 'table' | 'hierarchy'
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'hierarchy'>('grid');

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'level_desc' | 'level_asc' | 'headcount_desc' | 'title_asc'>('level_desc');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  const [formData, setFormData] = useState<DesignationFormData>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Safeguard
  const [designationToDelete, setDesignationToDelete] = useState<Designation | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [desList, deptList] = await Promise.all([
        employeeService.getDesignations(),
        employeeService.getDepartments(),
      ]);
      setDesignations(desList);
      setDepartments(deptList);
      if (deptList.length > 0 && !formData.departmentId) {
        setFormData((prev) => ({
          ...prev,
          departmentId: deptList[0].id,
          departmentName: deptList[0].name,
        }));
      }
    } catch (err) {
      console.error('Failed to load designations data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute total employees mapped to designations
  const totalHeadcount = useMemo(() => {
    return designations.reduce((sum, d) => sum + (d.employeeCount || 0), 0);
  }, [designations]);

  const uniqueLevelsCount = useMemo(() => {
    return new Set(designations.map((d) => d.level)).size;
  }, [designations]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingDesignation(null);
    setFormData({
      ...DEFAULT_FORM,
      departmentId: departments[0]?.id || '',
      departmentName: departments[0]?.name || 'Engineering',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (des: Designation) => {
    setEditingDesignation(des);
    setFormData({
      title: des.title,
      departmentId: des.departmentId || '',
      departmentName: des.departmentName || '',
      level: des.level || 'L4',
      bandTrack: des.bandTrack || 'IC',
      salaryBandMin: des.salaryBandMin || 90000,
      salaryBandMax: des.salaryBandMax || 130000,
      description: des.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle department change in form
  const handleDepartmentChange = (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId);
    setFormData((prev) => ({
      ...prev,
      departmentId: deptId,
      departmentName: dept?.name || 'General',
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.departmentName.trim()) errors.department = 'Department is required';
    if (formData.salaryBandMin > formData.salaryBandMax) {
      errors.salary = 'Minimum salary cannot exceed maximum salary';
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
      if (editingDesignation) {
        await employeeService.updateDesignation(editingDesignation.id, {
          title: formData.title.trim(),
          departmentId: formData.departmentId,
          departmentName: formData.departmentName,
          level: formData.level,
          bandTrack: formData.bandTrack,
          salaryBandMin: Number(formData.salaryBandMin) || 0,
          salaryBandMax: Number(formData.salaryBandMax) || 0,
          description: formData.description.trim(),
        });
        showToast(`Designation "${formData.title}" updated successfully!`);
      } else {
        await employeeService.createDesignation({
          title: formData.title.trim(),
          departmentId: formData.departmentId,
          departmentName: formData.departmentName,
          level: formData.level,
          bandTrack: formData.bandTrack,
          salaryBandMin: Number(formData.salaryBandMin) || 0,
          salaryBandMax: Number(formData.salaryBandMax) || 0,
          description: formData.description.trim(),
          employeeCount: 0,
        });
        showToast(`Designation "${formData.title}" created successfully!`);
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteClick = (des: Designation) => {
    setDesignationToDelete(des);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDesignation = async () => {
    if (!designationToDelete) return;
    try {
      await employeeService.deleteDesignation(designationToDelete.id);
      showToast(`Designation "${designationToDelete.title}" removed.`);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove designation.');
    } finally {
      setIsDeleteModalOpen(false);
      setDesignationToDelete(null);
    }
  };

  // Filtered and Sorted Designations
  const filteredDesignations = useMemo(() => {
    return designations
      .filter((des) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = des.title.toLowerCase().includes(q);
          const matchDept = (des.departmentName || '').toLowerCase().includes(q);
          const matchLevel = (des.level || '').toLowerCase().includes(q);
          const matchDesc = (des.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDept && !matchLevel && !matchDesc) return false;
        }

        // Department
        if (selectedDept !== 'all' && des.departmentName !== selectedDept) return false;

        // Level
        if (selectedLevel !== 'all' && des.level !== selectedLevel) return false;

        // Track
        if (selectedTrack !== 'all' && des.bandTrack !== selectedTrack) return false;

        return true;
      })
      .sort((a, b) => {
        const getLevelRank = (lvl: string) => {
          const m = lvl.match(/L(\d+)/i);
          return m ? parseInt(m[1], 10) : 0;
        };

        if (sortBy === 'level_desc') return getLevelRank(b.level) - getLevelRank(a.level);
        if (sortBy === 'level_asc') return getLevelRank(a.level) - getLevelRank(b.level);
        if (sortBy === 'headcount_desc') return (b.employeeCount || 0) - (a.employeeCount || 0);
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [designations, searchQuery, selectedDept, selectedLevel, selectedTrack, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDept !== 'all' ||
    selectedLevel !== 'all' ||
    selectedTrack !== 'all' ||
    sortBy !== 'level_desc';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedLevel('all');
    setSelectedTrack('all');
    setSortBy('level_desc');
  };

  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl?.toUpperCase()) {
      case 'L7':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'L6':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
      case 'L5':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      case 'L4':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      case 'L3':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
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

      {/* Page Header with Cloudy Wave Design */}
      <PageHeaderCard
        title="Designations & Job Titles"
        subtitle="Manage organization seniority bands (L1 - L7), career ladders, compensation ranges, and titles."
        icon={Award}
        badge={
          <Badge variant="primary" size="sm">
            {designations.length} Role Profiles
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: Grid / Table / Hierarchy */}
            <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Corporate Table View"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('hierarchy')}
                title="Band Hierarchy Ladder"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                  viewMode === 'hierarchy'
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Hierarchy</span>
              </button>
            </div>

            {/* Add Designation Button */}
            <Button
              size="sm"
              variant="primary"
              onClick={handleOpenAddModal}
              className="shadow-sm hover:shadow-md text-xs font-bold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Designation
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Designations</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {designations.length}
              </h3>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Standardized corporate titles
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Headcount</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalHeadcount}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Employees mapped</span>
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Seniority Levels</p>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {uniqueLevelsCount} Bands
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Spanning L1 to L7 ladder
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Career Tracks</p>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                3 Tracks
              </h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                IC • Management • Exec
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by job title, department, band level, or description..."
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Bands (L1 - L7)</option>
              {SENIORITY_LEVELS.map((lvl) => (
                <option key={lvl.code} value={lvl.code}>
                  {lvl.name}
                </option>
              ))}
            </select>

            {/* Track Filter */}
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Career Tracks</option>
              <option value="IC">Individual Contributor (IC)</option>
              <option value="Management">Management / Lead</option>
              <option value="Executive">Executive Leadership</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="level_desc">Seniority (Highest First)</option>
              <option value="level_asc">Seniority (Lowest First)</option>
              <option value="headcount_desc">Headcount (High → Low)</option>
              <option value="title_asc">Title (A → Z)</option>
            </select>

            {/* Reset */}
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

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-850">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredDesignations.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{designations.length}</strong> designations
          </span>
          <span className="text-[11px] text-slate-400">
            Structure: <strong className="text-blue-600 dark:text-blue-400 capitalize">{viewMode} Mode</strong>
          </span>
        </div>
      </Card>

      {/* Empty State */}
      {filteredDesignations.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-3">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Designations Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No job titles match your search query or filter selection.'
              : 'No designations have been defined yet.'}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={resetAllFilters} className="text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={handleOpenAddModal} className="text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create First Designation
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 1. VIEW MODE: GRID CARDS                                                  */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && filteredDesignations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDesignations.map((des) => {
            const pct = totalHeadcount > 0 ? Math.round(((des.employeeCount || 0) / totalHeadcount) * 100) : 0;

            return (
              <Card
                key={des.id}
                className="p-5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 relative group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon, Title & Level Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                          {des.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {des.departmentName}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                            {des.bandTrack || 'IC'} Track
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${getLevelBadgeColor(
                          des.level
                        )}`}
                      >
                        {des.level}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {des.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {des.description}
                    </p>
                  )}

                  {/* Compensation Band & Level Info Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-dark-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Salary Compensation Band</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(des.salaryBandMin || 85000)} – {formatCurrency(des.salaryBandMax || 135000)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800 pt-1.5 text-[11px]">
                      <span className="text-slate-400">Seniority Classification</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {SENIORITY_LEVELS.find((l) => l.code === des.level)?.name || `Level ${des.level}`}
                      </span>
                    </div>
                  </div>

                  {/* Headcount Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Active Team Members</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {des.employeeCount || 0} Staff{' '}
                        <span className="text-[11px] text-slate-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => navigate('/employees')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group/btn"
                  >
                    <span>View Employees</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(des)}
                      title="Edit Designation"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(des)}
                      title="Remove Designation"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW MODE: CORPORATE TABLE                                             */}
      {/* ========================================================================= */}
      {viewMode === 'table' && filteredDesignations.length > 0 && (
        <Card className="overflow-hidden bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-dark-border">
                <tr>
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Band Level</th>
                  <th className="py-3.5 px-4">Career Track</th>
                  <th className="py-3.5 px-4">Compensation Band</th>
                  <th className="py-3.5 px-4">Active Staff</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {filteredDesignations.map((des) => (
                  <tr key={des.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{des.title}</span>
                          {des.description && (
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                              {des.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {des.departmentName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black border ${getLevelBadgeColor(des.level)}`}>
                        {des.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                        {des.bandTrack || 'IC'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(des.salaryBandMin || 85000)} – {formatCurrency(des.salaryBandMax || 135000)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="primary" size="sm">
                        {des.employeeCount || 0} Staff
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
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
                          onClick={() => handleOpenEditModal(des)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(des)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE: BAND HIERARCHY LADDER                                       */}
      {/* ========================================================================= */}
      {viewMode === 'hierarchy' && filteredDesignations.length > 0 && (
        <div className="space-y-6">
          {SENIORITY_LEVELS.slice()
            .reverse()
            .map((lvl) => {
              const levelDesigs = filteredDesignations.filter((d) => d.level === lvl.code);
              if (levelDesigs.length === 0) return null;

              return (
                <div key={lvl.code} className="space-y-3">
                  {/* Level Header Banner */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-dark-border">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getLevelBadgeColor(lvl.code)}`}>
                        {lvl.code}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs">{lvl.name}</h3>
                        <p className="text-[11px] text-slate-400">
                          {levelDesigs.length} standardized roles at this seniority grade
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Level Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levelDesigs.map((des) => (
                      <Card
                        key={des.id}
                        className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{des.title}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {des.bandTrack || 'IC'}
                            </span>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{des.departmentName}</p>
                          <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                            {formatCurrency(des.salaryBandMin || 85000)} – {formatCurrency(des.salaryBandMax || 135000)}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">{des.employeeCount || 0} Staff</span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(des)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT DESIGNATION MODAL                                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDesignation ? `Edit Designation: ${editingDesignation.title}` : 'Add New Designation'}
        description="Configure standardized job title, department assignment, seniority band, and salary range."
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getLevelBadgeColor(formData.level)}`}>
                {formData.level}
              </span>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {formData.title || 'Designation Title Preview'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formData.departmentName || 'Department'} • {formData.bandTrack} Track
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Salary Range</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                {formatCurrency(Number(formData.salaryBandMin) || 0)} – {formatCurrency(Number(formData.salaryBandMax) || 0)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Job Title / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer, Head of Growth, Lead UI Designer"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {formErrors.title && <p className="text-[11px] text-rose-500 font-medium">{formErrors.title}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seniority Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Seniority Level Band <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold"
              >
                {SENIORITY_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Career Track */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Career Track
              </label>
              <select
                value={formData.bandTrack}
                onChange={(e) => setFormData((prev) => ({ ...prev, bandTrack: e.target.value as any }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="IC">Individual Contributor (IC)</option>
                <option value="Management">Management (People Lead)</option>
                <option value="Executive">Executive Leadership</option>
              </select>
            </div>

            {/* Min Salary Band */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Minimum Annual Salary ($)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={formData.salaryBandMin}
                onChange={(e) => setFormData((prev) => ({ ...prev, salaryBandMin: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Salary Band */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Maximum Annual Salary ($)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={formData.salaryBandMax}
                onChange={(e) => setFormData((prev) => ({ ...prev, salaryBandMax: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Role Description & Key Responsibilities
              </label>
              <textarea
                rows={3}
                placeholder="Core responsibilities, required competencies, and reporting lines..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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
              ) : editingDesignation ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Update Designation</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Create Designation</span>
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
        title="Remove Designation"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-xs">
                Are you sure you want to delete this designation?
              </h4>
              <p className="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5">
                Job title <strong>{designationToDelete?.title}</strong> ({designationToDelete?.level}) will be permanently removed.
              </p>
            </div>
          </div>

          {designationToDelete && (designationToDelete.employeeCount || 0) > 0 && (
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              <strong className="text-rose-600">{designationToDelete.employeeCount} active team members</strong> currently hold this title.
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
              onClick={confirmDeleteDesignation}
              className="bg-rose-600 hover:bg-rose-700 text-white border-transparent text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Designation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
