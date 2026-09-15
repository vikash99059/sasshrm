import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { JobOffer } from '../../types';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  DataTable,
  Column,
  Modal,
  Avatar,
  Input,
  Select,
} from '../../components/ui';
import {
  CreditCard,
  FileCheck,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Download,
  Eye,
  Plus,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const OfferManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'selected';

  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Create Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [salaryAnnual, setSalaryAnnual] = useState(145000);
  const [joiningDate, setJoiningDate] = useState('2025-07-15');
  const [responseDeadline, setResponseDeadline] = useState('2025-06-30');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Part-time'>('Full-time');

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getOffers();
    setOffers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName) return;

    await recruitmentService.createOffer({
      candidateName,
      candidateEmail: candidateEmail || 'candidate@talent.com',
      jobTitle,
      department,
      salaryAnnual,
      salaryFormatted: `$${salaryAnnual.toLocaleString()} / year`,
      joiningDate,
      responseDeadline,
      employmentType,
      offerStatus: 'Draft',
      approvalStatus: 'Pending',
    });

    setIsCreateModalOpen(false);
    showToast(`Draft offer created for ${candidateName}`);
    loadData();
  };

  const handleUpdateStatus = async (
    offerId: string,
    offerStatus: JobOffer['offerStatus'],
    approvalStatus?: JobOffer['approvalStatus']
  ) => {
    await recruitmentService.updateOfferStatus(offerId, offerStatus, approvalStatus);
    showToast(`Offer updated to "${offerStatus}"`);
    loadData();
  };

  const filteredOffers = offers.filter((o) => {
    if (currentTab === 'drafts') return o.offerStatus === 'Draft';
    if (currentTab === 'sent') return o.offerStatus === 'Sent';
    if (currentTab === 'accepted') return o.offerStatus === 'Accepted';
    if (currentTab === 'rejected') return o.offerStatus === 'Rejected';
    if (currentTab === 'expired') return o.offerStatus === 'Expired';
    return true; // 'selected' tab shows all candidates in selection pipeline
  });

  const getStatusBadge = (status: JobOffer['offerStatus']) => {
    switch (status) {
      case 'Accepted':
        return <Badge variant="success" size="sm">Accepted</Badge>;
      case 'Sent':
        return <Badge variant="primary" size="sm">Sent / Pending Response</Badge>;
      case 'Draft':
        return <Badge variant="neutral" size="sm">Draft</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="sm">Declined</Badge>;
      case 'Expired':
        return <Badge variant="warning" size="sm">Expired</Badge>;
      default:
        return null;
    }
  };

  const columns: Column<JobOffer>[] = [
    {
      header: 'Offer ID',
      accessorKey: 'id',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Candidate',
      accessorKey: 'candidateName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.candidateAvatar} name={row.candidateName} size="sm" />
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {row.candidateName}
            </p>
            <p className="text-[10px] text-slate-400">{row.candidateEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Department',
      accessorKey: 'jobTitle',
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.jobTitle}</p>
          <p className="text-[10px] text-slate-400">{row.department}</p>
        </div>
      ),
    },
    {
      header: 'Compensation (Annual)',
      accessorKey: 'salaryFormatted',
      cell: (row) => (
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {row.salaryFormatted}
        </span>
      ),
    },
    {
      header: 'Target Joining',
      accessorKey: 'joiningDate',
      cell: (row) => (
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
          {formatDate(row.joiningDate)}
        </span>
      ),
    },
    {
      header: 'Approval Status',
      accessorKey: 'approvalStatus',
      cell: (row) => {
        const isAppr = row.approvalStatus === 'Approved';
        return (
          <Badge variant={isAppr ? 'success' : 'warning'} size="sm">
            {row.approvalStatus}
          </Badge>
        );
      },
    },
    {
      header: 'Offer Status',
      accessorKey: 'offerStatus',
      cell: (row) => getStatusBadge(row.offerStatus),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOffer(row);
              setIsPreviewModalOpen(true);
            }}
            title="Preview Offer Letter"
            className="text-xs"
          >
            Letter
          </Button>

          {row.approvalStatus === 'Pending' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleUpdateStatus(row.id, row.offerStatus, 'Approved')}
              className="text-xs text-blue-600"
            >
              Approve
            </Button>
          )}

          {row.approvalStatus === 'Approved' && row.offerStatus === 'Draft' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleUpdateStatus(row.id, 'Sent')}
              leftIcon={<Send className="w-3 h-3" />}
              className="text-xs"
            >
              Send Offer
            </Button>
          )}

          {row.offerStatus === 'Sent' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdateStatus(row.id, 'Accepted')}
                title="Mark Accepted"
                className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdateStatus(row.id, 'Rejected')}
                title="Mark Rejected"
                className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successToast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Selection & Offer Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Author offer packages, manage multi-level executive compensation sign-offs, and track acceptance rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Generate Offer Draft
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'selected', label: 'Selected Candidates', count: offers.length },
          { key: 'drafts', label: 'Offer Drafts', count: offers.filter((o) => o.offerStatus === 'Draft').length },
          { key: 'sent', label: 'Offers Sent', count: offers.filter((o) => o.offerStatus === 'Sent').length },
          { key: 'accepted', label: 'Offers Accepted', count: offers.filter((o) => o.offerStatus === 'Accepted').length },
          { key: 'rejected', label: 'Offers Rejected', count: offers.filter((o) => o.offerStatus === 'Rejected').length },
          { key: 'expired', label: 'Offer Expired', count: offers.filter((o) => o.offerStatus === 'Expired').length },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredOffers}
          searchKey="candidateName"
          searchPlaceholder="Search candidate, role or offer ID..."
          pageSize={8}
        />
      </Card>

      {/* Offer Letter Preview Modal */}
      {selectedOffer && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={`Formal Offer Letter: ${selectedOffer.candidateName}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Letter Header */}
            <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-dark-border rounded-xl font-serif space-y-4 shadow-sm text-slate-800 dark:text-slate-200 max-h-[460px] overflow-y-auto">
              <div className="flex justify-between items-start border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold font-sans tracking-wide text-blue-700 dark:text-blue-400">
                    ACME ENTERPRISE CORP
                  </h3>
                  <p className="text-[11px] font-sans text-slate-500">
                    100 Innovation Way, Suite 400 • San Francisco, CA 94105
                  </p>
                </div>
                <div className="text-right font-sans">
                  <Badge variant="primary" size="sm">
                    {selectedOffer.id}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">Date: {formatDate(selectedOffer.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900 dark:text-white">
                  Dear {selectedOffer.candidateName},
                </p>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  On behalf of Acme Corp, we are delighted to formally offer you the position of{' '}
                  <strong className="text-slate-900 dark:text-white">{selectedOffer.jobTitle}</strong> in our{' '}
                  <strong className="text-slate-900 dark:text-white">{selectedOffer.department}</strong> department.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-dark-border font-sans space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Summary of Employment Terms
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Annual Base Salary:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedOffer.salaryFormatted}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Anticipated Start Date:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {formatDate(selectedOffer.joiningDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Employment Status:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {selectedOffer.employmentType} (Exempt)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Offer Acceptance Deadline:</span>
                    <p className="font-bold text-rose-600 dark:text-rose-400">
                      {formatDate(selectedOffer.responseDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="font-sans">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  Benefits & Perks Package
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  {selectedOffer.benefitsSummary.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end font-sans">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Marcus Vance</p>
                  <p className="text-[10px] text-slate-500">Chief Human Resources Officer, Acme Corp</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Candidate Signature: ________________</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => showToast(`Downloaded ${selectedOffer.id}_Offer_Letter.pdf`)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download PDF
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsPreviewModalOpen(false)}>
                  Close
                </Button>
                {selectedOffer.offerStatus === 'Draft' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      handleUpdateStatus(selectedOffer.id, 'Sent');
                    }}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Send Offer to Candidate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Offer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Author New Employment Offer"
        size="md"
      >
        <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
          <Input
            label="Candidate Full Name"
            placeholder="e.g. Liam Foster"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />

          <Input
            label="Candidate Email"
            type="email"
            placeholder="liam.foster@gmail.com"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Designation / Role"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Product & Design', value: 'Product & Design' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Sales & Growth', value: 'Sales & Growth' },
                { label: 'Human Resources', value: 'Human Resources' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Annual Base Salary ($)"
              type="number"
              value={salaryAnnual}
              onChange={(e) => setSalaryAnnual(parseInt(e.target.value))}
              required
            />
            <Select
              label="Employment Type"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as any)}
              options={[
                { label: 'Full-time', value: 'Full-time' },
                { label: 'Contract', value: 'Contract' },
                { label: 'Part-time', value: 'Part-time' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Joining Date"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
            <Input
              label="Offer Validity Deadline"
              type="date"
              value={responseDeadline}
              onChange={(e) => setResponseDeadline(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Draft Offer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
