import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { api } from '@/config/apiUrls';
import {
    GraduationCap,
    Eye,
    BookOpen,
    FileText,
    ChevronDown,
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
        // Fetch all syllabus for this branch
        const url = api.syllabus.getSyllabusByBranch(slug, branchCode);
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log(data);

        // Handle new response structure
        if (data?.data) {
            syllabusList = data.data.syllabus || data.data || [];
            subjectCount = data.data.subjectCount || 0;
        }
    } catch (error) {
        console.error('Error fetching syllabus:', error);
    }

    // Filter by selected semester if any
    const filteredSyllabus = selectedSemester
        ? syllabusList.filter((s) => s.semester === selectedSemester)
        : syllabusList;

    // Group syllabus by semester
    const groupedBySemester = filteredSyllabus.reduce(
        (acc, syllabus) => {
            const sem = syllabus.semester;
            if (!acc[sem]) {
                acc[sem] = [];
            }
            acc[sem].push(syllabus);
            return acc;
        },
        {} as Record<number, ISyllabus[]>,
    );

    const sortedSemesters = Object.keys(groupedBySemester)
        .map(Number)
        .sort((a, b) => a - b);

    // Get all available semesters from full list (for tabs)
    const allSemesters = Array.from(
        new Set(syllabusList.map((s) => s.semester)),
    ).sort((a, b) => a - b);

    // Check if no syllabus available
    const noSyllabusAvailable = !filteredSyllabus || filteredSyllabus.length === 0;

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
                                    Complete Branch Syllabus
                                </div>
                                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3'>
                                    {branchName}
                                </h1>
                                <p className='text-lg sm:text-xl text-blue-50 mb-4 sm:mb-6'>
                                    {capitalizeWords(slug)} - All Subjects
                                </p>

                                {/* Info Pills */}
                                <div className='flex flex-wrap gap-3 sm:gap-4'>
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                                        <BookOpen className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                            {filteredSyllabus.length} Subject{filteredSyllabus.length !== 1 ? 's' : ''}
                                            {selectedSemester && ` (Sem ${selectedSemester})`}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
                                        <FileText className='w-4 h-4' />
                                        <span className='text-sm font-medium'>
                                            {selectedSemester ? `Semester ${selectedSemester}` : `${allSemesters.length} Semesters`}
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
                                    {filteredSyllabus.reduce(
                                        (sum, s) => sum + (s.viewCount || 0),
                                        0,
                                    )}
                                </span>
                                <span className='hidden sm:inline'>
                                    {selectedSemester ? 'semester views' : 'total views'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semester Tabs */}
                {syllabusList.length > 0 && (
                    <SemesterTabs
                        semesters={allSemesters}
                        slug={slug}
                        branchCode={branchCode}
                    />
                )}

                {noSyllabusAvailable ? (
                    // Empty State
                    <div className='flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8'>
                        <div className='w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6'>
                            <BookMarked className='w-10 h-10 text-purple-600 dark:text-purple-400' />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3'>
                            {selectedSemester 
                                ? `No Syllabus for Semester ${selectedSemester}`
                                : 'Currently No Syllabus Available'}
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 text-center max-w-md mb-4'>
                            {selectedSemester
                                ? `Syllabus documents for Semester ${selectedSemester} are not available. Try selecting a different semester.`
                                : 'Syllabus documents for this branch are not available at the moment. Please check back later.'}
                        </p>
                        <div className='flex flex-wrap gap-2 justify-center text-sm text-gray-500 dark:text-gray-400 mb-4'>
                            <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full'>
                                {branchName}
                            </span>
                            <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full'>
                                {branchCode}
                            </span>
                            {subjectCount > 0 && !selectedSemester && (
                                <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium'>
                                    {subjectCount} Subject
                                    {subjectCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8'>
                        {/* Main Content */}
                        <div className='lg:col-span-3 space-y-6'>
                            {/* Semester-wise Syllabus */}
                            {sortedSemesters.map((semester) => (
                                <div
                                    key={semester}
                                    className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'
                                >
                                    {/* Semester Header */}
                                    <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6'>
                                        <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2'>
                                            <FileText className='w-6 h-6' />
                                            Semester {semester}
                                        </h2>
                                        <p className='text-indigo-100 text-sm mt-1'>
                                            {groupedBySemester[semester].length}{' '}
                                            subject
                                            {groupedBySemester[semester]
                                                .length > 1
                                                ? 's'
                                                : ''}
                                        </p>
                                    </div>

                                    {/* Subjects in this semester */}
                                    <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                                        {groupedBySemester[semester].map(
                                            (syllabus, index) => (
                                                <div
                                                    key={syllabus._id}
                                                    className='p-6 sm:p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all'
                                                >
                                                    {/* Subject Header */}
                                                    <div className='flex items-start gap-4 mb-6'>
                                                        <div className='flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                                                            <BookOpen className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                                                                {syllabus
                                                                    .subject
                                                                    ?.subjectCode ||
                                                                    'N/A'}
                                                            </h3>
                                                            <p className='text-lg text-gray-700 dark:text-gray-300 mb-3'>
                                                                {syllabus
                                                                    .subject
                                                                    ?.subjectName ||
                                                                    'Subject name not available'}
                                                            </p>
                                                            <div className='flex flex-wrap gap-2'>
                                                                <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium'>
                                                                    Year{' '}
                                                                    {
                                                                        syllabus.year
                                                                    }
                                                                </span>
                                                                <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium'>
                                                                    {syllabus
                                                                        .units
                                                                        ?.length ||
                                                                        0}{' '}
                                                                    Units
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    {syllabus.description && (
                                                        <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
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
                                                            <h4 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                                                <ChevronDown className='w-5 h-5 text-gray-500' />
                                                                Course Content
                                                            </h4>
                                                            <div className='space-y-4'>
                                                                {syllabus.units.map(
                                                                    (unit) => (
                                                                        <div
                                                                            key={
                                                                                unit.unitNumber
                                                                            }
                                                                            className='group relative'
                                                                        >
                                                                            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full'></div>
                                                                            <div className='pl-6'>
                                                                                <div className='flex items-start gap-3 mb-2'>
                                                                                    <div className='flex-shrink-0 h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm'>
                                                                                        {
                                                                                            unit.unitNumber
                                                                                        }
                                                                                    </div>
                                                                                    <h5 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1'>
                                                                                        {
                                                                                            unit.title
                                                                                        }
                                                                                    </h5>
                                                                                </div>
                                                                                <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
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
                                                        <div className='mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800'>
                                                            <h4 className='text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2'>
                                                                <FileText className='w-4 h-4' />
                                                                Reference Books
                                                            </h4>
                                                            <p className='text-sm text-purple-800 dark:text-purple-200 leading-relaxed whitespace-pre-wrap'>
                                                                {
                                                                    syllabus.referenceBooks
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Divider between subjects within same semester */}
                                                    {index <
                                                        groupedBySemester[
                                                            semester
                                                        ].length -
                                                            1 && (
                                                        <div className='mt-8 pt-8 border-t-2 border-dashed border-gray-300 dark:border-gray-600'></div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className='lg:col-span-1 space-y-6'>
                            {/* Download Card */}
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6'>
                                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                                    Download Options
                                </h3>
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

                            {/* Quick Navigation - Only show when viewing single semester */}
                            {!selectedSemester && sortedSemesters.length > 1 && (
                                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
                                        Quick Navigation
                                    </h3>
                                    <div className='space-y-2'>
                                        {sortedSemesters.map((sem) => (
                                            <a
                                                key={sem}
                                                href={`#semester-${sem}`}
                                                className='block px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                                            >
                                                Semester {sem} (
                                                {groupedBySemester[sem].length}{' '}
                                                subject
                                                {groupedBySemester[sem].length > 1
                                                    ? 's'
                                                    : ''}
                                                )
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
