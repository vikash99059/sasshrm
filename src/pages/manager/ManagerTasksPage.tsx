import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { TeamTaskItem, TaskPriority, TaskWorkflowStatus } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  StatCard,
  Avatar,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  ListTodo,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ManagerTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TeamTaskItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToName, setAssignedToName] = useState('Sophia Davis');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('Core Engineering');
  const [estimatedHours, setEstimatedHours] = useState(24);

  const loadTasks = async () => {
    const list = await managerService.getTasks();
    setTasks(list);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await managerService.createTask({
      title,
      description,
      assignedToId: 'tm-custom',
      assignedToName,
      assignedToAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      priority,
      status: 'In Progress',
      progress: 0,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      project,
      estimatedHours: Number(estimatedHours),
    });
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    loadTasks();
  };

  const handleStatusChange = async (id: string, newStatus: TaskWorkflowStatus) => {
    await managerService.updateTaskStatus(id, newStatus);
    loadTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch =
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedToName || t.assigneeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.project || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress' || t.status === 'In Review').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent').length;

  const columns: Column<TeamTaskItem>[] = [
    {
      header: 'Task Title & Project',
      accessorKey: 'title',
      cell: (row) => (
        <div className="max-w-sm">
          <p className="font-bold text-xs text-slate-900 dark:text-white">{row.title}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
            {row.project}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Assignee',
      accessorKey: 'assignedToName',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.assignedToAvatar} name={row.assignedToName} size="xs" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.assignedToName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row) => {
        const variants: Record<TaskPriority, 'danger' | 'warning' | 'primary' | 'neutral'> = {
          Urgent: 'danger',
          High: 'warning',
          Medium: 'primary',
          Low: 'neutral',
        };
        return <Badge variant={variants[row.priority]}>{row.priority}</Badge>;
      },
      sortable: true,
    },
    {
      header: 'Due Date & Progress',
      accessorKey: 'dueDate',
      cell: (row) => (
        <div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{formatDate(row.dueDate)}</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-20 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  row.progress > 80 ? 'bg-emerald-500' : row.progress > 40 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${row.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500">{row.progress}%</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Status & Workflow',
      accessorKey: 'status',
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value as TaskWorkflowStatus)}
          className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="Backlog">Backlog</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Team Tasks & Sprint Workload Management"
        subtitle="Delegate deliverables, balance sprint workloads, track project completion velocity, and monitor due dates."
        icon={ListTodo}
        badge={<Badge variant="primary">{tasks.length} Active Tasks</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Assign New Task
          </Button>
        }
      />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assigned Tasks"
          value={tasks.length.toString()}
          icon={<ListTodo className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="Sprint 14 Backlog"
          isPositive={true}
        />
        <StatCard
          title="In Progress / Review"
          value={inProgressCount.toString()}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          change="Active Execution"
          isPositive={true}
        />
        <StatCard
          title="Urgent Deliverables"
          value={urgentCount.toString()}
          icon={<AlertCircle className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          change="Due this week"
          isPositive={false}
        />
        <StatCard
          title="Completed Velocity"
          value={completedCount.toString()}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          change="Quality Verified"
          isPositive={true}
        />
      </div>

      {/* FILTER & SEARCH */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Urgent', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by title, project, assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>
      </Card>

      {/* DATA TABLE */}
      <DataTable columns={columns} data={filteredTasks} pageSize={10} />

      {/* ASSIGN TASK MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Assign New Task to Team Member"
        description="Specify task deliverable, assignee, priority level, and target due date."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Deliverable Title"
            placeholder="e.g. Implement WebSockets live notification feed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assignee (Direct Report)"
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              options={[
                { value: 'Sophia Davis', label: 'Sophia Davis (Senior Backend)' },
                { value: 'Liam Vance', label: 'Liam Vance (Fullstack Dev)' },
                { value: 'Alex Rivera', label: 'Alex Rivera (DevOps Lead)' },
                { value: 'Emily Clark', label: 'Emily Clark (QA Engineer)' },
              ]}
            />
            <Select
              label="Task Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: 'Urgent', label: 'Urgent (Same Day / Blocker)' },
                { value: 'High', label: 'High Priority (This Sprint)' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority / Nice to have' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Stream"
              placeholder="e.g. Core Architecture"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            />
            <Input
              label="Target Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <Input
            label="Task Requirements & Acceptance Criteria"
            placeholder="Provide technical specifications, test edge cases, and endpoints."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Delegate Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
