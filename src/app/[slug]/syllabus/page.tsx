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
        <main className='min-h-screen bg-white dark:bg-[#191919]'>
            {/* Hero Section */}
            <div className='relative bg-[#f6f5f4] dark:bg-[#202020] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden'>
                {/* Mesh/Grid Background Pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(#d2d2d2 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
                
                <div className='relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
                    <div className='text-center max-w-3xl mx-auto'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101828] dark:text-[#ededed] tracking-tight mb-4'>
                            Course Syllabus
                        </h1>
                        <p className='text-lg sm:text-xl text-[#615d59] dark:text-[#a09e9a] leading-relaxed'>
                            Complete curriculum structure, objectives, and course details for {capitalizeWords(collegeName)}
                        </p>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-6'>
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
            </div>
        </main>
    );
}
