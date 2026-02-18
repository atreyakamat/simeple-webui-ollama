import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    as?: 'div' | 'button' | 'aside' | 'section';
}

export function GlassCard({ children, className, onClick, as: Tag = 'div' }: GlassCardProps) {
    return (
        <Tag
            className={cn('glass-panel rounded-2xl', className)}
            onClick={onClick}
        >
            {children}
        </Tag>
    );
}
