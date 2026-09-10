import { GoalOKR, PerformanceReview } from '../types';
import { INITIAL_GOALS, INITIAL_EMPLOYEES } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const performanceService = {
  getGoals: async (): Promise<GoalOKR[]> => {
    return getFromStorage<GoalOKR[]>('goals', INITIAL_GOALS);
  },

  createGoal: async (data: Partial<GoalOKR>): Promise<GoalOKR> => {
    const goals = getFromStorage<GoalOKR[]>('goals', INITIAL_GOALS);
    const newGoal: GoalOKR = {
      id: `goal-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      title: data.title || 'Untitled Goal',
      description: data.description || '',
      ownerId: data.ownerId || 'emp-1',
      ownerName: data.ownerName || 'Rahul Sharma',
      ownerAvatar: data.ownerAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      department: data.department || 'Engineering',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || '2024-06-30',
      progress: data.progress || 0,
      status: 'In Progress',
      category: data.category || 'Individual',
      keyResults: data.keyResults || [
        { id: `kr-${Date.now()}`, title: 'Complete primary milestone', target: 100, current: 0, unit: '%' }
      ],
    };
    const updated = [newGoal, ...goals];
    saveToStorage('goals', updated);
    return newGoal;
  },

  updateGoalProgress: async (goalId: string, progress: number): Promise<GoalOKR> => {
    const goals = getFromStorage<GoalOKR[]>('goals', INITIAL_GOALS);
    const index = goals.findIndex(g => g.id === goalId);
    if (index === -1) throw new Error('Goal not found');
    goals[index].progress = progress;
    if (progress >= 100) goals[index].status = 'Completed';
    saveToStorage('goals', goals);
    return goals[index];
  },

  getReviews: async (): Promise<PerformanceReview[]> => {
    return [
      {
        id: 'rev-1',
        organizationId: 'org-1',
        employeeId: 'emp-1',
        employeeName: 'Rahul Sharma',
        employeeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        reviewerId: 'user-manager',
        reviewerName: 'Amit Verma',
        cycle: 'Q1 2024 Appraisal',
        rating: 4.8,
        status: 'Completed',
        submissionDate: '2024-04-15',
        strengths: 'Exceptional code quality, mentoring junior developers, and timely delivery of core modules.',
        areasOfImprovement: 'Could delegate more frontend tasks to focus on architectural scaling.',
        feedback: 'Overall an outstanding performer who consistently exceeds expectations.',
      },
      {
        id: 'rev-2',
        organizationId: 'org-1',
        employeeId: 'emp-2',
        employeeName: 'Priya Singh',
        employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        reviewerId: 'user-org-owner',
        reviewerName: 'Sarah Jenkins',
        cycle: 'Q1 2024 Appraisal',
        rating: 4.6,
        status: 'Completed',
        submissionDate: '2024-04-18',
        strengths: 'Led high-converting marketing campaigns resulting in 35% user growth.',
        areasOfImprovement: 'Deepen analytics instrumentation for attribution tracking.',
        feedback: 'Great leadership and execution across all digital initiatives.',
      }
    ];
  },

  getTopPerformers: async () => {
    return [
      { name: 'Rahul Sharma', designation: 'Senior Software Engineer', score: '98%', avatar: INITIAL_EMPLOYEES[0].avatar },
      { name: 'Priya Singh', designation: 'Marketing Director', score: '95%', avatar: INITIAL_EMPLOYEES[1].avatar },
      { name: 'Sarah Connor', designation: 'Frontend Lead', score: '94%', avatar: INITIAL_EMPLOYEES[5].avatar },
      { name: 'Neha Gupta', designation: 'HR Executive', score: '91%', avatar: INITIAL_EMPLOYEES[3].avatar },
    ];
  }
};
