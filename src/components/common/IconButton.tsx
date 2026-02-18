import type { MouseEvent } from 'react';
import { cn } from '../../lib/utils';

interface IconButtonProps {
    icon: string;
    onClick?: (e: MouseEvent) => void;
    title?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'ghost' | 'primary' | 'danger';
    disabled?: boolean;
}

const sizeMap = { sm: 'p-1.5 text-[16px]', md: 'p-2 text-[20px]', lg: 'p-2.5 text-[24px]' };
const variantMap = {
    ghost: 'text-slate-400 hover:text-white hover:bg-white/10',
    primary: 'text-white bg-[#195de6] hover:bg-[#195de6]/80',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
};

export function IconButton({ icon, onClick, title, className, size = 'md', variant = 'ghost', disabled }: IconButtonProps) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'rounded-lg transition-all flex items-center justify-center flex-shrink-0',
                sizeMap[size],
                variantMap[variant],
                disabled && 'opacity-40 cursor-not-allowed',
                className
            )}
        >
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{icon}</span>
        </button>
    );
}
