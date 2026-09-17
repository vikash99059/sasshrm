import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Search,
  Filter,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  Eye,
  X,
  ListTree,
  Network,
  Share2,
  Check
} from 'lucide-react';
import { Badge, Button, Modal } from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  teamSize: number;
  level: number;
  accentColor: string;
  ringClass: string;
  borderClass: string;
  bio: string;
  children?: OrgNode[];
}

export const OrgStructurePage: React.FC = () => {
  const navigate = useNavigate();

  // View mode & zoom states
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<OrgNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real Organization Hierarchy Tree Data
  const orgTree: OrgNode = {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    role: 'Chief Executive Officer',
    department: 'Executive Leadership',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    email: 'sarah.jenkins@apexcorp.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (HQ)',
    teamSize: 248,
    level: 1,
    accentColor: '#10B981',
    ringClass: 'ring-emerald-400 dark:ring-emerald-500',
    borderClass: 'border-t-emerald-500 border-b-emerald-500',
    bio: 'Oversees global operations, enterprise growth strategy, and organizational excellence across 248 employees in 6 regions.',
    children: [
      {
        id: 'EMP-002',
        name: 'Marcus Chen',
        role: 'VP of Engineering',
        department: 'Engineering & DevOps',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        email: 'marcus.chen@apexcorp.com',
        phone: '+1 (555) 345-6789',
        location: 'San Francisco, CA',
        teamSize: 98,
        level: 2,
        accentColor: '#06B6D4',
        ringClass: 'ring-cyan-400 dark:ring-cyan-500',
        borderClass: 'border-t-cyan-500 border-b-cyan-500',
        bio: 'Leads fullstack web platform architecture, AI automation infrastructure, DevOps reliability, and core product engineering.',
        children: [
          {
            id: 'EMP-004',
            name: 'Sophia Davis',
            role: 'Staff UI Architect',
            department: 'Frontend Engineering',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
            email: 'sophia.davis@apexcorp.com',
            phone: '+1 (555) 567-8901',
            location: 'Austin, TX (Remote)',
            teamSize: 42,
            level: 3,
            accentColor: '#3B82F6',
            ringClass: 'ring-blue-400 dark:ring-blue-500',
            borderClass: 'border-t-blue-500 border-b-blue-500',
            bio: 'Directs design system implementation, micro-frontend architecture, and responsive clientside experience.',
          },
          {
            id: 'EMP-005',
            name: 'David Anderson',
            role: 'Principal Cloud Architect',
            department: 'Backend & Platform',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
            email: 'david.anderson@apexcorp.com',
            phone: '+1 (555) 678-9012',
            location: 'Seattle, WA',
            teamSize: 56,
            level: 3,
            accentColor: '#2563EB',
            ringClass: 'ring-indigo-400 dark:ring-indigo-500',
            borderClass: 'border-t-indigo-500 border-b-indigo-500',
            bio: 'Manages distributed microservices, multi-tenant databases, data pipelines, and cloud security compliance.',
          }
        ]
      },
      {
        id: 'EMP-003',
        name: 'Priya Sharma',
        role: 'VP of Commercial & Growth',
        department: 'Marketing & Sales',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        email: 'priya.sharma@apexcorp.com',
        phone: '+1 (555) 456-7890',
        location: 'New York, NY',
        teamSize: 80,
        level: 2,
        accentColor: '#10B981',
        ringClass: 'ring-teal-400 dark:ring-teal-500',
        borderClass: 'border-t-teal-500 border-b-teal-500',
        bio: 'Drives global brand awareness, SaaS enterprise customer acquisition, partner alliances, and regional revenue growth.',
        children: [
          {
            id: 'EMP-006',
            name: 'James Miller',
            role: 'Staff Marketing Lead',
            department: 'Product Marketing',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
            email: 'james.miller@apexcorp.com',
            phone: '+1 (555) 789-0123',
            location: 'Chicago, IL',
            teamSize: 42,
            level: 3,
            accentColor: '#0EA5E9',
            ringClass: 'ring-sky-400 dark:ring-sky-500',
            borderClass: 'border-t-sky-500 border-b-sky-500',
            bio: 'Spearheads product launches, content marketing engines, and customer engagement initiatives.',
          },
          {
            id: 'EMP-007',
            name: 'Robert Thomas',
            role: 'Senior Sales Director',
            department: 'Enterprise Sales',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
            email: 'robert.thomas@apexcorp.com',
            phone: '+1 (555) 890-1234',
            location: 'New York, NY',
            teamSize: 38,
            level: 3,
            accentColor: '#3B82F6',
            ringClass: 'ring-blue-400 dark:ring-blue-500',
            borderClass: 'border-t-blue-500 border-b-blue-500',
            bio: 'Leads Fortune 500 SaaS expansion, strategic deal structuring, and account management teams.',
          }
        ]
      }
    ]
  };

  const handleNodeClick = (node: OrgNode) => {
    setSelectedEmployee(node);
    setIsModalOpen(true);
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') setZoomLevel(prev => Math.min(1.3, prev + 0.1));
    if (direction === 'out') setZoomLevel(prev => Math.max(0.7, prev - 0.1));
    if (direction === 'reset') setZoomLevel(1);
  };

  // Flattened list for search/list mode
  const allEmployees: OrgNode[] = [
    orgTree,
    ...(orgTree.children || []),
    ...(orgTree.children?.flatMap(c => c.children || []) || [])
  ];

  const filteredEmployees = allEmployees.filter(emp => {
    const matchesDept = selectedDept === 'All' || emp.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch = searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-300">
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-800 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP CLOUDY WAVE HEADER BANNER */}
      <PageHeaderCard
        title="Organizational Structure & Hierarchy"
        subtitle="Live interactive reporting tree, leadership hierarchy, and departmental structure"
        icon={Network}
        badge={
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" /> 248 Headcount Active
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-slate-700/80 shadow-2xs text-xs font-semibold">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Tree Chart</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>Directory List</span>
              </button>
            </div>

            {/* Export Chart Button */}
            <button
              onClick={() => showToast('Exporting high-resolution Org Structure Chart (PDF/PNG)...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md border border-white/80 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Export Chart</span>
            </button>
          </div>
        }
      />

      {/* 2. CONTROLS BAR: SEARCH, DEPT FILTER, ZOOM CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Engineering', 'Marketing', 'Sales', 'Executive'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Tree Canvas Zoom Controls (Active in Tree Mode) */}
        {viewMode === 'tree' && (
          <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => handleZoom('out')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 min-w-[40px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. MAIN INTERACTIVE CONTENT AREA */}
      {viewMode === 'tree' ? (
        /* ================= TREE CHART CANVAS (COMPACT CIRCULAR CARDS) ================= */
        <div className="relative w-full overflow-x-auto rounded-3xl border border-slate-200/80 bg-slate-50/70 dark:bg-slate-900/60 dark:border-slate-800 p-4 sm:p-8 shadow-inner flex flex-col items-center min-h-[580px]">
          
          <div
            className="transition-transform duration-300 origin-top flex flex-col items-center w-full max-w-4xl"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* TIER 1: CEO NODE (TOP CENTER - COMPACT CIRCLE) */}
            <div className="flex flex-col items-center relative z-20">
              <div
                onClick={() => handleNodeClick(orgTree)}
                className="group relative cursor-pointer flex flex-col items-center justify-center h-32 w-32 rounded-full bg-white dark:bg-slate-850 shadow-md border-3 border-emerald-500/80 hover:shadow-xl hover:scale-105 transition-all duration-300 p-2 text-center"
              >
                {/* Top Accent Arc Indicator */}
                <div className="absolute top-1.5 w-10 h-0.5 rounded-full bg-emerald-500" />
                
                {/* Avatar */}
                <div className="relative mb-0.5 mt-0.5">
                  <img
                    src={orgTree.avatar}
                    alt={orgTree.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-400 dark:ring-emerald-500 shadow-xs group-hover:ring-3 transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-emerald-500 text-white">
                    <Check className="w-2 h-2" />
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[105px]">
                  {orgTree.name}
                </h3>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight truncate max-w-[105px]">
                  {orgTree.role}
                </p>

                {/* Team Badge */}
                <span className="mt-1 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[8px] font-extrabold border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
                  {orgTree.teamSize} Staff
                </span>
              </div>

              {/* Trunk Connecting Line from CEO */}
              <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600" />
            </div>

            {/* HORIZONTAL SPLITTER BAR & CENTER LABEL */}
            <div className="w-full flex flex-col items-center relative z-10 -mt-1 mb-2">
              {/* Horizontal Connecting Branch Line */}
              <div className="w-[56%] h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
              
              {/* Vertical drops to VP 1 and VP 2 */}
              <div className="w-[56%] flex justify-between">
                <div className="w-0.5 h-5 bg-slate-400 dark:bg-slate-600" />
                <div className="w-0.5 h-5 bg-slate-400 dark:bg-slate-600" />
              </div>

              {/* CENTER LOGO / STATS BADGE */}
              <div className="my-1 p-2 text-center max-w-sm">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-900 dark:text-white leading-tight">
                  ORGANIZATIONAL CHART
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  Apex Global Corporate Leadership & Department Structure
                </p>
              </div>
            </div>

            {/* TIER 2: VP NODES (2 COLUMNS - COMPACT CIRCLES) */}
            <div className="w-full flex justify-around items-start gap-6 relative z-20">
              {orgTree.children?.map((vp) => (
                <div key={vp.id} className="flex flex-col items-center flex-1 max-w-[340px]">
                  
                  {/* VP Circular Node */}
                  <div
                    onClick={() => handleNodeClick(vp)}
                    className="group relative cursor-pointer flex flex-col items-center justify-center h-28 w-28 rounded-full bg-white dark:bg-slate-850 shadow-md border-3 border-cyan-500/80 hover:shadow-xl hover:scale-105 transition-all duration-300 p-1.5 text-center"
                  >
                    {/* Top Accent Arc */}
                    <div className="absolute top-1.5 w-8 h-0.5 rounded-full bg-cyan-500" />

                    {/* Avatar */}
                    <img
                      src={vp.avatar}
                      alt={vp.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-cyan-400 shadow-xs mb-0.5 mt-0.5 group-hover:ring-3 transition-all"
                    />

                    {/* Name & Title */}
                    <h4 className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate max-w-[95px]">
                      {vp.name}
                    </h4>
                    <p className="text-[8.5px] font-bold text-cyan-600 dark:text-cyan-400 leading-tight truncate max-w-[95px]">
                      {vp.role}
                    </p>

                    {/* Direct Team Badge */}
                    <span className="mt-0.5 px-1.5 py-0.2 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 text-[7.5px] font-extrabold border border-cyan-200/80 dark:border-cyan-800 shadow-2xs">
                      {vp.teamSize} Team
                    </span>
                  </div>

                  {/* Vertical branch drop from VP */}
                  <div className="w-0.5 h-5 bg-slate-400 dark:bg-slate-600" />

                  {/* Sub-branch horizontal line to bottom team leads */}
                  <div className="w-[78%] h-0.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                  <div className="w-[78%] flex justify-between mb-1">
                    <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-600" />
                    <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-600" />
                  </div>

                  {/* TIER 3: BOTTOM TEAM LEADS (2 UNDER EACH VP - COMPACT CIRCLES) */}
                  <div className="w-full flex justify-between gap-3">
                    {vp.children?.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleNodeClick(lead)}
                        className="group relative cursor-pointer flex flex-col items-center justify-center h-24 w-24 rounded-full bg-white dark:bg-slate-850 shadow-sm border-2 border-blue-500/80 hover:shadow-lg hover:scale-105 transition-all duration-300 p-1 text-center"
                      >
                        {/* Top Arc */}
                        <div className="absolute top-1 w-6 h-0.5 rounded-full bg-blue-500" />

                        {/* Avatar */}
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="h-7 w-7 rounded-full object-cover ring-1.5 ring-blue-400 shadow-2xs mb-0.5 mt-0.5 group-hover:ring-2 transition-all"
                        />

                        {/* Name & Role */}
                        <h5 className="text-[9px] font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[80px]">
                          {lead.name}
                        </h5>
                        <p className="text-[7.5px] font-semibold text-blue-600 dark:text-blue-400 leading-tight truncate max-w-[80px]">
                          {lead.role}
                        </p>

                        <span className="mt-0.5 px-1 py-0.2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-[7px] font-bold border border-blue-200 shadow-2xs">
                          {lead.teamSize} Staff
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Canvas Helper Hint */}
          <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            💡 Click on any executive or team lead circular node to view complete bio, reports, and direct contact details.
          </div>
        </div>
      ) : (
        /* ================= DIRECTORY LIST / MOBILE ACCORDION VIEW ================= */
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleNodeClick(emp)}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900/60 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{emp.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Tier {emp.level}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">{emp.role}</p>
                    <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {emp.bio}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Users className="w-3 h-3 text-slate-400" /> {emp.teamSize} Direct & Indirect Reports
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    View Profile <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EMPLOYEE PROFILE & REPORTING DETAILS MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Executive Profile & Reporting Line"
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-5">
            {/* Top Identity Header */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-100 dark:border-slate-700">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedEmployee.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-xs">
                    Level {selectedEmployee.level} Leadership
                  </span>
                </div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{selectedEmployee.role}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedEmployee.department} • Apex Global Corp
                </p>
              </div>
            </div>

            {/* Bio & Responsibilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Executive Leadership Scope
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                {selectedEmployee.bio}
              </p>
            </div>

            {/* Key Contact & Team Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>{selectedEmployee.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Team Headcount:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedEmployee.teamSize} Members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reporting Tier:</span>
                  <span className="font-bold text-blue-600">Tier {selectedEmployee.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Employment Status:</span>
                  <span className="font-bold text-emerald-600">Active Full-Time</span>
                </div>
              </div>
            </div>

            {/* Direct Reports List */}
            {selectedEmployee.children && selectedEmployee.children.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Direct Reports ({selectedEmployee.children.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedEmployee.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => setSelectedEmployee(child)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                    >
                      <img src={child.avatar} alt={child.name} className="h-8 w-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{child.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{child.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/employees');
                }}
              >
                View in Employee Directory
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
