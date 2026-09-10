import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, Input, Select } from '../../components/ui';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Users,
  Cake,
  Award,
  Video,
  Coffee,
} from 'lucide-react';
import { cn } from '../../utils';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('May 2024');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Meeting');
  const [eventDate, setEventDate] = useState('2024-05-22');

  const events = [
    { day: 2, title: 'Sprint Retrospective', type: 'Meeting', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { day: 8, title: 'Aarav Patel Interview', type: 'Interview', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    { day: 14, title: 'Rahul Sharma Birthday 🎂', type: 'Birthday', color: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300' },
    { day: 18, title: 'Priya Singh Work Anniversary 🎖️', type: 'Anniversary', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { day: 21, title: 'Priya Singh (Casual Leave)', type: 'Leave', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    { day: 22, title: 'Priya Singh (Casual Leave)', type: 'Leave', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    { day: 22, title: 'Maya Chen Technical Round', type: 'Interview', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
    { day: 27, title: 'Memorial Day Holiday 🇺🇸', type: 'Holiday', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    { day: 31, title: 'May Payroll Disbursement 💰', type: 'Company', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
  ];

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter(e => e.type.toLowerCase() === activeFilter.toLowerCase());

  const daysGrid = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - 2; // Offset for May 2024 starting on Wednesday
    const isValidDay = dayNum >= 1 && dayNum <= 31;
    const dayEvents = isValidDay ? filteredEvents.filter(e => e.day === dayNum) : [];
    return { dayNum, isValidDay, dayEvents };
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Company Master Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unified view of leaves, public holidays, birthdays, anniversaries, and interview schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl dark:bg-slate-800 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={cn('px-3 py-1 font-semibold rounded-lg transition-colors', viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm dark:bg-dark-card' : 'text-slate-500')}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn('px-3 py-1 font-semibold rounded-lg transition-colors', viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm dark:bg-dark-card' : 'text-slate-500')}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={cn('px-3 py-1 font-semibold rounded-lg transition-colors', viewMode === 'agenda' ? 'bg-white text-blue-600 shadow-sm dark:bg-dark-card' : 'text-slate-500')}
            >
              Agenda
            </button>
          </div>

          <Button size="sm" onClick={() => setIsEventModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Add Event
          </Button>
        </div>
      </div>

      {/* Month Switcher & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentMonth}</h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'leave', label: 'Leaves' },
            { id: 'holiday', label: 'Holidays' },
            { id: 'birthday', label: 'Birthdays' },
            { id: 'interview', label: 'Interviews' },
            { id: 'meeting', label: 'Meetings' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'px-3 py-1 rounded-lg font-semibold transition-colors',
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-dark-card dark:border-dark-border dark:text-slate-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month Calendar Grid (Matching Reference) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-dark-border dark:bg-dark-card overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50/80 dark:bg-slate-900/50 text-center py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-dark-border">
          {daysGrid.map((cell, idx) => (
            <div
              key={idx}
              className={cn(
                'min-h-[110px] p-2 transition-colors',
                cell.isValidDay ? 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30' : 'bg-slate-50/30 dark:bg-slate-950/20 opacity-30 pointer-events-none'
              )}
            >
              {cell.isValidDay && (
                <div className="flex flex-col h-full justify-between">
                  <span
                    className={cn(
                      'text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1',
                      cell.dayNum === 20 ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Events list in day */}
                  <div className="space-y-1 flex-1 overflow-y-auto">
                    {cell.dayEvents.map((ev, eIdx) => (
                      <div
                        key={eIdx}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer hover:opacity-90',
                          ev.color
                        )}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Create Calendar Event"
        description="Schedule an organizational event, milestone, or meeting."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEventModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setIsEventModalOpen(false)}>
              Save Event
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Event Name"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="e.g. Q2 Product Roadmap Sync"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Event Type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              options={[
                { value: 'Meeting', label: 'Team Meeting' },
                { value: 'Company', label: 'Company Wide Event' },
                { value: 'Holiday', label: 'Public Holiday' },
                { value: 'Interview', label: 'Candidate Interview' },
              ]}
            />
            <Input
              label="Date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
