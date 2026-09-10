import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { getNavigationForRole } from '../../config/navigation';
import { cn } from '../../utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  LogOut,
  Building,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    currentOrg,
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    setMobileMenuOpen,
    logout,
  } = useAppStore();

  const location = useLocation();
  const navSections = getNavigationForRole(currentRole);

  const [openDropdowns, setOpenDropdowns] = React.useState<{ [key: string]: boolean }>({
    '/chat': true,
  });

  const toggleDropdown = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenDropdowns((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white text-slate-700 transition-all duration-300 ease-in-out border-r border-slate-200/80 dark:bg-[#0F172A] dark:text-slate-300 dark:border-slate-800/80 select-none shadow-xs',
          sidebarCollapsed ? 'w-20' : 'w-64',
          // Mobile responsive class
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/60">
          <Link to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/25 text-white font-black text-lg group-hover:scale-105 transition-transform">
              <span className="text-white">◆</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  HRM
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
                  {currentRole === 'saas_owner' ? 'Global Platform' : currentOrg?.name || 'Enterprise'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {section.sectionTitle && !sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 pt-1">
                  {section.sectionTitle}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExact = location.pathname === item.href;
                const isSubPath = item.href !== '/' &&
                  item.href !== '/dashboard' &&
                  item.href !== '/saas' &&
                  item.href !== '/employees' &&
                  item.href !== '/leave' &&
                  item.href !== '/payroll' &&
                  item.href !== '/recruitment' &&
                  item.href !== '/performance' &&
                  item.href !== '/operations' &&
                  item.href !== '/reports' &&
                  item.href !== '/settings' &&
                  item.href !== '/calendar' &&
                  location.pathname.startsWith(item.href + '/');
                const isEmployeeProfile = item.href === '/profile' && (location.pathname === '/profile' || location.pathname === '/my-profile');
                const isActive = isExact || isSubPath || isEmployeeProfile || (hasChildren && location.pathname.startsWith(item.href));
                const isDropdownOpen = !!openDropdowns[item.href] || location.pathname.startsWith(item.href);

                return (
                  <div key={item.href + item.title} className="space-y-0.5">
                    <div className="flex items-center">
                      <Link
                        to={item.href}
                        onClick={() => {
                          if (hasChildren) {
                            setOpenDropdowns((prev) => ({ ...prev, [item.href]: true }));
                          }
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'group flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative overflow-hidden',
                          isActive
                            ? 'bg-blue-50/90 text-blue-600 shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
                          sidebarCollapsed && 'justify-center px-0 hover:translate-x-0'
                        )}
                        title={sidebarCollapsed ? item.title : undefined}
                      >
                        {/* Active Menu Indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400 transition-all duration-200" />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-200'
                          )}
                        />
                        {!sidebarCollapsed && (
                          <span className="truncate flex-1">{item.title}</span>
                        )}
                        {!sidebarCollapsed && item.badge && (
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[9px] font-bold group-hover:scale-105 transition-transform mr-1',
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {/* Dropdown Toggle Chevron */}
                      {hasChildren && !sidebarCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(item.href, e)}
                          title="Toggle sub-menu"
                          className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <ChevronDown
                            className={cn(
                              'h-3.5 w-3.5 transition-transform duration-200',
                              isDropdownOpen ? 'rotate-0 text-blue-600 dark:text-blue-400' : '-rotate-90'
                            )}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dropdown Children Sub-items */}
                    {hasChildren && isDropdownOpen && !sidebarCollapsed && (
                      <div className="ml-6 pl-2.5 my-1 border-l-2 border-blue-100 dark:border-slate-800 space-y-1 animate-fadeIn">
                        {item.children!.map((child) => {
                          const isChildActive =
                            location.pathname + location.search === child.href ||
                            (!location.search && child.href === '/chat?tab=chat' && location.pathname === '/chat');

                          return (
                            <Link
                              key={child.href + child.title}
                              to={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                                isChildActive
                                  ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/90 dark:bg-blue-950/50 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                              )}
                            >
                              <span className="truncate flex items-center gap-1.5">
                                <span className={cn('w-1.5 h-1.5 rounded-full', isChildActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-700')} />
                                {child.title}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Promo Card */}
        {!sidebarCollapsed && (
          <div className="mx-3 my-2 rounded-2xl bg-blue-50/70 p-3 border border-blue-100/80 dark:bg-blue-950/30 dark:border-blue-900/40 hover-shine-sweep transition-all hover:shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white text-xs shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Career Growth</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
              Explore your learning roadmaps, skills, and internal achievements.
            </p>
            <Link
              to="/operations/training"
              className="block text-center w-full rounded-xl bg-blue-600 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 shadow-xs transition-all hover-magnetic-btn"
            >
              Explore Training
            </Link>
          </div>
        )}

        {/* Bottom Collapse Sidebar Button */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3">
          <button
            onClick={toggleSidebar}
            className={cn(
              'w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white transition-colors cursor-pointer',
              sidebarCollapsed ? 'justify-center px-0' : ''
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
