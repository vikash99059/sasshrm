import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Users,
  Edit3,
  Camera,
  User,
  Briefcase,
  FileText,
  Clock,
  Building,
  ShieldCheck,
  CheckCircle2,
  Download,
  X,
  Save,
} from 'lucide-react';

interface ProfileData {
  fullName: string;
  fathersName: string;
  designation: string;
  department: string;
  employeeId: string;
  status: string;
  email: string;
  phone: string;
  location: string;
  joiningDate: string;
  dob: string;
  bloodGroup: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  aadharNumber: string;
  permanentAddress: string;
  currentAddress: string;
  avatar: string;
  // Professional Details
  employmentType: string;
  reportingManager: string;
  workShift: string;
  workLocation: string;
  // Emergency Contacts
  personalEmail: string;
  emergencyContactName: string;
  emergencyPhone: string;
  relationship: string;
}

export const EmployeeProfilePage: React.FC = () => {
  const { currentUser } = useAppStore();
  const [avatarShape, setAvatarShape] = useState<'curved-rect' | 'circle'>('curved-rect');
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'contact' | 'documents'>('personal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Information matching reference image
  const [profile, setProfile] = useState<ProfileData>({
    fullName: currentUser?.name || 'Rohit Sharma',
    fathersName: 'Rajesh Sharma',
    designation: currentUser?.designation || 'HR Executive',
    department: currentUser?.departmentName || 'Human Resources',
    employeeId: 'HRM001245',
    status: 'Active',
    email: currentUser?.email || 'rohit.sharma@acmecorp.com',
    phone: '+91 98765 43210',
    location: 'Noida, Uttar Pradesh',
    joiningDate: '15 Jan 2022',
    dob: '12 Mar 1995',
    bloodGroup: 'B+',
    gender: 'Male',
    nationality: 'Indian',
    maritalStatus: 'Single',
    aadharNumber: 'XXXX-XXXX-1234',
    permanentAddress: 'A-123, Green Park, Sector 62\nNoida, Uttar Pradesh - 201301',
    currentAddress: 'A-123, Green Park, Sector 62\nNoida, Uttar Pradesh - 201301',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=95',
    employmentType: 'Full-Time (Permanent)',
    reportingManager: 'Amit Verma (Engineering & Operations Director)',
    workShift: 'General Shift (09:00 AM - 06:00 PM)',
    workLocation: 'Noida Tech Park, Tower B, Floor 4',
    personalEmail: 'rohit.sharma.personal@gmail.com',
    emergencyContactName: 'Rajesh Sharma',
    emergencyPhone: '+91 98111 22334',
    relationship: 'Father',
  });

  const [editForm, setEditForm] = useState<ProfileData>(profile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      


      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile changes successfully updated!</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: IDENTITY CARD WITH RECTANGLE BANNER, CURVE DESIGN & BIG IMAGE
           ========================================================================= */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Top Blue Rectangle Banner with Fluid Curved Wave Design */}
          <div className="h-36 sm:h-40 w-full relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500">
            {/* Elegant SVG Wave Ribbon Curves */}
            <svg
              viewBox="0 0 600 180"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="curveWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.18" />
                </linearGradient>
              </defs>

              {/* Upper Background Curve */}
              <path
                d="M 0,55 C 160,10 320,85 600,40 L 600,180 L 0,180 Z"
                fill="url(#curveWaveGrad1)"
              />

              {/* Middle Flowing Accent Curve */}
              <path
                d="M 0,95 C 180,135 380,45 600,105 L 600,180 L 0,180 Z"
                fill="url(#curveWaveGrad2)"
              />

              {/* Bottom Subtle Ripple Curve */}
              <path
                d="M 0,140 C 220,95 400,165 600,130 L 600,180 L 0,180 Z"
                fill="#ffffff"
                fillOpacity="0.1"
              />
            </svg>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-6 pt-0 text-center space-y-4">
            
            {/* Large Avatar with Clean Curved Rectangle / Circle Design & Camera Badge */}
            <div className="relative inline-block -mt-16 sm:-mt-20">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className={`w-32 h-32 sm:w-36 sm:h-36 object-cover border-4 border-white dark:border-[#0F172A] shadow-xl mx-auto transition-all duration-300 ${
                  avatarShape === 'curved-rect'
                    ? 'rounded-[32px]'
                    : 'rounded-full'
                }`}
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0F172A] transition-transform hover:scale-105 cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Name, Designation & Status */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile.fullName}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {profile.designation}
              </p>
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {profile.status}
                </span>
              </div>
            </div>

            {/* Contact Rows */}
            <div className="space-y-2.5 text-left pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* 3-Column Quick Stats Box */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/80">
              {/* Joining Date */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Joining Date</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.joiningDate}
                </span>
              </div>

              {/* Employee ID */}
              <div className="flex flex-col items-center border-x border-slate-200/60 dark:border-slate-800 px-1">
                <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Employee ID</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {profile.employeeId}
                </span>
              </div>

              {/* Department */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Department</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate max-w-[80px]">
                  {profile.department}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => {
                setEditForm(profile);
                setIsEditModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/70 bg-white dark:bg-[#0F172A] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DETAILS TAB NAVIGATION & STRUCTURED INFORMATION CARDS
           ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Top Pill Tabs matching reference */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'personal', label: 'Personal Details' },
              { id: 'professional', label: 'Professional Details' },
              { id: 'contact', label: 'Contact Details' },
              { id: 'documents', label: 'Documents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-2 border-blue-600 text-blue-600 bg-white dark:bg-[#0F172A] shadow-xs'
                    : 'border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ================= TAB 1: PERSONAL DETAILS ================= */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Card 1: Personal Information */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Full Name</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.fullName}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Father's Name</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.fathersName}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Date of Birth</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.dob}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Blood Group</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.bloodGroup}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Gender</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.gender}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Nationality</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.nationality}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Marital Status</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {profile.maritalStatus}
                    </p>
                  </div>

                  <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                    <p className="text-xs text-slate-400 font-medium">Aadhar Number</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 tracking-wider">
                      {profile.aadharNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Address */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Permanent Address</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line">
                      {profile.permanentAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-medium">Current Address</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line">
                      {profile.currentAddress}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: PROFESSIONAL DETAILS ================= */}
          {activeTab === 'professional' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Work & Employment Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Employment Type</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.employmentType}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Designation</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.designation}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Department</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.department}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Reporting Manager</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.reportingManager}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Work Shift</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.workShift}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Work Location</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.workLocation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CONTACT DETAILS ================= */}
          {activeTab === 'contact' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Communication & Emergency Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Official Work Email</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.email}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Personal Email</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.personalEmail}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Mobile Number</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.phone}
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Emergency Contact Person</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.emergencyContactName} ({profile.relationship})
                  </p>
                </div>

                <div className="border-b border-slate-50 dark:border-slate-800/60 pb-3">
                  <p className="text-xs text-slate-400 font-medium">Emergency Phone</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profile.emergencyPhone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: DOCUMENTS ================= */}
          {activeTab === 'documents' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Verified KYC & Employment Documents
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Aadhar Card (Government ID)', size: '1.2 MB', verified: true },
                  { name: 'PAN Card Certificate', size: '850 KB', verified: true },
                  { name: 'Official Employment Offer Letter', size: '2.4 MB', verified: true },
                  { name: 'B.Tech Degree Certificate', size: '3.1 MB', verified: true },
                  { name: 'Previous Company Relieving Letter', size: '1.1 MB', verified: true },
                  { name: 'Signed NDA & Code of Conduct', size: '920 KB', verified: true },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {doc.name}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified • {doc.size}
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          EDIT PROFILE MODAL
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-blue-600" />
                Edit Profile Details
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Profile Photo Customization & Presets */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Profile Photo & Shape
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setAvatarShape('curved-rect')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        avatarShape === 'curved-rect'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Curved Rectangle
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarShape('circle')}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        avatarShape === 'circle'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Circle
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={editForm.avatar}
                    alt="Preview"
                    className={`w-14 h-14 object-cover border-2 border-white dark:border-slate-700 shadow-md ${
                      avatarShape === 'curved-rect' ? 'rounded-2xl' : 'rounded-full'
                    }`}
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                      placeholder="Enter image URL..."
                      className="w-full h-8 px-3 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=95',
                          })
                        }
                        className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Cardigan Portrait
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=95',
                          })
                        }
                        className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Executive
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=95',
                          })
                        }
                        className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Corporate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fathersName}
                    onChange={(e) => setEditForm({ ...editForm, fathersName: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={editForm.maritalStatus}
                    onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Permanent Address
                </label>
                <textarea
                  value={editForm.permanentAddress}
                  onChange={(e) => setEditForm({ ...editForm, permanentAddress: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Address
                </label>
                <textarea
                  value={editForm.currentAddress}
                  onChange={(e) => setEditForm({ ...editForm, currentAddress: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
