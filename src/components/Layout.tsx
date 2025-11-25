
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, TrendingDown, FileText, Settings, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/expenses', label: 'Expenses', icon: TrendingDown },
        { path: '/income', label: 'Income', icon: TrendingUp },
        { path: '/invoices', label: 'Invoices', icon: FileText },
        { path: '/custom-invoices', label: 'Custom Invoices', icon: Palette },
        { path: '/help', label: 'Help', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 hidden md:flex flex-col glass-panel m-4 rounded-2xl border-white/5">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            oceanwix
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                        isActive
                                            ? "bg-primary/20 text-white shadow-lg shadow-primary/10"
                                            : "text-secondary hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>


                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-0 md:mr-4 md:my-4">
                    {/* Mobile Header */}
                    <div className="md:hidden mb-6 flex items-center justify-between glass-panel p-4 rounded-xl">
                        <h1 className="text-xl font-bold text-white">oceanwix</h1>
                        {/* Mobile Menu Trigger would go here */}
                    </div>

                    <div className="h-full rounded-2xl overflow-auto relative">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 z-50 pb-safe">
                <div className="flex justify-around items-center p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center p-2 rounded-lg transition-all",
                                    isActive ? "text-primary" : "text-secondary"
                                )}
                            >
                                <Icon size={24} />
                                <span className="text-[10px] mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Layout;
