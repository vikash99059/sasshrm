import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import loginTeamImg from '../assets/login_team.jpg';
import { Hrm3dLogo } from '../components/common/Hrm3dLogo';
import {
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Globe,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic'];

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-[#F4F7FB] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* =========================================================================
          TOP FLOWING MULTI-LAYERED BLUE CURVED WAVES (EXACT AS REFERENCE IMAGE)
         ========================================================================= */}
      <div className="absolute top-0 left-0 right-0 w-full h-[180px] sm:h-[220px] lg:h-[260px] pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 260"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Wave 1: Deep Navy Gradient */}
            <linearGradient id="waveNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071536" />
              <stop offset="35%" stopColor="#0E2B6B" />
              <stop offset="75%" stopColor="#1C4BB8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Wave 2: Vibrant Ocean Blue Gradient */}
            <linearGradient id="waveOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#123B8E" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Wave 3: Sky Blue Light Highlight */}
            <linearGradient id="waveSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>

            {/* Deep Layer Shadows for authentic 3D wave depth */}
            <filter id="waveShadowLayer1" x="-10%" y="-10%" width="130%" height="140%">
              <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#06122E" floodOpacity="0.45" />
            </filter>
            <filter id="waveShadowLayer2" x="-10%" y="-10%" width="130%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0E2863" floodOpacity="0.35" />
            </filter>
            <filter id="waveShadowLayer3" x="-10%" y="-10%" width="130%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1E40AF" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Layer 1: Base Top Deep Navy Wave spanning from left across */}
          <path
            d="M 0,0 L 1440,0 L 1440,75 C 1220,145 990,30 750,80 C 510,130 260,220 0,170 Z"
            fill="url(#waveNavyGrad)"
            filter="url(#waveShadowLayer1)"
          />

          {/* Layer 2: Rich Royal Ocean Blue Wave cascading down */}
          <path
            d="M 0,0 L 1440,0 L 1440,40 C 1180,115 920,15 680,60 C 440,105 200,190 0,135 Z"
            fill="url(#waveOceanGrad)"
            opacity="0.95"
            filter="url(#waveShadowLayer2)"
          />

          {/* Layer 3: Vibrant Sky Blue Foreground Curve accent */}
          <path
            d="M 0,0 L 890,0 C 690,80 480,160 270,140 C 150,130 50,105 0,120 Z"
            fill="url(#waveSkyGrad)"
            opacity="0.92"
            filter="url(#waveShadowLayer3)"
          />
        </svg>
      </div>

      {/* Decorative Bottom Left Subtle Wave Glow */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="w-full h-full bg-gradient-to-tr from-blue-300 via-sky-200 to-transparent rounded-tr-full blur-2xl" />
      </div>

      {/* Decorative Bottom Right Subtle Wave */}
      <div className="absolute bottom-0 right-0 w-[380px] h-[240px] pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="w-full h-full bg-gradient-to-tl from-blue-400 via-sky-200 to-transparent rounded-tl-full blur-3xl" />
      </div>

      {/* =========================================================================
          TOP HEADER ROW: HRM BRAND ON LEFT & LANGUAGE SELECTOR ON RIGHT
         ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-3 sm:pt-4 flex items-center justify-between relative z-20">
        {/* Brand Logo in Top Left Curve */}
        <Link to="/" className="flex items-center gap-3 group">
          <Hrm3dLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none drop-shadow-md">
              HRM
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-blue-100/90 mt-0.5 drop-shadow-xs">
              Human Resource Management
            </span>
          </div>
        </Link>

        {/* Top-Right: Language Selector Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 dark:bg-slate-800/80 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-md text-xs font-medium transition-all cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-blue-300" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-white">{selectedLanguage}</span>
            <ChevronDown className={`h-3 w-3 text-slate-500 dark:text-blue-300 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-fade-in">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                    selectedLanguage === lang ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-slate-800/80' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lang}
                  {selectedLanguage === lang && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN AUTHENTICATION WORKSPACE (100% MATCHING REFERENCE VIEW)
         ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-1 sm:py-2 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO HEADLINE, 4 FEATURE PILLS & FULL OPEN TEAM SCENE WITH 3 FLOATING STATS */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full py-1 lg:py-2 relative animate-slide-in-left">
          
          {/* Top Headline & Description */}
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-black tracking-tight leading-[1.14] text-[#091D3E] dark:text-white">
              Build a Better <br />
              Workplace Together
            </h1>
            <p className="text-xs sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-0.5">
              Streamline your HR processes, manage your team,<br className="hidden sm:inline" />
              and create a better work environment — all in one place.
            </p>
          </div>

          {/* 4 Feature Badges Row */}
          <div className="flex items-center gap-3 sm:gap-6 py-2.5 max-w-xl">
            {/* 1. Employee Management */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-108 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-blue-600 transition-colors">
                Employee<br />Management
              </span>
            </div>

            {/* 2. Attendance Tracking */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-108 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-emerald-600 transition-colors">
                Attendance<br />Tracking
              </span>
            </div>

            {/* 3. Leave Management */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-108 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-purple-600 transition-colors">
                Leave<br />Management
              </span>
            </div>

            {/* 4. Performance & Growth */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-108 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-amber-500 transition-colors">
                Performance<br />& Growth
              </span>
            </div>
          </div>

          {/* Seamless Open Team Scene with 3 Superimposed Floating Metric Badges */}
          <div className="relative w-full max-w-[650px] mt-1">
            
            {/* Seamless Open Image (No heavy box or dark borders, blends smoothly) */}
            <div className="relative w-full overflow-visible">
              <img
                src={loginTeamImg}
                alt="HR Team Working Together"
                className="w-full h-auto max-h-[300px] lg:max-h-[340px] xl:max-h-[370px] object-cover object-[center_35%] rounded-2xl shadow-sm"
              />
              {/* Soft Gradient Overlay for Smooth Edge Blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F4F7FB]/30 via-transparent to-transparent pointer-events-none rounded-2xl" />
            </div>

            {/* Floating Badge 1: Team Growth (+12% ↑) on Left over laptop/desk */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                  Team Growth
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
                    +12%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Floating Badge 2: Happy Employees (98% ↑) in Center Top */}
            <div className="absolute -top-3 right-1/3 sm:-top-4 sm:right-1/3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                  Happy Employees
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
                    98%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Floating Badge 3: Better Productivity (+24% ↑) on Right above plant */}
            <div className="absolute top-1/4 -right-1 sm:top-1/4 sm:-right-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                  Better Productivity
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
                    +24%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN FLOATING AUTHENTICATION CARD OUTLET & COMPACT FOOTER */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full animate-slide-in-right">
          <Outlet />

          {/* Clean Page Footer under the Login Card */}
          <div className="text-center text-[10.5px] text-slate-400 dark:text-slate-500 pt-2.5 space-x-2">
            <span>© 2025 <strong className="text-blue-600 dark:text-blue-400 font-bold">HRM</strong>. All rights reserved.</span>
            <span>|</span>
            <a href="#" className="hover:text-slate-600 dark:text-slate-300 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-600 dark:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};
