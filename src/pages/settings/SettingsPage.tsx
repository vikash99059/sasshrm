import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card, CardHeader, CardTitle, Button, Badge, Tabs, Input, Select } from '../../components/ui';
import {
  Settings,
  Shield,
  Building,
  Bell,
  Lock,
  Key,
  CheckCircle2,
  Sliders,
  Users,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentOrg, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('permissions');

  // Org Profile State
  const [companyName, setCompanyName] = useState(currentOrg?.name || 'Acme Corp');
  const [industry, setIndustry] = useState(currentOrg?.industry || 'Technology & Software');
  const [contactEmail, setContactEmail] = useState(currentOrg?.contactEmail || 'admin@acmecorp.com');
  const [contactPhone, setContactPhone] = useState(currentOrg?.contactPhone || '+1 (555) 234-5678');
  const [website, setWebsite] = useState(currentOrg?.website || 'https://acmecorp.example.com');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Granular Role-Permission Matrix State (Matching Reference)
  const [permissionsMatrix, setPermissionsMatrix] = useState([
    { role: 'SaaS Platform Owner', count: '128 permissions', allAccess: true, canEdit: true },
    { role: 'Organization Admin', count: '96 permissions', allAccess: true, canEdit: true },
    { role: 'HR Administrator', count: '74 permissions', allAccess: false, canEdit: true },
    { role: 'HR Executive', count: '48 permissions', allAccess: false, canEdit: true },
    { role: 'Talent Recruiter', count: '32 permissions', allAccess: false, canEdit: true },
    { role: 'Payroll Specialist', count: '28 permissions', allAccess: false, canEdit: true },
    { role: 'Team Manager', count: '24 permissions', allAccess: false, canEdit: true },
    { role: 'Employee (ESS)', count: '12 permissions', allAccess: false, canEdit: false },
  ]);

  const settingsTabs = [
    { id: 'permissions', label: 'Roles & Permissions', icon: <Shield className="h-4 w-4" /> },
    { id: 'company', label: 'Company Profile', icon: <Building className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security & 2FA', icon: <Lock className="h-4 w-4" /> },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTogglePermission = (index: number) => {
    const next = [...permissionsMatrix];
    next[index].canEdit = !next[index].canEdit;
    setPermissionsMatrix(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings & Permissions Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure organization branding, granular role-permission access matrices, and security protocols.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="h-4 w-4" /> Saved Successfully!
          </div>
        )}
      </div>

      <Tabs
        tabs={settingsTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* Tab 1: Roles & Permissions Matrix (Matching Reference Screenshot) */}
      {activeTab === 'permissions' && (
        <Card className="space-y-6">
          <CardHeader>
            <div>
              <CardTitle>Role-Based Access Control (RBAC) Matrix</CardTitle>
              <p className="text-xs text-slate-500">Configure feature access toggles for all 9 organizational roles</p>
            </div>
            <Button size="sm" onClick={() => alert('New custom role creator modal initialized!')}>
              Create Custom Role
            </Button>
          </CardHeader>

          <div className="divide-y divide-slate-100 dark:divide-dark-border">
            {permissionsMatrix.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.role}</h4>
                    <p className="text-[11px] text-slate-400">{item.count}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.allAccess && (
                    <Badge variant="primary" size="sm">Full Administrative Access</Badge>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.canEdit}
                      onChange={() => handleTogglePermission(idx)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 2: Company Profile */}
      {activeTab === 'company' && (
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Organization Legal Profile</CardTitle>
          </CardHeader>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <Input
              label="Legal Organization Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Industry Domain"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Input
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Official Contact Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <Input
                label="Official Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <Button type="submit" size="sm" leftIcon={<Save className="h-4 w-4" />}>
              Save Company Settings
            </Button>
          </form>
        </Card>
      )}

      {/* Tab 3: Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>

          <div className="space-y-4 text-xs">
            {[
              { title: 'Leave Application & Approvals', desc: 'Notify HR and managers when an employee submits or updates time off.' },
              { title: 'Attendance Check-In Reminders', desc: 'Daily push reminder at 9:00 AM for staff to clock in.' },
              { title: 'Monthly Payroll Batch Alerts', desc: 'Alert finance admins when monthly salary drafts are computed.' },
              { title: 'Candidate Interview Reminders', desc: 'Send calendar invite 15 minutes before scheduled video interview.' },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-dark-border">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                  <p className="text-slate-400 mt-0.5">{notif.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Security & Authentication Policies</CardTitle>
          </CardHeader>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 flex items-start gap-3">
              <Key className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Enforce Two-Factor Authentication (2FA)</h4>
                <p className="text-slate-500 mt-0.5">Require all administrators and managers to verify with an authenticator app upon sign-in.</p>
                <Button size="sm" variant="primary" className="mt-3">
                  Enable 2FA Enforcement
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Input label="Session Idle Timeout (Minutes)" type="number" defaultValue={30} />
              <Input label="Maximum Password Age (Days)" type="number" defaultValue={90} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
