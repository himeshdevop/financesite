import React, { useMemo } from 'react';
import type { Income, Expense } from '../../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import GlassCard from '../ui/GlassCard';

interface IncomeChartsProps {
    income: Income[];
    expenses: Expense[];
}

const IncomeCharts: React.FC<IncomeChartsProps> = ({ income, expenses }) => {
    const trendData = useMemo(() => {
        const data: Record<string, number> = {};
        income.forEach((inc) => {
            const month = inc.date.substring(0, 7); // YYYY-MM
            data[month] = (data[month] || 0) + inc.amount;
        });
        return Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, value]) => ({ name, value }));
    }, [income]);

    const comparisonData = useMemo(() => {
        const data: Record<string, { income: number; expense: number }> = {};

        income.forEach((inc) => {
            const month = inc.date.substring(0, 7);
            if (!data[month]) data[month] = { income: 0, expense: 0 };
            data[month].income += inc.amount;
        });

        expenses.forEach((exp) => {
            const month = exp.date.substring(0, 7);
            if (!data[month]) data[month] = { income: 0, expense: 0 };
            data[month].expense += exp.amount;
        });

        return Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, values]) => ({ name, ...values }));
    }, [income, expenses]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GlassCard className="h-[300px] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">Income Trend</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard className="h-[300px] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">Income vs Expense</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

export default IncomeCharts;
