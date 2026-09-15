import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { InterviewEvaluation } from '../../types';
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
  Award,
  Star,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Plus,
  RefreshCw,
  FileText,
  User,
  MessageSquare,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const InterviewEvaluationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'pending';

  const [evaluations, setEvaluations] = useState<InterviewEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEval, setSelectedEval] = useState<InterviewEvaluation | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [candidateName, setCandidateName] = useState('Sarah Jenkins');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [interviewRound, setInterviewRound] = useState('System Architecture & Coding');
  const [techScore, setTechScore] = useState(4);
  const [commScore, setCommScore] = useState(5);
  const [probScore, setProbScore] = useState(4);
  const [expScore, setExpScore] = useState(5);
  const [cultScore, setCultScore] = useState(4);
  const [recommendation, setRecommendation] = useState<
    'Strong Hire' | 'Hire' | 'Hold' | 'Reject'
  >('Strong Hire');
  const [strengthsText, setStrengthsText] = useState('Exceptional distributed system knowledge, articulate communicator');
  const [weaknessesText, setWeaknessesText] = useState('Limited experience with GCP specific services');
  const [commentsText, setCommentsText] = useState('Candidate demonstrated mastery of design tradeoffs. Recommend extending offer.');

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getEvaluations();
    setEvaluations(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const overallRating = parseFloat(
      ((techScore + commScore + probScore + expScore + cultScore) / 5).toFixed(1)
    );

    await recruitmentService.submitEvaluation({
      candidateName,
      jobTitle,
      interviewRound,
      scores: {
        technicalSkills: techScore,
        communication: commScore,
        problemSolving: probScore,
        experience: expScore,
        cultureFit: cultScore,
      },
      overallRating,
      recommendation,
      strengths: strengthsText.split(',').map((s) => s.trim()).filter(Boolean),
      weaknesses: weaknessesText.split(',').map((w) => w.trim()).filter(Boolean),
      comments: commentsText,
    });

    setIsFormModalOpen(false);
    showToast(`Evaluation submitted successfully for ${candidateName}`);
    loadData();
  };

  const filteredEvaluations = evaluations.filter((ev) => {
    if (currentTab === 'pending') return ev.status === 'Pending';
    if (currentTab === 'completed') return ev.status === 'Completed';
    if (currentTab === 'feedback') return ev.recommendation === 'Strong Hire' || ev.recommendation === 'Hire';
    if (currentTab === 'history') return true;
    return true;
  });

  const getRecommendationBadge = (rec: InterviewEvaluation['recommendation']) => {
    switch (rec) {
      case 'Strong Hire':
        return <Badge variant="success" size="sm">★ Strong Hire</Badge>;
      case 'Hire':
        return <Badge variant="primary" size="sm">Hire</Badge>;
      case 'Hold':
        return <Badge variant="warning" size="sm">Hold</Badge>;
      case 'Reject':
        return <Badge variant="danger" size="sm">Reject</Badge>;
      default:
        return null;
    }
  };

  const columns: Column<InterviewEvaluation>[] = [
    {
      header: 'Evaluation ID',
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
            <p className="text-[10px] text-slate-400">{row.jobTitle}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Interview Round',
      accessorKey: 'interviewRound',
      cell: (row) => (
        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
          {row.interviewRound}
        </span>
      ),
    },
    {
      header: 'Panelist / Role',
      accessorKey: 'interviewerName',
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.interviewerName}
          </p>
          <p className="text-[10px] text-slate-400">{row.interviewerRole || 'Lead Interviewer'}</p>
        </div>
      ),
    },
    {
      header: 'Overall Rating',
      accessorKey: 'overallRating',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {row.overallRating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400">/ 5.0</span>
        </div>
      ),
    },
    {
      header: 'Recommendation',
      accessorKey: 'recommendation',
      cell: (row) => getRecommendationBadge(row.recommendation),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Completed' ? 'success' : 'warning'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEval(row);
              setIsDetailModalOpen(true);
            }}
            className="text-xs font-medium"
          >
            Scorecard
          </Button>

          {row.status === 'Pending' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCandidateName(row.candidateName);
                setJobTitle(row.jobTitle);
                setInterviewRound(row.interviewRound);
                setIsFormModalOpen(true);
              }}
              className="text-xs font-medium text-blue-600"
            >
              Submit Eval
            </Button>
          )}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-blue-600" />
            Interview Evaluations & Scorecards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured competency scoring, interviewer feedback rubrics, and hiring recommendations.
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

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFormModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Evaluation
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'pending', label: 'Pending Evaluation', count: evaluations.filter((e) => e.status === 'Pending').length },
          { key: 'completed', label: 'Completed Evaluations', count: evaluations.filter((e) => e.status === 'Completed').length },
          { key: 'feedback', label: 'Hiring Endorsements', count: evaluations.filter((e) => e.recommendation === 'Strong Hire' || e.recommendation === 'Hire').length },
          { key: 'history', label: 'Evaluation History', count: evaluations.length },
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
          data={filteredEvaluations}
          searchKey="candidateName"
          searchPlaceholder="Search candidate, round or panelist..."
          pageSize={8}
        />
      </Card>

      {/* Add / Submit Evaluation Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Submit Candidate Interview Evaluation"
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Job Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Interview Round
              </label>
              <input
                type="text"
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* 5 Rubrics */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-dark-border space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Competency Evaluation Dimensions (1 to 5)
            </h4>

            {[
              { label: 'Technical Skills & Architecture', val: techScore, setter: setTechScore },
              { label: 'Communication & Articulation', val: commScore, setter: setCommScore },
              { label: 'Problem Solving & Logic', val: probScore, setter: setProbScore },
              { label: 'Relevant Domain Experience', val: expScore, setter: setExpScore },
              { label: 'Culture & Values Alignment', val: cultScore, setter: setCultScore },
            ].map((dim, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <span className="font-medium text-slate-700 dark:text-slate-300 w-56">
                  {dim.label}
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={dim.val}
                  onChange={(e) => dim.setter(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
                />
                <span className="font-bold text-blue-600 w-10 text-right">{dim.val} / 5</span>
              </div>
            ))}
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Final Recommendation
            </label>
            <Select
              value={recommendation}
              onChange={(e) =>
                setRecommendation(e.target.value as 'Strong Hire' | 'Hire' | 'Hold' | 'Reject')
              }
              options={[
                { label: '★ Strong Hire (Highly Recommended)', value: 'Strong Hire' },
                { label: 'Hire (Meets Expectations)', value: 'Hire' },
                { label: 'Hold (Needs Further Consideration)', value: 'Hold' },
                { label: 'Reject (Does Not Meet Bar)', value: 'Reject' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Candidate Strengths (comma-separated)
              </label>
              <textarea
                rows={2}
                value={strengthsText}
                onChange={(e) => setStrengthsText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Areas for Development (comma-separated)
              </label>
              <textarea
                rows={2}
                value={weaknessesText}
                onChange={(e) => setWeaknessesText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              General Evaluation Remarks / Feedback
            </label>
            <textarea
              rows={3}
              value={commentsText}
              onChange={(e) => setCommentsText(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
            <Button variant="secondary" size="sm" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Evaluation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Scorecard Details Modal */}
      {selectedEval && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Scorecard: ${selectedEval.candidateName}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <Avatar src={selectedEval.candidateAvatar} name={selectedEval.candidateName} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedEval.candidateName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedEval.jobTitle} • {selectedEval.interviewRound}
                  </p>
                </div>
              </div>
              <div>{getRecommendationBadge(selectedEval.recommendation)}</div>
            </div>

            {/* Scorecard Rubrics Breakdown */}
            <div className="space-y-2 border border-slate-200 dark:border-dark-border p-3 rounded-lg bg-white dark:bg-dark-card">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white pb-1 border-b">
                <span>Evaluation Dimension</span>
                <span>Score</span>
              </div>
              {Object.entries(selectedEval.scores).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-blue-600">{val} / 5</span>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-lg">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">Key Strengths</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  {selectedEval.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-lg">
                <p className="font-bold text-rose-800 dark:text-rose-300 mb-1">Improvement Areas</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                  {selectedEval.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Panelist Remarks */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-dark-border">
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                Interviewer Narrative Feedback
              </p>
              <p className="text-slate-600 dark:text-slate-400 italic">"{selectedEval.comments}"</p>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Evaluated by {selectedEval.interviewerName} on {formatDate(selectedEval.evaluationDate)}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
