import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  PhoneOff,
  PhoneCall,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  Hand,
  MoreVertical,
  MoreHorizontal,
  Shield,
  Hash,
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  CheckCheck,
  Circle,
  Calendar,
  CalendarPlus,
  Clock,
  Sparkles,
  Plus,
  X,
  Heart,
  ThumbsUp,
  BarChart2,
  Check,
  Bell,
  AlertCircle,
  Maximize2,
  Minimize2,
  Settings,
  Sticker,
  Volume2,
  VolumeX,
  Pin,
  Reply,
  Copy,
  Eye,
  Share2,
  Gift,
  Award,
  Bold,
  Italic,
  Strikethrough,
  List,
  Code,
} from 'lucide-react';

// ============================================================================
// DATA MODELS & INTERFACES
// ============================================================================

export type MessageType = 'text' | 'file' | 'gif' | 'sticker' | 'praise' | 'poll' | 'meeting';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  timestamp: string;
  isMe?: boolean;
  isImportant?: boolean;
  isUrgent?: boolean;
  type?: MessageType;
  text: string;
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'excel' | 'word' | 'image' | 'code';
    url?: string;
  };
  gifUrl?: string;
  stickerUrl?: string;
  praise?: {
    badge: string;
    recipientName: string;
    message: string;
  };
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
  };
  meeting?: {
    title: string;
    date: string;
    time: string;
    duration: string;
    link: string;
  };
  reactions?: MessageReaction[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'team' | 'direct' | 'hr' | 'group';
  avatar?: string;
  unreadCount?: number;
  lastMessage: string;
  time: string;
  online?: boolean;
  statusText?: string;
  role?: string;
  isPinned?: boolean;
  membersCount?: number;
}

// Preset GIF options for Teams GIF picker
const TEAMS_GIFS = [
  { id: 'g1', title: 'Thumbs Up Good Job', url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=300&auto=format&fit=crop&q=80', tag: 'Great job team!' },
  { id: 'g2', title: 'Celebration Confetti', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80', tag: 'Sprint Goal Met! 🎉' },
  { id: 'g3', title: 'Coffee Time', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80', tag: 'Taking a coffee break ☕' },
  { id: 'g4', title: 'Brainstorming / Ideas', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&auto=format&fit=crop&q=80', tag: 'Smart solution! 💡' },
  { id: 'g5', title: 'Team High Five', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80', tag: 'High five everyone! ✋' },
  { id: 'g6', title: 'Coding & Focus', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80', tag: 'Deploying changes... 🚀' },
];

// Preset Emojis
const EMOJI_CATEGORIES = [
  { name: 'Frequently Used', emojis: ['👍', '❤️', '🎉', '👏', '🚀', '🔥', '😊', '💡'] },
  { name: 'Smileys & Reactions', emojis: ['😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😉', '😇', '🥰', '😍', '🤩', '😘', '😋', '😎', '🥳', '🤔', '😐', '🤐', '😴'] },
  { name: 'Work & Gestures', emojis: ['👍', '👎', '👏', '🙌', '🤝', '👋', '✌️', '🤞', '💪', '🙏', '💻', '📱', '📊', '📁', '📅', '📝', '📌', '🎯', '☕', '⭐'] },
];

// Preset Praise Badges
const PRAISE_BADGES = [
  { id: 'team-player', label: 'Team Player', icon: '🤝', desc: 'Always stepping in to collaborate and help others thrive.' },
  { id: 'problem-solver', label: 'Problem Solver', icon: '🧩', desc: 'Cracking complex engineering and product blockers with ease.' },
  { id: 'awesome-work', label: 'Awesome Work', icon: '🌟', desc: 'Consistently high quality deliverables and attention to detail.' },
  { id: 'leadership', label: 'Leadership', icon: '👑', desc: 'Inspiring, guiding, and mentoring teammates toward success.' },
];

export const ChatPage: React.FC = () => {
  const { currentUser } = useAppStore();

  // State: Active Navigation & Channels
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'team' | 'hr'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>('c-team-general');
  const [channelViewTab, setChannelViewTab] = useState<'chat' | 'files' | 'notes'>('chat');
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);

  // State: Message Composer
  const [newMessage, setNewMessage] = useState('');
  const [messageUrgency, setMessageUrgency] = useState<'standard' | 'important' | 'urgent'>('standard');
  const [isFormattingOpen, setIsFormattingOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: 'pdf' | 'excel' | 'word' | 'image' | 'code' } | null>(null);

  // Popovers & Drawers
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [isPraiseModalOpen, setIsPraiseModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  // Modals for Calling & Video Conferencing
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [callReactions, setCallReactions] = useState<{ id: number; emoji: string }[]>([]);

  // Forms state
  const [praiseRecipient, setPraiseRecipient] = useState('Amit Verma');
  const [selectedBadge, setSelectedBadge] = useState('team-player');
  const [praiseMessage, setPraiseMessage] = useState('');

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  const [meetingTitle, setMeetingTitle] = useState('Sprint Planning & Architecture Sync');
  const [meetingDate, setMeetingDate] = useState('Tomorrow');
  const [meetingTime, setMeetingTime] = useState('11:00 AM - 12:00 PM');

  // Channels List (Teams Style)
  const [channels, setChannels] = useState<ChatChannel[]>([
    {
      id: 'c-team-general',
      name: 'General Standup & Architecture',
      type: 'team',
      isPinned: true,
      lastMessage: 'Rahul: Updated the Q3 sprint plan doc.',
      time: '11:42 AM',
      unreadCount: 2,
      membersCount: 18,
    },
    {
      id: 'c-team-eng',
      name: 'Engineering Squad Alpha',
      type: 'team',
      isPinned: true,
      lastMessage: 'Sneha: Production deploy completed smoothly.',
      time: '10:15 AM',
      unreadCount: 0,
      membersCount: 14,
    },
    {
      id: 'c-hr-desk',
      name: 'HR Confidential & Benefits Desk',
      type: 'hr',
      isPinned: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Your annual leave application has been approved.',
      time: 'Yesterday',
      unreadCount: 1,
      role: 'HR People Ops Lead',
      online: true,
      statusText: 'Available | People Operations',
    },
    {
      id: 'c-direct-amit',
      name: 'Amit Verma',
      type: 'direct',
      isPinned: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Let us sync on the client feedback at 2 PM.',
      time: '09:30 AM',
      unreadCount: 0,
      role: 'Engineering Manager',
      online: true,
      statusText: 'Available | Focus Mode',
    },
    {
      id: 'c-direct-elena',
      name: 'Elena Rostova',
      type: 'direct',
      isPinned: false,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Shared candidate profiles for the frontend opening.',
      time: 'Yesterday',
      unreadCount: 0,
      role: 'Lead Talent Acquisition',
      online: false,
      statusText: 'Away | In Meetings',
    },
    {
      id: 'c-group-launch',
      name: '🚀 Project Pegasus Launch Squad',
      type: 'group',
      isPinned: false,
      lastMessage: 'David: Beta testing signups reached 1,200!',
      time: 'Aug 28',
      unreadCount: 0,
      membersCount: 22,
    },
  ]);

  // Messages per channel
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({
    'c-team-general': [
      {
        id: 'm-1',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        text: 'Morning team! Let us review the sprint velocity and release targets during today standup.',
        timestamp: '10:05 AM',
        reactions: [{ emoji: '👍', count: 4, users: ['Elena Rostova', 'David Chen'] }],
      },
      {
        id: 'm-2',
        senderId: 'u-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Lead Recruiter',
        text: 'Two senior engineering candidates will be joining round 2 interviews today at 3:00 PM.',
        timestamp: '10:14 AM',
        reactions: [{ emoji: '👏', count: 2, users: ['Amit Verma'] }],
      },
      {
        id: 'm-3',
        senderId: 'u-me',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Senior Staff Engineer',
        text: 'I have finalized the backend endpoints and shared the architecture document for everyone to review.',
        timestamp: '11:20 AM',
        isMe: true,
        type: 'file',
        attachment: {
          name: 'Microservices_Architecture_v2.pdf',
          size: '3.4 MB',
          type: 'pdf',
        },
        reactions: [{ emoji: '🔥', count: 3, users: ['Amit Verma', 'Sneha Gupta'] }],
      },
      {
        id: 'm-4',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        text: 'Great initiative! Adding the architecture diagram link to our meeting agenda.',
        timestamp: '11:42 AM',
        reactions: [{ emoji: '❤️', count: 2, users: ['Elena Rostova'] }],
      },
      {
        id: 'm-5',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        text: 'Quick poll for deployment schedule:',
        timestamp: '11:45 AM',
        type: 'poll',
        poll: {
          question: 'Should we schedule the v2.4 Release cut for Thursday evening or Friday morning?',
          options: [
            { id: 'opt-1', text: 'Thursday 6:00 PM (Recommended)', votes: 7, votedUserIds: ['u-me', 'u-amit'] },
            { id: 'opt-2', text: 'Friday 9:30 AM', votes: 2, votedUserIds: [] },
          ],
          totalVotes: 9,
        },
      },
    ],
    'c-hr-desk': [
      {
        id: 'm-hr-1',
        senderId: 'u-hr',
        senderName: 'Sneha Gupta',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        senderRole: 'HR People Ops Lead',
        text: 'Hello! Your medical insurance card and annual benefit document are ready for download.',
        timestamp: 'Yesterday 3:15 PM',
        type: 'file',
        attachment: {
          name: 'Health_Insurance_Policy_2025.pdf',
          size: '1.8 MB',
          type: 'pdf',
        },
      },
      {
        id: 'm-hr-2',
        senderId: 'u-hr',
        senderName: 'Sneha Gupta',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        senderRole: 'HR People Ops Lead',
        text: 'Your annual leave application for next month has also been approved.',
        timestamp: 'Yesterday 3:16 PM',
      },
    ],
    'c-direct-amit': [
      {
        id: 'm-da-1',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        text: 'Hey! Are you free for a quick 10-minute sync on the client security audit?',
        timestamp: '09:25 AM',
      },
      {
        id: 'm-da-2',
        senderId: 'u-me',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'Sure! Let us jump on a quick call right now.',
        timestamp: '09:28 AM',
        isMe: true,
      },
    ],
  });

  const activeChannel = channels.find((c) => c.id === activeChatId) || channels[0];
  const activeMessages = messages[activeChatId] || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Call timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isAudioCallOpen || isVideoCallOpen) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAudioCallOpen, isVideoCallOpen]);

  // Format call seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !attachedFile) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'Senior Staff Engineer',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isImportant: messageUrgency === 'important',
      isUrgent: messageUrgency === 'urgent',
      type: attachedFile ? 'file' : 'text',
      attachment: attachedFile ? attachedFile : undefined,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setNewMessage('');
    setAttachedFile(null);
    setMessageUrgency('standard');
    setIsFormattingOpen(false);
  };

  // Handle Quick Reactions
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChatId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || [];
        const existingIdx = currentReactions.findIndex((r) => r.emoji === emoji);
        if (existingIdx > -1) {
          const updatedReactions = [...currentReactions];
          updatedReactions[existingIdx].count += 1;
          return { ...m, reactions: updatedReactions };
        } else {
          return { ...m, reactions: [...currentReactions, { emoji, count: 1, users: ['You'] }] };
        }
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Handle Poll Voting
  const handleVotePoll = (messageId: string, optionId: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChatId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId || !m.poll) return m;
        const alreadyVoted = m.poll.options.some((o) => o.votedUserIds.includes('u-me'));
        if (alreadyVoted) return m;

        const updatedOptions = m.poll.options.map((o) => {
          if (o.id === optionId) {
            return { ...o, votes: o.votes + 1, votedUserIds: [...o.votedUserIds, 'u-me'] };
          }
          return o;
        });

        return {
          ...m,
          poll: {
            ...m.poll,
            options: updatedOptions,
            totalVotes: m.poll.totalVotes + 1,
          },
        };
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Send Preset GIF
  const handleSendGif = (gif: typeof TEAMS_GIFS[0]) => {
    const msg: ChatMessage = {
      id: `gif-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: gif.tag,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'gif',
      gifUrl: gif.url,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));
    setIsGifPickerOpen(false);
  };

  // Send Praise Card
  const handleSendPraise = () => {
    const badgeObj = PRAISE_BADGES.find((b) => b.id === selectedBadge) || PRAISE_BADGES[0];
    const msg: ChatMessage = {
      id: `praise-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: `Awarded ${praiseRecipient} with the ${badgeObj.label} Badge!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'praise',
      praise: {
        badge: badgeObj.label,
        recipientName: praiseRecipient,
        message: praiseMessage || badgeObj.desc,
      },
    };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));
    setIsPraiseModalOpen(false);
    setPraiseMessage('');
  };

  // Send Poll
  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim()) return;
    const msg: ChatMessage = {
      id: `poll-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: pollQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'poll',
      poll: {
        question: pollQuestion,
        options: [
          { id: 'opt-1', text: pollOption1, votes: 0, votedUserIds: [] },
          { id: 'opt-2', text: pollOption2, votes: 0, votedUserIds: [] },
        ],
        totalVotes: 0,
      },
    };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));
    setIsPollModalOpen(false);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
  };

  // Send Scheduled Meeting Card
  const handleScheduleMeeting = () => {
    const msg: ChatMessage = {
      id: `meet-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: `Scheduled a Microsoft Teams Meeting: ${meetingTitle}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'meeting',
      meeting: {
        title: meetingTitle,
        date: meetingDate,
        time: meetingTime,
        duration: '45 mins',
        link: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_xyz',
      },
    };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));
    setIsMeetingModalOpen(false);
  };

  // Filtered Channels
  const filteredChannels = channels.filter((c) => {
    if (activeTab !== 'all' && c.type !== activeTab) return false;
    if (searchQuery.trim()) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-2 animate-page-enter">
      {/* =======================================================================
          TOP TEAMS HEADER BAR
         ======================================================================= */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          {/* Teams Style Purple Badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Teams Chat & Calling
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                Enterprise v2.5
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time collaboration, video calling, meetings, attachments, stickers, and polls.
            </p>
          </div>
        </div>

        {/* Global Action CTA Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <CalendarPlus className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Schedule Meeting</span>
          </button>

          <button
            onClick={() => setIsVideoCallOpen(true)}
            className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Meet Now</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
          MAIN 2-COLUMN TEAMS WORKSPACE
         ======================================================================= */}
      <div className="flex-1 min-h-0 grid grid-cols-12 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* =====================================================================
            LEFT COLUMN: TEAMS CHANNELS & DIRECT CHAT LIST (3.5 COLS)
           ===================================================================== */}
        <div className="col-span-4 lg:col-span-3.5 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-white dark:bg-[#0F172A]">
          
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Chat & Channels
              </span>
              <button
                onClick={() => {
                  const name = prompt('Enter new group or channel name:');
                  if (name) {
                    const newChan: ChatChannel = {
                      id: `c-team-${Date.now()}`,
                      name: `# ${name.toLowerCase().replace(/\s+/g, '-')}`,
                      type: 'team',
                      lastMessage: 'Channel created. Start collaborating!',
                      time: 'Just now',
                      membersCount: 5,
                    };
                    setChannels([newChan, ...channels]);
                    setActiveChatId(newChan.id);
                  }
                }}
                title="Create New Channel"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, teams, tags..."
                className="w-full h-8 pl-8.5 pr-3 text-xs bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: 'Recent' },
                { id: 'team', label: 'Teams' },
                { id: 'direct', label: 'Direct' },
                { id: 'hr', label: 'HR Desk' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Channel & DM List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
            {filteredChannels.map((channel) => {
              const isActive = channel.id === activeChatId;
              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChatId(channel.id);
                    setChannelViewTab('chat');
                  }}
                  className={cn(
                    'w-full text-left p-2.5 sm:p-3 flex items-start gap-2.5 transition-colors cursor-pointer group',
                    isActive
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border-l-3 border-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  )}
                >
                  {/* Channel / DM Avatar */}
                  {channel.type === 'team' || channel.type === 'group' ? (
                    <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                      <Hash className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="relative flex-shrink-0">
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {channel.online ? (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>
                  )}

                  {/* Channel Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-xs truncate',
                          isActive
                            ? 'font-bold text-blue-700 dark:text-blue-300'
                            : 'font-semibold text-slate-800 dark:text-slate-200'
                        )}
                      >
                        {channel.name}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1 flex-shrink-0">
                        {channel.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {channel.lastMessage}
                    </p>
                  </div>

                  {/* Unread Counter */}
                  {channel.unreadCount ? (
                    <span className="h-4.5 min-w-4.5 px-1.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {channel.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: ACTIVE CHAT CONVERSATION / TABS (8.5 COLS)
           ===================================================================== */}
        <div className="col-span-8 lg:col-span-8.5 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950/30 min-w-0">
          
          {/* Active Thread Teams Header */}
          <div className="h-14 px-4 bg-white dark:bg-[#0F172A] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {activeChannel.type === 'team' || activeChannel.type === 'group' ? (
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  <Hash className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <div className="relative flex-shrink-0">
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {activeChannel.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                  <span className="truncate">{activeChannel.name}</span>
                  {activeChannel.type === 'hr' && (
                    <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[9px] font-bold flex items-center gap-1 flex-shrink-0">
                      <Shield className="w-2.5 h-2.5" /> Confidential
                    </span>
                  )}
                </h3>
                <p className="text-[10.5px] text-slate-400 truncate">
                  {activeChannel.role || (activeChannel.type === 'team' ? `${activeChannel.membersCount || 12} members • 5 online` : 'Direct Conversation')}
                </p>
              </div>
            </div>

            {/* Teams Header Calling & Collaboration Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {/* Audio Call */}
              <button
                onClick={() => setIsAudioCallOpen(true)}
                title="Start Audio Call"
                className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline">Call</span>
              </button>

              {/* Video Call */}
              <button
                onClick={() => setIsVideoCallOpen(true)}
                title="Start Teams Video Call"
                className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors cursor-pointer text-xs font-bold"
              >
                <Video className="h-4 w-4" />
                <span className="hidden md:inline">Video</span>
              </button>

              {/* Toggle Info / Members */}
              <button
                onClick={() => setShowMemberDrawer(!showMemberDrawer)}
                title="Channel Details & Members"
                className={cn(
                  'p-2 rounded-xl transition-colors cursor-pointer',
                  showMemberDrawer
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Tabs (Chat, Files, Meeting Notes) */}
          <div className="h-9 px-4 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 h-full">
              <button
                onClick={() => setChannelViewTab('chat')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'chat'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setChannelViewTab('files')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'files'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Shared Files</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold">
                  3
                </span>
              </button>

              <button
                onClick={() => setChannelViewTab('notes')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'notes'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Meeting Notes</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="hidden sm:inline">Protected by End-to-End Enterprise Encryption</span>
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* ===================================================================
              TAB VIEW 1: CHAT MESSAGE STREAM
             =================================================================== */}
          {channelViewTab === 'chat' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 group animate-toast-slide ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Sender Avatar */}
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs"
                  />

                  {/* Message Bubble Container */}
                  <div className={`max-w-[85%] sm:max-w-lg ${msg.isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    {/* Header: Sender Name + Role + Timestamp */}
                    <div className={`flex items-center gap-2 mb-1 text-[11px] ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {msg.senderName}
                      </span>
                      {msg.senderRole && (
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          ({msg.senderRole})
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={cn(
                        'relative rounded-2xl p-3 text-xs leading-relaxed shadow-xs transition-all text-left',
                        msg.isUrgent && 'border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100',
                        msg.isImportant && !msg.isUrgent && 'border-l-4 border-l-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-slate-900 dark:text-white',
                        !msg.isUrgent && !msg.isImportant && (
                          msg.isMe
                            ? 'bg-blue-600 text-white rounded-tr-xs hover:shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs hover:border-slate-300'
                        )
                      )}
                    >
                      {/* Urgent Banner */}
                      {msg.isUrgent && (
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-[10.5px] mb-1.5">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>URGENT NOTIFICATION</span>
                        </div>
                      )}

                      {/* Text */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Attachment Card if present */}
                      {msg.attachment && (
                        <div
                          className={cn(
                            'mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-3',
                            msg.isMe
                              ? 'bg-blue-700/60 border-blue-500/60 text-white'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          )}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="p-2 rounded-lg bg-white/15 flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="truncate text-xs font-bold leading-tight">{msg.attachment.name}</p>
                              <p className="text-[10px] opacity-75">{msg.attachment.size} • {msg.attachment.type.toUpperCase()}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Downloading ${msg.attachment?.name}...`)}
                            title="Download document"
                            className="p-1.5 hover:bg-black/15 dark:hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* GIF Image Preview */}
                      {msg.type === 'gif' && msg.gifUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200/60 max-w-xs shadow-xs">
                          <img src={msg.gifUrl} alt="GIF" className="w-full h-40 object-cover" />
                        </div>
                      )}

                      {/* Praise Card Preview */}
                      {msg.type === 'praise' && msg.praise && (
                        <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-slate-900 dark:from-amber-950/40 dark:to-orange-950/40 dark:border-amber-800/60 dark:text-white">
                          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                            <Award className="h-4 w-4" />
                            <span>Teams Recognition: {msg.praise.badge}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                            Recipient: <span className="text-blue-600 dark:text-blue-400 font-bold">{msg.praise.recipientName}</span>
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-0.5">
                            "{msg.praise.message}"
                          </p>
                        </div>
                      )}

                      {/* Interactive Poll Card */}
                      {msg.type === 'poll' && msg.poll && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                              <BarChart2 className="h-3.5 w-3.5" /> Teams Live Poll
                            </span>
                            <span className="text-[10px] text-slate-400">{msg.poll.totalVotes} votes</span>
                          </div>

                          <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{msg.poll.question}</p>

                          <div className="space-y-1.5">
                            {msg.poll.options.map((opt) => {
                              const pct = msg.poll?.totalVotes ? Math.round((opt.votes / msg.poll.totalVotes) * 100) : 0;
                              const hasVoted = opt.votedUserIds.includes('u-me');
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleVotePoll(msg.id, opt.id)}
                                  className={cn(
                                    'w-full text-left p-2 rounded-lg border text-xs transition-all relative overflow-hidden cursor-pointer group',
                                    hasVoted
                                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                                      : 'border-slate-200 hover:border-blue-400 bg-white dark:bg-slate-800'
                                  )}
                                >
                                  {/* Progress bar fill */}
                                  <div
                                    className="absolute inset-y-0 left-0 bg-blue-100 dark:bg-blue-900/40 transition-all duration-300 pointer-events-none"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="relative flex items-center justify-between z-10">
                                    <span className="font-medium">{opt.text}</span>
                                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{pct}% ({opt.votes})</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Scheduled Meeting Card */}
                      {msg.type === 'meeting' && msg.meeting && (
                        <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800 text-slate-900 dark:text-white space-y-2">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                            <Video className="h-4 w-4" />
                            <span>Teams Video Meeting</span>
                          </div>
                          <h4 className="font-bold text-xs">{msg.meeting.title}</h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            📅 {msg.meeting.date} • 🕒 {msg.meeting.time}
                          </p>
                          <button
                            onClick={() => setIsVideoCallOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Video className="h-3 w-3" />
                            <span>Join Teams Meeting</span>
                          </button>
                        </div>
                      )}

                      {/* Floating Teams Reaction Bar on Hover */}
                      <div className="absolute -top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-md p-0.5 flex items-center gap-1 z-10">
                        {['👍', '❤️', '😂', '🎉', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs transition-transform hover:scale-125 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reactions Display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.reactions.map((r, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleAddReaction(msg.id, r.emoji)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10.5px] text-slate-600 dark:text-slate-300 shadow-2xs cursor-pointer hover:border-blue-400"
                          >
                            <span>{r.emoji}</span>
                            <span className="font-bold">{r.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ===================================================================
              TAB VIEW 2: FILES REPOSITORY
             =================================================================== */}
          {channelViewTab === 'files' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  Shared Documents & Artifacts
                </h4>
                <button
                  onClick={() => setIsAttachmentModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { name: 'Microservices_Architecture_v2.pdf', size: '3.4 MB', author: 'You', date: 'Today at 11:20 AM', type: 'pdf' },
                  { name: 'Sprint_Backlog_Q3_Deliverables.xlsx', size: '1.2 MB', author: 'Amit Verma', date: 'Yesterday', type: 'excel' },
                  { name: 'Health_Insurance_Policy_2025.pdf', size: '1.8 MB', author: 'Sneha Gupta', date: 'Yesterday', type: 'pdf' },
                ].map((file, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                        <p className="text-[10px] text-slate-400">Shared by {file.author} • {file.date} • {file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${file.name}...`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB VIEW 3: MEETING NOTES
             =================================================================== */}
          {channelViewTab === 'notes' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Sprint Standup Action Items (Today)
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>API Gateway rate-limiting rollout planned for Thursday night.</li>
                  <li>Elena to schedule second round for Frontend Lead candidates.</li>
                  <li>Verify compliance with medical card enrollment by end of week.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ===================================================================
              TEAMS-STYLE RICH MESSAGE COMPOSER & ACTION TOOLBAR (BOTTOM)
             =================================================================== */}
          <div className="p-3 bg-white dark:bg-[#0F172A] border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0">
            
            {/* Attached file chip preview if user selected one */}
            {attachedFile && (
              <div className="mb-2 p-2 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Paperclip className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-bold">{attachedFile.name}</span>
                  <span className="text-[10px] text-blue-500">({attachedFile.size})</span>
                </div>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Rich Formatting Toolbar (Expandable) */}
            {isFormattingOpen && (
              <div className="flex items-center gap-1 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2 text-slate-500">
                <button
                  type="button"
                  onClick={() => setNewMessage((prev) => `${prev}**bold** `)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage((prev) => `${prev}_italic_ `)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage((prev) => `${prev}~strike~ `)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Strikethrough"
                >
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage((prev) => `${prev}\n• `)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Bullet List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage((prev) => `${prev}\`code\` `)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Code snippet"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
                <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                <span className="text-[10px] text-slate-400">Markdown formatting enabled</span>
              </div>
            )}

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Reply in ${activeChannel.name}...`}
                  className={cn(
                    'flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all',
                    messageUrgency === 'urgent'
                      ? 'border-rose-400 ring-2 ring-rose-200'
                      : messageUrgency === 'important'
                      ? 'border-amber-400'
                      : 'border-slate-200 dark:border-slate-700'
                  )}
                />

                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>

              {/* Teams Action Bar Icons (Format, Priority, Attach, Emoji, GIF, Sticker, Poll, Meeting) */}
              <div className="flex items-center justify-between pt-1 text-slate-500">
                <div className="flex items-center gap-1">
                  {/* Format Toggle A */}
                  <button
                    type="button"
                    onClick={() => setIsFormattingOpen(!isFormattingOpen)}
                    title="Rich text formatting"
                    className={cn(
                      'p-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer',
                      isFormattingOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    A
                  </button>

                  {/* Priority / Delivery options */}
                  <button
                    type="button"
                    onClick={() => {
                      if (messageUrgency === 'standard') setMessageUrgency('important');
                      else if (messageUrgency === 'important') setMessageUrgency('urgent');
                      else setMessageUrgency('standard');
                    }}
                    title={`Delivery options (Currently: ${messageUrgency})`}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors cursor-pointer',
                      messageUrgency === 'urgent' && 'text-rose-600 bg-rose-50',
                      messageUrgency === 'important' && 'text-amber-600 bg-amber-50',
                      messageUrgency === 'standard' && 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>

                  {/* Attach Document */}
                  <button
                    type="button"
                    onClick={() => setIsAttachmentModalOpen(true)}
                    title="Attach file or document"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  {/* Emoji Picker Popover Toggle */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmojiPickerOpen(!isEmojiPickerOpen);
                        setIsGifPickerOpen(false);
                      }}
                      title="Emojis"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Smile className="h-4 w-4" />
                    </button>

                    {isEmojiPickerOpen && (
                      <div className="absolute bottom-10 left-0 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-dark-border dark:bg-dark-card z-50 text-xs animate-toast-slide">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                          <span className="font-bold text-slate-800 dark:text-white">Reactions & Emojis</span>
                          <button onClick={() => setIsEmojiPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {EMOJI_CATEGORIES.map((cat) => (
                            <div key={cat.name}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{cat.name}</p>
                              <div className="grid grid-cols-6 gap-1">
                                {cat.emojis.map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      setNewMessage((prev) => `${prev} ${emoji} `);
                                      setIsEmojiPickerOpen(false);
                                    }}
                                    className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-sm cursor-pointer"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GIF Picker Popover Toggle */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsGifPickerOpen(!isGifPickerOpen);
                        setIsEmojiPickerOpen(false);
                      }}
                      title="Teams Animated GIFs"
                      className="p-1.5 rounded-lg text-xs font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      GIF
                    </button>

                    {isGifPickerOpen && (
                      <div className="absolute bottom-10 left-0 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-dark-border dark:bg-dark-card z-50 text-xs animate-toast-slide">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                          <span className="font-bold text-slate-800 dark:text-white">Teams GIFs</span>
                          <button onClick={() => setIsGifPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {TEAMS_GIFS.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => handleSendGif(g)}
                              className="rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 text-left transition-all cursor-pointer group"
                            >
                              <img src={g.url} alt={g.title} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
                              <span className="block p-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                {g.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stickers & Praise Badges */}
                  <button
                    type="button"
                    onClick={() => setIsPraiseModalOpen(true)}
                    title="Send Praise / Sticker"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Award className="h-4 w-4 text-amber-500" />
                  </button>

                  {/* Create Quick Poll */}
                  <button
                    type="button"
                    onClick={() => setIsPollModalOpen(true)}
                    title="Create Team Poll"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                  </button>

                  {/* Schedule Meeting */}
                  <button
                    type="button"
                    onClick={() => setIsMeetingModalOpen(true)}
                    title="Schedule Microsoft Teams Meeting"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-indigo-500" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400">
                  <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Enter</kbd> to send</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================================
            OPTIONAL RIGHT SLIDE-OUT DRAWER: MEMBERS & CHANNEL DETAILS
           ===================================================================== */}
        {showMemberDrawer && (
          <div className="hidden xl:block col-span-3 border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white">Channel Roster</h4>
              <button onClick={() => setShowMemberDrawer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Active Members</p>
              {[
                { name: 'Amit Verma', role: 'Engineering Manager', status: 'Available', online: true },
                { name: 'Elena Rostova', role: 'Talent Acquisition', status: 'In a Call', online: true },
                { name: 'Sneha Gupta', role: 'People Operations', status: 'Available', online: true },
                { name: 'David Chen', role: 'Site Reliability', status: 'Busy', online: true },
                { name: 'Priya Sharma', role: 'UX Specialist', status: 'Offline', online: false },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                        {m.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className={cn('absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white', m.online ? 'bg-emerald-500' : 'bg-slate-300')} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.role}</p>
                    </div>
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-medium">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =======================================================================
          MODAL 1: MICROSOFT TEAMS AUDIO CALL SCREEN
         ======================================================================= */}
      {isAudioCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fade-in p-4">
          <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 text-center flex flex-col items-center space-y-6">
            
            {/* Call Header */}
            <div className="flex items-center justify-between w-full text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="h-3.5 w-3.5" /> High-Definition Teams Call
              </span>
              <span className="font-mono text-sm font-bold text-white">{formatTime(callDuration)}</span>
            </div>

            {/* Pulsing Avatar */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute w-28 h-28 rounded-full bg-blue-600/30 animate-pulse" />
              <img
                src={activeChannel.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'}
                alt={activeChannel.name}
                className="relative w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-xl"
              />
            </div>

            {/* Name & Call State */}
            <div>
              <h3 className="text-lg font-bold text-white">{activeChannel.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {isMicMuted ? 'Microphone Muted' : 'Speaking • High Audio Quality'}
              </p>
            </div>

            {/* In-Call Action Pill Controls */}
            <div className="flex items-center gap-4 pt-4">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={cn(
                  'p-3.5 rounded-full transition-all cursor-pointer',
                  isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
                title={isMicMuted ? 'Unmute' : 'Mute'}
              >
                {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={() => setIsAudioCallOpen(false)}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>

              {/* Switch to Video */}
              <button
                onClick={() => {
                  setIsAudioCallOpen(false);
                  setIsVideoCallOpen(true);
                }}
                className="p-3.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                title="Turn on Video"
              >
                <Video className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 2: MICROSOFT TEAMS FULL VIDEO CALL / MEETING INTERFACE
         ======================================================================= */}
      {isVideoCallOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-fade-in">
          {/* Top Meeting Header */}
          <div className="h-14 px-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse">
                🔴 REC
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeChannel.name} • Sprint Sync
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">Duration: {formatTime(callDuration)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">4 Participants in Conference</span>
              <button
                onClick={() => setIsVideoCallOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Video Grid Canvas */}
          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 relative overflow-hidden">
            
            {/* Tile 1: Remote Participant 1 */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                alt="Sneha Gupta"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Sneha Gupta (HR Lead)</span>
              </div>
            </div>

            {/* Tile 2: Remote Participant 2 */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80"
                alt="Amit Verma"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Amit Verma (Lead Architect)</span>
              </div>
            </div>

            {/* Floating Self Camera View (PIP in bottom-right) */}
            <div className="absolute bottom-6 right-6 w-48 h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-blue-500 shadow-2xl z-20">
              {!isCameraOff ? (
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 text-xs">
                  <VideoOff className="h-6 w-6 mb-1" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold">
                You {isMicMuted && '• Muted'}
              </div>
            </div>

            {/* Screen Share simulation banner */}
            {isScreenSharing && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg z-20 animate-bounce">
                <ScreenShare className="h-4 w-4" />
                <span>You are currently sharing your screen</span>
              </div>
            )}

            {/* Floating Live Reactions */}
            <div className="absolute bottom-12 left-8 flex flex-col gap-2 pointer-events-none z-20">
              {callReactions.map((r) => (
                <span key={r.id} className="text-3xl animate-bounce">
                  {r.emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Floating Teams Control Bar */}
          <div className="h-20 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center gap-3 px-4 flex-shrink-0">
            {/* Toggle Mic */}
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer min-w-14',
                isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              )}
            >
              {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span className="text-[10px] font-semibold">{isMicMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Toggle Camera */}
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer min-w-14',
                isCameraOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              )}
            >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              <span className="text-[10px] font-semibold">{isCameraOff ? 'Start Cam' : 'Stop Cam'}</span>
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer min-w-14',
                isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              )}
            >
              <ScreenShare className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{isScreenSharing ? 'Stop Share' : 'Share'}</span>
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer min-w-14',
                isHandRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              )}
            >
              <Hand className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{isHandRaised ? 'Hand Raised' : 'Raise'}</span>
            </button>

            {/* Reaction Trigger */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              {['👍', '❤️', '👏', '🎉'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    const newR = { id: Date.now(), emoji };
                    setCallReactions((prev) => [...prev, newR]);
                    setTimeout(() => {
                      setCallReactions((prev) => prev.filter((item) => item.id !== newR.id));
                    }, 2500);
                  }}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-sm cursor-pointer transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Red Leave Call Button */}
            <button
              onClick={() => setIsVideoCallOpen(false)}
              className="flex items-center gap-2 h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ml-2"
            >
              <PhoneOff className="h-4 w-4" />
              <span>Leave</span>
            </button>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 3: SCHEDULE TEAMS MEETING MODAL
         ======================================================================= */}
      <Modal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        title="Schedule Microsoft Teams Meeting"
        description="Create an online conference invite and post details directly into the channel."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsMeetingModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleScheduleMeeting}>
              Send Meeting Invite
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="text"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 4: PRAISE / STICKER MODAL
         ======================================================================= */}
      <Modal
        isOpen={isPraiseModalOpen}
        onClose={() => setIsPraiseModalOpen(false)}
        title="Send Praise to Teammate"
        description="Recognize outstanding contributions and teamwork with official badges."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPraiseModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendPraise}>
              Award Praise
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Colleague
            </label>
            <select
              value={praiseRecipient}
              onChange={(e) => setPraiseRecipient(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            >
              <option value="Amit Verma">Amit Verma (Engineering Manager)</option>
              <option value="Elena Rostova">Elena Rostova (Lead Recruiter)</option>
              <option value="Sneha Gupta">Sneha Gupta (HR People Ops)</option>
              <option value="David Chen">David Chen (DevOps Engineer)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Recognition Badge
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRAISE_BADGES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBadge(b.id)}
                  className={cn(
                    'p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                    selectedBadge === b.id
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 dark:bg-blue-950/50 dark:text-white'
                      : 'border-slate-200 hover:border-slate-300 bg-white dark:bg-slate-800'
                  )}
                >
                  <span className="text-xl block mb-1">{b.icon}</span>
                  <span className="font-bold text-xs block">{b.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Personalized Shout-out Message
            </label>
            <textarea
              rows={2}
              value={praiseMessage}
              onChange={(e) => setPraiseMessage(e.target.value)}
              placeholder="e.g. Thanks for helping us debug the critical release blocker!"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 5: CREATE TEAM POLL MODAL
         ======================================================================= */}
      <Modal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        title="Create Team Poll"
        description="Gather instant consensus and feedback directly in your channel."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPollModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreatePoll}>
              Post Poll
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Poll Question *
            </label>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="e.g. Should we adopt Tailwind v4 or stick with current tokens?"
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Option 1 *
            </label>
            <input
              type="text"
              value={pollOption1}
              onChange={(e) => setPollOption1(e.target.value)}
              placeholder="e.g. Yes, upgrade immediately"
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Option 2 *
            </label>
            <input
              type="text"
              value={pollOption2}
              onChange={(e) => setPollOption2(e.target.value)}
              placeholder="e.g. No, keep existing stable setup"
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 dark:border-dark-border dark:bg-dark-card dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 6: ATTACH DOCUMENT SELECTOR
         ======================================================================= */}
      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        title="Attach Document or Asset"
        description="Select a work artifact to attach to your next message."
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsAttachmentModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-2 text-xs">
          {[
            { name: 'Sprint_32_Execution_Plan.pdf', size: '2.4 MB', type: 'pdf' as const },
            { name: 'Q3_Financial_Quarterly_Model.xlsx', size: '1.9 MB', type: 'excel' as const },
            { name: 'Product_Requirements_PRD_v4.docx', size: '890 KB', type: 'word' as const },
            { name: 'Architecture_Deployment_Manifest.yml', size: '45 KB', type: 'code' as const },
          ].map((doc, idx) => (
            <div
              key={idx}
              onClick={() => {
                setAttachedFile(doc);
                setIsAttachmentModalOpen(false);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/60 dark:border-slate-700 dark:hover:bg-slate-800 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600">{doc.name}</p>
                  <p className="text-[10px] text-slate-400">{doc.size} • Click to attach</p>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                Attach +
              </span>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};
