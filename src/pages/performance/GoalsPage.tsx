import React, { useState, useEffect } from 'react';
import { performanceService } from '../../services/performanceService';
import { GoalOKR, PerformanceReview } from '../../types';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
} from '../../components/ui';
import {
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Plus,
  TrendingUp,
  Star,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalOKR[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [dueDate, setDueDate] = useState('2024-06-30');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    const [gList, rList, tp] = await Promise.all([
      performanceService.getGoals(),
      performanceService.getReviews(),
      performanceService.getTopPerformers(),
    ]);
    setGoals(gList);
    setReviews(rList);
    setTopPerformers(tp);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    await performanceService.createGoal({
      title,
      department,
      dueDate,
      description,
    });
    setIsGoalModalOpen(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  const handleUpdateProgress = async (goalId: string, val: number) => {
    await performanceService.updateGoalProgress(goalId, val);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance, OKRs & Appraisals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track company key results, align departmental objectives, and manage 360° reviews.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsGoalModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Set New OKR Goal
        </Button>
      </div>

      {/* Stats Cards Row (Matching Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Goals"
          value={48}
          change="+8 goals"
          isPositive={true}
          icon={<Target className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Completed"
          value={32}
          change="67% rate"
          isPositive={true}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="In Progress"
          value={12}
          change="Active track"
          isPositive={true}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          title="At Risk / Overdue"
          value={4}
          change="Needs focus"
          isPositive={false}
          icon={<AlertTriangle className="h-5 w-5 text-rose-600" />}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
        />
      </div>

      {/* Middle Row: Progress Meter + Top Performers List (Matching Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Meter */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-40 w-40 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">67%</span>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase mt-1">Goal Completion</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Overall Organization Progress</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">32 out of 48 strategic quarterly objectives achieved across all departments.</p>
          </div>
        </Card>

        {/* Top Performers Leaderboard */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Top Performers Leaderboard (Q1)
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {topPerformers.map((tp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-400 w-4">#{idx + 1}</span>
                  <Avatar src={tp.avatar} name={tp.name} size="sm" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{tp.name}</h4>
                    <p className="text-[10px] text-slate-400">{tp.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: tp.score }} />
                  </div>
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 w-10 text-right">{tp.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active OKR Goals Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Quarterly Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} hoverEffect className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={goal.status === 'Completed' ? 'success' : 'warning'} size="sm">
                    {goal.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium">Due {formatDate(goal.dueDate)}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{goal.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{goal.description}</p>

                <div className="flex items-center gap-2 pt-1">
                  <Avatar src={goal.ownerAvatar} name={goal.ownerName} size="xs" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{goal.ownerName}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{goal.department}</span>
                </div>
              </div>

              {/* Interactive Progress Slider */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-dark-border">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Progress</span>
                  <span className="text-blue-600">{goal.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Set New OKR Goal"
        description="Define measurable key results and target due dates."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateGoal}>
              Create OKR Goal
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Objective Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Expand Customer Retention Rate to 95%"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Human Resources', label: 'Human Resources' },
              ]}
            />
            <Input
              label="Target Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Key Results
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the qualitative impact and milestones..."
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
