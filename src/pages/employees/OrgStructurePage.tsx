import React from 'react';
import { Card, Avatar, Badge } from '../../components/ui';
import { INITIAL_EMPLOYEES } from '../../services/mockDb';
import { ChevronDown, Users } from 'lucide-react';

export const OrgStructurePage: React.FC = () => {
  const ceo = {
    name: 'Sarah Jenkins',
    role: 'Chief Executive Officer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Leadership',
  };

  const vps = [
    { name: 'Amit Verma', role: 'VP of Engineering', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', department: 'Engineering (54)' },
    { name: 'Priya Singh', role: 'VP of Marketing', avatar: INITIAL_EMPLOYEES[1].avatar, department: 'Marketing (22)' },
    { name: 'Marcus Sterling', role: 'VP of Finance', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', department: 'Finance (14)' },
    { name: 'Sneha Gupta', role: 'VP of HR', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', department: 'HR & People (12)' },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Organization Hierarchy Chart
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Visual executive reporting trees and department lead relationships.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8 py-4 overflow-x-auto">
        {/* CEO Tier 1 */}
        <div className="flex flex-col items-center">
          <Card className="w-64 text-center p-4 border-2 border-blue-500 shadow-lg space-y-2">
            <Avatar src={ceo.avatar} name={ceo.name} size="lg" className="mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ceo.name}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{ceo.role}</p>
              <Badge variant="primary" size="sm" className="mt-2">Executive Level</Badge>
            </div>
          </Card>
          <div className="h-8 w-0.5 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* VP Tier 2 */}
        <div className="relative flex flex-wrap justify-center gap-6">
          {vps.map((vp, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <Card className="w-56 text-center p-4 border border-slate-200 dark:border-dark-border shadow-card hover:border-blue-400 transition-all space-y-2">
                <Avatar src={vp.avatar} name={vp.name} size="md" className="mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{vp.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{vp.role}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {vp.department}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
