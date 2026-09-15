import React, { useState, useEffect } from 'react';
import { saasService } from '../../services/saasService';
import { Organization } from '../../types';
import {
  CorporateModule,
  CorporateModuleId,
  ModularSubscriptionConfig,
  ModuleBundlePreset,
} from '../../types/saasModules';
import {
  DataTable,
  Column,
  Badge,
  Button,
  Modal,
  Input,
  Select,
  Card,
} from '../../components/ui';
import {
  CreditCard,
  Building2,
  Boxes,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Sliders,
  TrendingUp,
  Download,
  ShieldCheck,
  Zap,
  Users,
  DollarSign,
  Layers,
  MessageSquare,
  Target,
  Briefcase,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const SaasModularSubscriptionsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [modules, setModules] = useState<CorporateModule[]>([]);
  const [presets, setPresets] = useState<ModuleBundlePreset[]>([]);
  const [subscriptions, setSubscriptions] = useState<ModularSubscriptionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Configuration State
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<CorporateModuleId[]>([]);
  const [selectedTier, setSelectedTier] = useState<'Custom' | 'Starter' | 'Business Pro' | 'Enterprise Suite'>('Custom');
  const [bundleName, setBundleName] = useState('Custom Modular Selection');
  const [seatQuotas, setSeatQuotas] = useState(100);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');
  const [subStatus, setSubStatus] = useState<'Active' | 'Trial' | 'Past Due' | 'Suspended'>('Active');
  const [modalPillarFilter, setModalPillarFilter] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const getPillarBreakdown = (moduleIds: CorporateModuleId[] = []) => {
    return {
      org: moduleIds.filter((id) => ['org_mgmt', 'document_mgmt'].includes(id)).length,
      people: moduleIds.filter((id) => ['recruitment_mgmt', 'employee_hr_mgmt'].includes(id)).length,
      finance: moduleIds.filter((id) => ['finance_mgmt', 'cost_center_profitability'].includes(id)).length,
      ops: moduleIds.filter((id) => ['crm_client_mgmt', 'project_task_mgmt', 'inventory_asset_mgmt', 'procurement_vendor_mgmt', 'helpdesk_ticketing'].includes(id)).length,
      comm: moduleIds.filter((id) => ['internal_chat_collaboration', 'email_client_integration'].includes(id)).length,
      control: moduleIds.filter((id) => ['performance_appraisal', 'training_lms', 'audit_compliance_security', 'bi_analytics_reporting'].includes(id)).length,
    };
  };

  const loadData = async () => {
    setLoading(true);
    const [orgList, modList, presetList, subList] = await Promise.all([
      saasService.getOrganizations(),
      saasService.getCorporateModules(),
      saasService.getModulePresets(),
      saasService.getModularSubscriptions(),
    ]);

    setOrganizations(orgList);
    setModules(modList);
    setPresets(presetList);
    setSubscriptions(subList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenConfig = (org: Organization) => {
    setSelectedOrg(org);
    const existingSub = subscriptions.find((s) => s.organizationId === org.id);

    if (existingSub) {
      setSelectedModuleIds(existingSub.subscribedModuleIds);
      setSelectedTier(existingSub.planTier);
      setBundleName(existingSub.bundleName || 'Custom Selection');
      setSeatQuotas(existingSub.seatQuotas);
      setBillingCycle(existingSub.billingCycle);
      setSubStatus(existingSub.status);
    } else {
      // Default fallback from org or all 17
      const fallbackIds = (org.subscribedModules || modules.map((m) => m.id)) as CorporateModuleId[];
      setSelectedModuleIds(fallbackIds);
      setSelectedTier(org.plan === 'Enterprise' ? 'Enterprise Suite' : 'Business Pro');
      setBundleName(org.plan === 'Enterprise' ? 'Full Corporate SaaS Enterprise Suite' : 'Custom Selection');
      setSeatQuotas(org.maxEmployees || 100);
      setBillingCycle('Monthly');
      setSubStatus('Active');
    }

    setIsConfigModalOpen(true);
  };

  const handleApplyPreset = (preset: ModuleBundlePreset) => {
    setSelectedModuleIds(preset.moduleIds);
    setBundleName(preset.name);
    setSelectedTier(preset.moduleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro');
    showToast(`Applied preset: ${preset.name}`);
  };

  const handleToggleModule = (id: CorporateModuleId) => {
    setBundleName('Custom Modular Selection');
    setSelectedTier('Custom');
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedModuleIds(modules.map((m) => m.id));
    setBundleName('Full Corporate SaaS Enterprise Suite');
    setSelectedTier('Enterprise Suite');
  };

  const handleClearAll = () => {
    setSelectedModuleIds([]);
    setBundleName('No Modules Selected');
    setSelectedTier('Custom');
  };

  // Calculate live total price
  const calculateTotalMonthly = (): number => {
    let baseSum = 0;
    selectedModuleIds.forEach((id) => {
      const mod = modules.find((m) => m.id === id);
      if (mod) baseSum += mod.basePriceMonthly;
    });

    // If matches a preset or all 17, give discount
    if (selectedModuleIds.length === 17) {
      return 3699;
    }
    return baseSum;
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;

    const totalFee = calculateTotalMonthly();

    const config: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: selectedTier,
      bundleName,
      subscribedModuleIds: selectedModuleIds,
      monthlyBaseFee: totalFee,
      monthlyTotalFee: totalFee,
      seatQuotas,
      billingCycle,
      status: subStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(config);
    setIsConfigModalOpen(false);
    showToast(`Saved modular subscription for ${selectedOrg.name} (${selectedModuleIds.length} modules)`);
    loadData();
  };

  // Pillars grouped for modal checklist
  const pillarGroups = [
    { pillar: 'Organization', mods: modules.filter((m) => m.pillar === 'Organization') },
    { pillar: 'People', mods: modules.filter((m) => m.pillar === 'People') },
    { pillar: 'Finance', mods: modules.filter((m) => m.pillar === 'Finance') },
    { pillar: 'Business & Operations', mods: modules.filter((m) => m.pillar === 'Business & Operations') },
    { pillar: 'Communication', mods: modules.filter((m) => m.pillar === 'Communication') },
    { pillar: 'Control & Intelligence', mods: modules.filter((m) => m.pillar === 'Control & Intelligence') },
  ];

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'Users':
        return <Users className="w-4 h-4 text-teal-600" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case 'Target':
        return <Target className="w-4 h-4 text-rose-600" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-cyan-600" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-violet-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-sky-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const columns: Column<Organization>[] = [
    {
      header: 'Organization',
      accessorKey: 'name',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.logo}
              alt={row.name}
              className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {row.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {row.industry} • {row.location}
              </p>
              {sub?.bundleName && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                  {sub.bundleName}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Subscribed Modules & Core Pillars',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const moduleIds = sub?.subscribedModuleIds || row.subscribedModules || [];
        const count = moduleIds.length;
        const p = getPillarBreakdown(moduleIds);
        return (
          <div className="space-y-1.5 min-w-[210px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {count} of 17 Modules
              </span>
              <Badge variant={count === 17 ? 'success' : count >= 8 ? 'primary' : 'neutral'} size="sm">
                {count === 17 ? 'Full Suite' : `${count} Active`}
              </Badge>
            </div>

            {/* Visual Mini Pillar Badges */}
            <div className="flex flex-wrap gap-1">
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.org > 0
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Building2 className="w-2.5 h-2.5" /> Org: {p.org}/2
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.people > 0
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Users className="w-2.5 h-2.5" /> People: {p.people}/2
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.finance > 0
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <DollarSign className="w-2.5 h-2.5" /> Fin: {p.finance}/2
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.ops > 0
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Layers className="w-2.5 h-2.5" /> Ops: {p.ops}/5
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.comm > 0
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <MessageSquare className="w-2.5 h-2.5" /> Comm: {p.comm}/2
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  p.control > 0
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Target className="w-2.5 h-2.5" /> AI: {p.control}/4
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Seat Quota',
      accessorKey: 'maxEmployees',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const quota = sub?.seatQuotas || row.maxEmployees;
        return (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {quota} Seats
          </span>
        );
      },
    },
    {
      header: 'Monthly Fee',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const fee = sub?.monthlyTotalFee || row.monthlyFee;
        return (
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(fee)} / mo
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const sub = subscriptions.find((s) => s.organizationId === row.id);
        const status = sub?.status || row.status;
        return (
          <Badge
            variant={status === 'Active' || status === 'active' ? 'success' : status === 'Trial' || status === 'trial' ? 'warning' : 'danger'}
            size="sm"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleOpenConfig(row)}
          leftIcon={<Sliders className="w-3.5 h-3.5" />}
          className="text-xs font-semibold text-blue-600"
        >
          Configure Modules
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Boxes className="w-6 h-6 text-blue-600" />
              Tenant Modular Subscriptions
            </h1>
            <Badge variant="primary" size="sm">
              SaaS Admin Control
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Empower SaaS owner to license, bundle, toggle or restrict any of the 17 Corporate SaaS modules per company.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Subscribed Tenants</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {organizations.length} Companies
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Provisioned</span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Full Enterprise Suites</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {subscriptions.filter((s) => s.subscribedModuleIds.length === 17).length} Tenants
          </p>
          <span className="text-[10px] text-slate-400">All 17 Modules Active</span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Active Modular MRR</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${subscriptions.reduce((sum, s) => sum + s.monthlyTotalFee, 0).toLocaleString()} / mo
          </p>
          <span className="text-[10px] text-slate-400">From dynamic subscriptions</span>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <span className="text-[11px] font-medium text-slate-500">Avg Modules / Tenant</span>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            13.4 Modules
          </p>
          <span className="text-[10px] text-slate-400">High platform stickiness</span>
        </Card>
      </div>

      {/* Preset Bundles Ribbon */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Enterprise Bundle Presets
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {presets.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card hover:border-blue-500 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {p.moduleIds.length} Modules
                </Badge>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ${p.recommendedMonthlyFee}/mo
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={organizations}
          searchKey="name"
          searchPlaceholder="Search tenant company by name..."
          pageSize={6}
        />
      </Card>

      {/* Modular Subscription Configuration Modal */}
      {selectedOrg && (
        <Modal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          title={`Configure Modular Subscription: ${selectedOrg.name}`}
          size="lg"
        >
          <form onSubmit={handleSaveSubscription} className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOrg.logo}
                  alt={selectedOrg.name}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedOrg.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedOrg.industry} • Contact: {selectedOrg.contactEmail}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Calculated Monthly Total
                </span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(calculateTotalMonthly())} <span className="text-xs font-normal">/ mo</span>
                </p>
              </div>
            </div>

            {/* Quick Bundle Buttons */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Apply Preset Bundle:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Select All (17/17)
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                      bundleName === preset.name
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.name} ({preset.moduleIds.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Quota & Billing Configuration */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-dark-border">
              <Input
                label="Seat Quotas (Employees)"
                type="number"
                value={seatQuotas}
                onChange={(e) => setSeatQuotas(parseInt(e.target.value) || 1)}
                required
              />

              <Select
                label="Billing Frequency"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as any)}
                options={[
                  { label: 'Monthly Billing', value: 'Monthly' },
                  { label: 'Annual Billing (Save 15%)', value: 'Annual' },
                ]}
              />

              <Select
                label="Subscription Status"
                value={subStatus}
                onChange={(e) => setSubStatus(e.target.value as any)}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Trial Period', value: 'Trial' },
                  { label: 'Past Due', value: 'Past Due' },
                  { label: 'Suspended', value: 'Suspended' },
                ]}
              />
            </div>

            {/* 17 Modules Checklist Grouped by Pillars */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Select Modules ({selectedModuleIds.length} of 17 Selected)
                </h4>

                {/* Pillar Filter Tabs inside modal */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
                  {[
                    { key: 'ALL', label: 'All 17' },
                    { key: 'Organization', label: 'Organization' },
                    { key: 'People', label: 'People' },
                    { key: 'Finance', label: 'Finance' },
                    { key: 'Business & Operations', label: 'Business & Ops' },
                    { key: 'Communication', label: 'Comm' },
                    { key: 'Control & Intelligence', label: 'AI & Control' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setModalPillarFilter(p.key)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition ${
                        modalPillarFilter === p.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[340px] overflow-y-auto space-y-3 pr-1 border border-slate-200 dark:border-dark-border rounded-xl p-3 bg-white dark:bg-dark-card">
                {pillarGroups
                  .filter((grp) => modalPillarFilter === 'ALL' || grp.pillar === modalPillarFilter)
                  .map((grp) => (
                    <div key={grp.pillar} className="space-y-1.5">
                      <div className="flex justify-between items-center border-b pb-1 border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-wider">
                          {grp.pillar} Pillar ({grp.mods.filter((m) => selectedModuleIds.includes(m.id)).length}/{grp.mods.length} Selected)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const allChecked = grp.mods.every((m) => selectedModuleIds.includes(m.id));
                            if (allChecked) {
                              setSelectedModuleIds((prev) =>
                                prev.filter((id) => !grp.mods.some((m) => m.id === id))
                              );
                            } else {
                              const toAdd = grp.mods
                                .map((m) => m.id)
                                .filter((id) => !selectedModuleIds.includes(id));
                              setSelectedModuleIds((prev) => [...prev, ...toAdd]);
                            }
                          }}
                          className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {grp.mods.every((m) => selectedModuleIds.includes(m.id))
                            ? 'Deselect Pillar'
                            : 'Select All in Pillar'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {grp.mods.map((mod) => {
                          const isChecked = selectedModuleIds.includes(mod.id);
                          return (
                            <label
                              key={mod.id}
                              className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                                isChecked
                                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
                                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleModule(mod.id)}
                                className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <div className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shrink-0 mt-0.5">
                                {getModuleIcon(mod.iconName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {mod.numericOrder}. {mod.name}
                                  </span>
                                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                                    ${mod.basePriceMonthly}/mo
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {mod.tagline}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  {mod.isKeyDifferentiator && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                      ★ Key Differentiator
                                    </span>
                                  )}
                                  {mod.isSeparateModule && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                      Separate Module
                                    </span>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsConfigModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Save Modular Entitlements
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
