import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface InfoAlertProps {
    message: string;
}

const InfoAlert: React.FC<InfoAlertProps> = ({ message }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3 relative">
            <div className="text-primary mt-0.5">
                <Info size={20} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-secondary leading-relaxed">
                    {message}
                </p>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="text-secondary hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default InfoAlert;
