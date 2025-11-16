import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { api } from '@/config/apiUrls';
import { ISyllabus, CollegePageProps, IPagination } from '@/utils/interface';
import SyllabusClient from './SyllabusClient';

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Syllabus - ${capitalizeWords(slug)}`,
        description:
            'Access complete course syllabus, curriculum structure, and subject details.',
    };
}

export default async function SyllabusPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let syllabus: ISyllabus[] = [];
    let pagination: IPagination | null = null;
    let error: string | null = null;

    try {
        const url = api.syllabus.getSyllabusByCollege(collegeName);
        // ✅ Add caching with revalidation
        const res = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        syllabus = data?.data?.syllabus || [];
        pagination = data?.data?.pagination || null;
    } catch (err) {
        console.error('Error fetching syllabus:', err);
        error = err instanceof Error ? err.message : 'Failed to load syllabus';
    }

    return (
        <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='text-center mb-8'>
                <h1 className='text-2xl sm:text-4xl font-fugaz font-bold text-gray-800 dark:text-white mb-3'>
                    Course Syllabus - {capitalizeWords(collegeName)}
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                    &quot;Complete curriculum structure, objectives, and course
                    details for all subjects&quot;
                </p>
            </header>
            <SyllabusClient
                initialSyllabus={syllabus}
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
                initialError={error}
            />
        </main>
    );
}
