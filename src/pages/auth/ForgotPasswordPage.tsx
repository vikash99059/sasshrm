import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hrm3dLogo } from '../../components/common/Hrm3dLogo';
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
    <div className="w-full max-w-[430px] rounded-[26px] bg-white dark:bg-[#0F172A] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,35,80,0.08)] border border-slate-100 dark:border-slate-800 space-y-3 transition-all animate-fade-in">
      
      {/* Top Centered HRM 3D Cube Logo & Title */}
      <div className="flex flex-col items-center justify-center text-center space-y-1">
        <Hrm3dLogo size="md" />
        <div className="flex flex-col items-center">
          <span className="text-xl font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
            HRM
          </span>
          <span className="text-[10.5px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
            Human Resource Management
          </span>
        </div>
      </div>

      {/* Reset Password Header */}
      <div className="text-center space-y-0.5">
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
          <div className="space-y-1 text-left">
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
            className="w-full h-10 sm:h-11 rounded-xl bg-[#1D68FE] hover:bg-blue-600 py-2.5 px-4 text-xs sm:text-[13px] font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group hover-magnetic-btn cursor-pointer disabled:opacity-60 mt-1"
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

          {/* Return to Login */}
          <div className="text-center pt-0.5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* Bottom Security Banner */}
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
    </div>
  );
};
