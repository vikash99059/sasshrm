import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { ShiftSchedule } from '../../types';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';
import { Clock, Plus, Sparkles } from 'lucide-react';

export const ShiftSchedulePage: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftSchedule[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await attendanceService.getShiftSchedules();
      setShifts(list);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shift Management & Work Schedules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define organizational shift timings, grace periods, and break allowances.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Create New Shift
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shifts.map((shift) => (
          <Card key={shift.id} hoverEffect className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold"
                  style={{ backgroundColor: shift.color }}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{shift.name}</h3>
              </div>
              <Badge variant="primary">Active</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Shift Hours:</span>
                <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Break Duration:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shift.breakDurationMinutes} mins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Late Grace Window:</span>
                <span className="font-semibold text-amber-600">
                  {shift.graceTimeMinutes} mins
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
