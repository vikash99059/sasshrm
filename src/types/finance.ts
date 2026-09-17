export type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export type AccountSubCategory =
  | 'Current Asset'
  | 'Fixed Asset'
  | 'Non-Current Asset'
  | 'Current Liability'
  | 'Long-Term Liability'
  | 'Equity & Reserves'
  | 'Operating Revenue'
  | 'Other Income'
  | 'Cost of Goods Sold'
  | 'Operating Expense'
  | 'Payroll Expense'
  | 'Tax & Statutory Expense';

export interface ChartAccount {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subCategory: AccountSubCategory;
  currency: string;
  balance: number;
  status: 'Active' | 'Archived';
  description: string;
  isSystemAccount?: boolean;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  notes: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'Posted' | 'Draft';
  createdBy: string;
  createdAt: string;
}

// Invoices & Receivables
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Partially Paid' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18%
  taxAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientGstin?: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentTerms: string;
  notes?: string;
}

// Bills & Payables
export type BillStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Overdue';

export interface BillItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface VendorBill {
  id: string;
  billNumber: string;
  vendorName: string;
  vendorCategory: string;
  vendorGstin?: string;
  billDate: string;
  dueDate: string;
  items: BillItem[];
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: BillStatus;
  poReference?: string;
  notes?: string;
}

// Payments & Receipts
export interface PaymentReceiptVoucher {
  id: string;
  voucherNumber: string;
  type: 'Receipt' | 'Payment';
  partyName: string;
  partyType: 'Customer' | 'Vendor' | 'Employee' | 'Tax Authority';
  date: string;
  amount: number;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Credit Card' | 'Cheque' | 'Cash';
  referenceNumber: string;
  bankAccount: string;
  status: 'Cleared' | 'Pending' | 'Reconciled';
  purpose: string;
}

// Bank Reconciliation
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Current Account' | 'Savings Account' | 'Escrow Account' | 'Payroll Account';
  ifscCode: string;
  branch: string;
  ledgerBalance: number;
  statementBalance: number;
  unreconciledCount: number;
  lastReconciledDate: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  referenceNo: string;
  type: 'Credit' | 'Debit';
  amount: number;
  status: 'Matched' | 'Unmatched' | 'Excluded';
  matchedJournalId?: string;
  matchedEntityName?: string;
}

// GST & Tax
export interface GstFilingPeriod {
  periodKey: string; // "2024-05"
  returnType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-9';
  outwardTaxableSupplies: number;
  igstPayable: number;
  cgstPayable: number;
  sgstPayable: number;
  totalLiability: number;
  eligibleItc: number;
  netTaxPaid: number;
  filingDueDate: string;
  status: 'Filed' | 'Pending' | 'Draft' | 'Overdue';
  arnNumber?: string;
}

// Loans & Advances
export type LoanType = 'Salary Advance' | 'Personal Loan' | 'Emergency Medical' | 'Education Assistance' | 'Home Relocation';

export interface EmiScheduleItem {
  installmentNumber: number;
  monthYear: string;
  principalAmount: number;
  interestAmount: number;
  emiAmount: number;
  status: 'Paid' | 'Pending' | 'Deducted in Payroll';
}

export interface EmployeeLoan {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  avatar: string;
  loanType: LoanType;
  principalAmount: number;
  interestRate: number; // e.g. 0% or 5%
  tenureMonths: number;
  monthlyEmi: number;
  totalRepayment: number;
  amountRepaid: number;
  outstandingBalance: number;
  disbursementDate: string;
  startMonthYear: string;
  status: 'Active' | 'Approved' | 'Pending' | 'Completed' | 'Rejected';
  purpose: string;
  schedule: EmiScheduleItem[];
}

// Statutory Compliance Models
export interface PfEcrSummary {
  monthYear: string;
  totalMembers: number;
  totalWages: number;
  epfWages: number;
  epsWages: number;
  edliWages: number;
  eeShare12: number;
  erShareEpf: number; // 3.67%
  erShareEps: number; // 8.33%
  adminChargesAc2: number;
  edliChargesAc21: number;
  totalChallanAmount: number;
  ecrGenerated: boolean;
  challanStatus: 'Paid' | 'Generated' | 'Pending';
  trrnNumber?: string;
}

export interface EsiReturnSummary {
  monthYear: string;
  totalCoveredEmployees: number;
  totalGrossWages: number;
  employeeShare: number; // 0.75%
  employerShare: number; // 3.25%
  totalContribution: number;
  challanNumber?: string;
  status: 'Paid' | 'Pending';
}

export interface PtSlab {
  state: string;
  salaryThresholdMin: number;
  salaryThresholdMax: number;
  monthlyDeduction: number;
  februaryDeduction?: number;
}

export interface TdsQuarterlyReturn {
  quarter: 'Q1 (Apr-Jun)' | 'Q2 (Jul-Sep)' | 'Q3 (Oct-Dec)' | 'Q4 (Jan-Mar)';
  financialYear: string;
  formType: 'Form 24Q (Salary)' | 'Form 26Q (Non-Salary)';
  totalDeductionsCount: number;
  taxDeducted: number;
  taxDeposited: number;
  challanCount: number;
  status: 'Filed' | 'Verification Pending' | 'Draft';
  acknowledgementNumber?: string;
}
