import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge, Modal } from '../../components/ui';
import {
  Receipt,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  ExternalLink,
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import {
  managerService,
  TeamExpenseClaim
} from '../../services/managerService';

export const ManagerExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<TeamExpenseClaim[]>(
    managerService.getTeamExpenses()
  );
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<TeamExpenseClaim | null>(null);

  const handleApprove = (id: string) => {
    managerService.approveExpenseClaim(id, 'Approved by Manager');
    setExpenses(managerService.getTeamExpenses());
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Please provide reason for rejection:') || 'Rejected by Manager';
    managerService.rejectExpenseClaim(id, reason);
    setExpenses(managerService.getTeamExpenses());
  };

  const filteredExpenses = expenses.filter(
    (e) => filter === 'all' || e.status === filter
  );

  const totalPendingAmount = expenses
    .filter((e) => e.status === 'Pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalApprovedMonth = expenses
    .filter((e) => e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Team Expenses & Reimbursements"
        subtitle="Review employee expense claims, inspect attached invoices and receipts, and process approvals with line-item budget tracking."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium backdrop-blur-sm">
              Pending Claims: ${totalPendingAmount.toFixed(2)}
            </span>
          </div>
        }
      />

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Pending Approvals
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              ${totalPendingAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {expenses.filter((e) => e.status === 'Pending').length} claims awaiting review
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
            <Receipt className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Approved This Month
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ${totalApprovedMonth.toFixed(2)}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Forwarded to Finance for Disbursal</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Budget Utilization
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">68.4%</p>
            <p className="text-xs text-gray-500 mt-1">$3,420 of $5,000 Team Cap</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
            <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'all' ? 'All Claims' : tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500">
          Showing {filteredExpenses.length} records
        </span>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={exp.employeeAvatar}
                  alt={exp.employeeName}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-700 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      {exp.employeeName}
                    </h4>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {exp.category}
                    </span>
                    <Badge
                      variant={
                        exp.status === 'Approved'
                          ? 'success'
                          : exp.status === 'Rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {exp.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {exp.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>Expense Date: {exp.expenseDate}</span>
                    <span>•</span>
                    <span>Submitted: {exp.submittedDate}</span>
                    {exp.receiptUrl && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => setSelectedReceipt(exp)}
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Receipt
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${exp.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reimbursement</p>
                </div>

                {exp.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200"
                      onClick={() => handleReject(exp.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApprove(exp.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No expense claims found matching the filter.
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title={`Receipt Preview - ${selectedReceipt.employeeName} ($${selectedReceipt.amount.toFixed(2)})`}
        >
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
              <FileText className="h-16 w-16 text-emerald-600 mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedReceipt.category} Tax Invoice
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ref: {selectedReceipt.receiptUrl} • Date: {selectedReceipt.expenseDate}
              </p>
              <p className="text-sm font-bold text-emerald-600 mt-2">
                Total Billed: ${selectedReceipt.amount.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg text-xs space-y-1">
              <p><strong>Employee:</strong> {selectedReceipt.employeeName}</p>
              <p><strong>Description:</strong> {selectedReceipt.description}</p>
              <p><strong>Status:</strong> {selectedReceipt.status}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setSelectedReceipt(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
