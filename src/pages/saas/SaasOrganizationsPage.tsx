import React, { useState, useEffect } from 'react';
import { saasService } from '../../services/saasService';
import { Organization } from '../../types';
import { DataTable, Column, Badge, Button, Modal, Input, Select } from '../../components/ui';
import { Building2, Plus, Globe, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const SaasOrganizationsPage: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [plan, setPlan] = useState<'Basic' | 'Pro' | 'Business' | 'Enterprise'>('Pro');
  const [contactEmail, setContactEmail] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');

  const loadOrgs = async () => {
    const list = await saasService.getOrganizations();
    setOrgs(list);
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    await saasService.createOrganization({
      name,
      industry,
      plan,
      contactEmail,
      location,
      maxEmployees: plan === 'Basic' ? 25 : plan === 'Pro' ? 100 : plan === 'Business' ? 250 : 1000,
      monthlyFee: plan === 'Basic' ? 299 : plan === 'Pro' ? 699 : plan === 'Business' ? 1499 : 3999,
    });
    setIsModalOpen(false);
    setName('');
    setContactEmail('');
    loadOrgs();
  };

  const columns: Column<Organization>[] = [
    {
      header: 'Organization',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.logo} alt={row.name} className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-[11px] text-slate-400">{row.industry} • {row.location}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plan Tier',
      accessorKey: 'plan',
      cell: (row) => (
        <Badge variant={row.plan === 'Enterprise' ? 'primary' : row.plan === 'Business' ? 'info' : 'neutral'}>
          {row.plan}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'trial' ? 'warning' : 'danger'} dot>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Seats Used',
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>{row.totalEmployees}</span>
            <span className="text-slate-400">/ {row.maxEmployees}</span>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min(100, (row.totalEmployees / row.maxEmployees) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Monthly Fee',
      cell: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(row.monthlyFee)}</span>
      ),
    },
    {
      header: 'Created On',
      accessorKey: 'createdAt',
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tenant Organizations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage multi-tenant SaaS companies, subscriber tier limits, and tenant provisioning.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Provision New Tenant
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={orgs}
        searchKey="name"
        searchPlaceholder="Search organizations by name..."
        pageSize={6}
      />

      {/* Provision New Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New Tenant Organization"
        description="Configure organization details, admin contact, and subscription plan tier."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateOrg}>
              Provision Tenant
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <Input
            label="Organization Legal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Corporation"
            required
          />
          <Input
            label="Contact Admin Email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="admin@acmecorp.com"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Subscription Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              options={[
                { value: 'Basic', label: 'Basic ($299/mo)' },
                { value: 'Pro', label: 'Pro ($699/mo)' },
                { value: 'Business', label: 'Business ($1,499/mo)' },
                { value: 'Enterprise', label: 'Enterprise ($3,999/mo)' },
              ]}
            />
            <Input
              label="Primary Office Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
          <Select
            label="Industry Domain"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            options={[
              { value: 'Technology & Software', label: 'Technology & Software' },
              { value: 'Financial Services', label: 'Financial Services' },
              { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
              { value: 'Marketing & Media', label: 'Marketing & Media' },
              { value: 'Manufacturing', label: 'Manufacturing' },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
