import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { JobOpening } from '../../types';
import { Badge, Button, Modal, Input, Select } from '../../components/ui';
import {
  Briefcase,
  Plus,
  Users,
  MapPin,
  DollarSign,
  ArrowRight,
  Eye,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const JobOpeningsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadJobs = async () => {
    const list = await recruitmentService.getJobs();
    setJobs(list);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'create') {
      navigate('/recruiter/jobs/create');
      return;
    }
    setActiveTab(tabId);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'draft' && j.status !== 'Draft') return false;
    if (activeTab === 'published' && j.status !== 'Active') return false;
    if (activeTab === 'expired' && j.status !== 'Expired') return false;
    if (activeTab === 'closed' && j.status !== 'Closed') return false;

    if (deptFilter !== 'All' && j.department !== deptFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Recruitment</span>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-slate-300">Jobs</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Job Openings</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {jobs.length} Positions
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage published job posts, recruitment stages, applicant views, and closed positions.
          </p>
        </div>

        <button
          onClick={() => navigate('/recruiter/jobs/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create Job</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'all', label: 'All Jobs', count: jobs.length },
          { id: 'create', label: '+ Create Job', isAction: true },
          { id: 'draft', label: 'Draft Jobs', count: jobs.filter(j => j.status === 'Draft').length },
          { id: 'published', label: 'Published Jobs', count: jobs.filter(j => j.status === 'Active').length },
          { id: 'expired', label: 'Expired Jobs', count: jobs.filter(j => j.status === 'Expired').length },
          { id: 'closed', label: 'Closed Jobs', count: jobs.filter(j => j.status === 'Closed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search role title, department, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Select
          label=""
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Departments' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Design', label: 'Design' },
            { value: 'Product & Design', label: 'Product & Design' },
            { value: 'Human Resources', label: 'Human Resources' },
            { value: 'Sales & Growth', label: 'Sales & Growth' },
          ]}
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-dark-card flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-900/60 transition-all duration-150"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Badge
                  variant={
                    job.status === 'Active'
                      ? 'success'
                      : job.status === 'Draft'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                  dot
                >
                  {job.status}
                </Badge>
              </div>

              {/* Title & Info */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {job.department} • <span className="font-semibold">{job.location}</span>
              </p>

              <div className="flex items-center gap-2 mt-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                <span>{job.salaryRange}</span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-600 font-sans font-bold">{job.positions} Openings</span>
              </div>

              {/* Conversion metrics row */}
              <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center my-4 text-xs">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {job.viewsCount || 240}
                  </span>
                  <span className="text-[9px] text-slate-400">Views</span>
                </div>
                <div>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 block">
                    {job.applicationsCount || 24}
                  </span>
                  <span className="text-[9px] text-slate-400">Applied</span>
                </div>
                <div>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 block">
                    {job.interviewsCount || 8}
                  </span>
                  <span className="text-[9px] text-slate-400">Interview</span>
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {job.hiredCount || 1}
                  </span>
                  <span className="text-[9px] text-slate-400">Hired</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  setSelectedJob(job);
                  setIsDetailModalOpen(true);
                }}
                className="font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                View Details
              </button>

              <button
                onClick={() => navigate('/recruiter/candidates')}
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedJob && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Job Details: ${selectedJob.title}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedJob.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
                </p>
                <p className="text-xs font-bold text-blue-600 mt-1">{selectedJob.salaryRange}</p>
              </div>
              <Badge variant={selectedJob.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                {selectedJob.status}
              </Badge>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Job Overview</h4>
              <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {selectedJob.responsibilities && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedJob.responsibilities.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Requirements</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                {selectedJob.requirements.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            {selectedJob.skills && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Posted: {selectedJob.postedDate} • Deadline: {selectedJob.deadline}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    navigate('/recruiter/candidates');
                  }}
                >
                  View Candidate Pipeline →
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
