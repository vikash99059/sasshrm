import React from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import { Plus, Edit2, CreditCard } from 'lucide-react';

export const SalaryStructurePage: React.FC = () => {
  const bands = [
    { title: 'Executive / Leadership Band (L6 - L7)', basicPct: '60%', hraPct: '25%', allowances: '15%', pfPct: '12%', taxBand: '30%' },
    { title: 'Senior Engineering & Product Band (L4 - L5)', basicPct: '55%', hraPct: '25%', allowances: '20%', pfPct: '12%', taxBand: '20%' },
    { title: 'Mid-Level & Associate Band (L2 - L3)', basicPct: '50%', hraPct: '25%', allowances: '25%', pfPct: '12%', taxBand: '10%' },
    { title: 'Internship / Trainee Band (L1)', basicPct: '100% Fixed Stipend', hraPct: '0%', allowances: '0%', pfPct: '0%', taxBand: '0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Salary Structure & Compensation Bands
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure automated gross salary breakdown percentages, HRA, and provident fund schemas.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Create Compensation Band
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bands.map((band, idx) => (
          <Card key={idx} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{band.title}</h3>
              <Badge variant="primary" size="sm">Active Schema</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Basic Pay Share:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.basicPct}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">HRA Allowance:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.hraPct}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Special Allowances:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.allowances}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Statutory PF Contribution:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{band.pfPct}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Edit2 className="h-3.5 w-3.5" />}>
              Modify Band Config
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
