import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import {
  Bell,
  CheckCircle2,
  Clock,
  UserPlus,
  FileText,
  Calendar,
  Award,
  CreditCard,
  UserCheck,
  Filter,
  Check,
  ExternalLink,
} from 'lucide-react';

interface RecruiterNotificationItem {
  id: string;
  type:
    | 'application'
    | 'requisition'
    | 'interview'
    | 'evaluation'
    | 'offer'
    | 'joining'
    | 'document'
    | 'handover';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
  actionText: string;
}

const INITIAL_NOTIFICATIONS: RecruiterNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'application',
    title: 'New High-Match Application Received',
    description: 'Jordan Mitchell applied for Senior Full Stack Engineer with 94% skills alignment.',
    time: '15 minutes ago',
    read: false,
    link: '/recruiter/applications?tab=new',
    actionText: 'Review Application',
  },
  {
    id: 'notif-2',
    type: 'requisition',
    title: 'Job Requisition REQ-2025-102 Approved',
    description: 'VP Operations approved requisition for Lead Product Designer (2 headcount).',
    time: '1 hour ago',
    read: false,
    link: '/recruiter/requisitions?tab=approved',
    actionText: 'Publish Job',
  },
  {
    id: 'notif-3',
    type: 'interview',
    title: 'Interview Reminder: Technical Coding Round',
    description: 'Sarah Jenkins panel interview with David Miller starts in 45 minutes.',
    time: '2 hours ago',
    read: false,
    link: '/recruiter/interviews',
    actionText: 'Open Meet Link',
  },
  {
    id: 'notif-4',
    type: 'evaluation',
    title: 'Candidate Evaluation Pending Submission',
    description: 'Alex Rivera completed final round with Marcus Vance. Evaluation scorecard awaiting review.',
    time: '4 hours ago',
    read: false,
    link: '/recruiter/evaluations?tab=pending',
    actionText: 'Complete Evaluation',
  },
  {
    id: 'notif-5',
    type: 'offer',
    title: 'Offer Accepted: Liam Foster',
    description: 'Liam Foster formally accepted offer OFF-2025-02 ($142,000/yr). Start date: July 15.',
    time: 'Yesterday',
    read: true,
    link: '/recruiter/offers?tab=accepted',
    actionText: 'View Acceptance',
  },
  {
    id: 'notif-6',
    type: 'handover',
    title: 'Candidate Handover to HR Required',
    description: 'Liam Foster has 7 of 7 pre-employment checks satisfied and is ready for HR onboarding.',
    time: 'Yesterday',
    read: true,
    link: '/recruiter/handover?tab=ready',
    actionText: 'Proceed to Handover',
  },
  {
    id: 'notif-7',
    type: 'document',
    title: 'Tax & Identification Documents Pending',
    description: 'Elena Rostova requested tax certificate from Priya Patel for joining confirmation.',
    time: '2 days ago',
    read: true,
    link: '/recruiter/handover?tab=documents',
    actionText: 'Check Documents',
  },
  {
    id: 'notif-8',
    type: 'joining',
    title: 'Joining Orientation Reminder: July 1',
    description: 'Sarah Jenkins orientation day confirmed with IT Support and Engineering lead.',
    time: '3 days ago',
    read: true,
    link: '/recruiter/handover?tab=confirmed',
    actionText: 'View Orientation Schedule',
  },
];

export const RecruiterNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<RecruiterNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: RecruiterNotificationItem['type']) => {
    switch (type) {
      case 'application':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'requisition':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'evaluation':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'offer':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'handover':
      case 'joining':
        return <UserCheck className="w-4 h-4 text-teal-600" />;
      case 'document':
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600" />
            Recruitment Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time pipeline notifications, interview milestones, requisition approvals and onboarding triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={markAllRead}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Mark All as Read
            </Button>
          )}

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeFilter === 'unread'
                  ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="border border-slate-200/80 dark:border-dark-border divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-white dark:bg-dark-card">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
              !item.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-dark-border mt-0.5">
                {getIcon(item.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                  {item.description}
                </p>
                <p className="text-[10px] font-mono text-slate-400">{item.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Link to={item.link}>
                <Button variant="primary" size="sm" className="text-xs font-semibold">
                  {item.actionText}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRead(item.id)}
                className="text-[11px] text-slate-500 hover:text-slate-900"
              >
                {item.read ? 'Mark Unread' : 'Mark Read'}
              </Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications matching your filter.
          </div>
        )}
      </Card>
    </div>
  );
};
