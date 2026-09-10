import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

// Import all dedicated role views
import { EmployeeDashboardView } from './views/EmployeeDashboardView';
import { ManagerDashboardView } from './views/ManagerDashboardView';
import { RecruiterDashboardView } from './views/RecruiterDashboardView';
import { PayrollAdminDashboardView } from './views/PayrollAdminDashboardView';
import { HrAdminDashboardView } from './views/HrAdminDashboardView';
import { HrExecutiveDashboardView } from './views/HrExecutiveDashboardView';
import { OrgAdminDashboardView } from './views/OrgAdminDashboardView';
import { SaasOwnerDashboardView } from './views/SaasOwnerDashboardView';

interface DashboardPageProps {
  forcedRole?: UserRole;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ forcedRole }) => {
  const { currentRole } = useAppStore();
  const location = useLocation();

  // Determine active dashboard role from route or prop or current user role
  const effectiveRole: UserRole = useMemo(() => {
    if (forcedRole) return forcedRole;

    const path = location.pathname.toLowerCase();
    if (path.includes('/saas')) return 'saas_owner';
    if (path.includes('/organization')) return 'org_admin';
    if (path.includes('/hr-executive')) return 'hr_executive';
    if (path.includes('/hr')) return 'hr_admin';
    if (path.includes('/recruiter')) return 'recruiter';
    if (path.includes('/payroll')) return 'payroll_admin';
    if (path.includes('/manager')) return 'manager';
    if (path.includes('/employee')) return 'employee';

    return currentRole || 'employee';
  }, [forcedRole, location.pathname, currentRole]);

  // Render role-specific dashboard view
  const renderDashboardView = () => {
    switch (effectiveRole) {
      case 'saas_owner':
        return <SaasOwnerDashboardView />;
      case 'org_owner':
      case 'org_admin':
        return <OrgAdminDashboardView />;
      case 'hr_admin':
        return <HrAdminDashboardView />;
      case 'hr_executive':
        return <HrExecutiveDashboardView />;
      case 'recruiter':
        return <RecruiterDashboardView />;
      case 'payroll_admin':
        return <PayrollAdminDashboardView />;
      case 'manager':
        return <ManagerDashboardView />;
      case 'employee':
      default:
        return <EmployeeDashboardView />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Render the Active Persona's True Role Dashboard */}
      {renderDashboardView()}
    </div>
  );
};

export default DashboardPage;
