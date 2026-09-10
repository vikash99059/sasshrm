import React, { useState } from 'react';
import {
  ShieldCheck,
  Palmtree,
  Activity,
  HeartPulse,
  User,
  Search,
  Download,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';

export const LeaveBalancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const leaveQuotas = [
    { type: 'Annual Leave', total: 24, avgUsed: 6.2, carryForward: 'Up to 5 days', color: '#3b82f6', icon: Palmtree },
    { type: 'Sick Leave', total: 12, avgUsed: 2.1, carryForward: 'No rollover', color: '#10b981', icon: HeartPulse },
    { type: 'Casual Leave', total: 10, avgUsed: 3.5, carryForward: 'No rollover', color: '#f59e0b', icon: Activity },
    { type: 'Parental Leave', total: 60, avgUsed: 0, carryForward: 'Upon eligibility', color: '#8b5cf6', icon: ShieldCheck },
  ];

  const employeeBalances = [
    {
      id: 'EMP-001',
      name: 'Sarah Wilson',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      annualUsed: 6,
      annualTotal: 24,
      sickUsed: 1,
      sickTotal: 12,
      casualUsed: 2,
      casualTotal: 10,
    },
    {
      id: 'EMP-002',
      name: 'David Miller',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      annualUsed: 14,
      annualTotal: 24,
      sickUsed: 3,
      sickTotal: 12,
      casualUsed: 4,
      casualTotal: 10,
    },
    {
      id: 'EMP-003',
      name: 'Elena Rostova',
      department: 'Product',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      annualUsed: 8,
      annualTotal: 24,
      sickUsed: 0,
      sickTotal: 12,
      casualUsed: 1,
      casualTotal: 10,
    },
    {
      id: 'EMP-004',
      name: 'Marcus Vance',
      department: 'Operations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      annualUsed: 12,
      annualTotal: 24,
      sickUsed: 4,
      sickTotal: 12,
      casualUsed: 3,
      casualTotal: 10,
    },
    {
      id: 'EMP-005',
      name: 'Rachel Green',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      annualUsed: 4,
      annualTotal: 24,
      sickUsed: 2,
      sickTotal: 12,
      casualUsed: 1,
      casualTotal: 10,
    },
  ];

  const filteredBalances = employeeBalances.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Leave Quotas & Balances
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Annual entitlement tracking, utilized PTO, sick days, and policy carry-forward balances.
          </p>
        </div>

        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1.5" />
          Export Balances CSV
        </Button>
      </div>

      {/* Policy Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveQuotas.map((q, idx) => {
          const Icon = q.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{q.type}</span>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${q.color}15`, color: q.color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{q.total}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">days/year allocated</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Avg Used: <span className="font-semibold text-slate-800 dark:text-slate-200">{q.avgUsed}d</span></span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">{q.carryForward}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="ALL">All Departments</option>
          <option value="Marketing">Marketing</option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Operations">Operations</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>

      {/* Employee Balances Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Annual Leave (24d)</th>
                <th className="py-3.5 px-4">Sick Leave (12d)</th>
                <th className="py-3.5 px-4">Casual Leave (10d)</th>
                <th className="py-3.5 px-6 text-right">Total Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBalances.map((emp) => {
                const totalLeft = (emp.annualTotal - emp.annualUsed) + (emp.sickTotal - emp.sickUsed) + (emp.casualTotal - emp.casualUsed);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{emp.name}</div>
                          <div className="text-slate-400 text-[11px]">{emp.department} · {emp.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Annual */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-900 dark:text-white">{emp.annualTotal - emp.annualUsed} left</span>
                          <span className="text-slate-400">{emp.annualUsed} used</span>
                        </div>
                        <div className="w-28 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${(emp.annualUsed / emp.annualTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Sick */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-900 dark:text-white">{emp.sickTotal - emp.sickUsed} left</span>
                          <span className="text-slate-400">{emp.sickUsed} used</span>
                        </div>
                        <div className="w-28 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${(emp.sickUsed / emp.sickTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Casual */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-900 dark:text-white">{emp.casualTotal - emp.casualUsed} left</span>
                          <span className="text-slate-400">{emp.casualUsed} used</span>
                        </div>
                        <div className="w-28 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${(emp.casualUsed / emp.casualTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-sm text-blue-600 dark:text-blue-400">
                      {totalLeft} Days Available
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default LeaveBalancePage;
