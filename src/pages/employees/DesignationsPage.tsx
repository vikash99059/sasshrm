import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeService';
import { Designation } from '../../types';
import { Card, Button, Badge } from '../../components/ui';
import { Award, Plus, ArrowRight } from 'lucide-react';

export const DesignationsPage: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await employeeService.getDesignations();
      setDesignations(list);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designations & Job Titles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization seniority levels (L1 - L7), band structures, and titles.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Add Designation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designations.map((des) => (
          <Card key={des.id} hoverEffect className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{des.title}</h3>
                  <p className="text-[11px] text-slate-400">{des.departmentName}</p>
                </div>
              </div>
              <Badge variant="primary">{des.level}</Badge>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500">
              <span>{des.employeeCount} active employees</span>
              <span className="font-semibold text-blue-600">Level {des.level}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
