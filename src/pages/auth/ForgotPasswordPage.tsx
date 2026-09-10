import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hrm3dLogo } from '../../components/common/Hrm3dLogo';
import headerBannerImg from '../../assets/headerbanner.png';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between relative overflow-x-hidden font-sans select-none"
      style={{ backgroundImage: `url(${headerBannerImg})` }}
    >
      {/* Header: HRM Logo top-left */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-4 sm:pt-6 flex items-center justify-between relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <Hrm3dLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md leading-none">HRM</span>
            <span className="text-[10px] sm:text-[11px] font-medium text-blue-100/90 mt-0.5 drop-shadow-sm">Human Resource Management</span>
          </div>
        </Link>
      </div>

      {/* Main grid: hero text left, card right */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">

        {/* LEFT: Hero text */}
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

        {/* RIGHT: Forgot Password Card */}
        <div className="lg:col-span-5 flex flex-col items-start justify-start w-full mt-2 pl-4">
          <div className="w-full max-w-[430px] rounded-[26px] bg-white dark:bg-[#0F172A] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,35,80,0.08)] border border-slate-100 dark:border-slate-800 space-y-3 transition-all anim-card-glow">

            {/* Reset Password Header */}
            <div className="text-center space-y-0.5 anim-stagger-1">
              <h2 className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
                Reset Your Password
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-normal">
                Enter your email to receive recovery instructions
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center space-y-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/30 animate-fade-in">
                <CheckCircle2 className="h-9 w-9 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Recovery Email Sent!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  We've sent a password reset link to <strong className="text-emerald-900 dark:text-emerald-200">{email}</strong>.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-[#1D68FE] hover:bg-blue-600 py-2 px-4 text-xs font-bold text-white shadow-md transition-all cursor-pointer mt-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5 pt-0.5">
                {/* Email Address */}
                <div className="space-y-1 text-left anim-stagger-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Registered Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full h-10 sm:h-11 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3.5 pl-10 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 rounded-xl bg-[#1D68FE] hover:bg-blue-600 py-2.5 px-4 text-xs sm:text-[13px] font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group hover-magnetic-btn cursor-pointer disabled:opacity-60 mt-1 anim-stagger-3"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending link...
                    </span>
                  ) : (
                    <>
                      <span>Send Reset Instructions</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-0.5 anim-stagger-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                  </Link>
                </div>
              </form>
            )}

            {/* Security Banner */}
            <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/80 dark:border-blue-900/40 py-2 px-3 flex items-center justify-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs flex-shrink-0">
                <ShieldCheck className="h-2.5 w-2.5" />
              </div>
              <div className="text-left flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-[10.5px] font-bold text-slate-800 dark:text-slate-200">Secure & Encrypted</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Your data is safe with us</span>
              </div>
            </div>
          </div>

          {/* Footer — below card */}
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
