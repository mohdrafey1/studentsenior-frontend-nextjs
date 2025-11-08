import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Eye } from 'lucide-react';
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
        branch?: {
            branchName?: string;
            branchCode?: string;
        };
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
        <main className='min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-5xl mx-auto'>
                {/* Header Section - PDF Style */}
                <div className='flex items-center justify-between bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-2xl shadow-xl p-4'>
                    <div>
                        <span className='text-sm sm:text-lg font-bold text-white'>
                            {syllabus.subject?.subjectName ||
                                'Subject name not available'}{' '}
                            - {syllabus.subject?.subjectCode || 'N/A'}
                        </span>
                    </div>

                    <div className='text-white hidden sm:flex items-center gap-2'>
                        <Eye className='w-4 h-4' />
                        <span className='text-sm font-medium'>
                            {syllabus.viewCount || 0} views
                        </span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className='bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl overflow-hidden'>
                    {/* Subject Info Section */}
                    <div className='bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-4 sm:p-8'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                    Year / Sem
                                </p>
                                <p className='text-base font-semibold text-gray-900 dark:text-white'>
                                    {syllabus.year} / {syllabus.semester}
                                </p>
                            </div>

                            <div>
                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                    Branch
                                </p>
                                <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                                    {syllabus.subject?.branch?.branchName ||
                                        'na'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    {syllabus.description && (
                        <div className='p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-1 h-8 bg-sky-500 rounded-full'></div>
                                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                    Course Description
                                </h2>
                            </div>
                            <div className='bg-sky-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6'>
                                <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
                                    {syllabus.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Units Table Section - PDF Style */}
                    {syllabus.units?.length > 0 && (
                        <div className='p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-1 h-8 bg-sky-500 rounded-full'></div>
                                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                    Course Units
                                </h2>
                            </div>

                            {/* Desktop Table View */}
                            <div className='hidden lg:block overflow-x-auto'>
                                <table className='w-full border-collapse border border-gray-300 dark:border-gray-600'>
                                    <thead>
                                        <tr className='bg-gradient-to-r from-sky-600 to-blue-600 text-white'>
                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold w-24'>
                                                Unit No.
                                            </th>
                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold w-1/3'>
                                                Title of the Unit
                                            </th>
                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold'>
                                                Content of Unit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {syllabus.units.map((unit, index) => (
                                            <tr
                                                key={unit.unitNumber}
                                                className={
                                                    index % 2 === 0
                                                        ? 'bg-white dark:bg-gray-800'
                                                        : 'bg-sky-50 dark:bg-gray-700/50'
                                                }
                                            >
                                                <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-sky-700 dark:text-sky-400 align-top'>
                                                    {unit.unitNumber}
                                                </td>
                                                <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white align-top'>
                                                    {unit.title}
                                                </td>
                                                <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 align-top leading-relaxed'>
                                                    {unit.content}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className='lg:hidden space-y-4'>
                                {syllabus.units.map((unit, index) => (
                                    <div
                                        key={unit.unitNumber}
                                        className={`rounded-lg border-2 overflow-hidden ${
                                            index % 2 === 0
                                                ? 'border-sky-200 dark:border-gray-600'
                                                : 'border-blue-200 dark:border-gray-600'
                                        }`}
                                    >
                                        <div
                                            className={`px-4 py-3 font-semibold flex items-center gap-3 ${
                                                index % 2 === 0
                                                    ? 'bg-sky-100 dark:bg-gray-700 text-sky-700 dark:text-sky-400'
                                                    : 'bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400'
                                            }`}
                                        >
                                            <span className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-sm'>
                                                {unit.unitNumber}
                                            </span>
                                            <span className='flex-1 text-gray-900 dark:text-white'>
                                                {unit.title}
                                            </span>
                                        </div>
                                        <div className='p-4 bg-white dark:bg-gray-800'>
                                            <p className='text-gray-700 dark:text-gray-300 leading-relaxed text-sm'>
                                                {unit.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reference Books Section */}
                    {syllabus.referenceBooks && (
                        <div className='p-6 sm:p-8'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-1 h-8 bg-sky-500 rounded-full'></div>
                                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                    Reference Books
                                </h2>
                            </div>
                            <div className='bg-sky-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6'>
                                <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base'>
                                    {syllabus.referenceBooks}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className='bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 text-center border-t border-sky-200 dark:border-gray-600'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Powered by{' '}
                            <span className='font-semibold text-sky-600 dark:text-sky-400'>
                                Student Senior
                            </span>
                        </p>
                    </div>
                </div>
                {/* Download Button */}
                <div className='mt-6 pt-6 w-fit border-t border-sky-200 dark:border-gray-600 text-center mx-auto'>
                    <DownloadPdfButton syllabus={syllabus} />
                </div>
            </div>
        </main>
    );
}
