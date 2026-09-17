import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { GstFilingPeriod } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  StatCard,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

export const TaxGstPage: React.FC = () => {
  const [filings, setFilings] = useState<GstFilingPeriod[]>([]);

  const loadFilings = async () => {
    const list = await financeService.getGstFilings();
    setFilings(list);
  };

  useEffect(() => {
    loadFilings();
  }, []);

  const totalLiability = filings.reduce((s, f) => s + f.totalLiability, 0);
  const totalItc = filings.reduce((s, f) => s + f.eligibleItc, 0);
  const totalPaid = filings.reduce((s, f) => s + f.netTaxPaid, 0);

  const hsnBreakdown = [
    { sacCode: '998314', desc: 'Information Technology Software SaaS Services', taxableValue: 18450000, rate: '18%', igst: 1450000, cgst: 935500, sgst: 935500, totalTax: 3321000 },
    { sacCode: '998313', desc: 'IT Consulting & System Architecture Implementation', taxableValue: 3200000, rate: '18%', igst: 240000, cgst: 168000, sgst: 168000, totalTax: 576000 },
    { sacCode: '998311', desc: 'Management Consulting & Enterprise Advisory', taxableValue: 850000, rate: '18%', igst: 76500, cgst: 38250, sgst: 38250, totalTax: 153000 },
  ];

  const columns: Column<GstFilingPeriod>[] = [
    {
      header: 'Filing Period & Return',
      accessorKey: 'periodKey',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">{row.returnType}</span>
          <p className="text-[10px] font-mono text-slate-400">Period: {row.periodKey}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Outward Supplies (Taxable)',
      accessorKey: 'outwardTaxableSupplies',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white">
          {formatCurrency(row.outwardTaxableSupplies)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Total Output Tax',
      accessorKey: 'totalLiability',
      cell: (row) => (
        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(row.totalLiability)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Input Tax Credit (ITC)',
      accessorKey: 'eligibleItc',
      cell: (row) => (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          +{formatCurrency(row.eligibleItc)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Net Cash Tax Payable',
      accessorKey: 'netTaxPaid',
      cell: (row) => (
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(row.netTaxPaid)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Due Date',
      accessorKey: 'filingDueDate',
      cell: (row) => <span className="text-xs text-slate-600 dark:text-slate-300">{row.filingDueDate}</span>,
      sortable: true,
    },
    {
      header: 'Status & ARN',
      accessorKey: 'status',
      cell: (row) => (
        <div>
          <Badge variant={row.status === 'Filed' ? 'success' : row.status === 'Draft' ? 'primary' : 'warning'} size="sm">
            {row.status}
          </Badge>
          {row.arnNumber && (
            <p className="text-[9px] font-mono text-slate-400 mt-0.5">{row.arnNumber}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="GST Compliance & Tax Filings"
        subtitle="Automated GSTR-1 and GSTR-3B compilation, Input Tax Credit (ITC) reconciliation, and HSN/SAC breakdowns."
        icon={Percent}
        badge={<Badge variant="primary">GSTIN: 29AAECS1234F1ZA</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => alert('GSTR-1 JSON export generated successfully for GSTN portal upload.')}
            leftIcon={<Download className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Export GSTR-1 JSON / Excel
          </Button>
        }
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Output Tax Collected"
          value={formatCurrency(totalLiability)}
          icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          change="GST Output"
          isPositive={false}
        />
        <StatCard
          title="Eligible Input Tax Credit (ITC)"
          value={formatCurrency(totalItc)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Reconciled via GSTR-2B"
          isPositive={true}
        />
        <StatCard
          title="Net Cash Tax Remitted"
          value={formatCurrency(totalPaid)}
          icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="PMT-06 Challans"
          isPositive={true}
        />
        <StatCard
          title="Filing Health"
          value="100% On-Time"
          icon={<Clock className="h-5 w-5 text-teal-600" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          change="Zero Late Fees"
          isPositive={true}
        />
      </div>

      {/* GST FILINGS TABLE */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">GST Returns & Challans Schedule</h3>
        <DataTable
          columns={columns}
          data={filings}
          pageSize={10}
        />
      </div>

      {/* HSN / SAC SUMMARY TABLE */}
      <Card className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">HSN / SAC Code Wise Tax Summary</h3>
            <p className="text-xs text-slate-400">Classification of goods and services supplied during the financial year</p>
          </div>
          <Badge variant="neutral">Financial Year 2024-25</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2.5 rounded-l-lg">SAC Code</th>
                <th className="p-2.5">Service Description</th>
                <th className="p-2.5">Taxable Value</th>
                <th className="p-2.5">Rate</th>
                <th className="p-2.5">IGST</th>
                <th className="p-2.5">CGST</th>
                <th className="p-2.5">SGST</th>
                <th className="p-2.5 text-right rounded-r-lg">Total Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hsnBreakdown.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">{item.sacCode}</td>
                  <td className="p-2.5 font-medium">{item.desc}</td>
                  <td className="p-2.5 font-semibold">{formatCurrency(item.taxableValue)}</td>
                  <td className="p-2.5">{item.rate}</td>
                  <td className="p-2.5">{formatCurrency(item.igst)}</td>
                  <td className="p-2.5">{formatCurrency(item.cgst)}</td>
                  <td className="p-2.5">{formatCurrency(item.sgst)}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(item.totalTax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
