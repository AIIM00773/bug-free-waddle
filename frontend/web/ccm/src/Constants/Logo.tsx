


import React from 'react';

interface SokoLogoProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    showText?: boolean;
}

export default function SokoLogo({ size = 32, showText = true, className = '', ...props }: SokoLogoProps) {
    return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
    
            {showText && (
                <span className="text-sm font-black tracking-tight text-slate-950 font-sans">
                    Soko<span className="text-emerald-600 font-extrabold">AI</span>
                </span>
            )}
        </div>
    );
}