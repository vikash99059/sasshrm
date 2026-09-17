import { getFromStorage, saveToStorage } from './storage';
import { Lead, Customer, Quotation } from '../types/crm';

const LEADS_KEY = 'crm_leads';
const CUSTOMERS_KEY = 'crm_customers';
const QUOTES_KEY = 'crm_quotes';

// --- SEED DATA ---
const SEED_LEADS: Lead[] = [
    { id: '1', companyName: 'Globex Inc', contactName: 'Mark Z.', email: 'mark@globex.com', stage: 'New Lead', value: 12000, industry: 'Software', createdAt: '2024-10-01' },
    { id: '2', companyName: 'Initech', contactName: 'Sarah M.', email: 'sarah@initech.com', stage: 'Contacted', value: 45000, industry: 'Hardware', createdAt: '2024-10-05' },
    { id: '3', companyName: 'Umbrella Corp', contactName: 'Dave K.', email: 'dave@umbrella.com', stage: 'Qualified', value: 8000, industry: 'BioTech', createdAt: '2024-10-10' },
    { id: '4', companyName: 'Nexus Industries', contactName: 'Anne B.', email: 'anne@nexus.com', stage: 'Proposal Sent', value: 120000, industry: 'Manufacturing', createdAt: '2024-10-15' },
];

const SEED_CUSTOMERS: Customer[] = [
    { id: 'c1', customerId: 'CUST-8001', name: 'Acme Corp', industry: 'Software', contact: 'John Smith', email: 'john@acme.com', status: 'Active', revenue: 54000, createdAt: '2023-05-12' },
    { id: 'c2', customerId: 'CUST-8002', name: 'Global Logistics', industry: 'Supply Chain', contact: 'Sarah Meyer', email: 'sarah@global.com', status: 'Active', revenue: 12500, createdAt: '2023-11-20' },
    { id: 'c3', customerId: 'CUST-8003', name: 'Stark Industries', industry: 'Defense', contact: 'Tony Stark', email: 'tony@stark.com', status: 'Active', revenue: 450000, createdAt: '2022-01-05' },
];

const SEED_QUOTES: Quotation[] = [
    { id: 'q1', quotationId: 'QT-2024-001', companyName: 'Acme Corp', date: '2024-10-12', validity: '2024-11-12', total: 14500, status: 'Sent', description: 'Enterprise Licensing' },
    { id: 'q2', quotationId: 'QT-2024-002', companyName: 'Stark Industries', date: '2024-10-15', validity: '2024-11-15', total: 120000, status: 'Accepted', description: 'Custom Hardware Infrastructure' },
];

// --- INITIALIZATION ---
const initializeData = () => {
    if (!localStorage.getItem(`hrm_${LEADS_KEY}`)) saveToStorage(LEADS_KEY, SEED_LEADS);
    if (!localStorage.getItem(`hrm_${CUSTOMERS_KEY}`)) saveToStorage(CUSTOMERS_KEY, SEED_CUSTOMERS);
    if (!localStorage.getItem(`hrm_${QUOTES_KEY}`)) saveToStorage(QUOTES_KEY, SEED_QUOTES);
};

initializeData();

// --- LEADS API ---
export const crmService = {
    getLeads: (): Lead[] => {
        return getFromStorage(LEADS_KEY, []);
    },

    addLead: (lead: Omit<Lead, 'id' | 'createdAt'>): Lead => {
        const leads = getFromStorage<Lead[]>(LEADS_KEY, []);
        const newLead: Lead = {
            ...lead,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        saveToStorage(LEADS_KEY, [...leads, newLead]);
        return newLead;
    },

    updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => {
        const leads = getFromStorage<Lead[]>(LEADS_KEY, []);
        const updatedLeads = leads.map(l => l.id === id ? { ...l, ...updates } : l);
        saveToStorage(LEADS_KEY, updatedLeads);
    },

    updateLeadStage: (id: string, newStage: Lead['stage']) => {
        const leads = getFromStorage<Lead[]>(LEADS_KEY, []);
        const updatedLeads = leads.map(l => l.id === id ? { ...l, stage: newStage } : l);
        saveToStorage(LEADS_KEY, updatedLeads);

        // Automatically convert lead to customer if won
        if (newStage === 'Won') {
            const wonLead = updatedLeads.find(l => l.id === id);
            if (wonLead) {
                crmService.addCustomer({
                    name: wonLead.companyName,
                    industry: wonLead.industry || 'Unknown',
                    contact: wonLead.contactName,
                    email: wonLead.email,
                    status: 'Active',
                    revenue: 0 // Will accumulate from invoices
                });
            }
        }
    },

    // --- CUSTOMERS API ---
    getCustomers: (): Customer[] => {
        return getFromStorage(CUSTOMERS_KEY, []);
    },

    addCustomer: (customer: Omit<Customer, 'id' | 'customerId' | 'createdAt'>): Customer => {
        const customers = getFromStorage<Customer[]>(CUSTOMERS_KEY, []);
        const newCustomer: Customer = {
            ...customer,
            id: Date.now().toString(),
            customerId: `CUST-${8000 + customers.length + 1}`,
            createdAt: new Date().toISOString()
        };
        saveToStorage(CUSTOMERS_KEY, [...customers, newCustomer]);
        return newCustomer;
    },

    updateCustomer: (id: string, updates: Partial<Omit<Customer, 'id' | 'customerId' | 'createdAt'>>) => {
        const customers = getFromStorage<Customer[]>(CUSTOMERS_KEY, []);
        const updated = customers.map(c => c.id === id ? { ...c, ...updates } : c);
        saveToStorage(CUSTOMERS_KEY, updated);
    },

    // --- QUOTATIONS API ---
    getQuotations: (): Quotation[] => {
        return getFromStorage(QUOTES_KEY, []);
    },

    addQuotation: (quote: Omit<Quotation, 'id' | 'quotationId'>): Quotation => {
        const quotes = getFromStorage<Quotation[]>(QUOTES_KEY, []);
        const newQuote: Quotation = {
            ...quote,
            id: Date.now().toString(),
            quotationId: `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, '0')}`
        };
        saveToStorage(QUOTES_KEY, [...quotes, newQuote]);
        return newQuote;
    },

    updateQuotation: (id: string, updates: Partial<Omit<Quotation, 'id' | 'quotationId'>>) => {
        const quotes = getFromStorage<Quotation[]>(QUOTES_KEY, []);
        const updated = quotes.map(q => q.id === id ? { ...q, ...updates } : q);
        saveToStorage(QUOTES_KEY, updated);
    }
};
