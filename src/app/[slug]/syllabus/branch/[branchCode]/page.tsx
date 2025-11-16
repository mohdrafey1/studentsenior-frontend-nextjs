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
        const res = await fetch(url, { next: { revalidate: 300 } });
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
        <main className='min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-2xl p-4 sm:p-8 mb-0'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <GraduationCap className='w-6 h-6' />
                            <h1 className='text-2xl sm:text-3xl font-bold'>
                                {branchName} Branch
                            </h1>
                        </div>
                        <p className='text-blue-50 text-sm sm:text-base'>
                            Total {subjectCount} subject
                        </p>
                    </div>

                    <div className='text-white mt-4 sm:mt-0 flex items-center gap-2'>
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
                <div className='bg-white dark:bg-gray-800 rounded-b-2xl overflow-hidden'>
                    {/* Semester Tabs */}
                    {syllabusList.length > 0 && (
                        <div className='border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6'>
                            <SemesterTabs
                                semesters={allSemesters}
                                slug={slug}
                                branchCode={branchCode}
                            />
                        </div>
                    )}

                    {noSyllabusAvailable ? (
                        <div className='flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 p-8'>
                            <div className='w-20 h-20 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mb-6'>
                                <BookMarked className='w-10 h-10 text-sky-600 dark:text-sky-400' />
                            </div>
                            <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3'>
                                {selectedSemester
                                    ? `No Syllabus for Semester ${selectedSemester}`
                                    : 'No Syllabus Available'}
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 text-center max-w-md mb-4'>
                                {selectedSemester
                                    ? `Syllabus for Semester ${selectedSemester} is not available right now.`
                                    : 'Syllabus documents for this branch are not available at the moment.'}
                            </p>
                        </div>
                    ) : (
                        <div className='p-6 sm:p-8 space-y-8'>
                            {sortedSemesters.map((semester) => (
                                <section
                                    id={`semester-${semester}`}
                                    key={semester}
                                    className='rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden '
                                >
                                    <div className='bg-gradient-to-r from-sky-500 to-blue-600 p-4 sm:p-6'>
                                        <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2'>
                                            <FileText className='w-5 h-5' />
                                            Semester {semester}
                                        </h2>
                                        <p className='text-blue-100 text-sm mt-1'>
                                            {groupedBySemester[semester].length}{' '}
                                            subject
                                            {groupedBySemester[semester]
                                                .length > 1
                                                ? 's'
                                                : ''}{' '}
                                        </p>
                                    </div>

                                    <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                                        {groupedBySemester[semester].map(
                                            (syllabus, index) => (
                                                <div
                                                    key={syllabus._id}
                                                    className='p-6 sm:p-8 bg-white dark:bg-gray-800'
                                                >
                                                    <div className='flex items-start gap-4 mb-6'>
                                                        <div className='h-12 w-12 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center'>
                                                            <BookOpen className='w-6 h-6 text-sky-600 dark:text-sky-400' />
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
                                                                {
                                                                    syllabus
                                                                        .subject
                                                                        ?.subjectCode
                                                                }{' '}
                                                                —{' '}
                                                                {
                                                                    syllabus
                                                                        .subject
                                                                        ?.subjectName
                                                                }
                                                            </h3>
                                                            <div className='flex flex-wrap gap-2 mt-2'>
                                                                <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium'>
                                                                    {
                                                                        syllabus
                                                                            .units
                                                                            ?.length
                                                                    }{' '}
                                                                    Units
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {syllabus.description && (
                                                        <div className='mb-6 p-4 bg-sky-50 dark:bg-gray-700/50 rounded-lg'>
                                                            <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                                                Course
                                                                Description
                                                            </h4>
                                                            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap'>
                                                                {
                                                                    syllabus.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Units */}
                                                    {syllabus.units?.length >
                                                        0 && (
                                                        <div className='space-y-4'>
                                                            {/* Desktop Table */}
                                                            <div className='hidden lg:block overflow-x-auto'>
                                                                <table className='w-full border-collapse border border-gray-300 dark:border-gray-600'>
                                                                    <thead>
                                                                        <tr className='bg-gradient-to-r from-sky-600 to-blue-600 text-white'>
                                                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold w-24'>
                                                                                Unit
                                                                                No.
                                                                            </th>
                                                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold w-1/3'>
                                                                                Title
                                                                                of
                                                                                the
                                                                                Unit
                                                                            </th>
                                                                            <th className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold'>
                                                                                Content
                                                                                of
                                                                                Unit
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {syllabus.units.map(
                                                                            (
                                                                                unit,
                                                                                i,
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        unit.unitNumber
                                                                                    }
                                                                                    className={
                                                                                        i %
                                                                                            2 ===
                                                                                        0
                                                                                            ? 'bg-white dark:bg-gray-800'
                                                                                            : 'bg-sky-50 dark:bg-gray-700/50'
                                                                                    }
                                                                                >
                                                                                    <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-sky-700 dark:text-sky-400 align-top'>
                                                                                        {
                                                                                            unit.unitNumber
                                                                                        }
                                                                                    </td>
                                                                                    <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white align-top'>
                                                                                        {
                                                                                            unit.title
                                                                                        }
                                                                                    </td>
                                                                                    <td className='border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300 align-top leading-relaxed'>
                                                                                        {
                                                                                            unit.content
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            ),
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Mobile Cards */}
                                                            <div className='lg:hidden space-y-4'>
                                                                {syllabus.units.map(
                                                                    (
                                                                        unit,
                                                                        i,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                unit.unitNumber
                                                                            }
                                                                            className={`rounded-lg border-2 overflow-hidden ${
                                                                                i %
                                                                                    2 ===
                                                                                0
                                                                                    ? 'border-sky-200 dark:border-gray-600'
                                                                                    : 'border-blue-200 dark:border-gray-600'
                                                                            }`}
                                                                        >
                                                                            <div
                                                                                className={`px-4 py-3 font-semibold flex items-center gap-3 ${
                                                                                    i %
                                                                                        2 ===
                                                                                    0
                                                                                        ? 'bg-sky-100 dark:bg-gray-700 text-sky-700 dark:text-sky-400'
                                                                                        : 'bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400'
                                                                                }`}
                                                                            >
                                                                                <span className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-sm'>
                                                                                    {
                                                                                        unit.unitNumber
                                                                                    }
                                                                                </span>
                                                                                <span className='flex-1 text-gray-900 dark:text-white'>
                                                                                    {
                                                                                        unit.title
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className='p-4 bg-white dark:bg-gray-800'>
                                                                                <p className='text-gray-700 dark:text-gray-300 leading-relaxed text-sm'>
                                                                                    {
                                                                                        unit.content
                                                                                    }
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
                                                        <div className='mt-6 p-4 bg-sky-50 dark:bg-gray-700/50 rounded-lg'>
                                                            <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2'>
                                                                <FileText className='w-4 h-4 text-sky-600' />
                                                                Reference Books
                                                            </h4>
                                                            <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
                                                                {
                                                                    syllabus.referenceBooks
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Divider */}
                                                    {index <
                                                        groupedBySemester[
                                                            semester
                                                        ].length -
                                                            1 && (
                                                        <div className='mt-8 pt-8 border-t border-gray-300 dark:border-gray-600'></div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>

                {/* Download Section */}
                <div className='mt-6 pt-6 w-fit border-t border-sky-200 dark:border-gray-600 text-center mx-auto'>
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

                {/* Footer */}
                <div className='bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 text-center border-t border-sky-200 dark:border-gray-600 rounded-b-2xl mt-6'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Powered by{' '}
                        <span className='font-semibold text-sky-600 dark:text-sky-400'>
                            Student Senior
                        </span>
                    </p>
                </div>
            </div>
        </main>
    );
}
