import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, CandidateStage } from '../../types';
import { Card, Button, Badge, Avatar, Modal, Input, Select } from '../../components/ui';
import {
  Users,
  Briefcase,
  Star,
  Plus,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const CandidatesKanbanPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2024-05-24');
  const [interviewTime, setInterviewTime] = useState('02:00 PM');
  const [interviewStage, setInterviewStage] = useState('Technical Coding Round');
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const stages: CandidateStage[] = [
    'Applied',
    'Screening',
    'Shortlisted',
    'Interview',
    'Technical Round',
    'HR Round',
    'Selected',
    'Joined',
  ];

  const loadCandidates = async () => {
    const list = await recruitmentService.getCandidates();
    setCandidates(list);
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleMoveStage = async (candidateId: string, newStage: CandidateStage) => {
    await recruitmentService.updateCandidateStage(candidateId, newStage);
    loadCandidates();
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, stage: newStage });
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    await recruitmentService.scheduleInterview(selectedCandidate.id, {
      stage: interviewStage,
      date: interviewDate,
      time: interviewTime,
      meetingLink: 'https://meet.google.com/hrm-talent-interview',
    });
    setScheduledSuccess(true);
    setTimeout(() => {
      setScheduledSuccess(false);
      setIsInterviewModalOpen(false);
      loadCandidates();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Talent Pipeline & ATS Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive recruitment funnel across all candidate evaluation stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {candidates.length} Total Applicants Active
          </Badge>
        </div>
      </div>

      {/* 9-Stage Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-72 rounded-2xl bg-slate-100/70 p-3 flex flex-col dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {stage}
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm dark:bg-dark-card dark:text-slate-300">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Candidates Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
                {stageCandidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    hoverEffect
                    onClick={() => setSelectedCandidate(candidate)}
                    className="p-4 cursor-pointer space-y-3 border-slate-200 dark:border-dark-border shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={candidate.avatar} name={candidate.name} size="sm" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {candidate.name}
                          </h4>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[120px]">
                            {candidate.jobTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        <Star className="h-3 w-3 fill-amber-500" /> {candidate.rating}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <p>Exp: <span className="font-medium text-slate-700 dark:text-slate-300">{candidate.experienceYears} Years</span> • {candidate.currentCompany || 'Freelance'}</p>
                      <p>Expected: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{candidate.expectedSalary}</span></p>
                    </div>

                    {/* Quick Stage Mover */}
                    <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Move to:</span>
                      <select
                        value={candidate.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleMoveStage(candidate.id, e.target.value as CandidateStage)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-dark-border dark:bg-dark-card dark:text-slate-200"
                      >
                        {stages.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                    No candidates in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title={`Candidate Profile — ${selectedCandidate.name}`}
          description={`Applied for ${selectedCandidate.jobTitle}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => setIsInterviewModalOpen(true)} leftIcon={<Video className="h-4 w-4" />}>
                Schedule Next Interview
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs">
            {/* Header snippet */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Avatar src={selectedCandidate.avatar} name={selectedCandidate.name} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedCandidate.name}</h3>
                  <p className="text-slate-500">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                </div>
              </div>
              <Badge variant="primary" size="md">{selectedCandidate.stage}</Badge>
            </div>

            {/* Candidate Evaluation Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-dark-border">
                <span className="text-slate-400 block mb-0.5">Experience</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedCandidate.experienceYears} Years</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-dark-border">
                <span className="text-slate-400 block mb-0.5">Expected Salary</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{selectedCandidate.expectedSalary}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-dark-border">
                <span className="text-slate-400 block mb-0.5">Notice Period</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedCandidate.noticePeriod}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Recruiter Evaluation Notes</span>
              <p className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-700 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-slate-300 leading-relaxed">
                {selectedCandidate.notes}
              </p>
            </div>

            {/* Scheduled Interviews */}
            {selectedCandidate.interviews && selectedCandidate.interviews.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Scheduled Rounds</span>
                {selectedCandidate.interviews.map((int) => (
                  <div key={int.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-dark-border">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white">{int.stage}</p>
                      <p className="text-slate-400">Interviewer: {int.interviewerName} • {formatDate(int.date)} at {int.time}</p>
                    </div>
                    <a href={int.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                      Join Video Call →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        title="Schedule Interview Round"
        description={`Configure date, time, and interviewer for ${selectedCandidate?.name}`}
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleScheduleInterview}>
              Confirm Interview Slot
            </Button>
          </>
        }
      >
        {scheduledSuccess ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white">Interview Scheduled!</p>
            <p className="text-xs text-slate-500">Google Meet invite sent to {selectedCandidate?.email}.</p>
          </div>
        ) : (
          <form onSubmit={handleScheduleInterview} className="space-y-4">
            <Select
              label="Interview Stage"
              value={interviewStage}
              onChange={(e) => setInterviewStage(e.target.value)}
              options={[
                { value: 'Technical Coding Round', label: 'Technical Coding Round' },
                { value: 'System Architecture Round', label: 'System Architecture Round' },
                { value: 'HR & Cultural Alignment', label: 'HR & Cultural Alignment' },
                { value: 'Executive Leadership Discussion', label: 'Executive Leadership Discussion' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
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
                placeholder="02:00 PM"
                required
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
