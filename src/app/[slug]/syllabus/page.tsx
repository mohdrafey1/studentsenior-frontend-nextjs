import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { api } from '@/config/apiUrls';
import {
    CollegeData,
    CollegePageProps,
    IPagination,
    ISubject,
} from '@/utils/interface';
import SyllabusClient from './SyllabusClient';

interface ISyllabus {
    _id: string;
    slug: string;
    year: number;
    semester: number;
    subject: ISubject;
    college: CollegeData;
    units: {
        unitNumber: number;
        title: string;
        content: string;
    }[];
    referenceBooks: string;
    description: string;
    isActive: boolean;
    viewCount: number;
}

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

    try {
        const url = api.syllabus.getSyllabusByCollege(collegeName);
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        syllabus = data?.data?.syllabus || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error('Error fetching syllabus:', error);
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
            />
        </main>
    );
}
