import React, { useState, useMemo } from 'react';
import type { Expense } from '../../types';
import { Table } from '../ui/Table';
import { Edit2, Trash2, Search } from 'lucide-react';
import Input from '../ui/Input';

interface ExpenseTableProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
    const [search, setSearch] = useState('');
    const [sortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>(null);

    const filteredExpenses = useMemo(() => {
        let data = [...expenses];

        if (search) {
            const lowerSearch = search.toLowerCase();
            data = data.filter(
                (e) =>
                    e.title.toLowerCase().includes(lowerSearch) ||
                    e.category.toLowerCase().includes(lowerSearch) ||
                    e.note?.toLowerCase().includes(lowerSearch)
            );
        }

        if (sortConfig) {
            data.sort((a, b) => {
                if (a[sortConfig.key]! < b[sortConfig.key]!) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key]! > b[sortConfig.key]!) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return data;
    }, [expenses, search, sortConfig]);



    const columns = [
        { header: 'Date', accessor: 'date' as keyof Expense, className: 'w-32' },
        { header: 'Title', accessor: 'title' as keyof Expense },
        { header: 'Category', accessor: 'category' as keyof Expense },
        {
            header: 'Amount',
            accessor: (item: Expense) => (
                <span className="font-medium text-white">
                    ${item.amount.toFixed(2)}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (item: Expense) => (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-primary transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-danger transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            className: 'w-24 text-right'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="w-64">
                    <Input
                        placeholder="Search expenses..."
                        icon={Search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {/* Sort buttons could go here or integrated into headers */}
                </div>
            </div>
            <Table
                data={filteredExpenses}
                columns={columns}
                onRowClick={onEdit}
            />
        </div>
    );
};

export default ExpenseTable;
