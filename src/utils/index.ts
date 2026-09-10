import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | undefined | null, formatStr: string = 'MMM dd, yyyy'): string {
  if (!dateString) return '--';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return dateString;
    return format(date, formatStr);
  } catch {
    return dateString;
  }
}

export function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return '--:--';
  return timeStr;
}

export function getStatusBadgeClasses(status: string): string {
  const s = status.toLowerCase();
  switch (s) {
    case 'present':
    case 'active':
    case 'approved':
    case 'paid':
    case 'completed':
    case 'success':
    case 'verified':
    case 'joined':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    case 'late':
    case 'pending':
    case 'in progress':
    case 'probation':
    case 'trial':
    case 'warning':
    case 'screening':
    case 'interview':
    case 'shortlisted':
    case 'draft':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    case 'absent':
    case 'rejected':
    case 'cancelled':
    case 'terminated':
    case 'failed':
    case 'at risk':
    case 'suspended':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
    case 'on leave':
    case 'half day':
    case 'work from home':
    case 'reimbursed':
    case 'selected':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export function getInitials(name: string): string {
  if (!name) return 'HR';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}
