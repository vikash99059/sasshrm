// import React, { useState } from 'react';
// import { Outlet, Link } from 'react-router-dom';
// import loginTeamImg from '../assets/login_team.jpg';
// import { Hrm3dLogo } from '../components/common/Hrm3dLogo';
// import {
//   Users,
//   CalendarCheck,
//   FileText,
//   TrendingUp,
//   BarChart3,
//   ShieldCheck,
//   Globe,
//   ChevronDown,
//   ArrowUpRight,
// } from 'lucide-react';

// export const AuthLayout: React.FC = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState('English');
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);

//   const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic'];

//   return (
//     <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-[#F4F7FB] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">

//       {/* =========================================================================
//           TOP FLOWING MULTI-LAYERED BLUE CURVED WAVES (EXACT MATCH FOR REFERENCE IMAGE)
//          ========================================================================= */}
//       <div className="absolute top-0 left-0 right-0 w-full h-[140px] sm:h-[180px] lg:h-[220px] pointer-events-none z-0 overflow-hidden">
//         <svg
//           viewBox="0 0 1440 220"
//           className="w-full h-full object-cover"
//           preserveAspectRatio="none"
//         >
//           <defs>
//             {/* Wave 1: Deep Navy Gradient Layer */}
//             <linearGradient id="waveNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#04163A" />
//               <stop offset="35%" stopColor="#0B3785" />
//               <stop offset="70%" stopColor="#1251C7" />
//               <stop offset="100%" stopColor="#1E68F6" />
//             </linearGradient>

//             {/* Wave 2: Vibrant Ocean Royal Blue Layer */}
//             <linearGradient id="waveOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#0B3F9E" />
//               <stop offset="50%" stopColor="#1E67ED" />
//               <stop offset="100%" stopColor="#38BDF8" />
//             </linearGradient>

//             {/* Wave 3: Sky Blue Accent Highlight */}
//             <linearGradient id="waveSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#1C5AD4" />
//               <stop offset="60%" stopColor="#38BDF8" />
//               <stop offset="100%" stopColor="#60A5FA" />
//             </linearGradient>

//             {/* Deep Layer Shadows for dynamic 3D depth */}
//             <filter id="waveShadowLayer1" x="-10%" y="-10%" width="130%" height="150%">
//               <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#04122E" floodOpacity="0.4" />
//             </filter>
//             <filter id="waveShadowLayer2" x="-10%" y="-10%" width="130%" height="150%">
//               <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0A2A6C" floodOpacity="0.3" />
//             </filter>
//             <filter id="waveShadowLayer3" x="-10%" y="-10%" width="130%" height="150%">
//               <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1D4ED8" floodOpacity="0.25" />
//             </filter>
//           </defs>

//           {/* Layer 1: Top Deep Navy Wave sweeping across top header */}
//           <path
//             d="M 0,0 L 1440,0 L 1440,60 C 1140,160 820,20 520,110 C 300,160 120,95 0,90 Z"
//             fill="url(#waveNavyGrad)"
//             filter="url(#waveShadowLayer1)"
//           />

//           {/* Layer 2: Rich Ocean Blue Wave sweeping smoothly */}
//           <path
//             d="M 0,0 L 1440,0 L 1440,40 C 1080,120 760,10 460,90 C 240,140 90,85 0,75 Z"
//             fill="url(#waveOceanGrad)"
//             opacity="0.96"
//             filter="url(#waveShadowLayer2)"
//           />

//           {/* Layer 3: Vibrant Sky Blue Curve on top-left edge */}
//           <path
//             d="M 0,0 L 980,0 C 740,75 480,130 250,115 C 120,105 30,70 0,60 Z"
//             fill="url(#waveSkyGrad)"
//             opacity="0.9"
//             filter="url(#waveShadowLayer3)"
//           />
//         </svg>
//       </div>


//       {/* Decorative Bottom Left Soft Ambient Glow */}
//       <div className="absolute bottom-0 left-0 w-[420px] h-[320px] pointer-events-none z-0 overflow-hidden opacity-25">
//         <div className="w-full h-full bg-gradient-to-tr from-blue-400 via-sky-200 to-transparent rounded-tr-full blur-3xl" />
//       </div>

//       {/* Decorative Bottom Right Subtle Glow */}
//       <div className="absolute bottom-0 right-0 w-[380px] h-[260px] pointer-events-none z-0 overflow-hidden opacity-30">
//         <div className="w-full h-full bg-gradient-to-tl from-blue-300 via-sky-100 to-transparent rounded-tl-full blur-3xl" />
//       </div>

//       {/* =========================================================================
//           TOP HEADER ROW: HRM BRAND ON LEFT & LANGUAGE SELECTOR ON RIGHT
//          ========================================================================= */}
//       <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-4 sm:pt-5 flex items-center justify-between relative z-20">
//         {/* Brand Logo in Top Left over Dark Blue Wave */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <Hrm3dLogo size="md" className="group-hover:scale-105 transition-transform" />
//           <div className="flex flex-col">
//             <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none drop-shadow-md">
//               HRM
//             </span>
//             <span className="text-[10px] sm:text-[11px] font-medium text-blue-100/90 mt-0.5 drop-shadow-xs">
//               Human Resource Management
//             </span>
//           </div>
//         </Link>

//         {/* Top-Right: Language Selector Pill Dropdown */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setLangDropdownOpen(!langDropdownOpen)}
//             className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-slate-800 dark:bg-slate-800/80 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm backdrop-blur-md text-xs font-medium transition-all cursor-pointer"
//           >
//             <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-blue-300" />
//             <span className="text-[11.5px] font-semibold text-slate-800 dark:text-white">{selectedLanguage}</span>
//             <ChevronDown className={`h-3 w-3 text-slate-500 dark:text-blue-300 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
//           </button>

//           {langDropdownOpen && (
//             <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-fade-in">
//               {languages.map((lang) => (
//                 <button
//                   key={lang}
//                   type="button"
//                   onClick={() => {
//                     setSelectedLanguage(lang);
//                     setLangDropdownOpen(false);
//                   }}
//                   className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between ${selectedLanguage === lang ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-slate-800/80' : 'text-slate-700 dark:text-slate-300'
//                     }`}
//                 >
//                   {lang}
//                   {selectedLanguage === lang && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* =========================================================================
//           MAIN AUTHENTICATION WORKSPACE (EXACT MATCH FOR IMAGE 2)
//          ========================================================================= */}
//       <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">

//         {/* LEFT COLUMN: HERO HEADLINE, 4 FEATURE PILLS & TEAM SCENE WITH 3 FLOATING STAT BADGES */}
//         <div className="lg:col-span-7 flex flex-col justify-between h-full py-1 lg:py-2 relative animate-slide-in-left">

//           {/* Top Headline & Subtitle matching Image 2 */}
//           <div className="space-y-2 max-w-xl">
//             <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-black tracking-tight leading-[1.14] text-[#081E3F] dark:text-white">
//               Build a Better <br />
//               Workplace Together
//             </h1>
//             <p className="text-xs sm:text-[13.5px] text-slate-500 dark:text-slate-300 leading-relaxed font-normal pt-0.5">
//               Streamline your HR processes, manage your team,<br className="hidden sm:inline" />
//               and create a better work environment — all in one place.
//             </p>
//           </div>

//           {/* 4 Feature Badges Row */}
//           <div className="flex items-center gap-3 sm:gap-6 py-3 max-w-xl">
//             {/* 1. Employee Management */}
//             <div className="flex flex-col items-center text-center group cursor-pointer">
//               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-108 group-hover:bg-blue-600 group-hover:text-white transition-all">
//                 <Users className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-blue-600 transition-colors">
//                 Employee<br />Management
//               </span>
//             </div>

//             {/* 2. Attendance Tracking */}
//             <div className="flex flex-col items-center text-center group cursor-pointer">
//               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-108 group-hover:bg-emerald-600 group-hover:text-white transition-all">
//                 <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-emerald-600 transition-colors">
//                 Attendance<br />Tracking
//               </span>
//             </div>

//             {/* 3. Leave Management */}
//             <div className="flex flex-col items-center text-center group cursor-pointer">
//               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-108 group-hover:bg-purple-600 group-hover:text-white transition-all">
//                 <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-purple-600 transition-colors">
//                 Leave<br />Management
//               </span>
//             </div>

//             {/* 4. Performance & Growth */}
//             <div className="flex flex-col items-center text-center group cursor-pointer">
//               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-108 group-hover:bg-amber-500 group-hover:text-white transition-all">
//                 <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-tight group-hover:text-amber-500 transition-colors">
//                 Performance<br />& Growth
//               </span>
//             </div>
//           </div>

//           {/* Team Photo Scene with 3 Superimposed Floating Metric Badges (Matching Image 2) */}
//           <div className="relative w-full max-w-[650px] mt-2">

//             {/* Team Photo Container */}
//             <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/40 dark:border-slate-800">
//               <img
//                 src={loginTeamImg}
//                 alt="HR Team Working Together"
//                 className="w-full h-auto max-h-[300px] lg:max-h-[340px] xl:max-h-[370px] object-cover object-[center_35%]"
//               />
//             </div>

//             {/* Floating Badge 1: Team Growth (+12% ↑) on Top-Left */}
//             <div className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
//                   Team Growth
//                 </p>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
//                     +12%
//                   </span>
//                   <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
//                 </div>
//               </div>
//             </div>

//             {/* Floating Badge 2: Happy Employees (98% ↑) in Center Top */}
//             <div className="absolute -top-3 right-1/3 sm:-top-4 sm:right-1/3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
//                 <Users className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
//                   Happy Employees
//                 </p>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
//                     98%
//                   </span>
//                   <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
//                 </div>
//               </div>
//             </div>

//             {/* Floating Badge 3: Better Productivity (+24% ↑) on Right */}
//             <div className="absolute top-1/4 -right-1 sm:top-1/4 sm:-right-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-[0_12px_30px_rgba(0,35,80,0.12)] border border-white/80 dark:border-slate-800 flex items-center gap-2.5 z-20 animate-fade-in hover:scale-104 transition-transform">
//               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
//                 <ShieldCheck className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
//                   Better Productivity
//                 </p>
//                 <div className="flex items-center gap-1 mt-0.5">
//                   <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
//                     +24%
//                   </span>
//                   <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT COLUMN: FLOATING AUTHENTICATION CARD OUTLET & FOOTER */}
//         <div className="lg:col-span-5 flex flex-col items-center justify-center w-full animate-slide-in-right">
//           <Outlet />

//           {/* Clean Page Footer under the Login Card */}
//           <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-3 space-x-2">
//             <span>© 2025 <strong className="text-blue-600 dark:text-blue-400 font-bold">HRM</strong>. All rights reserved.</span>
//             <span>|</span>
//             <a href="#" className="hover:text-slate-600 dark:text-slate-300 transition-colors">Privacy Policy</a>
//             <span>|</span>
//             <a href="#" className="hover:text-slate-600 dark:text-slate-300 transition-colors">Terms of Service</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

