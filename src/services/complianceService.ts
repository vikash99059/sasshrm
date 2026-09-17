import {
  PfEcrSummary,
  EsiReturnSummary,
  PtSlab,
  TdsQuarterlyReturn,
} from '../types';
import { getFromStorage, saveToStorage } from './storage';

export const PT_SLABS: PtSlab[] = [
  { state: 'Karnataka', salaryThresholdMin: 15000, salaryThresholdMax: 9999999, monthlyDeduction: 200 },
  { state: 'Maharashtra', salaryThresholdMin: 10000, salaryThresholdMax: 9999999, monthlyDeduction: 200, februaryDeduction: 300 },
  { state: 'Telangana', salaryThresholdMin: 20000, salaryThresholdMax: 9999999, monthlyDeduction: 200 },
  { state: 'Tamil Nadu', salaryThresholdMin: 12500, salaryThresholdMax: 9999999, monthlyDeduction: 208 },
  { state: 'West Bengal', salaryThresholdMin: 15000, salaryThresholdMax: 9999999, monthlyDeduction: 150 },
  { state: 'Delhi (NCT)', salaryThresholdMin: 0, salaryThresholdMax: 9999999, monthlyDeduction: 0 },
];

export const INITIAL_PF_ECR_LIST: PfEcrSummary[] = [
  {
    monthYear: 'May 2024',
    totalMembers: 248,
    totalWages: 14850000,
    epfWages: 3720000, // wage ceiling applied at 15000 cap
    epsWages: 3720000,
    edliWages: 3720000,
    eeShare12: 446400, // 12% of 3720000
    erShareEpf: 136524, // 3.67%
    erShareEps: 309876, // 8.33%
    adminChargesAc2: 18600, // 0.50%
    edliChargesAc21: 18600, // 0.50%
    totalChallanAmount: 930000,
    ecrGenerated: true,
    challanStatus: 'Generated',
    trrnNumber: 'TRRN-2405-99214',
  },
  {
    monthYear: 'April 2024',
    totalMembers: 242,
    totalWages: 14450000,
    epfWages: 3630000,
    epsWages: 3630000,
    edliWages: 3630000,
    eeShare12: 435600,
    erShareEpf: 133221,
    erShareEps: 302379,
    adminChargesAc2: 18150,
    edliChargesAc21: 18150,
    totalChallanAmount: 907500,
    ecrGenerated: true,
    challanStatus: 'Paid',
    trrnNumber: 'TRRN-2404-88319',
  },
];

export const INITIAL_ESI_LIST: EsiReturnSummary[] = [
  {
    monthYear: 'May 2024',
    totalCoveredEmployees: 42, // employees with gross <= 21,000
    totalGrossWages: 840000,
    employeeShare: 6300, // 0.75%
    employerShare: 27300, // 3.25%
    totalContribution: 33600,
    status: 'Pending',
  },
  {
    monthYear: 'April 2024',
    totalCoveredEmployees: 40,
    totalGrossWages: 800000,
    employeeShare: 6000,
    employerShare: 26000,
    totalContribution: 32000,
    challanNumber: 'ESI-CHAL-2404-0019',
    status: 'Paid',
  },
];

export const INITIAL_TDS_QUARTERLY: TdsQuarterlyReturn[] = [
  {
    quarter: 'Q4 (Jan-Mar)',
    financialYear: '2023-24',
    formType: 'Form 24Q (Salary)',
    totalDeductionsCount: 240,
    taxDeducted: 1850000,
    taxDeposited: 1850000,
    challanCount: 3,
    status: 'Filed',
    acknowledgementNumber: 'ACK24Q492819001',
  },
  {
    quarter: 'Q1 (Apr-Jun)',
    financialYear: '2024-25',
    formType: 'Form 24Q (Salary)',
    totalDeductionsCount: 248,
    taxDeducted: 1980000,
    taxDeposited: 1980000,
    challanCount: 2,
    status: 'Verification Pending',
  },
];

export const complianceService = {
  getPfSummaries: async (): Promise<PfEcrSummary[]> => {
    return getFromStorage<PfEcrSummary[]>('compliance_pf_ecr', INITIAL_PF_ECR_LIST);
  },

  generatePfEcr: async (monthYear: string): Promise<PfEcrSummary> => {
    const list = await complianceService.getPfSummaries();
    const existing = list.find(p => p.monthYear === monthYear);
    if (existing) {
      existing.ecrGenerated = true;
      existing.challanStatus = 'Generated';
      existing.trrnNumber = `TRRN-${Date.now().toString().slice(-8)}`;
      saveToStorage('compliance_pf_ecr', list);
      return existing;
    }
    const newSummary: PfEcrSummary = {
      monthYear,
      totalMembers: 248,
      totalWages: 14850000,
      epfWages: 3720000,
      epsWages: 3720000,
      edliWages: 3720000,
      eeShare12: 446400,
      erShareEpf: 136524,
      erShareEps: 309876,
      adminChargesAc2: 18600,
      edliChargesAc21: 18600,
      totalChallanAmount: 930000,
      ecrGenerated: true,
      challanStatus: 'Generated',
      trrnNumber: `TRRN-${Date.now().toString().slice(-8)}`,
    };
    saveToStorage('compliance_pf_ecr', [newSummary, ...list]);
    return newSummary;
  },

  getEsiSummaries: async (): Promise<EsiReturnSummary[]> => {
    return getFromStorage<EsiReturnSummary[]>('compliance_esi', INITIAL_ESI_LIST);
  },

  getPtSlabs: async (): Promise<PtSlab[]> => {
    return PT_SLABS;
  },

  getTdsReturns: async (): Promise<TdsQuarterlyReturn[]> => {
    return getFromStorage<TdsQuarterlyReturn[]>('compliance_tds_returns', INITIAL_TDS_QUARTERLY);
  },

  getComplianceHealth: async () => {
    return {
      overallHealthScore: 98,
      status: 'Fully Compliant' as const,
      statutoryReminders: [
        { title: 'EPF ECR Filing & Payment', dueDate: '15th June 2024', status: 'Upcoming', daysLeft: 7, priority: 'High' },
        { title: 'ESIC Monthly Return & Payment', dueDate: '15th June 2024', status: 'Upcoming', daysLeft: 7, priority: 'High' },
        { title: 'GSTR-3B Tax Return', dueDate: '20th June 2024', status: 'Upcoming', daysLeft: 12, priority: 'Medium' },
        { title: 'TDS Payment for May 2024 (Sec 192)', dueDate: '07th June 2024', status: 'Complied', daysLeft: 0, priority: 'High' },
      ],
      auditChecklist: [
        { label: 'PF ECR electronic filing matches salary ledger', passed: true },
        { label: 'ESI threshold (<21k INR gross) verified against all trainees & interns', passed: true },
        { label: 'State-wise Professional Tax rates accurately applied to multi-branch employees', passed: true },
        { label: 'TDS regime declarations (Old vs New Sec 115BAC) locked with proofs', passed: true },
        { label: 'Minimum Wages Act & overtime multipliers compliance verified', passed: true },
      ]
    };
  }
};
