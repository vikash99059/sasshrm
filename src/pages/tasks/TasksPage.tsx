import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils';
import {
  CalendarCheck,
  FileText,
  CheckCircle2,
  Clock,
  Hourglass,
  AlertTriangle,
  Flame,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  Kanban,
  BarChart2,
  List,
  CheckSquare,
  X,
  User,
  Folder,
  Eye,
  Trash2,
  Edit2,
  SlidersHorizontal,
} from 'lucide-react';

export interface TaskItem {
  id: string;
  taskId: string;
  name: string;
  description: string;
  project: string;
  projectColor: string;
  assignee: {
    name: string;
    role: string;
    avatar: string;
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Completed' | 'Overdue';
  dueDate: string;
  dueDateObj?: string;
  progress: number;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: '1',
    taskId: '#T-001',
    name: 'Design Dashboard UI',
    description: 'Create new dashboard design',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Amit Verma',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Apr 18, 2025',
    dueDateObj: '2025-04-18',
    progress: 60,
  },
  {
    id: '2',
    taskId: '#T-002',
    name: 'API Integration',
    description: 'Integrate payment gateway',
    project: 'Finance App',
    projectColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    assignee: {
      name: 'Neha Singh',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'In Progress',
    dueDate: 'Apr 20, 2025',
    dueDateObj: '2025-04-20',
    progress: 40,
  },
  {
    id: '3',
    taskId: '#T-003',
    name: 'User Testing',
    description: 'Conduct user acceptance test',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Rahul Mehta',
      role: 'QA Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Low',
    status: 'Pending',
    dueDate: 'Apr 22, 2025',
    dueDateObj: '2025-04-22',
    progress: 0,
  },
  {
    id: '4',
    taskId: '#T-004',
    name: 'Documentation',
    description: 'Write module documentation',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Pooja Sharma',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'Completed',
    dueDate: 'Apr 15, 2025',
    dueDateObj: '2025-04-15',
    progress: 100,
  },
  {
    id: '5',
    taskId: '#T-005',
    name: 'Database Optimization',
    description: 'Improve query performance',
    project: 'Backend',
    projectColor: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
    assignee: {
      name: 'Sahil Khan',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Apr 19, 2025',
    dueDateObj: '2025-04-19',
    progress: 70,
  },
  {
    id: '6',
    taskId: '#T-006',
    name: 'Mobile App Testing',
    description: 'Test mobile app on devices',
    project: 'Mobile App',
    projectColor: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    assignee: {
      name: 'Sneha Patel',
      role: 'QA Engineer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'Pending',
    dueDate: 'Apr 23, 2025',
    dueDateObj: '2025-04-23',
    progress: 20,
  },
  {
    id: '7',
    taskId: '#T-007',
    name: 'Marketing Campaign',
    description: 'Prepare campaign materials',
    project: 'Marketing',
    projectColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    assignee: {
      name: 'Karan Yadav',
      role: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Low',
    status: 'Pending',
    dueDate: 'Apr 25, 2025',
    dueDateObj: '2025-04-25',
    progress: 0,
  },
  {
    id: '8',
    taskId: '#T-008',
    name: 'Server Maintenance',
    description: 'Routine server checkup',
    project: 'IT Support',
    projectColor: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400',
    assignee: {
      name: 'Vikas Kumar',
      role: 'IT Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'In Progress',
    dueDate: 'Apr 21, 2025',
    dueDateObj: '2025-04-21',
    progress: 50,
  },
  // Additional tasks to complete 15 total tasks as shown in reference:
  {
    id: '9',
    taskId: '#T-009',
    name: 'SOC-2 Compliance Audit Prep',
    description: 'Prepare evidence for SOC-2 security audit',
    project: 'Security',
    projectColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    assignee: {
      name: 'Sahil Khan',
      role: 'Security Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'High',
    status: 'Overdue',
    dueDate: 'Apr 10, 2025',
    dueDateObj: '2025-04-10',
    progress: 85,
  },
  {
    id: '10',
    taskId: '#T-010',
    name: 'Employee Onboarding Flow',
    description: 'Refine wizard for new hires',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Amit Verma',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'Completed',
    dueDate: 'Apr 12, 2025',
    dueDateObj: '2025-04-12',
    progress: 100,
  },
  {
    id: '11',
    taskId: '#T-011',
    name: 'Payroll Deduction Calculation',
    description: 'Verify tax slab logic updates',
    project: 'Finance App',
    projectColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    assignee: {
      name: 'Neha Singh',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'High',
    status: 'Completed',
    dueDate: 'Apr 14, 2025',
    dueDateObj: '2025-04-14',
    progress: 100,
  },
  {
    id: '12',
    taskId: '#T-012',
    name: 'Candidate ATS Kanban Drag & Drop',
    description: 'Add fluid touch gestures',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Rahul Mehta',
      role: 'QA Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Low',
    status: 'Completed',
    dueDate: 'Apr 08, 2025',
    dueDateObj: '2025-04-08',
    progress: 100,
  },
  {
    id: '13',
    taskId: '#T-013',
    name: 'Benefits PDF Brochure Design',
    description: 'Finalize brochure typography and layout',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Pooja Sharma',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
    status: 'Completed',
    dueDate: 'Apr 06, 2025',
    dueDateObj: '2025-04-06',
    progress: 100,
  },
  {
    id: '14',
    taskId: '#T-014',
    name: 'Weekly Cloud Cost Optimization',
    description: 'Audit idle EC2 and Redis cache usage',
    project: 'Backend',
    projectColor: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
    assignee: {
      name: 'Vikas Kumar',
      role: 'IT Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'Low',
    status: 'Completed',
    dueDate: 'Apr 04, 2025',
    dueDateObj: '2025-04-04',
    progress: 100,
  },
  {
    id: '15',
    taskId: '#T-015',
    name: 'Dark Mode Glassmorphism Polish',
    description: 'Ensure contrast and crisp text rendering across all tables',
    project: 'HRM Portal',
    projectColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    assignee: {
      name: 'Amit Verma',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Apr 26, 2025',
    dueDateObj: '2025-04-26',
    progress: 55,
  },
];

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // New Task Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProject, setNewProject] = useState('HRM Portal');
  const [newAssignee, setNewAssignee] = useState('Amit Verma');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newStatus, setNewStatus] = useState<'In Progress' | 'Pending' | 'Completed'>('In Progress');
  const [newDueDate, setNewDueDate] = useState('Apr 28, 2025');

  // Active Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesProject = t.project.toLowerCase().includes(q);
        const matchesAssignee = t.assignee.name.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesProject && !matchesAssignee) return false;
      }

      // Status
      if (selectedStatusFilter !== 'All' && t.status !== selectedStatusFilter) {
        return false;
      }

      // Priority
      if (selectedPriorityFilter !== 'All' && t.priority !== selectedPriorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, selectedStatusFilter, selectedPriorityFilter]);

  // Pagination for List View
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage]);

  // Metrics Count Calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const overdueCount = tasks.filter((t) => t.status === 'Overdue').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High').length;

  const completedPercentage = Math.round((completedCount / totalCount) * 100) || 0;

  // Handle Select All checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(paginatedTasks.map((t) => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Create Task Submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTaskNumber = tasks.length + 1;
    const formattedId = `#T-${String(newTaskNumber).padStart(3, '0')}`;

    const newTask: TaskItem = {
      id: String(Date.now()),
      taskId: formattedId,
      name: newTitle,
      description: newDescription || 'Standard task item',
      project: newProject,
      projectColor: newProject === 'HRM Portal' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600',
      assignee: {
        name: newAssignee,
        role: newAssignee === 'Amit Verma' ? 'UI/UX Designer' : 'Developer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate,
      progress: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 25 : 0,
    };

    setTasks([newTask, ...tasks]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Task ${formattedId} created successfully!`);
  };

  // Upcoming Deadlines List (from reference)
  const upcomingDeadlines = [
    {
      id: 'd-1',
      title: 'Design Dashboard UI',
      date: 'Apr 18, 2025',
      relative: '(Today)',
      priority: 'High',
      isToday: true,
    },
    {
      id: 'd-2',
      title: 'API Integration',
      date: 'Apr 20, 2025',
      relative: '(In 2 days)',
      priority: 'Medium',
      isToday: false,
    },
    {
      id: 'd-3',
      title: 'Server Maintenance',
      date: 'Apr 21, 2025',
      relative: '(In 3 days)',
      priority: 'High',
      isToday: false,
    },
    {
      id: 'd-4',
      title: 'Mobile App Testing',
      date: 'Apr 23, 2025',
      relative: '(In 5 days)',
      priority: 'Medium',
      isToday: false,
    },
  ];

  return (
    <div className="space-y-4 animate-page-enter pb-12">
      
      {/* =========================================================================
          1. HEADER (BLUE CALENDAR/CHECKLIST ICON + TITLE + 2 SUBTITLE LINES)
         ========================================================================= */}
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/60 shadow-xs flex-shrink-0">
          <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Manage your assigned tasks, track progress and stay on top of your work.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Complete your tasks on time and achieve your goals.
          </p>
        </div>
      </div>

      {/* =========================================================================
          2. TOP METRIC KPI STAT CARDS (6 HORIZONTAL CARDS MATCHING REFERENCE)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        
        {/* Card 1: Total Tasks */}
        <div
          onClick={() => { setSelectedStatusFilter('All'); setSelectedPriorityFilter('All'); }}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                Total Tasks
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>All assigned tasks</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Completed */}
        <div
          onClick={() => setSelectedStatusFilter('Completed')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                Completed
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {completedCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>Finished tasks</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div
          onClick={() => setSelectedStatusFilter('In Progress')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                In Progress
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {inProgressCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            <span>Currently working</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Pending */}
        <div
          onClick={() => setSelectedStatusFilter('Pending')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                Pending
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {pendingCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            <span>Not started yet</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 5: Overdue */}
        <div
          onClick={() => setSelectedStatusFilter('Overdue')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                Overdue
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {overdueCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <span>Past due date</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Card 6: High Priority */}
        <div
          onClick={() => setSelectedPriorityFilter('High')}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-3.5 shadow-xs hover-card-lift transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs flex-shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
                High Priority
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {highPriorityCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10.5px] font-medium text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>Urgent tasks</span>
            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. MAIN SECTION: LEFT DATA CARD (8.5 COLS) + RIGHT WIDGETS (3.5 COLS)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: TASKS TABLE CONTAINER (8.5 COLS)
           ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] shadow-xs overflow-hidden">
          
          {/* Top Control Bar: View Switcher Tabs (Left) + Search & Filter (Right) */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* View Switcher Pills - List View & Kanban View only */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <List className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>List View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban View</span>
              </button>
            </div>

            {/* Right: Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search tasks..."
                  className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown Popover */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={cn(
                    'h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                    selectedStatusFilter !== 'All' || selectedPriorityFilter !== 'All'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  )}
                >
                  <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Filters</span>
                </button>

                {isFilterDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-30 text-xs space-y-2.5 animate-toast-slide">
                    <div>
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</p>
                      <div className="grid grid-cols-2 gap-1">
                        {['All', 'In Progress', 'Pending', 'Completed', 'Overdue'].map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setSelectedStatusFilter(st);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              'px-2 py-1 rounded text-left text-[11px] font-medium transition-colors',
                              selectedStatusFilter === st
                                ? 'bg-blue-600 text-white font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</p>
                      <div className="grid grid-cols-3 gap-1">
                        {['All', 'High', 'Medium', 'Low'].map((pr) => (
                          <button
                            key={pr}
                            onClick={() => {
                              setSelectedPriorityFilter(pr);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              'px-2 py-1 rounded text-center text-[11px] font-medium transition-colors',
                              selectedPriorityFilter === pr
                                ? 'bg-blue-600 text-white font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            )}
                          >
                            {pr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Container (List View) */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedTasks.length > 0 && selectedTaskIds.length === paginatedTasks.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-2 font-bold">Task ID</th>
                    <th className="py-3 px-3 font-bold">Task Name</th>
                    <th className="py-3 px-3 font-bold">Project</th>
                    <th className="py-3 px-3 font-bold">Assigned To</th>
                    <th className="py-3 px-3 font-bold">Priority</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold">Due Date</th>
                    <th className="py-3 px-3 font-bold">Progress</th>
                    <th className="py-3 px-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        No tasks match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTasks.map((task) => {
                      const isSelected = selectedTaskIds.includes(task.id);

                      return (
                        <tr
                          key={task.id}
                          className={cn(
                            'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors',
                            isSelected && 'bg-blue-50/40 dark:bg-blue-950/20'
                          )}
                        >
                          {/* 1. Checkbox */}
                          <td className="py-3 px-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(task.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* 2. Task ID */}
                          <td className="py-3 px-2 font-medium text-slate-400">
                            {task.taskId}
                          </td>

                          {/* 3. Task Name & Description */}
                          <td className="py-3 px-3 max-w-[200px]">
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {task.name}
                            </p>
                            <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                              {task.description}
                            </p>
                          </td>

                          {/* 4. Project Pill */}
                          <td className="py-3 px-3">
                            <span className={cn('px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-block whitespace-nowrap', task.projectColor)}>
                              {task.project}
                            </span>
                          </td>

                          {/* 5. Assigned To (Avatar + Name + Role) */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2 min-w-[150px]">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-7 h-7 rounded-full object-cover shadow-2xs border border-slate-200 dark:border-slate-700 flex-shrink-0"
                              />
                              <div className="truncate">
                                <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                                  {task.assignee.name}
                                </p>
                                <p className="text-[10px] text-slate-400 leading-tight truncate">
                                  ({task.assignee.role})
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 6. Priority */}
                          <td className="py-3 px-3">
                            <span className={cn(
                              'px-2.5 py-1 rounded-lg text-[11px] font-bold inline-block text-center min-w-[62px]',
                              task.priority === 'High' && 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
                              task.priority === 'Medium' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
                              task.priority === 'Low' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            )}>
                              {task.priority}
                            </span>
                          </td>

                          {/* 7. Status */}
                          <td className="py-3 px-3">
                            <span className={cn(
                              'px-2.5 py-1 rounded-lg text-[11px] font-bold inline-block text-center min-w-[85px]',
                              task.status === 'In Progress' && 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
                              task.status === 'Completed' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
                              task.status === 'Pending' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
                              task.status === 'Overdue' && 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            )}>
                              {task.status}
                            </span>
                          </td>

                          {/* 8. Due Date */}
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              <span>{task.dueDate}</span>
                            </div>
                          </td>

                          {/* 9. Progress Bar */}
                          <td className="py-3 px-3 min-w-[110px]">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                {task.progress}%
                              </span>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all duration-300',
                                    task.progress === 100
                                      ? 'bg-emerald-500'
                                      : task.progress > 50
                                      ? 'bg-blue-600'
                                      : 'bg-emerald-500'
                                  )}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 10. Actions */}
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => showToast(`Action menu for ${task.taskId}`)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Kanban View Mode */}
          {viewMode === 'kanban' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['Pending', 'In Progress', 'Completed'] as const).map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col);

                return (
                  <div key={col} className="rounded-xl bg-slate-50/70 dark:bg-[#151522] p-3 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>{col}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white dark:bg-slate-800 text-slate-500 font-semibold shadow-2xs">
                          {colTasks.length}
                        </span>
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5">
                      {colTasks.map((task) => (
                        <div key={task.id} className="p-3 rounded-xl bg-white dark:bg-[#1A1A26] border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">{task.taskId}</span>
                            <span className={cn(
                              'text-[9.5px] px-1.5 py-0.2 rounded font-bold',
                              task.priority === 'High' && 'bg-rose-50 text-rose-600',
                              task.priority === 'Medium' && 'bg-amber-50 text-amber-600',
                              task.priority === 'Low' && 'bg-emerald-50 text-emerald-600'
                            )}>
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{task.name}</h4>
                          <p className="text-[11px] text-slate-400">{task.project}</p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-slate-600 dark:text-slate-300 font-medium">{task.assignee.name}</span>
                            </div>
                            <span className="text-slate-400">{task.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}



          {/* Table Footer: "Showing 1 to 8 of 15 tasks" + Pagination */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    currentPage === pg
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  )}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* =======================================================================
            RIGHT COLUMN: 3 STACKED WIDGETS (3.5 COLS)
           ======================================================================= */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4">
          
          {/* Widget 1: Upcoming Deadlines */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Upcoming Deadlines</span>
              </span>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>Create Task</span>
              </button>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate('/calendar')}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => (
                <div key={dl.id} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9.5px] font-bold min-w-[42px] text-center mt-0.5',
                      dl.priority === 'High' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                    )}>
                      {dl.priority}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {dl.title}
                      </p>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">
                        {dl.date}
                      </p>
                    </div>
                  </div>

                  <span className={cn(
                    'text-[10.5px] font-bold flex-shrink-0',
                    dl.isToday ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
                  )}>
                    {dl.relative}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: My Task Summary (Donut Chart & Legend) */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                My Task Summary
              </h3>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Donut Chart Visual SVG */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Completed Segment (Green) - 40% */}
                  <path
                    className="text-emerald-500 transition-all duration-500"
                    strokeDasharray="40, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* In Progress Segment (Blue) - 33% */}
                  <path
                    className="text-blue-600 transition-all duration-500"
                    strokeDasharray="33, 100"
                    strokeDashoffset="-40"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Pending Segment (Orange) - 20% */}
                  <path
                    className="text-amber-500 transition-all duration-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-73"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Overdue Segment (Red) - 7% */}
                  <path
                    className="text-rose-500 transition-all duration-500"
                    strokeDasharray="7, 100"
                    strokeDashoffset="-93"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Donut Center Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                    {completedPercentage}%
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold uppercase mt-0.5">
                    Completed
                  </span>
                  <span className="text-[7.5px] text-slate-400">
                    {completedCount} of {totalCount} tasks
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Completed</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{completedCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">In Progress</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{inProgressCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Pending</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{pendingCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Overdue</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{overdueCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Quick Actions */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12121B] p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Quick Actions
            </h3>

            <div className="space-y-2">
              {/* Action 1: Create New Task */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Create New Task
                  </p>
                  <p className="text-[10.5px] text-slate-400 truncate">
                    Assign a new task to yourself or team
                  </p>
                </div>
              </button>

              {/* Action 2: View My Tasks */}
              <button
                onClick={() => {
                  setSelectedStatusFilter('All');
                  setSelectedPriorityFilter('All');
                  setViewMode('list');
                  showToast('Viewing all your assigned tasks');
                }}
                className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <List className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    View My Tasks
                  </p>
                  <p className="text-[10.5px] text-slate-400 truncate">
                    See all your assigned tasks
                  </p>
                </div>
              </button>

              {/* Action 3: View Calendar */}
              <button
                onClick={() => navigate('/calendar')}
                className="w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-3 text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    View Calendar
                  </p>
                  <p className="text-[10.5px] text-slate-400 truncate">
                    Check task deadlines & schedule
                  </p>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          4. CREATE NEW TASK MODAL DIALOG
         ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#141420] text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Create New Task</span>
              </span>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Design Dashboard UI"
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Create new dashboard design"
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="HRM Portal">HRM Portal</option>
                    <option value="Finance App">Finance App</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Assigned To
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Amit Verma">Amit Verma (UI/UX Designer)</option>
                    <option value="Neha Singh">Neha Singh (Developer)</option>
                    <option value="Rahul Mehta">Rahul Mehta (QA Engineer)</option>
                    <option value="Pooja Sharma">Pooja Sharma (Technical Writer)</option>
                    <option value="Sahil Khan">Sahil Khan (Developer)</option>
                    <option value="Vikas Kumar">Vikas Kumar (IT Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="Apr 28, 2025"
                    className="w-full h-9 px-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-toast-slide">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
