import { UserDataState } from '@/redux/slices/userDataSlice';
import { formatDate } from '@/utils/formatting';
import Link from 'next/link';
import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ExternalLink,
    FileQuestion,
    Eye,
    Grid3X3,
    List,
    Calendar,
} from 'lucide-react';

interface PYQTabProps {
    pyqs: UserDataState['userPyqAdd'];
}

type SortOption = 'subject' | 'year' | 'createdAt' | 'college';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function PYQTab({ pyqs }: PYQTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedCollege, setSelectedCollege] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Get unique subjects, years, and colleges
    const subjects = Array.from(
        new Set(pyqs?.map((p) => p.subject.subjectName) || []),
    );
    const years = Array.from(
        new Set(pyqs?.map((p) => p.year.toString()) || []),
    ).sort((a, b) => parseInt(b) - parseInt(a));
    const colleges = Array.from(
        new Set(pyqs?.map((p) => p.college.name) || []),
    );

    // Filter and sort pyqs
    const filteredPYQs =
        pyqs
            ?.filter((pyq) => {
                const matchesSearch =
                    pyq.subject.subjectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    pyq.year.toString().includes(searchTerm) ||
                    pyq.college.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                const matchesSubject =
                    selectedSubject === 'all' ||
                    pyq.subject.subjectName === selectedSubject;
                const matchesYear =
                    selectedYear === 'all' ||
                    pyq.year.toString() === selectedYear;
                const matchesCollege =
                    selectedCollege === 'all' ||
                    pyq.college.name === selectedCollege;
                return (
                    matchesSearch &&
                    matchesSubject &&
                    matchesYear &&
                    matchesCollege
                );
            })
            .sort((a, b) => {
                let comparison = 0;

                switch (sortBy) {
                    case 'subject':
                        comparison = a.subject.subjectName.localeCompare(
                            b.subject.subjectName,
                        );
                        break;
                    case 'year':
                        comparison = parseInt(a.year) - parseInt(b.year);
                        break;
                    case 'createdAt':
                        comparison =
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime();
                        break;
                    case 'college':
                        comparison = a.college.name.localeCompare(
                            b.college.name,
                        );
                        break;
                }

                return sortOrder === 'asc' ? comparison : -comparison;
            }) || [];

    // Pagination
    const totalItems = filteredPYQs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPYQs = filteredPYQs.slice(startIndex, endIndex);

    // Reset page when filters change
    const handleFilterChange = (callback: () => void) => {
        callback();
        setCurrentPage(1);
    };

    const getSubjectColor = (subject: string) => {
        const colors = [
            'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        ];
        const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const getYearColor = (year: number) => {
        const currentYear = new Date().getFullYear();
        const yearsAgo = currentYear - year;

        if (yearsAgo <= 1)
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (yearsAgo <= 3)
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        if (yearsAgo <= 5)
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    const getCollegeInitials = (collegeName: string) => {
        return collegeName
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 3);
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
            {/* Header */}
            <div className='p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                        <div>
                            <h3 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                                <FileQuestion className='w-5 h-5 text-violet-500' />
                                Previous Year Questions
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                Showing {startIndex + 1}-
                                {Math.min(endIndex, totalItems)} of {totalItems}{' '}
                                PYQs
                            </p>
                        </div>

                        {/* View Mode Toggle */}
                        <div className='flex items-center gap-2'>
                            <div className='flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <Grid3X3 className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <List className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className='flex flex-col lg:flex-row gap-3'>
                        {/* Search */}
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search subjects, years, or colleges...'
                                value={searchTerm}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSearchTerm(e.target.value),
                                    )
                                }
                                className='w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                            />
                        </div>

                        {/* Subject Filter */}
                        <div className='flex items-center gap-2'>
                            <select
                                value={selectedSubject}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSelectedSubject(e.target.value),
                                    )
                                }
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                            >
                                <option value='all'>All Subjects</option>
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div className='flex items-center gap-2'>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSelectedYear(e.target.value),
                                    )
                                }
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                            >
                                <option value='all'>All Years</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* College Filter */}
                        <div className='flex items-center gap-2'>
                            <select
                                value={selectedCollege}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSelectedCollege(e.target.value),
                                    )
                                }
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                            >
                                <option value='all'>All Colleges</option>
                                {colleges.map((college) => (
                                    <option key={college} value={college}>
                                        {college}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className='flex items-center gap-2'>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] =
                                        e.target.value.split('-');
                                    setSortBy(field as SortOption);
                                    setSortOrder(order as SortOrder);
                                }}
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                            >
                                <option value='createdAt-desc'>
                                    Newest First
                                </option>
                                <option value='createdAt-asc'>
                                    Oldest First
                                </option>
                                <option value='year-desc'>Year (Latest)</option>
                                <option value='year-asc'>Year (Oldest)</option>
                                <option value='subject-asc'>Subject A-Z</option>
                                <option value='college-asc'>College A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* PYQs Content */}
            <div className='p-4 sm:p-6'>
                {currentPYQs.length > 0 ? (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6'>
                                {currentPYQs.map((pyq) => (
                                    <div
                                        key={pyq.id}
                                        className='group bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:shadow-violet-100 dark:hover:shadow-violet-900/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden'
                                    >
                                        {/* Card Body */}
                                        <div className='px-4 py-4'>
                                            <h4 className='font-bold text-gray-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-base leading-tight'>
                                                {pyq.subject.subjectName} -{' '}
                                                {pyq.year}
                                            </h4>

                                            <p className='text-gray-500 dark:text-gray-400 mb-3'>
                                                {pyq.examType}
                                            </p>

                                            {/* College Info */}
                                            <div className='flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg'>
                                                <div className='w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                                                    {getCollegeInitials(
                                                        pyq.submissionStatus,
                                                    )}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-200 truncate block'>
                                                        {pyq.submissionStatus}
                                                    </span>
                                                </div>
                                                {pyq.submissionStatus ===
                                                    'rejected' && (
                                                    <span className='text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full font-semibold'>
                                                        {pyq.rejectionReason ||
                                                            'Rejected'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Date */}
                                            <div className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded mb-4 flex items-center gap-1'>
                                                <Calendar className='w-3 h-3' />
                                                Added{' '}
                                                {formatDate(pyq.createdAt)}
                                            </div>

                                            {/* Action Button */}
                                            <Link
                                                href={`${pyq.college.slug}/pyqs/${pyq.slug}`}
                                                className='block'
                                            >
                                                <button className='w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02]'>
                                                    <Eye className='w-4 h-4' />
                                                    View PYQ
                                                    <ExternalLink className='w-3 h-3 opacity-75' />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className='space-y-4'>
                                {currentPYQs.map((pyq) => (
                                    <div
                                        key={pyq.id}
                                        className='group p-5 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:shadow-violet-50 dark:hover:shadow-violet-900/10 hover:border-violet-200 dark:hover:border-violet-600 transition-all duration-200'
                                    >
                                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-start gap-4'>
                                                    {/* College Avatar */}
                                                    <div className='w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0'>
                                                        {getCollegeInitials(
                                                            pyq.college.name,
                                                        )}
                                                    </div>

                                                    <div className='flex-1 min-w-0'>
                                                        <h4 className='font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-lg'>
                                                            {
                                                                pyq.subject
                                                                    .subjectName
                                                            }{' '}
                                                            - {pyq.year}
                                                        </h4>
                                                        <div className='flex flex-wrap items-center gap-3'>
                                                            <span
                                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getSubjectColor(
                                                                    pyq.subject
                                                                        .subjectName,
                                                                )}`}
                                                            >
                                                                {
                                                                    pyq.subject
                                                                        .subjectName
                                                                }
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-bold rounded-md ${getYearColor(
                                                                    parseInt(
                                                                        pyq.year,
                                                                    ),
                                                                )}`}
                                                            >
                                                                {pyq.year}
                                                            </span>
                                                            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
                                                                <span className='font-medium'>
                                                                    {
                                                                        pyq
                                                                            .college
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded'>
                                                                <Calendar className='w-3 h-3' />
                                                                {formatDate(
                                                                    pyq.createdAt,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center flex-shrink-0'>
                                                <Link
                                                    href={`${pyq.college.slug}/pyqs/${pyq.slug}`}
                                                >
                                                    <button className='bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md transform hover:scale-[1.02]'>
                                                        <Eye className='w-4 h-4' />
                                                        View PYQ
                                                        <ExternalLink className='w-3 h-3 opacity-75' />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className='text-center py-12'>
                        <div className='mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4'>
                            <FileQuestion className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2'>
                            {pyqs?.length === 0
                                ? 'No PYQs added yet'
                                : 'No PYQs match your search criteria'}
                        </p>
                        {searchTerm ||
                        selectedSubject !== 'all' ||
                        selectedYear !== 'all' ||
                        selectedCollege !== 'all' ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubject('all');
                                    setSelectedYear('all');
                                    setSelectedCollege('all');
                                    setCurrentPage(1);
                                }}
                                className='text-violet-600 dark:text-violet-400 text-sm hover:underline'
                            >
                                Clear filters
                            </button>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        {/* Items per page */}
                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                            <span>Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className='px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-violet-500'
                            >
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                            <span>per page</span>
                        </div>

                        {/* Pagination controls */}
                        <div className='flex items-center gap-1 sm:gap-2'>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='p-1 sm:p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                            >
                                <ChevronLeft className='w-4 h-4' />
                            </button>

                            <div className='flex gap-1'>
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (
                                            currentPage >=
                                            totalPages - 2
                                        ) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-violet-500 text-white'
                                                        : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    },
                                )}
                            </div>

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className='p-1 sm:p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors'
                            >
                                <ChevronRight className='w-4 h-4' />
                            </button>
                        </div>

                        <div className='text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
