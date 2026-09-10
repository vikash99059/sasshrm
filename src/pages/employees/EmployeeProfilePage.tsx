import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { employeeService } from '../../services/employeeService';
import { Employee, LeaveBalance, AttendanceRecord, DocumentItem, Asset, GoalOKR } from '../../types';
import {
  Tabs,
  Badge,
  Button,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  CreditCard,
  FileText,
  Package,
  Target,
  Clock,
  Award,
  Download,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_DOCUMENTS, INITIAL_ASSETS, INITIAL_GOALS } from '../../services/mockDb';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAppStore();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee>(INITIAL_EMPLOYEES[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      const targetId = id || currentUser?.employeeId || currentUser?.id || 'emp-1';
      const emp = await employeeService.getEmployeeById(targetId);
      if (emp) {
        setEmployee(emp);
      }
    };
    loadEmployee();
  }, [id, currentUser]);

  const isMyProfileRoute = !id || id === 'EMP001' || id === currentUser?.employeeId || id === currentUser?.id;

  const profileTabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'personal', label: 'Personal Info', icon: <User className="h-4 w-4" /> },
    { id: 'employment', label: 'Employment', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="h-4 w-4" /> },
    { id: 'leave', label: 'Leave', icon: <Calendar className="h-4 w-4" /> },
    { id: 'payroll', label: 'Payroll', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'assets', label: 'Assets', icon: <Package className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Target className="h-4 w-4" /> },
  ];

  const employeeAttendance = INITIAL_ATTENDANCE.filter(a => a.employeeId === employee.id || a.employeeId === 'emp-1');
  const employeeDocs = INITIAL_DOCUMENTS.filter(d => d.employeeId === employee.id || d.employeeId === 'emp-1');
  const employeeAssets = INITIAL_ASSETS.filter(a => a.assignedToEmployeeId === employee.id || a.assignedToEmployeeId === 'emp-1');
  const employeeGoals = INITIAL_GOALS.filter(g => g.ownerId === employee.id || g.ownerId === 'emp-1');

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Back Button */}
      <button
        onClick={() => navigate(isMyProfileRoute ? '/dashboard' : '/employees')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> {isMyProfileRoute ? 'Back to Dashboard' : 'Back to Employee Directory'}
      </button>

      {/* Main Profile Header Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar src={employee.avatar} name={employee.fullName} size="xl" status="online" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {employee.fullName}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300">
                  {employee.employeeId}
                </span>
                <Badge variant={employee.status === 'Active' ? 'success' : 'warning'} dot>
                  {employee.status}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {employee.designation} • <span className="text-blue-600 dark:text-blue-400">{employee.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {employee.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> {employee.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {employee.officeLocation}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Button variant="outline" size="sm">
              Edit Details
            </Button>
            <Button size="sm" onClick={() => navigate('/payroll/payslips')}>
              View Payslip
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <Tabs
            tabs={profileTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Summary Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Summary</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Department</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Designation</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.designation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Joining Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(employee.joiningDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Employment Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Work Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.workLocation} ({employee.officeLocation})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Reporting Manager</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{employee.managerName}</span>
                  </div>
                </div>
              </Card>

              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Active OKRs & Goals</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {employeeGoals.map((g) => (
                    <div key={g.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{g.title}</span>
                        <span className="text-xs font-bold text-blue-600">{g.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${g.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Due: {formatDate(g.dueDate)}</span>
                        <span>{g.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Quick Balances & Assets */}
            <div className="space-y-6">
              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>Leave Balances</CardTitle>
                </CardHeader>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <span className="font-medium text-blue-900 dark:text-blue-200">Annual Leave</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">12 / 18 Days</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                    <span className="font-medium text-emerald-900 dark:text-emerald-200">Casual Leave</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">8 / 10 Days</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40">
                    <span className="font-medium text-amber-900 dark:text-amber-200">Sick Leave</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">9 / 12 Days</span>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>Assigned Hardware</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {employeeAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Package className="h-5 w-5 text-slate-400" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{asset.assetTag} • {asset.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Personal Info */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Full Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(employee.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Gender</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.gender}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Marital Status</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.maritalStatus}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.bloodGroup}</span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank & Emergency Contact</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Bank Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Account Number</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Emergency Contact</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.emergencyContact.name} ({employee.emergencyContact.relationship})</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Emergency Phone</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.emergencyContact.phone}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Payroll */}
        {activeTab === 'payroll' && (
          <Card className="space-y-6">
            <CardHeader>
              <div>
                <CardTitle>Salary & Compensation Breakdown</CardTitle>
                <p className="text-xs text-slate-500">Monthly gross calculation and compliance deductions</p>
              </div>
              <Button size="sm" leftIcon={<Download className="h-4 w-4" />}>
                Download May 2024 Payslip
              </Button>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1">
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Gross Monthly Salary</span>
                <p className="text-2xl font-extrabold text-blue-900 dark:text-white">{formatCurrency(employee.salary.gross)}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-1">
                <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold">Total Deductions</span>
                <p className="text-2xl font-extrabold text-rose-900 dark:text-white">
                  {formatCurrency(employee.salary.gross - employee.salary.net)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Net Take-Home Pay</span>
                <p className="text-2xl font-extrabold text-emerald-900 dark:text-white">{formatCurrency(employee.salary.net)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-dark-border text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Earnings Components</h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Basic Salary</span>
                  <span className="font-semibold">{formatCurrency(employee.salary.basic)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-semibold">{formatCurrency(employee.salary.hra)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Special Allowances</span>
                  <span className="font-semibold">{formatCurrency(employee.salary.allowances)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Statutory Deductions</h4>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Provident Fund (PF)</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(employee.salary.deductions.providentFund)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Income Tax (TDS)</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(employee.salary.deductions.incomeTax)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Medical Insurance</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(employee.salary.deductions.insurance)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 4: Documents Locker */}
        {activeTab === 'documents' && (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Employee Document Locker</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {employeeDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-dark-border dark:bg-dark-card space-y-2">
                  <div className="flex items-start justify-between">
                    <FileText className="h-7 w-7 text-blue-600" />
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.title}</h4>
                  <p className="text-[10px] text-slate-400">{doc.category} • {doc.fileSize}</p>
                  <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Download className="h-3.5 w-3.5" />}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 5: Attendance Matrix */}
        {activeTab === 'attendance' && (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Recent Attendance Logs</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {employeeAttendance.map((att) => (
                <div key={att.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{formatDate(att.date)}</span>
                    <span className="text-slate-400 text-[11px]">{att.location}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">In: {att.clockIn}</span>
                    <span className="text-slate-500 block">Out: {att.clockOut}</span>
                  </div>
                  <Badge variant={att.status === 'Present' ? 'success' : 'warning'} size="sm">
                    {att.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
