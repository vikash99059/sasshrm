import React from 'react';
import { Card } from '../../components/ui';
import { BarChart3, TrendingUp, Presentation, ArrowUpRight } from 'lucide-react';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const mockFunnelData = [
    { stage: 'Leads', count: 450, color: '#4f46e5' },
    { stage: 'Contacted', count: 320, color: '#6366f1' },
    { stage: 'Qualified', count: 180, color: '#818cf8' },
    { stage: 'Proposal', count: 95, color: '#a5b4fc' },
    { stage: 'Won', count: 27, color: '#10b981' },
];

export const SalesPipelineAnalytics: React.FC = () => {
    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Sales Pipeline Analytics
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Deep dive into closure rates, funnel velocity, and revenue forecasting.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 col-span-1 md:col-span-2 shadow-sm min-h-[350px]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-slate-400" /> Funnel Velocity (Lead to Close)
                    </h3>
                    <div className="h-48 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockFunnelData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                    {mockFunnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="p-5 shadow-sm bg-blue-600 text-white border-transparent">
                        <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Win Rate</p>
                        <div className="flex items-end gap-3 mt-2">
                            <span className="text-4xl font-black">28.4%</span>
                            <span className="flex items-center text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full mb-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
                            </span>
                        </div>
                    </Card>

                    <Card className="p-5 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Deal Size</p>
                        <div className="mt-2">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">$14,250</span>
                        </div>
                    </Card>

                    <Card className="p-5 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sales Cycle Length</p>
                        <div className="mt-2">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">42 Days</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
