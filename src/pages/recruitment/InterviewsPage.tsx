import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../services/recruitmentService';
import { Candidate, Interview } from '../../types';
import { Card, CardHeader, CardTitle, Button, Badge, DataTable, Column } from '../../components/ui';
import { Calendar, Video, Clock, User, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils';

export const InterviewsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await recruitmentService.getCandidates();
      setCandidates(list);
    };
    load();
  }, []);

  const allInterviews: (Interview & { email: string })[] = candidates.flatMap((c) =>
    (c.interviews || []).map((i) => ({ ...i, email: c.email }))
  );

  const columns: Column<Interview & { email: string }>[] = [
    {
      header: 'Candidate',
      accessorKey: 'candidateName',
      cell: (row) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{row.candidateName}</p>
          <p className="text-[10px] text-slate-400">{row.jobTitle}</p>
        </div>
      ),
    },
    {
      header: 'Stage / Round',
      accessorKey: 'stage',
      cell: (row) => <span className="text-xs font-semibold text-blue-600">{row.stage}</span>,
    },
    {
      header: 'Interviewer',
      accessorKey: 'interviewerName',
      cell: (row) => <span className="text-xs text-slate-700 dark:text-slate-300">{row.interviewerName}</span>,
    },
    {
      header: 'Date & Time',
      cell: (row) => (
        <span className="text-xs font-medium font-mono">{formatDate(row.date)} at {row.time}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <Badge variant="warning" size="sm">Scheduled</Badge>,
    },
    {
      header: 'Meeting Link',
      cell: (row) => (
        <a
          href={row.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
        >
          <Video className="h-3.5 w-3.5" /> Join Meet
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scheduled Interviews Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage video conferencing rounds, interview panelists, and candidate evaluations.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={allInterviews}
        searchKey="candidateName"
        searchPlaceholder="Search interviews..."
        pageSize={6}
      />
    </div>
  );
};
