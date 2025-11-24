export type Category = string;

export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: Category;
    date: string; // ISO Date string YYYY-MM-DD
    note?: string;
}

export interface Income {
    id: string;
    source: string;
    amount: number;
    category: Category;
    date: string; // ISO Date string YYYY-MM-DD
    note?: string;
}

export interface InvoiceItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    tax: number; // Percentage
}

export interface Invoice {
    id: string;
    clientName?: string;
    clientEmail?: string;
    clientAddress?: string;
    invoiceNumber: string;
    issuedDate: string; // ISO Date string YYYY-MM-DD

    items: InvoiceItem[];
    logo?: string; // Base64 string
}

export interface InvoiceSettings {
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    logoUrl?: string;
    accentColor: string;
}

export interface FinanceData {
    expenses: Expense[];
    income: Income[];
    invoices: Invoice[];
    invoiceSettings: InvoiceSettings;
}
