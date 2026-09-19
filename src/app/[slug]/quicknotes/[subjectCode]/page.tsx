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
        <main className='max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen'>
            <header className='mb-8 bg-[#fcfbf9] dark:bg-[#202020] p-6 rounded-2xl border border-[#e6e6e6] dark:border-[#383838] shadow-sm'>
                <div className='flex items-center gap-2 text-sm text-[#8c8883] dark:text-[#787672] mb-3 font-medium'>
                    <Link href={`/${slug}`} className='hover:text-[#101828] dark:hover:text-white transition-colors'>
                        Home
                    </Link>
                    <span>/</span>
                    <span className='text-[#101828] dark:text-[#ededed]'>
                        Quick Notes
                    </span>
                </div>
                <h1 className='text-2xl sm:text-3xl font-bold text-[#101828] dark:text-[#ededed] mb-4'>
                    {subjectName}{' '}
                    <span className='text-[#0075de] dark:text-[#62aef0]'>Quick Notes</span>
                </h1>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] rounded-xl border border-[#d2e4f9] dark:border-[#224474] text-sm shadow-xs'>
                    <div className='p-2 bg-white dark:bg-[#11233c] rounded-lg border border-[#d2e4f9] dark:border-[#224474] flex-shrink-0'>
                        <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2.5}
                                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                    </div>
                    <p className='font-medium leading-relaxed'>
                        These are concise revision notes designed for last-minute exam preparation.
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
                <div className='text-center py-16 px-4 bg-[#fcfbf9] dark:bg-[#202020] rounded-2xl border border-dashed border-[#e6e6e6] dark:border-[#383838] shadow-sm'>
                    <p className='text-lg font-medium text-[#615d59] dark:text-[#a09e9a]'>
                        No quick notes available for this subject yet.
                    </p>
                </div>
            ) : (
                <div className='space-y-3'>
                    {notes.map((note, index) => (
                        <React.Fragment key={note._id || note.slug}>
                            <Link
                                href={`/${slug}/quicknotes/${subjectCode}/${note.slug}`}
                                className='block group outline-none'
                            >
                                <div className='bg-white dark:bg-[#202020] rounded-xl overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de] dark:hover:border-[#0075de] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 flex items-stretch'>
                                    {/* Accent border left */}
                                    <div className='w-1 bg-[#f0eee9] dark:bg-[#2a2a2a] group-hover:bg-[#0075de] transition-colors'></div>

                                    <div className='flex-1 p-4 sm:p-5 flex items-center gap-4 sm:gap-5'>
                                        {/* Unit Badge */}
                                        <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-[#fcfbf9] dark:bg-[#191919] flex items-center justify-center border border-[#e6e6e6] dark:border-[#383838] group-hover:bg-[#eaf3fd] dark:group-hover:bg-[#183153] group-hover:border-[#d2e4f9] dark:group-hover:border-[#224474] transition-colors'>
                                            <span className='text-base font-bold text-[#101828] dark:text-[#ededed] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                                U{note.unitNumber}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-base font-bold text-[#101828] dark:text-[#ededed] mb-1.5 group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-1'>
                                                {note.title}
                                            </h3>
                                            <div className='flex items-center gap-1.5 text-xs font-semibold text-[#d97706] dark:text-[#fbbf24] bg-[#fffbeb] dark:bg-[#382606] border border-[#fef08a] dark:border-[#524419] px-2 py-0.5 rounded-md inline-flex'>
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
                                        <div className='flex-shrink-0 text-[#8c8883] dark:text-[#787672] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors group-hover:translate-x-1 duration-200'>
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
