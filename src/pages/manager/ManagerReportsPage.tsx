import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge } from '../../components/ui';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
  Users,
  PieChart
} from 'lucide-react';
import { managerService } from '../../services/managerService';

export const ManagerReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month (September 2026)');
  const teamMembers = managerService.getTeamMembers();

  const handleExportCSV = (reportName: string) => {
    alert(`Generating & Exporting: ${reportName} (${selectedPeriod}) to CSV`);
  };

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Team Analytics & Management Reports"
        subtitle="Generate executive reports on team attendance punctuality, leave utilization, sprint velocity, overtime burnout index, and operational expense metrics."
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-xs backdrop-blur-md outline-none"
            >
              <option value="This Month (September 2026)" className="text-gray-900">This Month (September 2026)</option>
              <option value="Last Month (August 2026)" className="text-gray-900">Last Month (August 2026)</option>
              <option value="Current Quarter (Q3 2026)" className="text-gray-900">Current Quarter (Q3 2026)</option>
              <option value="Year-to-Date (2026)" className="text-gray-900">Year-to-Date (2026)</option>
            </select>
          </div>
        }
      />

      {/* Top 4 Performance Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Punctuality Index</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">96.8%</p>
          <p className="text-xs text-gray-400 mt-1">+1.4% improvement from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Sprint Velocity</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">92.4%</p>
          <p className="text-xs text-gray-400 mt-1">42 of 45 story tasks delivered</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Overtime Burnout Risk</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">Low (8.5h)</p>
          <p className="text-xs text-gray-400 mt-1">Well within safe 20h limit</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Leave Utilization</span>
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">14.2%</p>
          <p className="text-xs text-gray-400 mt-1">Balanced availability coverage</p>
        </div>
      </div>

      {/* Available Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="info" size="sm">Monthly / Daily</Badge>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              Team Attendance & Punctuality Audit
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive breakdown of daily check-ins, late punch arrivals, early departures, missing punches, and biometric logs for all direct reports.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-400">PDF / CSV Export</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCSV('Attendance_Punctuality_Report')}
            >
              <Download className="h-4 w-4 mr-1.5" /> Export Report
            </Button>
          </div>
        </div>

        {/* Report 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="neutral" size="sm">Leave Ledger</Badge>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              Leave Utilization & Balance Report
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Complete tally of annual, casual, and sick leaves taken, remaining balance allowances, leave encashment calculations, and absence frequency.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-400">PDF / CSV Export</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCSV('Leave_Utilization_Report')}
            >
              <Download className="h-4 w-4 mr-1.5" /> Export Report
            </Button>
          </div>
        </div>

        {/* Report 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="success" size="sm">Productivity</Badge>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              Task Velocity & OKR Completion Scorecard
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sprint deliverables breakdown, average task turn-around time (TAT), priority ticket resolution rate, and quarterly OKR milestones completion percentage.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-400">PDF / CSV Export</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCSV('Task_Productivity_Report')}
            >
              <Download className="h-4 w-4 mr-1.5" /> Export Report
            </Button>
          </div>
        </div>

        {/* Report 4 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-amber-600" />
              </div>
              <Badge variant="warning" size="sm">Financials</Badge>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              Team Expense & Overtime Cost Statement
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aggregated financial statement of team travel, software tools, client hospitality reimbursements, and billable overtime disbursements.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-gray-400">PDF / CSV Export</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportCSV('Expense_Overtime_Statement')}
            >
              <Download className="h-4 w-4 mr-1.5" /> Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
