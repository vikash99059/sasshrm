import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Gift,
  Clock,
  Cake,
  Video,
  Phone,
  Target,
  Umbrella,
  BookOpen,
  Coffee,
  X,
  CheckCircle2,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  day: number;
  dateStr: string;
  title: string;
  time: string;
  type: 'meeting' | 'discussion' | 'holiday' | 'review' | 'call' | 'birthday' | 'leave' | 'training' | 'lunch';
  color: string;
  textColor: string;
  borderColor: string;
  icon: React.ElementType;
}

export const CalendarPage: React.FC = () => {
  // Calendar state
  const [currentMonthName, setCurrentMonthName] = useState('April 2025');
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedMiniDate, setSelectedMiniDate] = useState<number>(11);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting' as CalendarEvent['type'],
    day: 15,
    time: '10:00 AM',
    notes: ''
  });

  // Events list matching reference design
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      day: 1,
      dateStr: 'Apr 01, 2025',
      title: 'Team Meeting',
      time: '10:00 AM',
      type: 'meeting',
      color: 'bg-blue-50 dark:bg-blue-950/60',
      textColor: 'text-blue-600 dark:text-blue-300',
      borderColor: 'border-blue-100 dark:border-blue-900/60',
      icon: Video
    },
    {
      id: '2',
      day: 3,
      dateStr: 'Apr 03, 2025',
      title: 'Project Discussion',
      time: '11:00 AM',
      type: 'discussion',
      color: 'bg-emerald-50 dark:bg-emerald-950/60',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-100 dark:border-emerald-900/60',
      icon: Users
    },
    {
      id: '3',
      day: 5,
      dateStr: 'Apr 05, 2025',
      title: 'Holiday',
      time: 'Good Friday',
      type: 'holiday',
      color: 'bg-purple-50 dark:bg-purple-950/60',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-100 dark:border-purple-900/60',
      icon: Gift
    },
    {
      id: '4',
      day: 7,
      dateStr: 'Apr 07, 2025',
      title: 'Performance Review',
      time: '02:00 PM',
      type: 'review',
      color: 'bg-rose-50 dark:bg-rose-950/60',
      textColor: 'text-rose-600 dark:text-rose-300',
      borderColor: 'border-rose-100 dark:border-rose-900/60',
      icon: Target
    },
    {
      id: '5',
      day: 9,
      dateStr: 'Apr 09, 2025',
      title: 'Client Call',
      time: '11:30 AM',
      type: 'call',
      color: 'bg-sky-50 dark:bg-sky-950/60',
      textColor: 'text-sky-600 dark:text-sky-300',
      borderColor: 'border-sky-100 dark:border-sky-900/60',
      icon: Phone
    },
    {
      id: '6',
      day: 11,
      dateStr: 'Apr 11, 2025',
      title: 'Birthday',
      time: 'Rohit Sharma',
      type: 'birthday',
      color: 'bg-amber-50 dark:bg-amber-950/60',
      textColor: 'text-amber-700 dark:text-amber-300',
      borderColor: 'border-amber-100 dark:border-amber-900/60',
      icon: Cake
    },
    {
      id: '7',
      day: 14,
      dateStr: 'Apr 14, 2025',
      title: 'Leave',
      time: 'Full Day',
      type: 'leave',
      color: 'bg-emerald-50 dark:bg-emerald-950/60',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-100 dark:border-emerald-900/60',
      icon: Umbrella
    },
    {
      id: '8',
      day: 16,
      dateStr: 'Apr 16, 2025',
      title: 'HR Meeting',
      time: '03:00 PM',
      type: 'meeting',
      color: 'bg-purple-50 dark:bg-purple-950/60',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-100 dark:border-purple-900/60',
      icon: Clock
    },
    {
      id: '9',
      day: 21,
      dateStr: 'Apr 21, 2025',
      title: 'Training Session',
      time: '10:00 AM',
      type: 'training',
      color: 'bg-blue-50 dark:bg-blue-950/60',
      textColor: 'text-blue-600 dark:text-blue-300',
      borderColor: 'border-blue-100 dark:border-blue-900/60',
      icon: BookOpen
    },
    {
      id: '10',
      day: 24,
      dateStr: 'Apr 24, 2025',
      title: 'Project Review',
      time: '01:00 PM',
      type: 'discussion',
      color: 'bg-emerald-50 dark:bg-emerald-950/60',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-100 dark:border-emerald-900/60',
      icon: Target
    },
    {
      id: '11',
      day: 28,
      dateStr: 'Apr 28, 2025',
      title: 'Performance Review',
      time: '02:00 PM',
      type: 'review',
      color: 'bg-rose-50 dark:bg-rose-950/60',
      textColor: 'text-rose-600 dark:text-rose-300',
      borderColor: 'border-rose-100 dark:border-rose-900/60',
      icon: Target
    },
    {
      id: '12',
      day: 30,
      dateStr: 'Apr 30, 2025',
      title: 'Team Lunch',
      time: '12:30 PM',
      type: 'lunch',
      color: 'bg-purple-50 dark:bg-purple-950/60',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-100 dark:border-purple-900/60',
      icon: Coffee
    }
  ]);

  // Quick stat counts
  const totalEventsCount = events.length;
  const meetingsCount = events.filter((e) => e.type === 'meeting' || e.type === 'discussion').length;
  const holidaysCount = events.filter((e) => e.type === 'holiday').length;
  const birthdaysCount = events.filter((e) => e.type === 'birthday').length;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    let color = 'bg-blue-50 dark:bg-blue-950/60';
    let textColor = 'text-blue-600 dark:text-blue-300';
    let borderColor = 'border-blue-100 dark:border-blue-900/60';
    let icon = Video;

    if (newEvent.type === 'holiday') {
      color = 'bg-purple-50 dark:bg-purple-950/60';
      textColor = 'text-purple-700 dark:text-purple-300';
      borderColor = 'border-purple-100 dark:border-purple-900/60';
      icon = Gift;
    } else if (newEvent.type === 'birthday') {
      color = 'bg-amber-50 dark:bg-amber-950/60';
      textColor = 'text-amber-700 dark:text-amber-300';
      borderColor = 'border-amber-100 dark:border-amber-900/60';
      icon = Cake;
    } else if (newEvent.type === 'review') {
      color = 'bg-rose-50 dark:bg-rose-950/60';
      textColor = 'text-rose-600 dark:text-rose-300';
      borderColor = 'border-rose-100 dark:border-rose-900/60';
      icon = Target;
    } else if (newEvent.type === 'discussion' || newEvent.type === 'leave') {
      color = 'bg-emerald-50 dark:bg-emerald-950/60';
      textColor = 'text-emerald-700 dark:text-emerald-300';
      borderColor = 'border-emerald-100 dark:border-emerald-900/60';
      icon = Users;
    }

    const created: CalendarEvent = {
      id: Date.now().toString(),
      day: Number(newEvent.day),
      dateStr: `Apr ${String(newEvent.day).padStart(2, '0')}, 2025`,
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      color,
      textColor,
      borderColor,
      icon
    };

    setEvents([...events, created]);
    setIsAddModalOpen(false);
    showToast(`Event "${newEvent.title}" added to calendar!`);
    setNewEvent({ title: '', type: 'meeting', day: 15, time: '10:00 AM', notes: '' });
  };

  // Calendar grid construction for April 2025:
  // Starts on Tuesday (index 2). Preceding days: Sun 30, Mon 31 (March).
  // Days 1..30 (April).
  // Trailing days: Thu 1, Fri 2, Sat 3 (May).
  const daysArray: { dayNum: number; isCurrentMonth: boolean }[] = [
    { dayNum: 30, isCurrentMonth: false },
    { dayNum: 31, isCurrentMonth: false },
    ...Array.from({ length: 30 }, (_, i) => ({ dayNum: i + 1, isCurrentMonth: true })),
    { dayNum: 1, isCurrentMonth: false },
    { dayNum: 2, isCurrentMonth: false },
    { dayNum: 3, isCurrentMonth: false }
  ];

  // Upcoming events sidebar list
  const upcomingList = [
    {
      title: 'Team Meeting',
      time: 'Apr 11, 2025 • 10:00 AM',
      icon: CalendarIcon,
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Project Discussion',
      time: 'Apr 03, 2025 • 11:00 AM',
      icon: Users,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Performance Review',
      time: 'Apr 07, 2025 • 02:00 PM',
      icon: Clock,
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400'
    },
    {
      title: 'Client Call',
      time: 'Apr 09, 2025 • 11:30 AM',
      icon: Phone,
      bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
    },
    {
      title: 'Birthday - Rohit Sharma',
      time: 'Apr 11, 2025 • All Day',
      icon: Cake,
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
    }
  ];

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
          TOP PAGE HEADER WITH ICON, TITLE, SUBTITLE & ADD EVENT BUTTON
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Icon + Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/80 dark:border-blue-900/60 shadow-xs flex-shrink-0">
            <CalendarIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white">
              Calendar
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
              View your events, meetings, and <span className="underline decoration-blue-400 decoration-1 underline-offset-2">important</span> dates all in one place.
            </p>
          </div>
        </div>

        {/* Right Action Button: + Add Event */}
        <div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP 4 METRIC STAT CARDS WITH COMPACT HORIZONTAL ROW LAYOUT & GLASS EFFECT
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Events */}
        <div
          onClick={() => showToast('Viewing all 8 scheduled events this month')}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-blue-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-blue-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
        >
          {/* Glass Sheen Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Left: Icon + Number + Labels in One Row Beside */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100/60 dark:border-blue-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                8
              </span>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Total Events
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  This Month
                </div>
              </div>
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all duration-300 flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Meetings */}
        <div
          onClick={() => showToast('Viewing 5 upcoming meetings')}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-emerald-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
        >
          {/* Glass Sheen Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Left: Icon + Number + Labels in One Row Beside */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs border border-emerald-100/60 dark:border-emerald-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                5
              </span>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Meetings
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  This Month
                </div>
              </div>
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 transition-all duration-300 flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Holidays */}
        <div
          onClick={() => showToast('Viewing 2 public holidays this month')}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-purple-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-purple-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
        >
          {/* Glass Sheen Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Left: Icon + Number + Labels in One Row Beside */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-50/90 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs border border-purple-100/60 dark:border-purple-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Gift className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                2
              </span>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Holidays
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  This Month
                </div>
              </div>
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:text-purple-600 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/60 transition-all duration-300 flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Birthday */}
        <div
          onClick={() => showToast('Rohit Sharma birthday on Apr 11!')}
          className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800/80 bg-gradient-to-br from-white/95 via-white/90 to-amber-50/30 dark:from-[#0F172A]/95 dark:via-[#0F172A]/90 dark:to-amber-950/20 backdrop-blur-xl shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
        >
          {/* Glass Sheen Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Left: Icon + Number + Labels in One Row Beside */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50/90 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs border border-amber-100/60 dark:border-amber-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Cake className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                1
              </span>
              <div className="leading-tight">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Birthday
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                  This Month
                </div>
              </div>
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:text-amber-600 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/60 transition-all duration-300 flex-shrink-0">
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN SECTION: 2-COLUMN LAYOUT (MONTH CALENDAR ON LEFT, SIDEBAR ON RIGHT)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =====================================================================
            LEFT COLUMN: FULL INTERACTIVE MONTH VIEW GRID
           ===================================================================== */}
        <div className="lg:col-span-8 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden p-6 space-y-4">
          
          {/* Calendar Header with Navigation, Month Dropdown & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            
            {/* Left: Arrows + Month Year Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => showToast('Previous month')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast('Next month')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white text-base cursor-pointer">
                <span>{currentMonthName}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Right: View Pills [ Month | Week | Day ] */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
              <button
                onClick={() => setActiveView('month')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'month'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setActiveView('week')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'week'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setActiveView('day')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'day'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Days of the Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 dark:text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* 35 Calendar Cells Grid */}
          <div className="grid grid-cols-7 border-t border-l border-slate-100 dark:border-slate-800/80">
            {daysArray.map((cell, idx) => {
              const dayEvents = cell.isCurrentMonth
                ? events.filter((e) => e.day === cell.dayNum)
                : [];

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.isCurrentMonth) {
                      setSelectedMiniDate(cell.dayNum);
                      if (dayEvents.length > 0) {
                        showToast(`Selected Apr ${cell.dayNum}: ${dayEvents[0].title}`);
                      }
                    }
                  }}
                  className={`min-h-[96px] p-2 border-r border-b border-slate-100 dark:border-slate-800/80 transition-colors flex flex-col justify-between cursor-pointer ${
                    cell.isCurrentMonth
                      ? 'bg-white dark:bg-[#0F172A] hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                      : 'bg-slate-50/40 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {/* Day Number */}
                  <span
                    className={`text-xs font-semibold ${
                      cell.isCurrentMonth
                        ? cell.dayNum === selectedMiniDate
                          ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold'
                          : 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Render Event Chips inside the Cell */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((evt) => {
                      const IconComp = evt.icon;
                      return (
                        <div
                          key={evt.id}
                          className={`p-1.5 rounded-xl border text-[10px] leading-tight transition-transform hover:scale-[1.02] shadow-xs ${evt.color} ${evt.textColor} ${evt.borderColor}`}
                        >
                          <div className="flex items-center gap-1 font-bold truncate">
                            <IconComp className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{evt.title}</span>
                          </div>
                          <div className="text-[9px] opacity-85 mt-0.5 truncate">
                            {evt.time}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* =====================================================================
            RIGHT COLUMN: MINI CALENDAR, UPCOMING EVENTS, STAY ORGANIZED CARD
           ===================================================================== */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Mini Date Picker Calendar */}
          <div className="bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-300 space-y-4">
            
            {/* Header: April 2025 with Left/Right arrows */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentMonthName}
              </h3>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => showToast('Previous mini month')}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast('Next mini month')}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mini Weekday Labels */}
            <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 dark:text-slate-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Mini Date Grid */}
            <div className="grid grid-cols-7 text-center text-xs gap-y-1.5">
              {daysArray.map((cell, i) => {
                const isSelected = cell.isCurrentMonth && cell.dayNum === selectedMiniDate;
                const hasEvent = cell.isCurrentMonth && events.some((e) => e.day === cell.dayNum);
                const eventColor = cell.isCurrentMonth
                  ? events.find((e) => e.day === cell.dayNum)?.type
                  : null;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (cell.isCurrentMonth) {
                        setSelectedMiniDate(cell.dayNum);
                      }
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer py-0.5"
                  >
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : cell.isCurrentMonth
                          ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Small colored dot under days with events */}
                    <div className="h-1 flex items-center justify-center mt-0.5">
                      {hasEvent && !isSelected && (
                        <span
                          className={`w-1 h-1 rounded-full ${
                            eventColor === 'birthday'
                              ? 'bg-amber-500'
                              : eventColor === 'holiday'
                              ? 'bg-purple-500'
                              : eventColor === 'review'
                              ? 'bg-rose-500'
                              : eventColor === 'discussion'
                              ? 'bg-emerald-500'
                              : 'bg-blue-600'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Card 2: Upcoming Events List */}
          <div className="bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-slate-200/80 dark:hover:border-slate-700 transition-all duration-300 space-y-3.5">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Events
              </h3>
              <button
                onClick={() => showToast('Displaying all upcoming events')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Card 3: Stay Organized Tip / Feature Card */}
          <div className="bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-indigo-50/90 dark:from-blue-950/50 dark:via-sky-950/30 dark:to-indigo-950/40 backdrop-blur-xl rounded-3xl p-4.5 border border-blue-100/90 dark:border-blue-900/50 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Stay Organized
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Never miss an important event or meeting again.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>

        </div>

      </div>

      {/* =========================================================================
          ADD EVENT MODAL
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                Add New Event
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sprint Planning / Birthday Party"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="meeting">Team Meeting</option>
                    <option value="discussion">Project Discussion</option>
                    <option value="holiday">Holiday</option>
                    <option value="birthday">Birthday</option>
                    <option value="review">Performance Review</option>
                    <option value="call">Client Call</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Day in April (1 - 30)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newEvent.day}
                    onChange={(e) => setNewEvent({ ...newEvent, day: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM or All Day"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Agenda
                </label>
                <textarea
                  rows={2}
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Meeting agenda or event description..."
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
                  Save Event
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;
