import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import SEO from './SEO';
import GlassCard from './ui/GlassCard';
import { TrendingUp, TrendingDown, DollarSign, FileText, Plus, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NeoButton from './ui/NeoButton';
import ExpenseForm from './expenses/ExpenseForm';
import IncomeForm from './income/IncomeForm';
import InvoiceForm from './invoices/InvoiceForm';
import ExportModal from './ExportModal';

const Dashboard: React.FC = () => {
    const { expenses, income, invoices, addExpense, addIncome, addInvoice } = useFinance();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
    const totalIncome = useMemo(() => income.reduce((sum, item) => sum + item.amount, 0), [income]);
    const totalInvoices = useMemo(() => invoices.length, [invoices]);
    const balance = totalIncome - totalExpenses;

    const chartData = useMemo(() => {
        // Combine dates from both
        const allDates = new Set([
            ...income.map(i => i.date.substring(0, 7)),
            ...expenses.map(e => e.date.substring(0, 7))
        ]);

        const sortedDates = Array.from(allDates).sort();

        return sortedDates.map(date => {
            const inc = income.filter(i => i.date.startsWith(date)).reduce((sum, i) => sum + i.amount, 0);
            const exp = expenses.filter(e => e.date.startsWith(date)).reduce((sum, e) => sum + e.amount, 0);
            return { name: date, income: inc, expense: exp };
        });
    }, [income, expenses]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
            <SEO
                title="FinanceLite - Free Personal Finance Dashboard & Income Tracker"
                description="Track your income, expenses, and generate professional invoices for free with FinanceLite. The best free personal finance dashboard."
                keywords="finance dashboard, free income tracker, expense tracker, personal finance app, free invoice generator"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-secondary">Overview of your financial health</p>
                </div>
                <div className="flex gap-3">
                    <NeoButton variant="secondary" icon={Download} onClick={() => setIsExportModalOpen(true)}>
                        Download to Excel
                    </NeoButton>
                    <NeoButton icon={Plus} onClick={() => setIsExpenseModalOpen(true)} className="bg-danger hover:bg-danger/80">
                        Add Expense
                    </NeoButton>
                    <NeoButton icon={Plus} onClick={() => setIsIncomeModalOpen(true)} className="bg-success hover:bg-success/80">
                        Add Income
                    </NeoButton>
                    <NeoButton icon={Plus} onClick={() => setIsInvoiceModalOpen(true)} className="bg-accent hover:bg-accent/80">
                        Create Invoice
                    </NeoButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-sm">Total Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-danger'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>
                        <DollarSign size={24} />
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-sm">Total Income</p>
                        <p className="text-2xl font-bold text-success">+${totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-success/20 text-success">
                        <TrendingUp size={24} />
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-sm">Total Expenses</p>
                        <p className="text-2xl font-bold text-danger">-${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-danger/20 text-danger">
                        <TrendingDown size={24} />
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-sm">Invoices Created</p>
                        <p className="text-2xl font-bold text-accent">{totalInvoices}</p>
                    </div>
                    <div className="p-3 rounded-full bg-accent/20 text-accent">
                        <FileText size={24} />
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                            <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <ExpenseForm
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onSubmit={addExpense}
            />

            <IncomeForm
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                onSubmit={addIncome}
            />

            <InvoiceForm
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                onSubmit={addInvoice}
            />

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
