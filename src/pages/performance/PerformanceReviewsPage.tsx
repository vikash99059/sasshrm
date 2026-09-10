import React, { useState } from 'react';
import {
  Target,
  Award,
  Star,
  Users,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';

interface ReviewCycleItem {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  designation: string;
  department: string;
  reviewerName: string;
  cycle: string;
  rating: number; // 1-5
  status: 'Completed' | 'In Review' | 'Self Appraisal Due';
  submissionDate: string;
  feedbackSummary: string;
}

export const PerformanceReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cycleFilter, setCycleFilter] = useState('H1 2024');
  const [isNewCycleOpen, setIsNewCycleOpen] = useState(false);

  const reviews: ReviewCycleItem[] = [
    { id: 'REV-01', employeeName: 'Sarah Wilson', employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', designation: 'Senior Product Designer', department: 'Marketing', reviewerName: 'David Miller', cycle: 'H1 2024', rating: 4.8, status: 'Completed', submissionDate: 'May 15, 2024', feedbackSummary: 'Exceptional UX execution on SaaS redesign, strong cross-functional leadership.' },
    { id: 'REV-02', employeeName: 'Elena Rostova', employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', designation: 'Design Director', department: 'Product', reviewerName: 'Alex Johnson', cycle: 'H1 2024', rating: 4.6, status: 'Completed', submissionDate: 'May 12, 2024', feedbackSummary: 'Solid product strategy, excellent mentorship of junior design team.' },
    { id: 'REV-03', employeeName: 'Marcus Vance', employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', designation: 'Operations Specialist', department: 'Operations', reviewerName: 'Rachel Green', cycle: 'H1 2024', rating: 4.2, status: 'In Review', submissionDate: 'May 18, 2024', feedbackSummary: 'Streamlined vendor onboarding workflows, positive attitude.' },
    { id: 'REV-04', employeeName: 'James Wilson', employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', designation: 'VP of Sales', department: 'Sales', reviewerName: 'Alexander Wright', cycle: 'H1 2024', rating: 4.9, status: 'Completed', submissionDate: 'May 10, 2024', feedbackSummary: 'Exceeded enterprise revenue target by 24%, closed major accounts.' },
    { id: 'REV-05', employeeName: 'Chloe Davis', employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', designation: 'Account Executive', department: 'Sales', reviewerName: 'James Wilson', cycle: 'H1 2024', rating: 0, status: 'Self Appraisal Due', submissionDate: 'Pending', feedbackSummary: 'Self-assessment form awaiting submission before manager meeting.' },
  ];

  const filtered = reviews.filter(r => {
    return r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || r.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              360° Performance Reviews
            </h1>
            <Badge variant="primary">{cycleFilter} Active Cycle</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conduct bi-annual appraisals, 360 peer feedback, competency evaluations, and manager ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setIsNewCycleOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Launch Review Cycle
          </Button>
        </div>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Organization Rating</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            4.62 <span className="text-amber-400 text-lg">★</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+0.15 vs H2 2023</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Reviews Completed</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            78.5%
          </div>
          <span className="text-xs text-slate-400">194 of 248 Submitted</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Top Performers</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            42 Employees
          </div>
          <span className="text-xs text-slate-400">Rated 4.8 or above</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Pending Submissions</span>
          <div className="text-2xl font-black text-amber-500 mt-2">
            54
          </div>
          <span className="text-xs text-amber-600 font-medium">Cycle closes May 31</span>
        </div>
      </div>

      {/* Search & Cycle Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee, department or reviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="H1 2024">Review Cycle: H1 2024 (Active)</option>
          <option value="Annual 2023">Review Cycle: Annual 2023 (Archived)</option>
        </select>
      </div>

      {/* Review Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Score / Rating</th>
                <th className="py-3.5 px-4">Appraisal Status</th>
                <th className="py-3.5 px-4">Feedback Excerpt</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={rev.employeeAvatar} alt={rev.employeeName} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{rev.employeeName}</div>
                        <div className="text-slate-400 text-[11px]">{rev.designation} · {rev.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{rev.reviewerName}</td>
                  <td className="py-4 px-4">
                    {rev.rating > 0 ? (
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                        <span>{rev.rating.toFixed(1)}</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not rated yet</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rev.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      rev.status === 'In Review' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={rev.feedbackSummary}>
                    {rev.feedbackSummary}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View Review <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Cycle Modal */}
      <Modal
        isOpen={isNewCycleOpen}
        onClose={() => setIsNewCycleOpen(false)}
        title="Launch New Performance Review Cycle"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsNewCycleOpen(false); }} className="space-y-4">
          <Input label="Cycle Name / Title" defaultValue="H2 2024 Appraisal Cycle" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" defaultValue="2024-06-01" required />
            <Input label="Submission Deadline" type="date" defaultValue="2024-06-30" required />
          </div>
          <Select
            label="Evaluation Template"
            options={[
              { value: '360', label: '360° Peer, Self & Manager Appraisal' },
              { value: 'manager_only', label: 'Manager Direct Assessment' },
              { value: 'okr_based', label: 'Quarterly OKR & Goal Scoring' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsNewCycleOpen(false)}>Cancel</Button>
            <Button type="submit">Launch Appraisal Cycle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default PerformanceReviewsPage;
