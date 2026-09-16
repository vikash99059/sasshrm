import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Building2,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  RefreshCw,
  Send,
  Eye,
  Printer,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  FileText,
  Check,
  Copy,
  ChevronDown,
  Settings,
  Activity,
  Percent,
  Zap,
  RotateCcw,
  Sliders,
  X
} from 'lucide-react';
import { Button, Badge, Modal } from '../../components/ui';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceItem {
  id: string;
  tenantName: string;
  domain: string;
  adminEmail: string;
  address: string;
  taxId: string;
  planName: string;
  planTier: 'Enterprise' | 'Modular Pro' | 'Growth' | 'Starter';
  billingCycle: 'Annual' | 'Monthly' | 'Quarterly';
  invoiceNumber: string;
  transactionRef: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  taxRate: number; // e.g. 0.18 for 18%
  taxAmount: number;
  discountAmount?: number;
  amount: number;
  paymentMethod: string;
  paymentCardBrand: 'visa' | 'mastercard' | 'ach' | 'wire' | 'razorpay';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  lineItems: InvoiceLineItem[];
  notes?: string;
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'INV-01',
    tenantName: 'Apex Global Corp',
    domain: 'apex.saas-hrm.com',
    adminEmail: 'billing@apexcorp.com',
    address: '100 Montgomery St, Suite 1800, San Francisco, CA 94104',
    taxId: 'US-EIN-94-3829104',
    planName: 'Enterprise Modular Suite',
    planTier: 'Enterprise',
    billingCycle: 'Annual',
    invoiceNumber: 'INV-2026-0089',
    transactionRef: 'ch_3N8w72K9aLq001',
    issueDate: 'Sep 01, 2026',
    dueDate: 'Sep 15, 2026',
    paidDate: 'Sep 01, 2026 10:24 AM',
    subtotal: 4800.0,
    taxRate: 0.18,
    taxAmount: 864.0,
    amount: 5664.0,
    paymentMethod: 'ACH Direct Debit (•••• 8912)',
    paymentCardBrand: 'ach',
    status: 'Paid',
    lineItems: [
      { description: 'Core HRM & Modular Workforce Base (Annual)', quantity: 1, unitPrice: 3200, total: 3200 },
      { description: 'Extra Corporate Seat Quota (150 Seats)', quantity: 150, unitPrice: 8, total: 1200 },
      { description: 'AI Payroll Automation & Dedicated Cloud Worker', quantity: 1, unitPrice: 400, total: 400 }
    ],
    notes: 'Payment processed automatically via Stripe ACH Direct Settlement.'
  },
  {
    id: 'INV-02',
    tenantName: 'Nexlify Technologies',
    domain: 'nexlify.saas-hrm.com',
    adminEmail: 'finance@nexlify.io',
    address: '450 Lexington Ave, New York, NY 10017',
    taxId: 'US-EIN-13-9920194',
    planName: 'Modular Pro Platform',
    planTier: 'Modular Pro',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0090',
    transactionRef: 'ch_3N8w72K9aLq002',
    issueDate: 'Sep 01, 2026',
    dueDate: 'Sep 15, 2026',
    paidDate: 'Sep 01, 2026 02:15 PM',
    subtotal: 3400.0,
    taxRate: 0.18,
    taxAmount: 612.0,
    amount: 4012.0,
    paymentMethod: 'Visa (•••• 4242)',
    paymentCardBrand: 'visa',
    status: 'Paid',
    lineItems: [
      { description: 'Recruitment & ATS Pro Module (Monthly)', quantity: 1, unitPrice: 1400, total: 1400 },
      { description: 'Performance & OKR Review Suite', quantity: 1, unitPrice: 1000, total: 1000 },
      { description: 'Employee Self-Service Mobile Access (200 Seats)', quantity: 200, unitPrice: 5, total: 1000 }
    ],
    notes: 'Card charged successfully on primary Stripe terminal.'
  },
  {
    id: 'INV-03',
    tenantName: 'HyperFlow Logistics',
    domain: 'hyperflow.saas-hrm.com',
    adminEmail: 'accounts@hyperflow.com',
    address: '88 King St West, Toronto, ON M5H 1J9, Canada',
    taxId: 'CA-BN-892019482',
    planName: 'Growth Scale Plan',
    planTier: 'Growth',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0091',
    transactionRef: 'ch_3N8w72K9aLq003',
    issueDate: 'Sep 01, 2026',
    dueDate: 'Sep 15, 2026',
    paidDate: 'Sep 02, 2026 09:40 AM',
    subtotal: 1850.0,
    taxRate: 0.18,
    taxAmount: 333.0,
    amount: 2183.0,
    paymentMethod: 'MasterCard (•••• 9831)',
    paymentCardBrand: 'mastercard',
    status: 'Paid',
    lineItems: [
      { description: 'Shift Scheduling & Geofencing GPS Module', quantity: 1, unitPrice: 950, total: 950 },
      { description: 'Time & Attendance Biometric Sync API', quantity: 1, unitPrice: 900, total: 900 }
    ],
    notes: 'Recurring monthly automated subscription billing.'
  },
  {
    id: 'INV-04',
    tenantName: 'Aether Cloud Labs',
    domain: 'aether.saas-hrm.com',
    adminEmail: 'billing@aethercloud.co',
    address: '710 2nd Ave, Seattle, WA 98104',
    taxId: 'US-EIN-91-8849201',
    planName: 'Starter Modular Plan',
    planTier: 'Starter',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0092',
    transactionRef: 'ch_3N8w72K9aLq004',
    issueDate: 'Sep 05, 2026',
    dueDate: 'Sep 20, 2026',
    paidDate: 'Sep 05, 2026 11:10 AM',
    subtotal: 1200.0,
    taxRate: 0.18,
    taxAmount: 216.0,
    amount: 1416.0,
    paymentMethod: 'Visa (•••• 1120)',
    paymentCardBrand: 'visa',
    status: 'Paid',
    lineItems: [
      { description: 'Core HR & Employee Directory (Up to 50 Seats)', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'Leave & Holiday Management Module', quantity: 1, unitPrice: 400, total: 400 }
    ]
  },
  {
    id: 'INV-05',
    tenantName: 'Zenith BioPharm',
    domain: 'zenith.saas-hrm.com',
    adminEmail: 'payables@zenithbiopharm.com',
    address: '200 Technology Square, Cambridge, MA 02139',
    taxId: 'US-EIN-04-1928472',
    planName: 'Enterprise Custom Tier',
    planTier: 'Enterprise',
    billingCycle: 'Annual',
    invoiceNumber: 'INV-2026-0093',
    transactionRef: 'wire_99201847201',
    issueDate: 'Sep 10, 2026',
    dueDate: 'Sep 25, 2026',
    paidDate: 'Sep 11, 2026 04:30 PM',
    subtotal: 6500.0,
    taxRate: 0.18,
    taxAmount: 1170.0,
    amount: 7670.0,
    paymentMethod: 'ACH Corporate Wire Transfer',
    paymentCardBrand: 'wire',
    status: 'Paid',
    lineItems: [
      { description: 'Global Multi-Entity Compliance Suite (Annual)', quantity: 1, unitPrice: 4500, total: 4500 },
      { description: 'Enterprise Audit Logs & 21 CFR Part 11 Signoff Module', quantity: 1, unitPrice: 2000, total: 2000 }
    ],
    notes: 'Wire reference verified against corporate bank clearinghouse.'
  },
  {
    id: 'INV-06',
    tenantName: 'OmniVanguard Logistics',
    domain: 'omni.saas-hrm.com',
    adminEmail: 'treasury@omnivanguard.io',
    address: '1200 Brickell Ave, Miami, FL 33131',
    taxId: 'US-EIN-65-8819201',
    planName: 'Modular Pro Platform',
    planTier: 'Modular Pro',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0094',
    transactionRef: 'ch_failed_3N8w72',
    issueDate: 'Sep 12, 2026',
    dueDate: 'Sep 26, 2026',
    subtotal: 2900.0,
    taxRate: 0.18,
    taxAmount: 522.0,
    amount: 3422.0,
    paymentMethod: 'Visa (•••• 3099)',
    paymentCardBrand: 'visa',
    status: 'Failed',
    lineItems: [
      { description: 'Fleet Driver Attendance & Daily Payroll Bridge', quantity: 1, unitPrice: 1900, total: 1900 },
      { description: 'Automated Overtime & Bonus Engine', quantity: 1, unitPrice: 1000, total: 1000 }
    ],
    notes: 'Stripe decline code: card_expired. Smart Dunning retry sequence 1 of 3 active.'
  },
  {
    id: 'INV-07',
    tenantName: 'Veritas Fintech',
    domain: 'veritas.saas-hrm.com',
    adminEmail: 'billing@veritasfintech.com',
    address: '500 Howard St, San Francisco, CA 94105',
    taxId: 'US-EIN-94-1928471',
    planName: 'Growth Scale Plan',
    planTier: 'Growth',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0095',
    transactionRef: 'razor_pay_8910284',
    issueDate: 'Sep 14, 2026',
    dueDate: 'Sep 28, 2026',
    subtotal: 1850.0,
    taxRate: 0.18,
    taxAmount: 333.0,
    amount: 2183.0,
    paymentMethod: 'Razorpay Corporate NetBanking',
    paymentCardBrand: 'razorpay',
    status: 'Pending',
    lineItems: [
      { description: 'Fintech Salary Escrow & Tax TDS Calculator', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'Employee Benefits & Health Insurance Portal', quantity: 1, unitPrice: 650, total: 650 }
    ],
    notes: 'Awaiting webhook settlement confirmation from Razorpay gateway.'
  },
  {
    id: 'INV-08',
    tenantName: 'Solaria Energy Systems',
    domain: 'solaria.saas-hrm.com',
    adminEmail: 'invoices@solariaenergy.com',
    address: '3000 El Camino Real, Palo Alto, CA 94306',
    taxId: 'US-EIN-77-9018274',
    planName: 'Starter Modular Plan',
    planTier: 'Starter',
    billingCycle: 'Monthly',
    invoiceNumber: 'INV-2026-0096',
    transactionRef: 'ch_ref_3N8w7209',
    issueDate: 'Aug 20, 2026',
    dueDate: 'Sep 04, 2026',
    paidDate: 'Aug 20, 2026',
    subtotal: 850.0,
    taxRate: 0.18,
    taxAmount: 153.0,
    amount: 1003.0,
    paymentMethod: 'MasterCard (•••• 1044)',
    paymentCardBrand: 'mastercard',
    status: 'Refunded',
    lineItems: [
      { description: 'Prorated Monthly Trial Refund (Early Cancellation)', quantity: 1, unitPrice: 850, total: 850 }
    ],
    notes: 'Refund of $1,003.00 initiated per service-level satisfaction guarantee.'
  }
];

export const SaasBillingInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Paid' | 'Pending' | 'Failed' | 'Refunded'>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isGatewaySettingsOpen, setIsGatewaySettingsOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Invoice Form State
  const [newTenantName, setNewTenantName] = useState('Apex Global Corp');
  const [newPlanTier, setNewPlanTier] = useState<'Enterprise' | 'Modular Pro' | 'Growth' | 'Starter'>('Enterprise');
  const [newBillingCycle, setNewBillingCycle] = useState<'Monthly' | 'Annual'>('Annual');
  const [newItemDesc, setNewItemDesc] = useState('Custom Enterprise Expansion & Dedicated Server');
  const [newItemPrice, setNewItemPrice] = useState('2400');
  const [newDueDate, setNewDueDate] = useState('2026-10-01');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currencySymbol = useMemo(() => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      default: return '$';
    }
  }, [currency]);

  const currencyMultiplier = useMemo(() => {
    switch (currency) {
      case 'EUR': return 0.92;
      case 'GBP': return 0.78;
      case 'INR': return 83.5;
      default: return 1.0;
    }
  }, [currency]);

  const formatAmount = (val: number) => {
    const converted = val * currencyMultiplier;
    return `${currencySymbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchTier = tierFilter === 'ALL' || inv.planTier === tierFilter;

      return matchSearch && matchStatus && matchTier;
    });
  }, [invoices, searchTerm, statusFilter, tierFilter]);

  // Aggregate Metrics
  const totalBilled = useMemo(() => invoices.reduce((sum, i) => sum + (i.status !== 'Refunded' ? i.amount : 0), 0), [invoices]);
  const totalCollected = useMemo(() => invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0), [invoices]);
  const totalPending = useMemo(() => invoices.filter((i) => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0), [invoices]);
  const totalFailed = useMemo(() => invoices.filter((i) => i.status === 'Failed').reduce((sum, i) => sum + i.amount, 0), [invoices]);
  const totalTaxes = useMemo(() => invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.taxAmount, 0), [invoices]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInvoiceId(id);
    setTimeout(() => setCopiedInvoiceId(null), 2000);
    showToast(`Copied ${text} to clipboard`);
  };

  const handleOpenInvoice = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleRetryCharge = (inv: InvoiceItem) => {
    showToast(`Retrying Stripe payment charge for ${inv.tenantName}...`);
    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === inv.id
            ? {
                ...item,
                status: 'Paid',
                paidDate: new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                notes: 'Charge succeeded after automatic retry sequence via Stripe.'
              }
            : item
        )
      );
      showToast(`Payment successful! ${inv.invoiceNumber} marked as Paid.`);
    }, 1200);
  };

  const handleMarkAsPaid = (inv: InvoiceItem) => {
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === inv.id
          ? {
              ...item,
              status: 'Paid',
              paidDate: new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              notes: 'Manually marked as paid by SaaS Super Admin.'
            }
          : item
      )
    );
    if (selectedInvoice && selectedInvoice.id === inv.id) {
      setSelectedInvoice((prev) => prev ? { ...prev, status: 'Paid' } : null);
    }
    showToast(`Invoice ${inv.invoiceNumber} marked as Paid.`);
  };

  const handleSendReminder = (inv: InvoiceItem) => {
    showToast(`Payment reminder & invoice link emailed to ${inv.adminEmail}`);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newItemPrice) || 1200;
    const taxNum = priceNum * 0.18;
    const totalNum = priceNum + taxNum;

    const newInv: InvoiceItem = {
      id: `INV-${String(invoices.length + 1).padStart(2, '0')}`,
      tenantName: newTenantName,
      domain: `${newTenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.saas-hrm.com`,
      adminEmail: `billing@${newTenantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      address: 'Corporate Headquarters',
      taxId: 'US-EIN-PENDING',
      planName: `${newPlanTier} Custom Contract`,
      planTier: newPlanTier,
      billingCycle: newBillingCycle,
      invoiceNumber: `INV-2026-0${String(100 + invoices.length)}`,
      transactionRef: `ref_pending_${Date.now()}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: newDueDate,
      subtotal: priceNum,
      taxRate: 0.18,
      taxAmount: taxNum,
      amount: totalNum,
      paymentMethod: 'Credit Card / ACH on File',
      paymentCardBrand: 'visa',
      status: 'Pending',
      lineItems: [
        {
          description: newItemDesc,
          quantity: 1,
          unitPrice: priceNum,
          total: priceNum
        }
      ],
      notes: 'Generated via SaaS Owner custom invoice creator.'
    };

    setInvoices([newInv, ...invoices]);
    setIsCreateInvoiceOpen(false);
    showToast(`Invoice ${newInv.invoiceNumber} created and dispatched!`);
  };

  const renderCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return (
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] tracking-tighter">
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[9px] tracking-tighter">
            MC
          </span>
        );
      case 'ach':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[9px] tracking-tight">
            ACH
          </span>
        );
      case 'wire':
        return (
          <span className="px-1.5 py-0.5 rounded bg-purple-700 text-white font-bold text-[9px] tracking-tight">
            WIRE
          </span>
        );
      case 'razorpay':
        return (
          <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[9px] tracking-tight">
            RZP
          </span>
        );
      default:
        return <CreditCard className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-800 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HERO BANNER (WAVY & CLOUDY DESIGN) */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-[#EFF6FF] via-[#E2EFFF] to-[#D5E8FE] px-4 py-3.5 sm:px-5 sm:py-4 shadow-xs dark:border-slate-800 dark:bg-gradient-to-r dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0F172A]">
        {/* WAVY & CLOUDY FLOWING BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Light Mode Ambient Glows */}
          <div className="dark:hidden absolute -right-8 -top-12 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/45 via-sky-200/40 to-white/70 blur-3xl" />
          <div className="dark:hidden absolute right-1/4 top-1/2 -translate-y-1/2 h-64 w-72 rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/50 to-white/60 blur-2xl" />
          <div className="dark:hidden absolute left-1/3 -bottom-10 h-52 w-96 rounded-full bg-blue-100/50 blur-2xl" />

          {/* Dark Mode Ambient Glows */}
          <div className="hidden dark:block absolute -right-8 -top-12 h-80 w-80 rounded-full bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
          <div className="hidden dark:block absolute right-1/4 top-1/2 -translate-y-1/2 h-64 w-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-blue-600/10 to-transparent blur-2xl" />
          <div className="hidden dark:block absolute left-1/3 -bottom-10 h-52 w-96 rounded-full bg-blue-900/20 blur-2xl" />

          {/* Light Mode Layered Translucent SVG Waves */}
          <svg
            className="absolute inset-0 h-full w-full object-cover dark:hidden"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="billingWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#BFDBFE" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="billingWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#DBEAFE" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            <path
              d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
              fill="url(#billingWave1)"
            />
            <path
              d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
              fill="url(#billingWave2)"
            />
          </svg>

          {/* Dark Mode Layered Subtle Midnight SVG Waves */}
          <svg
            className="absolute inset-0 h-full w-full object-cover hidden dark:block opacity-60"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="billingWaveDark1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="billingWaveDark2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#172554" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <path
              d="M0,70 C240,125 480,25 740,75 C940,115 1100,45 1200,70 L1200,240 L0,240 Z"
              fill="url(#billingWaveDark1)"
            />
            <path
              d="M0,130 C190,80 430,145 690,90 C930,40 1090,110 1200,75 L1200,240 L0,240 Z"
              fill="url(#billingWaveDark2)"
            />
          </svg>
        </div>

        {/* CONTENT ROW */}
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Left Column: Icon + Title + Status + Chips */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex-shrink-0 ring-2 ring-white/90 dark:ring-slate-700">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Billing, Invoices & Payment Gateway
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/80 text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Stripe Live
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
                Manage automated tenant subscriptions, custom billing statements, tax remittance, and live webhook logs.
              </p>

              {/* Quick Info Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/80 shadow-2xs">
                  <ShieldCheck className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
                    PCI-DSS Level 1
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/80 shadow-2xs">
                  <Activity className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
                    Auto-Dunning Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-blue-100/70 dark:border-slate-700/80 shadow-2xs">
                  <Zap className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
                    T+1 Settlement
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Perfectly Aligned Action Bar */}
          <div className="flex flex-wrap items-center gap-2 self-start xl:self-center xl:justify-end">
            {/* Currency Switcher */}
            <div className="flex items-center rounded-xl bg-white/90 dark:bg-slate-800/90 p-1 border border-blue-200/80 dark:border-slate-700/80 shadow-2xs text-xs font-bold backdrop-blur-sm">
              {(['USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Activity className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Webhooks</span>
            </button>

            <button
              onClick={() => setIsGatewaySettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Gateway Config</span>
            </button>

            <button
              onClick={() => showToast('Exporting all invoice records as CSV...')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white px-3.5 py-1.5 shadow-sm shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE FINANCIAL KPI CARDS (5 METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Billed Volume */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Billed Volume</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatAmount(totalBilled)}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+16.4% vs last billing cycle</span>
          </div>
        </div>

        {/* Paid & Collected */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Settled Collections</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatAmount(totalCollected)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{invoices.filter((i) => i.status === 'Paid').length} invoices paid</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">98.2% capture</span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Receivables</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              {formatAmount(totalPending)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{invoices.filter((i) => i.status === 'Pending').length} awaiting clearing</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">Due within 14d</span>
          </div>
        </div>

        {/* Failed Charges / Dunning */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Failed / At Risk</span>
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              {formatAmount(totalFailed)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-500 font-medium">
            <span>1 card expired error</span>
            <span className="underline cursor-pointer" onClick={() => setStatusFilter('Failed')}>View item</span>
          </div>
        </div>

        {/* Tax Remitted & Gateway Fees */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tax Remittance (18%)</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatAmount(totalTaxes)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>GST / VAT Automated</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Compliant</span>
          </div>
        </div>
      </div>

      {/* 3. GATEWAY HEALTH & REALTIME STRIPE BANNER */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-indigo-50/50 dark:from-[#0F172A] dark:via-[#111C38] dark:to-[#0F172A] p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/25">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Multi-Gateway Automated Processing
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                Stripe v2024-04-10
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              ACH direct debit settlements, automatic 3-step dunning retries, and instant multi-tenant webhook dispatches are fully active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto flex-shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Settlement</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">T+1 Business Day</span>
          </div>
          <button
            onClick={() => showToast('Payment gateway health verified. All endpoints returning 200 OK.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Test Webhooks</span>
          </button>
        </div>
      </div>

      {/* 4. SEARCH, STATUS TABS & FILTERS */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'All Invoices', val: 'ALL', count: invoices.length },
              { label: 'Paid', val: 'Paid', count: invoices.filter((i) => i.status === 'Paid').length },
              { label: 'Pending', val: 'Pending', count: invoices.filter((i) => i.status === 'Pending').length },
              { label: 'Failed', val: 'Failed', count: invoices.filter((i) => i.status === 'Failed').length },
              { label: 'Refunded', val: 'Refunded', count: invoices.filter((i) => i.status === 'Refunded').length }
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.val
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    statusFilter === tab.val
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Tier Filter */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant, invoice #, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Modular Pro">Modular Pro</option>
              <option value="Growth">Growth</option>
              <option value="Starter">Starter</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. INVOICES MASTER TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Invoice #</th>
                <th className="py-3.5 px-4">Tenant / Organization</th>
                <th className="py-3.5 px-4">Plan & Billing</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No invoices match your search or filter</p>
                    <p className="text-xs mt-0.5">Try resetting search query or status filter</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group cursor-pointer"
                    onClick={() => handleOpenInvoice(inv)}
                  >
                    {/* Invoice ID */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-600 dark:text-blue-400 group-hover:underline">{inv.invoiceNumber}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(inv.invoiceNumber, inv.id);
                          }}
                          className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-pointer transition-colors"
                          title="Copy Invoice #"
                        >
                          {copiedInvoiceId === inv.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal font-sans block">{inv.transactionRef}</span>
                    </td>

                    {/* Tenant Organization */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100 dark:border-blue-900/60">
                          {inv.tenantName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <span>{inv.tenantName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{inv.domain}</div>
                        </div>
                      </div>
                    </td>

                    {/* Plan Tier & Billing Cycle */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                              inv.planTier === 'Enterprise'
                                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                : inv.planTier === 'Modular Pro'
                                ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {inv.planTier}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {inv.billingCycle}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{inv.lineItems.length} active service items</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">Issued: {inv.issueDate}</div>
                      <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        {renderCardIcon(inv.paymentCardBrand)}
                        <span>{inv.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {formatAmount(inv.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Incl. {formatAmount(inv.taxAmount)} tax
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : inv.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                            : inv.status === 'Refunded'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-500'
                              : inv.status === 'Pending'
                              ? 'bg-amber-500 animate-pulse'
                              : inv.status === 'Refunded'
                              ? 'bg-purple-500'
                              : 'bg-rose-500 animate-pulse'
                          }`}
                        />
                        {inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status === 'Failed' && (
                          <button
                            onClick={() => handleRetryCharge(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            title="Retry Stripe Charge"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}

                        {inv.status === 'Pending' && (
                          <button
                            onClick={() => handleSendReminder(inv)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                            title="Send Reminder Email"
                          >
                            <Send className="w-3 h-3 text-amber-500" />
                            <span>Remind</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenInvoice(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-750 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Info */}
        <div className="p-3 sm:px-5 bg-slate-50/80 dark:bg-slate-850/60 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredInvoices.length}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{invoices.length}</strong> invoices
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Stripe Connected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Auto-Tax Automated (18%)
            </span>
          </div>
        </div>
      </div>

      {/* 6. FULL INVOICE PREVIEW / PRINT MODAL */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Official SaaS Tax Invoice"
        description="Comprehensive billing statement and transaction settlement ledger."
        size="2xl"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              {selectedInvoice && selectedInvoice.status !== 'Paid' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedInvoice && handleMarkAsPaid(selectedInvoice)}
                  className="text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Mark as Settled / Paid
                </Button>
              )}
              {selectedInvoice && selectedInvoice.status === 'Paid' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast(`Receipt copy dispatched to ${selectedInvoice.adminEmail}`)}
                >
                  <Send className="w-4 h-4 mr-1.5 text-blue-500" />
                  Email Receipt
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Print Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast(`Downloading PDF for ${selectedInvoice?.invoiceNumber}...`);
                  setIsInvoiceModalOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download PDF
              </Button>
            </div>
          </div>
        }
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
            {/* INVOICE HEADER */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 p-5 overflow-hidden">
              {/* WATERMARK STAMP */}
              <div className="absolute right-6 top-6 select-none opacity-80 pointer-events-none">
                <span
                  className={`inline-block px-4 py-1.5 rounded-xl text-sm font-black tracking-widest uppercase border-2 rotate-[-6deg] shadow-sm ${
                    selectedInvoice.status === 'Paid'
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80'
                      : selectedInvoice.status === 'Pending'
                      ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/80'
                      : selectedInvoice.status === 'Refunded'
                      ? 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/80'
                      : 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/80'
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      SH
                    </div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                      SaaS-HRM Cloud Technologies Inc.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    500 Howard Street, Suite 400<br />
                    San Francisco, CA 94105, United States<br />
                    GSTIN / Tax ID: US-EIN-88-2910482
                  </p>
                </div>

                <div className="text-right sm:mr-32">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INVOICE NUMBER</span>
                  <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <div>Issued: <strong className="text-slate-800 dark:text-slate-200">{selectedInvoice.issueDate}</strong></div>
                    <div>Due Date: <strong className="text-slate-800 dark:text-slate-200">{selectedInvoice.dueDate}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BILLED TO & PAYMENT META GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1.5">
                  BILLED TO TENANT
                </span>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {selectedInvoice.tenantName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 space-y-0.5">
                  <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{selectedInvoice.domain}</p>
                  <p>{selectedInvoice.address}</p>
                  <p>Billing Contact: {selectedInvoice.adminEmail}</p>
                  <p>Tax Reg / VAT: {selectedInvoice.taxId}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1.5">
                  PAYMENT & SETTLEMENT INFO
                </span>
                <div className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Payment Channel:</span>
                    <strong className="text-slate-900 dark:text-white">{selectedInvoice.paymentMethod}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Ref:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{selectedInvoice.transactionRef}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan Tier:</span>
                    <strong className="text-purple-600 dark:text-purple-400">{selectedInvoice.planTier} ({selectedInvoice.billingCycle})</strong>
                  </div>
                  {selectedInvoice.paidDate && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Paid Timestamp:</span>
                      <span>{selectedInvoice.paidDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ITEMIZED SERVICES TABLE */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty / Seats</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedInvoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {formatAmount(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-slate-900 dark:text-white">
                        {formatAmount(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* CALCULATION TOTALS */}
              <div className="bg-slate-50/80 dark:bg-slate-850/60 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatAmount(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST / State VAT (18%):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatAmount(selectedInvoice.taxAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{formatAmount(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AUDIT NOTE */}
            {selectedInvoice.notes && (
              <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 p-3 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Audit Ledger Note:</strong> {selectedInvoice.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 7. CREATE NEW INVOICE MODAL */}
      <Modal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        title="Create New Tenant Invoice"
        description="Dispatch a custom billing invoice or add-on seat statement directly to a tenant."
        size="lg"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Tenant Organization
            </label>
            <select
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Apex Global Corp">Apex Global Corp (apex.saas-hrm.com)</option>
              <option value="Nexlify Technologies">Nexlify Technologies (nexlify.saas-hrm.com)</option>
              <option value="HyperFlow Logistics">HyperFlow Logistics (hyperflow.saas-hrm.com)</option>
              <option value="Aether Cloud Labs">Aether Cloud Labs (aether.saas-hrm.com)</option>
              <option value="Zenith BioPharm">Zenith BioPharm (zenith.saas-hrm.com)</option>
              <option value="OmniVanguard Logistics">OmniVanguard Logistics (omni.saas-hrm.com)</option>
              <option value="Veritas Fintech">Veritas Fintech (veritas.saas-hrm.com)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Plan Tier
              </label>
              <select
                value={newPlanTier}
                onChange={(e) => setNewPlanTier(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Modular Pro">Modular Pro</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Billing Cycle
              </label>
              <select
                value={newBillingCycle}
                onChange={(e) => setNewBillingCycle(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Annual">Annual (Prepaid)</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Line Item Description
            </label>
            <input
              type="text"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Base Subtotal Amount ($ USD)
              </label>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex justify-between items-center">
            <span>Estimated Total with 18% Tax:</span>
            <strong className="text-sm font-black font-mono">
              ${((parseFloat(newItemPrice) || 0) * 1.18).toFixed(2)}
            </strong>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateInvoiceOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Generate & Dispatch Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* 8. GATEWAY CONFIGURATION MODAL */}
      <Modal
        isOpen={isGatewaySettingsOpen}
        onClose={() => setIsGatewaySettingsOpen(false)}
        title="Payment Gateway & API Credentials"
        description="Configure live Stripe, Razorpay, ACH, and webhook automated settlement rules."
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-850/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px]">STRIPE</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Stripe Live Gateway</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                CONNECTED
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                readOnly
                value="pk_live_51Mz9810KqL8201849201948291048201"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] text-slate-600 dark:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Stripe Webhook Secret (Signing Key)
              </label>
              <input
                type="password"
                readOnly
                value="whsec_891028472910482910482910482910"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] text-slate-600 dark:text-slate-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-850/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">RAZORPAY</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Razorpay Direct Settlement (INR)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Key ID
              </label>
              <input
                type="text"
                readOnly
                value="rzp_live_992018472019"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] text-slate-600 dark:text-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setIsGatewaySettingsOpen(false)}>
              Close Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* 9. REALTIME WEBHOOK EVENTS MODAL */}
      <Modal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        title="Live Webhook Dispatch Stream"
        description="Real-time event stream from Stripe, ACH networks, and multi-tenant billing services."
        size="lg"
      >
        <div className="space-y-3 text-xs">
          {[
            { event: 'invoice.payment_succeeded', time: '10:24 AM', tenant: 'Apex Global Corp', id: 'evt_3N8w7201', code: 200 },
            { event: 'customer.subscription.updated', time: '09:40 AM', tenant: 'HyperFlow Logistics', id: 'evt_3N8w7202', code: 200 },
            { event: 'charge.failed', time: 'Yesterday 04:12 PM', tenant: 'OmniVanguard Logistics', id: 'evt_3N8w7203', code: 402 },
            { event: 'invoice.created', time: 'Yesterday 02:00 PM', tenant: 'Nexlify Technologies', id: 'evt_3N8w7204', code: 200 },
            { event: 'charge.refunded', time: 'Aug 20, 2026', tenant: 'Solaria Energy Systems', id: 'evt_3N8w7205', code: 200 }
          ].map((wh, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs font-mono text-[11px]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    wh.code === 200
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {wh.code}
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white font-sans">{wh.event}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{wh.tenant} • {wh.id}</div>
                </div>
              </div>
              <span className="text-slate-400 text-[10px]">{wh.time}</span>
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsWebhookModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SaasBillingInvoicesPage;

