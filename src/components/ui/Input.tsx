import React from 'react';
import { cn } from '../Layout';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ElementType;
}

const Input: React.FC<InputProps> = ({ label, error, icon: Icon, className, ...props }) => {
    return (
        <div className="w-full space-y-1">
            {label && <label className="text-sm font-medium text-secondary ml-1">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={cn(
                        "input-field",
                        Icon && "pl-10",
                        error && "border-danger/50 focus:ring-danger/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-danger ml-1">{error}</p>}
        </div>
    );
};

export default Input;
