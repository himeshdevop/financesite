import React, { useMemo } from 'react';
import type { Expense } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import GlassCard from '../ui/GlassCard';

interface ExpenseChartsProps {
    expenses: Expense[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
    const categoryData = useMemo(() => {
        const data: Record<string, number> = {};
        expenses.forEach((exp) => {
            data[exp.category] = (data[exp.category] || 0) + exp.amount;
        });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    const monthlyData = useMemo(() => {
        const data: Record<string, number> = {};
        expenses.forEach((exp) => {
            const month = exp.date.substring(0, 7); // YYYY-MM
            data[month] = (data[month] || 0) + exp.amount;
        });
        return Object.entries(data)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, value]) => ({ name, value }));
    }, [expenses]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GlassCard className="h-[300px] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard className="h-[300px] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Expenses</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

export default ExpenseCharts;
