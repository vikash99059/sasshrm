import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/authService';
import { Hrm3dLogo } from '../../components/common/Hrm3dLogo';
import { UserRole } from '../../types';
import {
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('hr_admin');
  const [isLoading, setIsLoading] = useState(false);

  const { switchRole } = useAppStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      await switchRole(role);
      
      if (role === 'saas_owner') {
        navigate('/saas/dashboard');
      } else if (role === 'org_admin') {
        navigate('/organization/dashboard');
      } else if (role === 'manager') {
        navigate('/manager/dashboard');
      } else if (role === 'payroll_admin') {
        navigate('/payroll/dashboard');
      } else if (role === 'recruiter') {
        navigate('/recruitment/jobs');
      } else if (role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/hr/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] rounded-[26px] bg-white dark:bg-[#0F172A] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(0,35,80,0.08)] border border-slate-100 dark:border-slate-800 space-y-2.5 transition-all animate-fade-in">
      
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

      {/* Create Account Header */}
      <div className="text-center space-y-0.5">
        <h2 className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#0A2540] dark:text-white">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-400 font-normal">
          Join thousands of high-performing teams
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleRegister} className="space-y-2 pt-0.5">
        
        {/* Full Name */}
        <div className="space-y-0.5 text-left">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3 py-2 pl-9 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
              required
            />
          </div>
        </div>

        {/* Work Email Address */}
        <div className="space-y-0.5 text-left">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Work Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@company.com"
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3 py-2 pl-9 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
              required
            />
          </div>
        </div>

        {/* Company Name & Role Selector in 2-col grid */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="space-y-0.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Company Name
            </label>
            <div className="relative flex items-center">
              <Building className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-2.5 py-2 pl-8 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Primary Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-2.5 py-2 text-xs text-slate-900 font-medium transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 cursor-pointer"
            >
              <option value="hr_admin">HR Admin</option>
              <option value="org_admin">Org Admin</option>
              <option value="manager">Manager</option>
              <option value="recruiter">Recruiter</option>
              <option value="payroll_admin">Payroll Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-0.5 text-left">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white px-3 py-2 pl-9 pr-9 text-xs text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
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
              Creating account...
            </span>
          ) : (
            <>
              <span>Create Account & Launch</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
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

      {/* Sign in Link Text */}
      <div className="text-center pt-0.5">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
