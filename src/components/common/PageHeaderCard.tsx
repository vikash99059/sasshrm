import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils';

export interface PageHeaderCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
  className?: string;
}

export const PageHeaderCard: React.FC<PageHeaderCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  breadcrumb,
  children,
  className,
}) => {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-[#E2EFFF] to-[#D5E8FE] p-4 sm:p-5 shadow-xs dark:border-slate-800/90 dark:bg-gradient-to-r dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0F172A] select-none transition-all duration-300',
        className
      )}
    >
      {/* =====================================================================
          FLOWING WAVY & CLOUDY AMBIENT BACKGROUND (EXACT MATCH FOR DESIGN)
         ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Light Mode Soft Cloud Glows */}
        <div className="dark:hidden absolute -right-10 -top-14 h-72 w-72 rounded-full bg-gradient-to-br from-blue-300/40 via-sky-200/35 to-white/70 blur-3xl" />
        <div className="dark:hidden absolute right-1/4 top-1/2 -translate-y-1/2 h-56 w-64 rounded-full bg-gradient-to-tr from-sky-200/35 via-blue-100/45 to-white/60 blur-2xl" />
        <div className="dark:hidden absolute left-1/3 -bottom-8 h-44 w-80 rounded-full bg-blue-100/45 blur-2xl" />

        {/* Dark Mode Luminous Midnight Glows */}
        <div className="hidden dark:block absolute -right-10 -top-14 h-72 w-72 rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
        <div className="hidden dark:block absolute right-1/4 top-1/2 -translate-y-1/2 h-56 w-64 rounded-full bg-gradient-to-tr from-sky-500/10 via-blue-600/10 to-transparent blur-2xl" />
        <div className="hidden dark:block absolute left-1/3 -bottom-8 h-44 w-80 rounded-full bg-blue-900/20 blur-2xl" />

        {/* Light Mode Multi-Layered SVG Fluid Waves */}
        <svg
          className="absolute inset-0 h-full w-full object-cover dark:hidden"
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pageWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#BFDBFE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="pageWave2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          <path
            d="M0,60 C240,115 480,20 740,65 C940,105 1100,40 1200,60 L1200,240 L0,240 Z"
            fill="url(#pageWave1)"
          />
          <path
            d="M0,120 C190,70 430,135 690,80 C930,35 1090,100 1200,65 L1200,240 L0,240 Z"
            fill="url(#pageWave2)"
          />
        </svg>

        {/* Dark Mode Luminous Midnight SVG Waves */}
        <svg
          className="absolute inset-0 h-full w-full object-cover hidden dark:block opacity-60"
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pageWaveDark1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="pageWaveDark2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#172554" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <path
            d="M0,60 C240,115 480,20 740,65 C940,105 1100,40 1200,60 L1200,240 L0,240 Z"
            fill="url(#pageWaveDark1)"
          />
          <path
            d="M0,120 C190,70 430,135 690,80 C930,35 1090,100 1200,65 L1200,240 L0,240 Z"
            fill="url(#pageWaveDark2)"
          />
        </svg>
      </div>

      {/* =====================================================================
          MAIN HEADER CARD CONTENT (Z-10)
         ===================================================================== */}
      <div className="relative z-10">
        {/* Optional Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-400 dark:text-slate-600">&gt;</span>}
                <span className={idx === breadcrumb.length - 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Title & Icon Section */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
            {Icon && (
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/80 dark:border-slate-700/80 flex-shrink-0 flex items-center justify-center backdrop-blur-md">
                {renderIcon()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  {title}
                </h1>
                {badge && (
                  <div className="flex-shrink-0">
                    {typeof badge === 'string' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100/90 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                        {badge}
                      </span>
                    ) : (
                      badge
                    )}
                  </div>
                )}
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Action Controls Slot */}
          {actions && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Optional Secondary Slot (Search, Tabs, Filter chips) */}
        {children && <div className="mt-4 pt-3 border-t border-blue-200/50 dark:border-slate-800/80">{children}</div>}
      </div>
    </div>
  );
};
