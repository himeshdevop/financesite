import React from 'react';
import Modal from './ui/Modal';
import NeoButton from './ui/NeoButton';
import { TrendingUp, TrendingDown, FileText, Database } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { exportToExcel } from '../utils/excelHandler';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { expenses, income, invoices } = useFinance();

    const handleExportExpenses = () => {
        exportToExcel({ expenses }, `expenses-${new Date().toISOString().split('T')[0]}`);
        onClose();
    };

    const handleExportIncome = () => {
        exportToExcel({ income }, `income-${new Date().toISOString().split('T')[0]}`);
        onClose();
    };

    const handleExportInvoices = () => {
        exportToExcel({ invoices }, `invoices-${new Date().toISOString().split('T')[0]}`);
        onClose();
    };

    const handleExportAll = () => {
        exportToExcel({ expenses, income, invoices }, `finance-data-${new Date().toISOString().split('T')[0]}`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Download to Excel">
            <div className="space-y-4">
                <p className="text-secondary text-sm">Select the data you want to download as an Excel file.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleExportExpenses}
                        className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                    >
                        <div className="p-3 rounded-full bg-danger/20 text-danger mb-3 group-hover:scale-110 transition-transform">
                            <TrendingDown size={24} />
                        </div>
                        <span className="font-semibold text-white">Expenses</span>
                        <span className="text-xs text-secondary mt-1">Export expenses only</span>
                    </button>

                    <button
                        onClick={handleExportIncome}
                        className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                    >
                        <div className="p-3 rounded-full bg-success/20 text-success mb-3 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <span className="font-semibold text-white">Income</span>
                        <span className="text-xs text-secondary mt-1">Export income only</span>
                    </button>

                    <button
                        onClick={handleExportInvoices}
                        className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                    >
                        <div className="p-3 rounded-full bg-accent/20 text-accent mb-3 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <span className="font-semibold text-white">Invoices</span>
                        <span className="text-xs text-secondary mt-1">Export invoices only</span>
                    </button>

                    <button
                        onClick={handleExportAll}
                        className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                    >
                        <div className="p-3 rounded-full bg-primary/20 text-primary mb-3 group-hover:scale-110 transition-transform">
                            <Database size={24} />
                        </div>
                        <span className="font-semibold text-white">All Data</span>
                        <span className="text-xs text-secondary mt-1">Export everything</span>
                    </button>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                    <NeoButton variant="ghost" onClick={onClose}>
                        Cancel
                    </NeoButton>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;
