import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { JobApplication, CandidateStage } from '../../types';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  DataTable,
  Column,
  Modal,
  Avatar,
  Select,
} from '../../components/ui';
import {
  Target,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Award,
  Briefcase,
  History,
} from 'lucide-react';
import { formatDate } from '../../utils';

const LIFECYCLE_STAGES: CandidateStage[] = [
  'Applied',
  'Under Review',
  'Screening',
  'Shortlisted',
  'Interview',
  'Selected',
  'Offer',
  'Offer Accepted',
  'Joining',
  'Hired',
];

export const ApplicationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [newStage, setNewStage] = useState<CandidateStage>('Screening');
  const [stageComment, setStageComment] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getApplications();
    setApplications(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    await recruitmentService.updateApplicationStage(selectedApp.id, newStage, stageComment);
    setIsStageModalOpen(false);
    setStageComment('');
    showToast(`Updated application stage to "${newStage}" for ${selectedApp.candidateName}`);
    loadData();

    // Update selected in memory if drawer is open
    setSelectedApp((prev) =>
      prev
        ? {
            ...prev,
            currentStage: newStage,
            timeline: [
              ...prev.timeline,
              {
                stage: newStage,
                date: new Date().toISOString().split('T')[0],
                updatedBy: 'Elena Rostova',
                comment: stageComment || `Updated to ${newStage}`,
              },
            ],
          }
        : null
    );
  };

  // Filter based on active tab
  const filteredApps = applications.filter((app) => {
    if (currentTab === 'new') return app.currentStage === 'Applied';
    if (currentTab === 'review') return app.currentStage === 'Under Review';
    if (currentTab === 'shortlisted') return app.currentStage === 'Shortlisted';
    if (currentTab === 'rejected') return app.currentStage === 'Rejected';
    if (currentTab === 'withdrawn') return app.currentStage === 'Withdrawn';
    return true; // 'all'
  });

  const getStageColor = (stage: CandidateStage) => {
    switch (stage) {
      case 'Applied':
      case 'Under Review':
        return 'warning';
      case 'Screening':
      case 'Shortlisted':
      case 'Interview':
        return 'primary';
      case 'Selected':
      case 'Offer':
      case 'Offer Accepted':
      case 'Joining':
      case 'Hired':
        return 'success';
      case 'Rejected':
      case 'Withdrawn':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const columns: Column<JobApplication>[] = [
    {
      header: 'Application ID',
      accessorKey: 'id',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Candidate',
      accessorKey: 'candidateName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.candidateAvatar} name={row.candidateName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {row.candidateName}
            </p>
            <p className="text-[11px] text-slate-400">{row.candidateEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Job Title',
      accessorKey: 'jobTitle',
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.jobTitle}</p>
          <p className="text-[10px] text-slate-400">{row.department}</p>
        </div>
      ),
    },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: (row) => (
        <Badge variant="neutral" size="sm">
          {row.source}
        </Badge>
      ),
    },
    {
      header: 'Current Stage',
      accessorKey: 'currentStage',
      cell: (row) => (
        <Badge variant={getStageColor(row.currentStage)} size="sm">
          {row.currentStage}
        </Badge>
      ),
    },
    {
      header: 'Applied Date',
      accessorKey: 'appliedDate',
      cell: (row) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {formatDate(row.appliedDate)}
        </span>
      ),
    },
    {
      header: 'Assigned Recruiter',
      accessorKey: 'recruiterName',
      cell: (row) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {row.recruiterName}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedApp(row);
              setIsDetailDrawerOpen(true);
            }}
            className="text-xs font-medium"
          >
            Review
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedApp(row);
              setNewStage(row.currentStage);
              setIsStageModalOpen(true);
            }}
            className="text-xs font-medium"
          >
            Move Stage
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successToast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-blue-600" />
            Application Tracking System (ATS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time candidate application lifecycle, progression milestones, and evaluation records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'all', label: 'All Applications', count: applications.length },
          {
            key: 'new',
            label: 'New Applications',
            count: applications.filter((a) => a.currentStage === 'Applied').length,
          },
          {
            key: 'review',
            label: 'Under Review',
            count: applications.filter((a) => a.currentStage === 'Under Review').length,
          },
          {
            key: 'shortlisted',
            label: 'Shortlisted',
            count: applications.filter((a) => a.currentStage === 'Shortlisted').length,
          },
          {
            key: 'rejected',
            label: 'Rejected',
            count: applications.filter((a) => a.currentStage === 'Rejected').length,
          },
          {
            key: 'withdrawn',
            label: 'Withdrawn',
            count: applications.filter((a) => a.currentStage === 'Withdrawn').length,
          },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ATS Progressive Lifecycle Bar */}
      <Card className="p-4 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border overflow-x-auto">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          10-Stage Candidate Lifecycle Pipeline
        </p>
        <div className="flex items-center gap-1 min-w-[750px]">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const count = applications.filter((a) => a.currentStage === stage).length;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <div
                    className={`h-full ${count > 0 ? 'bg-blue-600' : 'bg-transparent'}`}
                    style={{ width: count > 0 ? '100%' : '0%' }}
                  />
                </div>
                <div className="flex items-center justify-between w-full mt-1.5 px-0.5">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {stage}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      count > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredApps}
          searchKey="candidateName"
          searchPlaceholder="Search applicant, job, ID or source..."
          pageSize={8}
        />
      </Card>

      {/* Application Detail Drawer / Modal */}
      {selectedApp && (
        <Modal
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
          title={`Application Details: ${selectedApp.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <Avatar src={selectedApp.candidateAvatar} name={selectedApp.candidateName} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedApp.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApp.candidateEmail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary" size="sm">
                      {selectedApp.jobTitle}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {selectedApp.department}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Current Stage
                </span>
                <div className="mt-0.5">
                  <Badge variant={getStageColor(selectedApp.currentStage)} size="md">
                    {selectedApp.currentStage}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200/60 dark:border-dark-border bg-white dark:bg-dark-card">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Source</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedApp.source}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/60 dark:border-dark-border bg-white dark:bg-dark-card">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Application Date</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(selectedApp.appliedDate)}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/60 dark:border-dark-border bg-white dark:bg-dark-card">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Recruiter</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedApp.recruiterName}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/60 dark:border-dark-border bg-white dark:bg-dark-card">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Resume File</p>
                <a
                  href={selectedApp.resumeUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening verified resume viewer');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 inline-flex items-center gap-1 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" /> View CV
                </a>
              </div>
            </div>

            {/* Application History & Progression Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Audit Trail & Progression Milestones
              </h4>

              <div className="border border-slate-200 dark:border-dark-border rounded-lg divide-y divide-slate-100 dark:divide-slate-800">
                {selectedApp.timeline.map((item, i) => (
                  <div key={i} className="p-3 flex items-start justify-between text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {item.stage}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{item.comment}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatDate(item.date)}
                      </span>
                      <p className="text-[10px] text-slate-500">by {item.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            {selectedApp.notes && (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-lg text-xs">
                <p className="font-bold text-amber-800 dark:text-amber-300">Recruiter Notes</p>
                <p className="text-amber-700 dark:text-amber-400 mt-1">{selectedApp.notes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsDetailDrawerOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  setNewStage(selectedApp.currentStage);
                  setIsStageModalOpen(true);
                }}
                leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Promote / Move Stage
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Move Stage Modal */}
      {selectedApp && (
        <Modal
          isOpen={isStageModalOpen}
          onClose={() => setIsStageModalOpen(false)}
          title={`Update Application Stage: ${selectedApp.candidateName}`}
          size="sm"
        >
          <form onSubmit={handleUpdateStage} className="space-y-4">
            <Select
              label="Select Next Stage"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as CandidateStage)}
              options={LIFECYCLE_STAGES.map((st) => ({ label: st, value: st }))}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Progression Note / Comment
              </label>
              <textarea
                rows={3}
                placeholder="State the rationale for advancing or modifying this candidate's stage..."
                value={stageComment}
                onChange={(e) => setStageComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsStageModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm Stage Transition
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
