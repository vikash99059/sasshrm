import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Shield,
  Hash,
  UserCheck,
  FileText,
  Download,
  CheckCheck,
  Circle,
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'team' | 'group' | 'hr';
  avatar?: string;
  unreadCount?: number;
  lastMessage: string;
  time: string;
  online?: boolean;
  role?: string;
}

export const ChatPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'team' | 'group' | 'hr'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>('c-team-general');
  const [newMessage, setNewMessage] = useState('');

  const [channels] = useState<ChatChannel[]>([
    {
      id: 'c-team-general',
      name: '# general-team',
      type: 'team',
      lastMessage: 'Rahul: Updated the Q3 sprint plan doc.',
      time: '11:42 AM',
      unreadCount: 2,
    },
    {
      id: 'c-team-eng',
      name: '# engineering-squad',
      type: 'team',
      lastMessage: 'Sneha: Production deploy completed smoothly.',
      time: '10:15 AM',
      unreadCount: 0,
    },
    {
      id: 'c-hr-desk',
      name: 'HR Confidential Desk',
      type: 'hr',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Your annual leave application has been approved.',
      time: 'Yesterday',
      unreadCount: 1,
      role: 'HR Helpdesk',
      online: true,
    },
    {
      id: 'c-direct-rahul',
      name: 'Amit Verma',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Let us sync on the client feedback at 2 PM.',
      time: '09:30 AM',
      unreadCount: 0,
      role: 'Engineering Manager',
      online: true,
    },
    {
      id: 'c-direct-elena',
      name: 'Elena Rostova',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Shared candidate profiles for the frontend opening.',
      time: 'Yesterday',
      unreadCount: 0,
      role: 'Lead Recruiter',
      online: false,
    },
    {
      id: 'c-group-launch',
      name: '🚀 Project Pegasus Launch',
      type: 'group',
      lastMessage: 'David: Beta testing signups reached 1,200!',
      time: 'Aug 28',
      unreadCount: 0,
    },
  ]);

  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    'c-team-general': [
      {
        id: 'm-1',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        text: 'Morning team! Let us review the sprint velocity during today standup.',
        timestamp: '10:05 AM',
      },
      {
        id: 'm-2',
        senderId: 'u-elena',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        text: 'Two senior engineering candidates will be joining round 2 interviews today.',
        timestamp: '10:14 AM',
      },
      {
        id: 'm-3',
        senderId: 'u-me',
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'I have finalized the API endpoints and shared the architecture documentation.',
        timestamp: '11:20 AM',
        isMe: true,
        attachment: {
          name: 'Architecture_Design_v2.pdf',
          size: '3.4 MB',
          type: 'PDF Document',
        },
      },
      {
        id: 'm-4',
        senderId: 'u-amit',
        senderName: 'Amit Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        text: 'Awesome work! Let us proceed with review.',
        timestamp: '11:42 AM',
      },
    ],
    'c-hr-desk': [
      {
        id: 'm-hr-1',
        senderId: 'u-hr',
        senderName: 'Sneha Gupta (HR Desk)',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        text: 'Hello! Your medical insurance card and annual benefit document are ready for download.',
        timestamp: 'Yesterday 3:15 PM',
        attachment: {
          name: 'Health_Insurance_Policy_2025.pdf',
          size: '1.8 MB',
          type: 'PDF Document',
        },
      },
      {
        id: 'm-hr-2',
        senderId: 'u-hr',
        senderName: 'Sneha Gupta (HR Desk)',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        text: 'Your annual leave application for next month has also been approved.',
        timestamp: 'Yesterday 3:16 PM',
      },
    ],
  });

  const activeChannel = channels.find((c) => c.id === activeChatId) || channels[0];
  const activeMessages = messages[activeChatId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'u-me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), msg],
    }));

    setNewMessage('');
  };

  const filteredChannels = channels.filter((c) => {
    const matchesTab = activeTab === 'all' || c.type === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Team Chat & Collaboration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time direct messaging, squad channels, and HR confidential chat
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 min-h-0 grid grid-cols-12 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Left Channels & Direct Messages Sidebar */}
        <div className="col-span-4 lg:col-span-3 border-r border-slate-200/80 dark:border-slate-800 flex flex-col">
          
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'team', label: 'Team' },
                { id: 'direct', label: 'Direct' },
                { id: 'hr', label: 'HR Desk' },
                { id: 'group', label: 'Groups' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
            {filteredChannels.map((channel) => {
              const isActive = channel.id === activeChatId;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChatId(channel.id)}
                  className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-3 border-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {channel.type === 'team' || channel.type === 'group' ? (
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <Hash className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="relative flex-shrink-0">
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {channel.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate ${isActive ? 'font-bold text-blue-600 dark:text-blue-400' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                        {channel.name}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1 flex-shrink-0">{channel.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {channel.lastMessage}
                    </p>
                  </div>

                  {channel.unreadCount ? (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {channel.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="col-span-8 lg:col-span-9 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950/30">
          
          {/* Active Thread Header */}
          <div className="h-14 px-4 bg-white dark:bg-[#0F172A] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeChannel.type === 'team' || activeChannel.type === 'group' ? (
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  <Hash className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {activeChannel.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
              )}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {activeChannel.name}
                  {activeChannel.type === 'hr' && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 text-[9px] font-semibold flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> Confidential
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {activeChannel.role || (activeChannel.type === 'team' ? '12 team members active' : 'Direct Conversation')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Video className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-toast-slide ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
                />
                <div className={`max-w-[75%] sm:max-w-md ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {msg.senderName}
                    </span>
                    <span className="text-[9.5px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed shadow-2xs transition-all ${
                      msg.isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs hover:shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs hover:border-slate-300'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div className={`mt-2 p-2 rounded-xl border flex items-center justify-between gap-3 ${
                        msg.isMe
                          ? 'bg-blue-700/60 border-blue-500/60 text-white'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 flex-shrink-0 opacity-80" />
                          <span className="truncate text-[11px] font-medium">{msg.attachment.name}</span>
                          <span className="text-[10px] opacity-60">({msg.attachment.size})</span>
                        </div>
                        <button className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-[#0F172A] border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 hover-input-glow"
            />
            <button
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Smile className="h-4 w-4" />
            </button>
            <button
              type="submit"
              className="group h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
