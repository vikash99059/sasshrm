import React, { useState, useMemo } from 'react';
import { cn } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  FileCheck,
  Clock,
  Upload,
  Folder,
  User,
  GraduationCap,
  Briefcase,
  Contact,
  Receipt,
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  FileDown,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
} from 'lucide-react';

export interface DocumentItemData {
  id: number;
  name: string;
  subName: string;
  category: 'Personal' | 'Educational' | 'Experience' | 'Identification' | 'Tax & Financial' | 'Other' | 'Health';
  fileType: 'PDF' | 'JPG' | 'PNG' | 'DOCX';
  fileSize: string;
  uploadedOn: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  iconType: 'pdf' | 'jpg' | 'doc' | 'sheet';
}

export const DocumentsPage: React.FC = () => {
  // Initial document repository matching reference image
  const [documents, setDocuments] = useState<DocumentItemData[]>([
    {
      id: 1,
      name: 'Aadhaar Card',
      subName: 'ID Document',
      category: 'Identification',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      uploadedOn: 'Apr 05, 2025 10:32 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 2,
      name: 'PAN Card',
      subName: 'ID Document',
      category: 'Identification',
      fileType: 'PDF',
      fileSize: '856 KB',
      uploadedOn: 'Apr 06, 2025 11:15 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 3,
      name: 'Educational Certificate',
      subName: 'Education',
      category: 'Educational',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadedOn: 'Apr 08, 2025 09:20 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 4,
      name: 'Experience Letter',
      subName: 'Experience',
      category: 'Experience',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      uploadedOn: 'Apr 10, 2025 02:45 PM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 5,
      name: 'Bonafide Certificate',
      subName: 'Other',
      category: 'Other',
      fileType: 'PDF',
      fileSize: '620 KB',
      uploadedOn: 'Apr 12, 2025 11:10 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 6,
      name: 'Bank Account Details',
      subName: 'Financial',
      category: 'Tax & Financial',
      fileType: 'PDF',
      fileSize: '1.1 MB',
      uploadedOn: 'Apr 14, 2025 03:25 PM',
      status: 'Pending',
      iconType: 'sheet',
    },
    {
      id: 7,
      name: 'Passport Size Photo',
      subName: 'Personal',
      category: 'Personal',
      fileType: 'JPG',
      fileSize: '320 KB',
      uploadedOn: 'Apr 16, 2025 10:40 AM',
      status: 'Pending',
      iconType: 'jpg',
    },
    {
      id: 8,
      name: 'Medical Certificate',
      subName: 'Health',
      category: 'Personal',
      fileType: 'PDF',
      fileSize: '900 KB',
      uploadedOn: 'Apr 18, 2025 01:20 PM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 9,
      name: 'Form 16 Tax Certificate',
      subName: 'Tax & Financial',
      category: 'Tax & Financial',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      uploadedOn: 'Mar 28, 2025 04:15 PM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 10,
      name: 'Previous Relieving Letter',
      subName: 'Experience',
      category: 'Experience',
      fileType: 'PDF',
      fileSize: '1.5 MB',
      uploadedOn: 'Feb 15, 2025 11:00 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 11,
      name: 'Degree Convocation Certificate',
      subName: 'Education',
      category: 'Educational',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      uploadedOn: 'Jan 20, 2025 05:30 PM',
      status: 'Verified',
      iconType: 'pdf',
    },
    {
      id: 12,
      name: 'Driver License / Address Proof',
      subName: 'Personal',
      category: 'Personal',
      fileType: 'PDF',
      fileSize: '1.4 MB',
      uploadedOn: 'Jan 10, 2025 09:45 AM',
      status: 'Verified',
      iconType: 'pdf',
    },
  ]);

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  // Checkbox selection state
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Active Dropdown for row action
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedDocForDetails, setSelectedDocForDetails] = useState<DocumentItemData | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Upload Modal Form State
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentItemData['category']>('Personal');
  const [uploadFileType, setUploadFileType] = useState<'PDF' | 'JPG' | 'PNG' | 'DOCX'>('PDF');
  const [uploadNote, setUploadNote] = useState('');

  // Request Document Form State
  const [requestDocType, setRequestDocType] = useState('Bonafide Certificate');
  const [requestPurpose, setRequestPurpose] = useState('');

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    return {
      all: documents.length,
      personal: documents.filter((d) => d.category === 'Personal').length,
      educational: documents.filter((d) => d.category === 'Educational').length,
      experience: documents.filter((d) => d.category === 'Experience').length,
      identification: documents.filter((d) => d.category === 'Identification').length,
      financial: documents.filter((d) => d.category === 'Tax & Financial').length,
      other: documents.filter((d) => d.category === 'Other').length,
    };
  }, [documents]);

  // KPI Metrics Calculation
  const totalCount = documents.length;
  const verifiedCount = documents.filter((d) => d.status === 'Verified').length;
  const pendingCount = documents.filter((d) => d.status === 'Pending').length;
  const recentUploadsCount = 3;

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Personal' && doc.category !== 'Personal') return false;
        if (selectedCategory === 'Educational' && doc.category !== 'Educational') return false;
        if (selectedCategory === 'Experience' && doc.category !== 'Experience') return false;
        if (selectedCategory === 'Identification' && doc.category !== 'Identification') return false;
        if (selectedCategory === 'Financial' && doc.category !== 'Tax & Financial') return false;
        if (selectedCategory === 'Other' && doc.category !== 'Other') return false;
        if (selectedCategory === 'Verified' && doc.status !== 'Verified') return false;
        if (selectedCategory === 'Pending' && doc.status !== 'Pending') return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.subName.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          doc.fileType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Paginated records
  const totalPages = Math.ceil(filteredDocuments.length / pageSize) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage]);

  // Select all handler
  const handleSelectAll = () => {
    if (selectedDocIds.length === paginatedDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(paginatedDocs.map((d) => d.id));
    }
  };

  const toggleSelectDoc = (id: number) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Upload Document Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    const newDoc: DocumentItemData = {
      id: Date.now(),
      name: uploadName,
      subName: uploadCategory === 'Identification' ? 'ID Document' : uploadCategory,
      category: uploadCategory,
      fileType: uploadFileType,
      fileSize: '1.4 MB',
      uploadedOn: 'Just now',
      status: 'Pending',
      iconType: uploadFileType === 'JPG' || uploadFileType === 'PNG' ? 'jpg' : 'pdf',
    };

    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    setUploadName('');
    setUploadNote('');
  };

  // Request Document Submit
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Request submitted for ${requestDocType}! HR team has been notified.`);
    setIsRequestModalOpen(false);
    setRequestPurpose('');
  };

  // Delete Document
  const handleDeleteDoc = (id: number) => {
    setDocuments(documents.filter((d) => d.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-4 animate-page-enter">
      {/* =========================================================================
          TOP HEADER: ICON + TITLE + SUBTITLE & 3D FOLDERS/DOCUMENTS ILLUSTRATION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Icon, Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Documents
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access and manage your official documents, certificates and important files in one place.
            </p>
          </div>
        </div>

        {/* Right: Soft 3D Documents & Folder Graphic matching reference image */}
        <div className="hidden md:flex items-center justify-end relative pr-2">
          <div className="relative flex items-center justify-center">
            {/* Ambient Multi-Tone Radiant Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-sky-400/20 to-blue-600/20 rounded-full blur-xl pointer-events-none" />

            {/* 3D Folders & Sheets Graphic */}
            <svg width="170" height="92" viewBox="0 0 210 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Decorative Soft Leaves */}
              <path d="M12 60C22 46 38 52 44 68C30 74 18 72 12 60Z" fill="#BFDBFE" fillOpacity="0.55" />
              <path d="M196 26C184 16 168 22 162 38C176 44 188 40 196 26Z" fill="#BFDBFE" fillOpacity="0.5" />
              <path d="M206 52C192 42 182 56 184 72C198 70 204 62 206 52Z" fill="#93C5FD" fillOpacity="0.5" />

              {/* Background Document Sheets */}
              <g transform="translate(90, 10) rotate(12)">
                <rect x="0" y="0" width="54" height="74" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                <rect x="8" y="10" width="28" height="4" rx="2" fill="#CBD5E1" />
                <rect x="8" y="18" width="38" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="24" width="34" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="30" width="38" height="3" rx="1.5" fill="#E2E8F0" />
              </g>

              <g transform="translate(68, 6) rotate(-4)">
                <rect x="0" y="0" width="56" height="76" rx="6" fill="#FFFFFF" filter="url(#sheetShadow)" />
                <rect x="8" y="12" width="26" height="4" rx="2" fill="#93C5FD" />
                <rect x="8" y="20" width="40" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="26" width="34" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="32" width="38" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="8" y="38" width="30" height="3" rx="1.5" fill="#E2E8F0" />
              </g>

              {/* Main 3D Blue Front Folder */}
              <g transform="translate(54, 26)">
                {/* Back Tab */}
                <path d="M0 8C0 3.58172 3.58172 0 8 0H32C36.4183 0 40 3.58172 40 8V12H0V8Z" fill="#1D4ED8" />
                {/* Front Pocket */}
                <rect x="0" y="8" width="82" height="58" rx="8" fill="url(#folderBlueGrad)" filter="url(#folderShadow)" />
                {/* Glossy Top Edge Highlight */}
                <rect x="2" y="10" width="78" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
              </g>

              {/* Foreground Floating Document with Blue Header & Checklist */}
              <g transform="translate(76, 18) rotate(4)">
                <rect x="0" y="0" width="58" height="72" rx="7" fill="#FFFFFF" filter="url(#fgDocShadow)" />
                <rect x="0" y="0" width="58" height="14" rx="7" fill="#3B82F6" />
                {/* Header title placeholder */}
                <rect x="6" y="5" width="22" height="4" rx="2" fill="#FFFFFF" />
                {/* Checklist items */}
                <circle cx="10" cy="24" r="3" fill="#10B981" />
                <rect x="16" y="22" width="34" height="4" rx="1.5" fill="#CBD5E1" />

                <circle cx="10" cy="34" r="3" fill="#10B981" />
                <rect x="16" y="32" width="30" height="4" rx="1.5" fill="#CBD5E1" />

                <circle cx="10" cy="44" r="3" fill="#3B82F6" />
                <rect x="16" y="42" width="34" height="4" rx="1.5" fill="#CBD5E1" />

                <circle cx="10" cy="54" r="3" fill="#E2E8F0" />
                <rect x="16" y="52" width="26" height="4" rx="1.5" fill="#E2E8F0" />
              </g>

              <defs>
                <linearGradient id="folderBlueGrad" x1="0" y1="8" x2="82" y2="66" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <filter id="sheetShadow" x="-4" y="-2" width="68" height="86" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.1" />
                </filter>
                <filter id="folderShadow" x="-6" y="4" width="94" height="72" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1E40AF" floodOpacity="0.25" />
                </filter>
                <filter id="fgDocShadow" x="-6" y="-2" width="72" height="84" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.15" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP 4 KPI METRIC CARDS (HORIZONTAL ROW, COMPACT BOX HEIGHT, SHARP ALIGNMENT)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Total Documents */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Total Documents
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {totalCount}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 2. Verified Documents */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs flex-shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Verified Documents
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {verifiedCount}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2">
            <button
              onClick={() => setSelectedCategory('Verified')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Verified</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 3. Pending Verification */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-xs flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Pending Verification
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {pendingCount}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2">
            <button
              onClick={() => setSelectedCategory('Pending')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Pending</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 4. Recent Uploads */}
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-xs flex-shrink-0">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Recent Uploads
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {recentUploadsCount}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border/60 mt-2">
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Uploads</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN 3-COLUMN SECTION:
          LEFT: DOCUMENT CATEGORIES (SIDEBAR LIST)
          CENTER: ALL DOCUMENTS TABLE WITH SEARCH & UPLOAD
          RIGHT: QUICK ACTIONS + RECENT ACTIVITY + TIP BANNER
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: DOCUMENT CATEGORIES (2.5 - 3 COLS)
           ======================================================================= */}
        <div className="lg:col-span-3 xl:col-span-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white px-2 py-1">
            Document Categories
          </h3>

          <div className="space-y-1 pt-1">
            {/* 1. All Documents */}
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'All'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
                  <Folder className="h-4 w-4" />
                </div>
                <span>All Documents</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.all}
              </span>
            </button>

            {/* 2. Personal Documents */}
            <button
              onClick={() => {
                setSelectedCategory('Personal');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Personal'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300">
                  <User className="h-4 w-4" />
                </div>
                <span>Personal Documents</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.personal}
              </span>
            </button>

            {/* 3. Educational Documents */}
            <button
              onClick={() => {
                setSelectedCategory('Educational');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Educational'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span>Educational Documents</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.educational}
              </span>
            </button>

            {/* 4. Experience Certificates */}
            <button
              onClick={() => {
                setSelectedCategory('Experience');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Experience'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-300">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span>Experience Certificates</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.experience}
              </span>
            </button>

            {/* 5. Identification Documents */}
            <button
              onClick={() => {
                setSelectedCategory('Identification');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Identification'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
                  <Contact className="h-4 w-4" />
                </div>
                <span>Identification Documents</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.identification}
              </span>
            </button>

            {/* 6. Tax & Financial */}
            <button
              onClick={() => {
                setSelectedCategory('Financial');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Financial'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300">
                  <Receipt className="h-4 w-4" />
                </div>
                <span>Tax & Financial</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.financial}
              </span>
            </button>

            {/* 7. Other Documents */}
            <button
              onClick={() => {
                setSelectedCategory('Other');
                setCurrentPage(1);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
                selectedCategory === 'Other'
                  ? 'bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
                <span>Other Documents</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {categoryCounts.other}
              </span>
            </button>
          </div>
        </div>

        {/* =======================================================================
            CENTER COLUMN: ALL DOCUMENTS TABLE WITH SEARCH & UPLOAD (6.5 - 7 COLS)
           ======================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-3.5">
          
          {/* Header Bar: Title + Search + Upload CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex-shrink-0">
              {selectedCategory === 'All' ? 'All Documents' : `${selectedCategory} Documents`}
            </h2>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:border-dark-border dark:bg-slate-800/60 dark:text-white transition-all"
                />
              </div>

              {/* Upload Document Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/25 transition-all duration-150 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-dark-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 dark:border-dark-border dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={paginatedDocs.length > 0 && selectedDocIds.length === paginatedDocs.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Document Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">File Type</th>
                  <th className="py-2.5 px-3 font-semibold">Size</th>
                  <th className="py-2.5 px-3 font-semibold">Uploaded On</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <FileText className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No documents found</p>
                      <p className="text-[11px] text-slate-400">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <tr
                        key={doc.id}
                        className={cn(
                          'hover:bg-slate-50/75 dark:hover:bg-slate-800/50 transition-colors',
                          isSelected && 'bg-blue-50/40 dark:bg-blue-950/20'
                        )}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectDoc(doc.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Document Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {doc.fileType === 'PDF' ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-[9px]">
                                  <FileText className="h-4 w-4" />
                                </div>
                              ) : doc.fileType === 'JPG' || doc.fileType === 'PNG' ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold text-[9px]">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold text-[9px]">
                                  <FileSpreadsheet className="h-4 w-4" />
                                </div>
                              )}
                            </div>

                            {/* Name & Subtitle */}
                            <div>
                              <p
                                onClick={() => setSelectedDocForDetails(doc)}
                                className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                              >
                                {doc.name}
                              </p>
                              <p className="text-[10.5px] text-slate-400">{doc.subName}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {doc.category}
                          </span>
                        </td>

                        {/* File Type */}
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {doc.fileType}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {doc.fileSize}
                        </td>

                        {/* Uploaded On */}
                        <td className="py-2.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {doc.uploadedOn}
                        </td>

                        {/* Status Badge */}
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold',
                              doc.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60'
                            )}
                          >
                            {doc.status}
                          </span>
                        </td>

                        {/* Action Menu (⋮) */}
                        <td className="py-2.5 px-3 text-right relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeMenuId === doc.id && (
                            <div className="absolute right-3 top-8 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-toast-slide dark:border-dark-border dark:bg-dark-card z-30 text-left">
                              <button
                                onClick={() => {
                                  setSelectedDocForDetails(doc);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-500" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Downloading ${doc.name}...`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Download</span>
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11.5px]">
              Showing {filteredDocuments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredDocuments.length)} of {filteredDocuments.length} documents
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer',
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-dark-border dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT COLUMN: QUICK ACTIONS + RECENT ACTIVITY + TIP BANNER (3 COLS)
           ======================================================================= */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-4">
          
          {/* Card 1: Quick Actions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h3>

            <div className="space-y-2 pt-1">
              {/* Action 1: Upload Document */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Upload Document</p>
                  <p className="text-[11px] text-slate-400">Add new document</p>
                </div>
              </button>

              {/* Action 2: View All Documents */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">View All Documents</p>
                  <p className="text-[11px] text-slate-400">Browse your files</p>
                </div>
              </button>

              {/* Action 3: Request Document */}
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
                  <FileDown className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Request Document</p>
                  <p className="text-[11px] text-slate-400">Apply for missing document</p>
                </div>
              </button>
            </div>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover-card-lift transition-all duration-200 dark:border-dark-border dark:bg-dark-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Activity Item List matching reference image */}
            <div className="space-y-3 pt-1">
              {/* Item 1 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex-shrink-0 mt-0.5">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    You uploaded Experience Letter.pdf
                  </p>
                  <p className="text-[10.5px] text-slate-400">Apr 10, 2025 02:45 PM</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Document verified: Aadhaar Card
                  </p>
                  <p className="text-[10.5px] text-slate-400">Apr 05, 2025 10:32 AM</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    You uploaded Medical Certificate.pdf
                  </p>
                  <p className="text-[10.5px] text-slate-400">Apr 18, 2025 01:20 PM</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex-shrink-0 mt-0.5">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Document pending: Bank Account Details
                  </p>
                  <p className="text-[10.5px] text-slate-400">Apr 14, 2025 03:25 PM</p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex-shrink-0 mt-0.5">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    You uploaded Educational Certificate.pdf
                  </p>
                  <p className="text-[10.5px] text-slate-400">Apr 08, 2025 09:20 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Soft Blue Tip Banner matching reference image */}
          <div className="rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/90 to-sky-50/70 p-4 shadow-xs dark:border-blue-900/40 dark:from-blue-950/30 dark:to-sky-950/20 relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-3 z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-[155px]">
                Keep your documents updated for a smooth HR process.
              </p>
            </div>

            {/* Decorative Soft Blue Vector Leaves */}
            <div className="relative flex-shrink-0 opacity-80 pointer-events-none">
              <svg width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 35C15 20 32 25 38 42C24 48 12 46 5 35Z" fill="#93C5FD" fillOpacity="0.7" />
                <path d="M28 8C20 2 12 6 8 18C18 22 26 20 28 8Z" fill="#60A5FA" fillOpacity="0.6" />
                <path d="M42 22C32 16 26 24 28 34C36 34 40 30 42 22Z" fill="#3B82F6" fillOpacity="0.5" />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE MODALS: UPLOAD, REQUEST, DETAILS, ALL ACTIVITIES
         ========================================================================= */}
      {/* 1. Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Document"
        description="Upload your identity proof, certificate, or official document."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUploadSubmit}>
              Upload Document
            </Button>
          </>
        }
      >
        <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Degree Certificate, Passport Copy"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="Personal">Personal Documents</option>
                <option value="Educational">Educational Documents</option>
                <option value="Experience">Experience Certificates</option>
                <option value="Identification">Identification Documents</option>
                <option value="Tax & Financial">Tax & Financial</option>
                <option value="Other">Other Documents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Type
              </label>
              <select
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="PDF">PDF (.pdf)</option>
                <option value="JPG">JPEG / JPG (.jpg)</option>
                <option value="PNG">PNG Image (.png)</option>
                <option value="DOCX">Word Document (.docx)</option>
              </select>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select File to Upload
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
              <Upload className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop your file here
              </p>
              <p className="text-[10.5px] text-slate-400 mt-1">
                Supports PDF, JPG, PNG, DOCX up to 10MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Note / Remarks
            </label>
            <textarea
              rows={2}
              value={uploadNote}
              onChange={(e) => setUploadNote(e.target.value)}
              placeholder="Add any extra notes for the HR team..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* 2. Request Document Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Official Document"
        description="Submit an official request to the HR operations team for authorized company documentation."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleRequestSubmit}>
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Type Requested *
            </label>
            <select
              value={requestDocType}
              onChange={(e) => setRequestDocType(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            >
              <option value="Bonafide Certificate">Bonafide Certificate (For Bank / Visa)</option>
              <option value="Salary Certificate">Salary Certificate</option>
              <option value="Experience Letter">Interim Experience Letter</option>
              <option value="Relieving Letter">Relieving Letter</option>
              <option value="Address Verification Letter">Address Verification Letter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose & Justification *
            </label>
            <textarea
              rows={3}
              required
              value={requestPurpose}
              onChange={(e) => setRequestPurpose(e.target.value)}
              placeholder="State the purpose for this request (e.g., Applying for home loan, visa processing)..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* 3. Document Details Modal */}
      {selectedDocForDetails && (
        <Modal
          isOpen={!!selectedDocForDetails}
          onClose={() => setSelectedDocForDetails(null)}
          title={selectedDocForDetails.name}
          description={`Details and verification status for ${selectedDocForDetails.subName}.`}
          size="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedDocForDetails(null)}>
                Close
              </Button>
              <Button
                size="sm"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={() => {
                  alert(`Downloading ${selectedDocForDetails.name}...`);
                  setSelectedDocForDetails(null);
                }}
              >
                Download File
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Category</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedDocForDetails.category}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">File Format</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedDocForDetails.fileType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">File Size</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{selectedDocForDetails.fileSize}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Uploaded Date</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedDocForDetails.uploadedOn}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-dark-border">
              <span className="text-slate-400">Verification Status</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10.5px] font-bold',
                  selectedDocForDetails.status === 'Verified'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {selectedDocForDetails.status}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Full Recent Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Recent Document Activity Log"
        description="Audit log of all document uploads, verifications, and compliance updates."
        size="md"
      >
        <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-dark-border">
          {[
            { title: 'You uploaded Medical Certificate.pdf', time: 'Apr 18, 2025 01:20 PM', status: 'Verified', color: 'blue' },
            { title: 'Document pending: Passport Size Photo', time: 'Apr 16, 2025 10:40 AM', status: 'Pending', color: 'amber' },
            { title: 'Document pending: Bank Account Details', time: 'Apr 14, 2025 03:25 PM', status: 'Pending', color: 'amber' },
            { title: 'You uploaded Bonafide Certificate.pdf', time: 'Apr 12, 2025 11:10 AM', status: 'Verified', color: 'purple' },
            { title: 'You uploaded Experience Letter.pdf', time: 'Apr 10, 2025 02:45 PM', status: 'Verified', color: 'rose' },
            { title: 'You uploaded Educational Certificate.pdf', time: 'Apr 08, 2025 09:20 AM', status: 'Verified', color: 'purple' },
            { title: 'Document verified: PAN Card', time: 'Apr 06, 2025 11:15 AM', status: 'Verified', color: 'emerald' },
            { title: 'Document verified: Aadhaar Card', time: 'Apr 05, 2025 10:32 AM', status: 'Verified', color: 'emerald' },
          ].map((item, idx) => (
            <div key={idx} className="pt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.time}</p>
                </div>
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold',
                  item.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                )}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
