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
import { CorporateModuleId } from '../types/saasModules';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  moduleId?: CorporateModuleId;
  subModule?: string;
  children?: { title: string; href: string; subModule?: string }[];
}

export interface NavSection {
  sectionTitle?: string;
  items: NavItem[];
}

function getRawNavigationForRole(role: UserRole): NavSection[] {
  switch (role) {
    case 'saas_owner':
      return [
        {
          sectionTitle: 'PLATFORM MANAGEMENT',
          items: [
            { title: 'Super Admin Overview', href: '/saas', icon: LayoutDashboard },
            { title: 'Corporate Modules', href: '/saas/modules', icon: Boxes, badge: '17' },
            { title: 'Organizations', href: '/saas/organizations', icon: Building2, badge: 'Active' },
            // { title: 'Subscriptions', href: '/saas/subscriptions', icon: CreditCard },
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
              moduleId: 'chat_communication',
              subModule: 'Internal employee chat',
              children: [
                { title: 'Chat', href: '/chat?tab=chat', subModule: 'Internal employee chat' },
                { title: 'Teams', href: '/chat?tab=teams', subModule: 'Project/team chat' },
                { title: 'Calendar', href: '/chat?tab=calendar', subModule: 'Internal employee chat' },
                { title: 'Calls', href: '/chat?tab=calls', subModule: 'Internal employee chat' },
                { title: 'Files', href: '/chat?tab=files', subModule: 'File sharing' },
              ]
            },
            { title: 'Email', href: '/email', icon: Mail, badge: '4', moduleId: 'email_management', subModule: 'Inbox / sent / drafts' },
            { title: 'Team Members', href: '/employees', icon: Users, moduleId: 'organization_management', subModule: 'User management' },
            { title: 'Team Attendance', href: '/attendance', icon: Clock, moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
            { title: 'Clock In / Out', href: '/clock-in', icon: UserCheck, moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
            { title: 'Leave Approvals', href: '/leave/requests', icon: CalendarDays, badge: '3', moduleId: 'employee_hr_management', subModule: 'Leave management' },
            { title: 'Team Performance', href: '/performance/goals', icon: Target, moduleId: 'kpi_performance_management', subModule: 'Targets' },
            { title: 'Expense Approvals', href: '/operations/expenses', icon: Receipt, moduleId: 'finance_management', subModule: 'Income & expenses' },
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
            { title: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard, moduleId: 'recruitment_management' },
            {
              title: 'Manpower Requirements',
              href: '/recruiter/manpower-requirements',
              icon: Users,
              badge: '5',
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
            },
            {
              title: 'Recruitment Analytics',
              href: '/recruiter/analytics',
              icon: BarChart3,
              moduleId: 'recruitment_management',
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
              moduleId: 'recruitment_management',
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
            { title: 'Notifications', href: '/recruiter/notifications', icon: Bell, badge: '5', moduleId: 'recruitment_management' },
            { title: 'Help & Support', href: '/support', icon: HelpCircle },
          ],
        },
      ];

    case 'payroll_admin':
      return [
        {
          sectionTitle: 'FINANCE & PAYROLL',
          items: [
            { title: 'Payroll Dashboard', href: '/dashboard', icon: LayoutDashboard, moduleId: 'finance_management' },
            {
              title: 'Chat & Teams',
              href: '/chat',
              icon: MessageSquare,
              moduleId: 'chat_communication',
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            { title: 'Email', href: '/email', icon: Mail, moduleId: 'email_management' },
            { title: 'Process Payroll', href: '/payroll', icon: DollarSign, moduleId: 'finance_management' },
            { title: 'Salary Structures', href: '/payroll/salary-structure', icon: CreditCard, moduleId: 'finance_management' },
            { title: 'Employee Payslips', href: '/payroll/payslips', icon: FileSpreadsheet, moduleId: 'finance_management' },
            { title: 'Expenses & Claims', href: '/operations/expenses', icon: Receipt, moduleId: 'finance_management' },
            { title: 'Payroll Reports', href: '/reports', icon: BarChart3, moduleId: 'finance_management' },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock, moduleId: 'employee_hr_management' },
            { title: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    case 'employee':
      return [
        {
          items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Tasks', href: '/tasks', icon: ListTodo, badge: '4', moduleId: 'project_task_management' },
            { title: 'Calendar', href: '/calendar', icon: CalendarDays },
            { title: 'Timesheet', href: '/timesheets', icon: Clock, moduleId: 'employee_hr_management' },
            { title: 'Attendance', href: '/attendance', icon: UserCheck, moduleId: 'employee_hr_management' },
            { title: 'Leave', href: '/leave', icon: CalendarDays, moduleId: 'employee_hr_management' },
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
              moduleId: 'chat_communication',
              children: [
                { title: 'Chat', href: '/chat?tab=chat' },
                { title: 'Teams', href: '/chat?tab=teams' },
                { title: 'Calendar', href: '/chat?tab=calendar' },
                { title: 'Calls', href: '/chat?tab=calls' },
                { title: 'Files', href: '/chat?tab=files' },
              ]
            },
            { title: 'Email', href: '/email', icon: Mail, badge: '4', moduleId: 'email_management' },
          ]
        },
        {
          sectionTitle: 'Employee',
          items: [
            { title: 'Profile', href: '/profile', icon: User, moduleId: 'employee_hr_management' },
            { title: 'My Payslips', href: '/payroll/payslips', icon: FileSpreadsheet, moduleId: 'finance_management' },
            { title: 'Assets', href: '/operations/assets', icon: Package, moduleId: 'inventory_asset_management' },
          ]
        },
        {
          sectionTitle: 'Company',
          items: [
            { title: 'Announcements', href: '/announcements', icon: Megaphone },
            { title: 'Holidays', href: '/leave/holidays', icon: Calendar, moduleId: 'employee_hr_management' },
          ]
        },
        {
          sectionTitle: 'Support',
          items: [
            { title: 'Requests', href: '/requests', icon: FileQuestion, moduleId: 'customer_service_support' },
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
              moduleId: 'chat_communication',
              subModule: 'Internal employee chat',
              children: [
                { title: 'Chat', href: '/chat?tab=chat', subModule: 'Internal employee chat' },
                { title: 'Teams', href: '/chat?tab=teams', subModule: 'Project/team chat' },
                { title: 'Calendar', href: '/chat?tab=calendar', subModule: 'Internal employee chat' },
                { title: 'Calls', href: '/chat?tab=calls', subModule: 'Internal employee chat' },
                { title: 'Files', href: '/chat?tab=files', subModule: 'File sharing' },
              ]
            },
            { title: 'Email', href: '/email', icon: Mail, badge: '4', moduleId: 'email_management', subModule: 'Inbox / sent / drafts' },
            { title: 'Analytics', href: '/reports', icon: BarChart3, moduleId: 'mis_analytics_dashboard', subModule: 'HR dashboard' },
          ]
        },
        {
          sectionTitle: 'PEOPLE',
          items: [
            { title: 'Employees', href: '/employees', icon: Users, moduleId: 'organization_management', subModule: 'User management' },
            { title: 'Departments', href: '/departments', icon: Building2, moduleId: 'organization_management', subModule: 'Departments' },
            { title: 'Designations', href: '/designations', icon: Award, moduleId: 'organization_management', subModule: 'Designations & roles' },
            { title: 'Teams', href: '/teams', icon: Users, moduleId: 'organization_management', subModule: 'Company / Business Unit / Branch setup' },
            { title: 'Organization Structure', href: '/org-structure', icon: Layers, moduleId: 'organization_management', subModule: 'Organization structure' },
          ]
        },
        {
          sectionTitle: 'ATTENDANCE',
          items: [
            { title: 'Attendance', href: '/attendance', icon: Clock, moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
            { title: 'Timesheets', href: '/timesheets', icon: UserCheck, moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
            { title: 'Shifts', href: '/shifts', icon: Sparkles, moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock, badge: 'Live', moduleId: 'employee_hr_management', subModule: 'Attendance & shifts' },
          ]
        },
        {
          sectionTitle: 'LEAVE',
          items: [
            { title: 'Leave Management', href: '/leave', icon: CalendarDays, badge: '12', moduleId: 'employee_hr_management', subModule: 'Leave management' },
            { title: 'Leave Requests', href: '/leave/requests', icon: FileSpreadsheet, moduleId: 'employee_hr_management', subModule: 'Leave management' },
            { title: 'Leave Balance', href: '/leave/balance', icon: ShieldCheck, moduleId: 'employee_hr_management', subModule: 'Leave management' },
            { title: 'Holidays', href: '/leave/holidays', icon: Calendar, moduleId: 'employee_hr_management', subModule: 'Leave management' },
          ]
        },
        {
          sectionTitle: 'PAYROLL',
          items: [
            { title: 'Payroll Dashboard', href: '/payroll', icon: DollarSign, moduleId: 'finance_management', subModule: 'Salary structure & payroll processing' },
            { title: 'Salary Structure', href: '/payroll/salary-structure', icon: CreditCard, moduleId: 'finance_management', subModule: 'Salary structure & payroll processing' },
            { title: 'Payslips', href: '/payroll/payslips', icon: FileSpreadsheet, moduleId: 'finance_management', subModule: 'Payslips, deductions & advances' },
            { title: 'Adjustments & Claims', href: '/payroll/adjustments', icon: Receipt, moduleId: 'finance_management', subModule: 'Income & expenses' },
          ]
        },
        {
          sectionTitle: 'RECRUITMENT',
          items: [
            { title: 'Job Openings', href: '/recruitment/jobs', icon: Briefcase, badge: '5', moduleId: 'recruitment_management', subModule: 'Job creation & publishing' },
            { title: 'Candidates', href: '/recruitment/candidates', icon: Users, moduleId: 'recruitment_management', subModule: 'Candidate database' },
            { title: 'Interviews', href: '/recruitment/interviews', icon: Calendar, moduleId: 'recruitment_management', subModule: 'Interview scheduling' },
          ]
        },
        {
          sectionTitle: 'PERFORMANCE',
          items: [
            { title: 'Goals & OKRs', href: '/performance/goals', icon: Target, moduleId: 'kpi_performance_management', subModule: 'Targets' },
            { title: 'Performance Reviews', href: '/performance/reviews', icon: BarChart3, moduleId: 'kpi_performance_management', subModule: 'Performance scorecards' },
          ]
        },
        {
          sectionTitle: 'OPERATIONS',
          items: [
            { title: 'Expenses', href: '/operations/expenses', icon: Receipt, moduleId: 'finance_management', subModule: 'Income & expenses' },
            { title: 'Assets', href: '/operations/assets', icon: Package, moduleId: 'inventory_asset_management', subModule: 'Asset registration' },
            { title: 'Documents', href: '/operations/documents', icon: FileText, moduleId: 'document_management', subModule: 'Company documents' },
            { title: 'Training', href: '/operations/training', icon: GraduationCap, moduleId: 'employee_hr_management', subModule: 'Training' },
          ]
        },
        {
          sectionTitle: 'REPORTS',
          items: [
            { title: 'Reports & Analytics', href: '/reports', icon: BarChart3, moduleId: 'mis_analytics_dashboard', subModule: 'HR dashboard' },
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

export function getNavigationForRole(
  role: UserRole,
  subscribedModules?: CorporateModuleId[],
  disabledSubModules?: Record<string, string[]>
): NavSection[] {
  const rawSections = getRawNavigationForRole(role);
  if (role === 'saas_owner' || !subscribedModules) {
    return rawSections;
  }

  return rawSections
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => {
          // 1. Check if parent module is subscribed
          if (item.moduleId && !subscribedModules.includes(item.moduleId)) {
            return false;
          }
          // 2. Check if specific submodule is disabled
          if (item.moduleId && item.subModule && disabledSubModules?.[item.moduleId]) {
            const disabledList = disabledSubModules[item.moduleId] || [];
            if (disabledList.includes(item.subModule)) {
              return false;
            }
          }
          return true;
        })
        .map((item) => {
          if (!item.children) return item;
          // Filter children sub-items if any child has a subModule that is disabled
          const filteredChildren = item.children.filter((child) => {
            if (item.moduleId && child.subModule && disabledSubModules?.[item.moduleId]) {
              const disabledList = disabledSubModules[item.moduleId] || [];
              if (disabledList.includes(child.subModule)) {
                return false;
              }
            }
            return true;
          });
          return {
            ...item,
            children: filteredChildren,
          };
        }),
    }))
    .filter((section) => section.items.length > 0);
}

