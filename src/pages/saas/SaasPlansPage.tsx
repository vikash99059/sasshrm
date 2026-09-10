import React, { useState, useEffect } from 'react';
import { saasService } from '../../services/saasService';
import { SubscriptionPlan } from '../../types';
import { Card, Button, Badge } from '../../components/ui';
import { Check, Plus, Edit2 } from 'lucide-react';
import { formatCurrency } from '../../utils';

export const SaasPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const load = async () => {
      const p = await saasService.getPlans();
      setPlans(p);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subscription Plans & Pricing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure tiered SaaS plans, feature matrix allowances, and seat limits.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            hoverEffect
            className={`flex flex-col justify-between ${
              plan.popular ? 'ring-2 ring-blue-600 dark:ring-blue-500' : ''
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                {plan.popular && <Badge variant="primary">Popular</Badge>}
              </div>

              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(plan.priceMonthly)}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>

              <div className="rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Max Employees: {plan.maxEmployees} seats
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-dark-border">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit2 className="h-3.5 w-3.5" />}>
                Edit Plan Config
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
