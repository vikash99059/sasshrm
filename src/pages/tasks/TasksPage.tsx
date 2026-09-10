import React, { useState } from 'react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  CheckSquare,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'in_progress' | 'completed';
  project: string;
}

export const TasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'tsk-1',
      title: 'Complete Q3 Architecture Documentation',
      description: 'Document microservices endpoints, data connect schemas, and sync with engineering squad.',
      dueDate: 'Today, 5:00 PM',
      priority: 'High',
      status: 'in_progress',
      project: 'Engineering Core',
    },
    {
      id: 'tsk-2',
      title: 'Submit Expense Receipts for Client Meet',
      description: 'Attach travel boarding pass and meal receipts in Operations portal for reimbursement.',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      status: 'todo',
      project: 'Operations',
    },
    {
      id: 'tsk-3',
      title: 'Annual Benefits Dependent Enrollment',
      description: 'Verify health coverage dependents and submit form on the HR Desk.',
      dueDate: 'Sep 20, 2025',
      priority: 'High',
      status: 'todo',
      project: 'People & HR',
    },
    {
      id: 'tsk-4',
      title: 'Sprint 24 Peer Code Reviews',
      description: 'Review frontend pull requests for ATS kanban boards and dark mode consistency.',
      dueDate: 'Sep 12, 2025',
      priority: 'Medium',
      status: 'completed',
      project: 'Engineering Core',
    },
  ]);

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'in_progress' : 'completed' }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Tasks & Work Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize daily sprint deliverables, personal work items, and action points
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-semibold">
            {todoCount} To Do
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
            {inProgressCount} In Progress
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold">
            {completedCount} Completed
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0F172A] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-72 flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border bg-white dark:bg-[#0F172A] shadow-xs space-y-2.5 transition-all hover:shadow-sm ${
              task.status === 'completed'
                ? 'border-emerald-200/70 dark:border-emerald-950 opacity-80'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`mt-0.5 h-4 w-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-blue-600'
                  }`}
                >
                  {task.status === 'completed' && <CheckSquare className="h-3 w-3" />}
                </button>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-bold ${
                      task.status === 'completed'
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <span
                className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  task.priority === 'High'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : task.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {task.priority}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Tag className="h-3 w-3" />
                <span>{task.project}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
