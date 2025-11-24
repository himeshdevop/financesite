import React, { createContext, useContext, type ReactNode } from 'react';
import type { Expense, Income, Invoice, InvoiceSettings } from '../types';
import { useLocalStorage } from '../utils/useLocalStorage';

interface FinanceContextType {
    expenses: Expense[];
    income: Income[];
    invoices: Invoice[];
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;
    addIncome: (income: Income) => void;
    updateIncome: (income: Income) => void;
    deleteIncome: (id: string) => void;
    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: string) => void;
    importData: (data: { expenses?: Expense[]; income?: Income[]; invoices?: Invoice[] }) => void;
    clearAllData: () => void;
    invoiceSettings: InvoiceSettings;
    updateInvoiceSettings: (settings: InvoiceSettings) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('financelite_expenses', []);
    const [income, setIncome] = useLocalStorage<Income[]>('financelite_income', []);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('financelite_invoices', []);
    const [invoiceSettings, setInvoiceSettings] = useLocalStorage<InvoiceSettings>('financelite_invoice_settings', {
        companyName: 'Your Company Name',
        companyAddress: '123 Business Street\nCity, State, Zip',
        companyEmail: 'contact@yourcompany.com',
        accentColor: '#3b82f6',
    });

    const updateInvoiceSettings = (settings: InvoiceSettings) => {
        setInvoiceSettings(settings);
    };

    const addExpense = (expense: Expense) => {
        setExpenses((prev) => [...prev, expense]);
    };

    const updateExpense = (updatedExpense: Expense) => {
        setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    };

    const addIncome = (newIncome: Income) => {
        setIncome((prev) => [...prev, newIncome]);
    };

    const updateIncome = (updatedIncome: Income) => {
        setIncome((prev) => prev.map((i) => (i.id === updatedIncome.id ? updatedIncome : i)));
    };

    const deleteIncome = (id: string) => {
        setIncome((prev) => prev.filter((i) => i.id !== id));
    };

    const addInvoice = (invoice: Invoice) => {
        setInvoices((prev) => [...prev, invoice]);
    };

    const updateInvoice = (updatedInvoice: Invoice) => {
        setInvoices((prev) => prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
    };

    const deleteInvoice = (id: string) => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    };

    const importData = (data: { expenses?: Expense[]; income?: Income[]; invoices?: Invoice[] }) => {
        if (data.expenses) setExpenses((prev) => [...prev, ...(data.expenses || [])]);
        if (data.income) setIncome((prev) => [...prev, ...(data.income || [])]);
        if (data.invoices) setInvoices((prev) => [...prev, ...(data.invoices || [])]);
    };

    const clearAllData = () => {
        setExpenses([]);
        setIncome([]);
        setInvoices([]);
    };

    return (
        <FinanceContext.Provider
            value={{
                expenses,
                income,
                invoices,
                addExpense,
                updateExpense,
                deleteExpense,
                addIncome,
                updateIncome,
                deleteIncome,
                addInvoice,
                updateInvoice,
                deleteInvoice,
                importData,
                clearAllData,
                invoiceSettings,
                updateInvoiceSettings,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
