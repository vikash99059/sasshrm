export type LeadStage = 'New Lead' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    stage: LeadStage;
    value: number;
    industry?: string;
    createdAt: string;
}

export interface Customer {
    id: string;
    customerId: string; // e.g., CUST-8001
    name: string;
    industry: string;
    contact: string;
    email: string;
    status: 'Active' | 'Inactive';
    revenue: number;
    createdAt: string;
}

export interface Quotation {
    id: string;
    quotationId: string; // e.g., QT-2024-001
    customerId?: string; // Optional if created for a lead
    companyName: string;
    date: string;
    validity: string;
    total: number;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    description: string;
}
