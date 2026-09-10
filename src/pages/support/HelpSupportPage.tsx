import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  LifeBuoy,
  BookOpen,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const HelpSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqCategory, setActiveFaqCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('HR & Policies');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs: FaqItem[] = [
    {
      category: 'Attendance & Leave',
      question: 'How do I apply for casual or medical leave?',
      answer:
        'Navigate to the Leave module from the sidebar, click on "Apply Leave", select your leave type, dates, and submit. Your manager will be automatically notified to approve or review the request.',
    },
    {
      category: 'Attendance & Leave',
      question: 'What should I do if I forgot to Clock In or Clock Out?',
      answer:
        'You can submit a timesheet adjustment or regularisation request under the Timesheet tab within 48 hours, providing the reason for the missing punch.',
    },
    {
      category: 'Benefits & Health',
      question: 'How can I add dependents to my medical insurance?',
      answer:
        'Dependent enrollment windows are open during annual benefits cycles or within 30 days of a qualifying life event (marriage, childbirth). You can submit dependent identity documents via the Requests portal.',
    },
    {
      category: 'IT & Hardware',
      question: 'How do I request hardware upgrades or additional monitors?',
      answer:
        'Go to the Requests module, select "Hardware / Office Equipment", describe the specification needed, and submit. IT Operations will process the equipment requisition.',
    },
    {
      category: 'HR & Policies',
      question: 'How do I download an official employment verification letter?',
      answer:
        'Submit an Employment Certificate request under the Requests tab. Official stamped letters with salary tenure verification are generated within 24 hours.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketDescription('');
    }, 4000);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Employee Help & Support Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Knowledge base, frequently asked questions, HR inquiry desk, and support ticketing
          </p>
        </div>

        {/* Quick Chat Link */}
        <Link
          to="/chat"
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer w-fit"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Live HR Chat Desk</span>
        </Link>
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">HR Support Email</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">hr.support@acmecorp.com</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Emergency IT Helpline</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">+1 (800) 456-7890</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Support Hours</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mon - Fri, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Main Support Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQ Accordions & Search */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Frequently Asked Questions
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policy guides, leave rules, insurance..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['all', 'Attendance & Leave', 'Benefits & Health', 'IT & Hardware', 'HR & Policies'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFaqCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      activeFaqCategory === cat
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'All Questions' : cat}
                  </button>
                )
              )}
            </div>

            {/* FAQs List */}
            <div className="space-y-2 pt-1">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Submit Support Ticket Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-blue-600" />
                Submit a Support Ticket
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Can't find what you need? Send a message directly to the HR Support team.
              </p>
            </div>

            {ticketSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-semibold animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ticket #SUP-8492 created! HR team will respond within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="HR & Policies">HR & Company Policies</option>
                  <option value="Payroll & Tax">Compensation & Tax Queries</option>
                  <option value="Leave & Attendance">Leave & Timesheets</option>
                  <option value="IT Support">IT Hardware & Account Access</option>
                  <option value="Workplace Facilities">Office & Facilities</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of the inquiry"
                  className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Submit Ticket</span>
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
