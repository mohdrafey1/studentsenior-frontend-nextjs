import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { IQuickNote } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import Link from 'next/link';
import Image from 'next/image';

interface QuickNoteDetailData {
    success: boolean;
    data: IQuickNote;
}

const getQuickNoteDetail = async (slug: string): Promise<IQuickNote | null> => {
    try {
        const res = await fetch(api.quickNotes.getNoteDetail(slug), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching quick note detail:', error);
        return null;
    }
};

interface QuickNoteDetailPageProps {
    params: Promise<{
        slug: string;
        subjectCode: string;
        quicknoteSlug: string;
    }>;
}

export async function generateMetadata({
    params,
}: QuickNoteDetailPageProps): Promise<Metadata> {
    const { quicknoteSlug } = await params;
    const note = await getQuickNoteDetail(quicknoteSlug);

    if (!note) {
        return {
            title: 'Quick Note Not Found',
        };
    }

    return {
        title: `${note.title} - Quick Notes`,
        description: note.title, // Simple description as content is hidden
    };
}

export default async function QuickNoteDetailPage({
    params,
}: QuickNoteDetailPageProps) {
    const { slug, subjectCode, quicknoteSlug } = await params;
    const note = await getQuickNoteDetail(quicknoteSlug);

    if (!note) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-12 text-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    Note Not Found
                </h1>
                <Link
                    href={`/${slug}/quicknotes/${subjectCode}`}
                    className='text-primary mt-4 inline-block hover:underline'
                >
                    Back to List
                </Link>
            </div>
        );
    }

    const appLink = `intent://studentsenior.com/${slug}/quicknotes/${subjectCode}/${quicknoteSlug}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end`;
    const playStoreLink =
        'https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior';

    return (
        <main className='max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-6 text-sm text-gray-500'>
                <Link href={`/${slug}`} className='hover:text-primary'>
                    Home
                </Link>
                <span className='mx-2'>/</span>
                <Link
                    href={`/${slug}/quicknotes/${subjectCode}`}
                    className='hover:text-primary'
                >
                    {subjectCode}
                </Link>
                <span className='mx-2'>/</span>
                <span className='text-gray-900 dark:text-gray-300 truncate'>
                    {note.title}
                </span>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden text-center p-8 sm:p-12'>
                <div className='w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-100 dark:border-purple-800'>
                    <span className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                        {note.unitNumber}
                    </span>
                </div>

                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                    {note.title}
                </h1>

                <p className='text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed'>
                    This quick revision note is exclusively available on the
                    <span className='font-bold ml-1 text-gray-900 dark:text-white'>
                        Student Senior App
                    </span>
                    . Download the app to access this note and thousands more!
                </p>

                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <a
                        href={appLink}
                        className='w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5'
                    >
                        <svg
                            className='w-5 h-5'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                        >
                            <path d='M3 20.976c.066.362.247.69.516.938.27.248.608.388.974.404.366.016.712-.103.996-.342l6.23-5.226L6.59 11.626 3 20.976Zm17.91-4.708-4.992-4.188-4.496 3.77 5.068 4.25c.164.137.35.234.549.282.199.049.407.058.61.026.202-.032.395-.104.567-.21.171-.107.319-.247.433-.414a1.867 1.867 0 0 0 .261-.914 1.867 1.867 0 0 0-.001-.602ZM12.91 15.546l4.634 3.886 4.394-11.436L6.966 10.65l5.944 4.896ZM19.646 3.09a2.08 2.08 0 0 0-.693-.306 2.08 2.08 0 0 0-.756-.008L9.07 4.194l-3.322 8.642 5.056 4.24 8.788-7.37c.365-.306.634-.7.777-1.137a1.996 1.996 0 0 0 .004-1.272 1.996 1.996 0 0 0-.273-.618 1.99 1.99 0 0 0-.454-.589Z' />
                        </svg>
                        Open in App
                    </a>
                    <a
                        href={playStoreLink}
                        className='w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2'
                    >
                        <svg
                            className='w-5 h-5'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                        >
                            <path d='M17.525 9H14V5.5C14 4.12 12.88 3 11.5 3c-1.38 0-2.5 1.12-2.5 2.5V9H5.475c-.85 0-1.48 1.09-.94 1.74l6.025 7.23c.36.43 1.03.43 1.39 0l6.025-7.23c.54-.65-.09-1.74-.94-1.74zM12 16.5L7.5 11h9L12 16.5z' />
                            <path d='M5 20h14v2H5z' />
                        </svg>
                        Download App
                    </a>
                </div>

                <p className='mt-8 text-xs text-gray-400 dark:text-gray-500'>
                    Compatible with Android devices. iOS coming soon.
                </p>
            </div>
        </main>
    );
}
