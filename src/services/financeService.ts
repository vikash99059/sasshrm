import {
  ChartAccount,
  JournalEntry,
  Invoice,
  ClientInvoice,
  JournalVoucher,
  VendorBill,
  PaymentReceiptVoucher,
  BankAccount,
  BankTransaction,
  GstFilingPeriod,
} from '../types';
import { getFromStorage, saveToStorage } from './storage';

// 1. Initial Chart of Accounts
export const INITIAL_ACCOUNTS: ChartAccount[] = [
  // Assets
  { id: 'acc-1010', code: '1010', name: 'Operating Bank Account - HDFC', category: 'Asset', subCategory: 'Current Asset', currency: 'INR', balance: 4850000, status: 'Active', description: 'Primary business operating current account', isSystemAccount: true },
  { id: 'acc-1020', code: '1020', name: 'Payroll Escrow Account - ICICI', category: 'Asset', subCategory: 'Current Asset', currency: 'INR', balance: 1850000, status: 'Active', description: 'Dedicated disbursement account for monthly payroll', isSystemAccount: true },
  { id: 'acc-1030', code: '1030', name: 'Petty Cash & Float', category: 'Asset', subCategory: 'Current Asset', currency: 'INR', balance: 75000, status: 'Active', description: 'Office cash float for miscellaneous expenses' },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable (Trade Debtors)', category: 'Asset', subCategory: 'Current Asset', currency: 'INR', balance: 3420000, status: 'Active', description: 'Outstanding customer invoice balances', isSystemAccount: true },
  { id: 'acc-1200', code: '1200', name: 'Prepaid Expenses & Advances', category: 'Asset', subCategory: 'Current Asset', currency: 'INR', balance: 450000, status: 'Active', description: 'Advance payments for cloud servers and annual tools' },
  { id: 'acc-1500', code: '1500', name: 'Computer Hardware & Office Servers', category: 'Asset', subCategory: 'Fixed Asset', currency: 'INR', balance: 2850000, status: 'Active', description: 'MacBooks, workstations and IT infrastructure' },
  { id: 'acc-1550', code: '1550', name: 'Office Furniture & Fixtures', category: 'Asset', subCategory: 'Fixed Asset', currency: 'INR', balance: 1200000, status: 'Active', description: 'Ergonomic seating, conference desks and workstations' },
  { id: 'acc-1600', code: '1600', name: 'Accumulated Depreciation', category: 'Asset', subCategory: 'Fixed Asset', currency: 'INR', balance: -650000, status: 'Active', description: 'Contra-asset account for asset depreciation', isSystemAccount: true },

  // Liabilities
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Trade Creditors)', category: 'Liability', subCategory: 'Current Liability', currency: 'INR', balance: 1680000, status: 'Active', description: 'Pending vendor bills and supplier invoices', isSystemAccount: true },
  { id: 'acc-2100', code: '2100', name: 'Salaries & Wages Payable', category: 'Liability', subCategory: 'Current Liability', currency: 'INR', balance: 2480000, status: 'Active', description: 'Accrued salary obligations for current cycle', isSystemAccount: true },
  { id: 'acc-2210', code: '2210', name: 'GST Output Liability (CGST + SGST + IGST)', category: 'Liability', subCategory: 'Current Liability', currency: 'INR', balance: 540000, status: 'Active', description: 'GST collected on customer invoices', isSystemAccount: true },
  { id: 'acc-2220', code: '2220', name: 'TDS Payable on Salaries (Sec 192)', category: 'Liability', subCategory: 'Current Liability', currency: 'INR', balance: 320000, status: 'Active', description: 'Income tax deducted from employee salaries' },
  { id: 'acc-2230', code: '2230', name: 'PF & ESI Statutory Payable', category: 'Liability', subCategory: 'Current Liability', currency: 'INR', balance: 285000, status: 'Active', description: 'Accumulated provident fund and insurance dues' },
  { id: 'acc-2500', code: '2500', name: 'Commercial Term Loan - SIDBI', category: 'Liability', subCategory: 'Long-Term Liability', currency: 'INR', balance: 4000000, status: 'Active', description: 'Long term equipment financing term facility' },

  // Equity
  { id: 'acc-3010', code: '3010', name: 'Paid-Up Share Capital', category: 'Equity', subCategory: 'Equity & Reserves', currency: 'INR', balance: 5000000, status: 'Active', description: 'Founders and angel equity capital', isSystemAccount: true },
  { id: 'acc-3020', code: '3020', name: 'Retained Earnings', category: 'Equity', subCategory: 'Equity & Reserves', currency: 'INR', balance: 4610000, status: 'Active', description: 'Cumulative net profit reinvested in the enterprise', isSystemAccount: true },

  // Revenue
  { id: 'acc-4010', code: '4010', name: 'SaaS Subscription Revenue', category: 'Revenue', subCategory: 'Operating Revenue', currency: 'INR', balance: 18450000, status: 'Active', description: 'Recurring platform subscription income' },
  { id: 'acc-4020', code: '4020', name: 'Enterprise Implementation & Setup Fees', category: 'Revenue', subCategory: 'Operating Revenue', currency: 'INR', balance: 3200000, status: 'Active', description: 'One-off enterprise migration and integration' },
  { id: 'acc-4090', code: '4090', name: 'Treasury & Interest Income', category: 'Revenue', subCategory: 'Other Income', currency: 'INR', balance: 240000, status: 'Active', description: 'Interest from fixed deposits and treasury yield' },

  // Expenses
  { id: 'acc-5010', code: '5010', name: 'Employee Salaries & Direct Wages', category: 'Expense', subCategory: 'Payroll Expense', currency: 'INR', balance: 9850000, status: 'Active', description: 'Base pay, allowances and performance bonuses', isSystemAccount: true },
  { id: 'acc-5020', code: '5020', name: 'Employer PF & ESI Contributions', category: 'Expense', subCategory: 'Payroll Expense', currency: 'INR', balance: 1180000, status: 'Active', description: 'Employer statutory matching contribution' },
  { id: 'acc-5100', code: '5100', name: 'AWS & Cloud Infrastructure Hosting', category: 'Expense', subCategory: 'Operating Expense', currency: 'INR', balance: 1450000, status: 'Active', description: 'Compute clusters, databases and CDN services' },
  { id: 'acc-5200', code: '5200', name: 'Office Rent & Utilities', category: 'Expense', subCategory: 'Operating Expense', currency: 'INR', balance: 960000, status: 'Active', description: 'Headquarters lease and high-speed internet' },
  { id: 'acc-5300', code: '5300', name: 'Sales & Marketing Campaigns', category: 'Expense', subCategory: 'Operating Expense', currency: 'INR', balance: 1850000, status: 'Active', description: 'Google Ads, event sponsorships and SEO tooling' },
  { id: 'acc-5400', code: '5400', name: 'Professional & Legal Compliance Fees', category: 'Expense', subCategory: 'Operating Expense', currency: 'INR', balance: 420000, status: 'Active', description: 'Auditor retainer, legal counsel and ISO certifications' },
];

// 2. Initial Invoices (Receivables)
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2024-001',
    invoiceNumber: 'INV-2024-0089',
    clientName: 'Apex Technologies Private Limited',
    clientEmail: 'billing@apextech.in',
    clientGstin: '29AABCA1234F1Z8',
    clientAddress: 'Embassy TechVillage, Outer Ring Rd, Bellandur, Bengaluru 560103',
    issueDate: '2024-05-01',
    dueDate: '2024-05-31',
    items: [
      { id: 'item-1', description: 'HRM Enterprise Plan (500 Seats - Annual)', hsnSacCode: '998314', quantity: 1, unitPrice: 450000, taxRate: 18, taxAmount: 81000, total: 531000 },
      { id: 'item-2', description: 'Custom ERP SSO & Active Directory Integration', hsnSacCode: '998313', quantity: 1, unitPrice: 75000, taxRate: 18, taxAmount: 13500, total: 88500 },
    ],
    subTotal: 525000,
    cgst: 47250,
    sgst: 47250,
    igst: 0,
    totalTax: 94500,
    totalAmount: 619500,
    paidAmount: 619500,
    balanceDue: 0,
    status: 'Paid',
    paymentTerms: 'Net 30',
    notes: 'Paid via RTGS on May 18, 2024. Transaction Ref: HDFCR520240518',
  },
  {
    id: 'inv-2024-002',
    invoiceNumber: 'INV-2024-0090',
    clientName: 'Nexus Global Financial Solutions',
    clientEmail: 'finance@nexusglobal.com',
    clientGstin: '27AABCN9876K1ZQ',
    clientAddress: 'One BKC, G Block, Bandra Kurla Complex, Mumbai 400051',
    issueDate: '2024-05-10',
    dueDate: '2024-06-10',
    items: [
      { id: 'item-3', description: 'SaaS Platform Corporate License (Q2 Billing)', hsnSacCode: '998314', quantity: 1, unitPrice: 380000, taxRate: 18, taxAmount: 68400, total: 448400 },
      { id: 'item-4', description: 'Dedicated Dedicated Success & 24/7 SLA Pack', hsnSacCode: '998313', quantity: 1, unitPrice: 60000, taxRate: 18, taxAmount: 10800, total: 70800 },
    ],
    subTotal: 440000,
    cgst: 0,
    sgst: 0,
    igst: 79200,
    totalTax: 79200,
    totalAmount: 519200,
    paidAmount: 200000,
    balanceDue: 319200,
    status: 'Partially Paid',
    paymentTerms: 'Net 30',
    notes: 'Partial deposit received on May 15. Remaining due by June 10.',
  },
  {
    id: 'inv-2024-003',
    invoiceNumber: 'INV-2024-0091',
    clientName: 'Hyperion BioSciences Corp',
    clientEmail: 'accounts@hyperionbio.com',
    clientGstin: '36AABCH4567M1ZX',
    clientAddress: 'HITEC City Phase 2, Madhapur, Hyderabad 500081',
    issueDate: '2024-05-15',
    dueDate: '2024-06-15',
    items: [
      { id: 'item-5', description: 'Core HRM + Recruitment ATS Module (Annual Tier)', hsnSacCode: '998314', quantity: 1, unitPrice: 280000, taxRate: 18, taxAmount: 50400, total: 330400 },
    ],
    subTotal: 280000,
    cgst: 0,
    sgst: 0,
    igst: 50400,
    totalTax: 50400,
    totalAmount: 330400,
    paidAmount: 0,
    balanceDue: 330400,
    status: 'Sent',
    paymentTerms: 'Net 30',
  },
  {
    id: 'inv-2024-004',
    invoiceNumber: 'INV-2024-0085',
    clientName: 'Quantum Logistics & Supply',
    clientEmail: 'procure@quantumlog.in',
    clientGstin: '29AABCR8901P1ZD',
    clientAddress: 'Peenya Industrial Area 4th Phase, Bengaluru 560058',
    issueDate: '2024-04-01',
    dueDate: '2024-05-01',
    items: [
      { id: 'item-6', description: 'Enterprise Fleet Staffing Management Suite', hsnSacCode: '998314', quantity: 1, unitPrice: 195000, taxRate: 18, taxAmount: 35100, total: 230100 },
    ],
    subTotal: 195000,
    cgst: 17550,
    sgst: 17550,
    igst: 0,
    totalTax: 35100,
    totalAmount: 230100,
    paidAmount: 0,
    balanceDue: 230100,
    status: 'Overdue',
    paymentTerms: 'Net 30',
    notes: 'Payment reminder sent via finance portal on May 05 and May 15.',
  },
];

// 3. Initial Vendor Bills (Payables)
export const INITIAL_BILLS: VendorBill[] = [
  {
    id: 'bill-001',
    billNumber: 'AWS-INV-99214',
    vendorName: 'Amazon Web Services India Pvt Ltd',
    vendorCategory: 'Cloud Hosting & Infrastructure',
    vendorGstin: '29AABCA9999F1Z1',
    billDate: '2024-05-02',
    dueDate: '2024-05-25',
    items: [
      { id: 'bi-1', description: 'Production Kubernetes Cluster & S3 Storage', category: 'Cloud Servers', quantity: 1, unitPrice: 125000, taxRate: 18, total: 147500 },
    ],
    subTotal: 125000,
    taxAmount: 22500,
    totalAmount: 147500,
    paidAmount: 147500,
    status: 'Paid',
    poReference: 'PO-2024-042',
  },
  {
    id: 'bill-002',
    billNumber: 'WEWORK-BLR-5541',
    vendorName: 'WeWork India Management Private Ltd',
    vendorCategory: 'Real Estate & Facility',
    vendorGstin: '29AABCW1111G1Z3',
    billDate: '2024-05-05',
    dueDate: '2024-05-20',
    items: [
      { id: 'bi-2', description: 'HQ Office Space Lease - 80 Dedicated Desks', category: 'Office Lease', quantity: 1, unitPrice: 280000, taxRate: 18, total: 330400 },
    ],
    subTotal: 280000,
    taxAmount: 50400,
    totalAmount: 330400,
    paidAmount: 330400,
    status: 'Paid',
    poReference: 'PO-2024-010',
  },
  {
    id: 'bill-003',
    billNumber: 'ZOOM-CORP-8812',
    vendorName: 'Zoom Video Communications Inc',
    vendorCategory: 'Software & SaaS Tools',
    billDate: '2024-05-12',
    dueDate: '2024-06-05',
    items: [
      { id: 'bi-3', description: 'Enterprise Video Conferencing & Webinar 1000', category: 'Software Licenses', quantity: 1, unitPrice: 45000, taxRate: 18, total: 53100 },
    ],
    subTotal: 45000,
    taxAmount: 8100,
    totalAmount: 53100,
    paidAmount: 0,
    status: 'Approved',
    poReference: 'PO-2024-058',
  },
  {
    id: 'bill-004',
    billNumber: 'DELL-CORP-4409',
    vendorName: 'Dell Technologies India Pvt Ltd',
    vendorCategory: 'Hardware & Workstations',
    vendorGstin: '29AABCD3333F1Z7',
    billDate: '2024-05-18',
    dueDate: '2024-06-18',
    items: [
      { id: 'bi-4', description: '12x Dell Precision 5680 Workstations for Engineering', category: 'IT Assets', quantity: 12, unitPrice: 180000, taxRate: 18, total: 2548800 },
    ],
    subTotal: 2160000,
    taxAmount: 388800,
    totalAmount: 2548800,
    paidAmount: 0,
    status: 'Pending Approval',
    poReference: 'PO-2024-065',
  },
];

// 4. Initial Bank Accounts & Transactions
export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-hdfc',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200084928192',
    accountType: 'Current Account',
    ifscCode: 'HDFC0000240',
    branch: 'Koramangala 4th Block, Bengaluru',
    ledgerBalance: 4850000,
    statementBalance: 4850000,
    unreconciledCount: 0,
    lastReconciledDate: '2024-05-20',
  },
  {
    id: 'bank-icici',
    bankName: 'ICICI Bank Ltd',
    accountNumber: '000205018392',
    accountType: 'Payroll Account',
    ifscCode: 'ICIC0000002',
    branch: 'Indiranagar 100ft Road, Bengaluru',
    ledgerBalance: 1850000,
    statementBalance: 1925000,
    unreconciledCount: 2,
    lastReconciledDate: '2024-05-15',
  },
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  { id: 'txn-1', bankAccountId: 'bank-hdfc', date: '2024-05-18', description: 'RTGS INWARD - APEX TECHNOLOGIES PVT LTD', referenceNo: 'HDFCR520240518', type: 'Credit', amount: 619500, status: 'Matched', matchedEntityName: 'Apex Technologies (INV-2024-0089)' },
  { id: 'txn-2', bankAccountId: 'bank-hdfc', date: '2024-05-15', description: 'NEFT INWARD - NEXUS GLOBAL FINANCIAL', referenceNo: 'NEXUS5051590', type: 'Credit', amount: 200000, status: 'Matched', matchedEntityName: 'Nexus Global (INV-2024-0090)' },
  { id: 'txn-3', bankAccountId: 'bank-hdfc', date: '2024-05-04', description: 'CMS DEBIT - WEWORK INDIA LEASE MAY 2024', referenceNo: 'WEW9901429', type: 'Debit', amount: 330400, status: 'Matched', matchedEntityName: 'WeWork India (Bill WEWORK-BLR-5541)' },
  { id: 'txn-4', bankAccountId: 'bank-icici', date: '2024-05-16', description: 'SWIFT REMITTANCE / INT CONSULTING', referenceNo: 'SWIFT882190', type: 'Credit', amount: 75000, status: 'Unmatched' },
  { id: 'txn-5', bankAccountId: 'bank-icici', date: '2024-05-17', description: 'BANK SERVICE CHARGES & ESCROW MAINTENANCE', referenceNo: 'ICICICHG501', type: 'Debit', amount: 2500, status: 'Unmatched' },
];

// 5. Initial Payment Receipts Vouchers
export const INITIAL_VOUCHERS: PaymentReceiptVoucher[] = [
  { id: 'vch-001', voucherNumber: 'RCT-2024-012', type: 'Receipt', partyName: 'Apex Technologies Pvt Ltd', partyType: 'Customer', date: '2024-05-18', amount: 619500, paymentMode: 'Bank Transfer (NEFT/RTGS)', referenceNumber: 'HDFCR520240518', bankAccount: 'HDFC Current A/c 8192', status: 'Reconciled', purpose: 'Full settlement of INV-2024-0089' },
  { id: 'vch-002', voucherNumber: 'PAY-2024-019', type: 'Payment', partyName: 'Amazon Web Services India', partyType: 'Vendor', date: '2024-05-03', amount: 147500, paymentMode: 'Credit Card', referenceNumber: 'CC-AUTH-88219', bankAccount: 'HDFC Corporate Card', status: 'Cleared', purpose: 'Settlement for Bill AWS-INV-99214' },
  { id: 'vch-003', voucherNumber: 'PAY-2024-020', type: 'Payment', partyName: 'WeWork India Management', partyType: 'Vendor', date: '2024-05-05', amount: 330400, paymentMode: 'Bank Transfer (NEFT/RTGS)', referenceNumber: 'WEW9901429', bankAccount: 'HDFC Current A/c 8192', status: 'Reconciled', purpose: 'Office Rent for May 2024' },
];

// 6. Initial GST Filing History
export const INITIAL_GST_FILINGS: GstFilingPeriod[] = [
  { periodKey: '2024-04', returnType: 'GSTR-1', outwardTaxableSupplies: 1850000, igstPayable: 120000, cgstPayable: 106500, sgstPayable: 106500, totalLiability: 333000, eligibleItc: 185000, netTaxPaid: 148000, filingDueDate: '2024-05-11', status: 'Filed', arnNumber: 'AA2905240019283' },
  { periodKey: '2024-04', returnType: 'GSTR-3B', outwardTaxableSupplies: 1850000, igstPayable: 120000, cgstPayable: 106500, sgstPayable: 106500, totalLiability: 333000, eligibleItc: 185000, netTaxPaid: 148000, filingDueDate: '2024-05-20', status: 'Filed', arnNumber: 'AA2905240028491' },
  { periodKey: '2024-05', returnType: 'GSTR-1', outwardTaxableSupplies: 2190000, igstPayable: 145000, cgstPayable: 124550, sgstPayable: 124550, totalLiability: 394100, eligibleItc: 210000, netTaxPaid: 184100, filingDueDate: '2024-06-11', status: 'Draft' },
  { periodKey: '2024-05', returnType: 'GSTR-3B', outwardTaxableSupplies: 2190000, igstPayable: 145000, cgstPayable: 124550, sgstPayable: 124550, totalLiability: 394100, eligibleItc: 210000, netTaxPaid: 184100, filingDueDate: '2024-06-20', status: 'Pending' },
];

export const INITIAL_CLIENT_INVOICES: ClientInvoice[] = [
  { id: 'cinv-1', invoiceId: 'INV-2026-001', client: 'Acme Corp', date: '2026-03-01', dueDate: '2026-03-31', amount: 15000, status: 'Paid' },
  { id: 'cinv-2', invoiceId: 'INV-2026-002', client: 'Initech', date: '2026-03-10', dueDate: '2026-04-10', amount: 8400, status: 'Pending' },
  { id: 'cinv-3', invoiceId: 'INV-2026-003', client: 'Soylent', date: '2026-03-15', dueDate: '2026-04-15', amount: 22000, status: 'Draft' },
];

export const INITIAL_JOURNAL_VOUCHERS: JournalVoucher[] = [
  { id: 'jv-1', voucherNo: 'JV-2026-001', type: 'Journal', date: '2026-03-01', description: 'Adjustment for prepaid software subscription', amount: 4500, reference: 'REF-2026-X1', department: 'Corporate' },
  { id: 'jv-2', voucherNo: 'JV-2026-002', type: 'Payment', date: '2026-03-05', description: 'Vendor disbursement settlement', amount: 12800, reference: 'REF-2026-X2', department: 'Corporate' },
];

export const financeService = {
  // Chart of Accounts
  getAccounts: async (): Promise<ChartAccount[]> => {
    return getFromStorage<ChartAccount[]>('finance_chart_of_accounts', INITIAL_ACCOUNTS);
  },

  createAccount: async (account: Omit<ChartAccount, 'id'>): Promise<ChartAccount> => {
    const list = await financeService.getAccounts();
    const newAcc: ChartAccount = {
      ...account,
      id: `acc-${Date.now()}`,
    };
    const updated = [newAcc, ...list];
    saveToStorage('finance_chart_of_accounts', updated);
    return newAcc;
  },

  // Invoices & Receivables
  getInvoices: async (): Promise<Invoice[]> => {
    return getFromStorage<Invoice[]>('finance_invoices', INITIAL_INVOICES);
  },

  createInvoice: async (data: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice> => {
    const list = await financeService.getInvoices();
    const count = list.length + 92;
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2024-00${count}`,
    };
    const updated = [newInv, ...list];
    saveToStorage('finance_invoices', updated);
    return newInv;
  },

  updateInvoiceStatus: async (id: string, status: Invoice['status'], paidAmount?: number): Promise<void> => {
    const list = await financeService.getInvoices();
    const updated = list.map(inv => {
      if (inv.id !== id) return inv;
      const newPaid = paidAmount !== undefined ? paidAmount : inv.paidAmount;
      return {
        ...inv,
        status,
        paidAmount: newPaid,
        balanceDue: Math.max(0, inv.totalAmount - newPaid),
      };
    });
    saveToStorage('finance_invoices', updated);
  },

  // Client Invoices
  getClientInvoices: async (): Promise<ClientInvoice[]> => {
    return getFromStorage<ClientInvoice[]>('finance_client_invoices', INITIAL_CLIENT_INVOICES);
  },

  addInvoice: async (data: Omit<ClientInvoice, 'id' | 'invoiceId'>): Promise<ClientInvoice> => {
    const list = await financeService.getClientInvoices();
    const count = list.length + 1;
    const newInv: ClientInvoice = {
      ...data,
      id: `cinv-${Date.now()}`,
      invoiceId: `INV-2026-00${count}`,
    };
    const updated = [newInv, ...list];
    saveToStorage('finance_client_invoices', updated);
    return newInv;
  },

  updateInvoice: async (id: string, updates: Partial<ClientInvoice>): Promise<void> => {
    const list = await financeService.getClientInvoices();
    const updated = list.map(inv => inv.id === id ? { ...inv, ...updates } : inv);
    saveToStorage('finance_client_invoices', updated);
  },

  // Journal Vouchers
  getJournalVouchers: async (): Promise<JournalVoucher[]> => {
    return getFromStorage<JournalVoucher[]>('finance_journal_vouchers', INITIAL_JOURNAL_VOUCHERS);
  },

  addVoucher: async (data: Omit<JournalVoucher, 'id' | 'voucherNo'>): Promise<JournalVoucher> => {
    const list = await financeService.getJournalVouchers();
    const count = list.length + 1;
    const newVoucher: JournalVoucher = {
      ...data,
      id: `jv-${Date.now()}`,
      voucherNo: `JV-2026-00${count}`,
    };
    const updated = [newVoucher, ...list];
    saveToStorage('finance_journal_vouchers', updated);
    return newVoucher;
  },

  // Bills & Payables
  getBills: async (): Promise<VendorBill[]> => {
    return getFromStorage<VendorBill[]>('finance_bills', INITIAL_BILLS);
  },

  createBill: async (data: Omit<VendorBill, 'id'>): Promise<VendorBill> => {
    const list = await financeService.getBills();
    const newBill: VendorBill = {
      ...data,
      id: `bill-${Date.now()}`,
    };
    const updated = [newBill, ...list];
    saveToStorage('finance_bills', updated);
    return newBill;
  },

  updateBillStatus: async (id: string, status: VendorBill['status'], paidAmount?: number): Promise<void> => {
    const list = await financeService.getBills();
    const updated = list.map(bill => {
      if (bill.id !== id) return bill;
      const newPaid = paidAmount !== undefined ? paidAmount : bill.paidAmount;
      return {
        ...bill,
        status,
        paidAmount: newPaid,
      };
    });
    saveToStorage('finance_bills', updated);
  },

  // Bank Accounts & Reconciliation
  getBankAccounts: async (): Promise<BankAccount[]> => {
    return getFromStorage<BankAccount[]>('finance_bank_accounts', INITIAL_BANK_ACCOUNTS);
  },

  getBankTransactions: async (bankId?: string): Promise<BankTransaction[]> => {
    const all = getFromStorage<BankTransaction[]>('finance_bank_txns', INITIAL_BANK_TRANSACTIONS);
    return bankId ? all.filter(t => t.bankAccountId === bankId) : all;
  },

  matchTransaction: async (txnId: string, matchedEntity: string): Promise<void> => {
    const list = await financeService.getBankTransactions();
    const updated = list.map(t => {
      if (t.id !== txnId) return t;
      return {
        ...t,
        status: 'Matched' as const,
        matchedEntityName: matchedEntity,
      };
    });
    saveToStorage('finance_bank_txns', updated);
  },

  // Vouchers
  getVouchers: async (): Promise<PaymentReceiptVoucher[]> => {
    return getFromStorage<PaymentReceiptVoucher[]>('finance_vouchers', INITIAL_VOUCHERS);
  },

  createVoucher: async (data: Omit<PaymentReceiptVoucher, 'id' | 'voucherNumber'>): Promise<PaymentReceiptVoucher> => {
    const list = await financeService.getVouchers();
    const count = list.length + 101;
    const prefix = data.type === 'Receipt' ? 'RCT' : 'PAY';
    const newVoucher: PaymentReceiptVoucher = {
      ...data,
      id: `vch-${Date.now()}`,
      voucherNumber: `${prefix}-2024-${count}`,
    };
    const updated = [newVoucher, ...list];
    saveToStorage('finance_vouchers', updated);
    return newVoucher;
  },

  // GST Filings
  getGstFilings: async (): Promise<GstFilingPeriod[]> => {
    return getFromStorage<GstFilingPeriod[]>('finance_gst_filings', INITIAL_GST_FILINGS);
  },

  // Financial Statements Metrics (P&L, Balance Sheet, Cash Flow)
  getFinancialStatements: async () => {
    const accounts = await financeService.getAccounts();
    const invoices = await financeService.getInvoices();
    const bills = await financeService.getBills();

    const totalRevenue = accounts.filter(a => a.category === 'Revenue').reduce((s, a) => s + a.balance, 0);
    const totalExpenses = accounts.filter(a => a.category === 'Expense').reduce((s, a) => s + a.balance, 0);
    const grossProfit = totalRevenue - 1450000; // revenue minus direct COGS/hosting
    const netProfit = totalRevenue - totalExpenses;
    const ebitda = netProfit + 650000; // add back depreciation

    const totalAssets = accounts.filter(a => a.category === 'Asset').reduce((s, a) => s + a.balance, 0);
    const totalLiabilities = accounts.filter(a => a.category === 'Liability').reduce((s, a) => s + a.balance, 0);
    const totalEquity = accounts.filter(a => a.category === 'Equity').reduce((s, a) => s + a.balance, 0);

    return {
      pnl: {
        totalRevenue,
        cogs: 1450000,
        grossProfit,
        operatingExpenses: totalExpenses - 1450000,
        ebitda,
        depreciation: 650000,
        netProfit,
        profitMargin: Math.round((netProfit / totalRevenue) * 100),
      },
      balanceSheet: {
        currentAssets: 10645000,
        fixedAssets: 3400000, // 2850000 + 1200000 - 650000
        totalAssets,
        currentLiabilities: 5305000,
        longTermLiabilities: 4000000,
        totalLiabilities,
        totalEquity: totalAssets - totalLiabilities,
        isBalanced: true,
      },
      cashFlow: {
        cashFromOperations: 3840000,
        cashFromInvesting: -850000, // laptop and workstation purchase
        cashFromFinancing: -420000, // debt repayment
        netCashFlow: 2570000,
        openingCash: 4130000,
        closingCash: 6700000,
      }
    };
  }
};
