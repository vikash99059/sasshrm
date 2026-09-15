export type CorporatePillar =
  | 'Organization'
  | 'People'
  | 'Finance'
  | 'Business & Operations'
  | 'Communication'
  | 'Control & Intelligence';

export type CorporateModuleId =
  | 'organization_management'
  | 'recruitment_management'
  | 'employee_hr_management'
  | 'finance_management'
  | 'business_costing_center'
  | 'sales_crm'
  | 'project_task_management'
  | 'procurement_purchase'
  | 'inventory_asset_management'
  | 'customer_service_support'
  | 'email_management'
  | 'chat_communication'
  | 'document_management'
  | 'kpi_performance_management'
  | 'workflow_automation'
  | 'mis_analytics_dashboard'
  | 'ai_business_intelligence';

export interface CorporateModuleFeatureGroup {
  groupName: string;
  items: string[];
}

export interface CorporateModule {
  id: CorporateModuleId;
  numericOrder: number;
  name: string;
  pillar: CorporatePillar;
  tagline: string;
  description: string;
  badge?: string;
  isSeparateModule?: boolean;
  isKeyDifferentiator?: boolean;
  basePriceMonthly: number;
  perSeatPriceMonthly: number;
  subModules?: string[];
  featureGroups: CorporateModuleFeatureGroup[];
  subFeaturesCount: number;
  activeOrganizationsCount: number;
  adoptionPercentage: number;
  iconName: string;
}

export interface ModularSubscriptionConfig {
  organizationId: string;
  organizationName: string;
  planTier: 'Custom' | 'Starter' | 'Business Pro' | 'Enterprise Suite';
  bundleName?: string;
  subscribedModuleIds: CorporateModuleId[];
  disabledSubModules?: Record<string, string[]>;
  customModulePricing?: Partial<Record<CorporateModuleId, number>>;
  monthlyBaseFee: number;
  monthlyTotalFee: number;
  seatQuotas: number;
  billingCycle: 'Monthly' | 'Annual';
  status: 'Active' | 'Trial' | 'Past Due' | 'Suspended';
  lastUpdated: string;
}

export interface ModuleBundlePreset {
  id: string;
  name: string;
  description: string;
  targetIndustry: string;
  badge?: string;
  discountPercentage: number;
  moduleIds: CorporateModuleId[];
  recommendedMonthlyFee: number;
}
