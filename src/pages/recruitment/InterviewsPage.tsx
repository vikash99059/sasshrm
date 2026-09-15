import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, Interview } from '../../types';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  Avatar,
} from '../../components/ui';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Send,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '../../utils';

type ViewMode = 'month' | 'week' | 'day' | 'table';

export const InterviewsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'upcoming';
  const actionParam = searchParams.get('action');

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(actionParam === 'schedule');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<
    (Interview & { candidateName: string; jobTitle: string; candidateAvatar?: string }) | null
  >(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [candidateId, setCandidateId] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [interviewerName, setInterviewerName] = useState('David Miller');
  const [interviewDate, setInterviewDate] = useState('2025-06-26');
  const [interviewTime, setInterviewTime] = useState('03:00 PM');
  const [rescheduleDate, setRescheduleDate] = useState('2025-06-28');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getCandidates();
    setCandidates(list);
    if (list.length > 0 && !candidateId) {
      setCandidateId(list[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const allInterviews = candidates.flatMap((c) =>
    (c.interviews || []).map((i) => ({
      ...i,
      candidateName: c.name,
      jobTitle: c.jobTitle,
      candidateAvatar: c.avatar,
      candidateEmail: c.email,
    }))
  );

  const filteredInterviews = allInterviews.filter((i) => {
    if (currentTab === 'upcoming') return i.status === 'Scheduled';
    if (currentTab === 'completed') return i.status === 'Completed';
    if (currentTab === 'cancelled') return i.status === 'Cancelled';
    return true;
  });

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId) return;

    await recruitmentService.scheduleInterview(candidateId, {
      stage: `${interviewType} Round`,
      date: interviewDate,
      time: interviewTime,
      interviewerName,
      meetingLink: 'https://meet.google.com/xyz-hrm-meet',
    });

    setIsScheduleModalOpen(false);
    showToast(`Interview scheduled with candidate for ${interviewDate}`);
    loadData();
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    // Reschedule in candidate interview list
    const candidate = candidates.find((c) =>
      c.interviews?.some((iv) => iv.id === selectedInterview.id)
    );
    if (candidate) {
      await recruitmentService.scheduleInterview(candidate.id, {
        stage: selectedInterview.stage,
        date: rescheduleDate,
        time: rescheduleTime,
        interviewerName: selectedInterview.interviewerName,
        meetingLink: selectedInterview.meetingLink,
      });
      await recruitmentService.updateInterviewStatus(selectedInterview.id, 'Cancelled');
    }

    setIsRescheduleModalOpen(false);
    showToast('Interview successfully rescheduled and notifications sent');
    loadData();
  };

  const handleStatusUpdate = async (
    interviewId: string,
    status: Interview['status']
  ) => {
    await recruitmentService.updateInterviewStatus(interviewId, status);
    showToast(`Interview marked as ${status}`);
    loadData();
  };

  const handleSendNotification = (interview: any) => {
    showToast(`Calendar invites & reminders sent to ${interview.candidateName} and ${interview.interviewerName}`);
  };

  const columns: Column<any>[] = [
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
      header: 'Round / Type',
      accessorKey: 'stage',
      cell: (row) => (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          {row.stage}
        </span>
      ),
    },
    {
      header: 'Interviewer',
      accessorKey: 'interviewerName',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <User className="w-3 h-3 text-slate-400" />
          {row.interviewerName}
        </div>
      ),
    },
    {
      header: 'Date & Time',
      cell: (row) => (
        <div className="text-xs font-mono font-medium">
          <p className="text-slate-800 dark:text-slate-200">{formatDate(row.date)}</p>
          <p className="text-[10px] text-slate-400">{row.time}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        let variant: 'success' | 'warning' | 'danger' = 'warning';
        if (row.status === 'Completed') variant = 'success';
        if (row.status === 'Cancelled') variant = 'danger';
        return (
          <Badge variant={variant} size="sm">
            {row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Meeting Link',
      cell: (row) => (
        <a
          href={row.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition"
        >
          <Video className="w-3.5 h-3.5" /> Join Meet
        </a>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'Scheduled' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusUpdate(row.id, 'Completed')}
                title="Mark Completed"
                className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedInterview(row);
                  setIsRescheduleModalOpen(true);
                }}
                title="Reschedule Interview"
                className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Clock className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusUpdate(row.id, 'Cancelled')}
                title="Cancel Interview"
                className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSendNotification(row)}
            title="Send Notification & Reminder"
            className="h-7 w-7 p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Send className="w-3.5 h-3.5" />
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Interview Management & Panel Schedules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronize panel interviews, video conferencing links, reminders and stage completions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {(['table', 'month', 'week', 'day'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md capitalize transition ${
                  viewMode === mode
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsScheduleModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'upcoming', label: 'Upcoming Interviews', count: allInterviews.filter((i) => i.status === 'Scheduled').length },
          { key: 'completed', label: 'Completed Interviews', count: allInterviews.filter((i) => i.status === 'Completed').length },
          { key: 'cancelled', label: 'Cancelled Interviews', count: allInterviews.filter((i) => i.status === 'Cancelled').length },
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

      {/* Calendar or Table View */}
      {viewMode === 'table' ? (
        <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredInterviews}
            searchKey="candidateName"
            searchPlaceholder="Search interview candidate, role or interviewer..."
            pageSize={8}
          />
        </Card>
      ) : (
        /* Visual Calendar Simulation (Month/Week/Day) */
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                June 2025
              </span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Badge variant="primary" size="sm">
              Current Timezone: America/Los_Angeles (PDT)
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredInterviews.map((iv) => (
              <Card
                key={iv.id}
                className="p-4 border border-slate-200/80 dark:border-dark-border bg-white dark:bg-dark-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={iv.status === 'Completed' ? 'success' : 'primary'} size="sm">
                    {iv.stage}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {iv.time}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar src={iv.candidateAvatar} name={iv.candidateName} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {iv.candidateName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{iv.jobTitle}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Panelist: <span className="font-semibold text-slate-800 dark:text-slate-200">{iv.interviewerName}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    Date: <span className="font-mono">{formatDate(iv.date)}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <Video className="w-3.5 h-3.5" /> Video Meet
                  </a>

                  {iv.status === 'Scheduled' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusUpdate(iv.id, 'Completed')}
                      className="text-[11px] h-7 px-2"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Interview Session"
        size="md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Select
            label="Candidate"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            options={candidates.map((c) => ({
              label: `${c.name} (${c.jobTitle})`,
              value: c.id,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Interview Type"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              options={[
                { label: 'Initial Phone Screen', value: 'Phone' },
                { label: 'Technical Coding Round', value: 'Technical' },
                { label: 'System Design / Architecture', value: 'Technical' },
                { label: 'Hiring Manager Discussion', value: 'Managerial' },
                { label: 'HR & Cultural Alignment', value: 'HR' },
                { label: 'Final Executive Review', value: 'Final' },
              ]}
            />

            <Input
              label="Lead Interviewer"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Interview Date"
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
            />
            <Input
              label="Time (e.g. 02:00 PM)"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              required
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Meeting Integration: Google Meet / Calendar
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              An automated calendar invite with video link will be sent to the candidate and panelist.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
            <Button variant="secondary" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Schedule & Dispatch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      {selectedInterview && (
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title={`Reschedule Interview: ${selectedInterview.candidateName}`}
          size="sm"
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <Input
              label="New Interview Date"
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              required
            />

            <Input
              label="New Time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
