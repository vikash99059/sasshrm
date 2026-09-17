export interface TeamMember {
  id: string;
  employeeCode: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  status: 'Online' | 'In Meeting' | 'On Leave' | 'Offline';
  attendanceToday: 'Present' | 'Late' | 'On Leave' | 'Absent';
  todayStatus?: 'Present' | 'Late' | 'On-Leave' | 'Absent';
  checkInTime?: string;
  skills: string[];
  activeProject: string;
  project?: string;
  joiningDate: string;
  performanceScore: number; // e.g. 92%
  leavesRemaining: number;
}

export interface AttendanceRegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  avatar?: string;
  employeeAvatar?: string;
  date: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  originalPunch?: string;
  originalCheckIn?: string;
  originalCheckOut?: string;
  type?: 'Missing Punch' | 'Late Regularization' | 'Early Leaving' | 'On-Duty Travel';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate?: string;
}

export interface OvertimeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  employeeAvatar?: string;
  date: string;
  hours: number;
  project?: string;
  projectTask?: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  ratePerHour?: number;
  payoutEstimate: number;
}

export interface TeamLeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  avatar?: string;
  employeeAvatar?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  handoverTo?: string;
}

export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskWorkflowStatus = 'Backlog' | 'To-Do' | 'In Progress' | 'In Review' | 'Completed';

export interface TeamTaskItem {
  id: string;
  title: string;
  description: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  priority: TaskPriority;
  status: TaskWorkflowStatus;
  dueDate: string;
  progress: number; // 0 - 100
  project?: string;
  estimatedHours?: number;
  commentsCount?: number;
}

export interface TeamGoalOKR {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  employeeAvatar?: string;
  title: string;
  description?: string;
  category: string;
  progress: number;
  targetDate: string;
  status: 'On Track' | 'On-Track' | 'At Risk' | 'At-Risk' | 'Behind' | 'Completed';
  weightage?: number;
  kpiMetric?: string;
  keyResults?: { description: string; completed: boolean }[];
}

export interface QuarterlyReviewCard {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  employeeAvatar?: string;
  designation: string;
  period?: string;
  cycle?: string;
  selfRating?: number;
  selfEvaluationNotes?: string;
  managerRating?: number;
  technicalRating?: number;
  deliveryRating?: number;
  leadershipRating?: number;
  overallScore?: number;
  managerFeedback?: string;
  strengths?: string;
  areasOfImprovement?: string;
  status: 'Draft' | 'Submitted' | 'Manager-Review' | 'Completed' | 'Acknowledged by Employee';
  submissionDate?: string;
  reviewDate?: string;
}

export interface ManagerCandidateEvaluation {
  id: string;
  candidateName: string;
  position?: string;
  requisitionTitle?: string;
  experience?: string;
  interviewDate: string;
  interviewRound?: string;
  round?: string;
  score: number;
  technicalSkillsScore?: number;
  problemSolvingScore?: number;
  cultureFitScore?: number;
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
  feedbackNotes: string;
  status?: 'Pending Evaluation' | 'Recommended to HR' | 'Rejected';
}

export interface BonusHikeProposal {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  employeeAvatar?: string;
  designation?: string;
  type?: 'Bonus' | 'Incentive' | 'Hike';
  currentAnnualCtc?: number;
  proposedHikePercentage?: number;
  proposedAnnualCtc?: number;
  proposedBonusAmount?: number;
  recommendedBonus?: number;
  performanceTier?: string;
  effectiveCycle?: string;
  justification: string;
  status: 'Pending HR Approval' | 'Pending-HR-Approval' | 'Approved' | 'Approved by HR' | 'Rejected';
  submissionDate: string;
}

export interface SpotRecognition {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar?: string;
  employeeAvatar?: string;
  awardTitle?: string;
  badgeTitle?: string;
  category?: 'Innovation' | 'Leadership' | 'Team Player' | 'Customer Delight' | 'Speed';
  points: number;
  citation?: string;
  message?: string;
  awardedDate: string;
}

export interface TeamExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  category: 'Travel' | 'Meals' | 'Software Tool' | 'Client Entertainment' | 'Hardware';
  amount: number;
  description: string;
  receiptUrl?: string;
  expenseDate: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

export interface ManpowerRequest {
  id: string;
  jobTitle: string;
  department: string;
  count: number;
  urgency: 'Low' | 'Medium' | 'High';
  budgetRange: string;
  justification: string;
  status: 'Pending-HR-Review' | 'Approved' | 'Rejected';
  requestDate: string;
}
