import React from 'react';
import { Card, DataTable } from '../../components/ui';
import { Receipt, Search, Filter } from 'lucide-react';

export const ReceiptsTrackingPage: React.FC = () => {
    const columns = [
        { key: 'receiptNo', header: 'Receipt #', render: (val: string) => <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{val}</span> },
        { key: 'client', header: 'Payment From' },
        { key: 'date', header: 'Date Received' },
        { key: 'amount', header: 'Amount', render: (val: string) => <span className="font-bold text-emerald-600 dark:text-emerald-400">{val}</span> },
        {
            key: 'mode', header: 'Payment Mode', render: (val: string) => (
                <span className="px-2 py-1 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {val}
                </span>
            )
        }
    ];

    const data = [
        { id: 1, receiptNo: 'REC-00142', client: 'Stark Industries', date: 'Oct 21, 2024', amount: '$120,000', mode: 'Bank Transfer' },
        { id: 2, receiptNo: 'REC-00141', client: 'Nova Marketing', date: 'Oct 19, 2024', amount: '$4,500', mode: 'Credit Card' },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Receipt className="h-6 w-6 text-emerald-600" /> Receipts Tracking
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Log physical or bank payments received against issued invoices.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search receipts..."
                            className="w-full text-sm pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900/60 dark:text-white"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800 p-0 overflow-hidden">
                <DataTable columns={columns} data={data} keyField="id" />
            </Card>
        </div>
    );
};
