import { useEffect, type RefObject } from 'react';

/**
 * Auto-scrolls a container to the bottom when deps change.
 * @param ref - The scrollable container ref
 * @param deps - Dependencies that trigger scroll
 * @param enabled - Whether auto-scroll is active (default: true)
 */
export function useAutoScroll(
    ref: RefObject<HTMLDivElement | null>,
    deps: unknown[],
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;
        const el = ref.current;
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
