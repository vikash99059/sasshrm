import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  INITIAL_EMPLOYEES,
  INITIAL_CANDIDATES,
  INITIAL_JOB_OPENINGS,
  INITIAL_JOB_REQUISITIONS,
  INITIAL_APPLICATIONS,
  INITIAL_OFFERS,
} from '../../services/mockDb';
import {
  Search,
  Users,
  LayoutDashboard,
  Clock,
  CalendarDays,
  DollarSign,
  Briefcase,
  Target,
  FileText,
  Package,
  Settings,
  X,
  ArrowRight,
  UserCheck,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, currentRole } = useAppStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickPages = [
    { title: 'Recruiter Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard, category: 'Recruitment' },
    { title: 'Candidate Database', path: '/recruiter/candidates', icon: UserCheck, category: 'Recruitment' },
    { title: 'Recruitment Pipeline (Kanban)', path: '/recruiter/pipeline', icon: Briefcase, category: 'Recruitment' },
    { title: 'Job Openings', path: '/recruiter/jobs', icon: Briefcase, category: 'Recruitment' },
    { title: 'Job Requisitions', path: '/recruiter/requisitions', icon: FileText, category: 'Recruitment' },
    { title: 'Interview Calendar', path: '/recruiter/interviews', icon: Calendar, category: 'Recruitment' },
    { title: 'Offer Management', path: '/recruiter/offers', icon: CreditCard, category: 'Recruitment' },
    { title: 'HR Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { title: 'Employees List', path: '/employees', icon: Users, category: 'Pages' },
    { title: 'Settings & Permissions', path: '/settings', icon: Settings, category: 'Settings' },
  ];

  // Search ATS Entities
  const lowerQuery = query.toLowerCase();

  const matchedCandidates = query
    ? INITIAL_CANDIDATES.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.email.toLowerCase().includes(lowerQuery) ||
          c.jobTitle.toLowerCase().includes(lowerQuery) ||
          c.skills?.some((s) => s.toLowerCase().includes(lowerQuery))
      ).slice(0, 4)
    : [];

  const matchedJobs = query
    ? INITIAL_JOB_OPENINGS.filter(
        (j) =>
          j.title.toLowerCase().includes(lowerQuery) ||
          j.department.toLowerCase().includes(lowerQuery) ||
          j.id.toLowerCase().includes(lowerQuery)
      ).slice(0, 3)
    : [];

  const matchedRequisitions = query
    ? INITIAL_JOB_REQUISITIONS.filter(
        (r) =>
          r.jobTitle.toLowerCase().includes(lowerQuery) ||
          r.id.toLowerCase().includes(lowerQuery) ||
          r.department.toLowerCase().includes(lowerQuery)
      ).slice(0, 3)
    : [];

  const matchedApplications = query
    ? INITIAL_APPLICATIONS.filter(
        (a) =>
          a.candidateName.toLowerCase().includes(lowerQuery) ||
          a.jobTitle.toLowerCase().includes(lowerQuery) ||
          a.id.toLowerCase().includes(lowerQuery)
      ).slice(0, 3)
    : [];

  const matchedOffers = query
    ? INITIAL_OFFERS.filter(
        (o) =>
          o.candidateName.toLowerCase().includes(lowerQuery) ||
          o.jobTitle.toLowerCase().includes(lowerQuery) ||
          o.id.toLowerCase().includes(lowerQuery)
      ).slice(0, 3)
    : [];

  const matchedEmployees = query
    ? INITIAL_EMPLOYEES.filter(
        (e) =>
          e.fullName.toLowerCase().includes(lowerQuery) ||
          e.department.toLowerCase().includes(lowerQuery) ||
          e.employeeId.toLowerCase().includes(lowerQuery)
      ).slice(0, 4)
    : [];

  const matchedPages = quickPages.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-dark-border dark:bg-dark-card z-10">
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-100 px-4 py-3 dark:border-dark-border">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates, jobs, requisitions, applications, offers, employees..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[480px] overflow-y-auto p-3 space-y-4">
          {/* Matched Candidates */}
          {matchedCandidates.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Candidates ({matchedCandidates.length})
              </p>
              <div className="space-y-1">
                {matchedCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => handleSelect('/recruiter/candidates')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {cand.name} <span className="text-[10px] font-normal text-slate-400">({cand.stage})</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cand.jobTitle} • {cand.location}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Jobs */}
          {matchedJobs.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Job Openings ({matchedJobs.length})
              </p>
              <div className="space-y-1">
                {matchedJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSelect('/recruiter/jobs')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600">
                        {job.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {job.department} • {job.location} • {job.positions} openings
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Requisitions */}
          {matchedRequisitions.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Job Requisitions ({matchedRequisitions.length})
              </p>
              <div className="space-y-1">
                {matchedRequisitions.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => handleSelect('/recruiter/requisitions')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600">
                        {req.jobTitle} <span className="font-mono text-[10px] text-slate-400">({req.id})</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {req.department} • Status: {req.approvalStatus}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Applications */}
          {matchedApplications.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Applications ({matchedApplications.length})
              </p>
              <div className="space-y-1">
                {matchedApplications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect('/recruiter/applications')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600">
                        {app.candidateName} — {app.jobTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Stage: {app.currentStage} • ID: {app.id}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Offers */}
          {matchedOffers.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Offers ({matchedOffers.length})
              </p>
              <div className="space-y-1">
                {matchedOffers.map((off) => (
                  <button
                    key={off.id}
                    onClick={() => handleSelect('/recruiter/offers')}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-amber-600">
                        {off.candidateName} — {off.jobTitle} ({off.salaryFormatted})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Status: {off.offerStatus} • ID: {off.id}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Employees */}
          {matchedEmployees.length > 0 && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Employees ({matchedEmployees.length})
              </p>
              <div className="space-y-1">
                {matchedEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleSelect(`/employees/${emp.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {emp.fullName} <span className="text-[10px] font-normal text-slate-400">({emp.employeeId})</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{emp.designation} • {emp.department}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Pages & Actions */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Modules & Quick Actions
            </p>
            <div className="space-y-1">
              {matchedPages.map((page, idx) => {
                const Icon = page.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(page.path)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {page.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{page.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Shortcut Helper */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 dark:border-dark-border dark:bg-slate-900/50 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="rounded border px-1 py-0.5 font-semibold bg-white dark:bg-slate-800">↑</kbd> <kbd className="rounded border px-1 py-0.5 font-semibold bg-white dark:bg-slate-800">↓</kbd> to navigate</span>
            <span><kbd className="rounded border px-1 py-0.5 font-semibold bg-white dark:bg-slate-800">ESC</kbd> to close</span>
          </div>
          <span>HRM Pro Talent Search & Command Palette</span>
        </div>
      </div>
    </div>
  );
};
