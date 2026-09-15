import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AppLayout } from '../layouts/AppLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { TwoFactorPage } from '../pages/auth/TwoFactorPage';

// SaaS Owner Portal
import { SaasDashboardPage } from '../pages/saas/SaasDashboardPage';
import { SaasOrganizationsPage } from '../pages/saas/SaasOrganizationsPage';
import { SaasSubscriptionsPage } from '../pages/saas/SaasSubscriptionsPage';
import { SaasPlansPage } from '../pages/saas/SaasPlansPage';
import { SaasBillingInvoicesPage } from '../pages/saas/SaasBillingInvoicesPage';
import { SaasRevenueAnalyticsPage } from '../pages/saas/SaasRevenueAnalyticsPage';
import { SaasSystemAnalyticsPage } from '../pages/saas/SaasSystemAnalyticsPage';
import { SaasAuditLogsPage } from '../pages/saas/SaasAuditLogsPage';
import { SaasSettingsPage } from '../pages/saas/SaasSettingsPage';
import { SaasModulesPage } from '../pages/saas/SaasModulesPage';
import { SaasModularSubscriptionsPage } from '../pages/saas/SaasModularSubscriptionsPage';

// HR & Core Modules
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { EmployeesListPage } from '../pages/employees/EmployeesListPage';
import { EmployeeProfilePage } from '../pages/employees/EmployeeProfilePage';
import { DepartmentsPage } from '../pages/employees/DepartmentsPage';
import { DesignationsPage } from '../pages/employees/DesignationsPage';
import { TeamsPage } from '../pages/employees/TeamsPage';
import { OrgStructurePage } from '../pages/employees/OrgStructurePage';

// Communication & Work Tracking (Chat, Email, Tasks, Requests, Announcements)
import { ChatPage } from '../pages/chat/ChatPage';
import { EmailPage } from '../pages/email/EmailPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { RequestsPage } from '../pages/requests/RequestsPage';
import { AnnouncementsPage } from '../pages/company/AnnouncementsPage';

// Attendance & Leave
import { AttendancePage } from '../pages/attendance/AttendancePage';
import { ClockInPage } from '../pages/attendance/ClockInPage';
import { ShiftSchedulePage } from '../pages/attendance/ShiftSchedulePage';
import { TimesheetsPage } from '../pages/attendance/TimesheetsPage';
import { LeaveManagementPage } from '../pages/leave/LeaveManagementPage';
import { LeaveRequestsPage } from '../pages/leave/LeaveRequestsPage';
import { LeaveBalancePage } from '../pages/leave/LeaveBalancePage';
import { HolidaysPage } from '../pages/leave/HolidaysPage';

// Payroll
import { PayrollDashboardPage } from '../pages/payroll/PayrollDashboardPage';
import { SalaryStructurePage } from '../pages/payroll/SalaryStructurePage';
import { PayslipsPage } from '../pages/payroll/PayslipsPage';
import { PayrollAdjustmentsPage } from '../pages/payroll/PayrollAdjustmentsPage';

// Recruitment ATS & Talent Acquisition
import { JobOpeningsPage } from '../pages/recruitment/JobOpeningsPage';
import { JobCreatePage } from '../pages/recruitment/JobCreatePage';
import { CandidatesKanbanPage } from '../pages/recruitment/CandidatesKanbanPage';
import { CandidateDatabasePage } from '../pages/recruitment/CandidateDatabasePage';
import { ManpowerRequirementsPage } from '../pages/recruitment/ManpowerRequirementsPage';
import { JobRequisitionsPage } from '../pages/recruitment/JobRequisitionsPage';
import { ResumeManagementPage } from '../pages/recruitment/ResumeManagementPage';
import { ApplicationsPage } from '../pages/recruitment/ApplicationsPage';
import { ScreeningPage } from '../pages/recruitment/ScreeningPage';
import { InterviewsPage } from '../pages/recruitment/InterviewsPage';
import { InterviewEvaluationPage } from '../pages/recruitment/InterviewEvaluationPage';
import { OfferManagementPage } from '../pages/recruitment/OfferManagementPage';
import { RecruitmentPipelinePage } from '../pages/recruitment/RecruitmentPipelinePage';
import { RecruitmentAnalyticsPage } from '../pages/recruitment/RecruitmentAnalyticsPage';
import { OnboardingHandoverPage } from '../pages/recruitment/OnboardingHandoverPage';
import { RecruiterNotificationsPage } from '../pages/recruitment/RecruiterNotificationsPage';

// Performance & Operations
import { GoalsPage } from '../pages/performance/GoalsPage';
import { PerformanceReviewsPage } from '../pages/performance/PerformanceReviewsPage';
import { ExpensesPage } from '../pages/operations/ExpensesPage';
import { AssetsPage } from '../pages/operations/AssetsPage';
import { DocumentsPage } from '../pages/operations/DocumentsPage';
import { TrainingPage } from '../pages/operations/TrainingPage';

// Calendar, Reports, Settings & Support
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { HelpSupportPage } from '../pages/support/HelpSupportPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Standalone Full-Page Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Standalone Auth Routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/2fa" element={<TwoFactorPage />} />


      {/* Main SaaS & HRM Application Workspace (AppLayout) */}
      <Route element={<AppLayout />}>
        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/saas/dashboard" element={<DashboardPage forcedRole="saas_owner" />} />
        <Route path="/organization/dashboard" element={<DashboardPage forcedRole="org_admin" />} />
        <Route path="/hr/dashboard" element={<DashboardPage forcedRole="hr_admin" />} />
        <Route path="/hr-executive/dashboard" element={<DashboardPage forcedRole="hr_executive" />} />
        <Route path="/recruiter/dashboard" element={<DashboardPage forcedRole="recruiter" />} />
        <Route path="/payroll/dashboard" element={<DashboardPage forcedRole="payroll_admin" />} />
        <Route path="/manager/dashboard" element={<DashboardPage forcedRole="manager" />} />
        <Route path="/employee/dashboard" element={<DashboardPage forcedRole="employee" />} />

        {/* Work, Communication & Collaboration */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />

        {/* SaaS Specific Sub-pages */}
        <Route path="/saas" element={<DashboardPage forcedRole="saas_owner" />} />
        <Route path="/saas/modules" element={<SaasModulesPage />} />
        <Route path="/saas/modular-subscriptions" element={<Navigate to="/saas/modules" replace />} />
        <Route path="/saas/organizations" element={<SaasOrganizationsPage />} />
        <Route path="/saas/subscriptions" element={<SaasSubscriptionsPage />} />
        <Route path="/saas/plans" element={<SaasPlansPage />} />
        <Route path="/saas/billing" element={<SaasBillingInvoicesPage />} />
        <Route path="/saas/revenue" element={<SaasRevenueAnalyticsPage />} />
        <Route path="/saas/analytics" element={<SaasSystemAnalyticsPage />} />
        <Route path="/saas/audit-logs" element={<SaasAuditLogsPage />} />
        <Route path="/saas/settings" element={<SaasSettingsPage />} />

        {/* Employee Management & Profiles */}
        <Route path="/employees" element={<EmployeesListPage />} />
        <Route path="/employees/:id" element={<EmployeeProfilePage />} />
        <Route path="/profile" element={<EmployeeProfilePage />} />
        <Route path="/my-profile" element={<EmployeeProfilePage />} />
        <Route path="/employee/profile" element={<EmployeeProfilePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/designations" element={<DesignationsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/org-structure" element={<OrgStructurePage />} />

        {/* Time & Attendance */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/clock-in" element={<ClockInPage />} />
        <Route path="/shifts" element={<ShiftSchedulePage />} />
        <Route path="/timesheets" element={<TimesheetsPage />} />

        {/* Leave */}
        <Route path="/leave" element={<LeaveManagementPage />} />
        <Route path="/leave/requests" element={<LeaveRequestsPage />} />
        <Route path="/leave/balance" element={<LeaveBalancePage />} />
        <Route path="/leave/holidays" element={<HolidaysPage />} />

        {/* Payroll */}
        <Route path="/payroll" element={<PayrollDashboardPage />} />
        <Route path="/payroll/salary-structure" element={<SalaryStructurePage />} />
        <Route path="/payroll/payslips" element={<PayslipsPage />} />
        <Route path="/payroll/adjustments" element={<PayrollAdjustmentsPage />} />
        <Route path="/my-payroll" element={<PayslipsPage />} />

        {/* Recruiter / Talent Acquisition Dedicated Workspace */}
        <Route path="/recruiter/manpower-requirements" element={<ManpowerRequirementsPage />} />
        <Route path="/recruiter/requisitions" element={<JobRequisitionsPage />} />
        <Route path="/recruiter/requisitions/:id" element={<JobRequisitionsPage />} />
        <Route path="/recruiter/jobs" element={<JobOpeningsPage />} />
        <Route path="/recruiter/jobs/create" element={<JobCreatePage />} />
        <Route path="/recruiter/jobs/:id" element={<JobOpeningsPage />} />
        <Route path="/recruiter/candidates" element={<CandidateDatabasePage />} />
        <Route path="/recruiter/candidates/:id" element={<CandidateDatabasePage />} />
        <Route path="/recruiter/resumes" element={<ResumeManagementPage />} />
        <Route path="/recruiter/applications" element={<ApplicationsPage />} />
        <Route path="/recruiter/screening" element={<ScreeningPage />} />
        <Route path="/recruiter/interviews" element={<InterviewsPage />} />
        <Route path="/recruiter/interviews/calendar" element={<InterviewsPage />} />
        <Route path="/recruiter/evaluations" element={<InterviewEvaluationPage />} />
        <Route path="/recruiter/offers" element={<OfferManagementPage />} />
        <Route path="/recruiter/pipeline" element={<RecruitmentPipelinePage />} />
        <Route path="/recruiter/analytics" element={<RecruitmentAnalyticsPage />} />
        <Route path="/recruiter/joining" element={<OnboardingHandoverPage />} />
        <Route path="/recruiter/handover" element={<OnboardingHandoverPage />} />
        <Route path="/recruiter/notifications" element={<RecruiterNotificationsPage />} />

        {/* Recruitment / ATS Legacy & Inter-module Compatibility */}
        <Route path="/recruitment/jobs" element={<JobOpeningsPage />} />
        <Route path="/recruitment/candidates" element={<CandidateDatabasePage />} />
        <Route path="/recruitment/pipeline" element={<RecruitmentPipelinePage />} />
        <Route path="/recruitment/interviews" element={<InterviewsPage />} />

        {/* Performance & OKRs */}
        <Route path="/performance/goals" element={<GoalsPage />} />
        <Route path="/performance/reviews" element={<PerformanceReviewsPage />} />

        {/* Operations & Documents */}
        <Route path="/operations/expenses" element={<ExpensesPage />} />
        <Route path="/operations/assets" element={<AssetsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/my-assets" element={<AssetsPage />} />
        <Route path="/employee/assets" element={<AssetsPage />} />
        <Route path="/operations/documents" element={<DocumentsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/my-documents" element={<DocumentsPage />} />
        <Route path="/employee/documents" element={<DocumentsPage />} />
        <Route path="/operations/training" element={<TrainingPage />} />

        {/* Calendar, Reports, Settings & Support */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
