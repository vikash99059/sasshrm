import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saasService } from '../../services/saasService';
import { Organization } from '../../types';
import { CorporateModuleId, ModularSubscriptionConfig } from '../../types/saasModules';
import { DataTable, Column, Badge, Button, Modal, Input, Select, Card } from '../../components/ui';
import {
  Building2,
  Plus,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  ShieldCheck,
  Boxes,
  Users,
  DollarSign,
  Layers,
  MessageSquare,
  Target,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const SaasOrganizationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [subscriptions, setSubscriptions] = useState<ModularSubscriptionConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states - pure corporate organization details without rigid fixed plans
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('');
  const [seatQuota, setSeatQuota] = useState(100);
  const [status, setStatus] = useState<'active' | 'trial'>('active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    const [list, subs] = await Promise.all([
      saasService.getOrganizations(),
      saasService.getModularSubscriptions(),
    ]);
    setOrgs(list);
    setSubscriptions(subs);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate pillar coverage for an org
  const getOrgPillars = (moduleIds: CorporateModuleId[] = []) => {
    const orgPillarCount = moduleIds.filter((id) =>
      ['organization_management', 'document_management'].includes(id)
    ).length;
    const peoplePillarCount = moduleIds.filter((id) =>
      ['recruitment_management', 'employee_hr_management'].includes(id)
    ).length;
    const financePillarCount = moduleIds.filter((id) =>
      ['finance_management', 'business_costing_center'].includes(id)
    ).length;
    const businessPillarCount = moduleIds.filter((id) =>
      [
        'sales_crm',
        'project_task_management',
        'inventory_asset_management',
        'procurement_purchase',
        'customer_service_support',
      ].includes(id)
    ).length;
    const commPillarCount = moduleIds.filter((id) =>
      ['chat_communication', 'email_management'].includes(id)
    ).length;
    const controlPillarCount = moduleIds.filter((id) =>
      [
        'kpi_performance_management',
        'workflow_automation',
        'mis_analytics_dashboard',
        'ai_business_intelligence',
      ].includes(id)
    ).length;

    return {
      orgPillarCount,
      peoplePillarCount,
      financePillarCount,
      businessPillarCount,
      commPillarCount,
      controlPillarCount,
      totalPillarsActive: [
        orgPillarCount > 0,
        peoplePillarCount > 0,
        financePillarCount > 0,
        businessPillarCount > 0,
        commPillarCount > 0,
        controlPillarCount > 0,
      ].filter(Boolean).length,
    };
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim()) {
      showToast('Please fill in Company Name and Admin Email');
      return;
    }

    const created = await saasService.createOrganization({
      name,
      industry,
      contactPerson: contactPerson || 'Operations Lead',
      contactEmail,
      contactPhone: contactPhone || '+1 (555) 000-0000',
      location,
      website: website || `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
      maxEmployees: seatQuota,
      totalEmployees: 1,
      status,
      monthlyFee: 0,
      subscribedModules: [],
      plan: 'Corporate SaaS',
    });

    // Save initial subscription entry
    await saasService.saveModularSubscription({
      organizationId: created.id,
      organizationName: created.name,
      planTier: 'Custom',
      bundleName: 'Unassigned - Assign in Modules Hub',
      subscribedModuleIds: [],
      monthlyBaseFee: 0,
      monthlyTotalFee: 0,
      seatQuotas: seatQuota,
      billingCycle: 'Monthly',
      status: status === 'active' ? 'Active' : 'Trial',
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setIsModalOpen(false);
    showToast(`Organization "${created.name}" created! You can now assign modules in the Modules Hub.`);

    // Reset form
    setName('');
    setContactPerson('');
    setContactEmail('');
    setContactPhone('');
    setWebsite('');
    setSeatQuota(100);
    setStatus('active');

    await loadData();
  };

  const columns: Column<Organization>[] = [
    {
      header: 'Organization',
      accessorKey: 'name',
      className: 'min-w-[220px]',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.logo}
            alt={row.name}
            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight truncate">
              {row.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {row.industry} • {row.location}
            </p>
            {row.contactPerson && (
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                Admin: <span className="font-medium text-slate-700 dark:text-slate-300">{row.contactPerson}</span>
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Contact & Web',
      className: 'min-w-[170px]',
      cell: (row) => (
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[150px]">{row.contactEmail}</span>
          </div>
          {row.website && (
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <a
                href={row.website.startsWith('http') ? row.website : `https://${row.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate max-w-[140px]"
              >
                {row.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Corporate Modules & Pillars',
      className: 'min-w-[280px]',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const moduleIds = sub?.subscribedModuleIds || row.subscribedModules || [];
        const count = moduleIds.length;
        const pillars = getOrgPillars(moduleIds);

        return (
          <div className="space-y-1.5 py-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white whitespace-nowrap">
                {count} of 17 Modules
              </span>
              <Badge
                variant={count === 17 ? 'success' : count > 0 ? 'primary' : 'warning'}
                size="sm"
                className="whitespace-nowrap"
              >
                {count === 17 ? 'All 6 Pillars Active' : count > 0 ? `${pillars.totalPillarsActive}/6 Pillars Active` : 'No Modules'}
              </Badge>
            </div>

            {/* Symmetrical 3x2 Grid for 6 Core Pillars */}
            <div className="grid grid-cols-3 gap-1 max-w-[270px]">
              <span
                title="Organization Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.orgPillarCount > 0
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <Building2 className="w-2.5 h-2.5 shrink-0" /> Org: {pillars.orgPillarCount}/2
              </span>

              <span
                title="People Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.peoplePillarCount > 0
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <Users className="w-2.5 h-2.5 shrink-0" /> People: {pillars.peoplePillarCount}/2
              </span>

              <span
                title="Finance Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.financePillarCount > 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <DollarSign className="w-2.5 h-2.5 shrink-0" /> Finance: {pillars.financePillarCount}/2
              </span>

              <span
                title="Business Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.businessPillarCount > 0
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <Layers className="w-2.5 h-2.5 shrink-0" /> Business: {pillars.businessPillarCount}/5
              </span>

              <span
                title="Communication Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.commPillarCount > 0
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <MessageSquare className="w-2.5 h-2.5 shrink-0" /> Comm: {pillars.commPillarCount}/2
              </span>

              <span
                title="Control & Intelligence Pillar"
                className={`inline-flex items-center justify-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  pillars.controlPillarCount > 0
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-transparent'
                }`}
              >
                <Target className="w-2.5 h-2.5 shrink-0" /> Control: {pillars.controlPillarCount}/4
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Seat Quota',
      className: 'min-w-[130px]',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const quota = sub?.seatQuotas || row.maxEmployees;
        return (
          <div className="w-24 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
              <span>{row.totalEmployees}</span>
              <span className="text-slate-400 font-normal">/ {quota}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(6, Math.min(100, (row.totalEmployees / quota) * 100))}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Monthly Total',
      className: 'min-w-[110px]',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const fee = sub?.monthlyTotalFee || row.monthlyFee || 0;
        return (
          <div className="whitespace-nowrap">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {formatCurrency(fee)}
            </span>
            <span className="text-[10px] text-slate-400 block">/ month</span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      className: 'min-w-[100px]',
      cell: (row) => (
        <Badge
          variant={row.status === 'active' ? 'success' : row.status === 'trial' ? 'warning' : 'danger'}
          dot
          size="sm"
          className="whitespace-nowrap"
        >
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'min-w-[160px] text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <Link to={`/saas/modules?orgId=${row.id}`}>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Boxes className="w-3.5 h-3.5" />}
              title="Assign or customize modules for this organization"
              className="whitespace-nowrap"
            >
              Assign Modules
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-blue-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Tenant Organizations
            </h1>
            <Badge variant="primary">{orgs.length} Enrolled</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Provision corporate organizations with direct company details and assign modular enterprise features.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/saas/modules">
            <Button variant="outline" size="sm" leftIcon={<Boxes className="w-3.5 h-3.5" />}>
              Corporate Modules Hub
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Total Organizations</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {orgs.length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Modular Provisioned</span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Active Companies</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {orgs.filter((o) => o.status === 'active').length}
          </p>
          <span className="text-[10px] text-slate-400">
            {orgs.filter((o) => o.status === 'trial').length} on Trial
          </span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">All 6 Core Pillars (17/17)</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {subscriptions.filter((s) => s.subscribedModuleIds?.length === 17).length} Orgs
          </p>
          <span className="text-[10px] text-slate-400">All 6 Core Pillars Enabled</span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Total Modular MRR</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${subscriptions.reduce((sum, s) => sum + (s.monthlyTotalFee || 0), 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">From dynamic corporate modules</span>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={orgs}
          searchKey="name"
          searchPlaceholder="Search organization by name..."
          pageSize={6}
        />
      </Card>

      {/* Create Organization Modal - PURE CORPORATE DETAILS (No Rigid Fixed Plans) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Organization"
        description="Enter corporate company details. You will assign modular features directly to this organization."
        size="lg"
      >
        <form onSubmit={handleCreateOrg} className="space-y-4 text-xs">
          {/* Company Core Information */}
          <div className="space-y-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-dark-border">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Company Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Organization Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp, Zenith BioPharm"
                required
              />

              <Select
                label="Industry Domain"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={[
                  { value: 'Technology & Software', label: 'Technology & Software' },
                  { value: 'Financial Services & Fintech', label: 'Financial Services & Fintech' },
                  { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
                  { value: 'Manufacturing & Industrial', label: 'Manufacturing & Industrial' },
                  { value: 'Retail & E-Commerce', label: 'Retail & E-Commerce' },
                  { value: 'Logistics & Supply Chain', label: 'Logistics & Supply Chain' },
                  { value: 'Media, PR & Marketing', label: 'Media, PR & Marketing' },
                  { value: 'Professional Services & Legal', label: 'Professional Services & Legal' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Headquarters / Office Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Bengaluru, India"
                required
              />

              <Input
                label="Company Website / Domain"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://acmecorp.com"
              />
            </div>
          </div>

          {/* Primary Administrator Contact Details */}
          <div className="space-y-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-dark-border">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Primary Contact & Admin Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Admin Contact Person"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Jane Smith (VP People)"
              />

              <Input
                label="Official Admin Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admin@acmecorp.com"
                required
              />

              <Input
                label="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
              />
            </div>
          </div>

          {/* Quota & Status */}
          <div className="space-y-3 p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-dark-border">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-purple-600" />
              Seat Quota & Enrollment Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Allocated Employee Seat Quotas"
                type="number"
                value={seatQuota}
                onChange={(e) => setSeatQuota(parseInt(e.target.value) || 10)}
                required
              />

              <Select
                label="Enrollment Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: 'active', label: 'Active Subscription' },
                  { value: 'trial', label: '14-Day Free Evaluation Trial' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-dark-border">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Create Organization & Provision
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
