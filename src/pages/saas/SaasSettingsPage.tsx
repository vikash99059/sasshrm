import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Mail,
  CreditCard,
  Key,
  Database,
  Lock,
  Server,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Card, Button, Input, Select } from '../../components/ui';

export const SaasSettingsPage: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            SaaS Platform System Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure payment gateways, automated billing schedules, email servers, and global platform security.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Stripe Gateway Configuration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Stripe & Payment Gateway</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Stripe Publishable Key" defaultValue="pk_live_51M0...92Kx" type="password" required />
            <Input label="Stripe Secret Key" defaultValue="sk_live_51M0...01Zz" type="password" required />
            <Input label="Webhook Secret (Signing)" defaultValue="whsec_89...11A" type="password" required />
            <Select
              label="Default Currency"
              options={[
                { value: 'usd', label: 'USD ($) — United States Dollar' },
                { value: 'eur', label: 'EUR (€) — Euro' },
                { value: 'gbp', label: 'GBP (£) — British Pound' },
              ]}
            />
          </div>
        </div>

        {/* Global Security & Multi-Tenancy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Security & Multi-Tenant Routing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Base SaaS Domain" defaultValue="saas-hrm.com" required />
            <Select
              label="Enforce Tenant 2FA"
              options={[
                { value: 'optional', label: 'Optional (Tenant Admin Chooses)' },
                { value: 'mandatory', label: 'Mandatory for All Organizations' },
                { value: 'admin_only', label: 'Mandatory for Admins Only' },
              ]}
            />
            <Select
              label="Automated Database Backup"
              options={[
                { value: 'hourly', label: 'Continuous WAL + Daily Full Snapshot' },
                { value: 'daily', label: 'Every 24 Hours' },
              ]}
            />
            <Select
              label="Platform Maintenance Mode"
              options={[
                { value: 'off', label: 'Disabled (Normal Operation)' },
                { value: 'on', label: 'Enabled (Read-Only Banner)' },
              ]}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
export default SaasSettingsPage;
