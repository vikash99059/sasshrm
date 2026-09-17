import React from 'react';
import { Card } from '../../components/ui';
import { Download, TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockFinanceData = [
    { month: 'Jan', income: 45000, expense: 22000 },
    { month: 'Feb', income: 52000, expense: 28000 },
    { month: 'Mar', income: 48000, expense: 25000 },
    { month: 'Apr', income: 61000, expense: 32000 },
    { month: 'May', income: 59000, expense: 30000 },
    { month: 'Jun', income: 72000, expense: 35000 },
];

export const FinanceDashboardPage: React.FC = () => {
    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Finance & Accounting Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Monitor real-time cash flow, P&L, and accounts receivable/payable balances.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                        <Download className="h-4 w-4" /> Download P&L Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Total Revenue', value: '$845,900', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                    { title: 'Total Expenses', value: '$210,400', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' },
                    { title: 'Net Profit', value: '$635,500', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
                    { title: 'Cash Flow', value: 'Positive', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' }
                ].map((stat, idx) => (
                    <Card key={idx} className="p-5 flex items-center justify-between border-slate-200/60 shadow-sm dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.title}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-sm min-h-[300px]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Income vs Expense (YTD)</h3>
                    <div className="h-56 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip cursor={{ fill: 'transparent', stroke: '#e2e8f0', strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 shadow-sm min-h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Accounts Payable / Receivable</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
                            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Accounts Payable</p>
                            <p className="text-2xl font-black text-orange-700 dark:text-orange-300">$45,210</p>
                            <p className="text-xs mt-1 text-orange-600/70 dark:text-orange-400/70">12 invoices pending payment</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Accounts Receivable</p>
                            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">$185,500</p>
                            <p className="text-xs mt-1 text-emerald-600/70 dark:text-emerald-400/70">8 clients pending collection</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
