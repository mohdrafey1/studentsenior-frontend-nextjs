'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AppPromotionModalProps {
    isOpen: boolean;
}

const AppPromotionModal: React.FC<AppPromotionModalProps> = ({ isOpen }) => {
    const pathname = usePathname();
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    if (!isOpen) return null;

    const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior';
    const deepLink = `intent://studentsenior.com${pathname}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=${playStoreLink};end`;

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden'>
                {/* Decorative Background Elements */}
                <div className='absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-sky-100 dark:bg-sky-900/30 rounded-full blur-3xl opacity-60'></div>
                <div className='absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60'></div>

                <div className='relative z-10 text-center'>
                    <div className='w-20 h-20 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white dark:ring-gray-800'>
                        <Zap className='w-10 h-10 text-sky-600 dark:text-sky-400 fill-current' />
                    </div>

                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                        Free Preview Ended
                    </h2>

                    <p className='text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
                        To continue reading this solution and access exclusive
                        features like{' '}
                        <span className='font-semibold text-sky-600 dark:text-sky-400'>
                            offline mode
                        </span>{' '}
                        and{' '}
                        <span className='font-semibold text-sky-600 dark:text-sky-400'>
                            better experience
                        </span>
                        , switch to our app!
                    </p>

                    <div className='space-y-3'>
                        {/* Open in App Button (Primary) */}
                        <a
                            href={isAndroid ? deepLink : playStoreLink}
                            className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-sky-500/25 transform hover:-translate-y-0.5'
                        >
                            <Smartphone className='w-5 h-5' />
                            {isAndroid ? 'Open in App' : 'Get the App'}
                        </a>
                    </div>

                    <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-700'>
                        <p className='text-xs text-gray-400 dark:text-gray-500'>
                            Open in App for better and smooth experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppPromotionModal;
