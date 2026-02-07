import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps, IPagination } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import QuickNotesClient from './QuickNotesClient';

interface IQuickNote {
    _id: string;
    unitNumber: number;
    title: string;
    slug: string;
    lastUpdated: string;
    subject: {
        subjectName: string;
        subjectCode: string;
        semester: number;
        branch: {
            branchCode: string;
            course: {
                courseCode: string;
            };
        };
    };
}

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Quick Notes - ${capitalizeWords(slug)}`,
        description: 'Concise revision notes for last-minute exam preparation.',
    };
}

export default async function QuickNotesPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let quicknotes: IQuickNote[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.quickNotes.getQuickNotesByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { next: { revalidate: 60 } });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        quicknotes = data?.data?.quicknotes || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error('Error fetching quick notes:', error);
    }

    return (
        <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='text-center mb-8'>
                <h1 className='text-2xl sm:text-4xl font-fugaz font-bold text-gray-800 dark:text-white mb-3'>
                    Quick Notes - {capitalizeWords(collegeName)}
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                    &quot;Concise revision notes for last-minute exam
                    preparation.&quot;
                </p>
            </header>
            <QuickNotesClient
                initialQuickNotes={quicknotes}
                initialPagination={
                    pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                    }
                }
                collegeName={collegeName}
            />
        </main>
    );
}
