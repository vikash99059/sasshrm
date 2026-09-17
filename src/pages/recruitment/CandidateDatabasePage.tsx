import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Star,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  Send,
  MoreHorizontal,
  Bookmark,
  ChevronRight,
  X,
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, CandidateStage, JobOpening } from '../../types';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';

export const CandidateDatabasePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Selected candidate drawer
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [profileTab, setProfileTab] = useState<
    'overview' | 'personal' | 'resume' | 'skills' | 'experience' | 'interviews' | 'evaluations' | 'offers' | 'notes'
  >('overview');

  // Add Candidate modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [jobId, setJobId] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [location, setLocation] = useState('San Francisco, CA');
  const [skills, setSkills] = useState('React, TypeScript, CSS');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    const [cList, jList] = await Promise.all([
      recruitmentService.getCandidates(),
      recruitmentService.getJobs(),
    ]);
    setCandidates(cList);
    setJobs(jList);
    if (jList.length > 0 && !jobId) setJobId(jList[0].id);

    // Check if ID in URL
    const idParam = searchParams.get('id');
    if (idParam) {
      const matched = cList.find((c) => c.id === idParam);
      if (matched) setSelectedCandidate(matched);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedJob = jobs.find((j) => j.id === jobId);
    const newCand = await recruitmentService.createCandidate({
      name,
      email,
      phone,
      currentCompany,
      currentRole,
      jobId,
      jobTitle: matchedJob ? matchedJob.title : 'Software Engineer',
      experienceYears: Number(experienceYears),
      location,
      skills: skills.split(',').map((s) => s.trim()),
      notes,
      stage: 'Applied',
    });
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    loadData();
    setSelectedCandidate(newCand);
  };

  const handleToggleTalentPool = async (cand: Candidate) => {
    const updated = await recruitmentService.updateCandidate(cand.id, {
      talentPool: !cand.talentPool,
    });
    loadData();
    if (selectedCandidate && selectedCandidate.id === cand.id) {
      setSelectedCandidate(updated);
    }
  };

  const handleStageChange = async (candId: string, newStage: CandidateStage) => {
    const updated = await recruitmentService.updateCandidateStage(candId, newStage);
    loadData();
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate(updated);
    }
  };

  const exportCandidatesCSV = () => {
    const headers = 'ID,Name,Email,Phone,Job,Stage,Rating,Experience,Location,Company\n';
    const rows = filtered
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.jobTitle}","${c.stage}","${c.rating}","${c.experienceYears}y","${c.location || ''}","${c.currentCompany || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filtered candidates
  const filtered = candidates.filter((c) => {
    if (activeTab === 'talent-pool' && !c.talentPool) return false;
    if (activeTab === 'new' && c.stage !== 'Applied') return false;
    if (activeTab === 'shortlisted' && c.stage !== 'Shortlisted') return false;
    if (activeTab === 'rejected' && c.stage !== 'Rejected') return false;
    if (activeTab === 'hired' && c.stage !== 'Hired' && c.stage !== 'Joined') return false;

    if (stageFilter !== 'All' && c.stage !== stageFilter) return false;
    if (jobFilter !== 'All' && c.jobTitle !== jobFilter) return false;
    if (sourceFilter !== 'All' && c.source !== sourceFilter) return false;
    if (ratingFilter !== 'All' && c.rating < Number(ratingFilter)) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q) ||
        (c.skills && c.skills.some((s) => s.toLowerCase().includes(q))) ||
        (c.location && c.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header with Cloudy Wave Design */}
      <PageHeaderCard
        title="Candidate Database"
        subtitle="Searchable candidate profiles, talent pool tags, skills matrices, and stage history."
        icon={Users}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50/90 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            {candidates.length} Profiles
          </span>
        }
        actions={
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportCandidatesCSV}
              className="flex items-center gap-1.5 font-semibold shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Candidate</span>
            </button>
          </div>
        }
      />

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'all', label: 'All Candidates', count: candidates.length },
          { id: 'talent-pool', label: 'Talent Pool ⭐', count: candidates.filter(c => c.talentPool).length },
          { id: 'new', label: 'New Candidates', count: candidates.filter(c => c.stage === 'Applied').length },
          { id: 'shortlisted', label: 'Shortlisted', count: candidates.filter(c => c.stage === 'Shortlisted').length },
          { id: 'rejected', label: 'Rejected', count: candidates.filter(c => c.stage === 'Rejected').length },
          { id: 'hired', label: 'Hired & Joined', count: candidates.filter(c => c.stage === 'Hired' || c.stage === 'Joined').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/60'
              }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === tab.id
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, email, skills, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Select
          label=""
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Jobs' },
            ...Array.from(new Set(candidates.map((c) => c.jobTitle))).map((j) => ({
              value: j,
              label: j,
            })),
          ]}
        />

        <Select
          label=""
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Stages' },
            { value: 'Applied', label: 'Applied' },
            { value: 'Screening', label: 'Screening' },
            { value: 'Shortlisted', label: 'Shortlisted' },
            { value: 'Interview', label: 'Interview' },
            { value: 'Technical Round', label: 'Technical Round' },
            { value: 'Selected', label: 'Selected' },
            { value: 'Offer', label: 'Offer' },
            { value: 'Offer Accepted', label: 'Offer Accepted' },
            { value: 'Joining', label: 'Joining' },
            { value: 'Hired', label: 'Hired' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
        />

        <Select
          label=""
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Ratings' },
            { value: '4.5', label: '4.5+ Stars' },
            { value: '4.0', label: '4.0+ Stars' },
            { value: '3.5', label: '3.5+ Stars' },
          ]}
        />
      </div>

      {/* Candidate Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">Job Applied</th>
                <th className="py-3 px-3">Experience</th>
                <th className="py-3 px-3">Top Skills</th>
                <th className="py-3 px-3">Location & Source</th>
                <th className="py-3 px-3">Current Stage</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedCandidate(item)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.name}
                          </span>
                          {item.talentPool && (
                            <span title="Talent Pool" className="text-amber-500 text-[10px]">
                              ★
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <span>{item.jobTitle}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Applied: {item.appliedDate}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-black text-slate-900 dark:text-white">{item.experienceYears}y</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                      {item.currentCompany}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {(item.skills || ['React', 'CSS']).slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {(item.skills?.length || 0) > 2 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{(item.skills?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-700 dark:text-slate-300 block truncate max-w-[120px]">
                      {item.location || 'Remote'}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">
                      {item.source || 'Career Page'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        item.stage === 'Selected' || item.stage === 'Offer Accepted' || item.stage === 'Hired'
                          ? 'success'
                          : item.stage === 'Rejected'
                            ? 'danger'
                            : item.stage === 'Interview' || item.stage === 'Technical Round'
                              ? 'warning'
                              : 'neutral'
                      }
                      size="sm"
                      dot
                    >
                      {item.stage}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-black text-slate-900 dark:text-white tabular-nums">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(item);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No candidates found matching the query or filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          CANDIDATE PROFILE DRAWER (COMPREHENSIVE 11 SECTIONS)
         ========================================================================= */}
      {selectedCandidate && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[620px] bg-white dark:bg-[#0F172A] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3.5">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedCandidate.name}
                  </h2>
                  <button
                    onClick={() => handleToggleTalentPool(selectedCandidate)}
                    title="Toggle Talent Pool"
                    className={`p-1 rounded-md text-xs cursor-pointer ${selectedCandidate.talentPool
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                        : 'text-slate-400 hover:text-amber-500'
                      }`}
                  >
                    ★
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedCandidate.currentRole || 'Software Professional'} • {selectedCandidate.currentCompany}
                </p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                  Applied for: {selectedCandidate.jobTitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sub-tabs header */}
          <div className="flex items-center gap-1 px-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-thin bg-white dark:bg-dark-card text-xs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'personal', label: 'Personal' },
              { id: 'resume', label: 'Resume' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'interviews', label: 'Interviews' },
              { id: 'evaluations', label: 'Evaluations' },
              { id: 'offers', label: 'Offers' },
              { id: 'notes', label: 'Timeline' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setProfileTab(t.id as any)}
                className={`py-3 px-2.5 font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${profileTab === t.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {profileTab === 'overview' && (
              <div className="space-y-4">
                {/* Stage selector bar */}
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                      CURRENT STAGE
                    </span>
                    <Badge variant="primary" size="sm">
                      {selectedCandidate.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      label=""
                      value={selectedCandidate.stage}
                      onChange={(e) => handleStageChange(selectedCandidate.id, e.target.value as any)}
                      options={[
                        { value: 'Applied', label: 'Applied' },
                        { value: 'Screening', label: 'Screening' },
                        { value: 'Shortlisted', label: 'Shortlisted' },
                        { value: 'Interview', label: 'Interview' },
                        { value: 'Technical Round', label: 'Technical Round' },
                        { value: 'Selected', label: 'Selected' },
                        { value: 'Offer', label: 'Offer' },
                        { value: 'Offer Accepted', label: 'Offer Accepted' },
                        { value: 'Joining', label: 'Joining' },
                        { value: 'Hired', label: 'Hired' },
                        { value: 'Rejected', label: 'Rejected' },
                      ]}
                    />
                  </div>
                </div>

                {/* KPI metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 block font-semibold">EXPERIENCE</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {selectedCandidate.experienceYears} Years
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 block font-semibold">RATING</span>
                    <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {selectedCandidate.rating}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 block font-semibold">NOTICE PERIOD</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {selectedCandidate.noticePeriod}
                    </span>
                  </div>
                </div>

                {/* Recruiter Notes */}
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Recruiter Notes</h4>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed text-slate-600 dark:text-slate-400">
                    {selectedCandidate.notes || 'No specific recruiter notes entered yet.'}
                  </p>
                </div>

                {/* Sourcing & Location info */}
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCandidate.location || 'Remote'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source:</span>
                    <span className="font-semibold text-blue-600">{selectedCandidate.source || 'Career Page'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Salary:</span>
                    <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{selectedCandidate.expectedSalary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lead Recruiter:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCandidate.recruiterName || 'Elena Rostova'}</span>
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'personal' && (
              <div className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{selectedCandidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{selectedCandidate.location || 'San Francisco, CA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">Currently at {selectedCandidate.currentCompany || 'Freelance'}</span>
                </div>
              </div>
            )}

            {profileTab === 'skills' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Verified Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedCandidate.skills || ['React', 'TypeScript', 'Node.js', 'Tailwind CSS']).map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profileTab === 'resume' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {selectedCandidate.name.replace(' ', '_')}_Resume.pdf
                      </p>
                      <p className="text-[10px] text-slate-400">PDF Document • 1.4 MB • Uploaded on {selectedCandidate.appliedDate}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert(`Simulated downloading resume for ${selectedCandidate.name}`)}
                  >
                    Download
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Parsed Resume Summary</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedCandidate.experienceYears}+ years delivering scalable web products. Expert in modern architecture, high-performance UI components, and distributed microservices.
                  </p>
                </div>
              </div>
            )}

            {profileTab === 'interviews' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Interview Rounds</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/recruiter/interviews?action=schedule&candidateId=${selectedCandidate.id}`)}
                  >
                    + Schedule Round
                  </Button>
                </div>

                {selectedCandidate.interviews && selectedCandidate.interviews.length > 0 ? (
                  selectedCandidate.interviews.map((iv) => (
                    <div
                      key={iv.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{iv.stage}</span>
                        <Badge variant={iv.status === 'Completed' ? 'success' : 'warning'} size="sm">
                          {iv.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {iv.date} at {iv.time} • Interviewer: {iv.interviewerName}
                      </p>
                      {iv.feedback && (
                        <p className="text-slate-600 dark:text-slate-300 mt-2 p-2 rounded bg-white dark:bg-slate-800 italic">
                          "{iv.feedback}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-6">No interview sessions recorded yet.</p>
                )}
              </div>
            )}

            {profileTab === 'evaluations' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Interview Evaluation</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/recruiter/evaluations?candidateId=${selectedCandidate.id}`)}
                  >
                    View Evaluation Form
                  </Button>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Overall Score</span>
                    <span className="font-black text-blue-600 text-sm">{selectedCandidate.rating} / 5.0</span>
                  </div>
                  <p className="text-slate-500">
                    Candidate has passed screening benchmarks with strong positive feedback on problem solving and collaboration.
                  </p>
                </div>
              </div>
            )}

            {profileTab === 'offers' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Offer Status</h4>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/recruiter/offers?candidateId=${selectedCandidate.id}`)}
                  >
                    Manage Offer
                  </Button>
                </div>
                <p className="text-slate-500">
                  Current offer stage: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCandidate.stage}</span>
                </p>
              </div>
            )}

            {profileTab === 'notes' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Activity Timeline</h4>
                <div className="space-y-2 border-l-2 border-blue-200 dark:border-slate-700 ml-2 pl-3">
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="font-bold text-slate-900 dark:text-white">Applied via LinkedIn</p>
                    <span className="text-[10px] text-slate-400">{selectedCandidate.appliedDate}</span>
                  </div>
                  <div className="relative pt-2">
                    <span className="absolute -left-[19px] top-3.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <p className="font-bold text-slate-900 dark:text-white">Screened & Shortlisted</p>
                    <span className="text-[10px] text-slate-400">Score: {selectedCandidate.screeningScore || 90}/100</span>
                  </div>
                  <div className="relative pt-2">
                    <span className="absolute -left-[19px] top-3.5 h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <p className="font-bold text-slate-900 dark:text-white">Stage Updated: {selectedCandidate.stage}</p>
                    <span className="text-[10px] text-slate-400">By Elena Rostova</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={selectedCandidate.talentPool ? 'secondary' : 'outline'}
                onClick={() => handleToggleTalentPool(selectedCandidate)}
              >
                {selectedCandidate.talentPool ? '★ In Talent Pool' : '☆ Add to Talent Pool'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate(`/recruiter/interviews?candidateId=${selectedCandidate.id}`)}
              >
                Schedule Interview →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CANDIDATE MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Candidate to Database" size="lg">
        <form onSubmit={handleAddCandidate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. maya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="e.g. +1 (555) 345-6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Select
              label="Applying For Role"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              options={jobs.map((j) => ({ value: j.id, label: `${j.title} (${j.department})` }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Current Company"
              placeholder="e.g. Microsoft"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
            />
            <Input
              label="Current Role"
              placeholder="e.g. Senior Frontend Dev"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
            />
            <Input
              label="Years of Experience"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Candidate Location"
              placeholder="e.g. San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Skills (comma separated)"
              placeholder="e.g. React, TypeScript, GraphQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Screening / Referral Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key highlights, referral source, or initial recruiter impressions..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Candidate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
