import { Employee, Department, Designation } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const employeeService = {
  getEmployees: async (orgId: string = 'org-1'): Promise<Employee[]> => {
    const list = getFromStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
    return list.filter(e => !e.organizationId || e.organizationId === orgId);
  },

  getEmployeeById: async (id?: string): Promise<Employee | undefined> => {
    const list = getFromStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
    if (!id) return list[0] || INITIAL_EMPLOYEES[0];
    const cleanId = id.toLowerCase().trim();
    const found = list.find(e => 
      e.id.toLowerCase() === cleanId || 
      e.employeeId?.toLowerCase() === cleanId ||
      e.email?.toLowerCase() === cleanId ||
      e.fullName?.toLowerCase().includes(cleanId)
    );
    return found || list[0] || INITIAL_EMPLOYEES[0];
  },

  createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
    const list = getFromStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
    const newId = `emp-${list.length + 1}`;
    const newCode = `EMP${String(list.length + 1).padStart(3, '0')}`;
    const newEmployee: Employee = {
      id: newId,
      organizationId: data.organizationId || 'org-1',
      employeeId: data.employeeId || newCode,
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Employee',
      fullName: `${data.firstName || 'New'} ${data.lastName || 'Employee'}`,
      email: data.email || `employee${list.length + 1}@acmecorp.com`,
      personalEmail: data.personalEmail || 'personal@gmail.com',
      phone: data.phone || '+1 (555) 000-0000',
      avatar: data.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      department: data.department || 'Engineering',
      departmentId: data.departmentId || 'dept-eng',
      designation: data.designation || 'Software Engineer',
      designationId: data.designationId || 'des-se',
      managerId: data.managerId || 'user-manager',
      managerName: data.managerName || 'Amit Verma',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      dateOfBirth: data.dateOfBirth || '1995-01-01',
      gender: data.gender || 'Male',
      maritalStatus: data.maritalStatus || 'Single',
      bloodGroup: data.bloodGroup || 'O+',
      address: data.address || {
        street: '100 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
      },
      employmentType: data.employmentType || 'Full-time',
      workLocation: data.workLocation || 'On-site',
      officeLocation: data.officeLocation || 'San Francisco HQ',
      status: data.status || 'Active',
      salary: data.salary || {
        basic: 5000,
        hra: 1500,
        allowances: 1000,
        gross: 7500,
        deductions: {
          providentFund: 500,
          professionalTax: 200,
          incomeTax: 800,
          insurance: 150,
        },
        net: 5850,
      },
      bankDetails: data.bankDetails || {
        accountHolderName: `${data.firstName || 'New'} ${data.lastName || 'Employee'}`,
        bankName: 'Chase Bank NA',
        accountNumber: '•••• •••• 1234',
        ifscCode: 'CHASUS33',
        branch: 'Main Branch',
      },
      emergencyContact: data.emergencyContact || {
        name: 'Family Member',
        relationship: 'Parent',
        phone: '+1 (555) 999-8888',
      },
    };
    const updated = [newEmployee, ...list];
    saveToStorage('employees', updated);
    return newEmployee;
  },

  updateEmployee: async (id: string, updates: Partial<Employee>): Promise<Employee> => {
    const list = getFromStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
    const index = list.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    const updatedEmployee = { ...list[index], ...updates };
    list[index] = updatedEmployee;
    saveToStorage('employees', list);
    return updatedEmployee;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    const list = getFromStorage<Employee[]>('employees', INITIAL_EMPLOYEES);
    const filtered = list.filter(e => e.id !== id);
    saveToStorage('employees', filtered);
  },

  getDepartments: async (_orgId: string = 'org-1'): Promise<Department[]> => {
    return getFromStorage<Department[]>('departments', INITIAL_DEPARTMENTS);
  },

  getDesignations: async (): Promise<Designation[]> => {
    return [
      { id: 'des-se', organizationId: 'org-1', title: 'Senior Software Engineer', departmentId: 'dept-eng', departmentName: 'Engineering', level: 'L4', employeeCount: 18 },
      { id: 'des-fe-lead', organizationId: 'org-1', title: 'Frontend Lead', departmentId: 'dept-eng', departmentName: 'Engineering', level: 'L5', employeeCount: 4 },
      { id: 'des-md', organizationId: 'org-1', title: 'Marketing Director', departmentId: 'dept-mkt', departmentName: 'Marketing', level: 'L6', employeeCount: 2 },
      { id: 'des-sa', organizationId: 'org-1', title: 'Senior Accountant', departmentId: 'dept-fin', departmentName: 'Finance', level: 'L4', employeeCount: 5 },
      { id: 'des-hre', organizationId: 'org-1', title: 'HR Executive', departmentId: 'dept-hr', departmentName: 'Human Resources', level: 'L3', employeeCount: 4 },
      { id: 'des-se-sales', organizationId: 'org-1', title: 'Sales Executive', departmentId: 'dept-sales', departmentName: 'Sales', level: 'L3', employeeCount: 8 },
    ];
  }
};
