import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import {
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  Briefcase,
  Target,
  BarChart3,
  ShieldCheck,
  Zap,
  Headphones,
  Check,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  Smartphone,
  FolderLock,
  Receipt,
  GraduationCap,
  Package,
  Send,
  X,
  Menu,
  Star,
  Search,
  ChevronDown,
  LayoutDashboard,
  Award,
  Calendar as CalendarIcon,
  TrendingUp,
} from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '../components/ui';
import whyChooseBannerImg from '../assets/why_choose_banner.jpg';

export const LandingPage: React.FC = () => {
  const { switchRole } = useAppStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoCompany, setDemoCompany] = useState('');

  // Handle scroll for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchDemo = async (role: UserRole = 'hr_admin') => {
    await switchRole(role);
    if (role === 'saas_owner') {
      navigate('/saas');
    } else {
      navigate('/dashboard');
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setIsDemoModalOpen(false);
      setDemoSubmitted(false);
      setDemoName('');
      setDemoEmail('');
      setDemoCompany('');
      handleLaunchDemo('hr_admin');
    }, 1200);
  };

  const moduleQuickNav = [
    { title: 'Employee Management', icon: Users, path: '/employees' },
    { title: 'Attendance Tracking', icon: CalendarIcon, path: '/attendance' },
    { title: 'Leave Management', icon: CalendarDays, path: '/leave' },
    { title: 'Payroll Management', icon: DollarSign, path: '/payroll' },
    { title: 'Recruitment ATS', icon: Briefcase, path: '/recruitment/candidates' },
    { title: 'Performance Management', icon: Target, path: '/performance/goals' },
    { title: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
  ];

  const whyChooseCards = [
    {
      title: 'All-in-One Solution',
      desc: 'Manage your HR operations in one platform.',
      icon: Zap,
      iconColor: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400',
    },
    {
      title: 'Secure & Reliable',
      desc: 'Your data is always safe with us.',
      icon: ShieldCheck,
      iconColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Easy to Use',
      desc: 'Intuitive interface for better productivity.',
      icon: Sparkles,
      iconColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    },
    {
      title: '24/7 Support',
      desc: 'We are always here to help you.',
      icon: Headphones,
      iconColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      title: 'Automated Workflows',
      desc: 'Save hours weekly with smart automation.',
      icon: Clock,
      iconColor: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      title: 'Real-time Analytics',
      desc: 'Actionable workforce insights & reports.',
      icon: TrendingUp,
      iconColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: 'Mobile Access',
      desc: 'Clock in and manage leaves on the go.',
      icon: Smartphone,
      iconColor: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    },
    {
      title: 'Scalable Growth',
      desc: 'Built to scale effortlessly as you grow.',
      icon: Target,
      iconColor: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
    },
  ];

  const powerfulModules = [
    {
      title: 'Employee Management',
      desc: 'Complete employee lifecycle management',
      icon: Users,
      path: '/employees',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Attendance & Time Tracking',
      desc: 'Track time, shifts and attendance with ease',
      icon: Clock,
      path: '/attendance',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      title: 'Leave Management',
      desc: 'Simplify leave requests and approvals',
      icon: CalendarDays,
      path: '/leave',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: 'Payroll Management',
      desc: 'Automate payroll and salary processing',
      icon: DollarSign,
      path: '/payroll',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      title: 'Recruitment & ATS',
      desc: 'Find and hire the best talent faster',
      icon: Briefcase,
      path: '/recruitment/candidates',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    },
    {
      title: 'Performance Management',
      desc: 'Set goals, track progress and grow',
      icon: Target,
      path: '/performance/goals',
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    },
    {
      title: 'Expenses & Reimbursements',
      desc: 'Manage expenses and claims',
      icon: Receipt,
      path: '/operations/expenses',
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
    },
    {
      title: 'Asset Management',
      desc: 'Track company assets and resources',
      icon: Package,
      path: '/operations/assets',
      iconBg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
    },
    {
      title: 'Document Management',
      desc: 'Keep important documents secure',
      icon: FolderLock,
      path: '/operations/documents',
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
    },
    {
      title: 'Training & Development',
      desc: 'Build skills for a better tomorrow',
      icon: GraduationCap,
      path: '/operations/training',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: 'Reports & Analytics',
      desc: 'Get insights with powerful reports',
      icon: BarChart3,
      path: '/reports',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Mobile Access',
      desc: 'Manage HR anytime, anywhere',
      icon: Smartphone,
      path: '/clock-in',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'HR Manager',
      company: 'Techcorp',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      comment: "This HRM platform has completely transformed how we manage our people. It's simple, powerful and easy to use!",
    },
    {
      name: 'Amit Verma',
      role: 'CEO',
      company: 'GrowthHub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'The automation and analytics features save us hours of manual work. Highly recommended for any growing business!',
    },
    {
      name: 'Neha Gupta',
      role: 'Operations Head',
      company: 'BizSolutions',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Excellent support and a very intuitive interface. Our entire team loves the seamless self-service portal!',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F9FD] dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white font-sans overflow-x-clip">
      {/* 1. FLOATING STICKY HEADER */}
      <header
        className={`sticky top-0 z-[100] w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'pt-2 sm:pt-2.5 pb-1' : 'pt-3 sm:pt-4 pb-2'
          }`}
      >
        <div
          className={`max-w-[1360px] mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border rounded-2xl sm:rounded-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-all duration-300 ${isScrolled
              ? 'shadow-[0_12px_35px_-5px_rgba(0,35,80,0.15)] border-slate-300/90 dark:border-slate-700/90 bg-white/95 dark:bg-slate-900/95'
              : 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border-slate-200/80 dark:border-slate-800/80 dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]'
            }`}
        >
          {/* Logo with 3D Blue Cube/Diamond Icon */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white">◆</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              HRM
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-slate-600 dark:text-slate-300">
            <a href="#home" className="text-slate-900 dark:text-white font-semibold hover:text-blue-600 transition-colors nav-underline-sweep">Home</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-underline-sweep">Features</a>
            <a href="#modules" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-underline-sweep">Modules</a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-underline-sweep">Pricing</a>
            <a href="#why-us" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-underline-sweep">About</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors nav-underline-sweep">Contact</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-5">
            <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors nav-underline-sweep">
              Login
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleLaunchDemo('hr_admin')}
              className="rounded-full px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover-magnetic-btn"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden max-w-[1360px] mx-auto mt-2 rounded-2xl border border-slate-200/80 bg-white/95 p-4 dark:border-slate-800 dark:bg-slate-900/95 shadow-xl backdrop-blur-md space-y-3 animate-slide-down">
            <a href="#home" onClick={() => setMobileNavOpen(false)} className="block text-sm font-medium py-1.5 text-slate-700 dark:text-slate-200">Home</a>
            <a href="#features" onClick={() => setMobileNavOpen(false)} className="block text-sm font-medium py-1.5 text-slate-700 dark:text-slate-200">Features</a>
            <a href="#modules" onClick={() => setMobileNavOpen(false)} className="block text-sm font-medium py-1.5 text-slate-700 dark:text-slate-200">Modules</a>
            <a href="#pricing" onClick={() => setMobileNavOpen(false)} className="block text-sm font-medium py-1.5 text-slate-700 dark:text-slate-200">Pricing</a>
            <a href="#why-us" onClick={() => setMobileNavOpen(false)} className="block text-sm font-medium py-1.5 text-slate-700 dark:text-slate-200">About</a>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Link to="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Button variant="primary" size="sm" className="flex-1 hover-magnetic-btn" onClick={() => handleLaunchDemo('hr_admin')}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (High-visibility, rich background gradient, increased mockup height & balanced layout) */}
      <section id="home" className="relative pt-3 pb-8 lg:pt-5 lg:pb-10 overflow-hidden w-full">
        {/* Soft Organic Fluid Wave & Glow Backgrounds matching reference */}
        <div className="absolute top-0 right-0 w-[850px] h-[680px] bg-gradient-to-bl from-blue-200/50 via-indigo-100/40 to-sky-100/20 blur-[90px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-[550px] h-[500px] bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-transparent blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute -bottom-10 right-1/4 w-[600px] h-[350px] bg-purple-100/35 blur-[110px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-4 text-left pr-0 lg:pr-3">
              {/* Badge: ⚡ Next Gen HRM Platform */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 shadow-2xs hover:scale-105 transition-transform">
                <Zap className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                <span>Next Gen HRM Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="tracking-tight text-slate-900 dark:text-white">
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] font-bold leading-[1.18] text-slate-900 dark:text-white">
                  Complete HR Management
                </span>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-[31px] xl:text-[35px] font-semibold sm:font-bold leading-[1.2] text-blue-600 dark:text-blue-500 mt-1 sm:mt-1.5">
                  for Modern Organizations
                </span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-lg">
                Streamline your people, processes and performance with our all-in-one HRM platform. From recruitment to retirement, we help you build better teams and a stronger tomorrow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="md"
                  onClick={() => handleLaunchDemo('hr_admin')}
                  className="rounded-full px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 group transition-all hover-magnetic-btn hover-glow-border"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-dark-card dark:border-slate-700 dark:text-slate-200 shadow-sm hover-magnetic-btn"
                  leftIcon={
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-0.5 group-hover:scale-110 transition-transform">
                      <Play className="h-2.5 w-2.5 fill-blue-600 text-blue-600 ml-0.5" />
                    </span>
                  }
                >
                  Book a Demo
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 dark:border-dark-border text-xs">
                <div className="space-y-0.5 group cursor-default">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm hover-stat-pop">
                    <Users className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>100+</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Happy Customers</p>
                </div>

                <div className="space-y-0.5 group cursor-default">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm hover-stat-pop">
                    <Briefcase className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span>50K+</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Employees Managed</p>
                </div>

                <div className="space-y-0.5 group cursor-default">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm hover-stat-pop">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>99.9%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Uptime Guarantee</p>
                </div>
              </div>
            </div>

            {/* Right Visual Area: Big Spacious Mockup Layout with Fluid Cloud Background */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end select-none">
              {/* Organic Fluid Cloud / Wave Shape Behind Visuals */}
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-blue-100/50 via-sky-100/60 to-indigo-100/50 rounded-[48px] blur-xl -z-10" />

              {/* Floating Badge (Top Right above Phone): Trusted by 500+ Companies */}
              <div className="absolute -top-4 right-10 hidden sm:flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-blue-900/10 border border-slate-100 dark:bg-dark-card dark:border-dark-border z-30 animate-fade-in hover:scale-105 transition-transform">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shadow-2xs">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-medium">Trusted by</p>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">500+ Companies</p>
                </div>
              </div>

              {/* Floating Blue Paper Airplane on lower left */}
              <div className="absolute bottom-10 -left-4 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-xl shadow-blue-500/40 z-30 transform -rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-300 cursor-pointer">
                <Send className="h-4 w-4 fill-white/20 text-white" />
              </div>

              {/* Floating Blue Paper Airplane on upper right */}
              <div className="absolute top-1/4 -right-2 hidden xl:flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-400/40 z-30 transform rotate-45 hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer">
                <Send className="h-3.5 w-3.5 fill-white/20 text-white" />
              </div>

              {/* Layout Container holding Desktop Dashboard + Mobile Phone */}
              <div className="relative flex items-center w-full max-w-[700px]">
                {/* Main Desktop Dashboard Preview (Taller, wider, higher visibility) */}
                <div
                  onClick={() => handleLaunchDemo('hr_admin')}
                  className="cursor-pointer group relative w-full rounded-2xl bg-white p-2.5 shadow-2xl shadow-blue-900/15 border border-slate-200/90 dark:bg-dark-card dark:border-dark-border transition-all duration-300 hover:scale-[1.008] hover:shadow-blue-500/20 hover-glow-border"
                >
                  <div className="grid grid-cols-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    {/* Left Dark Navy Sidebar */}
                    <div className="col-span-3 bg-[#0F172A] p-3 text-slate-400 space-y-1 text-[10px] hidden sm:block">
                      {/* HRM Logo at top of sidebar */}
                      <div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-slate-800 text-white font-bold text-xs">
                        <div className="h-4 w-4 rounded bg-blue-600 flex items-center justify-center text-[10px]">◆</div>
                        <span>HRM</span>
                      </div>
                      <div className="px-2 py-1.5 rounded bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-2xs">
                        <LayoutDashboard className="h-3 w-3" /> Dashboard
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <Users className="h-3 w-3" /> Employees
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <Clock className="h-3 w-3" /> Attendance
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <CalendarDays className="h-3 w-3" /> Leave
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <DollarSign className="h-3 w-3" /> Payroll
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <Briefcase className="h-3 w-3" /> Recruitment
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <Target className="h-3 w-3" /> Performance
                      </div>
                      <div className="px-2 py-1 rounded hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors">
                        <BarChart3 className="h-3 w-3" /> Reports
                      </div>
                    </div>

                    {/* Main Dashboard Canvas (Crisp White matching reference) */}
                    <div className="col-span-12 sm:col-span-9 bg-[#FAFCFF] dark:bg-dark-bg p-4 space-y-3.5">
                      {/* Top Bar inside mockup */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Good morning, Admin 👋</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400">Here’s what’s happening with your platform today.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] sm:text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded shadow-2xs font-medium flex items-center gap-1">
                            May 20 - May 26, 2024 <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                          </span>
                          <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded shadow-2xs">
                            Export Report
                          </span>
                        </div>
                      </div>

                      {/* 4 KPI Cards in a row (Matching Reference: 248, 236, 12, 8) */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white dark:bg-dark-card p-2.5 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs">
                          <span className="text-[9px] text-slate-400 block font-medium">Total Employees</span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">248</span>
                            <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">+12%</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-2.5 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs">
                          <span className="text-[9px] text-slate-400 block font-medium">Present Today</span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-sm font-extrabold text-emerald-600">236</span>
                            <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">+3%</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-2.5 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs">
                          <span className="text-[9px] text-slate-400 block font-medium">On Leave</span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-sm font-extrabold text-indigo-600">12</span>
                            <span className="text-[8px] text-rose-500 font-bold bg-rose-50 px-1 py-0.5 rounded">-3%</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-2.5 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs">
                          <span className="text-[9px] text-slate-400 block font-medium">New Employees</span>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-sm font-extrabold text-blue-600">8</span>
                            <span className="text-[8px] text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">+15%</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row Charts */}
                      <div className="grid grid-cols-12 gap-2.5">
                        {/* Attendance Overview Line Chart */}
                        <div className="col-span-7 bg-white dark:bg-dark-card p-3 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Attendance Overview</span>
                            <span className="text-[8px] text-slate-400">Weekly</span>
                          </div>
                          {/* Smooth SVG Area Curve matching reference */}
                          <div className="h-20 w-full relative">
                            <svg className="w-full h-full" viewBox="0 0 140 45" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="heroBlueGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <path
                                d="M0,35 Q20,38 40,22 T80,12 T110,28 T140,8 L140,45 L0,45 Z"
                                fill="url(#heroBlueGrad)"
                              />
                              <path
                                d="M0,35 Q20,38 40,22 T80,12 T110,28 T140,8"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              {/* Data points */}
                              <circle cx="40" cy="22" r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                              <circle cx="80" cy="12" r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                              <circle cx="110" cy="28" r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                              <circle cx="140" cy="8" r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                            </svg>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400 font-medium px-1">
                            <span>May 20</span>
                            <span>May 21</span>
                            <span>May 22</span>
                            <span>May 23</span>
                            <span>May 24</span>
                            <span>May 25</span>
                            <span>May 26</span>
                          </div>
                        </div>

                        {/* Department Distribution Donut */}
                        <div className="col-span-5 bg-white dark:bg-dark-card p-2.5 rounded-lg border border-slate-100 dark:border-dark-border shadow-2xs space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">Department Distribution</span>
                          <div className="flex items-center gap-2">
                            {/* Donut Circle with 248 Center */}
                            <div className="relative h-14 w-14 rounded-full border-4 border-blue-600 border-t-purple-500 border-r-emerald-500 border-b-amber-500 flex items-center justify-center flex-shrink-0">
                              <div className="text-center">
                                <span className="text-[9px] font-bold text-slate-900 dark:text-white block leading-tight">248</span>
                                <span className="text-[7px] text-slate-400 block">Total</span>
                              </div>
                            </div>
                            {/* Legend */}
                            <div className="text-[8px] space-y-0.5 text-slate-600 dark:text-slate-400 font-medium flex-1">
                              <div className="flex justify-between"><span><b className="text-blue-500 font-bold">●</b> Eng</span> <b>38%</b></div>
                              <div className="flex justify-between"><span><b className="text-purple-500 font-bold">●</b> Mkt</span> <b>18%</b></div>
                              <div className="flex justify-between"><span><b className="text-emerald-500 font-bold">●</b> HR</span> <b>12%</b></div>
                              <div className="flex justify-between"><span><b className="text-amber-500 font-bold">●</b> Sales</span> <b>14%</b></div>
                              <div className="flex justify-between"><span><b className="text-slate-400 font-bold">●</b> Other</span> <b>24%</b></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Phone Mockup (Positioned cleanly on right without occluding the desktop charts) */}
                <div className="hidden xl:block absolute -right-10 -bottom-6 w-52 rounded-[32px] bg-slate-900 p-2 shadow-2xl border-4 border-slate-800 z-20 transition-transform hover:translate-y-[-4px]">
                  {/* Phone screen */}
                  <div className="rounded-[24px] bg-white dark:bg-dark-card p-3 space-y-2 text-[9px] text-slate-700 dark:text-slate-200 shadow-inner">
                    {/* Phone Topbar */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-blue-600">◆ HRM</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>

                    <div>
                      <span className="font-bold text-[9px] block">Good morning, Sarah 👋</span>
                      <span className="text-[7px] text-slate-400">Software Engineer</span>
                    </div>

                    {/* 4 Mini Attendance Stats */}
                    <div className="grid grid-cols-4 gap-1 text-[7px] text-center">
                      <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded">Clock In <b className="block text-slate-900 dark:text-white">09:00</b></div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/50 p-1 rounded">Present <b className="block text-emerald-600">112</b></div>
                      <div className="bg-rose-50 dark:bg-rose-950/50 p-1 rounded">Leave <b className="block text-rose-600">2</b></div>
                      <div className="bg-amber-50 dark:bg-amber-950/50 p-1 rounded">Late <b className="block text-amber-600">1</b></div>
                    </div>

                    {/* Mini Sparkline Curve */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/30 p-1.5 rounded-lg border border-blue-100/60 dark:border-blue-900/50">
                      <span className="text-[7px] font-bold text-blue-700 dark:text-blue-300 block mb-0.5">Attendance Overview</span>
                      <div className="h-6 w-full">
                        <svg className="w-full h-full" viewBox="0 0 100 30">
                          <path d="M0,20 Q25,5 50,15 T100,5" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    {/* My Leave Balance Pill */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[7px] opacity-80 block">My Leave Balance</span>
                        <p className="font-bold text-[11px]">18 Days</p>
                      </div>
                      <button className="bg-white text-blue-600 text-[8px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                        Apply
                      </button>
                    </div>

                    {/* Phone Bottom Nav Icons */}
                    <div className="flex justify-around items-center pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                      <LayoutDashboard className="h-3 w-3 text-blue-600" />
                      <Clock className="h-3 w-3" />
                      <DollarSign className="h-3 w-3" />
                      <Users className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* Minimalist Potted Plant on bottom right */}
                <div className="hidden xl:block absolute -right-16 -bottom-3 z-10 opacity-90">
                  <svg width="55" height="85" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 65 Q25 40 12 25 Q20 20 28 35" fill="#10B981" />
                    <path d="M30 65 Q35 35 48 18 Q45 28 34 45" fill="#059669" />
                    <path d="M30 65 Q20 50 8 45 Q16 40 25 52" fill="#34D399" />
                    <path d="M30 65 Q40 50 52 42 Q46 52 35 56" fill="#10B981" />
                    <path d="M30 65 Q30 25 30 10 Q34 22 30 35" fill="#047857" />
                    <path d="M20 65 L40 65 L36 88 L24 88 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                    <ellipse cx="30" cy="65" rx="10" ry="2.5" fill="#E2E8F0" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HR MODULE QUICK NAVIGATION BAR (7 Columns in one compact white horizontal container) */}
      <section className="py-2 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-md dark:bg-dark-card dark:border-dark-border overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-dark-border">
            {moduleQuickNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleLaunchDemo('hr_admin')}
                  className="group flex flex-col items-center justify-center p-3.5 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all text-center space-y-2 cursor-pointer"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 dark:bg-slate-800 dark:text-blue-400 shadow-2xs group-hover:shadow-md group-hover:shadow-blue-500/25 group-hover:-translate-y-1">
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE OUR HRM PLATFORM (Pixel-perfect match with reference image) */}
      <section id="why-us" className="py-10 lg:py-14 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="space-y-1 text-left mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why Choose Our HRM Platform?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Built with modern technology and designed for people. Everything you need to manage your workforce efficiently, all in one place.
          </p>
        </div>

        {/* Top Composition: 8 Feature Cards on Left + Business Woman Graphic Banner on Right (100% Equal Height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: 8 Feature Cards (4 Upper, 4 Niche) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 h-full">
            {whyChooseCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-slate-100/90 bg-white p-3 sm:p-3.5 shadow-2xs hover-card-lift hover-glow-border transition-all duration-200 dark:bg-dark-card dark:border-dark-border flex flex-col justify-between h-full space-y-2 cursor-pointer"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconColor} shadow-2xs flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Seamless Graphic Banner (Equal Height matching Left Cards Grid) */}
          <div className="lg:col-span-6 relative flex h-full">
            <div className="relative w-full h-full min-h-[220px] rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 border border-slate-100 dark:border-dark-border group bg-white flex items-center hover-shine-sweep">
              <img
                src={whyChooseBannerImg}
                alt="Better HR Better Business - Simple, Secure, Scalable, Powerful"
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. POWERFUL HR MODULES (Exact 6-Column x 2-Row = 12 Cards Grid) */}
      <section id="modules" className="py-12 lg:py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-1 text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Powerful HR Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to manage your workforce, from hiring to retirement.
          </p>
        </div>

        {/* 6 Columns Grid on LG screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {powerfulModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                onClick={() => handleLaunchDemo('hr_admin')}
                className="group cursor-pointer rounded-2xl border border-slate-100/90 bg-white p-4 transition-all duration-200 hover-card-lift hover-glow-border dark:border-dark-border dark:bg-dark-card flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${mod.iconBg} shadow-2xs group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. JOIN 500+ ORGANIZATIONS (Matching Reference Light Blue Gradient Banner) */}
      <section className="py-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[28px] bg-gradient-to-r from-blue-50/90 via-sky-50 to-indigo-50/90 border border-blue-100/80 dark:bg-dark-card dark:border-dark-border p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden hover-shine-sweep">
          {/* Decorative Corner Floating Drops */}
          <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-blue-400/10 rounded-full blur-lg pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-400/10 rounded-full blur-lg pointer-events-none" />

          {/* Left Title */}
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Join 500+ Organizations <br className="hidden sm:inline" />
              <span className="text-blue-600 dark:text-blue-400">Already Growing with Us</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trusted by startups, SMEs and enterprises worldwide.
            </p>
          </div>

          {/* Center 3 Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
            <div className="space-y-0.5 group cursor-default">
              <div className="flex items-center justify-center gap-1.5 font-black text-xl sm:text-2xl text-slate-900 dark:text-white hover-stat-pop">
                <Users className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>500+</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Happy Customers</p>
            </div>

            <div className="space-y-0.5 group cursor-default">
              <div className="flex items-center justify-center gap-1.5 font-black text-xl sm:text-2xl text-slate-900 dark:text-white hover-stat-pop">
                <Briefcase className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>100K+</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Employees Managed</p>
            </div>

            <div className="space-y-0.5 group cursor-default">
              <div className="flex items-center justify-center gap-1.5 font-black text-xl sm:text-2xl text-slate-900 dark:text-white hover-stat-pop">
                <ShieldCheck className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>99.9%</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">System Uptime</p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => handleLaunchDemo('hr_admin')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-2.5 shadow-md shadow-blue-500/25 text-xs transition-all hover-magnetic-btn"
            >
              Start Your Free Trial →
            </Button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:underline px-2 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & PRICING SPLIT SECTION */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Customer Testimonials */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                What Our Customers Say
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hear from leading HR executives and team leaders.
              </p>
            </div>

            <div className="space-y-3.5">
              {testimonials.map((testi, idx) => (
                <Card key={idx} hoverEffect className="p-4 space-y-2.5 border-slate-200/80 dark:border-dark-border group cursor-pointer hover-card-lift hover-glow-border">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 group-hover:scale-110 transition-transform" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{testi.comment}"
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-dark-border">
                    <img src={testi.avatar} alt={testi.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 hover-avatar-ring" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{testi.name}</h4>
                      <p className="text-[10px] text-slate-400">{testi.role}, {testi.company}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right 7 Cols: Simple, Transparent Pricing */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the plan that fits your organization's needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Basic Plan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-dark-border dark:bg-dark-card space-y-5 flex flex-col justify-between hover-card-lift hover-glow-border transition-all">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-slate-500">Basic</span>
                  <div className="flex items-baseline gap-1 hover-stat-pop">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">$49</span>
                    <span className="text-[10px] text-slate-400">/ month</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Up to 50 Employees</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Core HR Features</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Email Support</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs rounded-full hover-magnetic-btn" onClick={() => handleLaunchDemo('hr_admin')}>
                  Get Started
                </Button>
              </div>

              {/* Professional Plan (Highlighted) */}
              <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-5 shadow-xl shadow-blue-500/10 dark:bg-slate-900 space-y-5 flex flex-col justify-between hover-card-lift hover-shine-sweep transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Professional</span>
                  <div className="flex items-baseline gap-1 hover-stat-pop">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">$99</span>
                    <span className="text-[10px] text-slate-400">/ month</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Up to 200 Employees</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> All HR Modules</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Priority Support</div>
                  </div>
                </div>

                <Button variant="primary" size="sm" className="w-full text-xs rounded-full shadow-md hover-magnetic-btn" onClick={() => handleLaunchDemo('hr_admin')}>
                  Get Started
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-dark-border dark:bg-dark-card space-y-5 flex flex-col justify-between hover-card-lift hover-glow-border transition-all">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-slate-500">Enterprise</span>
                  <div className="flex items-baseline gap-1 hover-stat-pop">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">Custom</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Unlimited Employees</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Advanced Features</div>
                    <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Dedicated Support</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs rounded-full hover-magnetic-btn" onClick={() => setIsDemoModalOpen(true)}>
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#0B0F19] text-slate-400 pt-16 pb-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                ◆
              </div>
              <span className="text-white font-bold text-base">HRM</span>
            </div>

            {/* Tagline */}
            <span className="text-slate-400 font-medium text-xs">
              Modern • Secure • Scalable • Complete HR Solution
            </span>

            {/* Navigation links */}
            <div className="flex items-center gap-5 text-xs text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <p>© 2024 HRM. All rights reserved.</p>
            <p>Designed for High-Velocity Modern Workforces.</p>
          </div>
        </div>
      </footer>

      {/* Book a Demo Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Schedule a Personalized HRM Demo"
        description="See how HRM Pro can automate your organization's workforce operations."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDemoSubmit}>
              Schedule Demo Slot
            </Button>
          </>
        }
      >
        {demoSubmitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white">Demo Scheduled!</p>
            <p className="text-xs text-slate-500">Redirecting to live product workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={demoName}
              onChange={(e) => setDemoName(e.target.value)}
              placeholder="Sarah Jenkins"
              required
            />
            <Input
              label="Work Email Address"
              type="email"
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              placeholder="sarah@company.com"
              required
            />
            <Input
              label="Company Name & Team Size"
              value={demoCompany}
              onChange={(e) => setDemoCompany(e.target.value)}
              placeholder="Acme Corp (150 Employees)"
              required
            />
          </form>
        )}
      </Modal>
    </div>
  );
};
