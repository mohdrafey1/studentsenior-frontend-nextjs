import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps, IPagination, INote } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import NotesClient from './NotesClient';

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Notes - ${capitalizeWords(slug)}`,
        description: 'Share and access notes from your peers.',
    };
}

export default async function NotesPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let notes: INote[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.notes.getNotesByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        notes = data?.data?.notes || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error('Error fetching notes:', error);
    }

    return (
        <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='text-center mb-8'>
                <h1 className='text-2xl sm:text-4xl font-fugaz font-bold text-gray-800 dark:text-white mb-3'>
                    Notes - {capitalizeWords(collegeName)}
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                    &quot;Share and access notes from your peers.&quot;
                </p>
            </header>
            <NotesClient
                initialNotes={notes}
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
