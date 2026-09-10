import { PayrollRecord } from '../types';
import { getFromStorage, saveToStorage } from './storage';
import { INITIAL_EMPLOYEES } from './mockDb';

const SEED_PAYROLL_RECORDS: PayrollRecord[] = INITIAL_EMPLOYEES.map(emp => ({
  id: `pay-${emp.id}`,
  organizationId: emp.organizationId,
  employeeId: emp.id,
  employeeCode: emp.employeeId,
  employeeName: emp.fullName,
  employeeAvatar: emp.avatar,
  department: emp.department,
  designation: emp.designation,
  month: 'May 2024',
  monthKey: '2024-05',
  basicSalary: emp.salary.basic,
  hra: emp.salary.hra,
  allowances: emp.salary.allowances,
  bonus: 500,
  overtimePay: 0,
  grossSalary: emp.salary.gross + 500,
  providentFund: emp.salary.deductions.providentFund,
  taxDeduction: emp.salary.deductions.incomeTax,
  insuranceDeduction: emp.salary.deductions.insurance,
  otherDeductions: emp.salary.deductions.professionalTax,
  totalDeductions: emp.salary.deductions.providentFund + emp.salary.deductions.incomeTax + emp.salary.deductions.insurance + emp.salary.deductions.professionalTax,
  netSalary: emp.salary.net + 500,
  paymentMethod: 'Bank Transfer',
  paymentDate: '2024-05-31',
  status: 'Paid',
}));

export const payrollService = {
  getRecords: async (_month: string = '2024-05'): Promise<PayrollRecord[]> => {
    return getFromStorage<PayrollRecord[]>('payroll_records', SEED_PAYROLL_RECORDS);
  },

  getPayrollSummary: async () => {
    const records = await payrollService.getRecords();
    const totalPayroll = 248650;
    const netSalary = 212480;
    const totalDeductions = 36170;
    const processedEmployees = 124;
    const pendingEmployees = 0;
    return {
      totalPayroll,
      netSalary,
      totalDeductions,
      processedEmployees,
      pendingEmployees,
      salaryComponents: [
        { name: 'Basic Salary', value: 142000, color: '#3B82F6' },
        { name: 'House Rent Allowance (HRA)', value: 52000, color: '#10B981' },
        { name: 'Special Allowances', value: 34650, color: '#F59E0B' },
        { name: 'Performance Bonus', value: 20000, color: '#8B5CF6' },
        { name: 'Deductions & Taxes', value: 36170, color: '#EF4444' },
      ],
      monthlyTrend: [
        { month: 'Jan', amount: 232000 },
        { month: 'Feb', amount: 236000 },
        { month: 'Mar', amount: 241000 },
        { month: 'Apr', amount: 245000 },
        { month: 'May', amount: 248650 },
        { month: 'Jun', amount: 252000 },
      ]
    };
  },

  processBatchPayroll: async (month: string): Promise<number> => {
    const records = await payrollService.getRecords();
    const updated = records.map(r => ({ ...r, month, status: 'Paid' as const, paymentDate: new Date().toISOString().split('T')[0] }));
    saveToStorage('payroll_records', updated);
    return updated.length;
  }
};
