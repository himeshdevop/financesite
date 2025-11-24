import React, { useState, useEffect } from 'react';
import type { Invoice, InvoiceItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import NeoButton from '../ui/NeoButton';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (invoice: Invoice) => void;
    initialData?: Invoice | null;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<Invoice>>({
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        invoiceNumber: '',
        issuedDate: new Date().toISOString().split('T')[0],
        items: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                clientName: '',
                clientEmail: '',
                clientAddress: '',
                invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                issuedDate: new Date().toISOString().split('T')[0],
                items: [],
            });
        }
    }, [initialData, isOpen]);

    const handleAddItem = () => {
        const newItem: InvoiceItem = {
            id: uuidv4(),
            name: '',
            quantity: 1,
            price: 0,
            tax: 0,
        };
        setFormData({ ...formData, items: [...(formData.items || []), newItem] });
    };

    const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        const updatedItems = formData.items?.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setFormData({ ...formData, items: updatedItems });
    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = formData.items?.filter((item) => item.id !== id);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.invoiceNumber || !formData.issuedDate) return;

        const invoice: Invoice = {
            id: initialData?.id || uuidv4(),
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientAddress: formData.clientAddress,
            invoiceNumber: formData.invoiceNumber,
            issuedDate: formData.issuedDate,
            items: formData.items || [],
        };

        onSubmit(invoice);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Invoice' : 'Create Invoice'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Client Details</h3>
                    <Input
                        label="Client Name"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Client Email"
                            type="email"
                            value={formData.clientEmail}
                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        />
                        <Input
                            label="Client Address"
                            value={formData.clientAddress}
                            onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Invoice Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Invoice #"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            required
                        />
                        <Input
                            label="Issued Date"
                            type="date"
                            value={formData.issuedDate}
                            onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                            required
                        />
                        <Input
                            label="Issued Date"
                            type="date"
                            value={formData.issuedDate}
                            onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="text-lg font-semibold text-white">Items</h3>
                        <NeoButton type="button" size="sm" onClick={handleAddItem} icon={Plus}>
                            Add Item
                        </NeoButton>
                    </div>

                    {formData.items?.length === 0 && (
                        <p className="text-center text-secondary py-4">No items added yet.</p>
                    )}

                    <div className="space-y-3">
                        {formData.items?.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-end bg-white/5 p-3 rounded-lg">
                                <div className="col-span-4">
                                    <Input
                                        label="Item Name"
                                        value={item.name}
                                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                        placeholder="Service/Product"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        label="Qty"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        label="Price"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        label="Tax %"
                                        type="number"
                                        value={item.tax}
                                        onChange={(e) => handleUpdateItem(item.id, 'tax', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end pb-1">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                    <NeoButton type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </NeoButton>
                    <NeoButton type="submit">
                        {initialData ? 'Save Changes' : 'Create Invoice'}
                    </NeoButton>
                </div>
            </form>
        </Modal>
    );
};

export default InvoiceForm;
