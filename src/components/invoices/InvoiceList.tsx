import React, { useState, useMemo } from 'react';
import type { Invoice } from '../../types';
import { Table } from '../ui/Table';
import { Edit2, Trash2, Search, Eye } from 'lucide-react';
import Input from '../ui/Input';

interface InvoiceListProps {
    invoices: Invoice[];
    onEdit: (invoice: Invoice) => void;
    onDelete: (id: string) => void;
    onPreview: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onEdit, onDelete, onPreview }) => {
    const [search, setSearch] = useState('');

    const filteredInvoices = useMemo(() => {
        if (!search) return invoices;
        const lowerSearch = search.toLowerCase();
        return invoices.filter(
            (inv) =>
                inv.clientName.toLowerCase().includes(lowerSearch) ||
                inv.invoiceNumber.toLowerCase().includes(lowerSearch)
        );
    }, [invoices, search]);

    const columns = [
        { header: 'Number', accessor: 'invoiceNumber' as keyof Invoice, className: 'w-32 font-mono' },
        { header: 'Date', accessor: 'issuedDate' as keyof Invoice, className: 'w-32' },
        { header: 'Client', accessor: 'clientName' as keyof Invoice },
        {
            header: 'Total',
            accessor: (inv: Invoice) => {
                const total = inv.items.reduce((sum, item) => sum + (item.quantity * item.price * (1 + item.tax / 100)), 0);
                return <span className="font-medium">${total.toFixed(2)}</span>;
            }
        },
        {
            header: 'Actions',
            accessor: (inv: Invoice) => (
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(inv); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-accent transition-colors"
                        title="Preview PDF"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(inv); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(inv.id); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-secondary hover:text-danger transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            className: 'w-32 text-right'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="w-64">
                    <Input
                        placeholder="Search invoices..."
                        icon={Search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <Table
                data={filteredInvoices}
                columns={columns}
                onRowClick={onPreview}
            />
        </div>
    );
};

export default InvoiceList;
