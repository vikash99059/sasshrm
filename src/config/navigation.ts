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
  Percent,
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

function getRawNavigationForRole(role: UserRole, activeContext: 'organisation' | 'superadmin' = 'superadmin'): NavSection[] {
  if (role === 'saas_owner') {
    if (activeContext === 'organisation') {
      return getRawNavigationForRole('org_admin', 'organisation');
    }

    return [
      {
        sectionTitle: 'PLATFORM MANAGEMENT',
        items: [
          { title: 'Super Admin Overview', href: '/saas', icon: LayoutDashboard },
          { title: 'Corporate Modules', href: '/saas/modules', icon: Boxes, badge: '17' },
          { title: 'Organizations', href: '/saas/organizations', icon: Building2, badge: 'Active' },
          { title: 'Plans & Pricing', href: '/saas/plans', icon: Layers },
          { title: 'Billing & Invoices', href: '/saas/billing', icon: DollarSign },
        ]
      },
      {
        sectionTitle: 'PLATFORM OPERATIONS',
        items: [
          { title: 'Platform Sales & Deals', href: '/saas/sales', icon: Briefcase },
          { title: 'Platform Finance & Revenue', href: '/saas/revenue', icon: BarChart3 },
          { title: 'Platform Hiring & Team', href: '/saas/hiring', icon: Users },
          { title: 'Platform Support & Tickets', href: '/saas/tickets', icon: FileQuestion, badge: 'SLA' },
        ]
      },
      {
        sectionTitle: 'SYSTEM & GOVERNANCE',
        items: [
          { title: 'System Analytics', href: '/saas/analytics', icon: Compass },
          { title: 'Audit Logs', href: '/saas/audit-logs', icon: ShieldCheck },
          { title: 'System Settings', href: '/saas/settings', icon: Settings },
        ]
      }
    ];
  }

  switch (role) {
    case 'manager':
      return [
        {
          sectionTitle: 'MANAGEMENT',
          items: [
            { title: 'Team Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Chat & Teams', href: '/chat', icon: MessageSquare, badge: '3', moduleId: 'chat_communication', subModule: 'Internal employee chat' },
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
          sectionTitle: 'OVERVIEW',
          items: [
            { title: 'Recruiter Command Center', href: '/recruiter/dashboard', icon: LayoutDashboard, moduleId: 'recruitment_management' },
          ],
        },
        {
          sectionTitle: 'WORKFORCE PLANNING',
          items: [
            { title: 'Headcount & Manpower Planning', href: '/recruiter/manpower-requirements', icon: Users, badge: '5', moduleId: 'recruitment_management' },
            { title: 'Hiring Requisitions', href: '/recruiter/requisitions', icon: FileText, badge: '3', moduleId: 'recruitment_management' },
          ],
        },
        {
          sectionTitle: 'TALENT SOURCING',
          items: [
            { title: 'Published Job Openings', href: '/recruiter/jobs', icon: Briefcase, badge: '4', moduleId: 'recruitment_management' },
            { title: 'Candidate Talent Pool', href: '/recruiter/candidates', icon: UserCheck, moduleId: 'recruitment_management' },
            { title: 'Resume & CV Bank', href: '/recruiter/resumes', icon: FileSpreadsheet, moduleId: 'recruitment_management' },
            { title: 'Applicant Submissions', href: '/recruiter/applications', icon: Target, badge: '7', moduleId: 'recruitment_management' },
          ],
        },
        {
          sectionTitle: 'ASSESSMENT & PIPELINE',
          items: [
            { title: 'Candidate Screening Queue', href: '/recruiter/screening', icon: Sparkles, moduleId: 'recruitment_management' },
            { title: 'ATS Hiring Pipeline', href: '/recruiter/pipeline', icon: Layers, moduleId: 'recruitment_management' },
            { title: 'Interview Schedule & Calendar', href: '/recruiter/interviews', icon: Calendar, badge: '6', moduleId: 'recruitment_management' },
            { title: 'Scorecards & Evaluations', href: '/recruiter/evaluations', icon: Award, badge: '2', moduleId: 'recruitment_management' },
          ],
        },
        {
          sectionTitle: 'OFFERS & ONBOARDING',
          items: [
            { title: 'Offer Letters & Rollout', href: '/recruiter/offers', icon: CreditCard, badge: '3', moduleId: 'recruitment_management' },
            { title: 'Pre-Onboarding & HR Handover', href: '/recruiter/handover', icon: User, badge: '3', moduleId: 'recruitment_management' },
          ],
        },
        {
          sectionTitle: 'INSIGHTS & WORKSPACE',
          items: [
            { title: 'Recruitment Intelligence & Metrics', href: '/recruiter/analytics', icon: BarChart3, moduleId: 'recruitment_management' },
            { title: 'My Shift Clock In / Out', href: '/clock-in', icon: Clock, badge: 'Live', moduleId: 'employee_hr_management' },
            { title: 'Recruitment Alerts', href: '/recruiter/notifications', icon: Bell, badge: '5', moduleId: 'recruitment_management' },
            { title: 'Support & Knowledge Base', href: '/support', icon: HelpCircle },
          ],
        },
      ];

    case 'payroll_admin':
      return [
        {
          sectionTitle: 'OVERVIEW',
          items: [
            { title: 'Finance Command Center', href: '/dashboard', icon: LayoutDashboard, moduleId: 'finance_management' },
            { title: 'My Shift Clock In / Out', href: '/clock-in', icon: Clock, badge: 'Live', moduleId: 'employee_hr_management' },
          ],
        },
        {
          sectionTitle: 'ACCOUNTING & LEDGER',
          items: [
            { title: 'Chart of Accounts', href: '/finance/chart-of-accounts', icon: Layers, moduleId: 'finance_management', subModule: 'Chart of accounts' },
            { title: 'Invoices & Receivables', href: '/finance/invoices', icon: FileText, badge: '4 Due', moduleId: 'finance_management', subModule: 'Invoicing' },
            { title: 'Bills & Payables', href: '/finance/bills', icon: Receipt, badge: '6 Bills', moduleId: 'finance_management', subModule: 'Receivables & payables' },
            { title: 'Payments & Receipts', href: '/finance/vouchers', icon: CreditCard, moduleId: 'finance_management', subModule: 'Payments & receipts' },
            { title: 'Bank Reconciliation', href: '/finance/reconciliation', icon: Building2, badge: 'Auto', moduleId: 'finance_management', subModule: 'Bank reconciliation' },
            { title: 'GST & Tax Filings', href: '/finance/gst', icon: Percent, moduleId: 'finance_management', subModule: 'GST & statutory reports' },
            { title: 'Financial Statements (P&L)', href: '/finance/statements', icon: BarChart3, moduleId: 'finance_management', subModule: 'P&L & Balance Sheet' },
          ],
        },
        {
          sectionTitle: 'PAYROLL PROCESSING',
          items: [
            { title: 'Batch Payroll Engine', href: '/payroll', icon: DollarSign, badge: 'Batch', moduleId: 'finance_management', subModule: 'Salary structure & payroll processing' },
            { title: 'Salary Structure Bands', href: '/payroll/salary-structure', icon: Sliders, moduleId: 'finance_management', subModule: 'Salary structure & payroll processing' },
            { title: 'Employee Payslips Archive', href: '/payroll/payslips', icon: FileSpreadsheet, moduleId: 'finance_management', subModule: 'Payslips, deductions & advances' },
            { title: 'Adjustments & Overtime', href: '/payroll/adjustments', icon: Receipt, moduleId: 'finance_management', subModule: 'Payslips, deductions & advances' },
          ],
        },
        {
          sectionTitle: 'ADVANCES & CLAIMS',
          items: [
            { title: 'Employee Loans & Advances', href: '/payroll/loans', icon: CreditCard, badge: 'EMI', moduleId: 'finance_management', subModule: 'Payslips, deductions & advances' },
            { title: 'Expense Reimbursements', href: '/operations/expenses', icon: Receipt, moduleId: 'finance_management', subModule: 'Income & expenses' },
          ],
        },
        {
          sectionTitle: 'STATUTORY & COMPLIANCE',
          items: [
            { title: 'EPF, ESI, PT & TDS', href: '/payroll/compliance', icon: ShieldCheck, badge: '98%', moduleId: 'finance_management', subModule: 'Statutory compliance (PF, ESI, PT, TDS)' },
            { title: 'Compliance Reports', href: '/reports', icon: BarChart3, moduleId: 'finance_management', subModule: 'GST & statutory reports' },
          ],
        },
        {
          sectionTitle: 'COMMUNICATION & SETTINGS',
          items: [
            { title: 'Chat & Teams', href: '/chat', icon: MessageSquare, badge: '3', moduleId: 'chat_communication' },
            { title: 'Email', href: '/email', icon: Mail, badge: '4', moduleId: 'email_management' },
            { title: 'Finance Settings', href: '/settings', icon: Settings },
            { title: 'Support & Helpdesk', href: '/support', icon: HelpCircle },
          ],
        },
      ];

    case 'employee':
      return [
        {
          items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Clock In / Out', href: '/clock-in', icon: Clock, badge: 'Live', moduleId: 'employee_hr_management' },
            { title: 'Project Management', href: '/tasks', icon: ListTodo, badge: '4', moduleId: 'organization_management', subModule: 'Project Management' },
            { title: 'Calendar', href: '/calendar', icon: CalendarDays },
            { title: 'Timesheet', href: '/timesheets', icon: Clock, moduleId: 'employee_hr_management' },
            { title: 'Attendance', href: '/attendance', icon: UserCheck, moduleId: 'employee_hr_management' },
            { title: 'Leave', href: '/leave', icon: CalendarDays, moduleId: 'employee_hr_management' },
          ]
        },
        {
          sectionTitle: 'Communication',
          items: [
            { title: 'Chat & Teams', href: '/chat', icon: MessageSquare, badge: '3', moduleId: 'chat_communication' },
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
            { title: 'Chat & Teams', href: '/chat', icon: MessageSquare, badge: '3', moduleId: 'chat_communication', subModule: 'Internal employee chat' },
            { title: 'Email', href: '/email', icon: Mail, badge: '4', moduleId: 'email_management', subModule: 'Inbox / sent / drafts' },
            { title: 'Analytics', href: '/reports', icon: BarChart3, moduleId: 'mis_analytics_dashboard', subModule: 'HR dashboard' },
          ]
        },
        {
          sectionTitle: 'ORGANISATION',
          items: [
            { title: 'Organization Structure', href: '/org-structure', icon: Layers, moduleId: 'organization_management', subModule: 'Organization structure' },
            { title: 'Departments & Teams', href: '/departments', icon: Building2, moduleId: 'organization_management', subModule: 'Departments' },
            { title: 'Project Management', href: '/tasks', icon: ListTodo, moduleId: 'organization_management', subModule: 'Project Management' },
            { title: 'Employees & Roster', href: '/employees', icon: Users, moduleId: 'organization_management', subModule: 'User management' },
            { title: 'Designations & Roles', href: '/designations', icon: Award, moduleId: 'organization_management', subModule: 'Designations & roles' },
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
          sectionTitle: 'CRM & SALES',
          items: [
            { title: 'CRM Dashboard', href: '/crm', icon: Target },
            { title: 'Leads & Opportunities', href: '/crm/leads', icon: Users },
            { title: 'Customers Master', href: '/crm/customers', icon: Building2 },
            { title: 'Quotations', href: '/sales/quotations', icon: FileText },
            { title: 'Sales Pipeline', href: '/sales/pipeline', icon: BarChart3 },
          ]
        },
        {
          sectionTitle: 'FINANCE & ERP',
          items: [
            { title: 'Finance Dashboard', href: '/finance', icon: DollarSign },
            { title: 'Billing & Invoices', href: '/billing/invoices', icon: Receipt },
            { title: 'Costing & Budget', href: '/costing', icon: Compass },
            { title: 'Procurement', href: '/procurement/vendors', icon: Package },
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
  disabledSubModules?: Record<string, string[]>,
  activeContext: 'organisation' | 'superadmin' = 'superadmin'
): NavSection[] {
  const rawSections = getRawNavigationForRole(role, activeContext);
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

