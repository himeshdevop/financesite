import React from 'react';
import { cn } from '../Layout';
import { Loader2 } from 'lucide-react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ElementType;
    as?: React.ElementType;
}

const NeoButton: React.FC<NeoButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon: Icon,
    disabled,
    as: Component = 'button',
    ...props
}) => {
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30",
        secondary: "bg-surface border border-white/10 text-white hover:bg-white/5",
        danger: "bg-danger text-white shadow-lg shadow-danger/20 hover:bg-danger/90 hover:shadow-danger/30",
        ghost: "bg-transparent text-secondary hover:text-white hover:bg-white/5 shadow-none",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <Component
            className={cn(
                "relative overflow-hidden rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
            {!isLoading && Icon && <Icon className="w-4 h-4" />}
            {children}
        </Component>
    );
};

export default NeoButton;
