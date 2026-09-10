import React, { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord } from '../../types';
import { Card, CardHeader, CardTitle, Button, Badge, DataTable, Column } from '../../components/ui';
import { FileSpreadsheet, Download, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const PayslipsPage: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await payrollService.getRecords();
      setRecords(list);
    };
    load();
  }, []);

  const columns: Column<PayrollRecord>[] = [
    {
      header: 'Month Cycle',
      accessorKey: 'month',
      cell: (row) => <span className="font-semibold text-xs text-blue-600">{row.month}</span>,
      sortable: true,
    },
    {
      header: 'Employee',
      accessorKey: 'employeeName',
      cell: (row) => (
        <div>
          <p className="font-semibold text-xs text-slate-900 dark:text-white">{row.employeeName}</p>
          <p className="text-[10px] text-slate-400">{row.employeeCode} • {row.department}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Gross Salary',
      accessorKey: 'grossSalary',
      cell: (row) => <span>{formatCurrency(row.grossSalary)}</span>,
    },
    {
      header: 'Total Deductions',
      accessorKey: 'totalDeductions',
      cell: (row) => <span className="text-rose-600 font-medium">-{formatCurrency(row.totalDeductions)}</span>,
    },
    {
      header: 'Net Take-Home',
      accessorKey: 'netSalary',
      cell: (row) => <span className="font-bold text-emerald-600">{formatCurrency(row.netSalary)}</span>,
    },
    {
      header: 'Payment Date',
      accessorKey: 'paymentDate',
      cell: (row) => <span>{formatDate(row.paymentDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <Badge variant="success" size="sm">PAID</Badge>,
    },
    {
      header: 'Action',
      cell: () => (
        <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
          PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Payslips Archive
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, download, and export historical salary slips for all pay cycles.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={records}
        searchKey="employeeName"
        searchPlaceholder="Search payslips by employee..."
        pageSize={6}
      />
    </div>
  );
};
