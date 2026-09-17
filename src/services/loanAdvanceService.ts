import { EmployeeLoan, EmiScheduleItem } from '../types';
import { getFromStorage, saveToStorage } from './storage';

export const INITIAL_LOANS: EmployeeLoan[] = [
  {
    id: 'loan-101',
    employeeId: 'emp-2',
    employeeName: 'Priya Sharma',
    employeeCode: 'EMP002',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    loanType: 'Home Relocation',
    principalAmount: 120000,
    interestRate: 0, // interest free company policy
    tenureMonths: 6,
    monthlyEmi: 20000,
    totalRepayment: 120000,
    amountRepaid: 60000,
    outstandingBalance: 60000,
    disbursementDate: '2024-02-01',
    startMonthYear: '2024-03',
    status: 'Active',
    purpose: 'Relocation allowance advance for Bangalore transfer',
    schedule: [
      { installmentNumber: 1, monthYear: 'March 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Paid' },
      { installmentNumber: 2, monthYear: 'April 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Paid' },
      { installmentNumber: 3, monthYear: 'May 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Paid' },
      { installmentNumber: 4, monthYear: 'June 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Pending' },
      { installmentNumber: 5, monthYear: 'July 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Pending' },
      { installmentNumber: 6, monthYear: 'August 2024', principalAmount: 20000, interestAmount: 0, emiAmount: 20000, status: 'Pending' },
    ],
  },
  {
    id: 'loan-102',
    employeeId: 'emp-5',
    employeeName: 'Ananya Verma',
    employeeCode: 'EMP005',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    loanType: 'Salary Advance',
    principalAmount: 50000,
    interestRate: 0,
    tenureMonths: 2,
    monthlyEmi: 25000,
    totalRepayment: 50000,
    amountRepaid: 25000,
    outstandingBalance: 25000,
    disbursementDate: '2024-04-15',
    startMonthYear: '2024-05',
    status: 'Active',
    purpose: 'Festival salary advance',
    schedule: [
      { installmentNumber: 1, monthYear: 'May 2024', principalAmount: 25000, interestAmount: 0, emiAmount: 25000, status: 'Paid' },
      { installmentNumber: 2, monthYear: 'June 2024', principalAmount: 25000, interestAmount: 0, emiAmount: 25000, status: 'Pending' },
    ],
  },
  {
    id: 'loan-103',
    employeeId: 'emp-4',
    employeeName: 'Rohan Patel',
    employeeCode: 'EMP004',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    loanType: 'Education Assistance',
    principalAmount: 200000,
    interestRate: 4, // 4% subsidized
    tenureMonths: 10,
    monthlyEmi: 20667,
    totalRepayment: 206670,
    amountRepaid: 0,
    outstandingBalance: 206670,
    disbursementDate: '2024-05-20',
    startMonthYear: '2024-06',
    status: 'Approved',
    purpose: 'Executive Product Leadership Certification at IIM-B',
    schedule: [],
  },
];

export const loanAdvanceService = {
  getLoans: async (): Promise<EmployeeLoan[]> => {
    return getFromStorage<EmployeeLoan[]>('payroll_loans_advances', INITIAL_LOANS);
  },

  createLoan: async (data: Omit<EmployeeLoan, 'id' | 'amountRepaid' | 'outstandingBalance' | 'schedule' | 'monthlyEmi' | 'totalRepayment'>): Promise<EmployeeLoan> => {
    const list = await loanAdvanceService.getLoans();
    const monthlyEmi = Math.round(
      (data.principalAmount + (data.principalAmount * (data.interestRate / 100) * (data.tenureMonths / 12))) / data.tenureMonths
    );
    const totalRepayment = monthlyEmi * data.tenureMonths;

    const schedule: EmiScheduleItem[] = Array.from({ length: data.tenureMonths }, (_, i) => ({
      installmentNumber: i + 1,
      monthYear: `Month ${i + 1}`,
      principalAmount: Math.round(data.principalAmount / data.tenureMonths),
      interestAmount: monthlyEmi - Math.round(data.principalAmount / data.tenureMonths),
      emiAmount: monthlyEmi,
      status: 'Pending',
    }));

    const newLoan: EmployeeLoan = {
      ...data,
      id: `loan-${Date.now()}`,
      monthlyEmi,
      totalRepayment,
      amountRepaid: 0,
      outstandingBalance: totalRepayment,
      schedule,
    };

    const updated = [newLoan, ...list];
    saveToStorage('payroll_loans_advances', updated);
    return newLoan;
  },

  updateLoanStatus: async (id: string, status: EmployeeLoan['status']): Promise<void> => {
    const list = await loanAdvanceService.getLoans();
    const updated = list.map(l => (l.id === id ? { ...l, status } : l));
    saveToStorage('payroll_loans_advances', updated);
  }
};
