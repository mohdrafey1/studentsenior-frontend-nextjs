'use client';

import { UserDataState } from '@/redux/slices/userDataSlice';
import { formatDate } from '@/utils/formatting';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ExternalLink,
    Calendar,
    FileText,
    Eye,
    LayoutGrid,
    List,
    X,
    Tag,
    AlertCircle,
    CheckCircle2,
    Clock,
    GraduationCap,
} from 'lucide-react';

interface NotesTabProps {
    notes: UserDataState['userNoteAdd'];
}

type SortOption = 'createdAt' | 'title' | 'subject' | 'college';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

export default function NotesTab({ notes }: NotesTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Extract unique subjects from notes
    const availableSubjects = useMemo(() => {
        if (!notes) return [];
        const subs = new Set<string>();
        notes.forEach((n) => {
            if (n.subject?.subjectName) subs.add(n.subject.subjectName);
        });
        return Array.from(subs).sort();
    }, [notes]);

    // Filter and sort notes
    const filteredNotes = useMemo(() => {
        if (!notes) return [];
        return notes
            .filter((note) => {
                const matchesSearch =
                    !searchTerm.trim() ||
                    note?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note?.subject?.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note?.college?.name?.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus =
                    statusFilter === 'all' ||
                    (note.submissionStatus?.toLowerCase() === statusFilter.toLowerCase());

                const matchesSubject =
                    selectedSubject === 'all' ||
                    note.subject?.subjectName?.toLowerCase() === selectedSubject.toLowerCase();

                return matchesSearch && matchesStatus && matchesSubject;
            })
            .sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                    case 'title':
                        comparison = (a.title || '').localeCompare(b.title || '');
                        break;
                    case 'subject':
                        comparison = (a.subject?.subjectName || '').localeCompare(
                            b.subject?.subjectName || '',
                        );
                        break;
                    case 'college':
                        comparison = (a.college?.name || '').localeCompare(
                            b.college?.name || '',
                        );
                        break;
                    case 'createdAt':
                    default:
                        comparison =
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime();
                        break;
                }
                return sortOrder === 'asc' ? comparison : -comparison;
            });
    }, [notes, searchTerm, statusFilter, selectedSubject, sortBy, sortOrder]);

    // Pagination
    const totalItems = filteredNotes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotes = filteredNotes.slice(startIndex, endIndex);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSelectedSubject('all');
        setCurrentPage(1);
    };

    const getStatusBadge = (status?: string) => {
        const s = (status || 'approved').toLowerCase();
        if (s === 'approved') {
            return (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#ebfbf0] dark:bg-[#13301f] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f4dc] dark:border-[#1a4a2b]'>
                    <CheckCircle2 className='w-3 h-3' />
                    Approved
                </span>
            );
        }
        if (s === 'pending' || s === 'under review') {
            return (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#fff8eb] dark:bg-[#342410] text-[#d97706] dark:text-[#fbbf24] border border-[#fee7b8] dark:border-[#523812]'>
                    <Clock className='w-3 h-3' />
                    Under Review
                </span>
            );
        }
        if (s === 'rejected') {
            return (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#fef2f2] dark:bg-[#351618] text-[#e11d48] dark:text-[#f87171] border border-[#fecdd3] dark:border-[#581c24]'>
                    <AlertCircle className='w-3 h-3' />
                    Rejected
                </span>
            );
        }
        return null;
    };

    const getNoteHref = (note: { slug: string; college?: { slug?: string } }) => {
        const collegeSlug = note.college?.slug;
        if (collegeSlug) {
            return `/${collegeSlug}/notes/${note.slug}`;
        }
        return `/notes/${note.slug}`;
    };

    return (
        <div className='divide-y divide-[#f0eee9] dark:divide-[#2a2a2a]'>
            {/* Header Toolbar */}
            <div className='p-4 sm:p-6 bg-white dark:bg-[#1c1c1c] space-y-4'>
                {/* Top Row: Title + Count + View Toggle */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                    <div>
                        <div className='flex items-center gap-2'>
                            <div className='w-7 h-7 rounded-lg bg-[#ebfbf0] dark:bg-[#13301f] flex items-center justify-center text-[#1aae39] dark:text-[#4ade80]'>
                                <FileText className='w-4 h-4' />
                            </div>
                            <h3 className='text-base sm:text-lg font-semibold text-[#101828] dark:text-white tracking-tight'>
                                My Uploaded Notes
                            </h3>
                            <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f0eee9] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a]'>
                                {notes?.length || 0}
                            </span>
                        </div>
                        <p className='text-xs text-[#615d59] dark:text-[#a09e9a] mt-1 pl-9'>
                            Manage and access study materials and lecture notes you&apos;ve shared with peers.
                        </p>
                    </div>

                    {/* View Switcher */}
                    <div className='flex items-center gap-2 self-start sm:self-auto pl-9 sm:pl-0'>
                        <div className='flex items-center p-0.5 bg-[#f0eee9] dark:bg-[#252525] rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <button
                                onClick={() => setViewMode('grid')}
                                title='Grid View'
                                aria-label='Grid View'
                                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-[#1c1c1c] text-[#101828] dark:text-white shadow-xs'
                                        : 'text-[#8c8883] hover:text-[#101828] dark:hover:text-white'
                                }`}
                            >
                                <LayoutGrid className='w-4 h-4' />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                title='List View'
                                aria-label='List View'
                                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-white dark:bg-[#1c1c1c] text-[#101828] dark:text-white shadow-xs'
                                        : 'text-[#8c8883] hover:text-[#101828] dark:hover:text-white'
                                }`}
                            >
                                <List className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Row: Search, Subject, Status, Sort */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-1'>
                    {/* Search Input */}
                    <div className={`relative sm:col-span-2 ${availableSubjects.length > 0 ? 'lg:col-span-4' : 'lg:col-span-6'}`}>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8883]' />
                        <input
                            type='text'
                            placeholder='Search notes, subjects, or colleges...'
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className='w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg text-[#101828] dark:text-white placeholder-[#8c8883] focus:outline-none focus:border-[#0075de] dark:focus:border-[#0075de] focus:bg-white dark:focus:bg-[#1c1c1c] transition-all'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8883] hover:text-[#101828] dark:hover:text-white p-0.5'
                            >
                                <X className='w-3.5 h-3.5' />
                            </button>
                        )}
                    </div>

                    {/* Subject Filter (if subjects exist) */}
                    {availableSubjects.length > 0 && (
                        <div className='sm:col-span-1 lg:col-span-3'>
                            <select
                                value={selectedSubject}
                                onChange={(e) => {
                                    setSelectedSubject(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className='w-full px-3 py-2 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg text-[#101828] dark:text-white focus:outline-none focus:border-[#0075de] transition-all cursor-pointer truncate'
                            >
                                <option value='all'>All Subjects</option>
                                {availableSubjects.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status Filter */}
                    <div className={`sm:col-span-1 ${availableSubjects.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as StatusFilter);
                                setCurrentPage(1);
                            }}
                            className='w-full px-3 py-2 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg text-[#101828] dark:text-white focus:outline-none focus:border-[#0075de] transition-all cursor-pointer'
                        >
                            <option value='all'>All Status</option>
                            <option value='approved'>Approved</option>
                            <option value='pending'>Under Review</option>
                            <option value='rejected'>Rejected</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className='sm:col-span-2 lg:col-span-3'>
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field as SortOption);
                                setSortOrder(order as SortOrder);
                            }}
                            className='w-full px-3 py-2 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg text-[#101828] dark:text-white focus:outline-none focus:border-[#0075de] transition-all cursor-pointer'
                        >
                            <option value='createdAt-desc'>Newest First</option>
                            <option value='createdAt-asc'>Oldest First</option>
                            <option value='title-asc'>Title: A to Z</option>
                            <option value='title-desc'>Title: Z to A</option>
                            <option value='subject-asc'>Subject: A to Z</option>
                            <option value='college-asc'>College: A to Z</option>
                        </select>
                    </div>
                </div>

                {/* Filter info tags if active */}
                {(searchTerm || statusFilter !== 'all' || selectedSubject !== 'all') && (
                    <div className='flex items-center flex-wrap gap-2 pt-1'>
                        <span className='text-[11px] text-[#8c8883] font-medium'>Active filters:</span>
                        {searchTerm && (
                            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f0eee9] dark:bg-[#282828] text-[#101828] dark:text-white'>
                                Search: &ldquo;{searchTerm}&rdquo;
                                <button onClick={() => handleSearchChange('')}>
                                    <X className='w-3 h-3 hover:text-[#e11d48]' />
                                </button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f0eee9] dark:bg-[#282828] text-[#101828] dark:text-white'>
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter('all')}>
                                    <X className='w-3 h-3 hover:text-[#e11d48]' />
                                </button>
                            </span>
                        )}
                        {selectedSubject !== 'all' && (
                            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f0eee9] dark:bg-[#282828] text-[#101828] dark:text-white'>
                                Subject: {selectedSubject}
                                <button onClick={() => setSelectedSubject('all')}>
                                    <X className='w-3 h-3 hover:text-[#e11d48]' />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearAllFilters}
                            className='text-[11px] text-[#0075de] hover:underline font-medium ml-1'
                        >
                            Reset all
                        </button>
                    </div>
                )}
            </div>

            {/* Notes Content */}
            <div className='p-4 sm:p-6 bg-[#faf9f8] dark:bg-[#191919] min-h-[360px]'>
                {currentNotes.length > 0 ? (
                    <div>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
                                {currentNotes.map((note) => (
                                    <div
                                        key={note.slug || note.id}
                                        className='group bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de]/40 dark:hover:border-[#0075de]/50 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden'
                                    >
                                        <div className='p-4 sm:p-4.5 space-y-3'>
                                            {/* Top row: Subject tag + Status */}
                                            <div className='flex items-center justify-between gap-2 flex-wrap'>
                                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#ebfbf0] dark:bg-[#13301f] text-[#1aae39] dark:text-[#4ade80] border border-[#d2f4dc] dark:border-[#1a4a2b] truncate max-w-[180px]'>
                                                    <Tag className='w-3 h-3 flex-shrink-0' />
                                                    <span className='truncate'>{note.subject?.subjectName || 'General'}</span>
                                                </span>
                                                {getStatusBadge(note.submissionStatus)}
                                            </div>

                                            {/* Note Title */}
                                            <div>
                                                <h4 className='font-semibold text-sm sm:text-base text-[#101828] dark:text-white line-clamp-2 group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors leading-snug'>
                                                    {note.title}
                                                </h4>
                                                {note.description && (
                                                    <p className='text-xs text-[#615d59] dark:text-[#a09e9a] line-clamp-2 mt-1.5 leading-relaxed'>
                                                        {note.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* College info */}
                                            {note.college?.name && (
                                                <div className='flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                                                    <GraduationCap className='w-3.5 h-3.5 text-[#8c8883]' />
                                                    <span className='truncate'>{note.college.name}</span>
                                                </div>
                                            )}

                                            {/* Rejection notice if present */}
                                            {note.submissionStatus?.toLowerCase() === 'rejected' && note.rejectionReason && (
                                                <div className='p-2 rounded-lg bg-[#fef2f2] dark:bg-[#351618] border border-[#fecdd3] dark:border-[#581c24] text-[11px] text-[#e11d48] dark:text-[#f87171] leading-tight'>
                                                    <strong>Reason:</strong> {note.rejectionReason}
                                                </div>
                                            )}

                                            {/* Date info */}
                                            <div className='flex items-center gap-1.5 text-[11px] text-[#8c8883] pt-1'>
                                                <Calendar className='w-3 h-3' />
                                                <span>{formatDate(note.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Bottom Bar: Action Link */}
                                        <div className='p-4 pt-3 border-t border-[#f0eee9] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#1c1c1c] flex items-center justify-between gap-3'>
                                            <span className='text-xs text-[#8c8883] font-medium'>Study Note</span>

                                            <Link
                                                prefetch={false}
                                                href={getNoteHref(note)}
                                                className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#282828] hover:bg-[#0075de] hover:text-white dark:hover:bg-[#0075de] dark:hover:text-white text-[#101828] dark:text-white border border-[#e6e6e6] dark:border-[#383838] transition-all shadow-xs'
                                            >
                                                <Eye className='w-3.5 h-3.5' />
                                                <span>View</span>
                                                <ExternalLink className='w-3 h-3 opacity-60' />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className='space-y-2.5'>
                                {currentNotes.map((note) => (
                                    <div
                                        key={note.slug || note.id}
                                        className='group p-3.5 sm:p-4 bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de]/40 dark:hover:border-[#0075de]/50 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                                    >
                                        {/* Left info */}
                                        <div className='flex items-start gap-3.5 flex-1 min-w-0'>
                                            <div className='w-10 h-10 rounded-lg bg-[#ebfbf0] dark:bg-[#13301f] flex items-center justify-center text-[#1aae39] dark:text-[#4ade80] flex-shrink-0 group-hover:bg-[#eaf3fd] group-hover:text-[#0075de] dark:group-hover:bg-[#183153] dark:group-hover:text-[#62aef0] transition-colors'>
                                                <FileText className='w-5 h-5' />
                                            </div>

                                            <div className='min-w-0 flex-1'>
                                                <div className='flex items-center gap-2 flex-wrap mb-1'>
                                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#ebfbf0] dark:bg-[#13301f] text-[#1aae39] dark:text-[#4ade80]'>
                                                        {note.subject?.subjectName || 'General'}
                                                    </span>
                                                    {getStatusBadge(note.submissionStatus)}
                                                    <span className='text-[11px] text-[#8c8883] flex items-center gap-1'>
                                                        <Calendar className='w-3 h-3' />
                                                        {formatDate(note.createdAt)}
                                                    </span>
                                                </div>

                                                <h4 className='font-semibold text-sm sm:text-base text-[#101828] dark:text-white truncate group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                                    {note.title}
                                                </h4>

                                                <div className='flex items-center gap-3 text-xs text-[#615d59] dark:text-[#a09e9a] mt-1 flex-wrap'>
                                                    {note.college?.name && (
                                                        <span className='flex items-center gap-1'>
                                                            <GraduationCap className='w-3.5 h-3.5 text-[#8c8883]' />
                                                            {note.college.name}
                                                        </span>
                                                    )}
                                                    {note.description && (
                                                        <span className='truncate max-w-sm'>
                                                            • {note.description}
                                                        </span>
                                                    )}
                                                </div>

                                                {note.submissionStatus?.toLowerCase() === 'rejected' && note.rejectionReason && (
                                                    <p className='text-[11px] text-[#e11d48] dark:text-[#f87171] mt-1'>
                                                        Rejection reason: {note.rejectionReason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right actions */}
                                        <div className='flex items-center justify-between sm:justify-end gap-3 pl-13 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eee9] dark:border-[#2a2a2a]'>
                                            <Link
                                                prefetch={false}
                                                href={getNoteHref(note)}
                                                className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#101828] text-white dark:bg-white dark:text-[#101828] hover:bg-[#0075de] dark:hover:bg-[#0075de] dark:hover:text-white transition-all shadow-xs'
                                            >
                                                <Eye className='w-3.5 h-3.5' />
                                                <span>View Note</span>
                                                <ExternalLink className='w-3 h-3 opacity-60' />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty State */
                    <div className='py-16 text-center max-w-md mx-auto'>
                        <div className='w-14 h-14 mx-auto mb-4 rounded-2xl bg-white dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-center text-[#8c8883] shadow-xs'>
                            <FileText className='w-7 h-7' />
                        </div>
                        <h4 className='text-base font-semibold text-[#101828] dark:text-white mb-1.5'>
                            {notes?.length === 0 ? 'No notes uploaded yet' : 'No matching notes found'}
                        </h4>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mb-5 leading-relaxed'>
                            {notes?.length === 0
                                ? 'You haven’t uploaded or shared any notes yet. Upload your handwritten notes or PDFs to earn points.'
                                : 'We couldn’t find any notes matching your active search terms and filter criteria.'}
                        </p>
                        {notes && notes.length > 0 ? (
                            <button
                                onClick={clearAllFilters}
                                className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-white hover:bg-[#f0eee9] dark:hover:bg-[#333333] transition-all shadow-xs'
                            >
                                Reset All Filters
                            </button>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className='p-4 sm:p-5 bg-white dark:bg-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-4'>
                    {/* Items per page selector */}
                    <div className='flex items-center gap-2 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        <span>Showing</span>
                        <span className='font-semibold text-[#101828] dark:text-white'>
                            {startIndex + 1} - {Math.min(endIndex, totalItems)}
                        </span>
                        <span>of</span>
                        <span className='font-semibold text-[#101828] dark:text-white'>{totalItems}</span>
                        <span>items</span>
                        <span className='mx-1 text-[#d0cdc7] dark:text-[#3a3a3a]'>•</span>
                        <span>Rows:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className='px-2 py-1 bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded text-xs text-[#101828] dark:text-white focus:outline-none focus:border-[#0075de]'
                        >
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                    </div>

                    {/* Pagination page buttons */}
                    <div className='flex items-center gap-1.5'>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className='p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#242424] text-[#101828] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf9f8] dark:hover:bg-[#282828] transition-all shadow-xs'
                            title='Previous Page'
                        >
                            <ChevronLeft className='w-4 h-4' />
                        </button>

                        <div className='flex items-center gap-1'>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                const isActive = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                            isActive
                                                ? 'bg-[#101828] text-white dark:bg-white dark:text-[#101828] shadow-xs'
                                                : 'bg-white dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a] hover:text-[#101828] dark:hover:text-white hover:bg-[#faf9f8] dark:hover:bg-[#282828]'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className='p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#242424] text-[#101828] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf9f8] dark:hover:bg-[#282828] transition-all shadow-xs'
                            title='Next Page'
                        >
                            <ChevronRight className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

