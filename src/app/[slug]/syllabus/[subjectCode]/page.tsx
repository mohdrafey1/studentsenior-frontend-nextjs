import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { GraduationCap, Eye, BookOpen, FileText } from 'lucide-react';
import DownloadPdfButton from './DownloadPdfButton';

interface SyllabusDetailProps {
    params: Promise<{
        slug: string;
        subjectCode: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ISyllabus {
    _id: string;
    slug: string;
    year: number;
    semester: number;
    units: {
        unitNumber: number;
        title: string;
        content: string;
    }[];
    referenceBooks: string;
    subject: {
        subjectName?: string;
        subjectCode?: string;
    };
    description?: string;
    viewCount: number;
    isActive: boolean;
}

export async function generateMetadata({
    params,
}: SyllabusDetailProps): Promise<Metadata> {
    const { slug, subjectCode } = await params;

    // Fetch syllabus to get actual subject info
    try {
        const url = api.syllabus.getSyllabusBySlug(subjectCode);
        const res = await fetch(url, { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            const syllabus = data?.data;
            const subjectName = syllabus?.subject?.subjectName || subjectCode;
            return {
                title: `${subjectName} - Syllabus - ${capitalizeWords(slug)}`,
                description:
                    syllabus?.description ||
                    'Complete course syllabus with curriculum details',
            };
        }
    } catch (error) {
        console.error('Error fetching metadata:', error);
    }

    return {
        title: `Syllabus - ${capitalizeWords(slug)}`,
        description: 'Complete course syllabus with curriculum details',
    };
}

export default async function SyllabusDetailPage({
    params,
}: SyllabusDetailProps) {
    const { subjectCode } = await params;

    let syllabus: ISyllabus | null = null;

    try {
        // subjectCode parameter is actually the syllabus slug
        const url = api.syllabus.getSyllabusBySlug(subjectCode);
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        syllabus = data?.data || null;
    } catch (error) {
        console.error('Error fetching syllabus:', error);
    }

    if (!syllabus) {
        notFound();
    }

    return (
        <main className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Card */}
                <div className='bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 overflow-hidden relative'>
                    {/* Decorative Background Pattern */}
                    <div className='absolute inset-0 opacity-10'>
                        <div className='absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2'></div>
                        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2'></div>
                    </div>

                    <div className='relative z-10'>
                        <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
                            <div className='flex-shrink-0'>
                                <div className='h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg'>
                                    <GraduationCap className='h-8 w-8 sm:h-10 sm:w-10' />
                                </div>
                            </div>
                            <div className='flex-1 w-full'>
                                <div className='inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3'>
                                    Course Syllabus
                                </div>
                                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3'>
                                    {syllabus.subject?.subjectCode || 'N/A'}
                                </h1>
                                <p className='text-lg sm:text-xl text-blue-50 mb-4 sm:mb-6'>
                                    {syllabus.subject?.subjectName ||
                                        'Subject name not available'}
                                </p>

                                {/* Info Pills */}
                                <div className='flex flex-wrap gap-3 sm:gap-4'>
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                                        <BookOpen className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                            Year {syllabus.year}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                                        <FileText className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                            Semester {syllabus.semester}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                                        <FileText className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                            {syllabus.units?.length || 0} Units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className='mt-6 sm:mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-4 sm:gap-6 text-sm'>
                            <div className='flex items-center gap-2 text-blue-100'>
                                <Eye className='w-4 h-4' />
                                <span className='font-medium'>
                                    {syllabus.viewCount || 0}
                                </span>
                                <span className='hidden sm:inline'>views</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Description */}
                        {syllabus.description && (
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all hover:shadow-xl'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                                        <FileText className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                        Course Description
                                    </h2>
                                </div>
                                <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
                                    {syllabus.description}
                                </p>
                            </div>
                        )}

                        {/* Units */}
                        {syllabus.units?.length > 0 && (
                            <div
                                id='syllabus-content'
                                className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all hover:shadow-xl'
                            >
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center'>
                                        <BookOpen className='w-5 h-5 text-green-600 dark:text-green-400' />
                                    </div>
                                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                        Course Content
                                    </h2>
                                </div>
                                <div className='space-y-6'>
                                    {syllabus.units.map((unit, index) => (
                                        <div
                                            key={unit.unitNumber}
                                            className='group relative'
                                        >
                                            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full group-hover:w-1.5 transition-all'></div>
                                            <div className='pl-6 sm:pl-8'>
                                                <div className='flex items-start gap-3 mb-3'>
                                                    <div className='flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm'>
                                                        {unit.unitNumber}
                                                    </div>
                                                    <h3 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex-1'>
                                                        {unit.title}
                                                    </h3>
                                                </div>
                                                <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
                                                    {unit.content}
                                                </p>
                                            </div>
                                            {index <
                                                syllabus.units.length - 1 && (
                                                <div className='mt-6 border-b border-gray-200 dark:border-gray-700'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Download Card */}
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6'>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                                Download Options
                            </h3>
                            <DownloadPdfButton syllabus={syllabus} />
                        </div>

                        {/* Reference Books */}
                        {syllabus.referenceBooks && (
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center'>
                                        <FileText className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                                    </div>
                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                        Reference Books
                                    </h3>
                                </div>
                                <div className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap'>
                                    {syllabus.referenceBooks}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
