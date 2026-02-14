'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { Bot, Sparkles, BookOpen } from 'lucide-react';
import MarkdownRenderer from '@/components/Common/MarkdownRenderer';
import AppPromotionModal from '@/components/Common/AppPromotionModal';
import { IPyq, IPyqSolution } from '@/utils/interface';

interface SolutionClientProps {
    pyq: IPyq;
    solution: IPyqSolution | null;
}

export default function SolutionClient({ pyq, solution }: SolutionClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'concise' | 'expert'>('concise');

    // Timer state for restricted access
    const [showAppModal, setShowAppModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute allowed

    // Timer Effect with LocalStorage Persistence
    useEffect(() => {
        const STORAGE_KEY = `pyq_view_start_${pyq.slug}`;
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
    }, [pyq.slug]);

    return (
        <div className='min-h-screen bg-sky-50 dark:bg-gray-900'>
            <DetailPageNavbar path='pyqs' />

            <AppPromotionModal isOpen={showAppModal} />

            <div
                className={`max-w-4xl mx-auto px-4 py-8 ${showAppModal ? 'blur-sm pointer-events-none select-none overflow-hidden h-screen' : ''}`}
            >
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-2xl sm:text-3xl font-fugaz font-bold text-gray-900 dark:text-white mb-3'>
                        {pyq.subject.subjectName} Solution
                    </h1>
                    <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
                        <span className='px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm border border-gray-200 dark:border-gray-700'>
                            {pyq.year}
                        </span>
                        <span className='px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm border border-gray-200 dark:border-gray-700'>
                            {pyq.examType}
                        </span>

                        {/* Timer Display */}
                        {timeLeft > 0 && timeLeft < 60 && (
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${timeLeft < 10 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400' : 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400'}`}
                            >
                                Free Preview: {timeLeft}s left
                            </span>
                        )}
                    </div>
                </div>

                {!solution ? (
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <Bot className='w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                            Solution Not Available Yet
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400 mb-6'>
                            Our AI is working on this solution. Please check
                            back later or request it now.
                        </p>
                        <button
                            onClick={() => router.back()}
                            className='px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-colors'
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className='flex p-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl mb-6'>
                            <button
                                onClick={() => setActiveTab('concise')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'concise'
                                        ? 'bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <Sparkles className='w-4 h-4' />
                                Concise Answer
                            </button>
                            <button
                                onClick={() => setActiveTab('expert')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'expert'
                                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <BookOpen className='w-4 h-4' />
                                Expert Explanation
                            </button>
                        </div>

                        {/* Content */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden'>
                            <div className='p-6 sm:p-8'>
                                <MarkdownRenderer
                                    content={
                                        activeTab === 'concise'
                                            ? solution.conciseContent
                                            : solution.expertContent
                                    }
                                />
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50'>
                            <div className='flex gap-3'>
                                <Bot className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                                <p className='text-sm text-blue-800 dark:text-blue-300'>
                                    This solution is generated by AI. While we
                                    strive for accuracy, please verify with
                                    standard textbooks.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
