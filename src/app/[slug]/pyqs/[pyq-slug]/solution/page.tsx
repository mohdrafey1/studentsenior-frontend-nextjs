'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/config/apiUrls';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { Bot, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import MarkdownRenderer from '@/components/Common/MarkdownRenderer';

import { IPyq, IPyqSolution } from '@/utils/interface';

export default function SolutionPage() {
    const { 'pyq-slug': pyqSlug } = useParams();
    const router = useRouter();

    const [pyq, setPyq] = useState<IPyq | null>(null);
    const [solution, setSolution] = useState<IPyqSolution | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'concise' | 'expert'>('concise');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch PYQ Details to get ID and Title
                const pyqRes = await fetch(
                    api.pyq.getPyqBySlug(pyqSlug as string),
                );
                const pyqData = await pyqRes.json();

                if (!pyqData.success || !pyqData.data) {
                    throw new Error('PYQ not found');
                }

                setPyq(pyqData.data);

                // 2. Fetch Solution using PYQ ID
                const solutionRes = await fetch(
                    api.pyqSolutions.getPublicSolution(pyqData.data._id),
                );
                const solutionData = await solutionRes.json();

                if (solutionData.success) {
                    setSolution(solutionData.data);
                } else {
                    console.log('Solution not found');
                }
            } catch (error) {
                console.error('Error fetching solution:', error);
                toast.error('Failed to load solution');
            } finally {
                setLoading(false);
            }
        };

        if (pyqSlug) {
            fetchData();
        }
    }, [pyqSlug]);

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center'>
                <Loader2 className='w-10 h-10 text-indigo-600 animate-spin' />
            </div>
        );
    }

    if (!pyq || !solution) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4'>
                <Bot className='w-16 h-16 text-gray-400 mb-4' />
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                    Solution Not Found
                </h1>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>
                    The solution you are looking for is currently unavailable.
                </p>
                <button
                    onClick={() => router.back()}
                    className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                >
                    Go Back
                </button>
            </div>
        );
    }

    const currentContent =
        activeTab === 'concise'
            ? solution.conciseContent
            : solution.expertContent;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <DetailPageNavbar path='pyqs' />

            <div className='max-w-5xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-sm text-gray-500 dark:text-gray-400'>
                                    {pyq.subject.subjectCode}
                                </span>
                            </div>
                            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                {pyq.subject.subjectName}
                            </h1>
                            <p className='text-gray-600 dark:text-gray-300'>
                                {pyq.examType} • {pyq.year}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6'>
                    <div className='flex border-b border-gray-200 dark:border-gray-700'>
                        <button
                            onClick={() => setActiveTab('concise')}
                            className={`flex-1 py-4 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                                activeTab === 'concise'
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <Sparkles className='w-4 h-4' />
                            Concise Solution
                        </button>
                        <button
                            onClick={() => setActiveTab('expert')}
                            className={`flex-1 py-4 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                                activeTab === 'expert'
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <BookOpen className='w-4 h-4' />
                            Expert Explanation
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-6 md:p-8 min-h-[500px]'>
                        <div className='prose prose-indigo dark:prose-invert max-w-none'>
                            <MarkdownRenderer content={currentContent} />
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex gap-3'>
                    <Bot className='w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0' />
                    <div>
                        <h4 className='text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-1'>
                            AI Generated Content
                        </h4>
                        <p className='text-xs text-yellow-700 dark:text-yellow-400'>
                            This solution was generated by an AI model. while we
                            strive for accuracy, please verify with your
                            official textbooks and notes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
