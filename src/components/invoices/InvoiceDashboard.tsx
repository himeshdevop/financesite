import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import NeoButton from '../ui/NeoButton';
import SEO from '../SEO';
import { Plus, Download, Upload } from 'lucide-react';
import type { Invoice } from '../../types';
import { generateExportString, parseImportString } from '../../utils/fileHandler';

const InvoiceDashboard: React.FC = () => {
    const { invoices, addInvoice, updateInvoice, deleteInvoice, importData } = useFinance();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

    const handleCreate = () => {
        setEditingInvoice(null);
        setIsFormOpen(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setIsFormOpen(true);
    };

    const handlePreview = (invoice: Invoice) => {
        setPreviewInvoice(invoice);
        setIsPreviewOpen(true);
    };

    const handleSubmit = (invoice: Invoice) => {
        if (editingInvoice) {
            updateInvoice(invoice);
        } else {
            addInvoice(invoice);
        }
    };

    const handleExport = () => {
        const data = generateExportString([], [], invoices);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-${new Date().toISOString().split('T')[0]}.txt`;
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
                importData({ invoices: parsed.invoices });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
            <SEO
                title="Free Invoice Generator - Create & Download Professional Invoices"
                description="Create professional invoices for free. Download PDF invoices, track payments, and manage clients with our free invoice generator."
                keywords="invoice generator free, free invoice maker, pdf invoice generator, professional invoice template, free billing software"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-secondary">Create and manage client invoices</p>
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
                    <NeoButton icon={Plus} onClick={handleCreate}>
                        Create Invoice
                    </NeoButton>
                </div>
            </div>

            <InvoiceList
                invoices={invoices}
                onEdit={handleEdit}
                onDelete={deleteInvoice}
                onPreview={handlePreview}
            />

            <InvoiceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingInvoice}
            />

            <InvoicePreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                invoice={previewInvoice}
            />
        </div>
    );
};

export default InvoiceDashboard;
