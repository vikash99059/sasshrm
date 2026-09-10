import React, { useState } from 'react';
import {
  Megaphone,
  Bell,
  Calendar,
  Clock,
  ChevronDown,
  ArrowRight,
  FileText,
  Users,
  PartyPopper,
  Info,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  category: 'Announcement' | 'News' | 'Policy' | 'Event';
  title: string;
  description: string;
  fullContent?: string;
  date: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  dotColor: string;
}

export const AnnouncementsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Announcements' | 'News' | 'Policies' | 'Events'>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // List of announcements matching the reference design
  const items: AnnouncementItem[] = [
    {
      id: '1',
      category: 'Announcement',
      title: 'Office Holiday on 15th April 2025',
      description:
        'Please note that the office will remain closed on 15th April 2025 on account of Good Friday. Regular operations will resume on...',
      fullContent:
        'Please note that all company offices will remain closed on Tuesday, 15th April 2025 on account of Good Friday. Regular business operations and office access will resume on Wednesday, 16th April 2025 at 09:00 AM. Emergency support desks will remain on call for critical customer issues.',
      date: 'Apr 12, 2025',
      time: '10:30 AM',
      icon: Megaphone,
      iconBg: 'bg-blue-50 dark:bg-blue-950/70',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
      badgeColor: 'text-blue-600 dark:text-blue-300',
      dotColor: 'bg-blue-600'
    },
    {
      id: '2',
      category: 'News',
      title: 'Welcome to Our New Team Members!',
      description:
        'We are excited to welcome 5 new team members who joined our organization this month. Let\'s give them a warm welcome!',
      fullContent:
        'We are excited to announce and welcome 5 brilliant new team members who joined our engineering, product, and human resources teams this month: Arjun Kapoor (Senior Frontend), Maya Lin (UX Designer), Vikram Patel (DevOps Lead), Sneha Rao (HR Specialist), and Daniel Craig (Customer Success). Please join us in giving them a warm welcome!',
      date: 'Apr 10, 2025',
      time: '02:15 PM',
      icon: PartyPopper,
      iconBg: 'bg-purple-50 dark:bg-purple-950/70',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
      badgeColor: 'text-purple-600 dark:text-purple-300',
      dotColor: 'bg-purple-600'
    },
    {
      id: '3',
      category: 'Policy',
      title: 'Updated Work From Home Policy',
      description:
        'We have updated our Work From Home policy to provide more flexibility and better work-life balance for our employees...',
      fullContent:
        'Effective May 1st, 2025, our flexible work policy has been enhanced. Full-time employees can now request up to 2 remote days per week with manager coordination. The monthly home office internet reimbursement subsidy has also been increased by 20%. Please review the complete guidelines in the Documents tab.',
      date: 'Apr 08, 2025',
      time: '11:45 AM',
      icon: FileText,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeColor: 'text-emerald-600 dark:text-emerald-300',
      dotColor: 'bg-emerald-500'
    },
    {
      id: '4',
      category: 'Event',
      title: 'Team Building Activity - Save the Date',
      description:
        'Our annual team building event is scheduled for 25th April 2025 at Green Valley Resort. More details will be shared soon.',
      fullContent:
        'Get ready for a day of fun, sports, problem-solving challenges, and barbecue! Our annual spring team building getaway is confirmed for Friday, 25th April 2025 at Green Valley Resort. Transportation from the main campus will be provided. Please RSVP via the calendar invite by April 18th.',
      date: 'Apr 05, 2025',
      time: '04:20 PM',
      icon: Calendar,
      iconBg: 'bg-amber-50 dark:bg-amber-950/70',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeColor: 'text-amber-700 dark:text-amber-300',
      dotColor: 'bg-amber-500'
    },
    {
      id: '5',
      category: 'Announcement',
      title: 'System Maintenance Scheduled',
      description:
        'The HRM system will undergo maintenance on 12th April 2025 from 2:00 AM to 4:00 AM. During this time, you may experience...',
      fullContent:
        'Our IT infrastructure team will be performing planned server optimization and database upgrades on Saturday, 12th April 2025 between 02:00 AM and 04:00 AM IST. All HR services, payroll downloads, and portal logins will be temporarily paused during this 2-hour window.',
      date: 'Apr 02, 2025',
      time: '09:15 AM',
      icon: Info,
      iconBg: 'bg-sky-50 dark:bg-sky-950/70',
      iconColor: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
      badgeColor: 'text-blue-600 dark:text-blue-300',
      dotColor: 'bg-blue-500'
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Announcements') return item.category === 'Announcement';
    if (activeFilter === 'News') return item.category === 'News';
    if (activeFilter === 'Policies') return item.category === 'Policy';
    if (activeFilter === 'Events') return item.category === 'Event';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP PAGE HEADER WITH ICON, TITLE & DECORATIVE HORN GRAPHIC
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-blue-50/60 dark:from-[#0F172A] dark:via-blue-950/20 dark:to-[#0F172A] p-6 sm:p-7 border border-blue-100/70 dark:border-slate-800/80">
        
        {/* Left Side: Megaphone Icon + Title + Subtitle */}
        <div className="flex items-center gap-4 relative z-10 max-w-2xl">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/90 dark:border-blue-900/60 shadow-xs flex-shrink-0">
            <Megaphone className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] dark:text-white">
              Company Announcements & News
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stay updated with the latest company news, announcements, policies and important updates.
            </p>
          </div>
        </div>

        {/* Right Side: Decorative Megaphone Graphic */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-90">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-blue-200/40 dark:bg-blue-800/20 blur-xl" />
            <svg viewBox="0 0 100 100" className="w-28 h-28 relative z-10">
              {/* Sound wave arcs */}
              <path
                d="M 68,22 C 75,30 75,50 68,58"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 76,14 C 88,26 88,54 76,66"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 84,6 C 100,22 100,58 84,74"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Megaphone Cone Body */}
              <path
                d="M 24,35 L 56,22 L 56,58 L 24,45 Z"
                fill="#2563EB"
              />
              {/* Megaphone Back Speaker Cylinder */}
              <rect x="14" y="34" width="10" height="12" rx="3" fill="#1D4ED8" />
              {/* Megaphone Front Bell Rim */}
              <ellipse cx="56" cy="40" rx="4" ry="18" fill="#38BDF8" />
              {/* Megaphone Handle */}
              <path
                d="M 28,45 L 34,64 L 40,62 L 34,44 Z"
                fill="#1E40AF"
              />
            </svg>
          </div>
        </div>

      </div>

      {/* =========================================================================
          CATEGORY FILTER PILLS & TIME RANGE SELECTOR
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Announcements', 'News', 'Policies', 'Events'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Time Range Dropdown */}
        <div className="relative self-end sm:self-auto">
          <button
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedTimeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isTimeDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-20 animate-fade-in text-xs">
              {['All Time', 'This Month', 'This Quarter', 'This Year'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTimeRange(t);
                    setIsTimeDropdownOpen(false);
                    showToast(`Filtered by ${t}`);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    selectedTimeRange === t
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          MAIN SECTION: 2-COLUMN LAYOUT (ANNOUNCEMENTS LIST + SIDEBAR)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =====================================================================
            LEFT COLUMN: ANNOUNCEMENT CARDS LIST (8 COLS)
           ===================================================================== */}
        <div className="lg:col-span-8 space-y-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAnnouncement(item)}
                className="bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-start gap-4"
              >
                {/* Left Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Right Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Category Pill */}
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.badgeBg} ${item.badgeColor}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Meta Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </span>
                    </div>

                    {/* Read More Link */}
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-10 text-center border border-slate-100 dark:border-slate-800">
              <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No announcements found
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                There are no posts in the "{activeFilter}" category.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================================
            RIGHT COLUMN: RECENT ANNOUNCEMENTS & STAY CONNECTED PROMO CARD (4 COLS)
           ===================================================================== */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Recent Announcements List */}
          <div className="bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 fill-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Announcements
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveFilter('All');
                  showToast('Showing all announcements');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List with timeline connector dots */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  {/* Colored indicator dot */}
                  <div className="pt-1 flex-shrink-0">
                    <span className={`block w-2.5 h-2.5 rounded-full ${item.dotColor} ring-4 ring-slate-50 dark:ring-slate-800 group-hover:scale-125 transition-transform`} />
                  </div>

                  {/* Title & Date */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Card 2: Stay Connected Promo Card with Character Illustration */}
          <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-indigo-50/80 dark:from-blue-950/40 dark:via-sky-950/20 dark:to-indigo-950/30 rounded-3xl p-6 border border-blue-100/90 dark:border-blue-900/50 shadow-xs relative overflow-hidden space-y-3">
            
            {/* Document icon badge with horn */}
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-100 dark:border-slate-700">
              <div className="relative">
                <FileText className="w-6 h-6" />
                <Megaphone className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-blue-600 bg-white dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 pr-16">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Stay Connected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Be the first to know about important updates, events and company news.
              </p>
            </div>

            {/* Illustration on bottom-right corner */}
            <div className="absolute right-3 bottom-0 w-28 h-32 pointer-events-none">
              <svg viewBox="0 0 120 140" className="w-full h-full">
                {/* Person Torso & Jacket */}
                <path
                  d="M 35,140 L 40,85 L 80,85 L 85,140 Z"
                  fill="#2563EB"
                />
                {/* Shirt / Tie */}
                <path
                  d="M 54,85 L 60,95 L 66,85 Z"
                  fill="#FFFFFF"
                />
                {/* Person Head */}
                <circle cx="60" cy="65" r="14" fill="#FBCFE8" />
                {/* Hair */}
                <path
                  d="M 46,62 C 46,48 74,48 74,62 C 68,54 52,54 46,62 Z"
                  fill="#1E293B"
                />
                {/* Arm holding megaphone */}
                <path
                  d="M 45,95 L 28,75 L 34,70 L 52,88 Z"
                  fill="#1D4ED8"
                />
                {/* Megaphone in Hand */}
                <path
                  d="M 12,50 L 32,65 L 32,75 L 12,65 Z"
                  fill="#38BDF8"
                />
                <ellipse cx="12" cy="58" rx="2" ry="8" fill="#2563EB" />
                {/* Sound waves from horn */}
                <path
                  d="M 6,50 C 2,54 2,62 6,66"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          READ MORE DETAIL MODAL
         ========================================================================= */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedAnnouncement.badgeBg} ${selectedAnnouncement.badgeColor}`}>
                  {selectedAnnouncement.category}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedAnnouncement.date} • {selectedAnnouncement.time}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedAnnouncement.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedAnnouncement.fullContent || selectedAnnouncement.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  showToast('Announcement marked as acknowledged!');
                  setSelectedAnnouncement(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AnnouncementsPage;
