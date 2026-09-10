import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  ArrowRight,
  Target,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Search,
  Building2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface TeamData {
  id: string;
  name: string;
  department: string;
  leadName: string;
  leadAvatar: string;
  leadRole: string;
  memberCount: number;
  members: string[];
  activeProjects: number;
  sprintProgress: number;
  color: string;
}

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  const initialTeams: TeamData[] = [
    {
      id: 'team-1',
      name: 'Frontend Architecture Core',
      department: 'Engineering',
      leadName: 'David Miller',
      leadAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      leadRole: 'Principal UI Architect',
      memberCount: 8,
      members: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 4,
      sprintProgress: 88,
      color: '#3b82f6',
    },
    {
      id: 'team-2',
      name: 'Cloud & DevOps Infrastructure',
      department: 'Engineering',
      leadName: 'Michael Chang',
      leadAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      leadRole: 'DevOps Lead',
      memberCount: 6,
      members: [
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 3,
      sprintProgress: 94,
      color: '#6366f1',
    },
    {
      id: 'team-3',
      name: 'Growth & Demand Generation',
      department: 'Marketing',
      leadName: 'Sarah Wilson',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      leadRole: 'Growth Marketing Lead',
      memberCount: 7,
      members: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 5,
      sprintProgress: 75,
      color: '#10b981',
    },
    {
      id: 'team-4',
      name: 'Product Design & Research',
      department: 'Product',
      leadName: 'Elena Rostova',
      leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      leadRole: 'Design Director',
      memberCount: 5,
      members: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 4,
      sprintProgress: 82,
      color: '#ec4899',
    },
    {
      id: 'team-5',
      name: 'Enterprise Accounts Team',
      department: 'Sales',
      leadName: 'James Wilson',
      leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      leadRole: 'VP Sales',
      memberCount: 11,
      members: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 8,
      sprintProgress: 91,
      color: '#f59e0b',
    },
    {
      id: 'team-6',
      name: 'People Operations & Culture',
      department: 'Human Resources',
      leadName: 'Rachel Green',
      leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      leadRole: 'Head of People',
      memberCount: 6,
      members: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ],
      activeProjects: 6,
      sprintProgress: 89,
      color: '#8b5cf6',
    },
  ];

  const filteredTeams = initialTeams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.leadName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Teams & Pods
            </h1>
            <Badge variant="primary">{initialTeams.length} Active Teams</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-functional squads, reporting pods, sprint OKRs, and team lead delegations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setIsAddTeamOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create New Team
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by name or lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: team.color }}
            />

            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {team.department}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {team.name}
                  </h3>
                </div>
                <Badge variant="neutral">{team.memberCount} Members</Badge>
              </div>

              {/* Team Lead */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 my-3">
                <img
                  src={team.leadAvatar}
                  alt={team.leadName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{team.leadName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{team.leadRole}</div>
                </div>
              </div>

              {/* Sprint OKR Progress */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-blue-500" /> Sprint OKR Progress
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{team.sprintProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${team.sprintProgress}%`,
                      backgroundColor: team.color,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mt-2">
              <div className="flex items-center -space-x-2">
                {team.members.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Member"
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  />
                ))}
                {team.memberCount > team.members.length && (
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    +{team.memberCount - team.members.length}
                  </span>
                )}
              </div>

              <button
                onClick={() => navigate('/employees')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View Roster <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Team Modal */}
      <Modal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        title="Create Cross-Functional Team"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsAddTeamOpen(false); }} className="space-y-4">
          <Input label="Team Name" placeholder="e.g. Platform Reliability Squad" required />
          <Select
            label="Department"
            options={[
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Product', label: 'Product' },
              { value: 'Sales', label: 'Sales' },
              { value: 'Human Resources', label: 'Human Resources' },
            ]}
          />
          <Input label="Team Lead Name" placeholder="e.g. David Miller" required />
          <Input label="Team Lead Designation" placeholder="e.g. Engineering Manager" required />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddTeamOpen(false)}>Cancel</Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default TeamsPage;
