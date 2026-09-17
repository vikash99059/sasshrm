import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge, Modal } from '../../components/ui';
import {
  Wallet,
  Clock,
  TrendingUp,
  Gift,
  Plus,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  managerService,
  BonusHikeProposal,
  TeamMember
} from '../../services/managerService';

export const ManagerPayrollCompPage: React.FC = () => {
  const [proposals, setProposals] = useState<BonusHikeProposal[]>(
    managerService.getBonusHikeProposals()
  );
  const teamMembers = managerService.getTeamMembers();
  const overtimeLogs = managerService.getTeamOvertime();

  // Modal
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    employeeId: teamMembers[0]?.id || '',
    type: 'Bonus' as BonusHikeProposal['type'],
    amount: 1500,
    justification: '',
    effectiveCycle: 'Q4 2026'
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = teamMembers.find((m) => m.id === newProposal.employeeId);
    if (!emp || !newProposal.justification) return;

    const created = managerService.createBonusHikeProposal({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      type: newProposal.type,
      proposedHikePercentage: newProposal.type === 'Hike' ? Number(newProposal.amount) : undefined,
      proposedBonusAmount: newProposal.type === 'Bonus' || newProposal.type === 'Incentive' ? Number(newProposal.amount) : undefined,
      justification: newProposal.justification,
      effectiveCycle: newProposal.effectiveCycle,
      status: 'Pending-HR-Approval',
      submissionDate: 'Today'
    });

    setProposals([created, ...proposals]);
    setIsProposalModalOpen(false);
    setNewProposal({
      employeeId: teamMembers[0]?.id || '',
      type: 'Bonus',
      amount: 1500,
      justification: '',
      effectiveCycle: 'Q4 2026'
    });
  };

  const totalOvertimePayoutApproved = overtimeLogs
    .filter((o) => o.status === 'Approved')
    .reduce((sum, o) => sum + o.payoutEstimate, 0);

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Team Payroll & Compensation Hub"
        subtitle="Role-governed compensation workspace: oversee team overtime disbursements, propose performance bonuses, and submit salary increment recommendations to HR."
        actions={
          <div className="flex items-center gap-3">
            <Button
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold"
              onClick={() => setIsProposalModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Propose Bonus / Hike
            </Button>
          </div>
        }
      />

      {/* Role Access Notice */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div className="text-xs text-emerald-900 dark:text-emerald-200">
          <strong>Managerial Access Shield:</strong> Base salary structures are securely managed by Central HR & Payroll. Managers have authority over variable compensation, overtime authorizations, and merit recommendations.
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Approved Overtime Payouts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ${totalOvertimePayoutApproved.toFixed(2)}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Ready for next payroll cycle</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Active Bonus Proposals
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {proposals.filter((p) => p.status === 'Pending-HR-Approval').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Under review with HR Compensation</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
            <Gift className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Merit Hikes Proposed
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {proposals.filter((p) => p.type === 'Hike').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">For annual performance appraisal</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Merit Hike & Bonus Recommendations
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Proposals forwarded to Executive Management & HR for payroll inclusion
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={prop.employeeAvatar}
                  alt={prop.employeeName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      {prop.employeeName}
                    </h4>
                    <Badge
                      variant={
                        prop.type === 'Hike'
                          ? 'success'
                          : prop.type === 'Bonus'
                          ? 'info'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {prop.type} Recommendation
                    </Badge>
                    <Badge
                      variant={
                        prop.status === 'Approved'
                          ? 'success'
                          : prop.status === 'Rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {prop.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Proposal:</strong>{' '}
                    {prop.type === 'Hike'
                      ? `+${prop.proposedHikePercentage}% Base Salary Revision`
                      : `$${prop.proposedBonusAmount?.toLocaleString()} Discretionary ${prop.type}`}{' '}
                    • Effective: <strong>{prop.effectiveCycle}</strong>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                    "{prop.justification}"
                  </p>
                </div>
              </div>

              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-gray-400 block">Submitted {prop.submissionDate}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  Manager Endorsed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Proposal Modal */}
      <Modal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        title="Propose Variable Bonus or Salary Hike"
      >
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Direct Report
            </label>
            <select
              value={newProposal.employeeId}
              onChange={(e) =>
                setNewProposal({ ...newProposal, employeeId: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Proposal Type
              </label>
              <select
                value={newProposal.type}
                onChange={(e) =>
                  setNewProposal({
                    ...newProposal,
                    type: e.target.value as BonusHikeProposal['type']
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Bonus">Quarterly / Milestone Bonus ($)</option>
                <option value="Incentive">Performance Incentive ($)</option>
                <option value="Hike">Annual Salary Hike (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {newProposal.type === 'Hike' ? 'Hike Percentage (%)' : 'Amount ($)'}
              </label>
              <input
                type="number"
                step={newProposal.type === 'Hike' ? '0.5' : '100'}
                min="1"
                value={newProposal.amount}
                onChange={(e) =>
                  setNewProposal({ ...newProposal, amount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Effective Cycle
            </label>
            <input
              type="text"
              value={newProposal.effectiveCycle}
              onChange={(e) =>
                setNewProposal({ ...newProposal, effectiveCycle: e.target.value })
              }
              placeholder="e.g. Q4 2026 or Next Pay Cycle"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Performance Justification
            </label>
            <textarea
              rows={3}
              required
              value={newProposal.justification}
              onChange={(e) =>
                setNewProposal({ ...newProposal, justification: e.target.value })
              }
              placeholder="Detail key business impact, deliverables surpassed, and justification for compensation adjustment..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsProposalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Recommendation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
