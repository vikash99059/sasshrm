import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { Employee, Department } from '../../types';
import {
  DataTable,
  Column,
  Badge,
  Button,
  Avatar,
  Modal,
  Input,
  Select,
} from '../../components/ui';
import {
  Users,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils';

export const EmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Employee Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Part-time' | 'Contract'>('Full-time');
  const [workLocation, setWorkLocation] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  const navigate = useNavigate();

  const loadData = async () => {
    const [empList, deptList] = await Promise.all([
      employeeService.getEmployees(),
      employeeService.getDepartments(),
    ]);
    setEmployees(empList);
    setDepartments(deptList);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    await employeeService.createEmployee({
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      employmentType,
      workLocation,
      joiningDate,
    });
    setIsAddModalOpen(false);
    // Reset Form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    loadData();
  };

  const handleDeleteEmployee = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this employee?')) {
      await employeeService.deleteEmployee(id);
      loadData();
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
    if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;
    return true;
  });

  const columns: Column<Employee>[] = [
    {
      header: 'Employee ID',
      accessorKey: 'employeeId',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
          {row.employeeId}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Employee Profile',
      accessorKey: 'fullName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.fullName} size="sm" status="online" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-xs">{row.fullName}</p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => <span className="text-xs font-medium">{row.department}</span>,
      sortable: true,
    },
    {
      header: 'Designation',
      accessorKey: 'designation',
      cell: (row) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">{row.designation}</span>
      ),
      sortable: true,
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: (row) => <span className="text-xs text-slate-500 font-mono">{row.phone}</span>,
    },
    {
      header: 'Joining Date',
      accessorKey: 'joiningDate',
      cell: (row) => <span className="text-xs text-slate-500">{formatDate(row.joiningDate)}</span>,
      sortable: true,
    },
    {
      header: 'Type',
      accessorKey: 'employmentType',
      cell: (row) => (
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          {row.employmentType}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Leave' ? 'info' : 'warning'} size="sm" dot>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            title="View 360 Profile"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleDeleteEmployee(row.id, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Employee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization members, assignments, roles, documents, and 360° profiles.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-slate-300"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name} ({d.employeeCount})
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm dark:border-dark-border dark:bg-dark-card dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Probation">Probation</option>
        </select>
      </div>

      {/* Employees Data Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        searchKey="fullName"
        searchPlaceholder="Search by employee name, email, or department..."
        pageSize={6}
        onRowClick={(row) => navigate(`/employees/${row.id}`)}
        exportFileName="employee_directory.csv"
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        description="Fill in the basic profile information to onboard a new employee to your organization."
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateEmployee}>
              Save & Onboard Employee
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Rahul"
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Official Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="r.sharma@acmecorp.com"
              required
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 342-1001"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Operations', label: 'Operations' },
              ]}
            />
            <Input
              label="Designation Title"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Senior Software Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Employment Type"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as any)}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Internship', label: 'Internship' },
              ]}
            />
            <Select
              label="Work Location"
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value as any)}
              options={[
                { value: 'On-site', label: 'On-site' },
                { value: 'Hybrid', label: 'Hybrid' },
                { value: 'Remote', label: 'Remote' },
              ]}
            />
            <Input
              label="Joining Date"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
