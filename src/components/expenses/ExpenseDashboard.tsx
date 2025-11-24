import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';
import ExpenseCharts from './ExpenseCharts';
import NeoButton from '../ui/NeoButton';
import SEO from '../SEO';
import { Plus, Download, Upload } from 'lucide-react';
import InfoAlert from '../ui/InfoAlert';
import type { Expense } from '../../types';
import { generateExportString, parseImportString } from '../../utils/fileHandler';

const ExpenseDashboard: React.FC = () => {
    const { expenses, addExpense, updateExpense, deleteExpense, importData } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleAdd = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleSubmit = (expense: Expense) => {
        if (editingExpense) {
            updateExpense(expense);
        } else {
            addExpense(expense);
        }
    };

    const handleExport = () => {
        const data = generateExportString(expenses, [], []);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                const parsed = parseImportString(content);
                importData({ expenses: parsed.expenses });
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
            <SEO
                title="Free Expense Tracker - Manage Personal & Business Expenses"
                description="Track your daily expenses, categorize spending, and save money with our free expense tracker. Best free app for expense tracking."
                keywords="expense tracker free, spending tracker, budget tracker, free expense manager, personal expense tracker"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Expenses</h1>
                    <p className="text-secondary">Track and manage your spending</p>
                </div>
                <div className="flex gap-3">
                    <label className="cursor-pointer">
                        <input type="file" accept=".txt" onChange={handleImport} className="hidden" />
                        <NeoButton as="span" variant="secondary" icon={Upload}>
                            Import
                        </NeoButton>
                    </label>
                    <NeoButton variant="secondary" icon={Download} onClick={handleExport}>
                        Export
                    </NeoButton>
                    <NeoButton icon={Plus} onClick={handleAdd}>
                        Add Expense
                    </NeoButton>
                </div>
            </div>

            <InfoAlert message="Use 'Import' to restore expenses from a previously saved text file. Use 'Export' to save your current expenses as a text file for backup purposes." />

            <ExpenseCharts expenses={expenses} />

            <ExpenseTable
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={deleteExpense}
            />

            <ExpenseForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingExpense}
            />
        </div>
    );
};

export default ExpenseDashboard;
