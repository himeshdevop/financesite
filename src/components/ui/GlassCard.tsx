import React from 'react';
import { cn } from '../Layout';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-surface/40",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
