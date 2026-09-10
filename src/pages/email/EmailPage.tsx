import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
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
} from 'lucide-react';

interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'important';
  badge?: string;
  attachments?: { name: string; size: string }[];
}

export const EmailPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'important'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // New Email form state
  const [toEmail, setToEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sentNotification, setSentNotification] = useState(false);

  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: 'em-1',
      sender: 'HR Operations Desk',
      senderEmail: 'hr.operations@acmecorp.com',
      subject: 'Annual Performance & Benefits Review 2025 Cycle Announcement',
      preview: 'Dear team, the 2025 Annual Performance Appraisal and Benefits enrollment window is now active...',
      body: `Dear Team,

We are pleased to announce the kick-off for our 2025 Annual Performance and Benefits cycle. Please review your compensation statements, updated health insurance coverages, and submit any dependent enrollment requests by September 30.

Key highlights:
• Comprehensive dental and vision upgrade
• Flexible wellness spending allowance
• Q3 milestone bonus payouts schedule

If you have any questions, feel free to reply directly to this thread or ping the HR Desk on Chat.

Best regards,
People & Culture Operations`,
      date: '10:30 AM',
      isRead: false,
      isStarred: true,
      folder: 'inbox',
      badge: 'HR',
      attachments: [{ name: 'Benefits_Brochure_2025.pdf', size: '2.1 MB' }],
    },
    {
      id: 'em-2',
      sender: 'David Vance (Director of Operations)',
      senderEmail: 'david.vance@acmecorp.com',
      subject: 'Q3 Town Hall & Enterprise Milestone Celebration',
      preview: 'Please join us this Thursday at 4:00 PM for our global Q3 all-hands meeting...',
      body: `Hi Everyone,

Please mark your calendars for this Thursday's Global All-Hands Townhall at 4:00 PM in the Main Auditorium & via video stream.

Agenda:
1. Executive Leadership Welcome & Financial Highlights
2. Department Showcases & Product Innovations
3. Employee Recognition Awards & Celebrations

Looking forward to seeing everyone there!

David Vance
Director of Operations`,
      date: 'Yesterday',
      isRead: true,
      isStarred: false,
      folder: 'inbox',
      badge: 'Company',
    },
    {
      id: 'em-3',
      sender: 'IT & Security Desk',
      senderEmail: 'security@acmecorp.com',
      subject: 'Mandatory Quarterly Two-Factor Security Checkup',
      preview: 'A quick reminder to verify that your 2FA devices and security keys are properly updated...',
      body: `Hello,

This is a periodic security alert reminder to verify your Two-Factor Authentication credentials and security keys. As part of our SOC2 compliance requirements, please confirm your active work session credentials.

Thank you for helping keep our company data secure.

IT Information Security Team`,
      date: 'Sep 08',
      isRead: true,
      isStarred: false,
      folder: 'inbox',
      badge: 'Security',
    },
    {
      id: 'em-4',
      sender: 'You',
      senderEmail: currentUser.email,
      subject: 'Sprint 24 Architecture Proposal & API Schema',
      preview: 'Hi Amit, attached is the revised API specification document for the payroll adjustments pipeline...',
      body: `Hi Amit,

Attached is the finalized API schema for the payroll adjustments pipeline. All edge cases discussed during grooming have been addressed.

Let me know if you have any feedback before we merge the pull request.

Regards,
${currentUser.name}`,
      date: 'Sep 06',
      isRead: true,
      isStarred: true,
      folder: 'sent',
      attachments: [{ name: 'API_Spec_v2.4.json', size: '340 KB' }],
    },
  ]);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    );
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !emailSubject) return;

    const newMail: EmailItem = {
      id: `em-${Date.now()}`,
      sender: 'You',
      senderEmail: currentUser.email,
      subject: emailSubject,
      preview: emailBody.slice(0, 80) + '...',
      body: emailBody,
      date: 'Just now',
      isRead: true,
      isStarred: false,
      folder: 'sent',
    };

    setEmails((prev) => [newMail, ...prev]);
    setIsComposeOpen(false);
    setToEmail('');
    setEmailSubject('');
    setEmailBody('');
    setSentNotification(true);
    setTimeout(() => setSentNotification(false), 3500);
  };

  const filteredEmails = emails.filter((em) => {
    const matchesFolder =
      activeFolder === 'important' ? em.isStarred : em.folder === activeFolder;
    const matchesSearch =
      em.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      em.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const unreadInboxCount = emails.filter((e) => e.folder === 'inbox' && !e.isRead).length;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-3">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Company Email & Communications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Internal corporate correspondence, announcements, and document dispatches
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Compose Email</span>
        </button>
      </div>

      {sentNotification && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Email successfully sent to recipients!</span>
        </div>
      )}

      {/* Main Mail Container */}
      <div className="flex-1 min-h-0 grid grid-cols-12 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Left Folder Navigation Column */}
        <div className="col-span-3 lg:col-span-2 border-r border-slate-200/80 dark:border-slate-800 p-3 space-y-1 bg-slate-50/50 dark:bg-slate-950/30">
          <button
            onClick={() => {
              setActiveFolder('inbox');
              setSelectedEmail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'inbox'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
            </div>
            {unreadInboxCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFolder === 'inbox' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
              }`}>
                {unreadInboxCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveFolder('sent');
              setSelectedEmail(null);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'sent'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Sent</span>
          </button>

          <button
            onClick={() => {
              setActiveFolder('drafts');
              setSelectedEmail(null);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'drafts'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Drafts</span>
          </button>

          <button
            onClick={() => {
              setActiveFolder('important');
              setSelectedEmail(null);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeFolder === 'important'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Important</span>
          </button>
        </div>

        {/* Middle Email List */}
        <div className={`${selectedEmail ? 'col-span-4' : 'col-span-9 lg:col-span-10'} border-r border-slate-200/80 dark:border-slate-800 flex flex-col`}>
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeFolder}...`}
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Email Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No emails found in this folder.
              </div>
            ) : (
              filteredEmails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                return (
                  <div
                    key={em.id}
                    onClick={() => {
                      setSelectedEmail(em);
                      // Mark as read
                      setEmails((prev) =>
                        prev.map((e) => (e.id === em.id ? { ...e, isRead: true } : e))
                      );
                    }}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/40 border-l-3 border-blue-600'
                        : !em.isRead
                        ? 'bg-white dark:bg-slate-900/50 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <button
                      onClick={(e) => toggleStar(em.id, e)}
                      className={`mt-0.5 transition-colors cursor-pointer ${
                        em.isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${em.isStarred ? 'fill-current' : ''}`} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${!em.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                          {em.sender}
                        </span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{em.date}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${!em.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {em.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {em.preview}
                      </p>
                      {em.attachments && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                          <Paperclip className="h-3 w-3" />
                          <span>{em.attachments.length} attachment</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Email Preview Reader */}
        {selectedEmail && (
          <div className="col-span-5 lg:col-span-6 flex flex-col h-full bg-white dark:bg-[#0F172A] p-5 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Close Reader
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleStar(selectedEmail.id, e)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    selectedEmail.isStarred ? 'text-amber-500 border-amber-200' : 'text-slate-400 border-slate-200'
                  }`}
                >
                  <Star className={`h-4 w-4 ${selectedEmail.isStarred ? 'fill-current' : ''}`} />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedEmail.subject}
                </h2>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedEmail.sender}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">&lt;{selectedEmail.senderEmail}&gt;</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{selectedEmail.date}</span>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line pt-2">
                {selectedEmail.body}
              </div>

              {selectedEmail.attachments && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.attachments.map((att, idx) => (
                      <div key={idx} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2 text-xs">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{att.name}</p>
                          <p className="text-[9.5px] text-slate-400">{att.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3 animate-modal-pop">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Compose Corporate Email
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  To (Recipient Email)
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="colleague@acmecorp.com"
                  className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Meeting agenda / Project update..."
                  className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  Message Body
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                  placeholder="Write your email here..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Add Attachment
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
