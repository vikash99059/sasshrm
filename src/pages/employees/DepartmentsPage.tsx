import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeService';
import { Department } from '../../types';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import { Building2, Plus, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const list = await employeeService.getDepartments();
      setDepartments(list);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Departments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize headcount, departmental budgets, and department head reporting lines.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                  style={{ backgroundColor: dept.color }}
                >
                  {dept.code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{dept.name}</h3>
                  <p className="text-xs text-slate-400">Head: {dept.headName || 'Not Assigned'}</p>
                </div>
              </div>
              <Badge variant="primary">{dept.employeeCount} Members</Badge>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
              <span className="text-slate-500">Department Code: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{dept.code}</span></span>
              <button
                onClick={() => navigate('/employees')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View Members <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
