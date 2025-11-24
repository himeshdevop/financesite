import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import GlassCard from '../ui/GlassCard';
import Input from '../ui/Input';
import NeoButton from '../ui/NeoButton';
import SEO from '../SEO';
import { Save, RefreshCw, Upload, Trash2 } from 'lucide-react';
import type { InvoiceSettings } from '../../types';

const CustomInvoices: React.FC = () => {
    const { invoiceSettings, updateInvoiceSettings } = useFinance();
    const [formData, setFormData] = useState<InvoiceSettings>(invoiceSettings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormData(invoiceSettings);
    }, [invoiceSettings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateInvoiceSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleReset = () => {
        const defaultSettings: InvoiceSettings = {
            companyName: 'Your Company Name',
            companyAddress: '123 Business Street\nCity, State, Zip',
            companyEmail: 'contact@yourcompany.com',
            accentColor: '#3b82f6',
        };
        updateInvoiceSettings(defaultSettings);
        setFormData(defaultSettings);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24 md:pb-6">
            <SEO
                title="Custom Invoice Template - Personalize Your Invoices"
                description="Customize your invoice template with your company logo, colors, and details. Create professional branded invoices for free."
                keywords="custom invoice template, invoice branding, invoice logo, professional invoice design, free invoice customizer"
            />

            <div>
                <h1 className="text-3xl font-bold text-white">Custom Invoices</h1>
                <p className="text-secondary">Customize your invoice template and branding</p>
            </div>

            <GlassCard className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Company Name"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                            />
                            <Input
                                label="Company Email"
                                type="email"
                                value={formData.companyEmail}
                                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-secondary">Company Address</label>
                            <textarea
                                value={formData.companyAddress}
                                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/30 min-h-[100px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Branding</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-secondary">Accent Color</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={formData.accentColor}
                                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                        className="h-10 w-20 bg-transparent border-none cursor-pointer"
                                    />
                                    <span className="text-white font-mono">{formData.accentColor}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-secondary">Company Logo</label>
                                <div className="flex items-start gap-4">
                                    {formData.logoUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={formData.logoUrl}
                                                alt="Company Logo"
                                                className="h-20 w-auto object-contain bg-white/5 rounded-lg p-2 border border-white/10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, logoUrl: undefined })}
                                                className="absolute -top-2 -right-2 bg-danger text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 bg-white/5 border border-white/10 border-dashed rounded-lg flex items-center justify-center text-secondary">
                                            <Upload size={20} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                            <NeoButton as="span" variant="secondary" size="sm" icon={Upload}>
                                                Upload Logo
                                            </NeoButton>
                                        </label>
                                        <p className="text-xs text-secondary mt-2">
                                            Recommended: PNG or JPG, max 1MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <NeoButton type="button" variant="secondary" icon={RefreshCw} onClick={handleReset}>
                            Reset to Default
                        </NeoButton>
                        <div className="flex items-center gap-4">
                            {isSaved && <span className="text-success text-sm">Settings saved successfully!</span>}
                            <NeoButton type="submit" icon={Save}>
                                Save Settings
                            </NeoButton>
                        </div>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default CustomInvoices;
