import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckSquare,
  ArrowUp,
  ChevronDown,
  Plus,
  Download,
  MoreVertical,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';

interface TimesheetRow {
  id: string;
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  hoursDecimal: number;
  status: 'Present' | 'Absent' | 'Holiday' | 'Leave';
}

export const TimesheetsPage: React.FC = () => {
  const navigate = useNavigate();

  // Selected date range
  const [selectedRange, setSelectedRange] = useState('Apr 21, 2025 – Apr 27, 2025');
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  // Add Timesheet Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for new entry
  const [newEntry, setNewEntry] = useState({
    date: '2025-04-28',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present' as const,
    notes: ''
  });

  // Table Data exactly matching reference image
  const [rows, setRows] = useState<TimesheetRow[]>([
    {
      id: '1',
      date: '21 Apr 2025',
      day: 'Mon',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      totalHours: '8 h 00 m',
      hoursDecimal: 8,
      status: 'Present'
    },
    {
      id: '2',
      date: '22 Apr 2025',
      day: 'Tue',
      checkIn: '09:15 AM',
      checkOut: '06:15 PM',
      totalHours: '8 h 00 m',
      hoursDecimal: 8,
      status: 'Present'
    },
    {
      id: '3',
      date: '23 Apr 2025',
      day: 'Wed',
      checkIn: '09:05 AM',
      checkOut: '06:10 PM',
      totalHours: '8 h 05 m',
      hoursDecimal: 8.08,
      status: 'Present'
    },
    {
      id: '4',
      date: '24 Apr 2025',
      day: 'Thu',
      checkIn: '09:00 AM',
      checkOut: '06:30 PM',
      totalHours: '8 h 30 m',
      hoursDecimal: 8.5,
      status: 'Present'
    },
    {
      id: '5',
      date: '25 Apr 2025',
      day: 'Fri',
      checkIn: '09:10 AM',
      checkOut: '07:00 PM',
      totalHours: '8 h 50 m',
      hoursDecimal: 8.83,
      status: 'Present'
    },
    {
      id: '6',
      date: '26 Apr 2025',
      day: 'Sat',
      checkIn: '—',
      checkOut: '—',
      totalHours: '0 h 00 m',
      hoursDecimal: 0,
      status: 'Absent'
    },
    {
      id: '7',
      date: '27 Apr 2025',
      day: 'Sun',
      checkIn: '—',
      checkOut: '—',
      totalHours: '0 h 00 m',
      hoursDecimal: 0,
      status: 'Holiday'
    }
  ]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Day', 'Check In', 'Check Out', 'Total Hours', 'Status'].join(','),
      ...rows.map(r => [r.date, r.day, r.checkIn, r.checkOut, r.totalHours, r.status].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `timesheet_${selectedRange.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Timesheet exported successfully!');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = new Date(newEntry.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const dayName = new Date(newEntry.date).toLocaleDateString('en-GB', { weekday: 'short' });

    const newRow: TimesheetRow = {
      id: Date.now().toString(),
      date: formattedDate,
      day: dayName,
      checkIn: newEntry.checkIn ? `${newEntry.checkIn} AM` : '09:00 AM',
      checkOut: newEntry.checkOut ? `${newEntry.checkOut} PM` : '06:00 PM',
      totalHours: '8 h 00 m',
      hoursDecimal: 8,
      status: newEntry.status
    };

    setRows([newRow, ...rows]);
    setIsAddModalOpen(false);
    showToast('Timesheet entry added successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* =========================================================================
          TOP PAGE HEADER WITH ICON, TITLE, DATE RANGE & ADD TIMESHEET
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Icon + Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/80 dark:border-blue-900/60 shadow-xs flex-shrink-0">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white">
              Timesheets
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
              Track your working hours and manage your timesheets easily.
            </p>
          </div>
        </div>

        {/* Right: Date Range Dropdown + Add Timesheet Button */}
        <div className="flex items-center gap-3">
          {/* Date Range Picker Button */}
          <div className="relative">
            <button
              onClick={() => setIsRangeOpen(!isRangeOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isRangeOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-30 animate-fade-in text-xs">
                {[
                  'Apr 21, 2025 – Apr 27, 2025',
                  'Apr 14, 2025 – Apr 20, 2025',
                  'Apr 07, 2025 – Apr 13, 2025',
                  'Mar 31, 2025 – Apr 06, 2025'
                ].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setIsRangeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors ${
                      selectedRange === range
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Timesheet Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Timesheet</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP 4 METRIC STAT CARDS WITH COMPACT HORIZONTAL ROW LAYOUT & GLASS EFFECT
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Hours */}
        <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-blue-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100/60 dark:border-blue-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  40 h 00 m
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Hours
                </span>
                <span className="flex items-center text-[11px] font-semibold text-emerald-500">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  12%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Billable Hours */}
        <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-emerald-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs border border-emerald-100/60 dark:border-emerald-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <CheckSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  36 h 00 m
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Billable Hours
                </span>
                <span className="flex items-center text-[11px] font-semibold text-emerald-500">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  15%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Working Days */}
        <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-purple-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-purple-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-50/90 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs border border-purple-100/60 dark:border-purple-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  5 / 5
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Working Days
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-400">
                  Mon - Fri
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Overtime */}
        <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-indigo-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100/60 dark:border-indigo-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  2 h 00 m
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Overtime
                </span>
                <span className="flex items-center text-[11px] font-semibold text-emerald-500">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  50%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN SECTION: 2-COLUMN LAYOUT (TABLE ON LEFT, CARDS ON RIGHT)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =====================================================================
            LEFT COLUMN: TIMESHEET DETAILS TABLE
           ===================================================================== */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          
          {/* Section Header with Title & Export Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Timesheet Details
            </h2>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Day</th>
                  <th className="py-3 px-3">Check In</th>
                  <th className="py-3 px-3">Check Out</th>
                  <th className="py-3 px-3">Total Hours</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Day */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {row.day}
                    </td>

                    {/* Check In */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {row.checkIn}
                    </td>

                    {/* Check Out */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {row.checkOut}
                    </td>

                    {/* Total Hours */}
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {row.totalHours}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                          row.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : row.status === 'Absent'
                            ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Action 3-dots */}
                    <td className="py-3.5 px-3 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenuRowId(activeMenuRowId === row.id ? null : row.id)
                        }
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuRowId === row.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-20 animate-fade-in text-left">
                          <button
                            onClick={() => {
                              showToast(`Viewing details for ${row.date}`);
                              setActiveMenuRowId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium"
                          >
                            View Timecard
                          </button>
                          <button
                            onClick={() => {
                              showToast(`Regularisation requested for ${row.date}`);
                              setActiveMenuRowId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium"
                          >
                            Request Regularisation
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: 3 STACKED CARDS (PROGRESS, WEEKLY HOURS, QUICK ACTIONS)
           ===================================================================== */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Your Progress */}
          <div className="bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/60 dark:from-blue-950/40 dark:via-sky-950/20 dark:to-indigo-950/30 rounded-3xl p-5 border border-blue-100/80 dark:border-blue-900/40 shadow-xs relative overflow-hidden">
            
            <div className="flex items-center gap-4">
              {/* Illustration Clock with decorative leaves/curves */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                {/* Soft decorative background circles */}
                <div className="absolute inset-0 rounded-full bg-blue-200/50 dark:bg-blue-800/30 blur-xs" />
                <svg viewBox="0 0 64 64" className="w-16 h-16 relative z-10">
                  {/* Decorative soft teal and blue leaf shapes */}
                  <path
                    d="M 12,32 C 6,24 10,12 24,14 C 18,22 18,30 12,32 Z"
                    fill="#60A5FA"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M 52,32 C 58,24 54,12 40,14 C 46,22 46,30 52,32 Z"
                    fill="#38BDF8"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M 16,48 C 8,52 14,60 26,56 C 20,52 18,46 16,48 Z"
                    fill="#3B82F6"
                    fillOpacity="0.3"
                  />
                  <path
                    d="M 48,48 C 56,52 50,60 38,56 C 44,52 46,46 48,48 Z"
                    fill="#60A5FA"
                    fillOpacity="0.3"
                  />
                  {/* Clock circle */}
                  <circle cx="32" cy="32" r="16" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                  {/* Clock hands pointing at 10:10 */}
                  <line x1="32" y1="32" x2="32" y2="22" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  <line x1="32" y1="32" x2="40" y2="32" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="32" cy="32" r="2" fill="#2563EB" />
                </svg>
              </div>

              {/* Progress Content */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Your Progress
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Stay consistent! You're doing great.
                  </p>
                </div>

                {/* Progress Bar with 83% */}
                <div className="flex items-center gap-2.5 pt-0.5">
                  <div className="flex-1 h-3 bg-blue-100/70 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: '83%' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    83%
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 2: Weekly Hours Bar Chart */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            {/* Header with Title & 40h Badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Weekly Hours
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Clock className="w-3.5 h-3.5" />
                <span>40 h 00 m</span>
              </div>
            </div>

            {/* 7-Day Vertical Bars Container */}
            <div className="flex items-end justify-between gap-2 pt-2 px-1">
              {[
                { day: 'Mon', hours: '8h', height: '65%', active: true },
                { day: 'Tue', hours: '8h', height: '65%', active: true },
                { day: 'Wed', hours: '8h', height: '65%', active: true },
                { day: 'Thu', hours: '8.5h', height: '75%', active: true },
                { day: 'Fri', hours: '8.5h', height: '75%', active: true },
                { day: 'Sat', hours: '0h', height: '30%', active: false },
                { day: 'Sun', hours: '0h', height: '30%', active: false }
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center flex-1">
                  {/* Top Hours Label */}
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5">
                    {item.hours}
                  </span>

                  {/* Bar Height Container (90px tall) */}
                  <div className="w-full h-24 flex items-end justify-center">
                    <div
                      className={`w-full max-w-[28px] rounded-xl transition-all duration-300 ${
                        item.active
                          ? 'bg-gradient-to-t from-blue-700 via-blue-600 to-sky-400 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/80'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>

                  {/* Bottom Day Label */}
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-2">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-1">
              Quick Actions
            </h3>

            <div className="space-y-1">
              {/* Action 1: Apply for Leave */}
              <button
                onClick={() => navigate('/leave/apply')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Apply for Leave
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Action 2: View Attendance */}
              <button
                onClick={() => navigate('/attendance')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    View Attendance
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Action 3: Download Timesheet */}
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Download Timesheet
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          ADD TIMESHEET MODAL
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Add Timesheet Log
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTimesheet} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Check In Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.checkIn}
                    onChange={(e) => setNewEntry({ ...newEntry, checkIn: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Check Out Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.checkOut}
                    onChange={(e) => setNewEntry({ ...newEntry, checkOut: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={newEntry.status}
                  onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value as any })}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Task Description
                </label>
                <textarea
                  rows={2}
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Describe tasks completed today..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TimesheetsPage;
