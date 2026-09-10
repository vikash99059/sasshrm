import React from 'react';
import { cn } from '../../utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl dark:bg-slate-800/80', className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer',
                isActive
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-dark-card dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('border-b border-slate-200 dark:border-dark-border', className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-all duration-150 cursor-pointer',
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
