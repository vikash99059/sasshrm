import React, { useState } from 'react';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import { Button, Badge, Modal } from '../../components/ui';
import {
  Award,
  Target,
  Star,
  Plus,
  TrendingUp,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  ThumbsUp,
  Sliders,
  Send,
  Heart
} from 'lucide-react';
import {
  managerService,
  TeamGoalOKR,
  QuarterlyReviewCard,
  SpotRecognition,
  TeamMember
} from '../../services/managerService';

export const ManagerPerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'okrs' | 'reviews' | 'recognition'>('okrs');
  const [goals, setGoals] = useState<TeamGoalOKR[]>(managerService.getTeamGoals());
  const [reviews, setReviews] = useState<QuarterlyReviewCard[]>(managerService.getQuarterlyReviews());
  const [recognitions, setRecognitions] = useState<SpotRecognition[]>(managerService.getSpotRecognitions());
  const teamMembers = managerService.getTeamMembers();

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRecognitionModalOpen, setIsRecognitionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<QuarterlyReviewCard | null>(null);

  // New Goal Form
  const [newGoal, setNewGoal] = useState({
    employeeId: teamMembers[0]?.id || '',
    title: '',
    keyResults: '',
    targetDate: '',
    weightage: 20
  });

  // New Recognition Form
  const [newRecog, setNewRecog] = useState({
    employeeId: teamMembers[0]?.id || '',
    badgeTitle: 'Innovation Champion 🚀',
    category: 'Innovation' as SpotRecognition['category'],
    points: 250,
    citation: ''
  });

  // Review Feedback state
  const [managerRating, setManagerRating] = useState(4.5);
  const [managerNotes, setManagerNotes] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = teamMembers.find(m => m.id === newGoal.employeeId);
    if (!emp || !newGoal.title) return;

    const created = managerService.createTeamGoal({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      title: newGoal.title,
      description: newGoal.keyResults,
      category: 'OKR',
      progress: 0,
      targetDate: newGoal.targetDate || '2026-12-31',
      status: 'On-Track',
      weightage: Number(newGoal.weightage),
      keyResults: newGoal.keyResults.split('\n').filter(Boolean).map(kr => ({
        description: kr,
        completed: false
      }))
    });

    setGoals([...goals, created]);
    setIsGoalModalOpen(false);
    setNewGoal({
      employeeId: teamMembers[0]?.id || '',
      title: '',
      keyResults: '',
      targetDate: '',
      weightage: 20
    });
  };

  const handleCreateRecognition = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = teamMembers.find(m => m.id === newRecog.employeeId);
    if (!emp || !newRecog.citation) return;

    const created = managerService.addSpotRecognition({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      badgeTitle: newRecog.badgeTitle,
      category: newRecog.category,
      points: Number(newRecog.points),
      citation: newRecog.citation,
      awardedDate: 'Today'
    });

    setRecognitions([created, ...recognitions]);
    setIsRecognitionModalOpen(false);
    setNewRecog({
      employeeId: teamMembers[0]?.id || '',
      badgeTitle: 'Innovation Champion 🚀',
      category: 'Innovation',
      points: 250,
      citation: ''
    });
  };

  const handleSubmitReviewFeedback = (reviewId: string) => {
    managerService.submitReviewScorecard(reviewId, managerRating, managerNotes);
    setReviews(managerService.getQuarterlyReviews());
    setIsReviewModalOpen(false);
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6">
      <PageHeaderCard
        title="Performance & Appraisals Hub"
        subtitle="Manage quarterly OKRs, conduct 360 reviews with standardized grading, and celebrate team achievements with spot rewards."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => setIsRecognitionModalOpen(true)}
            >
              <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
              Award Spot Bonus
            </Button>
            <Button
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold"
              onClick={() => setIsGoalModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Team OKR
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('okrs')}
          className={`py-4 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'okrs'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Target className="h-4 w-4" />
          Quarterly Team OKRs ({goals.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-4 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'reviews'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Review Scorecards & Grades ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('recognition')}
          className={`py-4 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'recognition'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Award className="h-4 w-4" />
          Spot Kudos & Wall of Fame ({recognitions.length})
        </button>
      </div>

      {/* OKRs Tab */}
      {activeTab === 'okrs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={goal.employeeAvatar}
                      alt={goal.employeeName}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base">{goal.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{goal.employeeName} • Weight: {goal.weightage}%</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      goal.status === 'Completed' ? 'success' : goal.status === 'At-Risk' ? 'danger' : 'info'
                    }
                    size="sm"
                  >
                    {goal.status}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{goal.description}</p>

                {/* Key Results list */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2 mb-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Key Results:
                  </div>
                  {(goal.keyResults || []).map((kr, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          kr.completed ? 'text-emerald-500' : 'text-gray-400'
                        }`}
                      />
                      <span className={kr.completed ? 'line-through text-gray-400' : ''}>
                        {kr.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-gray-500 dark:text-gray-400">Target Date: {goal.targetDate}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{goal.progress}% Done</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.employeeAvatar}
                      alt={rev.employeeName}
                      className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">{rev.employeeName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{rev.designation} • {rev.cycle}</p>
                    </div>
                  </div>
                  <Badge
                    variant={rev.status === 'Completed' ? 'success' : rev.status === 'Manager-Review' ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {rev.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Self Rating:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {rev.selfRating} / 5.0
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Manager Rating:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                      {rev.managerRating ? `${rev.managerRating} / 5.0` : 'Pending Score'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Self Evaluation Notes:</span>
                    <p className="text-gray-600 dark:text-gray-400 italic mt-0.5 bg-gray-50/50 dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                      "{rev.selfEvaluationNotes}"
                    </p>
                  </div>
                  {rev.managerFeedback && (
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Manager Final Remarks:</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-0.5 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded border border-emerald-100 dark:border-emerald-800/40">
                        {rev.managerFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500">Submitted: {rev.submissionDate}</span>
                <Button
                  size="sm"
                  variant={rev.status === 'Completed' ? 'outline' : 'primary'}
                  onClick={() => {
                    setSelectedReview(rev);
                    setManagerRating(rev.managerRating || 4.5);
                    setManagerNotes(rev.managerFeedback || '');
                    setIsReviewModalOpen(true);
                  }}
                >
                  <Sliders className="h-3.5 w-3.5 mr-1.5" />
                  {rev.status === 'Completed' ? 'Update Grading' : 'Grade & Submit'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recognition Wall */}
      {activeTab === 'recognition' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                Team Kudos & Rewards
              </span>
              <h3 className="text-2xl font-black">Inspire & Celebrate Excellence</h3>
              <p className="text-white/90 text-sm max-w-xl">
                Recognize exceptional effort instantly. Spot awards include reward points redeemable in the company perks portal.
              </p>
            </div>
            <Button
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-md px-6 whitespace-nowrap"
              onClick={() => setIsRecognitionModalOpen(true)}
            >
              Give Spot Kudos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recognitions.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-amber-200/60 dark:border-gray-700 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full blur-xl pointer-events-none" />

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={rec.employeeAvatar}
                      alt={rec.employeeName}
                      className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">{rec.employeeName}</h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{rec.badgeTitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    "{rec.citation}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" /> +{rec.points} Perk Points
                  </span>
                  <span className="text-gray-400">{rec.awardedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Set Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Set Quarterly Employee OKR"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Direct Report
            </label>
            <select
              value={newGoal.employeeId}
              onChange={(e) => setNewGoal({ ...newGoal, employeeId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objective Title
            </label>
            <input
              type="text"
              required
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g. Lead migration to GraphQL Gateway with zero downtime"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Results (One per line)
            </label>
            <textarea
              rows={3}
              required
              value={newGoal.keyResults}
              onChange={(e) => setNewGoal({ ...newGoal, keyResults: e.target.value })}
              placeholder="Complete schema design&#10;Achieve sub-50ms latency&#10;Write end-to-end integration tests"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weightage (%)
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={newGoal.weightage}
                onChange={(e) => setNewGoal({ ...newGoal, weightage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Assign OKR
            </Button>
          </div>
        </form>
      </Modal>

      {/* Spot Recognition Modal */}
      <Modal
        isOpen={isRecognitionModalOpen}
        onClose={() => setIsRecognitionModalOpen(false)}
        title="Award Spot Kudos & Points"
      >
        <form onSubmit={handleCreateRecognition} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Team Member
            </label>
            <select
              value={newRecog.employeeId}
              onChange={(e) => setNewRecog({ ...newRecog, employeeId: e.target.value })}
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
                Badge Title
              </label>
              <input
                type="text"
                required
                value={newRecog.badgeTitle}
                onChange={(e) => setNewRecog({ ...newRecog, badgeTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reward Points
              </label>
              <input
                type="number"
                step="50"
                min="50"
                max="1000"
                value={newRecog.points}
                onChange={(e) => setNewRecog({ ...newRecog, points: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Citation / Appreciation Note
            </label>
            <textarea
              rows={3}
              required
              value={newRecog.citation}
              onChange={(e) => setNewRecog({ ...newRecog, citation: e.target.value })}
              placeholder="Detail the exceptional behavior or milestone achieved..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" type="button" onClick={() => setIsRecognitionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Award Kudos
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Grade Modal */}
      {selectedReview && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`Grade Performance Review - ${selectedReview.employeeName}`}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-xs space-y-1">
              <p><strong>Cycle:</strong> {selectedReview.cycle}</p>
              <p><strong>Self Rating:</strong> {selectedReview.selfRating} / 5.0</p>
              <p><strong>Self Comments:</strong> {selectedReview.selfEvaluationNotes}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager Score Rating (1.0 to 5.0)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={managerRating}
                  onChange={(e) => setManagerRating(Number(e.target.value))}
                  className="w-full"
                />
                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 min-w-[3rem]">
                  {managerRating.toFixed(1)} ⭐
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager Remarks & Growth Plan
              </label>
              <textarea
                rows={4}
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                placeholder="Detail key achievements, areas for improvement, and career milestones for next quarter..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmitReviewFeedback(selectedReview.id)}
              >
                Submit Scorecard
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
