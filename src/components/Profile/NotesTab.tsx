import { UserDataState } from '@/redux/slices/userDataSlice';
import { formatDate } from '@/utils/formatting';
import Link from 'next/link';
import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ExternalLink,
    Calendar,
    FileText,
    Eye,
    Grid3X3,
    List,
} from 'lucide-react';

interface NotesTabProps {
    notes: UserDataState['userNoteAdd'];
}

type SortOption = 'title' | 'subject' | 'createdAt' | 'college';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function NotesTab({ notes }: NotesTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [selectedCollege, setSelectedCollege] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Get unique subjects and colleges
    const subjects = Array.from(
        new Set(notes?.map((n) => n.subject.subjectName) || []),
    );
    const colleges = Array.from(
        new Set(notes?.map((n) => n.college.name) || []),
    );

    // Filter and sort notes
    const filteredNotes =
        notes
            ?.filter((note) => {
                const matchesSearch =
                    note.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    note.subject.subjectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    note.college.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                const matchesSubject =
                    selectedSubject === 'all' ||
                    note.subject.subjectName === selectedSubject;
                const matchesCollege =
                    selectedCollege === 'all' ||
                    note.college.name === selectedCollege;
                return matchesSearch && matchesSubject && matchesCollege;
            })
            .sort((a, b) => {
                let comparison = 0;

                switch (sortBy) {
                    case 'title':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'subject':
                        comparison = a.subject.subjectName.localeCompare(
                            b.subject.subjectName,
                        );
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
    const totalItems = filteredNotes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotes = filteredNotes.slice(startIndex, endIndex);

    // Reset page when filters change
    const handleFilterChange = (callback: () => void) => {
        callback();
        setCurrentPage(1);
    };

    const getSubjectColor = (subject: string) => {
        const colors = [
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
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
                                <FileText className='w-5 h-5 text-emerald-500' />
                                My Notes
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                Showing {startIndex + 1}-
                                {Math.min(endIndex, totalItems)} of {totalItems}{' '}
                                notes
                            </p>
                        </div>

                        {/* View Mode Toggle */}
                        <div className='flex items-center gap-2'>
                            <div className='flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <Grid3X3 className='w-4 h-4' />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <List className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className='flex flex-col sm:flex-row gap-3'>
                        {/* Search */}
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search notes, subjects, or colleges...'
                                value={searchTerm}
                                onChange={(e) =>
                                    handleFilterChange(() =>
                                        setSearchTerm(e.target.value),
                                    )
                                }
                                className='w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
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
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                            >
                                <option value='all'>All Subjects</option>
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
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
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
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
                                className='px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                            >
                                <option value='createdAt-desc'>
                                    Newest First
                                </option>
                                <option value='createdAt-asc'>
                                    Oldest First
                                </option>
                                <option value='title-asc'>Title A-Z</option>
                                <option value='title-desc'>Title Z-A</option>
                                <option value='subject-asc'>Subject A-Z</option>
                                <option value='college-asc'>College A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Content */}
            <div className='p-4 sm:p-6'>
                {currentNotes.length > 0 ? (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6'>
                                {currentNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className='group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden'
                                    >
                                        <div className='p-4 sm:p-5'>
                                            <div className='flex items-start justify-between mb-3'>
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full truncate ${getSubjectColor(
                                                        note.subject
                                                            .subjectName,
                                                    )}`}
                                                >
                                                    {note.subject.subjectName}
                                                </span>
                                                {/* <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(note.createdAt)}
                                                </div> */}
                                            </div>

                                            <h4 className='font-semibold truncate text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm sm:text-base'>
                                                {note.title}
                                            </h4>

                                            <div className='flex items-center gap-2 mb-4'>
                                                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
                                                    <div className='w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                                                        {getCollegeInitials(
                                                            note.submissionStatus,
                                                        )}
                                                    </div>
                                                    <span className='truncate'>
                                                        {note.submissionStatus ||
                                                            'Unknown'}
                                                    </span>
                                                    {note.rejectionReason && (
                                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                            (
                                                            {
                                                                note.rejectionReason
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Link
                                                href={`${note.college.slug}/notes/${note.slug}`}
                                                className='block'
                                            >
                                                <button className='w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md'>
                                                    <Eye className='w-4 h-4' />
                                                    View Note
                                                    <ExternalLink className='w-3 h-3' />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className='space-y-3'>
                                {currentNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className='group p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200'
                                    >
                                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-start gap-3'>
                                                    <div className='flex-1 min-w-0'>
                                                        <h4 className='font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                                                            {note.title}
                                                        </h4>
                                                        <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400'>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getSubjectColor(
                                                                    note.subject
                                                                        .subjectName,
                                                                )}`}
                                                            >
                                                                {
                                                                    note.subject
                                                                        .subjectName
                                                                }
                                                            </span>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                                                                    {getCollegeInitials(
                                                                        note
                                                                            .college
                                                                            .name,
                                                                    )}
                                                                </div>
                                                                <span className='truncate'>
                                                                    {
                                                                        note
                                                                            .college
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className='flex items-center gap-1'>
                                                                <Calendar className='w-3 h-3' />
                                                                {formatDate(
                                                                    note.createdAt,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center'>
                                                <Link
                                                    href={`${note.college.slug}/notes/${note.slug}`}
                                                >
                                                    <button className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap'>
                                                        <Eye className='w-4 h-4' />
                                                        View Note
                                                        <ExternalLink className='w-3 h-3' />
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
                            <FileText className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2'>
                            {notes?.length === 0
                                ? 'No notes added yet'
                                : 'No notes match your search criteria'}
                        </p>
                        {searchTerm ||
                        selectedSubject !== 'all' ||
                        selectedCollege !== 'all' ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubject('all');
                                    setSelectedCollege('all');
                                    setCurrentPage(1);
                                }}
                                className='text-emerald-600 dark:text-emerald-400 text-sm hover:underline'
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
                                className='px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-emerald-500'
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
                                                        ? 'bg-emerald-500 text-white'
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
