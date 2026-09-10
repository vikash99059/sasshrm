import { Organization, SubscriptionPlan, AuditLog } from '../types';
import { INITIAL_ORGANIZATIONS, INITIAL_AUDIT_LOGS } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const saasService = {
  getStats: async () => {
    return {
      totalOrganizations: 48,
      activeOrganizations: 42,
      trialOrganizations: 6,
      totalUsers: 3248,
      monthlyRevenue: 48290,
      annualRevenue: 579480,
      activeSubscriptions: 42,
      churnRate: '1.2%',
      revenueGrowth: [
        { month: 'Jan', revenue: 38200 },
        { month: 'Feb', revenue: 40500 },
        { month: 'Mar', revenue: 42800 },
        { month: 'Apr', revenue: 45600 },
        { month: 'May', revenue: 48290 },
      ],
      planDistribution: [
        { name: 'Enterprise', value: 35, count: 15, color: '#3B82F6' },
        { name: 'Business', value: 40, count: 17, color: '#10B981' },
        { name: 'Pro', value: 15, count: 6, color: '#F59E0B' },
        { name: 'Basic', value: 10, count: 4, color: '#8B5CF6' },
      ],
      systemHealth: [
        { service: 'API Services', status: 'Online', latency: '42ms' },
        { service: 'Database Cluster', status: 'Online', latency: '12ms' },
        { service: 'Storage (S3)', status: 'Online', latency: '65ms' },
        { service: 'CDN & Edge', status: 'Online', latency: '18ms' },
      ]
    };
  },

  getOrganizations: async (): Promise<Organization[]> => {
    return getFromStorage<Organization[]>('organizations', INITIAL_ORGANIZATIONS);
  },

  createOrganization: async (data: Partial<Organization>): Promise<Organization> => {
    const list = getFromStorage<Organization[]>('organizations', INITIAL_ORGANIZATIONS);
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: data.name || 'New Organization',
      slug: (data.name || 'new-org').toLowerCase().replace(/\s+/g, '-'),
      logo: data.logo || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
      plan: data.plan || 'Pro',
      status: data.status || 'active',
      industry: data.industry || 'Technology',
      totalEmployees: data.totalEmployees || 10,
      maxEmployees: data.maxEmployees || 100,
      contactEmail: data.contactEmail || 'admin@neworg.com',
      contactPhone: data.contactPhone || '+1 (555) 000-0000',
      location: data.location || 'New York, NY',
      website: data.website || 'https://example.com',
      createdAt: new Date().toISOString().split('T')[0],
      billingCycle: data.billingCycle || 'monthly',
      monthlyFee: data.monthlyFee || 699,
    };
    const updated = [newOrg, ...list];
    saveToStorage('organizations', updated);
    return newOrg;
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    return [
      {
        id: 'plan-basic',
        name: 'Basic',
        priceMonthly: 299,
        priceAnnual: 249,
        maxEmployees: 25,
        features: ['Up to 25 Employees', 'Attendance Tracking', 'Leave Management', 'Basic Reports', 'Email Support'],
      },
      {
        id: 'plan-pro',
        name: 'Pro',
        priceMonthly: 699,
        priceAnnual: 599,
        maxEmployees: 100,
        popular: true,
        features: ['Up to 100 Employees', 'All Basic features', 'Full Payroll Processing', 'Recruitment ATS', 'Performance & OKRs', 'Priority Support'],
      },
      {
        id: 'plan-business',
        name: 'Business',
        priceMonthly: 1499,
        priceAnnual: 1299,
        maxEmployees: 250,
        features: ['Up to 250 Employees', 'All Pro features', 'Custom Approval Workflows', 'Asset Management', 'Document Locker', 'Dedicated Account Manager'],
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise',
        priceMonthly: 3999,
        priceAnnual: 3499,
        maxEmployees: 1000,
        features: ['Unlimited Employees', 'All Business features', 'Custom SLA & SOC2', 'Custom API & SSO/SAML', 'Dedicated Server Cluster', '24/7 Phone Support'],
      },
    ];
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    return getFromStorage<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
  }
};
