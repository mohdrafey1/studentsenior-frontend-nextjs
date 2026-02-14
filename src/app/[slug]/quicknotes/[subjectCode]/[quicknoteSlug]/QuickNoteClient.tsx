'use client';

import React, { useState, useEffect } from 'react';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import MarkdownRenderer from '@/components/Common/MarkdownRenderer';
import AppPromotionModal from '@/components/Common/AppPromotionModal';
import GoogleAd from '@/components/GoogleAd';
import { Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { IQuickNote } from '@/utils/interface';

interface QuickNoteClientProps {
    note: IQuickNote;
    slug: string;
    subjectCode: string;
    quicknoteSlug: string;
}

export default function QuickNoteClient({
    note,
    slug,
    subjectCode,
    quicknoteSlug,
}: QuickNoteClientProps) {
    // Timer state for restricted access
    const [showAppModal, setShowAppModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute allowed

    const appLink = `intent://studentsenior.com/${slug}/quicknotes/${subjectCode}/${quicknoteSlug}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end`;
    const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior';

    // Timer Effect with LocalStorage Persistence
    useEffect(() => {
        const STORAGE_KEY = `quicknote_view_start_${quicknoteSlug}`;
        const DURATION_MS = 60 * 1000; // 60 seconds

        // Initialize Start Time
        let startTime = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem(STORAGE_KEY, startTime.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const remaining = Math.max(
                0,
                Math.ceil((DURATION_MS - elapsed) / 1000),
            );

            setTimeLeft(remaining);

            if (remaining <= 0) {
                setShowAppModal(true);
                return true; // Timer finished
            }
            return false;
        };

        // Initial check immediately
        const isFinished = updateTimer();
        if (isFinished) return;

        // Interval
        const timer = setInterval(() => {
            const finished = updateTimer();
            if (finished) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [quicknoteSlug]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: note.title,
                    text: `Check out this quick note on ${note.title}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div className='min-h-screen bg-sky-50 dark:bg-gray-900'>
            <DetailPageNavbar path='quicknotes' />
            <AppPromotionModal isOpen={showAppModal} />

            <main
                className={`max-w-4xl mx-auto px-4 py-8 ${
                    showAppModal
                        ? 'blur-sm pointer-events-none select-none overflow-hidden h-screen'
                        : ''
                }`}
            >
                {/* Ad Unit: Top of Detail Page */}
                <div className='mb-6'>
                    <GoogleAd
                        adSlot='8453205351'
                        style={{ display: 'block', textAlign: 'center' }}
                        label='Quick Note Detail Top'
                    />
                </div>

                {/* Header Section */}
                <div className='mb-8'>
                    <div className='flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400'>
                        {/* Timer Display */}
                        {timeLeft > 0 && timeLeft < 60 && (
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                    timeLeft < 10
                                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400'
                                }`}
                            >
                                Free Preview: {timeLeft}s left
                            </span>
                        )}

                        <span className='flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700'>
                            <Clock className='w-3.5 h-3.5' />
                            {new Date(note.lastUpdated).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <article className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden p-8'>
                    {note.content ? (
                        <div className='mt-8'>
                            <MarkdownRenderer content={note.content} />
                        </div>
                    ) : (
                        <div className='text-center'>
                            <p className='text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed'>
                                This quick revision note is exclusively
                                available on the
                                <span className='font-bold ml-1 text-gray-900 dark:text-white'>
                                    Student Senior App
                                </span>
                                . Download the app to access this note and
                                thousands more!
                            </p>
                            {/* App Download Buttons (from original file) */}
                            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                                <a
                                    href={appLink}
                                    className='w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5'
                                >
                                    Open in App
                                </a>
                                <a
                                    href={playStoreLink}
                                    className='w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2'
                                >
                                    Download App
                                </a>
                            </div>
                        </div>
                    )}
                </article>

                {/* Footer CTA */}
                <div className='mt-8 text-center'>
                    <p className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
                        Find this note helpful? Share it with your friends!
                    </p>
                    <div className='flex justify-center gap-3'>
                        <button
                            onClick={handleShare}
                            className='inline-flex items-center gap-2 px-6 py-2.5 bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 rounded-xl font-medium hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors'
                        >
                            <Share2 className='w-4 h-4' />
                            Share Note
                        </button>
                    </div>
                </div>

                {/* Ad Unit: Bottom of Detail Page */}
                <div className='mt-8'>
                    <GoogleAd
                        adSlot='8453205351'
                        style={{ display: 'block', textAlign: 'center' }}
                        label='Quick Note Detail Bottom'
                    />
                </div>
            </main>
        </div>
    );
}
