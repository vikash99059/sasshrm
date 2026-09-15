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
  Bell,
  Boxes,
  Sliders,
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
            { title: 'Corporate Modules', href: '/saas/modules', icon: Boxes, badge: '17' },
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
            { title: 'Email', href: '/email', icon: Mail, badge: '4' },
            { title: 'Team Members', href: '/employees', icon: Users },
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
          sectionTitle: 'RECRUITMENT',
          items: [
            { title: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
            {
              title: 'Manpower Requirements',
              href: '/recruiter/manpower-requirements',
              icon: Users,
              badge: '5',
              children: [
                { title: 'Workforce Requests', href: '/recruiter/manpower-requirements?tab=workforce' },
                { title: 'Department Requirements', href: '/recruiter/manpower-requirements?tab=departments' },
                { title: 'Position Requirements', href: '/recruiter/manpower-requirements?tab=positions' },
                { title: 'Pending Approvals', href: '/recruiter/manpower-requirements?tab=pending' },
              ],
            },
            {
              title: 'Job Requisitions',
              href: '/recruiter/requisitions',
              icon: FileText,
              badge: '3',
              children: [
                { title: 'All Requisitions', href: '/recruiter/requisitions?tab=all' },
                { title: 'My Requisitions', href: '/recruiter/requisitions?tab=my' },
                { title: 'Pending Approval', href: '/recruiter/requisitions?tab=pending' },
                { title: 'Approved', href: '/recruiter/requisitions?tab=approved' },
                { title: 'Rejected', href: '/recruiter/requisitions?tab=rejected' },
                { title: 'Closed', href: '/recruiter/requisitions?tab=closed' },
              ],
            },
            {
              title: 'Jobs',
              href: '/recruiter/jobs',
              icon: Briefcase,
              badge: '4',
              children: [
                { title: 'All Jobs', href: '/recruiter/jobs?tab=all' },
                { title: 'Create Job', href: '/recruiter/jobs/create' },
                { title: 'Draft Jobs', href: '/recruiter/jobs?tab=draft' },
                { title: 'Published Jobs', href: '/recruiter/jobs?tab=published' },
                { title: 'Expired Jobs', href: '/recruiter/jobs?tab=expired' },
                { title: 'Closed Jobs', href: '/recruiter/jobs?tab=closed' },
              ],
            },
            {
              title: 'Candidate Database',
              href: '/recruiter/candidates',
              icon: UserCheck,
              children: [
                { title: 'All Candidates', href: '/recruiter/candidates?tab=all' },
                { title: 'Talent Pool', href: '/recruiter/candidates?tab=talent-pool' },
                { title: 'New Candidates', href: '/recruiter/candidates?tab=new' },
                { title: 'Shortlisted', href: '/recruiter/candidates?tab=shortlisted' },
                { title: 'Rejected', href: '/recruiter/candidates?tab=rejected' },
                { title: 'Hired', href: '/recruiter/candidates?tab=hired' },
              ],
            },
            {
              title: 'Resume Management',
              href: '/recruiter/resumes',
              icon: FileSpreadsheet,
              children: [
                { title: 'All Resumes', href: '/recruiter/resumes?tab=all' },
                { title: 'Resume Screening', href: '/recruiter/resumes?tab=screening' },
                { title: 'Resume Parsing', href: '/recruiter/resumes?tab=parsing' },
                { title: 'Resume Downloads', href: '/recruiter/resumes?tab=downloads' },
                { title: 'Candidate Documents', href: '/recruiter/resumes?tab=documents' },
              ],
            },
            {
              title: 'Applications',
              href: '/recruiter/applications',
              icon: Target,
              badge: '7',
              children: [
                { title: 'All Applications', href: '/recruiter/applications?tab=all' },
                { title: 'New Applications', href: '/recruiter/applications?tab=new' },
                { title: 'Under Review', href: '/recruiter/applications?tab=review' },
                { title: 'Shortlisted', href: '/recruiter/applications?tab=shortlisted' },
                { title: 'Rejected', href: '/recruiter/applications?tab=rejected' },
                { title: 'Withdrawn', href: '/recruiter/applications?tab=withdrawn' },
              ],
            },
            {
              title: 'Screening & Shortlisting',
              href: '/recruiter/screening',
              icon: Sparkles,
              children: [
                { title: 'Screening Queue', href: '/recruiter/screening?tab=queue' },
                { title: 'Screening Results', href: '/recruiter/screening?tab=results' },
                { title: 'Shortlisted Candidates', href: '/recruiter/screening?tab=shortlisted' },
                { title: 'Rejected Candidates', href: '/recruiter/screening?tab=rejected' },
              ],
            },
            {
              title: 'Interviews',
              href: '/recruiter/interviews',
              icon: Calendar,
              badge: '6',
              children: [
                { title: 'Interview Calendar', href: '/recruiter/interviews/calendar' },
                { title: 'Schedule Interview', href: '/recruiter/interviews?action=schedule' },
                { title: 'Upcoming Interviews', href: '/recruiter/interviews?tab=upcoming' },
                { title: 'Completed Interviews', href: '/recruiter/interviews?tab=completed' },
                { title: 'Cancelled Interviews', href: '/recruiter/interviews?tab=cancelled' },
              ],
            },
            {
              title: 'Interview Evaluation',
              href: '/recruiter/evaluations',
              icon: Award,
              badge: '2',
              children: [
                { title: 'Pending Evaluation', href: '/recruiter/evaluations?tab=pending' },
                { title: 'Completed Evaluations', href: '/recruiter/evaluations?tab=completed' },
                { title: 'Interview Feedback', href: '/recruiter/evaluations?tab=feedback' },
                { title: 'Evaluation History', href: '/recruiter/evaluations?tab=history' },
              ],
            },
            {
              title: 'Selection & Offers',
              href: '/recruiter/offers',
              icon: CreditCard,
              badge: '3',
              children: [
                { title: 'Selected Candidates', href: '/recruiter/offers?tab=selected' },
                { title: 'Offer Drafts', href: '/recruiter/offers?tab=drafts' },
                { title: 'Offers Sent', href: '/recruiter/offers?tab=sent' },
                { title: 'Offers Accepted', href: '/recruiter/offers?tab=accepted' },
                { title: 'Offers Rejected', href: '/recruiter/offers?tab=rejected' },
                { title: 'Offer Expired', href: '/recruiter/offers?tab=expired' },
              ],
            },
            {
              title: 'Recruitment Pipeline',
              href: '/recruiter/pipeline',
              icon: Layers,
            },
            {
              title: 'Recruitment Analytics',
              href: '/recruiter/analytics',
              icon: BarChart3,
              children: [
                { title: 'Recruitment Overview', href: '/recruiter/analytics?tab=overview' },
                { title: 'Source Analytics', href: '/recruiter/analytics?tab=sources' },
                { title: 'Time to Hire', href: '/recruiter/analytics?tab=time-to-hire' },
                { title: 'Cost per Hire', href: '/recruiter/analytics?tab=cost' },
                { title: 'Hiring Funnel', href: '/recruiter/analytics?tab=funnel' },
                { title: 'Recruiter Performance', href: '/recruiter/analytics?tab=performance' },
              ],
            },
            {
              title: 'Joining & Onboarding Handover',
              href: '/recruiter/handover',
              icon: User,
              badge: '3',
              children: [
                { title: 'Joining Pending', href: '/recruiter/handover?tab=pending' },
                { title: 'Joining Confirmed', href: '/recruiter/handover?tab=confirmed' },
                { title: 'Documents Pending', href: '/recruiter/handover?tab=documents' },
                { title: 'Ready for Onboarding', href: '/recruiter/handover?tab=ready' },
                { title: 'Handover to HR', href: '/recruiter/handover?tab=handover' },
              ],
            },
          ],
        },
        {
          sectionTitle: 'SUPPORT',
          items: [
            { title: 'Notifications', href: '/recruiter/notifications', icon: Bell, badge: '5' },
            { title: 'Help & Support', href: '/support', icon: HelpCircle },
          ],
        },
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
            { title: 'Email', href: '/email', icon: Mail },
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
          items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Tasks', href: '/tasks', icon: ListTodo, badge: '4' },
            { title: 'Calendar', href: '/calendar', icon: CalendarDays },
            { title: 'Timesheet', href: '/timesheets', icon: Clock },
            { title: 'Attendance', href: '/attendance', icon: UserCheck },
            { title: 'Leave', href: '/leave', icon: CalendarDays },
          ]
        },
        {
          sectionTitle: 'Communication',
          items: [
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
            { title: 'Email', href: '/email', icon: Mail, badge: '4' },
          ]
        },
        {
          sectionTitle: 'Employee',
          items: [
            { title: 'Profile', href: '/profile', icon: User },
            { title: 'My Payslips', href: '/payroll/payslips', icon: FileSpreadsheet },
            { title: 'Assets', href: '/operations/assets', icon: Package },
          ]
        },
        {
          sectionTitle: 'Company',
          items: [
            { title: 'Announcements', href: '/announcements', icon: Megaphone },
            { title: 'Holidays', href: '/leave/holidays', icon: Calendar },
          ]
        },
        {
          sectionTitle: 'Support',
          items: [
            { title: 'Requests', href: '/requests', icon: FileQuestion },
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
            { title: 'Email', href: '/email', icon: Mail, badge: '4' },
            { title: 'Analytics', href: '/reports', icon: BarChart3 },
          ]
        },
        {
          sectionTitle: 'PEOPLE',
          items: [
            { title: 'Employees', href: '/employees', icon: Users },
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
