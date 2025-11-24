import React, { useState, useEffect } from 'react';
import type { Income } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import NeoButton from '../ui/NeoButton';

interface IncomeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (income: Income) => void;
    initialData?: Income | null;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<Income>>({
        source: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                source: '',
                amount: 0,
                category: '',
                date: new Date().toISOString().split('T')[0],
                note: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.source || !formData.amount || !formData.category || !formData.date) return;

        const income: Income = {
            id: initialData?.id || uuidv4(),
            source: formData.source,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            note: formData.note,
        };

        onSubmit(income);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Income' : 'Add Income'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g. Salary, Freelance"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        placeholder="0.00"
                        required
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
                <Input
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Salary, Investment"
                    required
                />
                <div className="space-y-1">
                    <label className="text-sm font-medium text-secondary ml-1">Note</label>
                    <textarea
                        className="input-field min-h-[100px] py-2"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Optional details..."
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <NeoButton type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </NeoButton>
                    <NeoButton type="submit">
                        {initialData ? 'Save Changes' : 'Add Income'}
                    </NeoButton>
                </div>
            </form>
        </Modal>
    );
};

export default IncomeForm;
