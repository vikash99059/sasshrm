import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Bell,
  CheckCheck,
  CalendarDays,
  DollarSign,
  Clock,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const NotificationsDrawer: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  const navigate = useNavigate();

  if (!notificationsOpen) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'leave':
        return <CalendarDays className="h-4 w-4 text-purple-600" />;
      case 'payroll':
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'attendance':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'interview':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.actionUrl) {
      setNotificationsOpen(false);
      navigate(item.actionUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setNotificationsOpen(false)}
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl dark:border-l dark:border-dark-border dark:bg-dark-card flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-dark-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {notifications.filter((n) => !n.isRead).length} unread updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-dark-border p-2">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={cn(
                  'group flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors',
                  item.isRead
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-80'
                    : 'bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40'
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/60 dark:bg-dark-card dark:ring-dark-border">
                  {getIconForType(item.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.timestamp}</span>
                    {item.actionUrl && (
                      <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                        View <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-100 p-4 text-center dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/40">
            <button
              onClick={() => {
                setNotificationsOpen(false);
                navigate('/settings');
              }}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400"
            >
              Configure Notification Preferences →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
