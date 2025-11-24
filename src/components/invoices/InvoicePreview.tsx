import React from 'react';
import type { Invoice } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import NeoButton from '../ui/NeoButton';
import { Download } from 'lucide-react';
import Modal from '../ui/Modal';

interface InvoicePreviewProps {
    invoice: Invoice | null;
    isOpen: boolean;
    onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, isOpen, onClose }) => {
    const { invoiceSettings } = useFinance();
    if (!invoice) return null;

    const calculateSubtotal = () => {
        return invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    };

    const calculateTax = () => {
        return invoice.items.reduce((sum, item) => sum + (item.quantity * item.price * item.tax) / 100, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(invoiceSettings.accentColor);

        if (invoiceSettings.logoUrl) {
            try {
                doc.addImage(invoiceSettings.logoUrl, 'JPEG', 14, 15, 30, 30);
                doc.text('INVOICE', 14, 55);
            } catch (e) {
                doc.text('INVOICE', 14, 22);
            }
        } else {
            doc.text('INVOICE', 14, 22);
        }

        // Company Details
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(invoiceSettings.companyName, 140, 22);
        doc.setFontSize(9);
        doc.text(invoiceSettings.companyAddress, 140, 27);
        doc.text(invoiceSettings.companyEmail, 140, 37);

        doc.setFontSize(10);
        doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 30);
        doc.text(`Date: ${invoice.issuedDate}`, 14, 35);

        // Client Details
        doc.text('Bill To:', 14, 50);
        doc.setFontSize(12);
        doc.text(invoice.clientName || '', 14, 56);
        doc.setFontSize(10);
        if (invoice.clientEmail) doc.text(invoice.clientEmail, 14, 62);
        if (invoice.clientAddress) doc.text(invoice.clientAddress, 14, 67);

        // Table
        const tableColumn = ["Item", "Quantity", "Price", "Tax %", "Total"];
        const tableRows: any[] = [];

        invoice.items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            const itemData = [
                item.name,
                item.quantity,
                `$${item.price.toFixed(2)}`,
                `${item.tax}%`,
                `$${itemTotal.toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: invoiceSettings.accentColor }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY || 75;

        doc.text(`Subtotal: $${calculateSubtotal().toFixed(2)}`, 140, finalY + 10);
        doc.text(`Tax: $${calculateTax().toFixed(2)}`, 140, finalY + 15);
        doc.setFontSize(12);
        doc.text(`Total: $${calculateTotal().toFixed(2)}`, 140, finalY + 22);

        doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invoice Preview">
            <div className="bg-white text-slate-900 p-8 rounded-lg shadow-lg mb-6">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        {invoiceSettings.logoUrl ? (
                            <div className="mb-4">
                                <img
                                    src={invoiceSettings.logoUrl}
                                    alt="Company Logo"
                                    className="h-16 w-auto object-contain"
                                />
                                <h1 className="text-4xl font-bold mt-2" style={{ color: invoiceSettings.accentColor }}>INVOICE</h1>
                            </div>
                        ) : (
                            <h1 className="text-4xl font-bold" style={{ color: invoiceSettings.accentColor }}>INVOICE</h1>
                        )}
                        <p className="text-slate-500 mt-2">#{invoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-800">{invoiceSettings.companyName}</h2>
                        <p className="text-sm text-slate-500 whitespace-pre-line">{invoiceSettings.companyAddress}</p>
                        <p className="text-sm text-slate-500">{invoiceSettings.companyEmail}</p>
                        <p className="font-semibold mt-4">Issued: {invoice.issuedDate}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="text-lg font-bold">{invoice.clientName || 'Client'}</p>
                    {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                    {invoice.clientAddress && <p className="whitespace-pre-line">{invoice.clientAddress}</p>}
                </div>

                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-slate-200">
                            <th className="text-left py-3 font-bold text-slate-600">Item</th>
                            <th className="text-right py-3 font-bold text-slate-600">Qty</th>
                            <th className="text-right py-3 font-bold text-slate-600">Price</th>
                            <th className="text-right py-3 font-bold text-slate-600">Tax</th>
                            <th className="text-right py-3 font-bold text-slate-600">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="py-3">{item.name}</td>
                                <td className="text-right py-3">{item.quantity}</td>
                                <td className="text-right py-3">${item.price.toFixed(2)}</td>
                                <td className="text-right py-3">{item.tax}%</td>
                                <td className="text-right py-3">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Tax</span>
                            <span className="font-medium">${calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-lg font-bold text-primary">${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <NeoButton variant="ghost" onClick={onClose}>
                    Close
                </NeoButton>
                <NeoButton onClick={handleDownloadPDF} icon={Download}>
                    Download PDF
                </NeoButton>
            </div>
        </Modal>
    );
};

export default InvoicePreview;
