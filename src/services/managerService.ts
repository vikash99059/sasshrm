import {
  TeamMember,
  AttendanceRegularizationRequest,
  OvertimeLog,
  TeamLeaveApplication,
  TeamTaskItem,
  TeamGoalOKR,
  QuarterlyReviewCard,
  ManagerCandidateEvaluation,
  BonusHikeProposal,
  SpotRecognition,
  TeamExpenseClaim,
  ManpowerRequest,
} from '../types/manager';
import { getFromStorage, saveToStorage } from './storage';

export * from '../types/manager';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    employeeCode: 'EMP002',
    name: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    designation: 'Senior Backend Engineer',
    department: 'Core Engineering',
    email: 'sophia.davis@company.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru (HQ)',
    workMode: 'Hybrid',
    status: 'Online',
    attendanceToday: 'Present',
    todayStatus: 'Present',
    checkInTime: '09:12 AM',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Kubernetes', 'Go'],
    activeProject: 'Microservices Core API 2.0',
    project: 'Microservices Core API 2.0',
    joiningDate: '2022-03-15',
    performanceScore: 94,
    leavesRemaining: 14,
  },
  {
    id: 'tm-2',
    employeeCode: 'EMP003',
    name: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Fullstack Developer',
    department: 'Core Engineering',
    email: 'liam.vance@company.com',
    phone: '+91 98765 43211',
    location: 'Bengaluru (HQ)',
    workMode: 'On-site',
    status: 'In Meeting',
    attendanceToday: 'Present',
    todayStatus: 'Present',
    checkInTime: '09:05 AM',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'GraphQL', 'Next.js'],
    activeProject: 'Design System & UI Components',
    project: 'Design System & UI Components',
    joiningDate: '2023-01-10',
    performanceScore: 88,
    leavesRemaining: 18,
  },
  {
    id: 'tm-3',
    employeeCode: 'EMP004',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    designation: 'DevOps & SRE Lead',
    department: 'Infrastructure',
    email: 'alex.rivera@company.com',
    phone: '+91 98765 43212',
    location: 'Remote (Hyderabad)',
    workMode: 'Remote',
    status: 'Online',
    attendanceToday: 'Present',
    todayStatus: 'Present',
    checkInTime: '08:45 AM',
    skills: ['AWS', 'Terraform', 'CI/CD', 'Prometheus', 'Docker'],
    activeProject: 'Multi-Region Failover Architecture',
    project: 'Multi-Region Failover Architecture',
    joiningDate: '2021-11-01',
    performanceScore: 96,
    leavesRemaining: 11,
  },
  {
    id: 'tm-4',
    employeeCode: 'EMP005',
    name: 'James Miller',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    designation: 'Frontend Specialist',
    department: 'Core Engineering',
    email: 'james.miller@company.com',
    phone: '+91 98765 43213',
    location: 'Bengaluru (HQ)',
    workMode: 'Hybrid',
    status: 'On Leave',
    attendanceToday: 'On Leave',
    todayStatus: 'On-Leave',
    checkInTime: '---',
    skills: ['React', 'Vue', 'CSS Architecture', 'WebSockets', 'Jest'],
    activeProject: 'Realtime Collaboration Canvas',
    project: 'Realtime Collaboration Canvas',
    joiningDate: '2023-06-20',
    performanceScore: 85,
    leavesRemaining: 15,
  },
  {
    id: 'tm-5',
    employeeCode: 'EMP006',
    name: 'Emily Clark',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'QA Automation Engineer',
    department: 'Quality Assurance',
    email: 'emily.clark@company.com',
    phone: '+91 98765 43214',
    location: 'Bengaluru (HQ)',
    workMode: 'On-site',
    status: 'Online',
    attendanceToday: 'Late',
    todayStatus: 'Late',
    checkInTime: '09:48 AM',
    skills: ['Cypress', 'Playwright', 'Selenium', 'Python', 'Postman'],
    activeProject: 'End-to-End Test Suite Coverage',
    project: 'End-to-End Test Suite Coverage',
    joiningDate: '2023-08-15',
    performanceScore: 91,
    leavesRemaining: 19,
  },
];

export const INITIAL_REGULARIZATIONS: AttendanceRegularizationRequest[] = [
  {
    id: 'reg-01',
    employeeId: 'tm-5',
    employeeName: 'Emily Clark',
    employeeCode: 'EMP006',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    date: '2026-09-15',
    requestedCheckIn: '09:00 AM',
    requestedCheckOut: '06:15 PM',
    originalPunch: 'Missing Out Punch',
    originalCheckIn: '09:00 AM',
    originalCheckOut: 'Missing',
    type: 'Missing Punch',
    reason: 'Biometric fingerprint scanner malfunction during evening rush.',
    status: 'Pending',
    appliedDate: '2026-09-16',
  },
  {
    id: 'reg-02',
    employeeId: 'tm-2',
    employeeName: 'Liam Vance',
    employeeCode: 'EMP003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '2026-09-14',
    requestedCheckIn: '08:30 AM',
    requestedCheckOut: '05:30 PM',
    originalPunch: 'Late check-in recorded at 10:15 AM',
    originalCheckIn: '10:15 AM',
    originalCheckOut: '05:30 PM',
    type: 'Late Regularization',
    reason: 'Attended client onsite kickoff meeting before arriving at main office.',
    status: 'Pending',
    appliedDate: '2026-09-15',
  },
];

export const INITIAL_OVERTIME: OvertimeLog[] = [
  {
    id: 'ot-01',
    employeeId: 'tm-3',
    employeeName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: '2026-09-14',
    hours: 3.5,
    project: 'Production Database Failover Drill',
    projectTask: 'Production Database Failover Drill',
    reason: 'Scheduled maintenance window execution outside of business hours.',
    status: 'Pending',
    ratePerHour: 450,
    payoutEstimate: 157.5,
  },
  {
    id: 'ot-02',
    employeeId: 'tm-1',
    employeeName: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2026-09-12',
    hours: 2.0,
    project: 'GraphQL Gateway Hotfix Deployment',
    projectTask: 'GraphQL Gateway Hotfix Deployment',
    reason: 'Emergency patch release for high-priority payment webhook callback issue.',
    status: 'Approved',
    ratePerHour: 500,
    payoutEstimate: 100.0,
  },
];

export const INITIAL_LEAVE_REQUESTS: TeamLeaveApplication[] = [
  {
    id: 'leave-01',
    employeeId: 'tm-4',
    employeeName: 'James Miller',
    employeeCode: 'EMP005',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    leaveType: 'Annual',
    startDate: '2026-09-22',
    endDate: '2026-09-24',
    days: 3,
    reason: 'Family wedding out of town.',
    status: 'Pending',
    appliedDate: '2026-09-16',
    handoverTo: 'Liam Vance',
  },
  {
    id: 'leave-02',
    employeeId: 'tm-5',
    employeeName: 'Emily Clark',
    employeeCode: 'EMP006',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    leaveType: 'Casual',
    startDate: '2026-09-29',
    endDate: '2026-09-29',
    days: 1,
    reason: 'Personal household maintenance and relocation.',
    status: 'Pending',
    appliedDate: '2026-09-15',
  },
];

export const INITIAL_TASKS: TeamTaskItem[] = [
  {
    id: 'task-01',
    title: 'Migrate Core Auth Endpoints to JWT v2',
    description: 'Upgrade legacy session tokens to asymmetric RS256 JWTs with rolling refresh tokens.',
    assignedToId: 'tm-1',
    assignedToName: 'Sophia Davis',
    assignedToAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    assigneeId: 'tm-1',
    assigneeName: 'Sophia Davis',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    priority: 'Urgent',
    status: 'In Progress',
    dueDate: '2026-09-20',
    progress: 75,
    project: 'Microservices Core API 2.0',
    estimatedHours: 24,
    commentsCount: 6,
  },
  {
    id: 'task-02',
    title: 'Component Library Accessibility (a11y) Audit',
    description: 'Ensure full WCAG 2.1 AA compliance across all modals, dropdowns, and buttons.',
    assignedToId: 'tm-2',
    assignedToName: 'Liam Vance',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    assigneeId: 'tm-2',
    assigneeName: 'Liam Vance',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-09-25',
    progress: 50,
    project: 'Design System & UI Components',
    estimatedHours: 16,
    commentsCount: 3,
  },
  {
    id: 'task-03',
    title: 'Automate Canary Deployments in EKS Cluster',
    description: 'Implement Argo Rollouts for automated canary validation with Prometheus metrics.',
    assignedToId: 'tm-3',
    assignedToName: 'Alex Rivera',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    assigneeId: 'tm-3',
    assigneeName: 'Alex Rivera',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    priority: 'Medium',
    status: 'To-Do',
    dueDate: '2026-09-30',
    progress: 10,
    project: 'Multi-Region Failover Architecture',
    estimatedHours: 32,
    commentsCount: 1,
  },
];

export const INITIAL_GOALS: TeamGoalOKR[] = [
  {
    id: 'goal-01',
    employeeId: 'tm-1',
    employeeName: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'Achieve sub-50ms p99 Latency on Payment Endpoints',
    description: 'Refactor database queries and introduce multi-level Redis caching.',
    category: 'Engineering & Code',
    progress: 82,
    targetDate: '2026-09-30',
    status: 'On-Track',
    weightage: 30,
    kpiMetric: 'p99 latency < 50ms',
    keyResults: [
      { description: 'Optimize SQL joins and add indexes', completed: true },
      { description: 'Implement Redis cluster caching', completed: true },
      { description: 'Load test at 10,000 req/sec', completed: false }
    ]
  },
  {
    id: 'goal-02',
    employeeId: 'tm-5',
    employeeName: 'Emily Clark',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'Increase Automated E2E Regression Coverage to 90%',
    description: 'Implement Cypress parallel test runs across all critical SaaS user journeys.',
    category: 'Delivery & Velocity',
    progress: 65,
    targetDate: '2026-10-15',
    status: 'On-Track',
    weightage: 25,
    kpiMetric: 'Coverage >= 90%',
    keyResults: [
      { description: 'Cover all auth & billing flows', completed: true },
      { description: 'Cover manager & recruiter portals', completed: false }
    ]
  },
];

export const INITIAL_REVIEWS: QuarterlyReviewCard[] = [
  {
    id: 'rev-01',
    employeeId: 'tm-1',
    employeeName: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    designation: 'Senior Backend Engineer',
    period: 'Q3 2026',
    cycle: 'Q3 2026',
    selfRating: 4.8,
    managerRating: 4.9,
    technicalRating: 5,
    deliveryRating: 4.8,
    leadershipRating: 4.5,
    overallScore: 4.8,
    selfEvaluationNotes: 'Delivered high-throughput microservices architecture with zero regressions.',
    managerFeedback: 'Outstanding technical execution and exceptional mentorship to junior developers.',
    strengths: 'System architecture, asynchronous distributed systems, reliability',
    areasOfImprovement: 'Could delegate more routine code reviews to mid-level engineers.',
    status: 'Completed',
    submissionDate: '2026-09-10',
    reviewDate: '2026-09-10',
  },
  {
    id: 'rev-02',
    employeeId: 'tm-2',
    employeeName: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    designation: 'Fullstack Developer',
    period: 'Q3 2026',
    cycle: 'Q3 2026',
    selfRating: 4.2,
    selfEvaluationNotes: 'Completed frontend design system revamps and dark mode support.',
    status: 'Manager-Review',
    submissionDate: '2026-09-12',
  }
];

export const INITIAL_EVALUATIONS: ManagerCandidateEvaluation[] = [
  {
    id: 'eval-01',
    candidateName: 'Vikram Seth',
    position: 'Senior React / Fullstack Engineer',
    requisitionTitle: 'Senior React / Fullstack Engineer',
    experience: '6.5 Years',
    interviewDate: '2026-09-14',
    interviewRound: 'Technical Architecture Round (Manager)',
    round: 'Technical Architecture Round',
    score: 9.0,
    technicalSkillsScore: 4.5,
    problemSolvingScore: 4.8,
    cultureFitScore: 4.5,
    recommendation: 'Strong Hire',
    feedbackNotes: 'Exceptional mastery of React fiber internals, state management, and high-scale rendering optimizations. Highly recommended for Senior IC position.',
    status: 'Recommended to HR',
  },
  {
    id: 'eval-02',
    candidateName: 'Meera Nambiar',
    position: 'DevOps / Cloud Platform Engineer',
    requisitionTitle: 'DevOps / Cloud Platform Engineer',
    experience: '4.0 Years',
    interviewDate: '2026-09-16',
    interviewRound: 'Hands-on Coding & Infrastructure Round',
    round: 'Hands-on Infrastructure',
    score: 8.0,
    technicalSkillsScore: 3.8,
    problemSolvingScore: 4.0,
    cultureFitScore: 4.2,
    recommendation: 'Hire',
    feedbackNotes: 'Good hands-on Terraform and Kubernetes knowledge. Ready to extend offer.',
    status: 'Pending Evaluation',
  },
];

export const INITIAL_HIKE_PROPOSALS: BonusHikeProposal[] = [
  {
    id: 'prop-01',
    employeeId: 'tm-1',
    employeeName: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    designation: 'Senior Backend Engineer',
    type: 'Bonus',
    proposedBonusAmount: 2500,
    effectiveCycle: 'Q3 2026',
    justification: 'Led the microservices migration project resulting in 40% cloud cost reduction and 99.99% uptime SLA.',
    status: 'Pending-HR-Approval',
    submissionDate: '2026-09-10',
  },
  {
    id: 'prop-02',
    employeeId: 'tm-3',
    employeeName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    designation: 'DevOps & SRE Lead',
    type: 'Hike',
    proposedHikePercentage: 15,
    effectiveCycle: 'Annual 2026',
    justification: 'Critical single-point of reliability for all multi-region cloud infrastructure.',
    status: 'Pending-HR-Approval',
    submissionDate: '2026-09-12',
  }
];

export const INITIAL_AWARDS: SpotRecognition[] = [
  {
    id: 'spot-01',
    employeeId: 'tm-3',
    employeeName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    awardTitle: 'Architecture Innovation',
    badgeTitle: 'Architecture Innovation 🚀',
    category: 'Innovation',
    points: 500,
    citation: 'For architecting the multi-region zero-downtime failover cluster on AWS!',
    message: 'For architecting the multi-region zero-downtime failover cluster on AWS!',
    awardedDate: '2026-09-12',
  },
  {
    id: 'spot-02',
    employeeId: 'tm-1',
    employeeName: 'Sophia Davis',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    awardTitle: 'Star Performer of the Sprint',
    badgeTitle: 'Sprint MVP 🏆',
    category: 'Leadership',
    points: 400,
    citation: 'Flawless execution of the API gateway refactor ahead of deadline!',
    message: 'Flawless execution of the API gateway refactor ahead of deadline!',
    awardedDate: '2026-09-10',
  },
];

export const INITIAL_EXPENSES: TeamExpenseClaim[] = [
  {
    id: 'exp-01',
    employeeId: 'tm-2',
    employeeName: 'Liam Vance',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'Software Tool',
    amount: 149.00,
    description: 'Figma Enterprise Plugin License & Dev Mode Subscription',
    receiptUrl: 'INV-2026-8831.pdf',
    expenseDate: '2026-09-12',
    submittedDate: '2026-09-14',
    status: 'Pending',
  },
  {
    id: 'exp-02',
    employeeId: 'tm-3',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    category: 'Travel',
    amount: 320.50,
    description: 'Round-trip flight to Hyderabad data center for server upgrade',
    receiptUrl: 'AIR-HYD-552.pdf',
    expenseDate: '2026-09-10',
    submittedDate: '2026-09-11',
    status: 'Approved',
  },
];

export const INITIAL_MANPOWER: ManpowerRequest[] = [
  {
    id: 'mpr-01',
    jobTitle: 'Senior Backend Engineer (Go / Distributed Systems)',
    department: 'Core Engineering',
    count: 2,
    urgency: 'High',
    budgetRange: '$110,000 - $140,000 / annum',
    justification: 'Support upcoming high-frequency transactional banking ledger integration.',
    status: 'Pending-HR-Review',
    requestDate: '2026-09-10',
  },
];

export const managerService = {
  // Sync Getters
  getTeamMembers: (): TeamMember[] => {
    return getFromStorage<TeamMember[]>('manager_team_members', INITIAL_TEAM_MEMBERS);
  },

  getRegularizationRequests: (): AttendanceRegularizationRequest[] => {
    return getFromStorage<AttendanceRegularizationRequest[]>('manager_regularizations', INITIAL_REGULARIZATIONS);
  },

  getTeamOvertime: (): OvertimeLog[] => {
    return getFromStorage<OvertimeLog[]>('manager_overtime', INITIAL_OVERTIME);
  },

  getTeamLeaves: (): TeamLeaveApplication[] => {
    return getFromStorage<TeamLeaveApplication[]>('manager_leave_requests', INITIAL_LEAVE_REQUESTS);
  },

  getTeamTasks: (): TeamTaskItem[] => {
    return getFromStorage<TeamTaskItem[]>('manager_tasks', INITIAL_TASKS);
  },

  getTeamGoals: (): TeamGoalOKR[] => {
    return getFromStorage<TeamGoalOKR[]>('manager_goals', INITIAL_GOALS);
  },

  getQuarterlyReviews: (): QuarterlyReviewCard[] => {
    return getFromStorage<QuarterlyReviewCard[]>('manager_reviews', INITIAL_REVIEWS);
  },

  getCandidateEvaluations: (): ManagerCandidateEvaluation[] => {
    return getFromStorage<ManagerCandidateEvaluation[]>('manager_evaluations', INITIAL_EVALUATIONS);
  },

  getManpowerRequests: (): ManpowerRequest[] => {
    return getFromStorage<ManpowerRequest[]>('manager_manpower_requests', INITIAL_MANPOWER);
  },

  getTeamExpenses: (): TeamExpenseClaim[] => {
    return getFromStorage<TeamExpenseClaim[]>('manager_expenses', INITIAL_EXPENSES);
  },

  getBonusHikeProposals: (): BonusHikeProposal[] => {
    return getFromStorage<BonusHikeProposal[]>('manager_hike_proposals', INITIAL_HIKE_PROPOSALS);
  },

  getSpotRecognitions: (): SpotRecognition[] => {
    return getFromStorage<SpotRecognition[]>('manager_spot_awards', INITIAL_AWARDS);
  },

  // Actions
  approveLeaveRequest: (id: string): void => {
    const list = managerService.getTeamLeaves();
    const updated = list.map((l) => (l.id === id ? { ...l, status: 'Approved' as const } : l));
    saveToStorage('manager_leave_requests', updated);
  },

  rejectLeaveRequest: (id: string): void => {
    const list = managerService.getTeamLeaves();
    const updated = list.map((l) => (l.id === id ? { ...l, status: 'Rejected' as const } : l));
    saveToStorage('manager_leave_requests', updated);
  },

  approveRegularization: (id: string): void => {
    const list = managerService.getRegularizationRequests();
    const updated = list.map((r) => (r.id === id ? { ...r, status: 'Approved' as const } : r));
    saveToStorage('manager_regularizations', updated);
  },

  rejectRegularization: (id: string): void => {
    const list = managerService.getRegularizationRequests();
    const updated = list.map((r) => (r.id === id ? { ...r, status: 'Rejected' as const } : r));
    saveToStorage('manager_regularizations', updated);
  },

  approveOvertime: (id: string): void => {
    const list = managerService.getTeamOvertime();
    const updated = list.map((o) => (o.id === id ? { ...o, status: 'Approved' as const } : o));
    saveToStorage('manager_overtime', updated);
  },

  rejectOvertime: (id: string): void => {
    const list = managerService.getTeamOvertime();
    const updated = list.map((o) => (o.id === id ? { ...o, status: 'Rejected' as const } : o));
    saveToStorage('manager_overtime', updated);
  },

  approveExpenseClaim: (id: string, notes?: string): void => {
    const list = managerService.getTeamExpenses();
    const updated = list.map((e) => (e.id === id ? { ...e, status: 'Approved' as const } : e));
    saveToStorage('manager_expenses', updated);
  },

  rejectExpenseClaim: (id: string, reason?: string): void => {
    const list = managerService.getTeamExpenses();
    const updated = list.map((e) => (e.id === id ? { ...e, status: 'Rejected' as const, rejectionReason: reason } : e));
    saveToStorage('manager_expenses', updated);
  },

  createTeamTask: (task: Omit<TeamTaskItem, 'id' | 'commentsCount'>): TeamTaskItem => {
    const list = managerService.getTeamTasks();
    const newTask: TeamTaskItem = {
      ...task,
      id: `task-${Date.now()}`,
      commentsCount: 0,
    };
    saveToStorage('manager_tasks', [newTask, ...list]);
    return newTask;
  },

  updateTaskStatus: (id: string, status: TeamTaskItem['status'], progress?: number): void => {
    const list = managerService.getTeamTasks();
    const updated = list.map((t) => {
      if (t.id !== id) return t;
      return {
        ...t,
        status,
        progress: progress !== undefined ? progress : status === 'Completed' ? 100 : t.progress,
      };
    });
    saveToStorage('manager_tasks', updated);
  },

  createTeamGoal: (goal: Omit<TeamGoalOKR, 'id'>): TeamGoalOKR => {
    const list = managerService.getTeamGoals();
    const newGoal: TeamGoalOKR = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    saveToStorage('manager_goals', [newGoal, ...list]);
    return newGoal;
  },

  submitReviewScorecard: (reviewId: string, rating: number, feedback: string): void => {
    const list = managerService.getQuarterlyReviews();
    const updated = list.map((r) => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        managerRating: rating,
        managerFeedback: feedback,
        status: 'Completed' as const,
      };
    });
    saveToStorage('manager_reviews', updated);
  },

  addSpotRecognition: (rec: Omit<SpotRecognition, 'id'>): SpotRecognition => {
    const list = managerService.getSpotRecognitions();
    const newAward: SpotRecognition = {
      ...rec,
      id: `spot-${Date.now()}`,
    };
    saveToStorage('manager_spot_awards', [newAward, ...list]);
    return newAward;
  },

  createManpowerRequest: (req: Omit<ManpowerRequest, 'id'>): ManpowerRequest => {
    const list = managerService.getManpowerRequests();
    const newReq: ManpowerRequest = {
      ...req,
      id: `mpr-${Date.now()}`,
    };
    saveToStorage('manager_manpower_requests', [newReq, ...list]);
    return newReq;
  },

  submitCandidateEvaluation: (id: string, score: number, recommendation: ManagerCandidateEvaluation['recommendation'], notes: string): void => {
    const list = managerService.getCandidateEvaluations();
    const updated = list.map((ev) => {
      if (ev.id !== id) return ev;
      return {
        ...ev,
        score,
        recommendation,
        feedbackNotes: notes,
      };
    });
    saveToStorage('manager_evaluations', updated);
  },

  createBonusHikeProposal: (prop: Omit<BonusHikeProposal, 'id'>): BonusHikeProposal => {
    const list = managerService.getBonusHikeProposals();
    const newProp: BonusHikeProposal = {
      ...prop,
      id: `prop-${Date.now()}`,
    };
    saveToStorage('manager_hike_proposals', [newProp, ...list]);
    return newProp;
  },
  createHikeProposal: (prop: Omit<BonusHikeProposal, 'id'>): BonusHikeProposal => managerService.createBonusHikeProposal(prop),

  // Aliases for component convenience
  getTasks: (): TeamTaskItem[] => managerService.getTeamTasks(),
  createTask: (task: Omit<TeamTaskItem, 'id' | 'commentsCount'>): TeamTaskItem => managerService.createTeamTask(task),
  getLeaveRequests: (): TeamLeaveApplication[] => managerService.getTeamLeaves(),
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected'): void => {
    if (status === 'Approved') managerService.approveLeaveRequest(id);
    else managerService.rejectLeaveRequest(id);
  },
  getGoals: (): TeamGoalOKR[] => managerService.getTeamGoals(),
  createGoal: (goal: Omit<TeamGoalOKR, 'id'>): TeamGoalOKR => managerService.createTeamGoal(goal),
  getOvertimeLogs: (): OvertimeLog[] => managerService.getTeamOvertime(),
  getRegularizations: (): AttendanceRegularizationRequest[] => managerService.getRegularizationRequests(),
  updateRegularizationStatus: (id: string, status: 'Approved' | 'Rejected'): void => {
    if (status === 'Approved') managerService.approveRegularization(id);
    else managerService.rejectRegularization(id);
  },
  updateOvertimeStatus: (id: string, status: 'Approved' | 'Rejected'): void => {
    if (status === 'Approved') managerService.approveOvertime(id);
    else managerService.rejectOvertime(id);
  },
  getSpotAwards: (): SpotRecognition[] => managerService.getSpotRecognitions(),
};
