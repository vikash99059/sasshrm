import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Palmtree,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Download
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'Public Holiday' | 'Company Observance' | 'Optional / Floating';
  location: string;
  isUpcoming: boolean;
}

export const HolidaysPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const holidays: HolidayItem[] = [
    { id: 'H1', name: "New Year's Day", date: 'Jan 01, 2024', day: 'Monday', type: 'Public Holiday', location: 'Global / All Offices', isUpcoming: false },
    { id: 'H2', name: 'Martin Luther King Jr. Day', date: 'Jan 15, 2024', day: 'Monday', type: 'Public Holiday', location: 'US Offices', isUpcoming: false },
    { id: 'H3', name: 'Presidents Day', date: 'Feb 19, 2024', day: 'Monday', type: 'Optional / Floating', location: 'US Offices', isUpcoming: false },
    { id: 'H4', name: 'Good Friday', date: 'Mar 29, 2024', day: 'Friday', type: 'Public Holiday', location: 'Global / All Offices', isUpcoming: false },
    { id: 'H5', name: 'Memorial Day', date: 'May 27, 2024', day: 'Monday', type: 'Public Holiday', location: 'Global / All Offices', isUpcoming: true },
    { id: 'H6', name: 'Juneteenth National Independence', date: 'Jun 19, 2024', day: 'Wednesday', type: 'Public Holiday', location: 'US Offices', isUpcoming: true },
    { id: 'H7', name: 'Independence Day', date: 'Jul 04, 2024', day: 'Thursday', type: 'Public Holiday', location: 'US Offices', isUpcoming: true },
    { id: 'H8', name: 'Company Founder Day', date: 'Aug 14, 2024', day: 'Wednesday', type: 'Company Observance', location: 'Global / All Offices', isUpcoming: true },
    { id: 'H9', name: 'Labor Day', date: 'Sep 02, 2024', day: 'Monday', type: 'Public Holiday', location: 'Global / All Offices', isUpcoming: true },
    { id: 'H10', name: 'Thanksgiving Day', date: 'Nov 28, 2024', day: 'Thursday', type: 'Public Holiday', location: 'US Offices', isUpcoming: true },
    { id: 'H11', name: 'Day After Thanksgiving', date: 'Nov 29, 2024', day: 'Friday', type: 'Company Observance', location: 'US Offices', isUpcoming: true },
    { id: 'H12', name: 'Christmas Day', date: 'Dec 25, 2024', day: 'Wednesday', type: 'Public Holiday', location: 'Global / All Offices', isUpcoming: true },
  ];

  const upcomingCount = holidays.filter(h => h.isUpcoming).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Company Holiday Calendar
            </h1>
            <Badge variant="primary">{holidays.length} Days in {selectedYear}</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official paid public holidays, regional observances, and floating time-off schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="2024">Calendar 2024</option>
            <option value="2025">Calendar 2025</option>
          </select>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Holiday
          </Button>
        </div>
      </div>

      {/* Next Upcoming Holiday Highlight Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Next Upcoming Holiday
          </div>
          <h2 className="text-2xl font-black tracking-tight">Memorial Day — May 27, 2024 (Monday)</h2>
          <p className="text-blue-100 text-xs max-w-xl">
            Paid public holiday observed across all offices. Support desks will operate on emergency on-call schedule.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20 backdrop-blur-xs">
            <span className="text-2xl font-black block leading-none">{upcomingCount}</span>
            <span className="text-[11px] text-blue-200 font-medium">Holidays Left</span>
          </div>
        </div>
      </div>

      {/* Holidays List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((h) => (
          <div
            key={h.id}
            className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs transition-all ${
              h.isUpcoming
                ? 'border-blue-200 dark:border-blue-900/50 hover:shadow-md'
                : 'border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  h.type === 'Public Holiday' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' :
                  h.type === 'Company Observance' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' :
                  'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                }`}>
                  {h.type}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{h.name}</h3>
              </div>

              {h.isUpcoming ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg">
                  <Clock className="w-3 h-3" /> Upcoming
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Passed</span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                {h.date} ({h.day})
              </div>
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {h.location}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Company Holiday"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }} className="space-y-4">
          <Input label="Holiday Title / Name" placeholder="e.g. Labor Day" required />
          <Input label="Holiday Date" type="date" defaultValue="2024-09-02" required />
          <Select
            label="Holiday Type"
            options={[
              { value: 'public', label: 'Public Holiday (Mandatory Paid)' },
              { value: 'company', label: 'Company Observance' },
              { value: 'floating', label: 'Optional / Floating Holiday' },
            ]}
          />
          <Select
            label="Office Scope"
            options={[
              { value: 'all', label: 'Global / All Offices' },
              { value: 'us', label: 'US Offices Only' },
              { value: 'eu', label: 'EU Offices Only' },
              { value: 'apac', label: 'APAC Offices Only' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Holiday</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default HolidaysPage;
