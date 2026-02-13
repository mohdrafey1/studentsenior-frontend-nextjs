import type { Metadata } from 'next';
import { IQuickNote, ISubject } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import Link from 'next/link';
import GoogleAd from '@/components/GoogleAd';
import React from 'react';

interface QuickNotesResponse {
    success: boolean;
    message?: string;
    data: {
        notes: IQuickNote[];
        subject: ISubject;
    };
}

const getQuickNotes = async (
    subjectCode: string,
): Promise<QuickNotesResponse | null> => {
    try {
        const res = await fetch(api.quickNotes.getNotesBySubject(subjectCode), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching quick notes:', error);
        return null;
    }
};

interface QuickNotesPageProps {
    params: Promise<{
        slug: string;
        subjectCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: QuickNotesPageProps): Promise<Metadata> {
    const { subjectCode } = await params;
    const data = await getQuickNotes(subjectCode);
    console.log(data);
    const subjectName = data?.data?.subject?.subjectName || subjectCode;

    return {
        title: `Quick Notes - ${subjectName} (${subjectCode})`,
        description: `Concise revision notes for ${subjectName}. Last minute exam preparation.`,
    };
}

export default async function QuickNotesListPage({
    params,
}: QuickNotesPageProps) {
    const { slug, subjectCode } = await params;
    const response = await getQuickNotes(subjectCode);

    const notes = response?.data?.notes || [];
    const subject = response?.data?.subject;
    const subjectName = subject?.subjectName || subjectCode;

    return (
        <main className='max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='mb-8'>
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                    <Link href={`/${slug}`} className='hover:text-primary'>
                        Home
                    </Link>
                    <span>/</span>
                    <span className='text-gray-900 dark:text-gray-300'>
                        Quick Notes
                    </span>
                </div>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                    {subjectName}{' '}
                    <span className='text-primary'>Quick Notes</span>
                </h1>
                <div className='flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800 text-sm'>
                    <svg
                        className='w-5 h-5 flex-shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    <p>
                        These are concise revision notes designed for
                        last-minute exam preparation.
                    </p>
                </div>
            </header>

            {/* Ad Unit: Top of List */}
            <div className='mb-6'>
                <GoogleAd
                    adSlot='8453205351'
                    style={{ display: 'block', textAlign: 'center' }}
                    label='Quick Notes List Top'
                />
            </div>

            {notes.length === 0 ? (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
                    <p className='text-lg text-gray-500 dark:text-gray-400'>
                        No quick notes available for this subject yet.
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {notes.map((note, index) => (
                        <React.Fragment key={note._id || note.slug}>
                            <Link
                                href={`/${slug}/quicknotes/${subjectCode}/${note.slug}`}
                                className='block group'
                            >
                                <div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex'>
                                    {/* Unit Indicator - simple solid color or gradient approx */}
                                    <div className='w-1 bg-gradient-to-b from-purple-500 to-indigo-600'></div>

                                    <div className='flex-1 p-4 flex items-center gap-4'>
                                        {/* Unit Badge */}
                                        <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center border border-purple-100 dark:border-purple-800'>
                                            <span className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                                                {note.unitNumber}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2'>
                                                {note.title}
                                            </h3>
                                            <div className='flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400'>
                                                <svg
                                                    className='w-3 h-3'
                                                    fill='currentColor'
                                                    viewBox='0 0 20 20'
                                                >
                                                    <path
                                                        fillRule='evenodd'
                                                        d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                                                        clipRule='evenodd'
                                                    />
                                                </svg>
                                                <span>Quick Revision</span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className='flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors'>
                                            <svg
                                                className='w-5 h-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M9 5l7 7-7 7'
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            {/* Insert Ad after 3rd item */}
                            {(index + 1) % 3 === 0 && (
                                <div className='my-4'>
                                    <GoogleAd
                                        adSlot='1357924680'
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                        }}
                                        label='Quick Notes List In-Feed'
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </main>
    );
}
