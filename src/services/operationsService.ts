import { ExpenseClaim, Asset, DocumentItem, TrainingCourse } from '../types';
import { INITIAL_EXPENSES, INITIAL_ASSETS, INITIAL_DOCUMENTS, INITIAL_TRAINING_COURSES } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const operationsService = {
  // Expenses
  getExpenses: async (): Promise<ExpenseClaim[]> => {
    return getFromStorage<ExpenseClaim[]>('expenses', INITIAL_EXPENSES);
  },

  createExpense: async (data: Partial<ExpenseClaim>): Promise<ExpenseClaim> => {
    const list = getFromStorage<ExpenseClaim[]>('expenses', INITIAL_EXPENSES);
    const newExpense: ExpenseClaim = {
      id: `exp-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      employeeId: data.employeeId || 'emp-1',
      employeeName: data.employeeName || 'Rahul Sharma',
      employeeAvatar: data.employeeAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      category: data.category || 'Office Supplies',
      amount: data.amount || 50,
      currency: 'USD',
      date: data.date || new Date().toISOString().split('T')[0],
      description: data.description || '',
      project: data.project || 'General Operations',
      status: 'Pending',
    };
    const updated = [newExpense, ...list];
    saveToStorage('expenses', updated);
    return newExpense;
  },

  updateExpenseStatus: async (id: string, status: 'Approved' | 'Rejected' | 'Reimbursed', approverName: string = 'HR Admin'): Promise<ExpenseClaim> => {
    const list = getFromStorage<ExpenseClaim[]>('expenses', INITIAL_EXPENSES);
    const index = list.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    list[index].status = status;
    list[index].approverName = approverName;
    list[index].approvedDate = new Date().toISOString().split('T')[0];
    saveToStorage('expenses', list);
    return list[index];
  },

  // Assets
  getAssets: async (): Promise<Asset[]> => {
    return getFromStorage<Asset[]>('assets', INITIAL_ASSETS);
  },

  createAsset: async (data: Partial<Asset>): Promise<Asset> => {
    const list = getFromStorage<Asset[]>('assets', INITIAL_ASSETS);
    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      assetTag: data.assetTag || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'Hardware Device',
      category: data.category || 'Laptop',
      serialNumber: data.serialNumber || `SN-${Date.now()}`,
      condition: data.condition || 'Brand New',
      status: data.status || 'Available',
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
      purchaseCost: data.purchaseCost || 999,
    };
    const updated = [newAsset, ...list];
    saveToStorage('assets', updated);
    return newAsset;
  },

  // Documents
  getDocuments: async (): Promise<DocumentItem[]> => {
    return getFromStorage<DocumentItem[]>('documents', INITIAL_DOCUMENTS);
  },

  createDocument: async (data: Partial<DocumentItem>): Promise<DocumentItem> => {
    const list = getFromStorage<DocumentItem[]>('documents', INITIAL_DOCUMENTS);
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      title: data.title || 'Company Document',
      category: data.category || 'Policy',
      fileType: data.fileType || 'PDF',
      fileSize: data.fileSize || '1.2 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      downloadUrl: '#',
    };
    const updated = [newDoc, ...list];
    saveToStorage('documents', updated);
    return newDoc;
  },

  // Training LMS
  getTrainingCourses: async (): Promise<TrainingCourse[]> => {
    return getFromStorage<TrainingCourse[]>('training_courses', INITIAL_TRAINING_COURSES);
  }
};
