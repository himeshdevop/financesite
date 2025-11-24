import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import IncomeTable from './IncomeTable';
import IncomeForm from './IncomeForm';
import IncomeCharts from './IncomeCharts';
import NeoButton from '../ui/NeoButton';
import SEO from '../SEO';
import { Plus, Download, Upload } from 'lucide-react';
import InfoAlert from '../ui/InfoAlert';
import type { Income } from '../../types';
import { generateExportString, parseImportString } from '../../utils/fileHandler';

const IncomeDashboard: React.FC = () => {
    const { income, expenses, addIncome, updateIncome, deleteIncome, importData } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);

    const handleAdd = () => {
        setEditingIncome(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Income) => {
        setEditingIncome(item);
        setIsModalOpen(true);
    };

    const handleSubmit = (item: Income) => {
        if (editingIncome) {
            updateIncome(item);
        } else {
            addIncome(item);
        }
    };

    const handleExport = () => {
        const data = generateExportString([], income, []);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `income-${new Date().toISOString().split('T')[0]}.txt`;
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
                importData({ income: parsed.income });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
            <SEO
                title="Free Income Tracker - Monitor Your Earnings & Revenue"
                description="Track your income sources, monitor revenue growth, and manage your earnings for free. The best free income tracker app."
                keywords="income tracker free, revenue tracker, earnings tracker, free finance tracker, income management"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Income</h1>
                    <p className="text-secondary">Track your earnings and revenue</p>
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
                        Add Income
                    </NeoButton>
                </div>
            </div>

            <InfoAlert message="Use 'Import' to restore income records from a previously saved text file. Use 'Export' to save your current income records as a text file for backup purposes." />

            <IncomeCharts income={income} expenses={expenses} />

            <IncomeTable
                income={income}
                onEdit={handleEdit}
                onDelete={deleteIncome}
            />

            <IncomeForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingIncome}
            />
        </div>
    );
};

export default IncomeDashboard;
