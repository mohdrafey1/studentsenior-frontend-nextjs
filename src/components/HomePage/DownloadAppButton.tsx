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
        <div className='flex justify-center gap-4 mb-4 animate-fade-in-delay-2'>
            <a
                href='https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior&pcampaignid=web_share'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200'
            >
                <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path d='M3.609 1.814L13.792 12 3.61 22.186c-.184-.138-.344-.325-.453-.559H3.15a1.59 1.59 0 0 1-.362-1.043V3.416c0-.395.127-.75.344-1.043.109-.234.269-.421.477-.559zM15.42 13.628l-8.583 8.583c.31.062.625.105.952.105.9 0 1.777-.333 2.457-1.014l5.174-5.174-2.529-2.5zm.937-3.256L21.87 15.9c.284-.45.452-.98.452-1.559 0-.58-.168-1.109-.452-1.559l-5.513 5.516zM6.837 1.684l8.583 8.583 2.529-2.5-5.174-5.174c-.68-.68-1.557-1.014-2.457-1.014-.327 0-.642.043-.952.105z' />
                </svg>
                Download App
            </a>
        </div>
    );
};

export default DownloadAppButton;
