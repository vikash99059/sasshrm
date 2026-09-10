import React from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'group inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 hover:-translate-y-0.5 focus:ring-blue-500 border border-transparent',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 hover:-translate-y-0.5 focus:ring-slate-500 border border-transparent',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:-translate-y-0.5 focus:ring-blue-500',
      ghost: 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100 focus:ring-slate-500',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md hover:shadow-rose-500/30 hover:-translate-y-0.5 focus:ring-rose-500 border border-transparent',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus:ring-emerald-500 border border-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
      icon: 'p-2 text-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          leftIcon && <span className="transition-transform duration-200 group-hover:scale-110 flex items-center">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="transition-transform duration-200 group-hover:translate-x-1 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
