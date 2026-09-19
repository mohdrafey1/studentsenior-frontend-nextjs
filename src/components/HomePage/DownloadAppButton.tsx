'use client';

import { useEffect, useState } from 'react';

const DownloadAppButton = () => {
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    if (!isAndroid) return null;

    return (
        <div className='flex justify-center gap-4 mb-5'>
            <a
                href='https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior&pcampaignid=web_share'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,117,222,0.25)] transition-all duration-150'
            >
                <svg
                    className='w-5 h-5 flex-shrink-0'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M3.6 2.3C3.22 2.7 3 3.32 3 4.12v15.76c0 .8.22 1.42.6 1.82L3.7 21.8 14.25 12 3.7 2.2l-.1.1Z'
                        fill='#00A0FF'
                    />
                    <path
                        d='M17.75 15.25 14.25 12 3.7 21.8c.4.42 1.05.47 1.78.06l12.27-6.61Z'
                        fill='#00D66F'
                    />
                    <path
                        d='m17.75 8.75-12.27-6.61C4.75 1.73 4.1 1.78 3.7 2.2L14.25 12l3.5-3.25Z'
                        fill='#FFD500'
                    />
                    <path
                        d='m17.75 8.75-3.5 3.25 3.5 3.25 4.1-2.21c1.15-.62 1.15-1.46 0-2.08l-4.1-2.21Z'
                        fill='#FF3B30'
                    />
                </svg>
                <span>Download App</span>
            </a>
        </div>
    );
};


export default DownloadAppButton;
