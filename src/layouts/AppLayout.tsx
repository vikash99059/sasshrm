import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, isClockedIn, tickClockTimer } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    let interval: any = null;
    if (isClockedIn) {
      interval = setInterval(() => {
        tickClockTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, tickClockTimer]);

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Top Header */}
        <Header />

        {/* Page View Outlet with smooth subtle page transition */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1800px] w-full mx-auto">
          <div key={location.pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur-md px-6 py-4 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-dark-bg/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1800px] mx-auto">
            {/* Left: Brand + Slogan */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm text-white font-black text-sm">
                <span>◆</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">HRM</span>
              <span className="text-slate-400 text-xs hidden sm:inline">|</span>
              <span className="text-slate-400 text-xs font-medium">Better People. Stronger Teams.</span>
            </div>

            {/* Right: Copyright */}
            <div className="text-xs text-slate-400">
              <span>© {new Date().getFullYear()} HRM. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Command Palette & Notifications Drawer */}
      <CommandPalette />
      <NotificationsDrawer />
    </div>
  );
};

