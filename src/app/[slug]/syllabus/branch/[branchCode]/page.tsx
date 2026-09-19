import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { api } from '@/config/apiUrls';
import {
    GraduationCap,
    Eye,
    BookOpen,
    FileText,
    BookMarked,
} from 'lucide-react';
import DownloadAllPdfButton from './DownloadAllPdfButton';
import DownloadSemesterPdfButton from './DownloadSemesterPdfButton';
import SemesterTabs from './SemesterTabs';

interface BranchSyllabusProps {
    params: Promise<{
        slug: string;
        branchCode: string;
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
    searchParams,
}: BranchSyllabusProps): Promise<Metadata> {
    const { slug, branchCode } = await params;
    const resolvedSearchParams = await searchParams;
    const semester = resolvedSearchParams?.semester;
    const semesterText = semester ? ` - Semester ${semester}` : '';

    return {
        title: `${branchCode.toUpperCase()} Syllabus${semesterText} - ${capitalizeWords(slug)}`,
        description: `${semester ? `Semester ${semester} syllabus` : 'Complete syllabus'} for ${branchCode.toUpperCase()} branch at ${capitalizeWords(slug)}`,
    };
}

export default async function BranchSyllabusPage({
    params,
    searchParams,
}: BranchSyllabusProps) {
    const { slug, branchCode } = await params;
    const resolvedSearchParams = await searchParams;
    const selectedSemester = resolvedSearchParams?.semester
        ? parseInt(resolvedSearchParams.semester as string)
        : null;

    let syllabusList: ISyllabus[] = [];
    let subjectCount = 0;
    const branchName = branchCode.toUpperCase();

    try {
        const url = api.syllabus.getSyllabusByBranch(slug, branchCode);
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();

        if (data?.data) {
            syllabusList = data.data.syllabus || data.data || [];
            subjectCount = data.data.subjectCount || 0;
        }
    } catch (error) {
        console.error('Error fetching syllabus:', error);
    }

    const filteredSyllabus = selectedSemester
        ? syllabusList.filter((s) => s.semester === selectedSemester)
        : syllabusList;

    const groupedBySemester = filteredSyllabus.reduce(
        (acc, syllabus) => {
            const sem = syllabus.semester;
            if (!acc[sem]) acc[sem] = [];
            acc[sem].push(syllabus);
            return acc;
        },
        {} as Record<number, ISyllabus[]>,
    );

    const sortedSemesters = Object.keys(groupedBySemester)
        .map(Number)
        .sort((a, b) => a - b);

    const allSemesters = Array.from(
        new Set(syllabusList.map((s) => s.semester)),
    ).sort((a, b) => a - b);

    const noSyllabusAvailable =
        !filteredSyllabus || filteredSyllabus.length === 0;

    return (
        <main className='min-h-screen bg-[#f6f5f4] dark:bg-[#191919] py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#e6e6e6] dark:border-[#2f2f2f] pb-6 mb-6 gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-3'>
                            <GraduationCap className='w-7 h-7 text-[#101828] dark:text-[#ededed]' />
                            <h1 className='text-3xl sm:text-4xl font-bold text-[#101828] dark:text-[#ededed] tracking-tight'>
                                {branchName} Branch
                            </h1>
                        </div>
                        <p className='text-sm sm:text-base font-medium text-[#615d59] dark:text-[#a09e9a]'>
                            Total {subjectCount} subject{subjectCount !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className='text-[#615d59] dark:text-[#a09e9a] mt-4 sm:mt-0 flex items-center gap-2 bg-white dark:bg-[#202020] px-4 py-2 rounded-xl border border-[#e6e6e6] dark:border-[#383838] shadow-[0_2px_8px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.1)] shrink-0'>
                        <Eye className='w-4 h-4' />
                        <span className='text-sm font-medium'>
                            {filteredSyllabus.reduce(
                                (sum, s) => sum + (s.viewCount || 0),
                                0,
                            )}{' '}
                            total views
                        </span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className='bg-white dark:bg-[#202020] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden'>
                    {/* Semester Tabs */}
                    {syllabusList.length > 0 && (
                        <div className='border-b border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-6 bg-[#fcfbf9] dark:bg-[#191919]'>
                            <SemesterTabs
                                semesters={allSemesters}
                                slug={slug}
                                branchCode={branchCode}
                            />
                        </div>
                    )}

                    {noSyllabusAvailable ? (
                        <div className='flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#202020] p-8 border-2 border-dashed border-[#e6e6e6] dark:border-[#383838] m-6 rounded-2xl'>
                            <div className='w-16 h-16 bg-[#fcfbf9] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center mb-6 shadow-sm'>
                                <BookMarked className='w-8 h-8 text-[#a39e98] dark:text-[#787672]' />
                            </div>
                            <h3 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] mb-2 text-center'>
                                {selectedSemester
                                    ? `No Syllabus for Semester ${selectedSemester}`
                                    : 'No Syllabus Available'}
                            </h3>
                            <p className='text-[#615d59] dark:text-[#a09e9a] text-center max-w-md'>
                                {selectedSemester
                                    ? `Syllabus for Semester ${selectedSemester} is not available right now.`
                                    : 'Syllabus documents for this branch are not available at the moment.'}
                            </p>
                        </div>
                    ) : (
                        <div className='p-6 sm:p-8 space-y-12'>
                            {sortedSemesters.map((semester) => (
                                <section
                                    id={`semester-${semester}`}
                                    key={semester}
                                    className='rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden'
                                >
                                    <div className='bg-[#f6f5f4] dark:bg-[#191919] p-5 sm:p-6 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                        <h2 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] flex items-center gap-3'>
                                            <FileText className='w-6 h-6 text-[#0075de]' />
                                            Semester {semester}
                                        </h2>
                                        <p className='text-[#615d59] dark:text-[#a09e9a] text-sm font-medium mt-1.5 ml-9'>
                                            {groupedBySemester[semester].length} subject{groupedBySemester[semester].length > 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className='divide-y divide-[#e6e6e6] dark:divide-[#2f2f2f]'>
                                        {groupedBySemester[semester].map(
                                            (syllabus, index) => (
                                                <div
                                                    key={syllabus._id}
                                                    className='p-6 sm:p-8 bg-white dark:bg-[#202020]'
                                                >
                                                    <div className='flex items-start gap-4 mb-6'>
                                                        <div className='h-12 w-12 rounded-xl bg-[#fcfbf9] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#383838] flex items-center justify-center shrink-0 shadow-sm'>
                                                            <BookOpen className='w-6 h-6 text-[#101828] dark:text-[#ededed]' />
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h3 className='text-xl sm:text-2xl font-bold text-[#101828] dark:text-[#ededed] leading-tight mb-2'>
                                                                {syllabus.subject?.subjectCode} — {syllabus.subject?.subjectName}
                                                            </h3>
                                                            <div className='flex flex-wrap gap-2 mt-2'>
                                                                <span className='px-3 py-1 bg-[#f6f5f4] dark:bg-[#2a2a2a] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838] rounded-full text-xs font-semibold'>
                                                                    {syllabus.units?.length} Units
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {syllabus.description && (
                                                        <div className='mb-6'>
                                                            <h4 className='text-sm font-bold text-[#101828] dark:text-[#ededed] mb-2 uppercase tracking-wider'>
                                                                Course Description
                                                            </h4>
                                                            <p className='text-[#31302e] dark:text-[#d1d0ce] text-[15px] leading-relaxed whitespace-pre-wrap'>
                                                                {syllabus.description}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Units */}
                                                    {syllabus.units?.length > 0 && (
                                                        <div className='space-y-4'>
                                                            {/* Desktop Table */}
                                                            <div className='hidden lg:block overflow-x-auto rounded-xl border border-[#e6e6e6] dark:border-[#383838] mt-6'>
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

                                                            {/* Mobile Cards */}
                                                            <div className='lg:hidden space-y-4 mt-6'>
                                                                {syllabus.units.map(
                                                                    (unit) => (
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
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reference Books */}
                                                    {syllabus.referenceBooks && (
                                                        <div className='mt-8 pt-8 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                                            <h4 className='text-sm font-bold text-[#101828] dark:text-[#ededed] mb-3 flex items-center gap-2 uppercase tracking-wider'>
                                                                <FileText className='w-4 h-4 text-[#8c8883]' />
                                                                Reference Books
                                                            </h4>
                                                            <p className='text-[15px] text-[#31302e] dark:text-[#d1d0ce] leading-relaxed whitespace-pre-wrap'>
                                                                {syllabus.referenceBooks}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className='bg-[#f6f5f4] dark:bg-[#191919] px-6 py-5 text-center border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                        <p className='text-sm text-[#615d59] dark:text-[#a09e9a]'>
                            Powered by{' '}
                            <span className='font-semibold text-[#0075de] dark:text-[#62aef0]'>
                                Student Senior
                            </span>
                        </p>
                    </div>
                </div>

                {/* Download Section */}
                <div className='mt-8 text-center'>
                    {selectedSemester ? (
                        <DownloadSemesterPdfButton
                            syllabusList={filteredSyllabus}
                            branchName={branchName}
                            semester={selectedSemester}
                        />
                    ) : (
                        <DownloadAllPdfButton
                            syllabusList={syllabusList}
                            branchName={branchName}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
