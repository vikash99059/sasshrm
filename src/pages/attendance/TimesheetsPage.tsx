import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';

export const TimesheetsPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState('May 13 - May 19, 2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const timesheetEntries = [
    { id: 'TS-01', name: 'Sarah Wilson', dept: 'Marketing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', regularHours: 40, otHours: 4.5, totalHours: 44.5, billablePct: 92, status: 'Approved' },
    { id: 'TS-02', name: 'David Miller', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', regularHours: 40, otHours: 8.0, totalHours: 48.0, billablePct: 95, status: 'Approved' },
    { id: 'TS-03', name: 'Elena Rostova', dept: 'Product', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', regularHours: 38.5, otHours: 0, totalHours: 38.5, billablePct: 88, status: 'Submitted' },
    { id: 'TS-04', name: 'Marcus Vance', dept: 'Operations', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', regularHours: 40, otHours: 2.0, totalHours: 42.0, billablePct: 80, status: 'Submitted' },
    { id: 'TS-05', name: 'James Wilson', dept: 'Sales', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', regularHours: 36, otHours: 0, totalHours: 36.0, billablePct: 75, status: 'Rejected' },
  ];

  const filtered = timesheetEntries.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Weekly Timesheets Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track employee billable hours, overtime logs, project allocation, and supervisor approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 shadow-xs">
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-bold px-2 text-slate-800 dark:text-slate-200">{currentWeek}</span>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1.5" />
            Export Payroll CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Logged Hours</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">1,984.5 hrs</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+3.2% vs last week</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Overtime (OT)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">124.0 hrs</div>
          <span className="text-xs text-slate-400">1.5x Pay Rate</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Utilization</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">88.4%</div>
          <span className="text-xs text-slate-400">Billable client projects</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Pending Submissions</span>
          <div className="text-2xl font-black text-amber-500 mt-2">8</div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Due by Friday 5 PM</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Approved', 'Submitted', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Regular Hours</th>
                <th className="py-3.5 px-4">Overtime (OT)</th>
                <th className="py-3.5 px-4">Total Logged</th>
                <th className="py-3.5 px-4">Billable %</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</div>
                        <div className="text-slate-400 text-[11px]">{item.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.regularHours}h</td>
                  <td className="py-4 px-4 font-semibold text-blue-600 dark:text-blue-400">{item.otHours}h</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{item.totalHours} hrs</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.billablePct}%` }} />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.billablePct}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      item.status === 'Submitted' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View Timecard
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TimesheetsPage;
