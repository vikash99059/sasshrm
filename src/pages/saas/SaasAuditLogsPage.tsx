import React, { useState, useEffect } from 'react';
import { saasService } from '../../services/saasService';
import { AuditLog } from '../../types';
import { DataTable, Column, Badge } from '../../components/ui';
import { ShieldCheck, User, Terminal } from 'lucide-react';
import { formatDate } from '../../utils';

export const SaasAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await saasService.getAuditLogs();
      setLogs(list);
    };
    load();
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{row.action}</span>
      ),
    },
    {
      header: 'Actor',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{row.userName}</p>
          <p className="text-[11px] text-slate-400">{row.userRole}</p>
        </div>
      ),
    },
    {
      header: 'Module',
      accessorKey: 'module',
      cell: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{row.module}</span>
      ),
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-500">{row.ipAddress}</span>
      ),
    },
    {
      header: 'Details',
      accessorKey: 'details',
      cell: (row) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={row.details}>
          {row.details}
        </p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Success' ? 'success' : row.status === 'Warning' ? 'warning' : 'danger'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Security Audit Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable tamper-evident security audit trail for SOC-2 and HIPAA compliance.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchKey="action"
        searchPlaceholder="Search audit events by action..."
        pageSize={8}
      />
    </div>
  );
};
