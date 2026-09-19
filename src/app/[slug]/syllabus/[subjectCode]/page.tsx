import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/config/apiUrls';
import { Eye, FileText } from 'lucide-react';
import DownloadPdfButton from './DownloadPdfButton';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

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
        const res = await fetch(url, { next: { revalidate: 86400 } });

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
        const res = await fetch(url, { next: { revalidate: 300 } });

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
        <>
            <DetailPageNavbar />
            <main className='min-h-screen bg-[#f6f5f4] dark:bg-[#191919] py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-5xl mx-auto'>
                    {/* Header Section - Notion Style */}
                    <div className='flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-6 mb-6 gap-4'>
                        <div>
                            <h1 className='text-3xl sm:text-4xl font-bold text-[#101828] dark:text-[#ededed] tracking-tight mb-3'>
                                {syllabus.subject?.subjectName ||
                                    'Subject name not available'}
                            </h1>
                            <span className='text-sm sm:text-base font-semibold text-[#615d59] dark:text-[#a09e9a] bg-white dark:bg-[#202020] px-3 py-1.5 rounded-full border border-[#e6e6e6] dark:border-[#383838] inline-block shadow-sm'>
                                {syllabus.subject?.subjectCode || 'N/A'}
                            </span>
                        </div>

                        <div className='text-[#615d59] dark:text-[#a09e9a] hidden sm:flex items-center gap-2 bg-white dark:bg-[#202020] px-4 py-2 rounded-xl border border-[#e6e6e6] dark:border-[#383838] shadow-[0_2px_8px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.1)] shrink-0'>
                            <Eye className='w-4 h-4' />
                            <span className='text-sm font-medium'>
                                {syllabus.viewCount || 0} views
                            </span>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className='bg-white dark:bg-[#202020] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden'>
                        {/* Subject Info Section */}
                        <div className='bg-[#fcfbf9] dark:bg-[#191919] p-6 sm:p-8 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                <div>
                                    <p className='text-xs font-bold uppercase tracking-wider text-[#8c8883] dark:text-[#787672] mb-1.5'>
                                        Year / Sem
                                    </p>
                                    <p className='text-base font-semibold text-[#101828] dark:text-[#ededed]'>
                                        {syllabus.year} / {syllabus.semester}
                                    </p>
                                </div>

                                <div>
                                    <p className='text-xs font-bold uppercase tracking-wider text-[#8c8883] dark:text-[#787672] mb-1.5'>
                                        Branch
                                    </p>
                                    <p className='text-sm font-semibold text-[#101828] dark:text-[#ededed]'>
                                        {syllabus.subject?.branch?.branchName ||
                                            'na'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        {syllabus.description && (
                            <div className='p-6 sm:p-8 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <h2 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] mb-4'>
                                    Course Description
                                </h2>
                                <p className='text-[15px] text-[#31302e] dark:text-[#d1d0ce] leading-relaxed whitespace-pre-wrap'>
                                    {syllabus.description}
                                </p>
                            </div>
                        )}

                        {/* Units Table Section - Notion Style Data Table */}
                        {syllabus.units?.length > 0 && (
                            <div className='p-6 sm:p-8 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <h2 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] mb-6'>
                                    Course Units
                                </h2>

                                {/* Desktop Table View */}
                                <div className='hidden lg:block overflow-x-auto rounded-xl border border-[#e6e6e6] dark:border-[#383838]'>
                                    <table className='w-full border-collapse'>
                                        <thead>
                                            <tr className='bg-[#f6f5f4] dark:bg-[#2a2a2a]'>
                                                <th className='border-b border-[#e6e6e6] dark:border-[#383838] px-5 py-3 text-left text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider w-24'>
                                                    Unit No.
                                                </th>
                                                <th className='border-b border-[#e6e6e6] dark:border-[#383838] px-5 py-3 text-left text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider w-1/3 border-l'>
                                                    Title of the Unit
                                                </th>
                                                <th className='border-b border-[#e6e6e6] dark:border-[#383838] px-5 py-3 text-left text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider border-l'>
                                                    Content of Unit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-[#e6e6e6] dark:divide-[#383838]'>
                                            {syllabus.units.map(
                                                (unit) => (
                                                    <tr
                                                        key={unit.unitNumber}
                                                        className='bg-white dark:bg-[#202020]'
                                                    >
                                                        <td className='px-5 py-4 text-[15px] font-semibold text-[#101828] dark:text-[#ededed] align-top'>
                                                            {unit.unitNumber}
                                                        </td>
                                                        <td className='px-5 py-4 text-[15px] font-medium text-[#101828] dark:text-[#ededed] align-top border-l border-[#e6e6e6] dark:border-[#383838]'>
                                                            {unit.title}
                                                        </td>
                                                        <td className='px-5 py-4 text-[15px] text-[#31302e] dark:text-[#d1d0ce] align-top leading-relaxed border-l border-[#e6e6e6] dark:border-[#383838]'>
                                                            {unit.content}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className='lg:hidden space-y-4'>
                                    {syllabus.units.map((unit) => (
                                        <div
                                            key={unit.unitNumber}
                                            className='rounded-xl border border-[#e6e6e6] dark:border-[#383838] bg-white dark:bg-[#202020] overflow-hidden'
                                        >
                                            <div className='px-4 py-3 border-b border-[#e6e6e6] dark:border-[#383838] bg-[#fcfbf9] dark:bg-[#191919] flex items-center gap-3'>
                                                <span className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#2a2a2a] border border-[#e6e6e6] dark:border-[#383838] text-sm font-semibold text-[#101828] dark:text-[#ededed] shadow-sm'>
                                                    {unit.unitNumber}
                                                </span>
                                                <span className='flex-1 font-semibold text-[#101828] dark:text-[#ededed]'>
                                                    {unit.title}
                                                </span>
                                            </div>
                                            <div className='p-4'>
                                                <p className='text-[#31302e] dark:text-[#d1d0ce] leading-relaxed text-[15px]'>
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
                            <div className='p-6 sm:p-8 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <h2 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] mb-4 flex items-center gap-2'>
                                    <FileText className='w-5 h-5 text-[#8c8883]' />
                                    Reference Books
                                </h2>
                                <p className='text-[15px] text-[#31302e] dark:text-[#d1d0ce] leading-relaxed whitespace-pre-wrap'>
                                    {syllabus.referenceBooks}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className='bg-[#f6f5f4] dark:bg-[#191919] px-6 py-5 text-center'>
                            <p className='text-sm text-[#615d59] dark:text-[#a09e9a]'>
                                Powered by{' '}
                                <span className='font-semibold text-[#0075de] dark:text-[#62aef0]'>
                                    Student Senior
                                </span>
                            </p>
                        </div>
                    </div>
                    {/* Download Button */}
                    <div className='mt-8 text-center'>
                        <DownloadPdfButton syllabus={syllabus} />
                    </div>
                </div>
            </main>
        </>
    );
}
