import { AttendanceRecord, ShiftSchedule } from '../types';
import { INITIAL_ATTENDANCE } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const attendanceService = {
  getRecords: async (_orgId: string = 'org-1'): Promise<AttendanceRecord[]> => {
    return getFromStorage<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
  },

  getTodayStats: async () => {
    const records = await attendanceService.getRecords();
    const total = 124;
    const present = records.filter(r => r.status === 'Present').length + 110;
    const absent = 4;
    const late = records.filter(r => r.status === 'Late').length + 5;
    const onLeave = 8;
    const halfDay = 3;
    const wfh = 5;
    return {
      total,
      present,
      absent,
      late,
      onLeave,
      halfDay,
      wfh,
      percentage: Math.round((present / total) * 100),
    };
  },

  clockIn: async (employeeId: string, employeeName: string, avatar: string, department: string): Promise<AttendanceRecord> => {
    const records = getFromStorage<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
    
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      organizationId: 'org-1',
      employeeId,
      employeeName,
      employeeAvatar: avatar,
      department,
      date: now.toISOString().split('T')[0],
      clockIn: timeStr,
      clockOut: '--:--',
      workingHours: 0,
      breakHours: 0,
      overtimeHours: 0,
      status: isLate ? 'Late' : 'Present',
      location: 'Web App Check-In',
    };
    
    const existingIndex = records.findIndex(r => r.employeeId === employeeId && r.date === newRecord.date);
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...newRecord };
    } else {
      records.unshift(newRecord);
    }
    
    saveToStorage('attendance', records);
    saveToStorage(`active_clockin_${employeeId}`, { clockInTime: now.toISOString(), active: true });
    return newRecord;
  },

  clockOut: async (employeeId: string): Promise<AttendanceRecord | null> => {
    const records = getFromStorage<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];
    
    const index = records.findIndex(r => r.employeeId === employeeId && r.date === todayStr);
    if (index >= 0) {
      records[index].clockOut = timeStr;
      records[index].workingHours = 8.5;
      saveToStorage('attendance', records);
      localStorage.removeItem(`hrm_active_clockin_${employeeId}`);
      return records[index];
    }
    return null;
  },

  getShiftSchedules: async (): Promise<ShiftSchedule[]> => {
    return [
      { id: 'shift-1', organizationId: 'org-1', name: 'Regular General Shift', startTime: '09:00 AM', endTime: '06:00 PM', breakDurationMinutes: 60, graceTimeMinutes: 15, color: '#3B82F6' },
      { id: 'shift-2', organizationId: 'org-1', name: 'Morning Early Shift', startTime: '07:00 AM', endTime: '04:00 PM', breakDurationMinutes: 60, graceTimeMinutes: 15, color: '#10B981' },
      { id: 'shift-3', organizationId: 'org-1', name: 'Evening Shift', startTime: '02:00 PM', endTime: '11:00 PM', breakDurationMinutes: 60, graceTimeMinutes: 15, color: '#8B5CF6' },
    ];
  }
};
