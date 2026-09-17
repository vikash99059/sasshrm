import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import {
  Card,
  Badge,
  Button,
  StatCard,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '../../utils';

export const FinancialStatementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pnl' | 'balanceSheet' | 'cashFlow'>('pnl');
  const [statements, setStatements] = useState<any>(null);
  const [period, setPeriod] = useState<'FY2024-25' | 'Q1-2024' | 'Q4-2023'>('FY2024-25');

  useEffect(() => {
    const load = async () => {
      const data = await financeService.getFinancialStatements();
      setStatements(data);
    };
    load();
  }, []);

  const monthlyPnlTrend = [
    { month: 'Dec', revenue: 1650, expenses: 1120, profit: 530 },
    { month: 'Jan', revenue: 1720, expenses: 1180, profit: 540 },
    { month: 'Feb', revenue: 1810, expenses: 1220, profit: 590 },
    { month: 'Mar', revenue: 1950, expenses: 1280, profit: 670 },
    { month: 'Apr', revenue: 2050, expenses: 1340, profit: 710 },
    { month: 'May', revenue: 2190, expenses: 1420, profit: 770 },
  ];

  if (!statements) {
    return <div className="p-8 text-center text-slate-400">Loading Financial Statements...</div>;
  }

  const { pnl, balanceSheet, cashFlow } = statements;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Financial Statements & Management Reports"
        subtitle="Executive Profit & Loss Statement (P&L), Balance Sheet, and Statement of Cash Flows with real-time General Ledger aggregation."
        icon={BarChart3}
        badge={<Badge variant="primary">{period}</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => window.print()}
            >
              Print Financial Packet
            </Button>
            <Button
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => alert('Exporting full audited statement workbook in Excel format...')}
            >
              Export Excel Workbook
            </Button>
          </div>
        }
      />

      {/* TOP METRIC SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Operating Revenue"
          value={formatCurrency(pnl.totalRevenue)}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="+18.4% YoY"
          isPositive={true}
        />
        <StatCard
          title="Net Operating Profit (PAT)"
          value={formatCurrency(pnl.netProfit)}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change={`${pnl.profitMargin}% Net Margin`}
          isPositive={true}
        />
        <StatCard
          title="Enterprise Total Assets"
          value={formatCurrency(balanceSheet.totalAssets)}
          icon={<Building2 className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="Balanced with Liabilities & Equity"
          isPositive={true}
        />
        <StatCard
          title="Net Closing Cash Reserve"
          value={formatCurrency(cashFlow.closingCash)}
          icon={<ShieldCheck className="h-5 w-5 text-teal-600" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          change="Liquidity Runway: 14 Months"
          isPositive={true}
        />
      </div>

      {/* STATEMENT TABS SELECTOR */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'pnl'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          1. Profit & Loss Statement (P&L)
        </button>
        <button
          onClick={() => setActiveTab('balanceSheet')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'balanceSheet'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          2. Balance Sheet (Assets & Liabilities)
        </button>
        <button
          onClick={() => setActiveTab('cashFlow')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'cashFlow'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          3. Cash Flow Statement
        </button>
      </div>

      {/* TAB 1: PROFIT & LOSS */}
      {activeTab === 'pnl' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Income Statement Line Items</h3>
                <span className="text-xs text-slate-400">All figures in INR (₹)</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* REVENUE */}
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
                  I. Operating Revenue & Sales
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">SaaS Platform Subscription Income</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(18450000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Enterprise Setup & Migration Fees</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(3200000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Treasury & Other Income</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(240000)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 px-2 rounded-lg">
                  <span>Gross Operating Revenue</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(pnl.totalRevenue)}</span>
                </div>

                {/* COGS */}
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-indigo-600 dark:text-indigo-400 pt-2">
                  II. Direct Cost of Services (COGS)
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Cloud Server Infrastructure (AWS)</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(pnl.cogs)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 px-2 rounded-lg">
                  <span>Gross Profit</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(pnl.grossProfit)}</span>
                </div>

                {/* OPEX */}
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-amber-600 dark:text-amber-400 pt-2">
                  III. Operating Expenses (OPEX)
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Employee Salaries & Statutory PF/ESI</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(11030000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Sales, Marketing & Ad Campaigns</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(1850000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Office Rent & Utilities</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(960000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Legal, Audit & Professional Retainers</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(420000)}</span>
                </div>
                <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">Depreciation & Amortization</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(pnl.depreciation)}</span>
                </div>

                {/* NET PROFIT */}
                <div className="flex justify-between py-2 text-sm font-black text-slate-900 dark:text-white bg-emerald-50 dark:bg-emerald-950/40 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 mt-3">
                  <span>Net Profit After Tax (PAT)</span>
                  <span className="text-emerald-700 dark:text-emerald-300">{formatCurrency(pnl.netProfit)}</span>
                </div>
              </div>
            </Card>

            {/* CHART */}
            <Card className="lg:col-span-5 p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">6-Month Revenue & Profit Trajectory (₹k)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPnlTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProf)" name="Net Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE SHEET */}
      {activeTab === 'balanceSheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* ASSETS */}
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Total Assets
              </h3>
              <Badge variant="success">Assets Controlled</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">Current Assets</div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Cash & Bank Balances</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(6775000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Accounts Receivable (Debtors)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(3420000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Prepaid Expenses & Advances</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(450000)}</span>
              </div>

              <div className="font-bold text-slate-800 dark:text-slate-200 pt-2">Non-Current & Fixed Assets</div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Hardware Workstations & Servers</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(2850000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Office Furniture & Fixtures</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(1200000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Less: Accumulated Depreciation</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(650000)}</span>
              </div>

              <div className="flex justify-between py-2 text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 rounded-xl mt-4">
                <span>Total Assets</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(balanceSheet.totalAssets)}</span>
              </div>
            </div>
          </Card>

          {/* LIABILITIES & EQUITY */}
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Liabilities & Equity
              </h3>
              <Badge variant="primary">Fully Balanced</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">Current Liabilities</div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Accounts Payable (Creditors)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(1680000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Salaries & Wages Payable</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(2480000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">GST, TDS & PF Statutory Dues</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(1145000)}</span>
              </div>

              <div className="font-bold text-slate-800 dark:text-slate-200 pt-2">Long-Term Liabilities</div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Commercial Term Loan Facility</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(4000000)}</span>
              </div>

              <div className="font-bold text-slate-800 dark:text-slate-200 pt-2">Shareholder Equity & Reserves</div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Paid-Up Equity Share Capital</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(5000000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Retained Earnings & Reserves</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(balanceSheet.totalEquity - 5000000)}</span>
              </div>

              <div className="flex justify-between py-2 text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 rounded-xl mt-4">
                <span>Total Liabilities + Equity</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(balanceSheet.totalAssets)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: CASH FLOW */}
      {activeTab === 'cashFlow' && (
        <Card className="p-6 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Statement of Cash Flows (Indirect Method)</h3>
              <p className="text-xs text-slate-400">Cash movement classified by operating, investing, and financing activities</p>
            </div>
            <Badge variant="success">Net Positive Cash Flow</Badge>
          </div>

          <div className="space-y-4 text-xs">
            {/* OPERATING */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs text-blue-600">A. Cash Flows from Operating Activities</h4>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Net Profit Before Tax</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(pnl.netProfit)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Adjustments for Non-Cash Items (Depreciation)</span>
                <span className="font-semibold text-emerald-600">+{formatCurrency(650000)}</span>
              </div>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Working Capital Adjustments (Receivables / Payables)</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(480000)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-2 rounded">
                <span>Net Cash Generated from Operations</span>
                <span className="text-emerald-600">{formatCurrency(cashFlow.cashFromOperations)}</span>
              </div>
            </div>

            {/* INVESTING */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs text-indigo-600">B. Cash Flows from Investing Activities</h4>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Purchase of Workstations and Server Equipment</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(850000)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-2 rounded">
                <span>Net Cash Used in Investing Activities</span>
                <span className="text-rose-600">{formatCurrency(cashFlow.cashFromInvesting)}</span>
              </div>
            </div>

            {/* FINANCING */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs text-amber-600">C. Cash Flows from Financing Activities</h4>
              <div className="flex justify-between pl-3 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Term Loan Principal Repayment</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(420000)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-2 rounded">
                <span>Net Cash Used in Financing Activities</span>
                <span className="text-rose-600">{formatCurrency(cashFlow.cashFromFinancing)}</span>
              </div>
            </div>

            {/* RECONCILIATION */}
            <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Net Increase in Cash & Cash Equivalents:</span>
                <span className="text-emerald-600 font-bold">+{formatCurrency(cashFlow.netCashFlow)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Cash Balance at Beginning of Period:</span>
                <span>{formatCurrency(cashFlow.openingCash)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-800 mt-2">
                <span>Cash Balance at End of Period:</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(cashFlow.closingCash)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
