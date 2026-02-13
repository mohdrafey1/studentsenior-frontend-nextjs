'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    label?: string;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function GoogleAd({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style,
    label = 'Advertisement',
    className = '',
}: GoogleAdProps) {
    const adRef = useRef<HTMLModElement>(null);
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Prevent double loading in development (React StrictMode)
        if (hasLoadedRef.current) return;

        const loadAd = () => {
            try {
                const adElement = adRef.current;
                if (!adElement) return;

                // Check if ad already has data-adsbygoogle-status (already loaded)
                if (adElement.getAttribute('data-adsbygoogle-status')) {
                    return;
                }

                // Check if container has width
                const containerWidth =
                    adElement.parentElement?.offsetWidth || 0;

                if (containerWidth > 0 && typeof window !== 'undefined') {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    hasLoadedRef.current = true;
                } else {
                    // Retry after a short delay if no width yet
                    setTimeout(loadAd, 100);
                }
            } catch (error) {
                console.error('AdSense error:', error);
            }
        };

        // Use requestAnimationFrame to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            requestAnimationFrame(loadAd);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    // Development mode placeholder
    if (process.env.NODE_ENV === 'development') {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 font-medium ${className}`}
                style={{
                    minWidth: '250px',
                    minHeight: '100px',
                    width: '100%',
                    padding: '20px',
                    ...style,
                }}
            >
                Ad Placeholder: {label}
                <br />
                <span className='text-xs ml-2'>(Slot: {adSlot})</span>
            </div>
        );
    }

    return (
        <div
            className={`google-ad-container ${className}`}
            style={{ minWidth: '250px', minHeight: '50px', ...style }}
        >
            <ins
                ref={adRef}
                className='adsbygoogle'
                style={{ display: 'block' }}
                data-ad-client='ca-pub-4435788387381825'
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    );
}
