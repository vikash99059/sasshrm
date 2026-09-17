import React, { useState, useEffect } from 'react';
import { complianceService } from '../../services/complianceService';
import { PfEcrSummary, EsiReturnSummary, PtSlab, TdsQuarterlyReturn } from '../../types';
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
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Layers,
  Percent,
} from 'lucide-react';
import { formatCurrency } from '../../utils';

export const StatutoryCompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pf' | 'esi' | 'pt' | 'tds' | 'audit'>('pf');
  const [pfSummaries, setPfSummaries] = useState<PfEcrSummary[]>([]);
  const [esiSummaries, setEsiSummaries] = useState<EsiReturnSummary[]>([]);
  const [ptSlabs, setPtSlabs] = useState<PtSlab[]>([]);
  const [tdsReturns, setTdsReturns] = useState<TdsQuarterlyReturn[]>([]);
  const [healthData, setHealthData] = useState<any>(null);

  const loadData = async () => {
    const [pf, esi, pt, tds, health] = await Promise.all([
      complianceService.getPfSummaries(),
      complianceService.getEsiSummaries(),
      complianceService.getPtSlabs(),
      complianceService.getTdsReturns(),
      complianceService.getComplianceHealth(),
    ]);
    setPfSummaries(pf);
    setEsiSummaries(esi);
    setPtSlabs(pt);
    setTdsReturns(tds);
    setHealthData(health);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateEcr = async () => {
    await complianceService.generatePfEcr('May 2024');
    alert('EPF Electronic Challan cum Return (ECR) raw text file formatted and generated according to Unified Portal specifications.');
    loadData();
  };

  const pfColumns: Column<PfEcrSummary>[] = [
    {
      header: 'Wage Month',
      accessorKey: 'monthYear',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">{row.monthYear}</span>
          <p className="text-[10px] text-slate-400">{row.totalMembers} Contributing Members</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Total EPF Wages',
      accessorKey: 'epfWages',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white">
          {formatCurrency(row.epfWages)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Employee Share (12%)',
      accessorKey: 'eeShare12',
      cell: (row) => (
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(row.eeShare12)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Employer (EPS + EPF)',
      accessorKey: 'erShareEps',
      cell: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatCurrency(row.erShareEpf + row.erShareEps)}
          </span>
          <p className="text-[9px] text-slate-400">EPS: {formatCurrency(row.erShareEps)} | EPF: {formatCurrency(row.erShareEpf)}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Admin & EDLI (1%)',
      accessorKey: 'adminChargesAc2',
      cell: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {formatCurrency(row.adminChargesAc2 + row.edliChargesAc21)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Total Challan Dues',
      accessorKey: 'totalChallanAmount',
      cell: (row) => (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.totalChallanAmount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'TRRN & Status',
      accessorKey: 'challanStatus',
      cell: (row) => (
        <div>
          <Badge variant={row.challanStatus === 'Paid' ? 'success' : 'primary'} size="sm">
            {row.challanStatus}
          </Badge>
          {row.trrnNumber && <p className="text-[9px] font-mono text-slate-400 mt-0.5">{row.trrnNumber}</p>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Statutory Compliance & Legal Returns"
        subtitle="Provident Fund (PF) ECR electronic files, ESIC monthly returns, state-wise Professional Tax, TDS Form 24Q, and compliance audits."
        icon={ShieldCheck}
        badge={<Badge variant="primary">98% Compliance Score</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert('Exporting Form 16 Part A & B batch archives...')}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Bulk Form 16 ZIP
            </Button>
            <Button
              size="sm"
              onClick={handleGenerateEcr}
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
              className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Generate May 2024 ECR File
            </Button>
          </div>
        }
      />

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="EPF Total Contribution"
          value={formatCurrency(930000)}
          icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="248 Contributing Members"
          isPositive={true}
        />
        <StatCard
          title="ESIC Monthly Return"
          value={formatCurrency(33600)}
          icon={<Percent className="h-5 w-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
          change="42 Covered Employees"
          isPositive={true}
        />
        <StatCard
          title="TDS Deducted & Deposited"
          value={formatCurrency(1980000)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Section 192 Salary TDS"
          isPositive={true}
        />
        <StatCard
          title="Statutory Health Audit"
          value="100% On-Track"
          icon={<Clock className="h-5 w-5 text-teal-600" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          change="Next Deadline: June 15"
          isPositive={true}
        />
      </div>

      {/* COMPLIANCE TABS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('pf')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'pf'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          1. Provident Fund (EPF ECR)
        </button>
        <button
          onClick={() => setActiveTab('esi')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'esi'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          2. Employee State Insurance (ESIC)
        </button>
        <button
          onClick={() => setActiveTab('pt')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'pt'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          3. Professional Tax (PT Slabs)
        </button>
        <button
          onClick={() => setActiveTab('tds')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'tds'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          4. Income Tax TDS (24Q & Form 16)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          5. Statutory Audit Checklist
        </button>
      </div>

      {/* TAB 1: PF */}
      {activeTab === 'pf' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Electronic Challan cum Return (ECR) History</h3>
            <span className="text-xs text-slate-400">EPFO Unified Portal ECR 2.0 Compliance</span>
          </div>
          <DataTable
            columns={pfColumns}
            data={pfSummaries}
            pageSize={10}
          />
        </div>
      )}

      {/* TAB 2: ESI */}
      {activeTab === 'esi' && (
        <Card className="p-5 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">ESIC Monthly Returns & Wage Threshold</h3>
              <p className="text-xs text-slate-400">Applicable for employees with gross salary ≤ ₹21,000 / month (0.75% EE + 3.25% ER)</p>
            </div>
            <Badge variant="primary">ESIC Code: 53000984920000999</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Wage Month</th>
                  <th className="p-2.5">Covered Headcount</th>
                  <th className="p-2.5">Gross Wages</th>
                  <th className="p-2.5">Employee Share (0.75%)</th>
                  <th className="p-2.5">Employer Share (3.25%)</th>
                  <th className="p-2.5">Total Contribution</th>
                  <th className="p-2.5 text-right rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {esiSummaries.map((esi, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">{esi.monthYear}</td>
                    <td className="p-2.5">{esi.totalCoveredEmployees} Employees</td>
                    <td className="p-2.5 font-semibold">{formatCurrency(esi.totalGrossWages)}</td>
                    <td className="p-2.5 text-blue-600 font-medium">{formatCurrency(esi.employeeShare)}</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">{formatCurrency(esi.employerShare)}</td>
                    <td className="p-2.5 font-bold text-emerald-600">{formatCurrency(esi.totalContribution)}</td>
                    <td className="p-2.5 text-right">
                      <Badge variant={esi.status === 'Paid' ? 'success' : 'primary'} size="sm">
                        {esi.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: PT SLABS */}
      {activeTab === 'pt' && (
        <Card className="p-5 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">State-Wise Professional Tax (PT) Deduction Slabs</h3>
              <p className="text-xs text-slate-400">Automated multi-branch PT deduction logic configured per employee work location</p>
            </div>
            <Badge variant="primary">{ptSlabs.length} States Configured</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ptSlabs.map((slab, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{slab.state}</h4>
                  <Badge variant={slab.monthlyDeduction > 0 ? 'primary' : 'neutral'} size="sm">
                    {slab.monthlyDeduction > 0 ? `₹${slab.monthlyDeduction}/mo` : 'Exempt / Nil'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Salary Threshold: {formatCurrency(slab.salaryThresholdMin)}+ per month
                </p>
                {slab.februaryDeduction && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    * Special February Surcharge: ₹{slab.februaryDeduction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: TDS RETURNS */}
      {activeTab === 'tds' && (
        <Card className="p-5 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quarterly TDS Returns (Form 24Q - Salary)</h3>
              <p className="text-xs text-slate-400">Quarterly tax deducted at source statements filed under TAN: BLRE12345A</p>
            </div>
            <Badge variant="primary">TAN: BLRE12345A</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Quarter</th>
                  <th className="p-2.5">Financial Year</th>
                  <th className="p-2.5">Form</th>
                  <th className="p-2.5">Deductions Count</th>
                  <th className="p-2.5">Tax Deducted</th>
                  <th className="p-2.5">Tax Deposited</th>
                  <th className="p-2.5 text-right rounded-r-lg">Status & Ack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tdsReturns.map((tds, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">{tds.quarter}</td>
                    <td className="p-2.5">{tds.financialYear}</td>
                    <td className="p-2.5 font-medium">{tds.formType}</td>
                    <td className="p-2.5">{tds.totalDeductionsCount} Employees</td>
                    <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{formatCurrency(tds.taxDeducted)}</td>
                    <td className="p-2.5 font-bold text-emerald-600">{formatCurrency(tds.taxDeposited)}</td>
                    <td className="p-2.5 text-right">
                      <Badge variant={tds.status === 'Filed' ? 'success' : 'primary'} size="sm">
                        {tds.status}
                      </Badge>
                      {tds.acknowledgementNumber && (
                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">{tds.acknowledgementNumber}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: AUDIT CHECKLIST */}
      {activeTab === 'audit' && healthData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <Card className="lg:col-span-7 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Statutory Health & Labor Law Audit Checks</h3>
            <div className="space-y-3">
              {healthData.auditChecklist.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Statutory Calendar</h3>
            <div className="space-y-3">
              {healthData.statutoryReminders.map((rem: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rem.title}</h4>
                    <Badge variant={rem.status === 'Complied' ? 'success' : 'warning'} size="sm">
                      {rem.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Due: {rem.dueDate}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
