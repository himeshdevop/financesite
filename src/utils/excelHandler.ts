import * as XLSX from 'xlsx';
import type { Expense, Income, Invoice } from '../types';

export const exportToExcel = (
    data: { expenses?: Expense[]; income?: Income[]; invoices?: Invoice[] },
    fileName: string
) => {
    const workbook = XLSX.utils.book_new();

    if (data.expenses && data.expenses.length > 0) {
        const expenseData = data.expenses.map(e => ({
            Title: e.title,
            Amount: e.amount,
            Category: e.category,
            Date: e.date,
            Note: e.note || ''
        }));
        const worksheet = XLSX.utils.json_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    }

    if (data.income && data.income.length > 0) {
        const incomeData = data.income.map(i => ({
            Source: i.source,
            Amount: i.amount,
            Category: i.category,
            Date: i.date,
            Note: i.note || ''
        }));
        const worksheet = XLSX.utils.json_to_sheet(incomeData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Income');
    }

    if (data.invoices && data.invoices.length > 0) {
        // Invoice Summary
        const invoiceData = data.invoices.map(inv => ({
            'Invoice Number': inv.invoiceNumber,
            'Client Name': inv.clientName || 'N/A',
            'Client Email': inv.clientEmail || '',
            'Client Address': inv.clientAddress || '',
            'Issued Date': inv.issuedDate,
            'Total Items': inv.items.length,
            'Total Amount': inv.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }));
        const invoiceSheet = XLSX.utils.json_to_sheet(invoiceData);
        XLSX.utils.book_append_sheet(workbook, invoiceSheet, 'Invoices');

        // Invoice Items Detail
        const allItems = data.invoices.flatMap(inv =>
            inv.items.map(item => ({
                'Invoice Number': inv.invoiceNumber,
                'Item Name': item.name,
                'Quantity': item.quantity,
                'Price': item.price,
                'Tax (%)': item.tax,
                'Total': item.quantity * item.price
            }))
        );
        const itemsSheet = XLSX.utils.json_to_sheet(allItems);
        XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Invoice Items');
    }

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
