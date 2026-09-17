import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge, Input, Modal } from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Plus, Edit2, CreditCard, Calculator, CheckCircle2, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils';

export const SalaryStructurePage: React.FC = () => {
  const [bands, setBands] = useState([
    { id: '1', title: 'Executive / Leadership Band (L6 - L7)', basicPct: 50, hraPct: 25, allowances: 25, pfPct: 12, ptAmount: 200, targetCtc: 4500000 },
    { id: '2', title: 'Senior Engineering & Product Band (L4 - L5)', basicPct: 50, hraPct: 25, allowances: 25, pfPct: 12, ptAmount: 200, targetCtc: 2400000 },
    { id: '3', title: 'Mid-Level & Associate Band (L2 - L3)', basicPct: 50, hraPct: 25, allowances: 25, pfPct: 12, ptAmount: 200, targetCtc: 1200000 },
    { id: '4', title: 'Internship / Trainee Band (L1)', basicPct: 100, hraPct: 0, allowances: 0, pfPct: 0, ptAmount: 0, targetCtc: 360000 },
  ]);

  // CTC Simulator State
  const [simulatorAnnualCtc, setSimulatorAnnualCtc] = useState(1800000);
  const [selectedBand, setSelectedBand] = useState(bands[1]);

  // Calculations for Simulator
  const monthlyGross = simulatorAnnualCtc / 12;
  const basic = Math.round(monthlyGross * (selectedBand.basicPct / 100));
  const hra = Math.round(monthlyGross * (selectedBand.hraPct / 100));
  const specialAllowance = Math.round(monthlyGross * (selectedBand.allowances / 100));
  const employeePf = selectedBand.pfPct > 0 ? Math.min(Math.round(basic * (selectedBand.pfPct / 100)), 1800) : 0;
  const employerPf = employeePf;
  const pt = selectedBand.ptAmount;
  const estimatedTds = Math.round(monthlyGross * 0.10); // 10% approx
  const totalDeductions = employeePf + pt + estimatedTds;
  const netTakeHome = monthlyGross - totalDeductions;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Salary Structure & Compensation Bands"
        subtitle="Configure automated gross salary breakdown percentages, HRA formulas, statutory PF schemas, and real-time CTC simulators."
        icon={CreditCard}
        badge={<Badge variant="primary">{bands.length} Bands Active</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => alert('New compensation band modal opened.')}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Create Compensation Band
          </Button>
        }
      />

      {/* INTERACTIVE CTC BREAKDOWN SIMULATOR */}
      <Card className="p-5 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live CTC Breakdown & Take-Home Simulator</h3>
          </div>
          <Badge variant="primary">Real-time Tax Engine</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Input
            label="Annual Cost to Company (CTC in ₹)"
            type="number"
            value={simulatorAnnualCtc}
            onChange={(e) => setSimulatorAnnualCtc(Number(e.target.value))}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Compensation Band</label>
            <select
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5"
              value={selectedBand.id}
              onChange={(e) => setSelectedBand(bands.find(b => b.id === e.target.value) || bands[0])}
            >
              {bands.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Estimated Net Monthly In-Hand:</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(netTakeHome)}/mo</span>
          </div>
        </div>

        {/* DETAILED BREAKDOWN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs text-blue-600">Earnings Components (Gross: {formatCurrency(monthlyGross)}/mo)</h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Basic Pay ({selectedBand.basicPct}%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(basic)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">House Rent Allowance (HRA {selectedBand.hraPct}%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(hra)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Special Allowances ({selectedBand.allowances}%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(specialAllowance)}</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs text-rose-600">Deductions (Total: -{formatCurrency(totalDeductions)}/mo)</h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Employee PF (12% capped):</span>
              <span className="font-semibold text-rose-600">-{formatCurrency(employeePf)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Professional Tax (PT):</span>
              <span className="font-semibold text-rose-600">-{formatCurrency(pt)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Income Tax (Estimated TDS):</span>
              <span className="font-semibold text-rose-600">-{formatCurrency(estimatedTds)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* BANDS CATALOG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bands.map((band) => (
          <Card key={band.id} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{band.title}</h3>
              <Badge variant="primary" size="sm">Active Schema</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Basic Pay Share:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.basicPct}% of Gross</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">HRA Allowance:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.hraPct}% of Gross</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Special Allowances:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.allowances}% of Gross</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Statutory PF Contribution:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.pfPct}% (12% EE + 12% ER)</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Edit2 className="h-3.5 w-3.5" />}>
              Modify Band Configuration
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
