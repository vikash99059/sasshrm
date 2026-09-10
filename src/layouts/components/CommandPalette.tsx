import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { INITIAL_EMPLOYEES } from '../../services/mockDb';
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
} from 'lucide-react';
import { cn } from '../../utils';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
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
    { title: 'HR Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { title: 'Employees List', path: '/employees', icon: Users, category: 'Pages' },
    { title: 'Attendance & Logs', path: '/attendance', icon: Clock, category: 'Pages' },
    { title: 'Live Clock In / Out', path: '/clock-in', icon: Clock, category: 'Actions' },
    { title: 'Leave Requests & Approvals', path: '/leave', icon: CalendarDays, category: 'Pages' },
    { title: 'Process Payroll Batch', path: '/payroll', icon: DollarSign, category: 'Pages' },
    { title: 'Recruitment & ATS Kanban', path: '/recruitment/candidates', icon: Briefcase, category: 'Pages' },
    { title: 'Goals & OKRs', path: '/performance/goals', icon: Target, category: 'Pages' },
    { title: 'Expense Claims', path: '/operations/expenses', icon: FileText, category: 'Pages' },
    { title: 'Company Assets', path: '/operations/assets', icon: Package, category: 'Pages' },
    { title: 'Settings & Permissions', path: '/settings', icon: Settings, category: 'Settings' },
  ];

  const matchedEmployees = query
    ? INITIAL_EMPLOYEES.filter(
        (e) =>
          e.fullName.toLowerCase().includes(query.toLowerCase()) ||
          e.department.toLowerCase().includes(query.toLowerCase()) ||
          e.employeeId.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedPages = quickPages.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 animate-fade-in">
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
            placeholder="Type a command, employee name, or navigate to a module..."
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
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
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
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group"
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
          <span>HRM Pro Command Palette</span>
        </div>
      </div>
    </div>
  );
};
