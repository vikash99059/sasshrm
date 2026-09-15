import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { ResumeDocument } from '../../types';
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
} from '../../components/ui';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Briefcase,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const ResumeManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<ResumeDocument | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isParseModalOpen, setIsParseModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [parsingId, setParsingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Upload Form State
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [newJobApplied, setNewJobApplied] = useState('Senior Full Stack Engineer');
  const [newFileName, setNewFileName] = useState('');

  const loadData = async () => {
    setLoading(true);
    const list = await recruitmentService.getResumes();
    setResumes(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSimulateParse = (resume: ResumeDocument) => {
    setParsingId(resume.id);
    setTimeout(() => {
      setParsingId(null);
      setSelectedResume(resume);
      setIsParseModalOpen(true);
      showToast(`Parsed structured skills and background for ${resume.candidateName}`);
    }, 800);
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newFileName) return;

    await recruitmentService.uploadResume({
      candidateName: newCandidateName,
      candidateEmail: newCandidateEmail || 'applicant@talent.com',
      jobApplied: newJobApplied,
      fileName: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      fileSize: '1.4 MB',
      extractedSkills: ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Git'],
      extractedExperience: '4.5 years demonstrated professional experience',
      extractedEducation: 'Bachelor of Science in Computer Science',
      matchScore: 88,
    });

    setIsUploadModalOpen(false);
    setNewCandidateName('');
    setNewCandidateEmail('');
    setNewFileName('');
    showToast('Resume uploaded and indexed successfully');
    loadData();
  };

  // Filter based on tab
  const filteredResumes = resumes.filter((r) => {
    if (currentTab === 'screening') return r.screeningStatus === 'Pending' || r.screeningStatus === 'Screened';
    if (currentTab === 'parsing') return r.matchScore !== undefined;
    if (currentTab === 'downloads') return true;
    if (currentTab === 'documents') return true;
    return true; // 'all'
  });

  const columns: Column<ResumeDocument>[] = [
    {
      header: 'Candidate',
      accessorKey: 'candidateName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.candidateAvatar} name={row.candidateName} size="sm" />
          <div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">
              {row.candidateName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{row.candidateEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resume File',
      accessorKey: 'fileName',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
              {row.fileName}
            </p>
            <p className="text-[10px] text-slate-400">{row.fileSize}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Job Applied',
      accessorKey: 'jobApplied',
      cell: (row) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {row.jobApplied}
        </span>
      ),
    },
    {
      header: 'Uploaded On',
      accessorKey: 'uploadDate',
      cell: (row) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {formatDate(row.uploadDate)}
        </span>
      ),
    },
    {
      header: 'Verification',
      accessorKey: 'resumeStatus',
      cell: (row) => {
        const isVerified = row.resumeStatus === 'Verified';
        return (
          <Badge variant={isVerified ? 'success' : 'warning'} size="sm">
            {row.resumeStatus}
          </Badge>
        );
      },
    },
    {
      header: 'Screening Status',
      accessorKey: 'screeningStatus',
      cell: (row) => {
        let badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'primary' = 'info';
        if (row.screeningStatus === 'Shortlisted') badgeVariant = 'success';
        if (row.screeningStatus === 'Rejected') badgeVariant = 'danger';
        if (row.screeningStatus === 'Pending') badgeVariant = 'warning';
        return (
          <Badge variant={badgeVariant} size="sm">
            {row.screeningStatus}
          </Badge>
        );
      },
    },
    {
      header: 'Match Index',
      accessorKey: 'matchScore',
      cell: (row) =>
        row.matchScore ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold ${
                row.matchScore >= 85
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : row.matchScore >= 70
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {row.matchScore}%
            </span>
            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  row.matchScore >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${row.matchScore}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Unscored</span>
        ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedResume(row);
              setIsViewModalOpen(true);
            }}
            title="Preview Resume"
            className="h-7 w-7 p-0"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSimulateParse(row)}
            disabled={parsingId === row.id}
            title="Parse Resume Attributes"
            className="h-7 w-7 p-0"
          >
            {parsingId === row.id ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            )}
          </Button>

          <a
            href={row.downloadUrl}
            download={row.fileName}
            onClick={(e) => {
              e.preventDefault();
              showToast(`Downloaded ${row.fileName}`);
            }}
            className="inline-flex items-center justify-center h-7 w-7 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
            title="Download Document"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Resume Management & Document Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized repository for candidate CVs, automated semantic parsing, verification and screening.
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
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload Resume
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-dark-border overflow-x-auto">
        {[
          { key: 'all', label: 'All Resumes', count: resumes.length },
          {
            key: 'screening',
            label: 'Resume Screening',
            count: resumes.filter((r) => r.screeningStatus === 'Pending' || r.screeningStatus === 'Screened').length,
          },
          {
            key: 'parsing',
            label: 'Resume Parsing',
            count: resumes.filter((r) => r.matchScore !== undefined).length,
          },
          { key: 'downloads', label: 'Resume Downloads', count: resumes.length },
          { key: 'documents', label: 'Candidate Documents', count: resumes.length },
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <p className="text-[11px] font-medium text-slate-500">Total Indexed Resumes</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{resumes.length}</p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <p className="text-[11px] font-medium text-slate-500">Awaiting Screening</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {resumes.filter((r) => r.screeningStatus === 'Pending').length}
          </p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <p className="text-[11px] font-medium text-slate-500">Shortlisted Rate</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">68.4%</p>
        </Card>
        <Card className="p-3.5 bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border">
          <p className="text-[11px] font-medium text-slate-500">Verified Formats</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">100%</p>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border border-slate-200/80 dark:border-dark-border overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredResumes}
          searchKey="candidateName"
          searchPlaceholder="Search candidates, resumes, or jobs..."
          pageSize={8}
        />
      </Card>

      {/* Preview Resume Modal */}
      {selectedResume && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Document Preview: ${selectedResume.fileName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <Avatar src={selectedResume.candidateAvatar} name={selectedResume.candidateName} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedResume.candidateName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedResume.jobApplied}</p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Verified PDF
              </Badge>
            </div>

            {/* Document Reader Container */}
            <div className="border border-slate-200 dark:border-dark-border rounded-lg p-6 bg-white dark:bg-slate-950 font-sans space-y-5 text-slate-800 dark:text-slate-200 text-xs shadow-inner max-h-[420px] overflow-y-auto">
              <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {selectedResume.candidateName}
                </h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                  {selectedResume.candidateEmail} | San Francisco, CA | Available Immediately
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1 mb-2">
                  Professional Summary
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  Accomplished software engineer with {selectedResume.extractedExperience || 'extensive track record'} delivering enterprise scalable microservices, clean front-end architectures and automated delivery pipelines.
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1 mb-2">
                  Key Skills & Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResume.extractedSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded font-medium text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-400 border-b pb-1 mb-2">
                  Education & Qualifications
                </h3>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedResume.extractedEducation || 'B.S. in Computer Science'}
                </p>
                <p className="text-[11px] text-slate-500">Graduated with High Honors (GPA: 3.85 / 4.0)</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">File hash: SHA-256 (verified authentic)</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleSimulateParse(selectedResume);
                  }}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Parse Extracted Data
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Parse Details Modal */}
      {selectedResume && (
        <Modal
          isOpen={isParseModalOpen}
          onClose={() => setIsParseModalOpen(false)}
          title={`Parsed Attributes: ${selectedResume.candidateName}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200/80 dark:border-purple-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-900 dark:text-purple-300">
                  ATS Resume Parsing Engine
                </p>
                <p className="text-[11px] text-purple-700 dark:text-purple-400">
                  Extracted from {selectedResume.fileName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-600 font-semibold">Job Match</p>
                <p className="text-base font-black text-purple-700 dark:text-purple-300">
                  {selectedResume.matchScore}%
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Applied Position:</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedResume.jobApplied}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Demonstrated Experience:</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedResume.extractedExperience}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Extracted Core Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedResume.extractedSkills?.map((s, i) => (
                    <Badge key={i} variant="primary" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Highest Education:</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedResume.extractedEducation}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-dark-border">
              <Button variant="secondary" size="sm" onClick={() => setIsParseModalOpen(false)}>
                Done
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsParseModalOpen(false);
                  showToast('Updated candidate scorecard from parsed resume data');
                }}
              >
                Sync with Candidate Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Resume Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Parse Candidate Resume"
        size="md"
      >
        <form onSubmit={handleUploadResume} className="space-y-4">
          <Input
            label="Candidate Full Name"
            placeholder="e.g. Jordan Mitchell"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            required
          />

          <Input
            label="Candidate Email"
            type="email"
            placeholder="jordan.mitchell@example.com"
            value={newCandidateEmail}
            onChange={(e) => setNewCandidateEmail(e.target.value)}
          />

          <Input
            label="Applied Position"
            placeholder="e.g. Senior Full Stack Engineer"
            value={newJobApplied}
            onChange={(e) => setNewJobApplied(e.target.value)}
            required
          />

          <Input
            label="File Name / Document Name"
            placeholder="e.g. Jordan_Mitchell_Senior_Engineer.pdf"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            required
          />

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50/50 dark:bg-slate-900/50">
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Drag & drop resume PDF or Word file here
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, RTF up to 10MB</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-dark-border">
            <Button variant="secondary" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Upload & Process
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
