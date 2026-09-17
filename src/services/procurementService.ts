import { getFromStorage, saveToStorage } from './storage';

export interface Vendor {
    id: string;
    vendorId: string;
    name: string;
    category: string;
    contact: string;
    email: string;
    status: 'Approved' | 'Pending' | 'Rejected';
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorName: string;
    date: string;
    deliveryDate: string;
    amount: number;
    itemsSummary: string;
    status: 'Approved' | 'Pending Approval' | 'Rejected' | 'Received';
}

const VENDORS_KEY = 'proc_vendors';
const PO_KEY = 'proc_pos';

// --- SEED DATA ---
const SEED_VENDORS: Vendor[] = [
    { id: '1', vendorId: 'VND-001', name: 'Dell Technologies', category: 'Hardware', contact: 'Mike B.', email: 'mike@dell.example.com', status: 'Approved' },
    { id: '2', vendorId: 'VND-002', name: 'AWS', category: 'Software/Cloud', contact: 'Support Team', email: 'support@aws.example.com', status: 'Approved' },
    { id: '3', vendorId: 'VND-003', name: 'OfficeMax', category: 'Supplies', contact: 'Sarah Jenkins', email: 'sarah@officemax.example.com', status: 'Approved' },
];

const SEED_POS: PurchaseOrder[] = [
    { id: '1', poNumber: 'PO-24-0901', vendorName: 'Dell Technologies', date: '2024-10-21', deliveryDate: '2024-11-01', amount: 14500, itemsSummary: '20x Developer Laptops', status: 'Approved' },
    { id: '2', poNumber: 'PO-24-0902', vendorName: 'OfficeMax', date: '2024-10-22', deliveryDate: '2024-10-25', amount: 420, itemsSummary: 'Bulk Desk Supplies', status: 'Pending Approval' },
];

const initializeData = () => {
    if (!localStorage.getItem(`hrm_${VENDORS_KEY}`)) saveToStorage(VENDORS_KEY, SEED_VENDORS);
    if (!localStorage.getItem(`hrm_${PO_KEY}`)) saveToStorage(PO_KEY, SEED_POS);
};

initializeData();

export const procurementService = {
    getVendors: (): Vendor[] => getFromStorage(VENDORS_KEY, []),

    addVendor: (vendor: Omit<Vendor, 'id' | 'vendorId' | 'status'>): Vendor => {
        const data = getFromStorage<Vendor[]>(VENDORS_KEY, []);
        const newVendor: Vendor = {
            ...vendor,
            status: 'Pending',
            id: Date.now().toString(),
            vendorId: `VND-${String(data.length + 1).padStart(3, '0')}`
        };
        saveToStorage(VENDORS_KEY, [...data, newVendor]);
        return newVendor;
    },

    getPurchaseOrders: (): PurchaseOrder[] => getFromStorage(PO_KEY, []),

    addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status' | 'date'>): PurchaseOrder => {
        const data = getFromStorage<PurchaseOrder[]>(PO_KEY, []);
        const newPO: PurchaseOrder = {
            ...po,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending Approval',
            id: Date.now().toString(),
            poNumber: `PO-${new Date().getFullYear().toString().slice(2)}-${String(data.length + 1).padStart(4, '0')}`
        };
        saveToStorage(PO_KEY, [...data, newPO]);
        return newPO;
    },
};
