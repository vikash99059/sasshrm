import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge, Modal } from '../../components/ui';
import {
  UserPlus,
  FileCheck,
  Users,
  Briefcase,
  Star,
  Plus,
  Send,
  Calendar,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import {
  managerService,
  ManagerCandidateEvaluation,
  ManpowerRequest
} from '../../services/managerService';

export const ManagerHiringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evaluations' | 'requisitions'>('evaluations');
  const [evaluations, setEvaluations] = useState<ManagerCandidateEvaluation[]>(
    managerService.getCandidateEvaluations()
  );
  const [requisitions, setRequisitions] = useState<ManpowerRequest[]>(
    managerService.getManpowerRequests()
  );

  // Modals
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState<ManagerCandidateEvaluation | null>(null);

  // New Requisition Form
  const [newReq, setNewReq] = useState({
    jobTitle: '',
    department: 'Engineering',
    count: 1,
    justification: '',
    budgetRange: '$90k - $120k',
    urgency: 'Medium' as ManpowerRequest['urgency']
  });

  // Evaluate candidate state
  const [evalScore, setEvalScore] = useState(8.5);
  const [evalRecommendation, setEvalRecommendation] = useState<ManagerCandidateEvaluation['recommendation']>('Strong Hire');
  const [evalNotes, setEvalNotes] = useState('');

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.jobTitle || !newReq.justification) return;

    const created = managerService.createManpowerRequest({
      jobTitle: newReq.jobTitle,
      department: newReq.department,
      count: Number(newReq.count),
      urgency: newReq.urgency,
      budgetRange: newReq.budgetRange,
      justification: newReq.justification,
      status: 'Pending-HR-Review',
      requestDate: 'Today'
    });

    setRequisitions([created, ...requisitions]);
    setIsReqModalOpen(false);
    setNewReq({
      jobTitle: '',
      department: 'Engineering',
      count: 1,
      justification: '',
      budgetRange: '$90k - $120k',
      urgency: 'Medium'
    });
  };

  const handleUpdateEvaluation = (evalId: string) => {
    managerService.submitCandidateEvaluation(
      evalId,
      evalScore,
      evalRecommendation,
      evalNotes
    );
    setEvaluations(managerService.getCandidateEvaluations());
    setIsEvalModalOpen(false);
    setSelectedEval(null);
  };

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Department Hiring & Candidate Evaluation"
        subtitle="Submit department manpower requisitions, conduct structured hiring rounds, and submit hiring verdicts directly to Talent Acquisition."
        actions={
          <div className="flex items-center gap-3">
            <Button
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold"
              onClick={() => setIsReqModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Request New Headcount
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`py-4 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'evaluations'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          Candidate Interview Scorecards ({evaluations.length})
        </button>
        <button
          onClick={() => setActiveTab('requisitions')}
          className={`py-4 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'requisitions'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Manpower & Headcount Requisitions ({requisitions.length})
        </button>
      </div>

      {/* Evaluations Tab */}
      {activeTab === 'evaluations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluations.map((ev) => (
            <div
              key={ev.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{ev.candidateName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Applying for: <strong className="text-gray-700 dark:text-gray-300">{ev.position}</strong>
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      Round: {ev.round} • {ev.interviewDate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      ev.recommendation === 'Strong Hire' || ev.recommendation === 'Hire'
                        ? 'success'
                        : ev.recommendation === 'Reject'
                        ? 'danger'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {ev.recommendation}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Overall Score:</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {ev.score} / 10.0
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Decision Status:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {ev.recommendation}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 mb-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                    Manager Evaluation Feedback:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded border border-gray-100 dark:border-gray-700">
                    "{ev.feedbackNotes}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-400">Scorecard #{ev.id}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedEval(ev);
                    setEvalScore(ev.score);
                    setEvalRecommendation(ev.recommendation);
                    setEvalNotes(ev.feedbackNotes);
                    setIsEvalModalOpen(true);
                  }}
                >
                  Edit Evaluation
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requisitions Tab */}
      {activeTab === 'requisitions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              <span>Department Manpower Requests ({requisitions.length})</span>
              <span className="text-xs font-normal text-gray-500">Submitted directly to HR Talent Acquisition</span>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {requisitions.map((req) => (
                <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">{req.jobTitle}</h4>
                      <Badge
                        variant={
                          req.urgency === 'High' ? 'danger' : req.urgency === 'Medium' ? 'warning' : 'info'
                        }
                        size="sm"
                      >
                        {req.urgency} Priority
                      </Badge>
                      <Badge
                        variant={
                          req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'neutral'
                        }
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Openings: <strong>{req.count}</strong> • Budget: <strong>{req.budgetRange}</strong> • Dept: <strong>{req.department}</strong> • Requested: {req.requestDate}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-1">
                      Reason: "{req.justification}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Requisition Modal */}
      <Modal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        title="Submit Manpower / Headcount Requisition"
      >
        <form onSubmit={handleCreateRequisition} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title / Designation
            </label>
            <input
              type="text"
              required
              value={newReq.jobTitle}
              onChange={(e) => setNewReq({ ...newReq, jobTitle: e.target.value })}
              placeholder="e.g. Senior Backend Engineer (Node.js/Go)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Positions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newReq.count}
                onChange={(e) => setNewReq({ ...newReq, count: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urgency Level
              </label>
              <select
                value={newReq.urgency}
                onChange={(e) => setNewReq({ ...newReq, urgency: e.target.value as ManpowerRequest['urgency'] })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Low">Low (Backfill/Pipeline)</option>
                <option value="Medium">Medium (Quarterly Target)</option>
                <option value="High">High (Immediate Critical Need)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estimated Budget / Salary Range
            </label>
            <input
              type="text"
              value={newReq.budgetRange}
              onChange={(e) => setNewReq({ ...newReq, budgetRange: e.target.value })}
              placeholder="e.g. $100,000 - $130,000 / annum"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Justification / Workload Demand
            </label>
            <textarea
              rows={3}
              required
              value={newReq.justification}
              onChange={(e) => setNewReq({ ...newReq, justification: e.target.value })}
              placeholder="Explain project impact, current team bandwidth constraints, and revenue drivers..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => setIsReqModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send to HR
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Evaluation Modal */}
      {selectedEval && (
        <Modal
          isOpen={isEvalModalOpen}
          onClose={() => setIsEvalModalOpen(false)}
          title={`Candidate Evaluation: ${selectedEval.candidateName}`}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-xs space-y-1">
              <p><strong>Position:</strong> {selectedEval.position}</p>
              <p><strong>Interview Round:</strong> {selectedEval.round}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Evaluation Score (1.0 to 10.0)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  className="w-full"
                />
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 min-w-[3rem]">
                  {evalScore.toFixed(1)} / 10
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hiring Recommendation
              </label>
              <select
                value={evalRecommendation}
                onChange={(e) => setEvalRecommendation(e.target.value as ManagerCandidateEvaluation['recommendation'])}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Strong Hire">Strong Hire (Top Tier)</option>
                <option value="Hire">Hire (Meets Expectations)</option>
                <option value="Hold">Hold (Need further discussion)</option>
                <option value="Reject">Reject (Does not meet bar)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager Interview Notes & Technical Feedback
              </label>
              <textarea
                rows={4}
                value={evalNotes}
                onChange={(e) => setEvalNotes(e.target.value)}
                placeholder="Detail technical problem solving, domain proficiency, cultural fit, and red flags..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsEvalModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateEvaluation(selectedEval.id)}
              >
                Update Scorecard
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
