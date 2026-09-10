import { User, UserRole, Organization } from '../types';
import { INITIAL_USERS, INITIAL_ORGANIZATIONS } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const authService = {
  getCurrentUser: (): User => {
    return getFromStorage<User>('current_user', INITIAL_USERS.find(u => u.role === 'hr_admin') || INITIAL_USERS[0]);
  },

  setCurrentUser: (user: User): void => {
    saveToStorage('current_user', user);
  },

  switchRole: async (role: UserRole): Promise<User> => {
    const users = getFromStorage<User[]>('users', INITIAL_USERS);
    const targetUser = users.find(u => u.role === role) || {
      ...INITIAL_USERS[0],
      role,
      id: `user-${role}`,
      name: `${role.replace('_', ' ').toUpperCase()} User`,
      email: `${role}@acmecorp.com`,
    };
    saveToStorage('current_user', targetUser);
    return targetUser;
  },

  switchOrganization: async (orgId: string): Promise<{ user: User; org: Organization }> => {
    const orgs = getFromStorage<Organization[]>('organizations', INITIAL_ORGANIZATIONS);
    const targetOrg = orgs.find(o => o.id === orgId) || orgs[0];
    const currentUser = authService.getCurrentUser();
    const updatedUser: User = {
      ...currentUser,
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
    };
    saveToStorage('current_user', updatedUser);
    return { user: updatedUser, org: targetOrg };
  },

  getAllDemoUsers: (): User[] => {
    return getFromStorage<User[]>('users', INITIAL_USERS);
  },

  getAllOrganizations: (): Organization[] => {
    return getFromStorage<Organization[]>('organizations', INITIAL_ORGANIZATIONS);
  },

  login: async (email: string, _password?: string): Promise<User> => {
    const users = getFromStorage<User[]>('users', INITIAL_USERS);
    const cleanEmail = email.trim().toLowerCase();
    
    // 1. Direct match by email
    let matched = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    // 2. If not matched, intelligently determine user role from email keywords
    if (!matched) {
      let assignedRole: UserRole = 'hr_admin';
      let designation = 'HR Director';
      let dept = 'Human Resources';
      let avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

      if (cleanEmail.includes('saas') || cleanEmail.includes('platform') || cleanEmail.includes('superadmin')) {
        assignedRole = 'saas_owner';
        designation = 'SaaS Platform Owner';
        dept = 'Platform Operations';
        avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('org_admin') || cleanEmail.includes('admin@') || cleanEmail.includes('director')) {
        assignedRole = 'org_admin';
        designation = 'Director of Operations';
        dept = 'Operations';
        avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('owner') || cleanEmail.includes('ceo')) {
        assignedRole = 'org_owner';
        designation = 'Chief Executive Officer';
        dept = 'Executive';
        avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('manager') || cleanEmail.includes('lead') || cleanEmail.includes('head')) {
        assignedRole = 'manager';
        designation = 'Engineering Manager';
        dept = 'Engineering';
        avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('payroll') || cleanEmail.includes('finance') || cleanEmail.includes('account')) {
        assignedRole = 'payroll_admin';
        designation = 'Payroll Manager';
        dept = 'Finance';
        avatar = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('recruit') || cleanEmail.includes('talent') || cleanEmail.includes('hiring')) {
        assignedRole = 'recruiter';
        designation = 'Lead Talent Recruiter';
        dept = 'Talent Acquisition';
        avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('employee') || cleanEmail.includes('staff') || cleanEmail.includes('developer') || cleanEmail.includes('engineer')) {
        assignedRole = 'employee';
        designation = 'Senior Software Engineer';
        dept = 'Engineering';
        avatar = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';
      } else if (cleanEmail.includes('exec') || cleanEmail.includes('associate')) {
        assignedRole = 'hr_executive';
        designation = 'HR Executive';
        dept = 'Human Resources';
        avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
      }

      const namePart = cleanEmail.split('@')[0] || 'User';
      const formattedName = namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      matched = {
        id: `user-${Date.now()}`,
        name: formattedName || 'HR Administrator',
        email: cleanEmail,
        role: assignedRole,
        avatar: avatar,
        organizationId: assignedRole === 'saas_owner' ? 'platform' : 'org-1',
        organizationName: assignedRole === 'saas_owner' ? 'HRM Platform HQ' : 'Acme Corp',
        departmentName: dept,
        designation: designation,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    saveToStorage('current_user', matched);
    return matched;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('hrm_current_user');
  }
};
