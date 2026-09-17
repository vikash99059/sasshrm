import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import {
  Folder,
  Layers,
  ListTodo,
  Boxes,
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Hourglass,
  Flame,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  User,
  ShieldCheck,
  Zap,
  GitBranch,
  Bug,
  Rocket,
  RotateCcw,
  BarChart2,
  CheckSquare,
  Sparkles,
  ExternalLink,
  Tag,
  ArrowRight,
  Calendar,
  Building2,
  Award,
  Users,
  UserPlus,
  Settings,
  ShieldAlert,
  Edit2,
  Trash2,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES (TEAMTRAKR PROJECT ARCHITECTURE)
// ============================================================================

export type JiraWorkType = 'Epic' | 'Story' | 'Task' | 'Sub-task' | 'Bug';
export type JiraPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type JiraStatus =
  | 'TO DO'
  | 'IN PROGRESS'
  | 'CODE REVIEW'
  | 'READY FOR QA'
  | 'IN QA'
  | 'QA PASSED'
  | 'RELEASE READY'
  | 'DONE';

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface ProjectEntity {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  manager: string;
  techLead: string;
  budget: string;
  techStack: string[];
  members: ProjectMember[];
  status: 'Planning' | 'Active' | 'Completed';
  startDate: string;
  targetEndDate: string;
}

export interface EpicItem {
  id: string;
  epicKey: string;
  title: string;
  description: string;
  color: string;
  progress: number;
  totalStories: number;
  completedStories: number;
  owner: string;
  targetRelease: string;
  projectId: string;
}

export interface JiraWorkItem {
  id: string;
  itemKey: string;
  type: JiraWorkType;
  title: string;
  description: string;
  epicId?: string;
  epicName?: string;
  projectId: string;
  projectName: string;
  assignee: ProjectMember;
  priority: JiraPriority;
  status: JiraStatus;
  storyPoints: number;
  acceptanceCriteria?: string[];
  bugSeverity?: 'Critical' | 'High' | 'Medium' | 'Low';
  stepsToReproduce?: string;
  dueDate: string;
  releaseVersion: string;
}

// ============================================================================
// INITIAL DEMO DATA
// ============================================================================

const AVAILABLE_ORGS_MEMBERS: ProjectMember[] = [
  { id: 'm-1', name: 'Amit Verma', role: 'UI/UX Lead', email: 'amit@company.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-2', name: 'Neha Singh', role: 'Backend Lead', email: 'neha@company.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-3', name: 'Rahul Mehta', role: 'QA Lead', email: 'rahul@company.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-4', name: 'Pooja Sharma', role: 'Product Manager', email: 'pooja@company.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-5', name: 'Sahil Khan', role: 'DevOps & Security', email: 'sahil@company.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-6', name: 'Rohan Gupta', role: 'Frontend Developer', email: 'rohan@company.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
];

const INITIAL_PROJECTS: ProjectEntity[] = [
  {
    id: 'proj-1',
    key: 'HRM',
    name: 'HRM Portal & Employee Suite',
    description: 'Enterprise human capital management platform including attendance, leave, and performance appraisal.',
    category: 'Human Resources',
    owner: 'Amit Verma',
    manager: 'Pooja Sharma',
    techLead: 'Neha Singh',
    budget: '₹45,00,000',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    members: [AVAILABLE_ORGS_MEMBERS[0], AVAILABLE_ORGS_MEMBERS[1], AVAILABLE_ORGS_MEMBERS[2], AVAILABLE_ORGS_MEMBERS[3]],
    status: 'Active',
    startDate: 'Jan 15, 2025',
    targetEndDate: 'Jun 30, 2025',
  },
  {
    id: 'proj-2',
    key: 'PAY',
    name: 'Statutory Payroll Engine',
    description: 'Automated EPF, ESI, TDS, PT calculations, tax slab configuration, and payslip generation.',
    category: 'Finance & Compliance',
    owner: 'Pooja Sharma',
    manager: 'Neha Singh',
    techLead: 'Sahil Khan',
    budget: '₹30,00,000',
    techStack: ['Python', 'PostgreSQL', 'Docker', 'Redis'],
    members: [AVAILABLE_ORGS_MEMBERS[1], AVAILABLE_ORGS_MEMBERS[4], AVAILABLE_ORGS_MEMBERS[5]],
    status: 'Active',
    startDate: 'Feb 01, 2025',
    targetEndDate: 'May 31, 2025',
  },
  {
    id: 'proj-3',
    key: 'MOB',
    name: 'Mobile ESS & Attendance App',
    description: 'Cross-platform mobile application for employee self-service, geo-fenced clock-in, and leave apply.',
    category: 'Mobile Apps',
    owner: 'Neha Singh',
    manager: 'Amit Verma',
    techLead: 'Rohan Gupta',
    budget: '₹20,00,000',
    techStack: ['React Native', 'GraphQL', 'Firebase'],
    members: [AVAILABLE_ORGS_MEMBERS[0], AVAILABLE_ORGS_MEMBERS[5]],
    status: 'Planning',
    startDate: 'Mar 10, 2025',
    targetEndDate: 'Aug 15, 2025',
  },
];

const INITIAL_EPICS: EpicItem[] = [
  {
    id: 'epic-1',
    epicKey: 'EPIC-01',
    title: 'Employee Onboarding & Lifecycle Management',
    description: 'Complete digital onboarding, document uploads, and contract generation.',
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    progress: 75,
    totalStories: 12,
    completedStories: 9,
    owner: 'Amit Verma',
    targetRelease: 'Release v1.2.0',
    projectId: 'proj-1',
  },
  {
    id: 'epic-2',
    epicKey: 'EPIC-02',
    title: 'Statutory Payroll & Tax Slab Processing',
    description: 'Automated EPF, ESI, TDS, PT deductions, and payslip distribution.',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    progress: 60,
    totalStories: 15,
    completedStories: 9,
    owner: 'Neha Singh',
    targetRelease: 'Release v1.2.0',
    projectId: 'proj-2',
  },
];

const INITIAL_WORK_ITEMS: JiraWorkItem[] = [
  {
    id: 'item-1',
    itemKey: 'HRM-101',
    type: 'Story',
    title: 'As an HR Admin, I want to create an employee account with custom seat permissions',
    description: 'Allow org admins to register employees, set designations, and send onboarding emails.',
    epicId: 'epic-1',
    epicName: 'Employee Onboarding & Lifecycle Management',
    projectId: 'proj-1',
    projectName: 'HRM Portal & Employee Suite',
    assignee: AVAILABLE_ORGS_MEMBERS[0],
    priority: 'High',
    status: 'IN PROGRESS',
    storyPoints: 5,
    dueDate: 'Apr 28, 2025',
    releaseVersion: 'Release v1.1.0',
  },
  {
    id: 'item-2',
    itemKey: 'PAY-102',
    type: 'Task',
    title: 'Implement EPF & TDS Tax Deduction Engine in Payroll Service',
    description: 'Integrate Indian statutory tax slabs calculation based on gross monthly salary.',
    epicId: 'epic-2',
    epicName: 'Statutory Payroll & Tax Slab Processing',
    projectId: 'proj-2',
    projectName: 'Statutory Payroll Engine',
    assignee: AVAILABLE_ORGS_MEMBERS[1],
    priority: 'Critical',
    status: 'CODE REVIEW',
    storyPoints: 8,
    dueDate: 'Apr 30, 2025',
    releaseVersion: 'Release v1.2.0',
  },
  {
    id: 'item-3',
    itemKey: 'HRM-103',
    type: 'Bug',
    title: 'Kanban Board drag-and-drop state reset on page refresh',
    description: 'When moving card to IN QA column, refreshing page reverts card back.',
    epicId: 'epic-1',
    epicName: 'Employee Onboarding & Lifecycle Management',
    projectId: 'proj-1',
    projectName: 'HRM Portal & Employee Suite',
    assignee: AVAILABLE_ORGS_MEMBERS[2],
    priority: 'High',
    status: 'IN QA',
    storyPoints: 3,
    bugSeverity: 'Critical',
    stepsToReproduce: '1. Go to Sprint Board\n2. Drag card to IN QA\n3. Press F5 refresh',
    dueDate: 'Apr 26, 2025',
    releaseVersion: 'Release v1.1.0',
  },
  {
    id: 'item-4',
    itemKey: 'PAY-104',
    type: 'Story',
    title: 'Generate Statutory Form 16 & Tax Computation Sheets',
    description: 'Provide annual tax computation breakdown and downloadable PDF reports.',
    epicId: 'epic-2',
    epicName: 'Statutory Payroll & Tax Slab Processing',
    projectId: 'proj-2',
    projectName: 'Statutory Payroll Engine',
    assignee: AVAILABLE_ORGS_MEMBERS[4],
    priority: 'High',
    status: 'TO DO',
    storyPoints: 5,
    dueDate: 'May 10, 2025',
    releaseVersion: 'Release v1.2.0',
  },
];

// ============================================================================
// MAIN COMPONENT: TEAMTRAKR PROJECT-FIRST WORKSPACE
// ============================================================================

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole } = useAppStore();

  // Navigation State: null = All Projects Grid View; string = Active Project ID View
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'kanban' | 'epics' | 'backlog' | 'bugs' | 'team'>('kanban');

  // Core Collections
  const [projects, setProjects] = useState<ProjectEntity[]>(INITIAL_PROJECTS);
  const [epics, setEpics] = useState<EpicItem[]>(INITIAL_EPICS);
  const [workItems, setWorkItems] = useState<JiraWorkItem[]>(INITIAL_WORK_ITEMS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Login-Based Project Access Control Logic (tied to active logged-in user profile & role)
  const visibleProjects = useMemo(() => {
    return projects.filter((proj) => {
      // 1. Search Query Filter
      const matchesSearch =
        searchQuery === '' ||
        proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Role Access Rules
      // Super Admin, Org Owner, Org Admin, HR Admin see ALL workspace projects
      if (
        currentRole === 'saas_owner' ||
        currentRole === 'org_owner' ||
        currentRole === 'org_admin' ||
        currentRole === 'hr_admin'
      ) {
        return true;
      }

      // Engineering Manager sees projects where they are Manager, Owner, or Team Member
      if (currentRole === 'manager') {
        const isManager =
          proj.manager === currentUser.name ||
          proj.owner === currentUser.name ||
          proj.manager === 'Pooja Sharma';
        const isMember = proj.members.some(
          (m) => m.name === currentUser.name || m.email === currentUser.email || m.id === currentUser.id
        );
        return isManager || isMember;
      }

      // Employee / Member / HR Executive / Recruiter sees ONLY projects where they are in team roster or assigned a task
      const isMember = proj.members.some(
        (m) =>
          m.name === currentUser.name ||
          m.email === currentUser.email ||
          m.id === currentUser.id ||
          m.name.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
      );
      const hasTask = workItems.some(
        (item) =>
          item.projectId === proj.id &&
          (item.assignee.name === currentUser.name || item.assignee.id === currentUser.id)
      );

      return isMember || hasTask;
    });
  }, [projects, searchQuery, currentRole, currentUser, workItems]);

  // Modals (CRUD)
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectEntity | null>(null);
  const [isDeleteProjectConfirmOpen, setIsDeleteProjectConfirmOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Task & Member Modals
  const [isWorkItemModalOpen, setIsWorkItemModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Project Form State
  const [projName, setProjName] = useState('');
  const [projKey, setProjKey] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('Human Resources');
  const [projOwner, setProjOwner] = useState('Amit Verma');
  const [projManager, setProjManager] = useState('Pooja Sharma');
  const [projTechLead, setProjTechLead] = useState('Neha Singh');
  const [projMemberIds, setProjMemberIds] = useState<string[]>(['m-1', 'm-2', 'm-3']);

  // Create Work Item Form State
  const [itemTitle, setItemTitle] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemType, setItemType] = useState<JiraWorkType | 'Epic'>('Story');
  const [itemPriority, setItemPriority] = useState<JiraPriority>('Medium');
  const [itemPoints, setItemPoints] = useState(5);
  const [itemAssigneeId, setItemAssigneeId] = useState(AVAILABLE_ORGS_MEMBERS[0].id);

  // Edit & Delete Work Item State
  const [editingWorkItem, setEditingWorkItem] = useState<JiraWorkItem | null>(null);
  const [isEditWorkItemModalOpen, setIsEditWorkItemModalOpen] = useState(false);
  const [deletingWorkItemId, setDeletingWorkItemId] = useState<string | null>(null);
  const [isDeleteWorkItemConfirmOpen, setIsDeleteWorkItemConfirmOpen] = useState(false);

  // Edit & Delete Epic State
  const [editingEpic, setEditingEpic] = useState<EpicItem | null>(null);
  const [isEditEpicModalOpen, setIsEditEpicModalOpen] = useState(false);
  const [deletingEpicId, setDeletingEpicId] = useState<string | null>(null);
  const [isDeleteEpicConfirmOpen, setIsDeleteEpicConfirmOpen] = useState(false);

  // Drag and Drop Kanban Board State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JiraStatus | null>(null);

  const openCreateWorkItemModal = (defaultType: JiraWorkType | 'Epic' = 'Story') => {
    setItemType(defaultType);
    setItemTitle('');
    setItemDesc('');
    setIsWorkItemModalOpen(true);
  };

  const openEditWorkItemModal = (item: JiraWorkItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingWorkItem(item);
    setItemTitle(item.title);
    setItemDesc(item.description);
    setItemType(item.type);
    setItemPriority(item.priority);
    setItemPoints(item.storyPoints);
    setItemAssigneeId(item.assignee.id);
    setIsEditWorkItemModalOpen(true);
  };

  const openDeleteWorkItemConfirm = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingWorkItemId(itemId);
    setIsDeleteWorkItemConfirmOpen(true);
  };

  const openEditEpicModal = (epic: EpicItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingEpic(epic);
    setItemTitle(epic.title);
    setItemDesc(epic.description);
    setIsEditEpicModalOpen(true);
  };

  const openDeleteEpicConfirm = (epicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingEpicId(epicId);
    setIsDeleteEpicConfirmOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active Project Reference
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Tasks for Active Project
  const activeProjectTasks = useMemo(() => {
    if (!selectedProjectId) return workItems;
    return workItems.filter((i) => i.projectId === selectedProjectId);
  }, [workItems, selectedProjectId]);

  // ============================================================================
  // PROJECT CRUD HANDLERS
  // ============================================================================

  // 1. CREATE PROJECT
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !projKey.trim()) return;

    const assignedMembers = AVAILABLE_ORGS_MEMBERS.filter((m) => projMemberIds.includes(m.id));
    const newProj: ProjectEntity = {
      id: `proj-${Date.now()}`,
      key: projKey.toUpperCase().trim(),
      name: projName.trim(),
      description: projDesc.trim() || 'Enterprise software project.',
      category: projCategory,
      owner: projOwner,
      manager: projManager,
      techLead: projTechLead,
      budget: '₹25,00,000',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      members: assignedMembers,
      status: 'Active',
      startDate: 'Apr 01, 2025',
      targetEndDate: 'Oct 31, 2025',
    };

    setProjects([...projects, newProj]);
    setIsCreateProjectModalOpen(false);
    setProjName('');
    setProjKey('');
    setProjDesc('');
    showToast(`Project "${newProj.name}" created!`);
  };

  // 2. EDIT PROJECT (OPEN MODAL)
  const openEditProjectModal = (proj: ProjectEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(proj);
    setProjName(proj.name);
    setProjKey(proj.key);
    setProjDesc(proj.description);
    setProjCategory(proj.category);
    setProjOwner(proj.owner);
    setProjManager(proj.manager || 'Pooja Sharma');
    setProjTechLead(proj.techLead);
    setProjMemberIds(proj.members.map((m) => m.id));
    setIsEditProjectModalOpen(true);
  };

  // UPDATE PROJECT SUBMIT
  const handleUpdateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !projName.trim()) return;

    const assignedMembers = AVAILABLE_ORGS_MEMBERS.filter((m) => projMemberIds.includes(m.id));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? {
            ...p,
            name: projName.trim(),
            key: projKey.toUpperCase().trim(),
            description: projDesc.trim(),
            category: projCategory,
            owner: projOwner,
            manager: projManager,
            techLead: projTechLead,
            members: assignedMembers,
          }
          : p
      )
    );
    setIsEditProjectModalOpen(false);
    setEditingProject(null);
    showToast(`Project "${projName}" updated successfully!`);
  };

  // 3. DELETE PROJECT CONFIRM
  const openDeleteProjectConfirm = (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingProjectId(projId);
    setIsDeleteProjectConfirmOpen(true);
  };

  const handleConfirmDeleteProject = () => {
    if (!deletingProjectId) return;
    const projToDelete = projects.find((p) => p.id === deletingProjectId);
    setProjects((prev) => prev.filter((p) => p.id !== deletingProjectId));
    setWorkItems((prev) => prev.filter((i) => i.projectId !== deletingProjectId));

    if (selectedProjectId === deletingProjectId) {
      setSelectedProjectId(null);
    }
    setIsDeleteProjectConfirmOpen(false);
    setDeletingProjectId(null);
    showToast(`Project "${projToDelete?.name || ''}" deleted.`);
  };

  // Transition Task Status
  const handleTransitionStatus = (itemId: string, newStatus: JiraStatus) => {
    setWorkItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
    showToast(`Status updated to ${newStatus}`);
  };

  // Add Task / Epic / Bug to Active Project
  const handleCreateWorkItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !selectedProjectId) return;
    const projObj = projects.find((p) => p.id === selectedProjectId);
    if (!projObj) return;

    const assigneeObj = AVAILABLE_ORGS_MEMBERS.find((m) => m.id === itemAssigneeId) || AVAILABLE_ORGS_MEMBERS[0];

    if (itemType === 'Epic') {
      const epicKeyFormatted = `EPIC-${String(epics.length + 1).padStart(2, '0')}`;
      const newEpic: EpicItem = {
        id: `epic-${Date.now()}`,
        epicKey: epicKeyFormatted,
        title: itemTitle,
        description: itemDesc || 'Strategic requirement module.',
        color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        progress: 0,
        totalStories: 0,
        completedStories: 0,
        owner: assigneeObj.name,
        targetRelease: 'Release v1.2.0',
        projectId: projObj.id,
      };
      setEpics([newEpic, ...epics]);
      setIsWorkItemModalOpen(false);
      setItemTitle('');
      setItemDesc('');
      showToast(`Epic ${epicKeyFormatted} created for ${projObj.name}!`);
      return;
    }

    const formattedKey = `${projObj.key}-${100 + workItems.length + 1}`;
    const newItem: JiraWorkItem = {
      id: `item-${Date.now()}`,
      itemKey: formattedKey,
      type: itemType as JiraWorkType,
      title: itemTitle,
      description: itemDesc || (itemType === 'Bug' ? 'Defect reported during QA run.' : 'Added during sprint planning.'),
      projectId: projObj.id,
      projectName: projObj.name,
      assignee: assigneeObj,
      priority: itemPriority,
      status: itemType === 'Bug' ? 'IN QA' : 'TO DO',
      storyPoints: Number(itemPoints),
      dueDate: 'May 15, 2025',
      releaseVersion: 'Release v1.2.0',
      ...(itemType === 'Bug' ? { bugSeverity: itemPriority === 'Critical' ? 'Critical' : 'High', stepsToReproduce: itemDesc } : {}),
    };

    setWorkItems([newItem, ...workItems]);
    setIsWorkItemModalOpen(false);
    setItemTitle('');
    setItemDesc('');
    showToast(`${itemType} ${formattedKey} created for ${projObj.name}!`);
  };

  // UPDATE WORK ITEM (Story / Bug / Task)
  const handleUpdateWorkItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkItem || !itemTitle.trim()) return;

    const assigneeObj = AVAILABLE_ORGS_MEMBERS.find((m) => m.id === itemAssigneeId) || editingWorkItem.assignee;

    setWorkItems((prev) =>
      prev.map((item) =>
        item.id === editingWorkItem.id
          ? {
            ...item,
            title: itemTitle,
            description: itemDesc,
            type: itemType as JiraWorkType,
            priority: itemPriority,
            storyPoints: Number(itemPoints),
            assignee: assigneeObj,
          }
          : item
      )
    );

    setIsEditWorkItemModalOpen(false);
    setEditingWorkItem(null);
    showToast(`Work item ${editingWorkItem.itemKey} updated!`);
  };

  // DELETE WORK ITEM
  const handleConfirmDeleteWorkItem = () => {
    if (!deletingWorkItemId) return;
    const itemToDelete = workItems.find((i) => i.id === deletingWorkItemId);
    setWorkItems((prev) => prev.filter((i) => i.id !== deletingWorkItemId));
    setIsDeleteWorkItemConfirmOpen(false);
    setDeletingWorkItemId(null);
    showToast(`Work item ${itemToDelete?.itemKey || ''} deleted.`);
  };

  // UPDATE EPIC
  const handleUpdateEpicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpic || !itemTitle.trim()) return;

    setEpics((prev) =>
      prev.map((epic) =>
        epic.id === editingEpic.id
          ? {
            ...epic,
            title: itemTitle,
            description: itemDesc,
          }
          : epic
      )
    );

    setIsEditEpicModalOpen(false);
    setEditingEpic(null);
    showToast(`Epic ${editingEpic.epicKey} updated!`);
  };

  // DELETE EPIC
  const handleConfirmDeleteEpic = () => {
    if (!deletingEpicId) return;
    const epicToDelete = epics.find((e) => e.id === deletingEpicId);
    setEpics((prev) => prev.filter((e) => e.id !== deletingEpicId));
    setIsDeleteEpicConfirmOpen(false);
    setDeletingEpicId(null);
    showToast(`Epic ${epicToDelete?.epicKey || ''} deleted.`);
  };

  const SPRINT_COLUMNS: JiraStatus[] = [
    'TO DO',
    'IN PROGRESS',
    'CODE REVIEW',
    'READY FOR QA',
    'IN QA',
    'QA PASSED',
    'RELEASE READY',
    'DONE',
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* =========================================================================
          MODE 1: ALL PROJECTS GRID OVERVIEW (HOME DASHBOARD)
         ========================================================================= */}
      {!selectedProjectId && (
        <div className="space-y-6">
          {/* Top Command Header */}
          <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Boxes className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  TeamTrakr Multi-Project Workspace
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a project to open its Kanban board, assign team members, and manage sprint deliverables.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Project</span>
            </button>
          </div>

          {/* Automatic Login-Based Access Info Banner */}
          <div className="bg-slate-50/80 dark:bg-[#161624] border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Logged in as: <span className="text-blue-600 dark:text-blue-400 font-black">{currentUser.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase border border-blue-200 dark:border-blue-800">
                    {currentRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing projects automatically filtered for your account role. Switch active role in top profile dropdown to test other personas.
                </p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0 self-start sm:self-center shadow-2xs">
              <strong className="text-blue-600 dark:text-blue-400 font-black">{visibleProjects.length}</strong> of {projects.length} Workspace Projects
            </span>
          </div>

          {/* Projects Grid */}
          {visibleProjects.length === 0 ? (
            <div className="bg-white dark:bg-[#12121B] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No Projects Assigned to {currentUser.name}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No workspace projects are currently assigned to your logged-in profile. Switch your active role persona to <strong className="text-blue-600">Organization Admin</strong> in the top header menu to view all projects.
              </p>
            </div>
          ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleProjects.map((proj) => {
          const projTasks = workItems.filter((i) => i.projectId === proj.id);
          const completedTasks = projTasks.filter((i) => i.status === 'DONE').length;
          const progressPct = projTasks.length > 0 ? Math.round((completedTasks / projTasks.length) * 100) : 0;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {proj.key}
                  </span>

                  {/* Project CRUD Action Icons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={(e) => openEditProjectModal(proj, e)}
                      title="Edit Project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => openDeleteProjectConfirm(proj.id, e)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Task Completion Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Task Progress</span>
                    <span className="text-blue-600">{completedTasks} / {projTasks.length} Tasks ({progressPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Members */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Team:</span>
                  <div className="flex items-center -space-x-1.5">
                    {proj.members.slice(0, 4).map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar}
                        alt={m.name}
                        title={`${m.name} (${m.role})`}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                      />
                    ))}
                    {proj.members.length > 4 && (
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center justify-center border-2 border-white dark:border-slate-900">
                        +{proj.members.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Open Project Kanban Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
          )}
    </div>
  )
}

{/* =========================================================================
          MODE 2: SINGLE PROJECT DEEP-DIVE WORKSPACE (WHEN PROJECT IS CLICKED)
         ========================================================================= */}
{
  selectedProjectId && activeProject && (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={() => setSelectedProjectId(null)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Projects
            </button>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                KEY: {activeProject.key}
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {activeProject.name}
              </h1>
            </div>

            <p className="text-xs text-slate-500 max-w-3xl">
              {activeProject.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWorkItemModalOpen(true)}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Task</span>
            </button>

            <button
              onClick={(e) => openEditProjectModal(activeProject, e)}
              className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Project</span>
            </button>
          </div>
        </div>

        {/* Team Members List Pill Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Assigned Team:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {activeProject.members.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{m.name} ({m.role})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-[11px] font-medium flex-wrap">
            <span className="text-slate-500">👑 Owner: <strong className="text-slate-800 dark:text-slate-200">{activeProject.owner}</strong></span>
            <span className="text-slate-500">📋 PM: <strong className="text-blue-600 dark:text-blue-400">{activeProject.manager}</strong></span>
            <span className="text-slate-500">⚡ Tech Lead: <strong className="text-slate-800 dark:text-slate-200">{activeProject.techLead}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Active Project */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'kanban', label: '🏃 Project Kanban Board', count: activeProjectTasks.length },
          { id: 'epics', label: '📌 Epics & Requirements', count: epics.filter((e) => e.projectId === activeProject.id).length },
          { id: 'bugs', label: '🐞 QA Defect Desk', count: activeProjectTasks.filter((i) => i.type === 'Bug').length },
          { id: 'team', label: '👥 Team Directory', count: activeProject.members.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveProjectTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeProjectTab === tab.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* PROJECT KANBAN BOARD */}
      {activeProjectTab === 'kanban' && (
        <div className="flex overflow-x-auto gap-4 pb-6 pt-1 scrollbar-custom">
          {SPRINT_COLUMNS.map((colStatus) => {
            const colItems = activeProjectTasks.filter((item) => item.status === colStatus);
            const isOverThisCol = dragOverColumn === colStatus;
            return (
              <div
                key={colStatus}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverColumn !== colStatus) setDragOverColumn(colStatus);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (dragOverColumn === colStatus) setDragOverColumn(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedId = e.dataTransfer.getData('text/plain') || draggedItemId;
                  if (droppedId) {
                    handleTransitionStatus(droppedId, colStatus);
                  }
                  setDragOverColumn(null);
                  setDraggedItemId(null);
                }}
                className={cn(
                  'w-72 shrink-0 rounded-2xl border p-3 space-y-3 flex flex-col justify-between transition-all duration-200',
                  isOverThisCol
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/50 shadow-lg scale-[1.01]'
                    : 'bg-slate-100/70 dark:bg-[#12121C] border-slate-200/80 dark:border-slate-800/80'
                )}
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isOverThisCol ? 'bg-blue-600 animate-pulse' : 'bg-blue-500'}`}></span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {colStatus}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                      {colItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[350px] max-h-[620px] overflow-y-auto pr-0.5 scrollbar-thin">
                    {colItems.length === 0 ? (
                      <div className={`h-24 border border-dashed rounded-xl flex items-center justify-center text-xs font-semibold transition-colors ${isOverThisCol ? 'border-blue-400 bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800/80 text-slate-400'
                        }`}>
                        {isOverThisCol ? '↓ Drop task here' : 'No tasks in this column'}
                      </div>
                    ) : (
                      colItems.map((item) => {
                        const isBeingDragged = draggedItemId === item.id;
                        return (
                          <div
                            key={item.id}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', item.id);
                              e.dataTransfer.effectAllowed = 'move';
                              setDraggedItemId(item.id);
                            }}
                            onDragEnd={() => {
                              setDraggedItemId(null);
                              setDragOverColumn(null);
                            }}
                            className={cn(
                              'bg-white dark:bg-[#181825] border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-2.5 group cursor-grab active:cursor-grabbing select-none',
                              isBeingDragged ? 'opacity-40 scale-95 border-dashed border-blue-500 ring-2 ring-blue-400/50' : ''
                            )}
                          >
                            <div className="flex items-center justify-between text-[10px] gap-1.5">
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                {item.itemKey}
                              </span>
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase truncate shrink-0 border ${item.type === 'Bug'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/70 dark:border-rose-800'
                                : item.type === 'Story'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/70 dark:border-blue-800'
                                  : item.type === 'Epic'
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/70 dark:border-purple-800'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}>
                                {item.type}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                              {item.title}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10.5px]">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={item.assignee.avatar}
                                  alt={item.assignee.name}
                                  className="w-5 h-5 rounded-full object-cover shrink-0"
                                />
                                <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[90px]">
                                  {item.assignee.name.split(' ')[0]}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                                {item.storyPoints} pts
                              </span>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => openEditWorkItemModal(item, e)}
                                  title="Edit Work Item"
                                  className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => openDeleteWorkItemConfirm(item.id, e)}
                                  title="Delete Work Item"
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {colStatus !== 'DONE' && (
                                <button
                                  onClick={() => {
                                    const nextIndex = SPRINT_COLUMNS.indexOf(colStatus) + 1;
                                    if (nextIndex < SPRINT_COLUMNS.length) {
                                      handleTransitionStatus(item.id, SPRINT_COLUMNS[nextIndex]);
                                    }
                                  }}
                                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 ml-auto"
                                >
                                  Move Next <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECT EPICS & REQUIREMENTS */}
      {activeProjectTab === 'epics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Project Epics & Strategic Modules</h3>
              <p className="text-xs text-slate-500">Track high-level requirements, milestones, and epic completion rates.</p>
            </div>
            <button
              onClick={() => openCreateWorkItemModal('Epic')}
              className="h-8 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Epic / Requirement</span>
            </button>
          </div>

          {epics.filter((e) => e.projectId === activeProject.id).length === 0 ? (
            <div className="bg-white dark:bg-[#12121B] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Epics Created for this Project</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Epics help structure large initiatives, feature sets, and release goals for your engineering team.
              </p>
              <button
                onClick={() => openCreateWorkItemModal('Epic')}
                className="h-8 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Epic</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {epics.filter((e) => e.projectId === activeProject.id).map((epic) => {
                const epicStories = activeProjectTasks.filter((t) => t.epicId === epic.id);
                return (
                  <div
                    key={epic.id}
                    className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                            {epic.epicKey}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{epic.targetRelease}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{epic.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{epic.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => openEditEpicModal(epic, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Edit Epic"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => openDeleteEpicConfirm(epic.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Delete Epic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-400">Progress ({epic.progress}%)</span>
                        <span className="text-blue-600 dark:text-blue-400 font-mono">
                          {epic.completedStories} / {epic.totalStories} Stories Completed
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${epic.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Linked Work Items */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Owner: <strong className="text-slate-800 dark:text-slate-200">{epic.owner}</strong></span>
                      <span className="text-slate-500 font-medium">{epicStories.length} Work Items Linked</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QA DEFECT DESK */}
      {activeProjectTab === 'bugs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">QA Defect Desk & Bug Tracker</h3>
              <p className="text-xs text-slate-500">Manage software defects, steps to reproduce, and QA verification statuses.</p>
            </div>
            <button
              onClick={() => openCreateWorkItemModal('Bug')}
              className="h-8 px-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Bug / Defect</span>
            </button>
          </div>

          {/* Bug Summary Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Total Reported Bugs</span>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {activeProjectTasks.filter((i) => i.type === 'Bug').length}
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-rose-500">Critical / High Bugs</span>
              <p className="text-xl font-black text-rose-600">
                {activeProjectTasks.filter((i) => i.type === 'Bug' && (i.priority === 'Critical' || i.priority === 'High')).length}
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-amber-500">In QA Verification</span>
              <p className="text-xl font-black text-amber-600">
                {activeProjectTasks.filter((i) => i.type === 'Bug' && i.status === 'IN QA').length}
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-emerald-500">Resolved / Passed</span>
              <p className="text-xl font-black text-emerald-600">
                {activeProjectTasks.filter((i) => i.type === 'Bug' && (i.status === 'QA PASSED' || i.status === 'DONE')).length}
              </p>
            </div>
          </div>

          {activeProjectTasks.filter((i) => i.type === 'Bug').length === 0 ? (
            <div className="bg-white dark:bg-[#12121B] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Active Defects Logged</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All QA test runs are clean for this project! No open defects are currently registered.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjectTasks.filter((i) => i.type === 'Bug').map((bug) => (
                <div
                  key={bug.id}
                  className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                        {bug.itemKey}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${bug.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                        {bug.priority} Severity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                        Status: {bug.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => openEditWorkItemModal(bug, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit Defect"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => openDeleteWorkItemConfirm(bug.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Delete Defect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTransitionStatus(bug.id, bug.status === 'DONE' ? 'IN QA' : 'QA PASSED')}
                        className="h-7 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                      >
                        {bug.status === 'QA PASSED' || bug.status === 'DONE' ? '✓ QA Verified' : 'Pass QA'}
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{bug.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
                    {bug.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <img src={bug.assignee.avatar} alt={bug.assignee.name} className="w-5 h-5 rounded-full object-cover" />
                      <span>Assignee: <strong className="text-slate-800 dark:text-slate-200">{bug.assignee.name}</strong></span>
                    </div>
                    <span className="font-medium text-slate-400">Target: {bug.releaseVersion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROJECT TEAM DIRECTORY */}
      {activeProjectTab === 'team' && (
        <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Assigned Project Members & Roles</h3>
            <button
              onClick={(e) => openEditProjectModal(activeProject, e)}
              className="h-8 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Update / Assign Team Members</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeProject.members.map((m) => (
              <div key={m.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
                <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{m.name}</h4>
                  <p className="text-[11px] text-blue-600 font-semibold">{m.role}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

{/* =========================================================================
          WIDE 2-COLUMN HORIZONTAL MODAL (LESS HEIGHT, MORE WIDTH: MAX-W-4XL)
         ========================================================================= */}

{/* CREATE PROJECT MODAL */ }
{
  isCreateProjectModalOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-4xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col justify-between">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                Create New Project & Assign Team
              </h3>
              <p className="text-xs text-slate-500">Configure key project parameters and select team members side-by-side.</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-COLUMN HORIZONTAL GRID FORM BODY */}
        <form onSubmit={handleCreateProjectSubmit} id="create-proj-form" className="grow overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">

            {/* LEFT COLUMN: PROJECT DETAILS */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2 space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Name *</label>
                  <input
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. AI Copilot Integration"
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Key *</label>
                  <input
                    type="text"
                    value={projKey}
                    onChange={(e) => setProjKey(e.target.value)}
                    placeholder="e.g. AIC"
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono uppercase font-black text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Project Scope / Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Define key objectives and sprint goals..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-20 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Owner</label>
                  <select
                    value={projOwner}
                    onChange={(e) => setProjOwner(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Manager (PM)</label>
                  <select
                    value={projManager}
                    onChange={(e) => setProjManager(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Technical Lead</label>
                  <select
                    value={projTechLead}
                    onChange={(e) => setProjTechLead(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TEAM MEMBER ASSIGNMENT */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Assign Team Members *</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {projMemberIds.length} Members Selected
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                {AVAILABLE_ORGS_MEMBERS.map((m) => {
                  const isSelected = projMemberIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer',
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setProjMemberIds([...projMemberIds, m.id]);
                            else setProjMemberIds(projMemberIds.filter((id) => id !== m.id));
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.email}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {m.role}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </form>

        {/* Compact Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-proj-form"
            className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project & Assign Members</span>
          </button>
        </div>
      </div>
    </div>
  )
}

{/* EDIT PROJECT MODAL */ }
{
  isEditProjectModalOpen && editingProject && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-4xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col justify-between">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                Edit Project & Team Members
              </h3>
              <p className="text-xs text-slate-500">Update project details and add or remove assigned team members.</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProjectModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-COLUMN HORIZONTAL GRID FORM BODY */}
        <form onSubmit={handleUpdateProjectSubmit} id="edit-proj-form" className="grow overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">

            {/* LEFT COLUMN: PROJECT DETAILS */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2 space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Name *</label>
                  <input
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. AI Copilot Integration"
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Key *</label>
                  <input
                    type="text"
                    value={projKey}
                    onChange={(e) => setProjKey(e.target.value)}
                    placeholder="e.g. AIC"
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono uppercase font-black text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Project Scope / Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Define key objectives and sprint goals..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-20 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Owner</label>
                  <select
                    value={projOwner}
                    onChange={(e) => setProjOwner(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Project Manager (PM)</label>
                  <select
                    value={projManager}
                    onChange={(e) => setProjManager(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Technical Lead</label>
                  <select
                    value={projTechLead}
                    onChange={(e) => setProjTechLead(e.target.value)}
                    className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs outline-none"
                  >
                    {AVAILABLE_ORGS_MEMBERS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TEAM MEMBER ASSIGNMENT */}
            <div className="space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Assigned Team Members *</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {projMemberIds.length} Members Selected
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                {AVAILABLE_ORGS_MEMBERS.map((m) => {
                  const isSelected = projMemberIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer',
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setProjMemberIds([...projMemberIds, m.id]);
                            else setProjMemberIds(projMemberIds.filter((id) => id !== m.id));
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.email}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {m.role}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </form>

        {/* Compact Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditProjectModalOpen(false)}
            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-proj-form"
            className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Update Project Members</span>
          </button>
        </div>
      </div>
    </div>
  )
}

{/* DELETE CONFIRMATION MODAL */ }
{
  isDeleteProjectConfirmOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete Project?</h3>
          <p className="text-xs text-slate-500 mt-1">This will permanently delete the project and associated sprint tasks.</p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button onClick={() => setIsDeleteProjectConfirmOpen(false)} className="h-9 px-4 border rounded-xl text-xs font-semibold">Cancel</button>
          <button onClick={handleConfirmDeleteProject} className="h-9 px-5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs">Delete Project</button>
        </div>
      </div>
    </div>
  )
}

{/* CREATE WORK ITEM / EPIC / BUG MODAL */ }
{
  isWorkItemModalOpen && selectedProjectId && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs ${itemType === 'Bug' ? 'bg-rose-600' : itemType === 'Epic' ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
              {itemType === 'Bug' ? <Bug className="w-5 h-5" /> : itemType === 'Epic' ? <Layers className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                Create New {itemType}
              </h3>
              <p className="text-xs text-slate-500">Project: <strong className="text-slate-800 dark:text-slate-200">{activeProject?.name}</strong></p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkItemModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateWorkItemSubmit} className="space-y-3.5 text-xs">
          {/* Type selector */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Work Item Category *</label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {(['Story', 'Bug', 'Task', 'Epic'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setItemType(t)}
                  className={cn(
                    'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    itemType === t
                      ? t === 'Bug' ? 'bg-rose-600 text-white' : t === 'Epic' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              {itemType === 'Epic' ? 'Epic Title' : itemType === 'Bug' ? 'Bug Summary' : 'Task Title'} *
            </label>
            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder={
                itemType === 'Epic'
                  ? 'e.g. Statutory Payroll & Tax Slab Processing'
                  : itemType === 'Bug'
                    ? 'e.g. Kanban board drag-and-drop state reset on refresh'
                    : 'e.g. Implement user authentication flow'
              }
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Description / Steps */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              {itemType === 'Bug' ? 'Steps to Reproduce & Expected Behavior' : 'Description & Scope'}
            </label>
            <textarea
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              rows={3}
              placeholder={
                itemType === 'Bug'
                  ? '1. Open Sprint board\n2. Move card to IN QA\n3. Refresh browser page'
                  : 'Provide details, scope, or requirements...'
              }
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium resize-none text-slate-900 dark:text-white"
            />
          </div>

          {itemType !== 'Epic' && (
            <div className="grid grid-cols-3 gap-3">
              {/* Priority */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Priority</label>
                <select
                  value={itemPriority}
                  onChange={(e) => setItemPriority(e.target.value as any)}
                  className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Assignee</label>
                <select
                  value={itemAssigneeId}
                  onChange={(e) => setItemAssigneeId(e.target.value)}
                  className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
                >
                  {AVAILABLE_ORGS_MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Story Points */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Points</label>
                <select
                  value={itemPoints}
                  onChange={(e) => setItemPoints(Number(e.target.value))}
                  className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
                >
                  {[1, 2, 3, 5, 8, 13].map((pts) => (
                    <option key={pts} value={pts}>{pts} pts</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsWorkItemModalOpen(false)}
              className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-9 px-5 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 ${itemType === 'Bug' ? 'bg-rose-600 hover:bg-rose-700' : itemType === 'Epic' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create {itemType}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* EDIT WORK ITEM / BUG MODAL */ }
{
  isEditWorkItemModalOpen && editingWorkItem && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                Edit Work Item ({editingWorkItem.itemKey})
              </h3>
              <p className="text-xs text-slate-500">Update work item details, priority, and assignee</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditWorkItemModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleUpdateWorkItemSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Title *</label>
            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium resize-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Priority</label>
              <select
                value={itemPriority}
                onChange={(e) => setItemPriority(e.target.value as any)}
                className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Assignee</label>
              <select
                value={itemAssigneeId}
                onChange={(e) => setItemAssigneeId(e.target.value)}
                className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                {AVAILABLE_ORGS_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Points</label>
              <select
                value={itemPoints}
                onChange={(e) => setItemPoints(Number(e.target.value))}
                className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                {[1, 2, 3, 5, 8, 13].map((pts) => (
                  <option key={pts} value={pts}>{pts} pts</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditWorkItemModalOpen(false)}
              className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 bg-blue-600 text-white font-bold rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* DELETE WORK ITEM CONFIRMATION MODAL */ }
{
  isDeleteWorkItemConfirmOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete Work Item?</h3>
          <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete this work item from the project board?</p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setIsDeleteWorkItemConfirmOpen(false)}
            className="h-9 px-4 border rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeleteWorkItem}
            className="h-9 px-5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-rose-700 cursor-pointer"
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  )
}

{/* EDIT EPIC MODAL */ }
{
  isEditEpicModalOpen && editingEpic && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                Edit Epic ({editingEpic.epicKey})
              </h3>
              <p className="text-xs text-slate-500">Modify strategic requirement title and scope</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditEpicModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleUpdateEpicSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Epic Title *</label>
            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Scope & Description</label>
            <textarea
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium resize-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditEpicModalOpen(false)}
              className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 bg-purple-600 text-white font-bold rounded-xl shadow-xs hover:bg-purple-700 cursor-pointer"
            >
              Save Epic
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* DELETE EPIC CONFIRMATION MODAL */ }
{
  isDeleteEpicConfirmOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#12121B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Delete Epic?</h3>
          <p className="text-xs text-slate-500 mt-1">This will permanently delete the Epic requirement from the project.</p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setIsDeleteEpicConfirmOpen(false)}
            className="h-9 px-4 border rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeleteEpic}
            className="h-9 px-5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-rose-700 cursor-pointer"
          >
            Delete Epic
          </button>
        </div>
      </div>
    </div>
  )
}

{/* Toast Alert */ }
{
  toastMessage && (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-toast-slide">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
      <span>{toastMessage}</span>
    </div>
  )
}
    </div >
  );
};

export default TasksPage;
