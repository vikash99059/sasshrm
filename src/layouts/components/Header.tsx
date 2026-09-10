import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Building,
  Shield,
  MessageSquare,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Check,
  Globe,
} from 'lucide-react';
import { cn } from '../../utils';
import { ROLE_PERSONAS } from '../../config/roleDashboardConfig';

export const Header: React.FC = () => {
  const {
    currentRole,
    currentUser,
    currentOrg,
    allOrgs,
    switchRole,
    switchOrg,
    isDarkMode,
    toggleDarkMode,
    setMobileMenuOpen,
    setCommandPaletteOpen,
    setNotificationsOpen,
    notifications,
    sidebarCollapsed,
    isClockedIn,
    secondsElapsed,
    logout,
  } = useAppStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'en', name: 'English', flag: '🇺🇸' });

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = 3; // matching reference badge

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: { role: UserRole; title: string; desc: string; badgeColor: string }[] = [
    { role: 'saas_owner', title: 'SaaS Platform Owner', desc: 'Manage tenants, MRR, subscriptions', badgeColor: 'bg-purple-100 text-purple-700' },
    { role: 'org_owner', title: 'Organization Owner (CEO)', desc: 'Executive overview & company settings', badgeColor: 'bg-blue-100 text-blue-700' },
    { role: 'org_admin', title: 'Organization Admin', desc: 'Full tenant admin capabilities', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { role: 'hr_admin', title: 'HR Admin', desc: 'Complete HR suite & employee records', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { role: 'hr_executive', title: 'HR Executive', desc: 'Daily attendance, leaves & onboarding', badgeColor: 'bg-teal-100 text-teal-700' },
    { role: 'recruiter', title: 'Talent Recruiter', desc: 'ATS pipeline & interview scheduling', badgeColor: 'bg-cyan-100 text-cyan-700' },
    { role: 'payroll_admin', title: 'Payroll Admin', desc: 'Salary batches & tax compliance', badgeColor: 'bg-amber-100 text-amber-700' },
    { role: 'manager', title: 'Engineering Manager', desc: 'Team approvals & performance reviews', badgeColor: 'bg-orange-100 text-orange-700' },
    { role: 'employee', title: 'Employee Self-Service', desc: 'Clock-in, leaves, payslips & assets', badgeColor: 'bg-slate-100 text-slate-700' },
  ];

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPersona = ROLE_PERSONAS[currentRole] || ROLE_PERSONAS.employee;

  const handleRoleChange = async (newRole: UserRole) => {
    await switchRole(newRole);
    setRoleDropdownOpen(false);
    setUserMenuOpen(false);
    const targetRoute = ROLE_PERSONAS[newRole]?.defaultRoute || '/dashboard';
    navigate(targetRoute);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-dark-bg/95',
        sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
      )}
    >
      {/* Left Section: Mobile Menu Button & Global Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Input Field matching reference image */}
        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="group relative flex items-center w-64 sm:w-80 lg:w-96 cursor-pointer"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search anything... (employees, documents, etc.)"
            className="w-full rounded-full border border-slate-200/90 bg-slate-50/70 py-1.5 pl-10 pr-16 text-xs text-slate-700 placeholder-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer dark:border-slate-800 dark:bg-dark-card dark:text-slate-200 dark:placeholder-slate-500 dark:hover:bg-slate-800/80"
          />
          <div className="absolute right-3 flex items-center">
            <kbd className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Live Clock-In Duration Tracker */}
        {isClockedIn && (
          <div
            onClick={() => navigate('/clock-in')}
            className="hidden 2xl:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 cursor-pointer hover:bg-emerald-100 transition-all dark:bg-emerald-950/40 dark:border-emerald-800"
            title="Click to view attendance screen"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Working: {formatTimer(secondsElapsed)}
            </span>
          </div>
        )}
      </div>

      {/* Right Section: Org Selector + Language + Theme + Notifications + Messages + Help + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Organization Switcher */}
        {currentRole !== 'saas_owner' && (
          <div className="relative hidden md:block" ref={orgDropdownRef}>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-dark-card dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Building className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="truncate max-w-[120px] font-semibold">{currentOrg?.name || 'Acme Corporation'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {orgDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-slide-down dark:border-dark-border dark:bg-dark-card z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-dark-border mb-1">
                  Organizations
                </div>
                {allOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrg(org.id);
                      setOrgDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors',
                      currentOrg?.id === org.id
                        ? 'bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <span>{org.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium">{org.plan}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Language Selector */}
        <div className="relative hidden sm:block" ref={langDropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-dark-card dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span className="text-xs font-medium">{currentLang.name}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-slide-down dark:border-dark-border dark:bg-dark-card z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang);
                    setLangDropdownOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors',
                    currentLang.code === lang.code
                      ? 'bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all hover-magnetic-btn dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all hover-magnetic-btn dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
            {unreadNotificationsCount}
          </span>
        </button>

        {/* Messages with Badge 2 */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative hidden sm:flex rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all hover-magnetic-btn dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="Messages"
        >
          <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
            2
          </span>
        </button>

        {/* Help */}
        <button
          onClick={() => alert('HRM SaaS Help & Documentation Center')}
          className="hidden sm:flex rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all hover-magnetic-btn dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="Help & Support"
        >
          <HelpCircle className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </button>

        {/* User Profile / Menu */}
        <div className="relative pl-1" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 rounded-full pl-1 pr-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
          >
            <img
              src={currentPersona.avatar}
              alt={currentPersona.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20 hover-avatar-ring"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{currentPersona.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight flex items-center gap-0.5">
                {currentPersona.title} <ChevronDown className="h-2.5 w-2.5 inline" />
              </span>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-slide-down dark:border-dark-border dark:bg-dark-card z-50">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-dark-border mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentPersona.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentPersona.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {currentPersona.title}
                  </span>
                </div>
              </div>

              {/* Role Switcher in Menu */}
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Role Persona
              </div>
              <div className="max-h-48 overflow-y-auto space-y-0.5 mb-2">
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleRoleChange(item.role)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                      currentRole === item.role
                        ? 'bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <span>{item.title}</span>
                    {currentRole === item.role && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                ))}
              </div>

              <div className="my-1 border-t border-slate-100 dark:border-dark-border" />

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/my-profile');
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-dark-border" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

