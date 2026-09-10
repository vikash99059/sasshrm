import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hrm3dLogo } from '../../components/common/Hrm3dLogo';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const TwoFactorPage: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...code];
    next[index] = val;
    setCode(next);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="w-full max-w-[430px] rounded-[26px] bg-white dark:bg-[#0F172A] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,35,80,0.08)] border border-slate-100 dark:border-slate-800 space-y-3 transition-all animate-fade-in text-center">
      
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

      <div className="space-y-0.5">
        <h2 className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
          Two-Factor Verification
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-400 font-normal">
          Enter the 6-digit authentication code from your Authenticator app
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-3 pt-0.5">
        <div className="flex justify-center gap-1.5 sm:gap-2">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              className="h-10 w-9 sm:h-11 sm:w-10 text-center text-base font-bold rounded-xl border border-slate-200/90 bg-slate-50/40 focus:bg-white text-[#0F2942] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 sm:h-11 rounded-xl bg-[#1D68FE] hover:bg-blue-600 py-2.5 px-4 text-xs sm:text-[13px] font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group hover-magnetic-btn cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="text-center pt-0.5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </form>

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
