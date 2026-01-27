'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SmartAppBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isAndroid = /android/i.test(userAgent);
        const isBannerDismissed = localStorage.getItem(
            'smart_banner_dismissed',
        );

        if (isAndroid && !isBannerDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('smart_banner_dismissed', 'true');
    };

    if (!isVisible) return null;

    const intentUrl = `intent://studentsenior.com${pathname}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end`;

    return (
        <div className='relative z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between gap-4'>
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className='text-gray-400 hover:text-gray-500 transition-colors -ml-2 p-2'
                        aria-label='Close Banner'
                    >
                        <X className='w-5 h-5' />
                    </button>

                    {/* App Info */}
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='relative w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700'>
                            <Image
                                src='/icons/image192.png'
                                alt='App Icon'
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div className='flex flex-col min-w-0'>
                            <h3 className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                                Student Senior
                            </h3>
                            <p className='text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate'>
                                Get the full experience
                            </p>
                            <div className='flex items-center gap-0.5 mt-0.5'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className='w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-400 fill-current'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                    </svg>
                                ))}
                                <span className='text-[10px] text-gray-400 ml-1 hidden sm:inline'>
                                    (4.8)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Open Button */}
                    <a
                        href={intentUrl}
                        className='bg-sky-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-sky-700 transition-colors shadow-sm whitespace-nowrap'
                    >
                        OPEN
                    </a>
                </div>
            </div>
        </div>
    );
}
