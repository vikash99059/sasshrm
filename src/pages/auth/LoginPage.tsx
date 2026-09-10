import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import headerBannerImg from '../../assets/headerbanner.png';
import { Hrm3dLogo } from '../../components/common/Hrm3dLogo';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/authService';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Sparkles,
  Users,
  CheckCircle2,
  Zap,
  KeyRound,
  Activity,
  BarChart3,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  // Form & Mode State
  const [email, setEmail] = useState('hr.admin@acmecorp.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Innovative Features State
  const [authMode, setAuthMode] = useState<'password' | 'biometric'>('password');
  const [selectedDemoRole, setSelectedDemoRole] = useState<'hr_admin' | 'manager' | 'employee' | 'payroll_admin' | 'saas_owner'>('hr_admin');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);


  const { switchRole } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = email.trim() || 'hr.admin@acmecorp.com';
    const loginPassword = password.trim() || 'password123';

    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await authService.login(loginEmail, loginPassword);
      await switchRole(user.role);

      // Route directly to user's dashboard based on role
      if (user.role === 'saas_owner') {
        navigate('/saas/dashboard');
      } else if (user.role === 'org_admin' || user.role === 'org_owner') {
        navigate('/organization/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (user.role === 'payroll_admin') {
        navigate('/payroll/dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruitment/jobs');
      } else if (user.role === 'employee') {
        navigate('/employee/dashboard');
      } else if (user.role === 'hr_executive') {
        navigate('/hr-executive/dashboard');
      } else {
        navigate('/hr/dashboard');
      }
    } catch (err) {
      setErrorMessage('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoRoles = [
    { id: 'hr_admin', label: 'HR Admin', email: 'hr.admin@acmecorp.com', role: 'hr_admin', badge: 'Full Admin' },
    { id: 'manager', label: 'Manager', email: 'engineering.lead@acmecorp.com', role: 'manager', badge: 'Team Lead' },
    { id: 'employee', label: 'Employee', email: 'employee@acmecorp.com', role: 'employee', badge: 'Self Service' },
    { id: 'payroll_admin', label: 'Payroll', email: 'payroll.specialist@acmecorp.com', role: 'payroll_admin', badge: 'Payroll Admin' },
    { id: 'saas_owner', label: 'SaaS Owner', email: 'saas.owner@hrmplatform.com', role: 'saas_owner', badge: 'Platform Owner' },
  ];

  const handleSelectRole = (roleId: any) => {
    const roleObj = demoRoles.find((r) => r.id === roleId);
    if (roleObj) {
      setSelectedDemoRole(roleId);
      setEmail(roleObj.email);
      setPassword('password123');
    }
  };

  const handleBiometricScan = async () => {
    setIsScanningBiometric(true);
    setErrorMessage('');
    setTimeout(async () => {
      setIsScanningBiometric(false);
      setBiometricSuccess(true);
      setTimeout(async () => {
        const user = await authService.login(email.trim() || 'hr.admin@acmecorp.com', 'biometric_passkey');
        await switchRole(user.role);
        if (user.role === 'saas_owner') navigate('/saas/dashboard');
        else if (user.role === 'org_admin') navigate('/organization/dashboard');
        else if (user.role === 'manager') navigate('/manager/dashboard');
        else navigate('/hr/dashboard');
      }, 700);
    }, 1800);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      let mockEmail = 'hr.admin@acmecorp.com';
      if (provider === 'apple') mockEmail = 'saas.owner@hrmplatform.com';
      if (provider === 'microsoft') mockEmail = 'admin@acmecorp.com';

      const user = await authService.login(mockEmail, 'social_auth');
      await switchRole(user.role);

      if (user.role === 'saas_owner') {
        navigate('/saas/dashboard');
      } else if (user.role === 'org_admin') {
        navigate('/organization/dashboard');
      } else {
        navigate('/hr/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen lg:h-screen w-full bg-cover bg-center bg-no-repeat text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans select-none"
      style={{ backgroundImage: `url(${headerBannerImg})` }}
    >
      {/* ── Animated Floating Orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {/* Orb 1 — top-right large blue */}
        <div
          className="absolute rounded-full"
          style={{
            width: 420, height: 420,
            top: '-120px', right: '-80px',
            background: 'radial-gradient(circle, rgba(29,104,254,0.18) 0%, transparent 70%)',
            animation: 'orbFloat1 9s ease-in-out infinite',
          }}
        />
        {/* Orb 2 — bottom-left sky */}
        <div
          className="absolute rounded-full"
          style={{
            width: 320, height: 320,
            bottom: '-80px', left: '-60px',
            background: 'radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 70%)',
            animation: 'orbFloat2 11s ease-in-out infinite',
          }}
        />
        {/* Orb 3 — center drifting indigo */}
        <div
          className="absolute rounded-full"
          style={{
            width: 200, height: 200,
            top: '38%', left: '30%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
            animation: 'orbFloat3 13s ease-in-out infinite',
          }}
        />
        {/* Sparkling dots */}
        {[
          { top: '18%', left: '22%', delay: '0s' },
          { top: '55%', left: '10%', delay: '1.2s' },
          { top: '30%', left: '50%', delay: '2.4s' },
          { top: '72%', left: '38%', delay: '0.6s' },
          { top: '12%', left: '60%', delay: '1.8s' },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 4, height: 4,
              top: dot.top, left: dot.left,
              opacity: 0,
              animation: `sparkle 4s ease-in-out ${dot.delay} infinite`,
            }}
          />
        ))}
      </div>
      {/* =========================================================================
          TOP OVERLAY HEADER: LANGUAGE SELECTOR ON TOP RIGHT
         ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-4 sm:pt-6 flex items-center justify-between relative z-20">
        {/* HRM Brand Logo — Top Left above the blue curve */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <Hrm3dLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md leading-none">
                HRM
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-blue-100/90 mt-0.5 drop-shadow-sm">
                Human Resource Management
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          MAIN LAYOUT WORKSPACE: LEFT SPACER & RIGHT-ALIGNED LOGIN CARD
         ========================================================================= */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">

        {/* LEFT COLUMN: Hero headline above the background image */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-start pt-16 pl-2 animate-fade-in">
          <div className="max-w-xl space-y-3">
            <h1 className="text-3xl xl:text-[42px] font-black tracking-tight leading-[1.15] text-[#081E3F] drop-shadow-sm">
              Build a Better <br /><span className='text-blue-500'>Workplace Together</span>
            </h1>
            <p className="text-sm xl:text-[15px] text-slate-500 leading-relaxed font-normal">
              Streamline your HR processes, manage your team,<br />
              and create a better work environment all in one place.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING WHITE LOGIN CARD & FOOTER */}
        <div className="lg:col-span-5 flex flex-col items-start justify-start w-full mt-2 -4 animate-slide-in-right">

          {/* Main Floating White Login Card */}
          <div
            className="w-full max-w-[430px] rounded-[26px] bg-white dark:bg-[#0F172A] p-5 sm:p-6 border border-slate-100 dark:border-slate-800 space-y-3 transition-all anim-card-glow"
          >

            {/* Top Centered HRM 3D Cube Logo & Title */}


            {/* Welcome Back Header */}
            <div className="text-center space-y-0.5 anim-stagger-1">
              <h2 className="text-[21px] sm:text-[23px] font-black tracking-tight text-[#0A2540] dark:text-white">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-normal">
                Sign in to your HRM account to continue
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-2 text-center text-xs font-semibold text-rose-600 dark:text-rose-400 animate-fade-in">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-2.5 pt-0.5">

              {/* Email Address */}
              <div className="space-y-1 text-left anim-stagger-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-10 sm:h-11 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3.5 pl-10 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left anim-stagger-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 sm:h-11 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3.5 pl-10 pr-10 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5 anim-stagger-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-xs text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Primary Blue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-11 rounded-xl bg-[#1D68FE] hover:bg-blue-600 active:bg-blue-700 px-4 text-xs sm:text-[13px] font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group hover-magnetic-btn cursor-pointer disabled:opacity-60 mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider: Or continue with */}
            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10.5px] font-medium text-slate-400">
                <span className="bg-white dark:bg-[#0F172A] px-3">Or continue with</span>
              </div>
            </div>

            {/* 3 Social SSO Login Buttons (Google, Microsoft, Apple) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 py-2 px-2 text-xs font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 transition-all shadow-2xs hover-magnetic-btn cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Google</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleSocialLogin('microsoft')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 py-2 px-2 text-xs font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 transition-all shadow-2xs hover-magnetic-btn cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Microsoft</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/80 py-2 px-2 text-xs font-semibold text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 transition-all shadow-2xs hover-magnetic-btn cursor-pointer"
              >
                <svg className="h-3.5 w-3.5 fill-current text-slate-800 dark:text-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.19.12-10.08-2-14.67-6.35-3.08-2.74-6.99-7.46-11.73-14.15-6.84-9.67-12.18-20.91-16.02-33.72-3.84-12.81-5.76-24.81-5.76-36 0-14.75 3.8-27.18 11.4-37.3 7.6-10.12 17.29-15.28 29.07-15.48 4.81 0 10.08 1.18 15.82 3.54 5.74 2.36 9.61 3.54 11.62 3.54 1.79 0 5.86-1.29 12.22-3.87 6.36-2.58 11.83-3.68 16.42-3.3 12.26.96 22.18 5.63 29.76 14.02-10.69 6.47-15.93 15.35-15.72 26.63.21 8.84 3.57 16.32 10.08 22.44 6.51 6.12 14.16 9.54 22.95 10.26-2.02 5.99-4.43 12.06-7.23 18.21zM119.22 31.02c0-7.39 2.65-14.28 7.95-20.67 5.3-6.39 11.95-10.35 19.95-11.88.35 1.58.53 3.05.53 4.41 0 7.39-2.83 14.44-8.49 21.15-5.66 6.71-12.59 10.63-20.79 11.76-.23-1.63-.35-3.04-.35-4.24z" />
                </svg>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Apple</span>
              </button>
            </div>

            {/* Security Banner */}
            <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/80 dark:border-blue-900/40 py-2 px-3 flex items-center justify-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs flex-shrink-0">
                <ShieldCheck className="h-2.5 w-2.5" />
              </div>
              <div className="text-left flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200">
                  Secure & Encrypted
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">
                  Your data is safe with us
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-0.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>

          </div>

          {/* Footer — below login card */}
          <div className="w-full max-w-[430px] text-center text-[11px] text-slate-500 dark:text-slate-500 pt-3 pb-4 space-x-2 mt-14">
            <span>© 2026 <strong className="text-blue-600 dark:text-blue-400 font-bold">HRM</strong>. All rights reserved.</span>
            <span>|</span>
            <a href="#" className="hover:text-slate-700 dark:text-slate-300 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-700 dark:text-slate-300 transition-colors">Terms of Service</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

