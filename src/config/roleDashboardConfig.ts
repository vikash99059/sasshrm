import { UserRole } from '../types';

export interface RolePersona {
  role: UserRole;
  name: string;
  title: string;
  email: string;
  avatar: string;
  department?: string;
  designation: string;
  defaultRoute: string;
  dataScope: 'platform' | 'organization' | 'department' | 'team' | 'self';
  description: string;
}

export const ROLE_PERSONAS: Record<UserRole, RolePersona> = {
  saas_owner: {
    role: 'saas_owner',
    name: 'Marcus Sterling',
    title: 'SaaS Platform Owner',
    email: 'marcus.sterling@hrmcloud.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Platform Officer',
    defaultRoute: '/saas/dashboard',
    dataScope: 'platform',
    description: 'Manage all tenant organizations, MRR, subscriptions & system health',
  },
  org_owner: {
    role: 'org_owner',
    name: 'Alexander Wright',
    title: 'Organization Owner (CEO)',
    email: 'alex.wright@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Executive Officer',
    defaultRoute: '/organization/dashboard',
    dataScope: 'organization',
    description: 'Executive organizational metrics, growth, financial burn & governance',
  },
  org_admin: {
    role: 'org_admin',
    name: 'Alex Johnson',
    title: 'Organization Admin',
    email: 'alex.johnson@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    designation: 'VP of Operations',
    defaultRoute: '/organization/dashboard',
    dataScope: 'organization',
    description: 'Full organizational administration, headcount, performance & approvals',
  },
  hr_admin: {
    role: 'hr_admin',
    name: 'Rachel Green',
    title: 'HR Admin',
    email: 'rachel.green@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    designation: 'Head of People & Culture',
    defaultRoute: '/hr/dashboard',
    dataScope: 'organization',
    description: 'Complete HR suite, employee records, policies, leaves & compliance',
  },
  hr_executive: {
    role: 'hr_executive',
    name: 'Priya Sharma',
    title: 'HR Executive',
    email: 'priya.sharma@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Senior HR Operations Officer',
    defaultRoute: '/hr-executive/dashboard',
    dataScope: 'organization',
    description: 'Daily operational tasks, onboarding, attendance checks & employee requests',
  },
  recruiter: {
    role: 'recruiter',
    name: 'Ethan Hunt',
    title: 'Talent Recruiter',
    email: 'ethan.hunt@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    designation: 'Lead Technical Recruiter',
    defaultRoute: '/recruiter/dashboard',
    dataScope: 'department',
    description: 'ATS candidate pipeline, job openings, interviews & offer management',
  },
  payroll_admin: {
    role: 'payroll_admin',
    name: 'Elena Rostova',
    title: 'Payroll Admin',
    email: 'elena.rostova@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Payroll Officer',
    defaultRoute: '/payroll/dashboard',
    dataScope: 'organization',
    description: 'Salary batch processing, tax compliance, deductions & payslip delivery',
  },
  manager: {
    role: 'manager',
    name: 'David Miller',
    title: 'Engineering Manager',
    email: 'david.miller@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Engineering Team Lead',
    defaultRoute: '/manager/dashboard',
    dataScope: 'team',
    description: 'Direct team attendance, timesheets, leave approvals & OKR progress',
  },
  employee: {
    role: 'employee',
    name: 'Sarah Wilson',
    title: 'Employee Self-Service',
    email: 'sarah.wilson@acme.corp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    designation: 'Senior Product Designer',
    defaultRoute: '/employee/dashboard',
    dataScope: 'self',
    description: 'Personal workspace, leave balances, clock-in, payslips & goals',
  },
};
