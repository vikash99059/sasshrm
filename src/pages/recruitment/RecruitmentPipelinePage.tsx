import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, CandidateStage } from '../../types';
import {
  Card,
  Button,
  Badge,
  Avatar,
  Modal,
  Input,
  Select,
} from '../../components/ui';
import {
  Layers,
  Star,
  Plus,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Video,
  Clock,
  MapPin,
  Briefcase,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '../../utils';

const PIPELINE_COLUMNS: CandidateStage[] = [
  'Applied',
  'Screening',
  'Shortlisted',
  'Interview',
  'Selected',
  'Offer',
  'Offer Accepted',
  'Joining',
  'Hired',
  'Rejected',
];

export const RecruitmentPipelinePage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [candidateNote, setCandidateNote] = useState('');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Interview state
  const [interviewStage, setInterviewStage] = useState('Technical Coding Round');
  const [interviewDate, setInterviewDate] = useState('2025-06-27');
  const [interviewTime, setInterviewTime] = useState('02:00 PM');

  const loadCandidates = async () => {
    setLoading(true);
    const list = await recruitmentService.getCandidates();
    setCandidates(list);
    setLoading(false);
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleMoveStage = async (candidateId: string, newStage: CandidateStage) => {
    await recruitmentService.updateCandidateStage(candidateId, newStage);
    showToast(`Candidate moved to "${newStage}"`);
    loadCandidates();
  };

  const handleDragStart = (candidateId: string) => {
    setDraggedCandidateId(candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stage: CandidateStage) => {
    if (!draggedCandidateId) return;
    await handleMoveStage(draggedCandidateId, stage);
    setDraggedCandidateId(null);
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    await recruitmentService.scheduleInterview(selectedCandidate.id, {
      stage: interviewStage,
      date: interviewDate,
      time: interviewTime,
      meetingLink: 'https://meet.google.com/xyz-hrm-meet',
    });

    setIsInterviewModalOpen(false);
    showToast(`Interview scheduled for ${selectedCandidate.name}`);
    loadCandidates();
  };

  const handleSaveNote = async () => {
    if (!selectedCandidate) return;
    const currentNotes = selectedCandidate.notes || '';
    const updated = currentNotes
      ? `${currentNotes}\n[Pipeline Note]: ${candidateNote}`
      : `[Pipeline Note]: ${candidateNote}`;

    await recruitmentService.updateCandidate(selectedCandidate.id, { notes: updated });
    setIsNoteModalOpen(false);
    setCandidateNote('');
    showToast('Note added to candidate profile');
    loadCandidates();
  };

  const getPriorityBadge = (priority?: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return <Badge variant="danger" size="sm">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="primary" size="sm">Medium</Badge>;
      case 'Low':
        return <Badge variant="neutral" size="sm">Low</Badge>;
      default:
        return null;
    }
  };

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
            <Layers className="w-6 h-6 text-blue-600" />
            Recruitment Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive drag-and-drop hiring stages across all active candidate evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadCandidates}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh Pipeline
          </Button>

          <Badge variant="primary" size="md">
            {candidates.length} Candidates Active
          </Badge>
        </div>
      </div>

      {/* 10-Column Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-thin">
        {PIPELINE_COLUMNS.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
              className="flex-shrink-0 w-72 flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-xl p-2.5 border border-slate-200/70 dark:border-dark-border transition-colors duration-150 min-h-[580px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {stage}
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[640px] pr-1">
                {stageCandidates.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => handleDragStart(c.id)}
                    className="p-3 bg-white dark:bg-dark-card rounded-lg border border-slate-200/80 dark:border-dark-border shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing space-y-2.5"
                  >
                    {/* Candidate Identity */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar src={c.avatar} name={c.name} size="sm" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {c.jobTitle}
                          </p>
                        </div>
                      </div>
                      {getPriorityBadge(c.priority)}
                    </div>

                    {/* Metadata Items */}
                    <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{c.experienceYears} yrs exp • {c.currentCompany}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Recruiter: {c.recruiterName || 'Elena Rostova'}</span>
                      </div>
                    </div>

                    {/* Interviews / Rating */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{c.rating?.toFixed(1) || '4.0'}</span>
                      </div>

                      <span className="text-slate-400 font-mono">
                        Applied: {formatDate(c.appliedDate)}
                      </span>
                    </div>

                    {/* Stage Selector & Quick Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <select
                        value={c.stage}
                        onChange={(e) => handleMoveStage(c.id, e.target.value as CandidateStage)}
                        className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
                      >
                        {PIPELINE_COLUMNS.map((st) => (
                          <option key={st} value={st}>
                            Move: {st}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCandidate(c);
                            setIsInterviewModalOpen(true);
                          }}
                          title="Schedule Interview"
                          className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                        >
                          <Video className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCandidate(c);
                            setIsNoteModalOpen(true);
                          }}
                          title="Add Note"
                          className="h-6 w-6 p-0 text-slate-500 hover:bg-slate-100"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveStage(c.id, 'Shortlisted')}
                          title="Shortlist Candidate"
                          className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-50"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveStage(c.id, 'Rejected')}
                          title="Reject Candidate"
                          className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-[11px] text-slate-400 font-medium">
                    Drop candidate here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          title={`Schedule Interview: ${selectedCandidate.name}`}
          size="md"
        >
          <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
            <Select
              label="Interview Stage"
              value={interviewStage}
              onChange={(e) => setInterviewStage(e.target.value)}
              options={[
                { label: 'Initial Screening Call', value: 'Initial Screening Call' },
                { label: 'Technical Coding Round', value: 'Technical Coding Round' },
                { label: 'System Design Interview', value: 'System Design Interview' },
                { label: 'Managerial Fit Round', value: 'Managerial Fit Round' },
                { label: 'Executive Final Round', value: 'Executive Final Round' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
              />
              <Input
                label="Time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" leftIcon={<Video className="w-3.5 h-3.5" />}>
                Schedule & Advance
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Note Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title={`Pipeline Note: ${selectedCandidate.name}`}
          size="sm"
        >
          <div className="space-y-4">
            <textarea
              rows={4}
              placeholder="Add recruiter feedback or candidate update..."
              value={candidateNote}
              onChange={(e) => setCandidateNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
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
