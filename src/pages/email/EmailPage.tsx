import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import {
  Mail,
  Inbox,
  Send,
  FileText,
  Star,
  Trash2,
  Search,
  Plus,
  Paperclip,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Shield,
  Tag,
  X,
  Archive,
  AlertOctagon,
  CornerUpLeft,
  CornerUpRight,
  ReplyAll,
  Printer,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Bookmark,
  Sparkles,
  Download,
  Eye,
  FolderInput,
  Folder,
  Check,
  Smile,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Code,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  Share2,
} from 'lucide-react';

export type OutlookFolderType = 'inbox' | 'sent' | 'drafts' | 'archive' | 'junk' | 'trash';

export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  senderAvatar?: string;
  senderRole?: string;
  recipients: string[];
  subject: string;
  preview: string;
  body: string;
  date: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isFlagged: boolean;
  folder: OutlookFolderType;
  tab: 'focused' | 'other';
  category?: 'Work' | 'HR' | 'Security' | 'Finance' | 'Important';
  importance?: 'high' | 'normal' | 'low';
  attachments?: EmailAttachment[];
}

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'em-1',
    sender: 'HR Operations Desk',
    senderEmail: 'hr.operations@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    senderRole: 'People & Culture Lead',
    recipients: ['all-employees@acmecorp.com'],
    subject: 'Annual Performance & Benefits Review 2026 Cycle Announcement',
    preview: 'Dear team, the 2026 Annual Performance Appraisal and Benefits enrollment window is now active across all departments...',
    body: `Dear Team,

We are pleased to announce the kick-off for our 2026 Annual Performance and Benefits enrollment cycle. Please review your compensation statements, updated medical insurance coverages, and submit any dependent enrollment requests by September 30.

Key highlights for this cycle:
• Comprehensive dental and vision upgrade across tier-1 healthcare networks
• Flexible wellness spending allowance ($750 annual stipend)
• Q3 milestone bonus payouts schedule and performance self-evaluations
• Remote ergonomic equipment reimbursement guidelines

If you have any questions regarding your benefits tier or goal submissions, feel free to reply directly to this thread or visit the HR Operations Desk.

Best regards,
People & Culture Operations
Acme Global Technologies`,
    date: '10:30 AM',
    timestamp: 'Today at 10:30 AM',
    isRead: false,
    isStarred: true,
    isFlagged: true,
    folder: 'inbox',
    tab: 'focused',
    category: 'HR',
    importance: 'high',
    attachments: [
      { id: 'att-1', name: 'Benefits_Brochure_2026.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'att-2', name: 'Compensation_FAQ_Matrix.xlsx', size: '480 KB', type: 'xlsx' },
    ],
  },
  {
    id: 'em-2',
    sender: 'David Vance',
    senderEmail: 'david.vance@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Director of Enterprise Operations',
    recipients: ['leadership-team@acmecorp.com', 'all-staff@acmecorp.com'],
    subject: 'Q3 Town Hall & Enterprise Milestone Celebration Invitation',
    preview: 'Please join us this Thursday at 4:00 PM for our global Q3 all-hands meeting in the main auditorium and live on Teams...',
    body: `Hi Everyone,

Please mark your calendars for this Thursday's Global All-Hands Townhall at 4:00 PM in the Main Auditorium & via video stream on Microsoft Teams.

Meeting Agenda:
1. Executive Leadership Welcome & Financial Performance Highlights
2. Department Showcases: AI Automation & SaaS HRM Enterprise Launch
3. Key Customer Wins in North America & APAC
4. Employee Recognition Awards & Celebrations

Refreshments will be served immediately following the presentation in the rooftop lounge. Looking forward to seeing everyone there!

David Vance
Director of Operations
Acme Global Technologies`,
    date: 'Yesterday',
    timestamp: 'Yesterday at 3:15 PM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'inbox',
    tab: 'focused',
    category: 'Work',
    importance: 'normal',
    attachments: [{ id: 'att-3', name: 'Q3_Townhall_Agenda_SlideDeck.pptx', size: '6.2 MB', type: 'pptx' }],
  },
  {
    id: 'em-3',
    sender: 'IT & Security Desk',
    senderEmail: 'security@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Information Security Officer',
    recipients: ['employees@acmecorp.com'],
    subject: 'Mandatory SOC-2 Two-Factor Security Audit & Device Attestation',
    preview: 'A quick reminder to verify that your 2FA devices and security keys are properly updated and registered before the audit cut-off...',
    body: `Hello Team,

This is an automated security audit notice to verify your Multi-Factor Authentication credentials and hardware security keys. As part of our annual SOC-2 Type II compliance audit, all corporate workstation sessions must complete biometric or FIDO2 key re-attestation.

Required steps:
1. Navigate to the Corporate Security Portal (https://security.acmecorp.internal)
2. Tap "Verify Active Workstation Key"
3. Approve the Microsoft Authenticator push notification

Deadline: Friday, September 18 at 5:00 PM EST. Failure to attest may result in restricted VPN and email access.

Thank you for helping keep our company data secure.

IT Information Security & Governance Team`,
    date: 'Sep 08',
    timestamp: 'Sep 08 at 11:45 AM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'inbox',
    tab: 'other',
    category: 'Security',
    importance: 'high',
  },
  {
    id: 'em-4',
    sender: 'Elena Rostova',
    senderEmail: 'elena.rostova@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Senior Talent Partner',
    recipients: ['engineering-hiring@acmecorp.com'],
    subject: 'Final Interview Loops Scheduled for Senior Backend Engineers',
    preview: 'We have 3 outstanding candidates scheduled for final architecture loops this week. Please review their resumes and code samples...',
    body: `Hi Team,

We have scheduled final interview rounds for the 3 shortlisted Senior Backend Engineer candidates. 

Candidate Summary:
• Sarah Jenkins - Ex-Stripe, Distributed Systems & Go
• Marcus Cole - Fintech background, PostgreSQL & Kubernetes
• Ananya Patel - Cloud Infrastructure & Microservices

Feedback forms will be available in the ATS immediately after each interview. Please submit scores within 24 hours of completion.

Best,
Elena Rostova
Talent Acquisition`,
    date: 'Sep 07',
    timestamp: 'Sep 07 at 02:20 PM',
    isRead: true,
    isStarred: true,
    isFlagged: true,
    folder: 'inbox',
    tab: 'focused',
    category: 'Work',
    importance: 'normal',
    attachments: [{ id: 'att-4', name: 'Candidate_Portfolios_Summary.pdf', size: '1.8 MB', type: 'pdf' }],
  },
  {
    id: 'em-5',
    sender: 'You',
    senderEmail: 'vikash.s@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Full Stack Engineer',
    recipients: ['amit.verma@acmecorp.com', 'engineering@acmecorp.com'],
    subject: 'Sprint 24 Architecture Proposal & API Schema Review',
    preview: 'Hi Amit, attached is the revised API specification document for the payroll adjustments pipeline and real-time calculation engine...',
    body: `Hi Amit,

Attached is the finalized API schema for the payroll adjustments pipeline. All edge cases discussed during sprint grooming have been addressed:

1. Retroactive salary adjustment recalculations
2. Multi-tier tax slab deductions
3. Real-time webhook dispatches for payment gateway reconciliations

Please let me know if you have any feedback before we merge the pull request into main branch.

Regards,
Vikash S.`,
    date: 'Sep 06',
    timestamp: 'Sep 06 at 04:30 PM',
    isRead: true,
    isStarred: true,
    isFlagged: false,
    folder: 'sent',
    tab: 'focused',
    category: 'Work',
    importance: 'normal',
    attachments: [{ id: 'att-5', name: 'API_Spec_v2.4_Final.json', size: '340 KB', type: 'json' }],
  },
  {
    id: 'em-6',
    sender: 'You',
    senderEmail: 'vikash.s@acmecorp.com',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Full Stack Engineer',
    recipients: ['finance@acmecorp.com'],
    subject: 'Corporate Travel & Expense Claim Receipt Submission #EXP-8891',
    preview: 'Submitting receipt documentation for the developer conference flights and hotel accommodations for approval...',
    body: `Hi Finance Team,

I have submitted expense claim #EXP-8891 for the Tech Summit 2026 conference travel expenses. Receipts for flights, conference pass, and lodging are attached.

Please let me know if any further itemization is required.

Thanks,
Vikash`,
    date: 'Sep 04',
    timestamp: 'Sep 04 at 09:10 AM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'sent',
    tab: 'focused',
    category: 'Finance',
    importance: 'normal',
  },
  {
    id: 'em-7',
    sender: 'Draft - Q4 Hiring & Tech Roadmap Proposal',
    senderEmail: 'vikash.s@acmecorp.com',
    recipients: ['management@acmecorp.com'],
    subject: '[DRAFT] Q4 Hiring & Cloud Infrastructure Modernization Proposal',
    preview: 'Outline of strategic technical priorities for Q4 including cloud cost optimization, microservices decoupling, and developer tooling...',
    body: `Draft Notes for Leadership Presentation:

• Target 25% reduction in AWS RDS hosting costs through query indexing & caching
• Implement centralized observability with OpenTelemetry
• Scale frontend micro-frontends architecture for HRM enterprise modules
• Key headcount requests: 2 Senior Frontend Devs, 1 DevOps Engineer`,
    date: 'Draft',
    timestamp: 'Saved as draft today',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'drafts',
    tab: 'focused',
    category: 'Work',
  },
  {
    id: 'em-8',
    sender: 'Global SaaS Summit Newsletter',
    senderEmail: 'newsletters@saas-summit-world.org',
    recipients: ['vikash.s@acmecorp.com'],
    subject: 'Special Offer: VIP Passes for SaaS World Expo San Francisco',
    preview: 'Early bird registration is closing this Friday. Claim your complimentary standard pass or upgrade to VIP Networking Dinner...',
    body: `Hello Innovator,

Join 5,000+ SaaS founders, CTOs, and HR technology pioneers this November in San Francisco for the premier enterprise cloud event of the year.

Use promo code ENTERPRISE2026 for 20% off all conference passes.`,
    date: 'Sep 01',
    timestamp: 'Sep 01 at 08:00 AM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'junk',
    tab: 'other',
    category: 'Important',
  },
  {
    id: 'em-9',
    sender: 'Acme Facilities & Catering',
    senderEmail: 'facilities@acmecorp.com',
    recipients: ['office-ny@acmecorp.com'],
    subject: '[Archived] Scheduled Weekend HVAC Maintenance Notice - 5th Floor',
    preview: 'Notice that routine ventilation filter replacements will take place on Saturday between 8 AM and 2 PM...',
    body: `Hi Everyone,

Routine ventilation maintenance was completed successfully on Saturday. All office access and power were fully restored.

Facilities Team`,
    date: 'Aug 28',
    timestamp: 'Aug 28 at 05:00 PM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'archive',
    tab: 'other',
    category: 'Work',
  },
  {
    id: 'em-10',
    sender: 'Declined: Sprint Retrospective Check-in',
    senderEmail: 'calendar-notifier@acmecorp.com',
    recipients: ['vikash.s@acmecorp.com'],
    subject: '[Deleted] Declined: Sprint Retrospective Check-in Meeting Invite',
    preview: 'Meeting invitation response was moved to deleted items...',
    body: `This calendar event response was automatically archived and deleted.`,
    date: 'Aug 25',
    timestamp: 'Aug 25 at 10:00 AM',
    isRead: true,
    isStarred: false,
    isFlagged: false,
    folder: 'trash',
    tab: 'other',
    category: 'Work',
  },
];

export const EmailPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active folder synced with URL parameter ?folder=inbox
  const urlFolder = (searchParams.get('folder') as OutlookFolderType) || 'inbox';
  const [activeFolder, setActiveFolder] = useState<OutlookFolderType>(urlFolder);
  const [activeTab, setActiveTab] = useState<'focused' | 'other'>('focused');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'flagged' | 'attachments'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  // Email List State
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([]);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [toInput, setToInput] = useState('');
  const [toRecipients, setToRecipients] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeImportance, setComposeImportance] = useState<'high' | 'normal' | 'low'>('normal');
  const [composeAttachments, setComposeAttachments] = useState<{ name: string; size: string }[]>([]);

  // Inline Quick Reply State
  const [inlineReplyOpen, setInlineReplyOpen] = useState(false);
  const [inlineReplyText, setInlineReplyText] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync folder state from URL
  useEffect(() => {
    const f = (searchParams.get('folder') as OutlookFolderType) || 'inbox';
    setActiveFolder(f);
  }, [searchParams]);

  // Handle switching folder
  const handleSelectFolder = (folder: OutlookFolderType) => {
    setActiveFolder(folder);
    setSearchParams({ folder });
    setSelectedEmail(null);
    setSelectedEmailIds([]);
  };

  // Filtered emails based on folder, tab (focused vs other), search, and quick filters
  const folderEmails = useMemo(() => {
    return emails.filter((em) => em.folder === activeFolder);
  }, [emails, activeFolder]);

  const displayedEmails = useMemo(() => {
    return folderEmails.filter((em) => {
      // Focused vs Other Tab filtering (applies mainly to inbox)
      if (activeFolder === 'inbox' && em.tab !== activeTab) {
        return false;
      }

      // Quick filter
      if (filterType === 'unread' && em.isRead) return false;
      if (filterType === 'flagged' && !em.isFlagged) return false;
      if (filterType === 'attachments' && (!em.attachments || em.attachments.length === 0)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSender = em.sender.toLowerCase().includes(q) || em.senderEmail.toLowerCase().includes(q);
        const matchesSubject = em.subject.toLowerCase().includes(q);
        const matchesBody = em.body.toLowerCase().includes(q);
        return matchesSender || matchesSubject || matchesBody;
      }

      return true;
    });
  }, [folderEmails, activeFolder, activeTab, filterType, searchQuery]);

  // Automatically select the first email on desktop if none selected
  useEffect(() => {
    if (!selectedEmail && displayedEmails.length > 0) {
      setSelectedEmail(displayedEmails[0]);
    }
  }, [displayedEmails, selectedEmail]);

  // Unread count for inbox
  const unreadInboxCount = useMemo(() => {
    return emails.filter((e) => e.folder === 'inbox' && !e.isRead).length;
  }, [emails]);

  const draftsCount = useMemo(() => {
    return emails.filter((e) => e.folder === 'drafts').length;
  }, [emails]);

  const junkCount = useMemo(() => {
    return emails.filter((e) => e.folder === 'junk').length;
  }, [emails]);

  // Email Actions
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, isRead: !em.isRead } : em))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail((prev) => (prev ? { ...prev, isRead: !prev.isRead } : null));
    }
  };

  const handleToggleFlag = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, isFlagged: !em.isFlagged } : em))
    );
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail((prev) => (prev ? { ...prev, isFlagged: !prev.isFlagged } : null));
    }
  };

  const handleDeleteEmail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => {
        if (em.id === id) {
          return { ...em, folder: 'trash' as OutlookFolderType };
        }
        return em;
      })
    );
    showToast('Conversation moved to Deleted Items');
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  const handleArchiveEmail = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmails((prev) =>
      prev.map((em) => {
        if (em.id === id) {
          return { ...em, folder: 'archive' as OutlookFolderType };
        }
        return em;
      })
    );
    showToast('Message archived successfully');
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  const handleReportJunk = (id: string) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === id ? { ...em, folder: 'junk' as OutlookFolderType } : em))
    );
    showToast('Sender reported and moved to Junk Email');
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  // Sending a new email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (toRecipients.length === 0 && !toInput.trim()) {
      alert('Please specify at least one recipient.');
      return;
    }

    const recipients = toRecipients.length > 0 ? toRecipients : [toInput.trim()];

    const newMail: EmailItem = {
      id: `em-${Date.now()}`,
      sender: 'You',
      senderEmail: currentUser.email || 'vikash.s@acmecorp.com',
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Enterprise User',
      recipients: recipients,
      subject: composeSubject || '(No Subject)',
      preview: composeBody.slice(0, 80) + '...',
      body: composeBody,
      date: 'Just now',
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isStarred: false,
      isFlagged: false,
      folder: 'sent',
      tab: 'focused',
      category: 'Work',
      importance: composeImportance,
      attachments: composeAttachments.map((a, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: a.name,
        size: a.size,
        type: a.name.split('.').pop() || 'doc',
      })),
    };

    setEmails((prev) => [newMail, ...prev]);
    setIsComposeOpen(false);
    setToInput('');
    setToRecipients([]);
    setCcInput('');
    setComposeSubject('');
    setComposeBody('');
    setComposeAttachments([]);
    showToast('Message sent via Microsoft Exchange Online');
  };

  // Sending inline quick reply
  const handleSendInlineReply = () => {
    if (!inlineReplyText.trim() || !selectedEmail) return;

    const replyItem: EmailItem = {
      id: `em-reply-${Date.now()}`,
      sender: 'You',
      senderEmail: currentUser.email || 'vikash.s@acmecorp.com',
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Enterprise User',
      recipients: [selectedEmail.senderEmail],
      subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      preview: inlineReplyText.slice(0, 80) + '...',
      body: `${inlineReplyText}\n\n--- Original Message ---\nFrom: ${selectedEmail.sender} <${selectedEmail.senderEmail}>\nSent: ${selectedEmail.timestamp}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
      date: 'Just now',
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isStarred: false,
      isFlagged: false,
      folder: 'sent',
      tab: 'focused',
      category: 'Work',
    };

    setEmails((prev) => [replyItem, ...prev]);
    setInlineReplyText('');
    setInlineReplyOpen(false);
    showToast(`Reply sent to ${selectedEmail.sender}`);
  };

  // Quick recipient tags in composer
  const SUGGESTED_COLLEAGUES = [
    { name: 'Amit Verma', email: 'amit.verma@acmecorp.com', role: 'Lead Architect' },
    { name: 'Elena Rostova', email: 'elena.rostova@acmecorp.com', role: 'Talent Acquisition' },
    { name: 'Sneha Gupta', email: 'sneha.gupta@acmecorp.com', role: 'HR Operations' },
    { name: 'David Vance', email: 'david.vance@acmecorp.com', role: 'Director of Operations' },
  ];

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-2 animate-page-enter">
      
      {/* =======================================================================
          OUTLOOK TOP HEADER & BRANDING
         ======================================================================= */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2.5">
          {/* Authentic Microsoft 365 Outlook Blue Icon Badge */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0078D4] to-[#005A9E] text-white shadow-xs">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Outlook Mail & Communications
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/25 dark:text-[#60A5FA] border border-[#0078D4]/20">
                Exchange Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Corporate inbox, message threads, file attachments & enterprise mailbox
            </p>
          </div>
        </div>

        {/* Global Outlook Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#005A9E] hover:from-[#006CBE] hover:to-[#004C85] text-white text-xs font-semibold shadow-sm shadow-[#0078D4]/30 hover:shadow-md hover:shadow-[#0078D4]/40 transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Mail</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>
        </div>
      </div>

      {/* =======================================================================
          OUTLOOK 3-PANE WORKSPACE (FOLDER RAIL | EMAIL LIST | READING PANE)
         ======================================================================= */}
      <div className="flex-1 min-h-0 flex bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        
        {/* =====================================================================
            PANE 1: LEFT OUTLOOK FOLDERS & CATEGORIES RAIL (w-56)
           ===================================================================== */}
        <div className="w-56 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-[#13131B] flex-shrink-0 text-xs select-none">
          
          {/* Mailbox Header */}
          <div className="p-3 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Folder className="h-3.5 w-3.5 text-[#0078D4]" />
              <span>Mail Folders</span>
            </span>
            <button
              onClick={() => showToast('Mailbox synchronized with Microsoft Exchange')}
              title="Sync Mailbox"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Folder Links List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Favorites</p>
            
            {/* 1. Inbox */}
            <button
              onClick={() => handleSelectFolder('inbox')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'inbox'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                <span>Inbox</span>
              </div>
              {unreadInboxCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#0078D4] text-white text-[10px] font-bold shadow-2xs">
                  {unreadInboxCount}
                </span>
              )}
            </button>

            {/* 2. Sent Items */}
            <button
              onClick={() => handleSelectFolder('sent')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'sent'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Sent Items</span>
              </div>
            </button>

            {/* 3. Drafts */}
            <button
              onClick={() => handleSelectFolder('drafts')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'drafts'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Drafts</span>
              </div>
              {draftsCount > 0 && (
                <span className="text-[10px] font-bold text-slate-400">
                  {draftsCount}
                </span>
              )}
            </button>

            {/* 4. Archive */}
            <button
              onClick={() => handleSelectFolder('archive')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'archive'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </div>
            </button>

            {/* 5. Junk Email */}
            <button
              onClick={() => handleSelectFolder('junk')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'junk'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span>Junk Email</span>
              </div>
              {junkCount > 0 && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {junkCount}
                </span>
              )}
            </button>

            {/* 6. Deleted Items */}
            <button
              onClick={() => handleSelectFolder('trash')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer',
                activeFolder === 'trash'
                  ? 'bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/20 dark:text-[#60A5FA] font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Deleted Items</span>
              </div>
            </button>

            <div className="pt-3 pb-1">
              <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
            </div>

            {[
              { label: 'Work & Projects', color: 'bg-blue-500' },
              { label: 'HR & Benefits', color: 'bg-emerald-500' },
              { label: 'High Priority', color: 'bg-rose-500' },
              { label: 'IT & Security', color: 'bg-purple-500' },
              { label: 'Finance & Claims', color: 'bg-amber-500' },
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setSearchQuery(cat.label.split(' ')[0]);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] transition-colors cursor-pointer text-left"
              >
                <span className={cn('w-2.5 h-2.5 rounded-full', cat.color)} />
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Mailbox Storage Quota Bar */}
          <div className="p-3 border-t border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-black/20 text-[10.5px]">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>Exchange Quota</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">14.8 / 50 GB</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="w-[30%] h-full bg-[#0078D4] rounded-full" />
            </div>
          </div>
        </div>

        {/* =====================================================================
            PANE 2: MIDDLE EMAIL LIST WITH FOCUSED / OTHER TABS (w-80 md:w-96)
           ===================================================================== */}
        <div className="w-80 sm:w-88 md:w-96 border-r border-slate-200/80 dark:border-slate-800 flex flex-col flex-shrink-0 bg-white dark:bg-[#111118]">
          
          {/* Top Search & Filter Strip */}
          <div className="p-2.5 border-b border-slate-200/80 dark:border-slate-800 space-y-2">
            {/* Outlook Search Bar */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in mailbox (Ctrl+E)..."
                className="w-full h-8 pl-8 pr-7 text-xs bg-slate-50 dark:bg-[#171722] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0078D4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Outlook Focused / Other Tab Switcher (For Inbox) */}
            {activeFolder === 'inbox' ? (
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('focused')}
                    className={cn(
                      'pb-1 border-b-2 transition-colors cursor-pointer',
                      activeTab === 'focused'
                        ? 'border-[#0078D4] text-[#0078D4] dark:text-[#60A5FA]'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    )}
                  >
                    Focused
                  </button>
                  <button
                    onClick={() => setActiveTab('other')}
                    className={cn(
                      'pb-1 border-b-2 transition-colors cursor-pointer',
                      activeTab === 'other'
                        ? 'border-[#0078D4] text-[#0078D4] dark:text-[#60A5FA]'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    )}
                  >
                    Other
                  </button>
                </div>

                {/* Filter Pill Dropdown */}
                <div className="flex items-center gap-1 text-[11px]">
                  {(['all', 'unread', 'flagged'] as const).map((ft) => (
                    <button
                      key={ft}
                      onClick={() => setFilterType(ft)}
                      className={cn(
                        'px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer capitalize',
                        filterType === ft
                          ? 'bg-[#0078D4] text-white shadow-2xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <span className="font-bold text-slate-800 dark:text-white capitalize">
                  {activeFolder === 'trash' ? 'Deleted Items' : activeFolder === 'junk' ? 'Junk Email' : activeFolder}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{displayedEmails.length} items</span>
              </div>
            )}
          </div>

          {/* Email Messages List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 scrollbar-thin">
            {displayedEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Mail className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                <p className="text-xs font-semibold">No emails found in this folder</p>
                <p className="text-[11px] text-slate-400">All caught up or try adjusting your filter.</p>
              </div>
            ) : (
              displayedEmails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;

                return (
                  <div
                    key={em.id}
                    onClick={() => {
                      setSelectedEmail(em);
                      if (!em.isRead) {
                        handleToggleRead(em.id);
                      }
                    }}
                    className={cn(
                      'p-3 cursor-pointer transition-all duration-150 relative group flex gap-2.5',
                      isSelected
                        ? 'bg-[#0078D4]/10 dark:bg-[#0078D4]/20'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                      !em.isRead && 'bg-blue-50/40 dark:bg-blue-950/20'
                    )}
                  >
                    {/* Unread Left Border Highlight Indicator */}
                    {!em.isRead && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0078D4]" />
                    )}

                    {/* Sender Avatar */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      {em.senderAvatar ? (
                        <img src={em.senderAvatar} alt={em.sender} className="w-8 h-8 rounded-full object-cover shadow-2xs" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0078D4]/10 text-[#0078D4] font-bold flex items-center justify-center text-xs">
                          {em.sender[0]}
                        </div>
                      )}
                      {!em.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0078D4] ring-2 ring-white dark:ring-[#111118]" />
                      )}
                    </div>

                    {/* Email Card Details */}
                    <div className="flex-1 min-w-0">
                      {/* Sender Name & Timestamp */}
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={cn(
                          'text-xs truncate',
                          !em.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-200'
                        )}>
                          {em.sender}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">{em.date}</span>
                      </div>

                      {/* Subject Line */}
                      <p className={cn(
                        'text-xs truncate mb-1 leading-tight',
                        !em.isRead ? 'font-bold text-[#0078D4] dark:text-[#60A5FA]' : 'text-slate-800 dark:text-slate-300'
                      )}>
                        {em.subject}
                      </p>

                      {/* Preview Snippet */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {em.preview}
                      </p>

                      {/* Card Footer: Category & Attachment Tags */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {em.category && (
                          <span className={cn(
                            'px-1.5 py-0.2 rounded text-[9.5px] font-bold',
                            em.category === 'HR' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
                            em.category === 'Work' && 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
                            em.category === 'Security' && 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
                            em.category === 'Finance' && 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          )}>
                            {em.category}
                          </span>
                        )}

                        {em.attachments && em.attachments.length > 0 && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-semibold text-slate-400">
                            <Paperclip className="h-3 w-3" />
                            <span>{em.attachments.length}</span>
                          </span>
                        )}

                        {em.importance === 'high' && (
                          <span className="text-[9.5px] font-bold text-rose-600 dark:text-rose-400">
                            ! High
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover Quick Action Buttons (Outlook Style) */}
                    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-white/95 dark:bg-[#1E1E2C]/95 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
                      <button
                        onClick={(e) => handleToggleFlag(em.id, e)}
                        title={em.isFlagged ? 'Unflag' : 'Flag message'}
                        className={cn(
                          'p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer',
                          em.isFlagged ? 'text-amber-500' : 'text-slate-400'
                        )}
                      >
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => handleToggleRead(em.id, e)}
                        title={em.isRead ? 'Mark as unread' : 'Mark as read'}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteEmail(em.id, e)}
                        title="Delete email"
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =====================================================================
            PANE 3: RIGHT FULL OUTLOOK READING PANE
           ===================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111118]">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Outlook Action Toolbar for Active Message */}
              <div className="h-12 px-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-[#14141E] flex-shrink-0 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInlineReplyOpen(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-[#1E1E2C] dark:hover:bg-[#28283C] text-slate-700 dark:text-slate-200 font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <CornerUpLeft className="h-3.5 w-3.5 text-[#0078D4]" />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      setInlineReplyOpen(true);
                      showToast('Replying to all conversation participants');
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-[#1E1E2C] dark:hover:bg-[#28283C] text-slate-700 dark:text-slate-200 font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <ReplyAll className="h-3.5 w-3.5 text-slate-500" />
                    <span>Reply all</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsComposeOpen(true);
                      setComposeSubject(`Fwd: ${selectedEmail.subject}`);
                      setComposeBody(`\n\n--- Forwarded message ---\nFrom: ${selectedEmail.sender} <${selectedEmail.senderEmail}>\nDate: ${selectedEmail.timestamp}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`);
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-[#1E1E2C] dark:hover:bg-[#28283C] text-slate-700 dark:text-slate-200 font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <CornerUpRight className="h-3.5 w-3.5 text-slate-500" />
                    <span>Forward</span>
                  </button>

                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                  <button
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                    title="Delete message"
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleArchiveEmail(selectedEmail.id)}
                    title="Archive message"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleReportJunk(selectedEmail.id)}
                    title="Report as Junk"
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    onClick={() => window.print()}
                    title="Print conversation"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Details Canvas */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                
                {/* Subject Line & Category */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {selectedEmail.subject}
                    </h2>
                    {selectedEmail.category && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0078D4]/10 text-[#0078D4] dark:bg-[#0078D4]/25 dark:text-[#60A5FA]">
                        {selectedEmail.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Verified by Microsoft Exchange Online • TLS 1.3 Encryption</span>
                  </div>
                </div>

                {/* Sender Profile Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedEmail.senderAvatar ? (
                      <img
                        src={selectedEmail.senderAvatar}
                        alt={selectedEmail.sender}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0078D4] text-white font-bold flex items-center justify-center text-sm">
                        {selectedEmail.sender[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {selectedEmail.sender}
                        </span>
                        {selectedEmail.senderRole && (
                          <span className="text-[11px] text-slate-400">({selectedEmail.senderRole})</span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-mono">
                        &lt;{selectedEmail.senderEmail}&gt;
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        To: <span className="font-semibold text-slate-600 dark:text-slate-300">You &lt;{currentUser.email}&gt;</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 text-xs text-slate-400">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{selectedEmail.timestamp}</p>
                    <button
                      onClick={(e) => handleToggleFlag(selectedEmail.id, e)}
                      className="mt-1 text-[11px] font-semibold text-[#0078D4] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Bookmark className="h-3 w-3 fill-current" />
                      <span>{selectedEmail.isFlagged ? 'Flagged' : 'Flag'}</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line pt-2 font-sans">
                  {selectedEmail.body}
                </div>

                {/* File Attachments Block */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Paperclip className="h-3.5 w-3.5 text-[#0078D4]" />
                      <span>Attachments ({selectedEmail.attachments.length})</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedEmail.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#181824] flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#0078D4]/10 text-[#0078D4] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                              {att.type.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{att.name}</p>
                              <p className="text-[10px] text-slate-400">{att.size}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => showToast(`Downloading ${att.name}...`)}
                              title="Download attachment"
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Quick Reply Box */}
                <div className="pt-4">
                  {!inlineReplyOpen ? (
                    <button
                      onClick={() => setInlineReplyOpen(true)}
                      className="w-full p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0078D4] text-left text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50/50 dark:bg-[#14141E] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CornerUpLeft className="h-4 w-4 text-[#0078D4]" />
                      <span>Click here to reply to {selectedEmail.sender}...</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#14141E] space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <CornerUpLeft className="h-3.5 w-3.5 text-[#0078D4]" />
                          <span>Replying to {selectedEmail.sender}</span>
                        </span>
                        <button
                          onClick={() => setInlineReplyOpen(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        value={inlineReplyText}
                        onChange={(e) => setInlineReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        rows={4}
                        className="w-full p-3 text-xs bg-white dark:bg-[#1A1A26] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0078D4] transition-all"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => showToast('File attachment opened')}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInlineReplyOpen(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            onClick={handleSendInlineReply}
                            className="px-4 py-1.5 rounded-lg bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Send</span>
                            <Send className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            /* No Email Selected Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0078D4]/10 to-[#0078D4]/20 flex items-center justify-center text-[#0078D4] shadow-xs">
                <Mail className="h-8 w-8 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Select an email to read
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Choose a conversation from the list to view full headers, document attachments, and write replies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =======================================================================
          OUTLOOK NEW MAIL / COMPOSE MODAL DIALOG
         ======================================================================= */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#141420] text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Outlook Title Bar */}
            <div className="h-12 px-4 bg-[#0078D4] text-white flex items-center justify-between flex-shrink-0">
              <span className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>New Message - Outlook Mail</span>
              </span>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleSendEmail} className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
              
              {/* To: Recipients Row */}
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 w-12 flex-shrink-0">To:</span>
                <div className="flex-1 flex flex-wrap items-center gap-1.5">
                  {toRecipients.map((rec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0078D4]/15 text-[#0078D4] dark:bg-[#0078D4]/30 dark:text-[#60A5FA] text-xs font-semibold"
                    >
                      <span>{rec}</span>
                      <button
                        type="button"
                        onClick={() => setToRecipients(toRecipients.filter((_, i) => i !== idx))}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if (toInput.trim()) {
                          setToRecipients([...toRecipients, toInput.trim()]);
                          setToInput('');
                        }
                      }
                    }}
                    placeholder={toRecipients.length === 0 ? 'Type name or email...' : 'Add more...'}
                    className="flex-1 min-w-[120px] h-7 text-xs bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCc(!showCc)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#0078D4] cursor-pointer"
                >
                  Cc
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                <span className="text-slate-400">Suggestions:</span>
                {SUGGESTED_COLLEAGUES.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => {
                      if (!toRecipients.includes(c.email)) {
                        setToRecipients([...toRecipients, c.email]);
                      }
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0078D4] hover:text-white transition-colors cursor-pointer"
                  >
                    + {c.name}
                  </button>
                ))}
              </div>

              {/* Optional Cc Field */}
              {showCc && (
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 animate-fade-in">
                  <span className="text-xs font-bold text-slate-500 w-12 flex-shrink-0">Cc:</span>
                  <input
                    type="text"
                    value={ccInput}
                    onChange={(e) => setCcInput(e.target.value)}
                    placeholder="Cc recipients..."
                    className="flex-1 h-7 text-xs bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Subject Row */}
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 w-12 flex-shrink-0">Subject:</span>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Add a subject..."
                  className="flex-1 h-8 text-xs font-semibold bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  required
                />
              </div>

              {/* Rich Text Editor Toolbar */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl text-slate-500 text-xs">
                <button
                  type="button"
                  onClick={() => setComposeBody((prev) => `${prev}**bold** `)}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setComposeBody((prev) => `${prev}_italic_ `)}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setComposeBody((prev) => `${prev}<u>underlined</u> `)}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  title="Underline"
                >
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
                <button
                  type="button"
                  onClick={() => setComposeBody((prev) => `${prev}\n• `)}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  title="Bullet list"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setComposeBody((prev) => `${prev}\`code\` `)}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  title="Code snippet"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>

                <div className="ml-auto flex items-center gap-1.5 text-[10.5px]">
                  <span className="text-slate-400">Priority:</span>
                  <select
                    value={composeImportance}
                    onChange={(e) => setComposeImportance(e.target.value as any)}
                    className="h-6 px-1 text-[11px] rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">! High Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Message Body Textarea */}
              <div className="flex-1 min-h-[160px]">
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Write your email message here..."
                  rows={8}
                  className="w-full h-full p-3 text-xs bg-slate-50/50 dark:bg-[#101018] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0078D4]"
                  required
                />
              </div>

              {/* Attachments Section */}
              {composeAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {composeAttachments.map((att, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-[#0078D4]" />
                      <span>{att.name}</span>
                      <span className="text-[10px] text-slate-400">({att.size})</span>
                      <button
                        type="button"
                        onClick={() => setComposeAttachments(composeAttachments.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Modal Bottom Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleFiles = [
                        { name: 'Sprint_Report_Q3.pdf', size: '1.2 MB' },
                        { name: 'Architecture_Diagram.png', size: '850 KB' },
                      ];
                      setComposeAttachments([...composeAttachments, sampleFiles[composeAttachments.length % 2]]);
                      showToast('Attachment added');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-[#0078D4]" />
                    <span>Attach file</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0078D4] hover:bg-[#005A9E] text-white text-xs font-bold shadow-md shadow-[#0078D4]/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <span>Send</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0078D4] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-toast-slide">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
