import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../utils';

/**
 * ScrollToTopButton Component
 * Floating action button that appears when user scrolls down and smoothly scrolls back to top when clicked.
 */
export const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollTop > 250) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            if (docHeight > 0) {
                const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to Top"
            title="Scroll to Top"
            className={cn(
                'fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ease-out cursor-pointer shadow-lg hover:shadow-xl group',
                'bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md',
                'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:-translate-y-1',
                'animate-in fade-in zoom-in duration-200'
            )}
        >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                <circle
                    cx="22"
                    cy="22"
                    r="19"
                    className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                    strokeWidth="2"
                />
                <circle
                    cx="22"
                    cy="22"
                    r="19"
                    className="stroke-blue-600 dark:stroke-blue-400 fill-none transition-all duration-150"
                    strokeWidth="2.5"
                    strokeDasharray={119.38}
                    strokeDashoffset={119.38 - (119.38 * scrollProgress) / 100}
                    strokeLinecap="round"
                />
            </svg>

            <ArrowUp className="w-5 h-5 stroke-[2.5] relative z-10 transition-transform group-hover:-translate-y-0.5" />
        </button>
    );
};

export default ScrollToTopButton;
