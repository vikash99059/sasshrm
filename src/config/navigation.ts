import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  CreditCard,
  Briefcase,
  Target,
  FileSpreadsheet,
  Package,
  FileText,
  GraduationCap,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
  DollarSign,
  UserCheck,
  Compass,
  Layers,
  Sparkles,
  Award,
  Receipt,
  HelpCircle,
  MessageSquare,
  Mail,
  ListTodo,
  User,
  FileQuestion,
  Megaphone,
} from 'lucide-react';
import { UserRole } from '../types';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  children?: { title: string; href: string }[];
}

export interface NavSection {
  sectionTitle?: string;
  items: NavItem[];
}

export function getNavigationForRole(role: UserRole): NavSection[] {
  switch (role) {
    case 'saas_owner':
      return [
        {
          sectionTitle: 'PLATFORM MANAGEMENT',
          items: [
            { title: 'Super Admin Overview', href: '/saas', icon: LayoutDashboard },
            { title: 'Organizations', href: '/saas/organizations', icon: Building2, badge: 'Active' },
            { title: 'Subscriptions', href: '/saas/subscriptions', icon: CreditCard },
            { title: 'Plans & Pricing', href: '/saas/plans', icon: Layers },
            { title: 'Billing & Invoices', href: '/saas/billing', icon: DollarSign },
            { title: 'Revenue Analytics', href: '/saas/revenue', icon: BarChart3 },
            { title: 'System Analytics', href: '/saas/analytics', icon: Compass },
            { title: 'Audit Logs', href: '/saas/audit-logs', icon: ShieldCheck },
            { title: 'System Settings', href: '/saas/settings', icon: Settings },
          ]
        }
      ];

    case 'manager':
      return [
        {
          sectionTitle: 'MANAGEMENT',
          items: [
            { title: 'Team Dashboard', href: '/dashboard', icon: LayoutDashboard },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              badge: '3',
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            {
              title: 'Email',
              href: '/email',
              icon: Mail,
              badge: '4',
              children: [
                { title: 'Inbox', href: '/email?folder=inbox' },
                { title: 'Sent Items', href: '/email?folder=sent' },
                { title: 'Drafts', href: '/email?folder=drafts' },
                { title: 'Archive', href: '/email?folder=archive' },
                { title: 'Deleted Items', href: '/email?folder=trash' },
              ]
            },
            { title: 'Team Members', href: '/employees', icon: Users, badge: '14' },
            { title: 'Team Attendance', href: '/attendance', icon: Clock },
            { title: 'Clock In / Out', href: '/clock-in', icon: UserCheck },
            { title: 'Leave Approvals', href: '/leave/requests', icon: CalendarDays, badge: '3' },
            { title: 'Team Performance', href: '/performance/goals', icon: Target },
            { title: 'Expense Approvals', href: '/operations/expenses', icon: Receipt },
            { title: 'Company Calendar', href: '/calendar', icon: Calendar },
            { title: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    case 'recruiter':
      return [
        {
          sectionTitle: 'TALENT ACQUISITION',
          items: [
            { title: 'ATS Dashboard', href: '/dashboard', icon: LayoutDashboard },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            {
              title: 'Email',
              href: '/email',
              icon: Mail,
              children: [
                { title: 'Inbox', href: '/email?folder=inbox' },
                { title: 'Sent Items', href: '/email?folder=sent' },
                { title: 'Drafts', href: '/email?folder=drafts' },
                { title: 'Archive', href: '/email?folder=archive' },
                { title: 'Deleted Items', href: '/email?folder=trash' },
              ]
            },
            { title: 'Job Openings', href: '/recruitment/jobs', icon: Briefcase, badge: '4' },
            { title: 'Candidates Kanban', href: '/recruitment/candidates', icon: Users },
            { title: 'Interviews Schedule', href: '/recruitment/interviews', icon: Calendar },
            { title: 'Talent Reports', href: '/reports', icon: BarChart3 },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock },
          ]
        }
      ];

    case 'payroll_admin':
      return [
        {
          sectionTitle: 'FINANCE & PAYROLL',
          items: [
            { title: 'Payroll Dashboard', href: '/dashboard', icon: LayoutDashboard },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            {
              title: 'Email',
              href: '/email',
              icon: Mail,
              children: [
                { title: 'Inbox', href: '/email?folder=inbox' },
                { title: 'Sent Items', href: '/email?folder=sent' },
                { title: 'Drafts', href: '/email?folder=drafts' },
                { title: 'Archive', href: '/email?folder=archive' },
                { title: 'Deleted Items', href: '/email?folder=trash' },
              ]
            },
            { title: 'Process Payroll', href: '/payroll', icon: DollarSign },
            { title: 'Salary Structures', href: '/payroll/salary-structure', icon: CreditCard },
            { title: 'Employee Payslips', href: '/payroll/payslips', icon: FileSpreadsheet },
            { title: 'Expenses & Claims', href: '/operations/expenses', icon: Receipt },
            { title: 'Payroll Reports', href: '/reports', icon: BarChart3 },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock },
            { title: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    case 'employee':
      return [
        {
          sectionTitle: 'WORK',
          items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Tasks', href: '/tasks', icon: ListTodo, badge: '4' },
            { title: 'Timesheet', href: '/timesheets', icon: Clock },
            { title: 'Calendar', href: '/calendar', icon: CalendarDays },
          ]
        },
        {
          sectionTitle: 'PEOPLE',
          items: [
            { title: 'Profile', href: '/profile', icon: User },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              badge: '3',
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            {
              title: 'Email',
              href: '/email',
              icon: Mail,
              badge: '4',
              children: [
                { title: 'Inbox', href: '/email?folder=inbox' },
                { title: 'Sent Items', href: '/email?folder=sent' },
                { title: 'Drafts', href: '/email?folder=drafts' },
                { title: 'Archive', href: '/email?folder=archive' },
                { title: 'Deleted Items', href: '/email?folder=trash' },
              ]
            },
          ]
        },
        {
          sectionTitle: 'HR',
          items: [
            { title: 'Attendance', href: '/attendance', icon: UserCheck },
            { title: 'Leave', href: '/leave', icon: CalendarDays },
            // Payroll module commented out as requested by user
            // { title: 'Payroll', href: '/payroll', icon: DollarSign },
            // { title: 'Payslips', href: '/payroll/payslips', icon: FileSpreadsheet },
            { title: 'Documents', href: '/operations/documents', icon: FileText },
            // Performance module commented out as requested by user
            // { title: 'Performance', href: '/performance', icon: BarChart3 },
            // Expenses module commented out as requested by user
            // { title: 'Expenses', href: '/operations/expenses', icon: Receipt },
            { title: 'Assets', href: '/operations/assets', icon: Package },
          ]
        },
        {
          sectionTitle: 'COMPANY',
          items: [
            { title: 'Announcements', href: '/announcements', icon: Megaphone },
            { title: 'Holidays', href: '/leave/holidays', icon: Calendar },
            { title: 'Requests', href: '/requests', icon: FileQuestion },
          ]
        },
        {
          sectionTitle: 'SUPPORT',
          items: [
            { title: 'Help & Support', href: '/help', icon: HelpCircle },
          ]
        }
      ];

    case 'hr_admin':
    case 'org_admin':
    case 'org_owner':
    case 'hr_executive':
    default:
      return [
        {
          sectionTitle: 'MAIN',
          items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              badge: '3',
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            {
              title: 'Email',
              href: '/email',
              icon: Mail,
              badge: '4',
              children: [
                { title: 'Inbox', href: '/email?folder=inbox' },
                { title: 'Sent Items', href: '/email?folder=sent' },
                { title: 'Drafts', href: '/email?folder=drafts' },
                { title: 'Archive', href: '/email?folder=archive' },
                { title: 'Deleted Items', href: '/email?folder=trash' },
              ]
            },
            { title: 'Analytics', href: '/reports', icon: BarChart3 },
          ]
        },
        {
          sectionTitle: 'PEOPLE',
          items: [
            { title: 'Employees', href: '/employees', icon: Users, badge: '248' },
            { title: 'Departments', href: '/departments', icon: Building2 },
            { title: 'Designations', href: '/designations', icon: Award },
            { title: 'Teams', href: '/teams', icon: Users },
            { title: 'Organization Structure', href: '/org-structure', icon: Layers },
          ]
        },
        {
          sectionTitle: 'ATTENDANCE',
          items: [
            { title: 'Attendance', href: '/attendance', icon: Clock },
            { title: 'Timesheets', href: '/timesheets', icon: UserCheck },
            { title: 'Shifts', href: '/shifts', icon: Sparkles },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock, badge: 'Live' },
          ]
        },
        {
          sectionTitle: 'LEAVE',
          items: [
            { title: 'Leave Management', href: '/leave', icon: CalendarDays, badge: '12' },
            { title: 'Leave Requests', href: '/leave/requests', icon: FileSpreadsheet },
            { title: 'Leave Balance', href: '/leave/balance', icon: ShieldCheck },
            { title: 'Holidays', href: '/leave/holidays', icon: Calendar },
          ]
        },
        {
          sectionTitle: 'PAYROLL',
          items: [
            { title: 'Payroll Dashboard', href: '/payroll', icon: DollarSign },
            { title: 'Salary Structure', href: '/payroll/salary-structure', icon: CreditCard },
            { title: 'Payslips', href: '/payroll/payslips', icon: FileSpreadsheet },
            { title: 'Adjustments & Claims', href: '/payroll/adjustments', icon: Receipt },
          ]
        },
        {
          sectionTitle: 'RECRUITMENT',
          items: [
            { title: 'Job Openings', href: '/recruitment/jobs', icon: Briefcase, badge: '5' },
            { title: 'Candidates', href: '/recruitment/candidates', icon: Users },
            { title: 'Interviews', href: '/recruitment/interviews', icon: Calendar },
          ]
        },
        {
          sectionTitle: 'PERFORMANCE',
          items: [
            { title: 'Goals & OKRs', href: '/performance/goals', icon: Target },
            { title: 'Performance Reviews', href: '/performance/reviews', icon: BarChart3 },
          ]
        },
        {
          sectionTitle: 'OPERATIONS',
          items: [
            { title: 'Expenses', href: '/operations/expenses', icon: Receipt },
            { title: 'Assets', href: '/operations/assets', icon: Package },
            { title: 'Documents', href: '/operations/documents', icon: FileText },
            { title: 'Training', href: '/operations/training', icon: GraduationCap },
          ]
        },
        {
          sectionTitle: 'REPORTS',
          items: [
            { title: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
          ]
        },
        {
          sectionTitle: 'SETTINGS',
          items: [
            { title: 'Roles & Permissions', href: '/settings', icon: Settings },
          ]
        }
      ];
  }
}
