import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Underline,
  List,
  ListOrdered,
  Code,
  Quote,
  Filter,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Folder,
  SlidersHorizontal,
  Bookmark,
  Edit3,
} from 'lucide-react';

// ============================================================================
// MICROSOFT TEAMS DATA MODELS & INTERFACES
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
  subject?: string;
  text: string;
  repliesCount?: number;
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
  lastSender?: string;
  time: string;
  online?: boolean;
  statusText?: string;
  role?: string;
  isPinned?: boolean;
  membersCount?: number;
  department?: string;
}

// Preset GIF options for Teams GIF picker
const TEAMS_GIFS = [
  { id: 'g1', title: 'Thumbs Up Good Job', url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=300&auto=format&fit=crop&q=80', tag: 'Great job team! 👍' },
  { id: 'g2', title: 'Celebration Confetti', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80', tag: 'Sprint Goal Met! 🎉' },
  { id: 'g3', title: 'Coffee Time', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80', tag: 'Coffee break ☕' },
  { id: 'g4', title: 'Brainstorming Ideas', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&auto=format&fit=crop&q=80', tag: 'Brilliant solution! 💡' },
  { id: 'g5', title: 'Team High Five', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80', tag: 'Team high five! ✋' },
  { id: 'g6', title: 'Coding & Focus', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80', tag: 'Deploying release 🚀' },
];

// Preset Emojis (Teams authentic set)
const EMOJI_CATEGORIES = [
  { name: 'Frequently Used', emojis: ['👍', '❤️', '🎉', '👏', '🚀', '🔥', '😊', '💡'] },
  { name: 'Smileys & Reactions', emojis: ['😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😉', '😇', '🥰', '😍', '🤩', '😘', '😋', '😎', '🥳', '🤔', '😐', '🤐', '😴'] },
  { name: 'Work & Collaboration', emojis: ['👍', '👎', '👏', '🙌', '🤝', '👋', '✌️', '🤞', '💪', '🙏', '💻', '📱', '📊', '📁', '📅', '📝', '📌', '🎯', '☕', '⭐'] },
];

// Preset Teams Praise Badges
const PRAISE_BADGES = [
  { id: 'team-player', label: 'Team Player', icon: '🤝', color: 'from-blue-600 to-indigo-600', desc: 'Always stepping in to collaborate and help others thrive.' },
  { id: 'problem-solver', label: 'Problem Solver', icon: '🧩', color: 'from-purple-600 to-pink-600', desc: 'Cracking complex engineering and product blockers with ease.' },
  { id: 'awesome-work', label: 'Awesome Work', icon: '🌟', color: 'from-amber-500 to-orange-500', desc: 'Consistently high quality deliverables and attention to detail.' },
  { id: 'leadership', label: 'Leadership', icon: '👑', color: 'from-emerald-500 to-teal-600', desc: 'Inspiring, guiding, and mentoring teammates toward success.' },
];

export const ChatPage: React.FC = () => {
  const { currentUser } = useAppStore();

  const [searchParams] = useSearchParams();

  // Channel List Pane Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'team' | 'hr'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>('c-team-general');
  const [channelViewTab, setChannelViewTab] = useState<'posts' | 'files' | 'notes'>('posts');
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [isRecentExpanded, setIsRecentExpanded] = useState(true);
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);

  // Message Composer State
  const [newSubject, setNewSubject] = useState('');
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

  // Calling & Video Conferencing Modals
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
      lastSender: 'Rahul',
      lastMessage: 'Updated the Q3 sprint plan and architecture doc.',
      time: '11:42 AM',
      unreadCount: 2,
      membersCount: 18,
      department: 'Engineering',
    },
    {
      id: 'c-team-eng',
      name: 'Engineering Squad Alpha',
      type: 'team',
      isPinned: true,
      lastSender: 'Sneha',
      lastMessage: 'Production deployment completed smoothly with 0 errors.',
      time: '10:15 AM',
      unreadCount: 0,
      membersCount: 14,
      department: 'Platform',
    },
    {
      id: 'c-direct-amit',
      name: 'Amit Verma',
      type: 'direct',
      isPinned: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      lastSender: 'Amit',
      lastMessage: 'Let us sync on the client security feedback at 2 PM.',
      time: '09:30 AM',
      unreadCount: 0,
      role: 'Engineering Manager',
      online: true,
      statusText: 'Available',
    },
    {
      id: 'c-hr-desk',
      name: 'HR Confidential & Benefits Desk',
      type: 'hr',
      isPinned: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      lastSender: 'HR Bot',
      lastMessage: 'Your annual leave request has been processed and approved.',
      time: 'Yesterday',
      unreadCount: 1,
      role: 'HR People Ops Lead',
      online: true,
      statusText: 'Available',
    },
    {
      id: 'c-direct-elena',
      name: 'Elena Rostova',
      type: 'direct',
      isPinned: false,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      lastSender: 'Elena',
      lastMessage: 'Shared candidate profiles for the Senior Frontend opening.',
      time: 'Yesterday',
      unreadCount: 0,
      role: 'Lead Talent Acquisition',
      online: false,
      statusText: 'Away',
    },
    {
      id: 'c-group-launch',
      name: '🚀 Project Pegasus Launch Squad',
      type: 'group',
      isPinned: false,
      lastSender: 'David',
      lastMessage: 'Beta testing signups reached 1,200 participants!',
      time: 'Aug 28',
      unreadCount: 0,
      membersCount: 22,
      department: 'Product',
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
        subject: 'Sprint Velocity & Architecture Review',
        text: 'Good morning team! Please review the sprint velocity chart and upcoming microservice decoupling timeline. We need sign-off before Thursday.',
        timestamp: '10:05 AM',
        repliesCount: 3,
        reactions: [
          { emoji: '👍', count: 5, users: ['Elena Rostova', 'David Chen', 'Sneha Gupta'] },
          { emoji: '❤️', count: 2, users: ['Elena Rostova'] },
        ],
      },
      {
        id: 'm-2',
        senderId: 'u-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Lead Talent Acquisition',
        subject: 'Candidate Pipeline Deliverables',
        text: 'Attached the revised candidate evaluation spreadsheet for our senior cloud engineer position. Take a look at the interview scorecard tabs.',
        timestamp: '10:42 AM',
        attachment: {
          name: 'Candidate_Scorecard_Q3_Senior_Cloud.xlsx',
          size: '2.4 MB',
          type: 'excel',
        },
        reactions: [{ emoji: '👏', count: 3, users: ['Amit Verma'] }],
      },
      {
        id: 'm-3',
        senderId: 'u-sneha',
        senderName: 'Sneha Gupta',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        senderRole: 'HR People Ops Lead',
        subject: 'URGENT: Annual Health Insurance Enrollment',
        text: 'All employees are required to verify their dependent details before Friday 5:00 PM IST to prevent enrollment disruption.',
        timestamp: '11:15 AM',
        isUrgent: true,
        attachment: {
          name: 'Medical_Insurance_Policy_2025.pdf',
          size: '1.8 MB',
          type: 'pdf',
        },
      },
      {
        id: 'm-4',
        senderId: 'u-me',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Administrator',
        subject: 'Weekly Team Standup & Sync',
        text: 'Let us connect for our scheduled weekly standup. Click below to join the call.',
        timestamp: '11:30 AM',
        isMe: true,
        type: 'meeting',
        meeting: {
          title: 'General Standup & Architecture Sync',
          date: 'Today',
          time: '11:30 AM - 12:15 PM',
          duration: '45 mins',
          link: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_general',
        },
      },
      {
        id: 'm-5',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        subject: 'Team Feedback Poll: Hybrid Office Days',
        text: 'Please cast your vote on preferred mandatory collaboration days for the upcoming quarter.',
        timestamp: '11:35 AM',
        type: 'poll',
        poll: {
          question: 'Which days do you prefer for team in-office sync?',
          totalVotes: 8,
          options: [
            { id: 'opt-1', text: 'Tuesday & Thursday (Core Sprint Days)', votes: 6, votedUserIds: ['u-amit', 'u-elena'] },
            { id: 'opt-2', text: 'Monday & Wednesday (Kickoff & Review)', votes: 2, votedUserIds: [] },
          ],
        },
      },
    ],
    'c-direct-amit': [
      {
        id: 'm-amit-1',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        senderRole: 'Engineering Manager',
        text: 'Hey Vikas, did you get a chance to inspect the new database indexing proposal?',
        timestamp: '09:20 AM',
      },
      {
        id: 'm-amit-2',
        senderId: 'u-me',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'Yes Amit, query performance improved by 42% on our test replica. Sharing the metrics report shortly.',
        timestamp: '09:25 AM',
        isMe: true,
        reactions: [{ emoji: '🚀', count: 1, users: ['Amit Verma'] }],
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChannel = channels.find((c) => c.id === activeChatId) || channels[0];
  const activeMessages = messages[activeChatId] || [];

  // Auto-scroll on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatId, channelViewTab]);

  // Sync view based on sidebar dropdown navigation (?tab=teams|chat|calendar|calls|files)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'teams') {
      setActiveTab('team');
      setChannelViewTab('posts');
    } else if (tab === 'chat') {
      setActiveTab('all');
      setChannelViewTab('posts');
    } else if (tab === 'files') {
      setChannelViewTab('files');
    } else if (tab === 'calendar') {
      setIsMeetingModalOpen(true);
    } else if (tab === 'calls') {
      setIsAudioCallOpen(true);
    }
  }, [searchParams]);

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (isAudioCallOpen || isVideoCallOpen) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isAudioCallOpen, isVideoCallOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Send New Message Handler
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !attachedFile) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'Administrator',
      subject: newSubject.trim() || undefined,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isImportant: messageUrgency === 'important',
      isUrgent: messageUrgency === 'urgent',
      type: attachedFile ? 'file' : 'text',
      attachment: attachedFile ? { ...attachedFile } : undefined,
      reactions: [],
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));

    // Update last message in channels list
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: newMessage || `Sent ${attachedFile?.name}`, lastSender: 'You', time: 'Just now' }
          : c
      )
    );

    setNewSubject('');
    setNewMessage('');
    setAttachedFile(null);
    setMessageUrgency('standard');
    setIsFormattingOpen(false);
  };

  // Add Hover Reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChatId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || [];
        const existing = currentReactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: currentReactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        }
        return {
          ...m,
          reactions: [...currentReactions, { emoji, count: 1, users: ['You'] }],
        };
      });
      return { ...prev, [activeChatId]: updated };
    });
  };

  // Handle Poll Vote
  const handleVotePoll = (messageId: string, optionId: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChatId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId || !m.poll) return m;
        let votedAlready = false;
        m.poll.options.forEach((opt) => {
          if (opt.votedUserIds.includes('u-me')) votedAlready = true;
        });
        if (votedAlready) return m;

        const newOptions = m.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: opt.votes + 1,
              votedUserIds: [...opt.votedUserIds, 'u-me'],
            };
          }
          return opt;
        });
        return {
          ...m,
          poll: {
            ...m.poll,
            options: newOptions,
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
      subject: `Microsoft Teams Praise: ${badgeObj.label}`,
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
      subject: `Microsoft Forms Poll: ${pollQuestion}`,
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
      subject: `Teams Online Meeting: ${meetingTitle}`,
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

  const pinnedChannels = filteredChannels.filter((c) => c.isPinned);
  const recentChannels = filteredChannels.filter((c) => !c.isPinned);

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-1.5 animate-page-enter">
      
      {/* =======================================================================
          TOP TEAMS NAVIGATION & CALLING ACTIONS
         ======================================================================= */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          {/* Authentic Microsoft Teams Icon Badge */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B5FC7] text-white shadow-sm ring-1 ring-white/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Microsoft Teams Collaboration
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5B5FC7]/10 text-[#5B5FC7] dark:bg-[#5B5FC7]/25 dark:text-[#A6AFFA]">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Meetings, Calling, Team Posts, Live Polls, Attachments & Praise
            </p>
          </div>
        </div>

        {/* Top Global Teams Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <CalendarPlus className="h-3.5 w-3.5 text-[#5B5FC7]" />
            <span>Schedule Meeting</span>
          </button>

          <button
            onClick={() => setIsVideoCallOpen(true)}
            className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-xl bg-[#5B5FC7] hover:bg-[#4F52B2] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Meet Now</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
          MICROSOFT TEAMS COLLABORATION WORKSPACE
         ======================================================================= */}
      <div className="flex-1 min-h-0 flex bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        
        {/* =====================================================================
            LEFT PANE: CHANNELS & CHATS ACCORDION LIST
           ===================================================================== */}
        <div className="w-64 sm:w-72 md:w-80 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-[#13131B] flex-shrink-0">
          
          {/* Pane Header: Title, Filter, New Chat */}
          <div className="p-3 border-b border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>Chat</span>
                <span className="text-xs text-slate-400 font-normal">({channels.length})</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab(activeTab === 'all' ? 'team' : 'all')}
                  title="Filter chats"
                  className={cn(
                    'p-1.5 rounded-lg transition-colors cursor-pointer',
                    activeTab !== 'all' ? 'bg-[#5B5FC7]/10 text-[#5B5FC7]' : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => {
                    const name = prompt('Create a new Teams Channel or Group Chat:');
                    if (name) {
                      const newChan: ChatChannel = {
                        id: `c-team-${Date.now()}`,
                        name: `# ${name.toLowerCase().replace(/\s+/g, '-')}`,
                        type: 'team',
                        lastSender: 'System',
                        lastMessage: 'Channel created. Start collaborating!',
                        time: 'Just now',
                        membersCount: 6,
                        department: 'General',
                      };
                      setChannels([newChan, ...channels]);
                      setActiveChatId(newChan.id);
                    }
                  }}
                  title="New Chat / Channel"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-[#5B5FC7] hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Teams Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type a command..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-[#1A1A24] rounded-lg border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#5B5FC7] transition-all"
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] pt-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'team', label: 'Teams' },
                { id: 'direct', label: 'Direct' },
                { id: 'hr', label: 'HR Desk' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-md font-semibold transition-colors whitespace-nowrap cursor-pointer',
                    activeTab === tab.id
                      ? 'bg-[#5B5FC7] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Channel & Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
            
            {/* Pinned Section */}
            {pinnedChannels.length > 0 && (
              <div>
                <button
                  onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                  className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {isPinnedExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Pinned ({pinnedChannels.length})
                  </span>
                  <Pin className="h-2.5 w-2.5 text-slate-400" />
                </button>

                {isPinnedExpanded && (
                  <div className="space-y-0.5 px-1 py-0.5">
                    {pinnedChannels.map((channel) => {
                      const isActive = channel.id === activeChatId;
                      return (
                        <button
                          key={channel.id}
                          onClick={() => {
                            setActiveChatId(channel.id);
                            setChannelViewTab('posts');
                          }}
                          className={cn(
                            'w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group',
                            isActive
                              ? 'bg-white dark:bg-[#1F1F2C] shadow-xs border-l-3 border-[#5B5FC7]'
                              : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                          )}
                        >
                          {/* Channel / Direct Avatar */}
                          {channel.type === 'team' || channel.type === 'group' ? (
                            <div className="w-8 h-8 rounded-lg bg-[#5B5FC7]/10 dark:bg-[#5B5FC7]/25 text-[#5B5FC7] dark:text-[#A6AFFA] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              <Hash className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="relative flex-shrink-0">
                              <img
                                src={channel.avatar}
                                alt={channel.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              />
                              {channel.online ? (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#13131B]" title="Available" />
                              ) : (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white dark:ring-[#13131B]" title="Away" />
                              )}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                'text-xs truncate',
                                isActive ? 'font-bold text-[#5B5FC7] dark:text-[#A6AFFA]' : 'font-semibold text-slate-800 dark:text-slate-200'
                              )}>
                                {channel.name}
                              </p>
                              <span className="text-[10px] text-slate-400 ml-1 flex-shrink-0">{channel.time}</span>
                            </div>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {channel.lastSender ? `${channel.lastSender}: ` : ''}{channel.lastMessage}
                            </p>
                          </div>

                          {channel.unreadCount ? (
                            <span className="h-4 min-w-4 px-1 rounded-full bg-[#5B5FC7] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                              {channel.unreadCount}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Recent Section */}
            <div>
              <button
                onClick={() => setIsRecentExpanded(!isRecentExpanded)}
                className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {isRecentExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Recent ({recentChannels.length})
                </span>
              </button>

              {isRecentExpanded && (
                <div className="space-y-0.5 px-1 py-0.5">
                  {recentChannels.map((channel) => {
                    const isActive = channel.id === activeChatId;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setActiveChatId(channel.id);
                          setChannelViewTab('posts');
                        }}
                        className={cn(
                          'w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group',
                          isActive
                            ? 'bg-white dark:bg-[#1F1F2C] shadow-xs border-l-3 border-[#5B5FC7]'
                            : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                        )}
                      >
                        {channel.type === 'team' || channel.type === 'group' ? (
                          <div className="w-8 h-8 rounded-lg bg-[#5B5FC7]/10 dark:bg-[#5B5FC7]/25 text-[#5B5FC7] dark:text-[#A6AFFA] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <Hash className="w-4 h-4 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="relative flex-shrink-0">
                            <img
                              src={channel.avatar}
                              alt={channel.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            {channel.online ? (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#13131B]" />
                            ) : (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white dark:ring-[#13131B]" />
                            )}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              'text-xs truncate',
                              isActive ? 'font-bold text-[#5B5FC7] dark:text-[#A6AFFA]' : 'font-semibold text-slate-800 dark:text-slate-200'
                            )}>
                              {channel.name}
                            </p>
                            <span className="text-[10px] text-slate-400 ml-1 flex-shrink-0">{channel.time}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {channel.lastSender ? `${channel.lastSender}: ` : ''}{channel.lastMessage}
                          </p>
                        </div>

                        {channel.unreadCount ? (
                          <span className="h-4 min-w-4 px-1 rounded-full bg-[#5B5FC7] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {channel.unreadCount}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
            PANE 3: MAIN TEAMS CONVERSATION CANVAS & COMPOSER (FLEX-1)
           ===================================================================== */}
        <div className="flex-1 flex flex-col h-full bg-[#F5F5F7] dark:bg-[#0E0E14] min-w-0">
          
          {/* Main Channel Teams Header */}
          <div className="h-14 px-4 bg-white dark:bg-[#13131B] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {activeChannel.type === 'team' || activeChannel.type === 'group' ? (
                <div className="w-9 h-9 rounded-xl bg-[#5B5FC7]/10 dark:bg-[#5B5FC7]/20 text-[#5B5FC7] dark:text-[#A6AFFA] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  <Hash className="w-4.5 h-4.5 stroke-[2.5]" />
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
                <div className="flex items-center gap-2 truncate">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeChannel.name}
                  </h3>
                  {activeChannel.type === 'hr' && (
                    <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[9px] font-bold flex items-center gap-1 flex-shrink-0">
                      <Shield className="w-2.5 h-2.5" /> Confidential
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 truncate">
                  {activeChannel.role || (activeChannel.type === 'team' ? `${activeChannel.membersCount || 12} team members • 5 online` : '1:1 Collaboration')}
                </p>
              </div>
            </div>

            {/* Calling & Teams Action Icons */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {/* Audio Call */}
              <button
                onClick={() => setIsAudioCallOpen(true)}
                title="Start Audio Call"
                className="flex items-center gap-1.5 h-8.5 px-2.5 rounded-xl text-slate-700 hover:text-[#5B5FC7] hover:bg-[#5B5FC7]/10 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold"
              >
                <Phone className="h-4 w-4 text-[#5B5FC7]" />
                <span className="hidden md:inline">Call</span>
              </button>

              {/* Video Call (Meet) */}
              <button
                onClick={() => setIsVideoCallOpen(true)}
                title="Start Teams Video Meeting"
                className="flex items-center gap-1.5 h-8.5 px-3 rounded-xl bg-[#5B5FC7] text-white hover:bg-[#4F52B2] transition-colors cursor-pointer text-xs font-bold shadow-xs"
              >
                <Video className="h-4 w-4" />
                <span>Meet</span>
              </button>

              {/* Screen Share */}
              <button
                onClick={() => {
                  setIsVideoCallOpen(true);
                  setIsScreenSharing(true);
                }}
                title="Share Screen"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ScreenShare className="h-4 w-4" />
              </button>

              {/* Toggle Info / Members */}
              <button
                onClick={() => setShowMemberDrawer(!showMemberDrawer)}
                title="Channel Details & Members"
                className={cn(
                  'p-2 rounded-xl transition-colors cursor-pointer',
                  showMemberDrawer
                    ? 'bg-[#5B5FC7]/10 text-[#5B5FC7]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Teams Sub-Header Tabs (Posts, Files, Notes, +) */}
          <div className="h-9 px-4 bg-white dark:bg-[#13131B] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 h-full">
              <button
                onClick={() => setChannelViewTab('posts')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'posts'
                    ? 'border-[#5B5FC7] text-[#5B5FC7] dark:text-[#A6AFFA]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Posts</span>
              </button>

              <button
                onClick={() => setChannelViewTab('files')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'files'
                    ? 'border-[#5B5FC7] text-[#5B5FC7] dark:text-[#A6AFFA]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <Folder className="h-3.5 w-3.5" />
                <span>Files</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  3
                </span>
              </button>

              <button
                onClick={() => setChannelViewTab('notes')}
                className={cn(
                  'h-full border-b-2 font-bold px-1 transition-colors flex items-center gap-1.5 cursor-pointer',
                  channelViewTab === 'notes'
                    ? 'border-[#5B5FC7] text-[#5B5FC7] dark:text-[#A6AFFA]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Notes</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="hidden sm:inline">Encrypted Microsoft 365 Tenant</span>
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>

          {/* ===================================================================
              TAB VIEW 1: TEAMS POSTS & MESSAGES STREAM
             =================================================================== */}
          {channelViewTab === 'posts' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
              
              {/* Date Separator Pill */}
              <div className="flex items-center justify-center my-2">
                <span className="px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10.5px] font-bold shadow-2xs">
                  Today, September 10, 2026
                </span>
              </div>

              {/* Messages / Channel Post Cards */}
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white dark:bg-[#151520] rounded-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xs p-3.5 sm:p-4 relative group transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Urgent / Important Left Accent Border */}
                  {msg.isUrgent && (
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-600 rounded-l-xl" />
                  )}
                  {msg.isImportant && !msg.isUrgent && (
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-amber-500 rounded-l-xl" />
                  )}

                  {/* Top Post Header: Avatar, Name, Role, Timestamp */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {msg.senderName}
                          </span>
                          {msg.senderRole && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                              {msg.senderRole}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Urgent / Important Tag */}
                    {msg.isUrgent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 text-[10px] font-black">
                        <AlertCircle className="h-3 w-3 text-rose-600" />
                        URGENT
                      </span>
                    )}
                    {msg.isImportant && !msg.isUrgent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300 text-[10px] font-black">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                        IMPORTANT
                      </span>
                    )}
                  </div>

                  {/* Post Subject if available */}
                  {msg.subject && (
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {msg.subject}
                    </h4>
                  )}

                  {/* Post Text Body */}
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* =========================================================
                      CARD TYPE 1: MICROSOFT 365 FILE ATTACHMENT CARD
                     ========================================================= */}
                  {msg.attachment && (
                    <div className="mt-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#1C1C28] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Distinct Microsoft File Icons */}
                        {msg.attachment.type === 'excel' ? (
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                        ) : msg.attachment.type === 'pdf' ? (
                          <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <FileCode className="w-5 h-5" />
                          </div>
                        )}

                        <div className="truncate">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {msg.attachment.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {msg.attachment.size} • Stored on SharePoint / OneDrive
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => alert(`Downloading ${msg.attachment?.name}...`)}
                          title="Download document"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      CARD TYPE 2: TEAMS MEETING INVITE CARD
                     ========================================================= */}
                  {msg.type === 'meeting' && msg.meeting && (
                    <div className="mt-3 rounded-xl border border-[#5B5FC7]/30 bg-gradient-to-br from-[#EEF0FA] to-white dark:from-[#18182B] dark:to-[#12121E] overflow-hidden">
                      <div className="px-3.5 py-2 bg-[#5B5FC7] text-white flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                          <Video className="h-4 w-4" /> Microsoft Teams Meeting
                        </span>
                        <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-md">
                          {msg.meeting.duration}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {msg.meeting.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-[#5B5FC7]" /> {msg.meeting.date}
                          <Clock className="h-3.5 w-3.5 text-[#5B5FC7] ml-2" /> {msg.meeting.time}
                        </p>
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => setIsVideoCallOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5B5FC7] hover:bg-[#4F52B2] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Teams Meeting</span>
                          </button>
                          <button
                            onClick={() => alert(`Meeting link copied: ${msg.meeting?.link}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy Link</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      CARD TYPE 3: MICROSOFT FORMS LIVE POLL CARD
                     ========================================================= */}
                  {msg.type === 'poll' && msg.poll && (
                    <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#1A1A26] overflow-hidden">
                      <div className="px-3.5 py-1.5 bg-gradient-to-r from-[#5B5FC7] to-[#7B83EB] text-white flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                          <BarChart2 className="h-3.5 w-3.5" /> Microsoft Forms • Live Poll
                        </span>
                        <span className="text-[10.5px] font-medium opacity-90">{msg.poll.totalVotes} responses</span>
                      </div>
                      <div className="p-3.5 space-y-2.5">
                        <p className="font-bold text-xs text-slate-900 dark:text-white">
                          {msg.poll.question}
                        </p>
                        <div className="space-y-2">
                          {msg.poll.options.map((opt) => {
                            const pct = msg.poll?.totalVotes ? Math.round((opt.votes / msg.poll.totalVotes) * 100) : 0;
                            const hasVoted = opt.votedUserIds.includes('u-me');
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleVotePoll(msg.id, opt.id)}
                                className={cn(
                                  'w-full text-left p-2.5 rounded-xl border text-xs transition-all relative overflow-hidden cursor-pointer group',
                                  hasVoted
                                    ? 'border-[#5B5FC7] bg-[#5B5FC7]/10 dark:bg-[#5B5FC7]/20 text-[#5B5FC7] dark:text-[#A6AFFA]'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-[#5B5FC7] bg-white dark:bg-[#14141E]'
                                )}
                              >
                                <div
                                  className="absolute inset-y-0 left-0 bg-[#5B5FC7]/20 dark:bg-[#5B5FC7]/30 transition-all duration-500 pointer-events-none"
                                  style={{ width: `${pct}%` }}
                                />
                                <div className="relative flex items-center justify-between z-10">
                                  <span className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <span className={cn('w-3.5 h-3.5 rounded-full border flex items-center justify-center', hasVoted ? 'border-[#5B5FC7] bg-[#5B5FC7] text-white' : 'border-slate-300')}>
                                      {hasVoted && <Check className="w-2.5 h-2.5" />}
                                    </span>
                                    {opt.text}
                                  </span>
                                  <span className="text-xs font-bold text-[#5B5FC7] dark:text-[#A6AFFA]">
                                    {pct}% ({opt.votes})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================
                      CARD TYPE 4: TEAMS PRAISE & RECOGNITION CARD
                     ========================================================= */}
                  {msg.type === 'praise' && msg.praise && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#251D14] dark:to-[#1F1710] border border-amber-200 dark:border-amber-800/60">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <Award className="h-4 w-4" />
                        <span>Microsoft Teams Praise: {msg.praise.badge}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                        To: <span className="text-[#5B5FC7] dark:text-[#A6AFFA]">{msg.praise.recipientName}</span>
                      </p>
                      <p className="text-[11.5px] text-slate-600 dark:text-slate-300 italic mt-0.5">
                        "{msg.praise.message}"
                      </p>
                    </div>
                  )}

                  {/* GIF preview if present */}
                  {msg.type === 'gif' && msg.gifUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs shadow-xs">
                      <img src={msg.gifUrl} alt="GIF" className="w-full h-36 object-cover" />
                    </div>
                  )}

                  {/* Reactions Pill Display */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {msg.reactions.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddReaction(msg.id, r.emoji)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10.5px] text-slate-700 dark:text-slate-300 hover:border-[#5B5FC7] transition-all cursor-pointer shadow-2xs"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-bold">{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Channel Post Footer: Thread Replies Count */}
                  {msg.repliesCount && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-[#5B5FC7] dark:text-[#A6AFFA]">
                      <button
                        onClick={() => alert(`Opening thread with ${msg.repliesCount} replies...`)}
                        className="font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <Reply className="h-3.5 w-3.5" />
                        <span>{msg.repliesCount} replies</span>
                      </button>
                      <span className="text-[10px] text-slate-400">Last activity 5m ago</span>
                    </div>
                  )}

                  {/* Authentic Teams Floating Hover Reaction Bar */}
                  <div className="absolute -top-3.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#1E1E2C] rounded-full border border-slate-200 dark:border-slate-700 shadow-md px-1.5 py-0.5 flex items-center gap-1 z-10">
                    {['👍', '❤️', '😆', '😮', '😢', '👏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs transition-transform hover:scale-125 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />
                    <button
                      onClick={() => alert('Reply directly to this post thread')}
                      title="Reply"
                      className="p-1 text-slate-400 hover:text-[#5B5FC7] rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <Reply className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ===================================================================
              TAB VIEW 2: SHAREPOINT / ONEDRIVE SHARED FILES REPOSITORY
             =================================================================== */}
          {channelViewTab === 'files' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    SharePoint Channel Files
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Synchronized with Microsoft 365 cloud documents
                  </p>
                </div>
                <button
                  onClick={() => setIsAttachmentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B5FC7] text-white text-xs font-bold hover:bg-[#4F52B2] shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { name: 'Microservices_Architecture_v2.pdf', size: '3.4 MB', author: 'You', date: 'Today at 11:20 AM', type: 'pdf' },
                  { name: 'Candidate_Scorecard_Q3_Senior_Cloud.xlsx', size: '2.4 MB', author: 'Elena Rostova', date: 'Today at 10:42 AM', type: 'excel' },
                  { name: 'Medical_Insurance_Policy_2025.pdf', size: '1.8 MB', author: 'Sneha Gupta', date: 'Today at 11:15 AM', type: 'pdf' },
                ].map((file, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#5B5FC7]/10 text-[#5B5FC7]">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{file.name}</p>
                        <p className="text-[10px] text-slate-400">Modified by {file.author} • {file.date} • {file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${file.name}...`)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB VIEW 3: ONENOTE / MEETING NOTES
             =================================================================== */}
          {channelViewTab === 'notes' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-[#151520] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#5B5FC7]" />
                    Sprint Standup Action Items (Microsoft OneNote)
                  </h4>
                  <span className="text-[10px] text-slate-400">Last edited 15m ago</span>
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>API Gateway rate-limiting rollout planned for Thursday night maintenance.</li>
                  <li>Elena to schedule second round for Frontend Lead candidates.</li>
                  <li>Verify compliance with medical card enrollment by end of week.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ===================================================================
              THE ICONIC MICROSOFT TEAMS MESSAGE COMPOSE BOX (BOTTOM)
             =================================================================== */}
          <div className="p-3.5 bg-white dark:bg-[#13131B] border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0">
            
            {/* Attached file chip preview */}
            {attachedFile && (
              <div className="mb-2 p-2 rounded-xl bg-[#5B5FC7]/10 border border-[#5B5FC7]/20 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3.5 w-3.5 text-[#5B5FC7]" />
                  <span className="font-bold">{attachedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({attachedFile.size})</span>
                </div>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Teams Rich Formatting Drawer */}
            {isFormattingOpen && (
              <div className="p-2.5 mb-2 rounded-xl bg-slate-50 dark:bg-[#1A1A26] border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                {/* Subject Line for Teams Posts */}
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a subject line (e.g. Q3 Architecture Release)..."
                  className="w-full h-8 px-2.5 text-xs font-bold bg-white dark:bg-[#12121B] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#5B5FC7]"
                />

                {/* Formatting Buttons Toolbar */}
                <div className="flex flex-wrap items-center gap-1 text-slate-500">
                  <button
                    type="button"
                    onClick={() => setNewMessage((prev) => `${prev}**bold** `)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMessage((prev) => `${prev}_italic_ `)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMessage((prev) => `${prev}~strike~ `)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Strikethrough"
                  >
                    <Strikethrough className="h-3.5 w-3.5" />
                  </button>
                  <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
                  <button
                    type="button"
                    onClick={() => setNewMessage((prev) => `${prev}\n• `)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Bullet List"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMessage((prev) => `${prev}\`code\` `)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    title="Code snippet"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Teams Input Box */}
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Start a post or reply in ${activeChannel.name}...`}
                  className={cn(
                    'flex-1 h-10 px-3.5 text-xs bg-slate-50 dark:bg-[#1A1A26] rounded-xl border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#5B5FC7] transition-all',
                    messageUrgency === 'urgent'
                      ? 'border-rose-400 ring-2 ring-rose-200'
                      : messageUrgency === 'important'
                      ? 'border-amber-400 ring-1 ring-amber-200'
                      : 'border-slate-200 dark:border-slate-700'
                  )}
                />

                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-[#5B5FC7] hover:bg-[#4F52B2] active:scale-95 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Bottom Teams Icons Row (Format, Urgency, Attach, Emoji, GIF, Stickers, Poll, Meeting) */}
              <div className="flex items-center justify-between pt-1 text-slate-500">
                <div className="flex items-center gap-1">
                  {/* Format Toggle A */}
                  <button
                    type="button"
                    onClick={() => setIsFormattingOpen(!isFormattingOpen)}
                    title="Format rich text & subject"
                    className={cn(
                      'p-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer',
                      isFormattingOpen ? 'bg-[#5B5FC7]/10 text-[#5B5FC7]' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
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
                    title={`Set delivery options (Currently: ${messageUrgency.toUpperCase()})`}
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
                    title="Attach file from SharePoint or Computer"
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
                      title="Giphy Animated GIFs"
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
                              className="rounded-xl overflow-hidden border border-slate-200 hover:border-[#5B5FC7] text-left transition-all cursor-pointer group"
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

                  {/* Praise / Badges */}
                  <button
                    type="button"
                    onClick={() => setIsPraiseModalOpen(true)}
                    title="Send Microsoft Praise"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Award className="h-4 w-4 text-amber-500" />
                  </button>

                  {/* Create Microsoft Forms Poll */}
                  <button
                    type="button"
                    onClick={() => setIsPollModalOpen(true)}
                    title="Create Team Poll"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="h-4 w-4 text-[#5B5FC7]" />
                  </button>

                  {/* Schedule Teams Meeting */}
                  <button
                    type="button"
                    onClick={() => setIsMeetingModalOpen(true)}
                    title="Schedule Teams Meeting"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-indigo-500" />
                  </button>
                </div>

                <div className="text-[10.5px] text-slate-400">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Enter</kbd> to post</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================================
            OPTIONAL RIGHT SLIDE-OUT DRAWER: MEMBERS & CHANNEL DETAILS
           ===================================================================== */}
        {showMemberDrawer && (
          <div className="hidden xl:block w-64 border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#13131B] p-4 text-xs space-y-4 flex-shrink-0">
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
                      <div className="w-7 h-7 rounded-full bg-[#5B5FC7]/10 text-[#5B5FC7] font-bold flex items-center justify-center text-[10px]">
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
          <div className="w-full max-w-md bg-[#1F1F2C] text-white rounded-3xl p-6 shadow-2xl border border-slate-800 text-center flex flex-col items-center space-y-6">
            
            {/* Call Header */}
            <div className="flex items-center justify-between w-full text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="h-3.5 w-3.5" /> Teams Secure Audio Call
              </span>
              <span className="font-mono text-sm font-bold text-white">{formatTime(callDuration)}</span>
            </div>

            {/* Pulsing Avatar */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute w-32 h-32 rounded-full bg-[#5B5FC7]/20 animate-ping" />
              <div className="absolute w-28 h-28 rounded-full bg-[#5B5FC7]/30 animate-pulse" />
              <img
                src={activeChannel.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'}
                alt={activeChannel.name}
                className="relative w-20 h-20 rounded-full object-cover border-4 border-[#5B5FC7] shadow-xl"
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
        <div className="fixed inset-0 z-50 flex flex-col bg-[#14141E] text-white animate-fade-in">
          {/* Top Meeting Header */}
          <div className="h-14 px-6 bg-[#1F1F2E] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse">
                🔴 REC
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeChannel.name} • Teams Meeting
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">Duration: {formatTime(callDuration)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">4 Participants in Call</span>
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
            <div className="absolute bottom-6 right-6 w-48 h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-[#5B5FC7] shadow-2xl z-20">
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

          {/* Bottom Floating Teams Meeting Control Bar */}
          <div className="h-20 bg-[#1F1F2E] border-t border-slate-800 flex items-center justify-center gap-3 px-4 flex-shrink-0">
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
                isScreenSharing ? 'bg-[#5B5FC7] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
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
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Date
              </label>
              <input
                type="text"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                placeholder="e.g. Tomorrow or Sep 12"
                className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Time Slot
              </label>
              <input
                type="text"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                placeholder="e.g. 11:00 AM - 12:00 PM"
                className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-800 dark:text-blue-200 flex items-start gap-2">
            <Video className="h-4 w-4 text-[#5B5FC7] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              A secure Microsoft Teams video meeting link will be generated automatically and embedded directly into the channel thread.
            </p>
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 4: PRAISE & BADGES MODAL
         ======================================================================= */}
      <Modal
        isOpen={isPraiseModalOpen}
        onClose={() => setIsPraiseModalOpen(false)}
        title="Send Microsoft Praise"
        description="Celebrate a teammate's contribution with an official Teams praise card."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPraiseModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendPraise}>
              Send Praise
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Recipient
            </label>
            <select
              value={praiseRecipient}
              onChange={(e) => setPraiseRecipient(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="Amit Verma">Amit Verma (Engineering Manager)</option>
              <option value="Elena Rostova">Elena Rostova (Lead Talent Acquisition)</option>
              <option value="Sneha Gupta">Sneha Gupta (HR People Ops Lead)</option>
              <option value="David Chen">David Chen (Site Reliability Lead)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Choose Praise Badge
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRAISE_BADGES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBadge(b.id)}
                  className={cn(
                    'p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer',
                    selectedBadge === b.id
                      ? 'border-[#5B5FC7] bg-[#5B5FC7]/10 ring-2 ring-[#5B5FC7]/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  )}
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{b.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{b.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Personalized Note (Optional)
            </label>
            <textarea
              rows={2}
              value={praiseMessage}
              onChange={(e) => setPraiseMessage(e.target.value)}
              placeholder="Add your heartfelt message to your teammate..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 5: MICROSOFT FORMS POLL CREATOR
         ======================================================================= */}
      <Modal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        title="Create Microsoft Forms Poll"
        description="Gather instant votes and feedback directly in your Teams channel."
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
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Poll Question
            </label>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="e.g. Which sprint retrospective date works best?"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Option 1
            </label>
            <input
              type="text"
              value={pollOption1}
              onChange={(e) => setPollOption1(e.target.value)}
              placeholder="e.g. Friday 3:00 PM"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Option 2
            </label>
            <input
              type="text"
              value={pollOption2}
              onChange={(e) => setPollOption2(e.target.value)}
              placeholder="e.g. Monday 10:00 AM"
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Modal>

      {/* =======================================================================
          MODAL 6: ATTACH DOCUMENT / FILE
         ======================================================================= */}
      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        title="Share File / Document"
        description="Select a document or spreadsheet to upload and attach to the channel."
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsAttachmentModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-500">Choose a document to attach:</p>
          <div className="space-y-2">
            {[
              { name: 'Sprint_Backlog_Q3_Deliverables.xlsx', size: '1.2 MB', type: 'excel' as const },
              { name: 'Microservices_Architecture_v2.pdf', size: '3.4 MB', type: 'pdf' as const },
              { name: 'Employee_Handbook_2025.pdf', size: '2.1 MB', type: 'pdf' as const },
              { name: 'Database_Schema_Migration.sql', size: '340 KB', type: 'code' as const },
            ].map((file, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAttachedFile(file);
                  setIsAttachmentModalOpen(false);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#5B5FC7] hover:bg-[#5B5FC7]/10 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#5B5FC7]" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size} • {file.type.toUpperCase()}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#5B5FC7]">Attach</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
