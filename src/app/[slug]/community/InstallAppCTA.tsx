'use client';

import { useState } from 'react';

const PLAY_STORE_URL =
    'https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior&pcampaignid=web_share';

/**
 * Reusable "install the app" gate used across the limited web community pages.
 * Every write action (create group, send message, join) routes through this so
 * the web experience consistently drives app installs.
 */
export default function InstallAppCTA({
    label,
    variant = 'primary',
    fullWidth = false,
}: {
    label: string;
    variant?: 'primary' | 'locked';
    fullWidth?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const base =
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200';
    const styles =
        variant === 'primary'
            ? 'px-4 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-sm hover:shadow-lg'
            : 'px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700';

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`${base} ${styles} ${fullWidth ? 'w-full' : ''}`}
            >
                {variant === 'locked' && (
                    <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                    </svg>
                )}
                {label}
            </button>

            {open && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
                    onClick={() => setOpen(false)}
                >
                    <div
                        className='w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 text-center shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-900/40 dark:to-cyan-900/40'>
                            <svg
                                className='h-7 w-7 text-sky-600'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path d='M3.609 1.814L13.792 12 3.61 22.186c-.184-.138-.344-.325-.453-.559H3.15a1.59 1.59 0 0 1-.362-1.043V3.416c0-.395.127-.75.344-1.043.109-.234.269-.421.477-.559zM15.42 13.628l-8.583 8.583c.31.062.625.105.952.105.9 0 1.777-.333 2.457-1.014l5.174-5.174-2.529-2.5zm.937-3.256L21.87 15.9c.284-.45.452-.98.452-1.559 0-.58-.168-1.109-.452-1.559l-5.513 5.516zM6.837 1.684l8.583 8.583 2.529-2.5-5.174-5.174c-.68-.68-1.557-1.014-2.457-1.014-.327 0-.642.043-.952.105z' />
                            </svg>
                        </div>
                        <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                            Get the app to join the chat
                        </h3>
                        <p className='mb-5 text-sm text-gray-500 dark:text-gray-400'>
                            Real-time group chats, anonymous posting, and
                            notifications are available in the StudentSenior app.
                        </p>
                        <a
                            href={PLAY_STORE_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-3 font-semibold text-white'
                        >
                            Download on Google Play
                        </a>
                        <button
                            onClick={() => setOpen(false)}
                            className='mt-3 w-full py-2 text-sm text-gray-400'
                        >
                            Not now
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
