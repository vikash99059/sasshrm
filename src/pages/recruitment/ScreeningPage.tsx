import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, CandidateStage } from '../../types';
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
  Input,
  Select,
} from '../../components/ui';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  FileText,
  Video,
  UserCheck,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  PauseCircle,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ScreeningPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'queue';

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCand, setSelectedCand] = useState<Candidate | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [candidateNote, setCandidateNote] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Scoring state
  const [scoreTechnical, setScoreTechnical] = useState(4);
  const [scoreExperience, setScoreExperience] = useState(4);
  const [scoreCulture, setScoreCulture] = useState(4);

  // Schedule Interview State
  const [intRound, setIntRound] = useState('Technical Coding Round');
  const [intDate, setIntDate] = useState('2025-06-25');
  const [intTime, setIntTime] = useState('02:30 PM');

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getCandidates();
    setCandidates(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleAction = async (candId: string, action: 'Shortlist' | 'Reject' | 'Hold') => {
    let nextStage: CandidateStage = 'Screening';
    let screeningStatus: 'Pending' | 'Passed' | 'Rejected' | 'Hold' = 'Pending';

    if (action === 'Shortlist') {
      nextStage = 'Shortlisted';
      screeningStatus = 'Passed';
    } else if (action === 'Reject') {
      nextStage = 'Rejected';
      screeningStatus = 'Rejected';
    } else if (action === 'Hold') {
      nextStage = 'Hold';
      screeningStatus = 'Hold';
    }

    await recruitmentService.updateCandidate(candId, {
      stage: nextStage,
      screeningStatus,
    });
    showToast(`Candidate marked as "${action}ed"`);
    loadData();
  };

  const handleSaveScore = async () => {
    if (!selectedCand) return;
    const overallScore = Math.round(((scoreTechnical + scoreExperience + scoreCulture) / 15) * 100);
    await recruitmentService.updateCandidate(selectedCand.id, {
      screeningScore: overallScore,
      rating: parseFloat(((scoreTechnical + scoreExperience + scoreCulture) / 3).toFixed(1)),
    });
    setIsScoreModalOpen(false);
    showToast(`Updated screening evaluation score (${overallScore}%) for ${selectedCand.name}`);
    loadData();
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCand) return;

    await recruitmentService.scheduleInterview(selectedCand.id, {
      stage: intRound,
      date: intDate,
      time: intTime,
      meetingLink: 'https://meet.google.com/xyz-hrm-meet',
    });

    setIsInterviewModalOpen(false);
    showToast(`Scheduled ${intRound} with ${selectedCand.name}`);
    loadData();
  };

  const handleSaveNote = async () => {
    if (!selectedCand) return;
    const currentNotes = selectedCand.notes || '';
    const updatedNotes = currentNotes
      ? `${currentNotes}\n[Screening Note]: ${candidateNote}`
      : `[Screening Note]: ${candidateNote}`;

    await recruitmentService.updateCandidate(selectedCand.id, {
      notes: updatedNotes,
    });
    setIsNoteModalOpen(false);
    setCandidateNote('');
    showToast('Screening note saved successfully');
    loadData();
  };

  // Tab Filtering
  const filteredCandidates = candidates.filter((c) => {
    if (currentTab === 'queue') {
      return c.stage === 'Applied' || c.stage === 'Screening' || c.stage === 'Under Review';
    }
    if (currentTab === 'results') {
      return c.screeningScore !== undefined;
    }
    if (currentTab === 'shortlisted') {
      return c.stage === 'Shortlisted' || c.screeningStatus === 'Passed';
    }
    if (currentTab === 'rejected') {
      return c.stage === 'Rejected' || c.screeningStatus === 'Rejected';
    }
    return true;
  });

  const columns: Column<Candidate>[] = [
    {
      header: 'Candidate',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {row.name}
            </p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Applied Position',
      accessorKey: 'jobTitle',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {row.jobTitle}
        </span>
      ),
    },
    {
      header: 'Experience',
      accessorKey: 'experienceYears',
      cell: (row) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {row.experienceYears} Years
        </span>
      ),
    },
    {
      header: 'Core Skills',
      accessorKey: 'skills',
      cell: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.skills?.slice(0, 2).map((s, idx) => (
            <Badge key={idx} variant="neutral" size="sm">
              {s}
            </Badge>
          ))}
          {(row.skills?.length || 0) > 2 && (
            <span className="text-[10px] text-slate-400 font-medium">
              +{row.skills!.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Screening Score',
      accessorKey: 'screeningScore',
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedCand(row);
            setIsScoreModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          title="Click to adjust scorecard"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {row.screeningScore || 80}%
          </span>
        </button>
      ),
    },
    {
      header: 'Screening Status',
      accessorKey: 'stage',
      cell: (row) => {
        let variant: 'success' | 'warning' | 'danger' | 'primary' = 'warning';
        if (row.stage === 'Shortlisted') variant = 'success';
        if (row.stage === 'Rejected') variant = 'danger';
        if (row.stage === 'Interview') variant = 'primary';
        return (
          <Badge variant={variant} size="sm">
            {row.stage}
          </Badge>
        );
      },
    },
    {
      header: 'Recruiter',
      accessorKey: 'recruiterName',
      cell: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {row.recruiterName || 'Elena Rostova'}
        </span>
      ),
    },
    {
      header: 'Screening Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(row.id, 'Shortlist')}
            title="Shortlist Candidate"
            className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(row.id, 'Reject')}
            title="Reject Candidate"
            className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(row.id, 'Hold')}
            title="Put On Hold"
            className="h-7 w-7 p-0 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
          >
            <PauseCircle className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCand(row);
              setIsInterviewModalOpen(true);
            }}
            title="Schedule Interview Round"
            className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Video className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCand(row);
              setIsNoteModalOpen(true);
            }}
            title="Add Screening Note"
            className="h-7 w-7 p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
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
            <Sparkles className="w-6 h-6 text-blue-600" />
            Screening & Shortlisting Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate initial applicant profiles, calibrate competency rubrics, and triage candidates for interviews.
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
          {
            key: 'queue',
            label: 'Screening Queue',
            count: candidates.filter((c) => c.stage === 'Applied' || c.stage === 'Screening').length,
          },
          {
            key: 'results',
            label: 'Screening Results',
            count: candidates.filter((c) => c.screeningScore !== undefined).length,
          },
          {
            key: 'shortlisted',
            label: 'Shortlisted Candidates',
            count: candidates.filter((c) => c.stage === 'Shortlisted').length,
          },
          {
            key: 'rejected',
            label: 'Rejected Candidates',
            count: candidates.filter((c) => c.stage === 'Rejected').length,
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

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredCandidates}
          searchKey="name"
          searchPlaceholder="Search applicant name, job title, skills..."
          pageSize={8}
        />
      </Card>

      {/* Candidate Scorecard Modal */}
      {selectedCand && (
        <Modal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          title={`Screening Scorecard: ${selectedCand.name}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-dark-border">
              <p className="font-bold text-slate-900 dark:text-white">{selectedCand.name}</p>
              <p className="text-[11px] text-slate-500">
                {selectedCand.jobTitle} • {selectedCand.experienceYears} years exp
              </p>
            </div>

            {/* Score Sliders / Ratings */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    1. Technical Alignment (1 - 5)
                  </span>
                  <span className="font-bold text-blue-600">{scoreTechnical} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreTechnical}
                  onChange={(e) => setScoreTechnical(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    2. Relevant Domain Experience (1 - 5)
                  </span>
                  <span className="font-bold text-blue-600">{scoreExperience} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreExperience}
                  onChange={(e) => setScoreExperience(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    3. Culture & Communication (1 - 5)
                  </span>
                  <span className="font-bold text-blue-600">{scoreCulture} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scoreCulture}
                  onChange={(e) => setScoreCulture(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Total Calculated Index */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/50 flex justify-between items-center">
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-300">Composite Score</p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400">
                  Weighted across core screening rubrics
                </p>
              </div>
              <span className="text-xl font-black text-blue-600 dark:text-blue-300">
                {Math.round(((scoreTechnical + scoreExperience + scoreCulture) / 15) * 100)}%
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsScoreModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveScore}>
                Save Scorecard
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      {selectedCand && (
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          title={`Schedule Interview: ${selectedCand.name}`}
          size="md"
        >
          <form onSubmit={handleScheduleInterview} className="space-y-4">
            <Select
              label="Interview Round / Type"
              value={intRound}
              onChange={(e) => setIntRound(e.target.value)}
              options={[
                { label: 'Initial Screening Call', value: 'Initial Screening Call' },
                { label: 'Technical Coding Round', value: 'Technical Coding Round' },
                { label: 'System Design Interview', value: 'System Design Interview' },
                { label: 'Hiring Manager Round', value: 'Hiring Manager Round' },
                { label: 'Culture & Leadership Fit', value: 'Culture & Leadership Fit' },
                { label: 'Final Executive Discussion', value: 'Final Executive Discussion' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={intDate}
                onChange={(e) => setIntDate(e.target.value)}
                required
              />
              <Input
                label="Time"
                value={intTime}
                onChange={(e) => setIntTime(e.target.value)}
                required
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-dark-border text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Google Meet Video Link
              </p>
              <p className="text-[11px] text-blue-600 font-mono mt-0.5">
                https://meet.google.com/xyz-hrm-meet
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<Video className="w-3.5 h-3.5" />}>
                Confirm & Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Recruiter Note Modal */}
      {selectedCand && (
        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title={`Add Screening Note: ${selectedCand.name}`}
          size="sm"
        >
          <div className="space-y-4">
            <textarea
              rows={4}
              placeholder="Enter internal recruiter notes regarding communication, notice period, or salary expectations..."
              value={candidateNote}
              onChange={(e) => setCandidateNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsNoteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
