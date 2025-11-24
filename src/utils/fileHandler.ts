import type { Expense, Income, Invoice } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateExportString = (
    expenses: Expense[],
    income: Income[],
    invoices: Invoice[]
): string => {
    let output = '';

    expenses.forEach((exp) => {
        output += '[EXPENSE]\n';
        output += `Title: ${exp.title}\n`;
        output += `Amount: ${exp.amount}\n`;
        output += `Category: ${exp.category}\n`;
        output += `Date: ${exp.date}\n`;
        if (exp.note) output += `Note: ${exp.note}\n`;
        output += '\n';
    });

    income.forEach((inc) => {
        output += '[INCOME]\n';
        output += `Source: ${inc.source}\n`;
        output += `Amount: ${inc.amount}\n`;
        output += `Category: ${inc.category}\n`;
        output += `Date: ${inc.date}\n`;
        if (inc.note) output += `Note: ${inc.note}\n`;
        output += '\n';
    });

    invoices.forEach((inv) => {
        output += '[INVOICE]\n';
        output += `Client: ${inv.clientName}\n`;
        if (inv.clientEmail) output += `ClientEmail: ${inv.clientEmail}\n`;
        if (inv.clientAddress) output += `ClientAddress: ${inv.clientAddress}\n`;
        output += `InvoiceNumber: ${inv.invoiceNumber}\n`;
        output += `Issued: ${inv.issuedDate}\n`;
        output += '\n';

        inv.items.forEach((item) => {
            output += '[ITEM]\n';
            output += `Name: ${item.name}\n`;
            output += `Qty: ${item.quantity}\n`;
            output += `Price: ${item.price}\n`;
            output += `Tax: ${item.tax}\n`;
            output += '\n';
        });
    });

    return output;
};

export const parseImportString = (
    content: string
): { expenses: Expense[]; income: Income[]; invoices: Invoice[] } => {
    const expenses: Expense[] = [];
    const income: Income[] = [];
    const invoices: Invoice[] = [];

    const lines = content.split(/\r?\n/);
    let currentBlockType: string | null = null;
    let currentBlockData: Record<string, string> = {};
    let currentInvoice: Invoice | null = null;

    const processBlock = () => {
        if (!currentBlockType) return;

        if (currentBlockType === 'EXPENSE') {
            if (currentBlockData['Title']) {
                expenses.push({
                    id: uuidv4(),
                    title: currentBlockData['Title'],
                    amount: parseFloat(currentBlockData['Amount'] || '0'),
                    category: currentBlockData['Category'] || 'General',
                    date: currentBlockData['Date'] || new Date().toISOString().split('T')[0],
                    note: currentBlockData['Note'],
                });
            }
        } else if (currentBlockType === 'INCOME') {
            if (currentBlockData['Source']) {
                income.push({
                    id: uuidv4(),
                    source: currentBlockData['Source'],
                    amount: parseFloat(currentBlockData['Amount'] || '0'),
                    category: currentBlockData['Category'] || 'General',
                    date: currentBlockData['Date'] || new Date().toISOString().split('T')[0],
                    note: currentBlockData['Note'],
                });
            }
        } else if (currentBlockType === 'INVOICE') {
            // Start a new invoice
            currentInvoice = {
                id: uuidv4(),
                clientName: currentBlockData['Client'] || 'Unknown',
                clientEmail: currentBlockData['ClientEmail'],
                clientAddress: currentBlockData['ClientAddress'],
                invoiceNumber: currentBlockData['InvoiceNumber'] || '000',
                issuedDate: currentBlockData['Issued'] || new Date().toISOString().split('T')[0],
                items: [],
            };
            invoices.push(currentInvoice);
        } else if (currentBlockType === 'ITEM') {
            if (currentInvoice) {
                currentInvoice.items.push({
                    id: uuidv4(),
                    name: currentBlockData['Name'] || 'Item',
                    quantity: parseFloat(currentBlockData['Qty'] || '1'),
                    price: parseFloat(currentBlockData['Price'] || '0'),
                    tax: parseFloat(currentBlockData['Tax'] || '0'),
                });
            }
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            // New block
            processBlock(); // Process previous block
            currentBlockType = trimmed.slice(1, -1);
            currentBlockData = {};
        } else {
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex > 0) {
                const key = trimmed.slice(0, colonIndex).trim();
                const value = trimmed.slice(colonIndex + 1).trim();
                currentBlockData[key] = value;
            }
        }
    }
    processBlock(); // Process last block

    return { expenses, income, invoices };
};
