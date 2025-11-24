import React from 'react';
import GlassCard from './ui/GlassCard';
import { FileText, Download, Upload, LayoutDashboard } from 'lucide-react';

const HelpPage: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Help & Documentation</h1>
                <p className="text-secondary">Learn how to use financewix features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-primary/20 text-primary">
                            <LayoutDashboard size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Dashboard Features</h2>
                    </div>
                    <ul className="space-y-3 text-secondary">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Overview:</strong> View your total balance, income, expenses, and invoice count at a glance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Quick Actions:</strong> Use the buttons at the top to quickly add expenses, income, or create invoices.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Charts:</strong> Visual representation of your financial trends over time.</span>
                        </li>
                    </ul>
                </GlassCard>

                <GlassCard className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-accent/20 text-accent">
                            <FileText size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Invoices</h2>
                    </div>
                    <ul className="space-y-3 text-secondary">
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span><strong>Creation:</strong> Create professional invoices with optional client details.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span><strong>Management:</strong> Track issued and due dates for all your invoices.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span><strong>Items:</strong> Add multiple items with quantity, price, and tax calculations.</span>
                        </li>
                    </ul>
                </GlassCard>

                <GlassCard className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-success/20 text-success">
                            <Download size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Export Data</h2>
                    </div>
                    <p className="text-secondary mb-4">
                        You can export your data to a text file for backup or transfer purposes.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-secondary ml-2">
                        <li>Navigate to the <strong>Expenses</strong> or <strong>Income</strong> page.</li>
                        <li>Click the <strong>Export</strong> button in the top right corner.</li>
                        <li>A file named <code>expenses-[date].txt</code> or <code>income-[date].txt</code> will be downloaded.</li>
                        <li>Keep this file safe as it contains your financial records.</li>
                    </ol>
                </GlassCard>

                <GlassCard className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-danger/20 text-danger">
                            <Upload size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Import Data</h2>
                    </div>
                    <p className="text-secondary mb-4">
                        Restore your data from a previously exported file.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-secondary ml-2">
                        <li>Navigate to the <strong>Expenses</strong> or <strong>Income</strong> page.</li>
                        <li>Click the <strong>Import</strong> button.</li>
                        <li>Select a valid <code>.txt</code> file that was previously exported from this app.</li>
                        <li>The data will be loaded and merged with your current records.</li>
                    </ol>
                </GlassCard>
            </div>
        </div>
    );
};

export default HelpPage;
