import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { saasService } from '../../services/saasService';
import { Organization } from '../../types';
import {
  CorporateModule,
  CorporateModuleId,
  CorporatePillar,
  ModularSubscriptionConfig,
} from '../../types/saasModules';
import { Card, Button, Badge, Modal, Input, Select } from '../../components/ui';
import {
  Boxes,
  Building2,
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Layers,
  CreditCard,
  Package,
  HelpCircle,
  Mail,
  MessageSquare,
  FileText,
  Award,
  Sparkles,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Plus,
  Sliders,
  SlidersHorizontal,
  RotateCcw,
  X,
  UserCheck,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

export const SaasModulesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orgIdFromUrl = searchParams.get('orgId');

  const [pageViewMode, setPageViewMode] = useState<'all_modules' | 'assign_org'>(
    orgIdFromUrl ? 'assign_org' : 'all_modules'
  );
  const [modules, setModules] = useState<CorporateModule[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [subscriptions, setSubscriptions] = useState<ModularSubscriptionConfig[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'differentiator' | 'separate'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under200' | '200to300' | 'over300'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'price_asc' | 'price_desc' | 'features'>('order');
  const [selectedModule, setSelectedModule] = useState<CorporateModule | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [submoduleDrawerModule, setSubmoduleDrawerModule] = useState<CorporateModule | null>(null);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    const [mods, orgsList, subsList] = await Promise.all([
      saasService.getCorporateModules(),
      saasService.getOrganizations(),
      saasService.getModularSubscriptions(),
    ]);

    setModules(mods);
    setOrganizations(orgsList);
    setSubscriptions(subsList);

    if (orgIdFromUrl && orgsList.some((o) => o.id === orgIdFromUrl)) {
      setSelectedOrgId(orgIdFromUrl);
    } else if (orgsList.length > 0) {
      setSelectedOrgId(orgsList[0].id);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orgIdFromUrl]);

  // Current selected organization
  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
  const currentOrgSub = subscriptions.find((s) => s.organizationId === selectedOrgId);
  const assignedModuleIds: CorporateModuleId[] =
    currentOrgSub?.subscribedModuleIds || selectedOrg?.subscribedModules || [];

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    setSearchParams({ orgId });
  };

  // The 6 Core Pillars definition
  const CORE_PILLARS = [
    {
      pillar: 'Organization' as CorporatePillar,
      label: 'Organization',
      count: 2,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/70 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900/50',
      tagline: 'Multi-branch corporate governance, designation hierarchies & digital documents',
    },
    {
      pillar: 'People' as CorporatePillar,
      label: 'People',
      count: 2,
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50/70 dark:bg-teal-950/30',
      border: 'border-teal-200 dark:border-teal-900/50',
      tagline: 'Recruitment ATS talent pipeline & complete employee HRMS lifecycle',
    },
    {
      pillar: 'Finance' as CorporatePillar,
      label: 'Finance',
      count: 2,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      tagline: 'Corporate accounting & 8-dimension cost center profitability forecasts',
    },
    {
      pillar: 'Business & Operations' as CorporatePillar,
      label: 'Business',
      count: 5,
      icon: Layers,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50/70 dark:bg-cyan-950/30',
      border: 'border-cyan-200 dark:border-cyan-900/50',
      tagline: 'Sales CRM, multi-stage projects, procurement vendors, inventory & IT helpdesk',
    },
    {
      pillar: 'Communication' as CorporatePillar,
      label: 'Communication',
      count: 2,
      icon: MessageSquare,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50/70 dark:bg-sky-950/30',
      border: 'border-sky-200 dark:border-sky-900/50',
      tagline: 'Omnichannel internal chat, team collaboration channels & email integration',
    },
    {
      pillar: 'Control & Intelligence' as CorporatePillar,
      label: 'Control & Intelligence',
      count: 4,
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50/70 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-900/50',
      tagline: 'Performance OKRs, LMS training, audit compliance security & predictive BI AI',
    },
  ];

  const getPillarSummary = (moduleIds: CorporateModuleId[]) => {
    let completeCount = 0;
    CORE_PILLARS.forEach((p) => {
      const pMods = modules.filter((m) => m.pillar === p.pillar);
      if (pMods.length > 0 && pMods.every((m) => moduleIds.includes(m.id))) {
        completeCount++;
      }
    });
    if (completeCount === 6) return 'All 6 Core Pillars Active';
    if (completeCount > 0) return `${completeCount}/6 Core Pillars Active`;
    if (moduleIds.length > 0) return `${moduleIds.length} Core Modules Active`;
    return 'No Pillars Active';
  };

  // Toggle single module assignment for current selected organization
  const handleToggleModuleForOrg = async (moduleId: CorporateModuleId) => {
    if (!selectedOrg) return;

    const isAssigned = assignedModuleIds.includes(moduleId);
    const newModuleIds = isAssigned
      ? assignedModuleIds.filter((id) => id !== moduleId)
      : [...assignedModuleIds, moduleId];

    let newFee = 0;
    newModuleIds.forEach((id) => {
      const m = modules.find((mod) => mod.id === id);
      if (m) newFee += m.basePriceMonthly;
    });
    if (newModuleIds.length === 17) newFee = 3699;

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: newModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro',
      bundleName: getPillarSummary(newModuleIds),
      subscribedModuleIds: newModuleIds,
      monthlyBaseFee: newFee,
      monthlyTotalFee: newFee,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);

    const modName = modules.find((m) => m.id === moduleId)?.name || moduleId;
    showToast(
      isAssigned
        ? `Removed "${modName}" from ${selectedOrg.name}`
        : `Assigned "${modName}" to ${selectedOrg.name}!`
    );
  };

  const isSubModuleDisabled = (moduleId: string, subName: string) => {
    const disabledMap = currentOrgSub?.disabledSubModules || selectedOrg?.disabledSubModules || {};
    const disabledList = disabledMap[moduleId] || [];
    return disabledList.includes(subName);
  };

  const handleToggleSubModule = async (moduleId: string, subName: string) => {
    if (!selectedOrg) return;

    const currentDisabledMap = currentOrgSub?.disabledSubModules || selectedOrg?.disabledSubModules || {};
    const currentList = currentDisabledMap[moduleId] || [];
    const isCurrentlyDisabled = currentList.includes(subName);

    let updatedList: string[];
    if (isCurrentlyDisabled) {
      updatedList = currentList.filter((s) => s !== subName);
    } else {
      updatedList = [...currentList, subName];
    }

    const updatedDisabledMap = {
      ...currentDisabledMap,
      [moduleId]: updatedList,
    };

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: currentOrgSub?.planTier || (assignedModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro'),
      bundleName: currentOrgSub?.bundleName || getPillarSummary(assignedModuleIds),
      subscribedModuleIds: assignedModuleIds,
      disabledSubModules: updatedDisabledMap,
      monthlyBaseFee: currentOrgSub?.monthlyBaseFee || 0,
      monthlyTotalFee: currentOrgSub?.monthlyTotalFee || 0,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);

    showToast(
      isCurrentlyDisabled
        ? `Enabled submodule "${subName}" for ${selectedOrg.name}`
        : `Disabled submodule "${subName}" for ${selectedOrg.name}`
    );
  };

  const handleEnableAllSubModules = async (mod: CorporateModule) => {
    if (!selectedOrg) return;

    const currentDisabledMap = currentOrgSub?.disabledSubModules || selectedOrg?.disabledSubModules || {};
    const updatedDisabledMap = {
      ...currentDisabledMap,
      [mod.id]: [],
    };

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: currentOrgSub?.planTier || (assignedModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro'),
      bundleName: currentOrgSub?.bundleName || getPillarSummary(assignedModuleIds),
      subscribedModuleIds: assignedModuleIds,
      disabledSubModules: updatedDisabledMap,
      monthlyBaseFee: currentOrgSub?.monthlyBaseFee || 0,
      monthlyTotalFee: currentOrgSub?.monthlyTotalFee || 0,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);
    showToast(`Enabled all submodules of ${mod.name} for ${selectedOrg.name}`);
  };

  const handleDisableAllSubModules = async (mod: CorporateModule) => {
    if (!selectedOrg) return;

    const allSubNames = mod.subModules || mod.featureGroups.flatMap((g) => g.items);
    const currentDisabledMap = currentOrgSub?.disabledSubModules || selectedOrg?.disabledSubModules || {};
    const updatedDisabledMap = {
      ...currentDisabledMap,
      [mod.id]: allSubNames,
    };

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: currentOrgSub?.planTier || (assignedModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro'),
      bundleName: currentOrgSub?.bundleName || getPillarSummary(assignedModuleIds),
      subscribedModuleIds: assignedModuleIds,
      disabledSubModules: updatedDisabledMap,
      monthlyBaseFee: currentOrgSub?.monthlyBaseFee || 0,
      monthlyTotalFee: currentOrgSub?.monthlyTotalFee || 0,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);
    showToast(`Disabled all submodules of ${mod.name} for ${selectedOrg.name}`);
  };

  // 1-Click Toggle an entire Core Pillar for the selected organization
  const handleTogglePillarForOrg = async (pillarName: CorporatePillar) => {
    if (!selectedOrg) return;

    const pillarMods = modules.filter((m) => m.pillar === pillarName).map((m) => m.id);
    const allAssigned = pillarMods.every((id) => assignedModuleIds.includes(id));

    let newModuleIds: CorporateModuleId[] = [];
    if (allAssigned) {
      newModuleIds = assignedModuleIds.filter((id) => !pillarMods.includes(id));
    } else {
      const toAdd = pillarMods.filter((id) => !assignedModuleIds.includes(id));
      newModuleIds = [...assignedModuleIds, ...toAdd];
    }

    let newFee = 0;
    newModuleIds.forEach((id) => {
      const m = modules.find((mod) => mod.id === id);
      if (m) newFee += m.basePriceMonthly;
    });
    if (newModuleIds.length === 17) newFee = 3699;

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: newModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro',
      bundleName: getPillarSummary(newModuleIds),
      subscribedModuleIds: newModuleIds,
      monthlyBaseFee: newFee,
      monthlyTotalFee: newFee,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);

    showToast(
      allAssigned
        ? `Removed ${pillarName} Pillar modules from ${selectedOrg.name}`
        : `Assigned all ${pillarName} Pillar modules to ${selectedOrg.name}!`
    );
  };

  // 1-Click Assign All 6 Core Pillars
  const handleSelectAllPillars = async () => {
    if (!selectedOrg) return;
    const allModuleIds = modules.map((m) => m.id);
    const fee = 3699;

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: 'Enterprise Suite',
      bundleName: 'All 6 Core Pillars Active',
      subscribedModuleIds: allModuleIds,
      monthlyBaseFee: fee,
      monthlyTotalFee: fee,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);
    showToast(`Assigned all 6 Core Pillars to ${selectedOrg.name}!`);
  };

  // 1-Click Clear all pillars/modules for the selected organization
  const handleClearAllPillars = async () => {
    if (!selectedOrg) return;

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: 'Business Pro',
      bundleName: 'No Pillars Active',
      subscribedModuleIds: [],
      monthlyBaseFee: 0,
      monthlyTotalFee: 0,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    showToast(`Cleared all pillars for ${selectedOrg.name}.`);
  };

  // Preset Bundles application handler
  const handleApplyPresetBundle = async (presetModuleIds: CorporateModuleId[], presetName: string) => {
    if (!selectedOrg) return;

    let fee = 0;
    presetModuleIds.forEach((id) => {
      const m = modules.find((mod) => mod.id === id);
      if (m) fee += m.basePriceMonthly;
    });
    if (presetModuleIds.length === 17) fee = 3699;

    const updatedConfig: ModularSubscriptionConfig = {
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      planTier: presetModuleIds.length === 17 ? 'Enterprise Suite' : 'Business Pro',
      bundleName: presetName,
      subscribedModuleIds: presetModuleIds,
      monthlyBaseFee: fee,
      monthlyTotalFee: fee,
      seatQuotas: currentOrgSub?.seatQuotas || selectedOrg.maxEmployees || 100,
      billingCycle: currentOrgSub?.billingCycle || 'Monthly',
      status: currentOrgSub?.status || 'Active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await saasService.saveModularSubscription(updatedConfig);
    const updatedSubs = await saasService.getModularSubscriptions();
    const updatedOrgs = await saasService.getOrganizations();
    setSubscriptions(updatedSubs);
    setOrganizations(updatedOrgs);
    showToast(`Applied preset "${presetName}" to ${selectedOrg.name}!`);
  };

  const PILLARS_FILTER_TABS: { key: string; label: string; count: number; assignedCount: number }[] = [
    {
      key: 'ALL',
      label: 'All 17 Modules',
      count: modules.length,
      assignedCount: assignedModuleIds.length,
    },
    ...CORE_PILLARS.map((p) => {
      const pMods = modules.filter((m) => m.pillar === p.pillar);
      const assigned = pMods.filter((m) => assignedModuleIds.includes(m.id)).length;
      return {
        key: p.pillar,
        label: p.label,
        count: p.count,
        assignedCount: assigned,
      };
    }),
  ];

  const hasActiveFilters =
    selectedPillar !== 'ALL' ||
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    priceFilter !== 'all' ||
    sortBy !== 'order';

  const resetAllFilters = () => {
    setSelectedPillar('ALL');
    setSearchQuery('');
    setTypeFilter('all');
    setPriceFilter('all');
    setSortBy('order');
  };

  // Filter and sort modules for Catalog view
  const catalogFilteredModules = modules
    .filter((m) => {
      // 1. Pillar filter
      if (selectedPillar !== 'ALL' && m.pillar !== selectedPillar) return false;

      // 2. Type filter
      if (typeFilter === 'differentiator' && !m.isKeyDifferentiator) return false;
      if (typeFilter === 'separate' && !m.isSeparateModule) return false;

      // 3. Price filter
      if (priceFilter === 'under200' && m.basePriceMonthly >= 200) return false;
      if (priceFilter === '200to300' && (m.basePriceMonthly < 200 || m.basePriceMonthly > 300)) return false;
      if (priceFilter === 'over300' && m.basePriceMonthly <= 300) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchPillar = m.pillar.toLowerCase().includes(q);
        const matchFeatures = m.featureGroups.some((g) =>
          g.groupName.toLowerCase().includes(q) ||
          g.items.some((i) => i.toLowerCase().includes(q))
        );
        if (!matchName && !matchDesc && !matchPillar && !matchFeatures) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.basePriceMonthly - b.basePriceMonthly;
      if (sortBy === 'price_desc') return b.basePriceMonthly - a.basePriceMonthly;
      if (sortBy === 'features') return b.subFeaturesCount - a.subFeaturesCount;
      return a.numericOrder - b.numericOrder;
    });

  // Filter modules for Assignment view
  const assignmentFilteredModules = modules.filter((m) => {
    const matchPillar = selectedPillar === 'ALL' || m.pillar === selectedPillar;
    const matchQuery =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.featureGroups.some((g) =>
        g.items.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchPillar && matchQuery;
  });

  const catalogPillarsToDisplay = CORE_PILLARS.filter((p) => {
    if (selectedPillar !== 'ALL' && p.pillar !== selectedPillar) return false;
    return catalogFilteredModules.some((m) => m.pillar === p.pillar);
  });

  const assignmentPillarsToDisplay =
    selectedPillar === 'ALL'
      ? CORE_PILLARS
      : CORE_PILLARS.filter((p) => p.pillar === selectedPillar);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Target':
        return <Target className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'Package':
        return <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-blue-600 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Boxes className="w-6 h-6 text-blue-600" />
              Corporate SaaS Module Hub
            </h1>
            <Badge variant="primary" size="sm">
              17 Enterprise Modules
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architectural core pillars, comprehensive business capabilities and direct tenant module assignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/saas/organizations">
            <Button variant="outline" size="sm" leftIcon={<Building2 className="w-3.5 h-3.5" />}>
              Manage Organizations
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRIMARY TABS: ALL MODULES (CORE PILLARS) vs. ASSIGN TO ORGANIZATION      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/90 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/70 dark:border-dark-border">
        <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setPageViewMode('all_modules')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${pageViewMode === 'all_modules'
              ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
          >
            <Boxes className="w-4 h-4" />
            <span>All Modules by Core Pillars</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pageViewMode === 'all_modules'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
            >
              17
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPageViewMode('assign_org')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${pageViewMode === 'assign_org'
              ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Assign to Organization</span>
            {selectedOrg && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold truncate max-w-[110px] ${pageViewMode === 'assign_org'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
              >
                {selectedOrg.name} ({assignedModuleIds.length}/17)
              </span>
            )}
          </button>
        </div>

        <div className="text-right px-2 hidden lg:block">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {pageViewMode === 'all_modules'
              ? 'Exploring all 17 Enterprise modules structured by 6 architectural pillars'
              : `Assigning and provisioning modules directly for ${selectedOrg?.name || 'organizations'}`}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: ALL MODULES PRESENT AS PER CORE PILLARS (WITH FILTERS)      */}
      {/* ========================================================================= */}
      {pageViewMode === 'all_modules' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Advanced Filter Box */}
          <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs space-y-3.5">
            {/* 1. Core Pillars Pill Filter Tabs */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Filter by Core Pillar:
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSelectedPillar('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${selectedPillar === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  <span>All Pillars</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedPillar === 'ALL'
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                  >
                    17
                  </span>
                </button>

                {CORE_PILLARS.map((p) => {
                  const isSelected = selectedPillar === p.pillar;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.pillar}
                      type="button"
                      onClick={() => setSelectedPillar(p.pillar)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected
                          ? 'bg-blue-700 text-blue-100'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                      >
                        {p.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Secondary Filters Row: Search, Type, Price, Sort */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search modules or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="all">All Module Types</option>
                  <option value="differentiator">★ Key Differentiators Only</option>
                  <option value="separate">Dedicated Separate Modules Only</option>
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="all">All Base Price Ranges</option>
                  <option value="under200">Under $200 / mo</option>
                  <option value="200to300">$200 – $300 / mo</option>
                  <option value="over300">Over $300 / mo</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="order">Sort: Sequence (#1 to #17)</option>
                  <option value="price_asc">Sort: Price (Low → High)</option>
                  <option value="price_desc">Sort: Price (High → Low)</option>
                  <option value="features">Sort: Most Capabilities</option>
                </select>
              </div>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Showing <strong className="text-slate-900 dark:text-white font-bold">{catalogFilteredModules.length}</strong> of 17 modules across{' '}
                <strong className="text-slate-900 dark:text-white font-bold">{catalogPillarsToDisplay.length}</strong> Core Pillars
              </span>
              {hasActiveFilters && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">Filters Applied</span>
              )}
            </div>
          </Card>

          {/* If No Modules Found */}
          {catalogFilteredModules.length === 0 && (
            <Card className="p-8 text-center bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border space-y-3">
              <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Modules Match Your Filters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No modules match the current combination of pillar, type, price, and search keywords.
              </p>
              <Button size="sm" variant="outline" onClick={resetAllFilters} className="mx-auto text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset All Filters
              </Button>
            </Card>
          )}

          {/* Grouped Modules by Core Pillars */}
          <div className="space-y-8">
            {catalogPillarsToDisplay.map((p) => {
              const Icon = p.icon;
              const pMods = catalogFilteredModules.filter((m) => m.pillar === p.pillar);
              if (pMods.length === 0) return null;

              return (
                <div key={p.pillar} className="space-y-3">
                  {/* Pillar Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-dark-border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-dark-card shadow-xs ${p.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {p.label} Pillar
                          </h2>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {pMods.length} of {p.count} Modules
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {p.tagline}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPillar(p.pillar);
                        setPageViewMode('assign_org');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>Assign Pillar to Org</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Module Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pMods.map((mod) => {
                      const isAssigned = assignedModuleIds.includes(mod.id);

                      return (
                        <Card
                          key={mod.id}
                          className={`p-4 border bg-white dark:bg-dark-card flex flex-col justify-between transition-all duration-200 hover:shadow-md ${mod.isKeyDifferentiator
                            ? 'border-amber-400 dark:border-amber-500/50'
                            : 'border-slate-200/80 dark:border-dark-border'
                            }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-dark-border">
                                  {getModuleIcon(mod.iconName)}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    Module #{mod.numericOrder}
                                  </span>
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {mod.name}
                                  </h3>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                {mod.isSeparateModule && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    Separate Module
                                  </span>
                                )}
                                {mod.isKeyDifferentiator && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                    ★ Differentiator
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Tagline & Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {mod.description}
                            </p>

                            {/* Submodules Summary & Fast Config Action Pill */}
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <div className="truncate">
                                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                                    {(mod.subModules || []).length || mod.subFeaturesCount} Submodules
                                  </span>
                                  {selectedOrg && (
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                                      {(mod.subModules || []).filter((s) => !isSubModuleDisabled(mod.id, s)).length} Active for tenant
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSubmoduleDrawerModule(mod);
                                  setDrawerSearchQuery('');
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 transition flex items-center gap-1 shrink-0"
                              >
                                <Sliders className="w-3 h-3" />
                                <span>Config</span>
                              </button>
                            </div>
                          </div>

                          {/* Bottom Meta & Actions */}
                          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400">Modular Base</span>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(mod.basePriceMonthly)}{' '}
                                  <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModule(mod);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Inspect Specs
                              </button>
                            </div>

                            {/* Assign / Provision to Org Switcher */}
                            <button
                              type="button"
                              onClick={() => {
                                setPageViewMode('assign_org');
                                if (selectedOrg) {
                                  handleToggleModuleForOrg(mod.id);
                                }
                              }}
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${selectedOrg && isAssigned
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40'
                                : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                                }`}
                            >
                              {selectedOrg && isAssigned ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Assigned to {selectedOrg.name}</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{selectedOrg ? `Assign to ${selectedOrg.name}` : 'Assign to Organization'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: ASSIGN TO ORGANIZATION MODE                                 */}
      {/* ========================================================================= */}
      {pageViewMode === 'assign_org' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Target Organization Selector Bar */}
          <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-xs">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Left: Organization Selector & Details */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    Select Organization:
                  </span>
                </div>

                <div className="min-w-[280px]">
                  <select
                    value={selectedOrgId}
                    onChange={(e) => handleOrgChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs rounded-xl px-3.5 py-2 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {organizations.map((org) => {
                      const sub = subscriptions.find((s) => s.organizationId === org.id);
                      const count = sub?.subscribedModuleIds?.length || org.subscribedModules?.length || 0;
                      return (
                        <option key={org.id} value={org.id}>
                          {org.name} ({count}/17 Modules • {org.industry})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedOrg && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white">{selectedOrg.name}</span>
                    <span>•</span>
                    <span>{selectedOrg.contactEmail}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {selectedOrg.maxEmployees} Seats
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Modules Active Counter & Quick Actions */}
              {selectedOrg && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                  {/* Assigned Modules Pill */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
                      Assigned:
                    </span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {assignedModuleIds.length} / 17
                    </span>
                    <Badge
                      variant={
                        assignedModuleIds.length === 17
                          ? 'success'
                          : assignedModuleIds.length > 0
                            ? 'primary'
                            : 'warning'
                      }
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      {assignedModuleIds.length === 17 ? 'All 6 Pillars Active' : `${assignedModuleIds.length} Active`}
                    </Badge>
                  </div>

                  {/* Monthly Total Pill */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
                      Total MRR:
                    </span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(currentOrgSub?.monthlyTotalFee || selectedOrg.monthlyFee || 0)}
                      <span className="text-[10px] font-normal text-slate-400">/mo</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSelectAllPillars}
                      title="Assign all modules across all 6 Core Pillars"
                      className="whitespace-nowrap text-xs py-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Assign All (17)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearAllPillars}
                      className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 whitespace-nowrap text-xs py-1.5"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Core Pillars Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Core Pillars Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {PILLARS_FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedPillar(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${selectedPillar === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  <span>{tab.label}</span>
                  {selectedOrg && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${selectedPillar === tab.key
                        ? 'bg-blue-700 text-blue-100'
                        : tab.assignedCount > 0
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                    >
                      {tab.assignedCount} Active
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search modules or capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Module Cards Grouped by Pillars */}
          <div className="space-y-8">
            {assignmentPillarsToDisplay.map((p) => {
              const Icon = p.icon;
              const pMods = assignmentFilteredModules.filter((m) => m.pillar === p.pillar);
              if (pMods.length === 0) return null;

              const assignedCount = pMods.filter((m) => assignedModuleIds.includes(m.id)).length;
              const isAllPillarAssigned = pMods.length > 0 && assignedCount === pMods.length;

              return (
                <div key={p.pillar} className="space-y-3">
                  {/* Pillar Header with 1-Click Pillar Assignment */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-dark-border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-dark-card shadow-xs ${p.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            {p.label} Pillar
                          </h2>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {p.count} Modules
                          </span>
                          {selectedOrg && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAllPillarAssigned
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : assignedCount > 0
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                            >
                              {assignedCount}/{p.count} Assigned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {p.tagline}
                        </p>
                      </div>
                    </div>

                    {/* 1-Click Pillar Toggle */}
                    {selectedOrg && (
                      <Button
                        size="sm"
                        variant={isAllPillarAssigned ? 'outline' : 'primary'}
                        onClick={() => handleTogglePillarForOrg(p.pillar)}
                        className={
                          isAllPillarAssigned
                            ? 'text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            : ''
                        }
                      >
                        {isAllPillarAssigned ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            All {p.label} Assigned
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Assign {p.label} Pillar ({p.count})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Module Cards Grid for this Pillar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pMods.map((mod) => {
                      const isAssigned = assignedModuleIds.includes(mod.id);

                      return (
                        <Card
                          key={mod.id}
                          className={`p-4 border bg-white dark:bg-dark-card flex flex-col justify-between transition-all duration-200 hover:shadow-md ${isAssigned
                            ? 'ring-2 ring-blue-500/60 border-blue-400 dark:border-blue-600/70'
                            : mod.isKeyDifferentiator
                              ? 'border-amber-400 dark:border-amber-500/50'
                              : 'border-slate-200/80 dark:border-dark-border'
                            }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-dark-border">
                                  {getModuleIcon(mod.iconName)}
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    Module #{mod.numericOrder}
                                  </span>
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                    {mod.name}
                                  </h3>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                {mod.isSeparateModule && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    Separate Module
                                  </span>
                                )}
                                {mod.isKeyDifferentiator && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                    ★ Differentiator
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Tagline & Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {mod.description}
                            </p>

                            {/* Submodules Summary & Fast Config Action Pill */}
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <div className="truncate">
                                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                                    {(mod.subModules || []).length || mod.subFeaturesCount} Submodules
                                  </span>
                                  {selectedOrg && (
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                                      {(mod.subModules || []).filter((s) => !isSubModuleDisabled(mod.id, s)).length} Active for tenant
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSubmoduleDrawerModule(mod);
                                  setDrawerSearchQuery('');
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 transition flex items-center gap-1 shrink-0"
                              >
                                <Sliders className="w-3 h-3" />
                                <span>Config</span>
                              </button>
                            </div>
                          </div>

                          {/* Bottom Meta & Direct Assignment Toggle */}
                          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400">Modular Base</span>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(mod.basePriceMonthly)}{' '}
                                  <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModule(mod);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Inspect Specs
                              </button>
                            </div>

                            {/* Organization Assignment Action Button */}
                            {selectedOrg && (
                              <button
                                type="button"
                                onClick={() => handleToggleModuleForOrg(mod.id)}
                                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${isAssigned
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                                  }`}
                              >
                                {isAssigned ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    <span>Assigned to {selectedOrg.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Assign to {selectedOrg.name}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Module Specs Modal */}
      {selectedModule && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Module #${selectedModule.numericOrder}: ${selectedModule.name}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-dark-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="md">
                    {selectedModule.pillar}
                  </Badge>
                  {selectedModule.isKeyDifferentiator && (
                    <Badge variant="warning" size="md">
                      Key Differentiator
                    </Badge>
                  )}
                  {selectedModule.isSeparateModule && (
                    <Badge variant="info" size="md">
                      Dedicated Separate Module
                    </Badge>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  Base: {formatCurrency(selectedModule.basePriceMonthly)} / mo
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedModule.description}
              </p>
            </div>

            {/* Granular Submodules & Feature Controls Section */}
            {selectedModule && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <span>Submodules & Feature Control</span>
                      {selectedOrg && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {(selectedModule.subModules || []).filter(
                            (s) => !isSubModuleDisabled(selectedModule.id, s)
                          ).length} / {(selectedModule.subModules || []).length} Active for {selectedOrg.name}
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enable or disable specific submodules for tenant organization access.
                    </p>
                  </div>

                  {selectedOrg && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnableAllSubModules(selectedModule)}
                        className="text-[10px] py-0.5 px-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        Enable All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDisableAllSubModules(selectedModule)}
                        className="text-[10px] py-0.5 px-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        Disable All
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {(selectedModule.subModules || selectedModule.featureGroups.flatMap((g) => g.items)).map((subName, i) => {
                    const disabled = isSubModuleDisabled(selectedModule.id, subName);

                    return (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${disabled
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 opacity-75'
                          : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border shadow-2xs'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${disabled ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                          />
                          <span
                            className={`text-xs font-semibold truncate ${disabled
                              ? 'text-slate-500 dark:text-slate-400 line-through'
                              : 'text-slate-900 dark:text-white'
                              }`}
                          >
                            {subName}
                          </span>
                        </div>

                        {selectedOrg ? (
                          <button
                            type="button"
                            onClick={() => handleToggleSubModule(selectedModule.id, subName)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 flex items-center gap-1 ${disabled
                              ? 'bg-slate-200 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                          >
                            {disabled ? (
                              <>
                                <span>Disabled</span>
                                <span className="text-[9px] underline">Enable</span>
                              </>
                            ) : (
                              <>
                                <span>Active</span>
                                <span className="text-[9px] underline">Disable</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${disabled
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                          >
                            {disabled ? 'Disabled' : 'Active'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feature Groups Breakdown */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-dark-border">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Full Architectural Sub-Features & Components
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                {selectedModule.featureGroups.map((grp, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-dark-border space-y-1.5"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b pb-1 border-slate-200 dark:border-slate-800">
                      {grp.groupName}
                    </p>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {grp.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-dark-border">
              {selectedOrg && (
                <Button
                  size="sm"
                  variant={assignedModuleIds.includes(selectedModule.id) ? 'primary' : 'outline'}
                  onClick={() => handleToggleModuleForOrg(selectedModule.id)}
                  className={
                    assignedModuleIds.includes(selectedModule.id)
                      ? 'bg-emerald-600 text-white'
                      : ''
                  }
                >
                  {assignedModuleIds.includes(selectedModule.id)
                    ? `✓ Assigned to ${selectedOrg.name}`
                    : `+ Assign to ${selectedOrg.name}`}
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Submodule Fast Config Slide-Over Drawer / Modal */}
      {submoduleDrawerModule && (
        <Modal
          isOpen={!!submoduleDrawerModule}
          onClose={() => setSubmoduleDrawerModule(null)}
          title={`⚙️ Submodule Control Panel: ${submoduleDrawerModule.name}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{submoduleDrawerModule.pillar}</Badge>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {submoduleDrawerModule.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Enable or disable granular submodules for tenant: <strong className="text-slate-800 dark:text-slate-200">{selectedOrg?.name || 'All Organizations'}</strong>
                </p>
              </div>

              {selectedOrg && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnableAllSubModules(submoduleDrawerModule)}
                    className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    Enable All Submodules
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisableAllSubModules(submoduleDrawerModule)}
                    className="text-xs border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Disable All
                  </Button>
                </div>
              )}
            </div>

            {/* Fast Submodule Search inside Drawer */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search submodules..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid of Submodules with Smooth Toggle Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {(submoduleDrawerModule.subModules || submoduleDrawerModule.featureGroups.flatMap((g) => g.items))
                .filter((sub) => sub.toLowerCase().includes(drawerSearchQuery.toLowerCase()))
                .map((subName, i) => {
                  const disabled = isSubModuleDisabled(submoduleDrawerModule.id, subName);

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${disabled
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                        : 'bg-white dark:bg-dark-card border-slate-200/80 dark:border-dark-border shadow-xs'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${disabled ? 'bg-rose-500 shadow-rose-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                            }`}
                        />
                        <span
                          className={`text-xs font-semibold truncate ${disabled ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'
                            }`}
                        >
                          {subName}
                        </span>
                      </div>

                      {selectedOrg ? (
                        <button
                          type="button"
                          onClick={() => handleToggleSubModule(submoduleDrawerModule.id, subName)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${disabled
                            ? 'bg-slate-200 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                        >
                          {disabled ? (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Enable</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${disabled ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          {disabled ? 'Off' : 'On'}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-dark-border">
              <Button variant="primary" size="sm" onClick={() => setSubmoduleDrawerModule(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
