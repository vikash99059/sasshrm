import React from 'react';
import { cn } from '../../utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  subtitle,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:border-slate-300 hover:shadow-soft dark:border-dark-border dark:bg-dark-card',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105', iconBgColor)}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h4>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
