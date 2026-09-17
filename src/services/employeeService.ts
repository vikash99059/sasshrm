import { Employee, Department, Designation, Team } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS, INITIAL_TEAMS } from './mockDb';
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

  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const list = getFromStorage<Department[]>('departments', INITIAL_DEPARTMENTS);
    const newId = `dept-${Date.now()}`;
    const code = (data.code || (data.name ? data.name.substring(0, 3).toUpperCase() : 'DEP')).toUpperCase();
    const newDept: Department = {
      id: newId,
      organizationId: data.organizationId || 'org-1',
      name: data.name || 'New Department',
      code: code,
      color: data.color || '#3B82F6',
      headName: data.headName || 'Not Assigned',
      headOfDepartmentId: data.headOfDepartmentId,
      employeeCount: data.employeeCount || 0,
      budget: data.budget || 0,
      description: data.description || '',
      location: data.location || 'Headquarters',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newDept, ...list];
    saveToStorage('departments', updated);
    return newDept;
  },

  updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
    const list = getFromStorage<Department[]>('departments', INITIAL_DEPARTMENTS);
    const index = list.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }

    const updatedDept: Department = {
      ...list[index],
      ...data,
      code: (data.code || list[index].code).toUpperCase(),
    };

    list[index] = updatedDept;
    saveToStorage('departments', list);
    return updatedDept;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    const list = getFromStorage<Department[]>('departments', INITIAL_DEPARTMENTS);
    const filtered = list.filter(d => d.id !== id);
    saveToStorage('departments', filtered);
  },

  getDesignations: async (): Promise<Designation[]> => {
    const INITIAL_DESIGNATIONS: Designation[] = [
      { id: 'des-se', organizationId: 'org-1', title: 'Senior Software Engineer', departmentId: 'dept-eng', departmentName: 'Engineering', level: 'L4', bandTrack: 'IC', salaryBandMin: 120000, salaryBandMax: 160000, employeeCount: 18, description: 'Core application development, architecture design, and code quality leadership.' },
      { id: 'des-fe-lead', organizationId: 'org-1', title: 'Frontend Lead', departmentId: 'dept-eng', departmentName: 'Engineering', level: 'L5', bandTrack: 'Management', salaryBandMin: 150000, salaryBandMax: 195000, employeeCount: 4, description: 'Leads the UI engineering team, frontend architecture, and design system implementation.' },
      { id: 'des-md', organizationId: 'org-1', title: 'Marketing Director', departmentId: 'dept-mkt', departmentName: 'Marketing', level: 'L6', bandTrack: 'Executive', salaryBandMin: 180000, salaryBandMax: 240000, employeeCount: 2, description: 'Oversees global demand generation, brand positioning, and corporate marketing campaigns.' },
      { id: 'des-sa', organizationId: 'org-1', title: 'Senior Accountant', departmentId: 'dept-fin', departmentName: 'Finance', level: 'L4', bandTrack: 'IC', salaryBandMin: 95000, salaryBandMax: 130000, employeeCount: 5, description: 'Manages ledger accuracy, compliance reporting, and quarterly financial audits.' },
      { id: 'des-hre', organizationId: 'org-1', title: 'HR Executive', departmentId: 'dept-hr', departmentName: 'Human Resources', level: 'L3', bandTrack: 'IC', salaryBandMin: 70000, salaryBandMax: 95000, employeeCount: 4, description: 'Coordinates employee relations, HR benefits enrollment, and internal onboarding.' },
      { id: 'des-se-sales', organizationId: 'org-1', title: 'Sales Executive', departmentId: 'dept-sales', departmentName: 'Sales', level: 'L3', bandTrack: 'IC', salaryBandMin: 75000, salaryBandMax: 110000, employeeCount: 8, description: 'Drives enterprise B2B sales pipeline, outbound prospecting, and deal closing.' },
    ];
    return getFromStorage<Designation[]>('designations', INITIAL_DESIGNATIONS);
  },

  createDesignation: async (data: Partial<Designation>): Promise<Designation> => {
    const list = await employeeService.getDesignations();
    const newId = `des-${Date.now()}`;
    const newDes: Designation = {
      id: newId,
      organizationId: data.organizationId || 'org-1',
      title: data.title || 'New Designation',
      departmentId: data.departmentId || 'dept-eng',
      departmentName: data.departmentName || 'Engineering',
      level: data.level || 'L3',
      bandTrack: data.bandTrack || 'IC',
      salaryBandMin: data.salaryBandMin || 80000,
      salaryBandMax: data.salaryBandMax || 120000,
      employeeCount: data.employeeCount || 0,
      description: data.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newDes, ...list];
    saveToStorage('designations', updated);
    return newDes;
  },

  updateDesignation: async (id: string, data: Partial<Designation>): Promise<Designation> => {
    const list = await employeeService.getDesignations();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Designation with ID ${id} not found`);
    }

    const updatedDes: Designation = {
      ...list[index],
      ...data,
    };

    list[index] = updatedDes;
    saveToStorage('designations', list);
    return updatedDes;
  },

  deleteDesignation: async (id: string): Promise<void> => {
    const list = await employeeService.getDesignations();
    const filtered = list.filter(d => d.id !== id);
    saveToStorage('designations', filtered);
  },

  // =========================================================================
  // TEAM CRUD
  // =========================================================================
  getTeams: async (_orgId: string = 'org-1'): Promise<Team[]> => {
    return getFromStorage<Team[]>('teams', INITIAL_TEAMS);
  },

  createTeam: async (data: Partial<Team>): Promise<Team> => {
    const list = getFromStorage<Team[]>('teams', INITIAL_TEAMS);
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      name: data.name || 'New Team',
      departmentId: data.departmentId,
      department: data.department || '',
      leadName: data.leadName || 'Not Assigned',
      leadRole: data.leadRole || '',
      leadEmployeeId: data.leadEmployeeId,
      memberCount: data.memberCount || 0,
      memberIds: data.memberIds || [],
      color: data.color || '#3B82F6',
      description: data.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newTeam, ...list];
    saveToStorage('teams', updated);
    return newTeam;
  },

  updateTeam: async (id: string, data: Partial<Team>): Promise<Team> => {
    const list = getFromStorage<Team[]>('teams', INITIAL_TEAMS);
    const index = list.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Team with ID ${id} not found`);
    const updatedTeam: Team = { ...list[index], ...data };
    list[index] = updatedTeam;
    saveToStorage('teams', list);
    return updatedTeam;
  },

  deleteTeam: async (id: string): Promise<void> => {
    const list = getFromStorage<Team[]>('teams', INITIAL_TEAMS);
    const filtered = list.filter(t => t.id !== id);
    saveToStorage('teams', filtered);
  },
};
