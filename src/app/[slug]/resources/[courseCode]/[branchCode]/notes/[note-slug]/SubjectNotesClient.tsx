'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { INote } from '@/utils/interface';
import { BookOpen, Search, Eye, Plus, FileText, Video } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import NotesFormModal from './noteForm';

interface SubjectNotesClientProps {
    initialNotes: INote[];
    subjectCode: string;
    collegeSlug: string;
    courseCode: string;
    subjectName: string;
    branchCode: string;
}

export default function SubjectNotesClient({
    initialNotes,
    subjectCode,
    collegeSlug,
    courseCode,
    branchCode,
    subjectName,
}: SubjectNotesClientProps) {
    const [search, setSearch] = useState('');
    const [addNote, setAddNotes] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        fileUrl: '',
        subjectCode: '',
        isPaid: false,
        price: 0,
    });

    const filtered = useMemo(() => {
        return initialNotes.filter((n) => {
            const query = search.trim().toLowerCase();
            if (!query) return true;
            return (
                n.title.toLowerCase().includes(query) ||
                (n.description || '').toLowerCase().includes(query)
            );
        });
    }, [initialNotes, search]);

    const handleOpenAddNoteModal = () => {
        setAddNotes(!addNote);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleAddSubmit = async (formData: typeof form) => {
        try {
            const response = await fetch(api.notes.createNote, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    college: collegeSlug,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create note');
            }
            toast.success(data.message || 'Note created successfully!');
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        } finally {
            closeAddModal();
        }
    };

    const closeAddModal = () => {
        setAddNotes(false);
        setForm({
            title: '',
            description: '',
            fileUrl: '',
            subjectCode: '',
            isPaid: false,
            price: 0,
        });
    };

    return (
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6'>
            {/* Header Section */}
            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-[#101828] dark:text-white'>
                            {subjectName} - Study Notes
                        </h1>
                        <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mt-1'>
                            Browse and access study notes and materials
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className='flex flex-col sm:flex-row gap-2.5'>
                        <Link
                            prefetch={false}
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                            className='px-4 py-2 bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <FileText className='w-4 h-4' />
                            PYQs
                        </Link>
                        <Link
                            prefetch={false}
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/videos/${subjectCode}`}
                            className='px-4 py-2 bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <Video className='w-4 h-4' />
                            Videos
                        </Link>
                        <button
                            onClick={handleOpenAddNoteModal}
                            className='px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <Plus className='w-4 h-4' />
                            Add Note
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className='bg-white dark:bg-[#1c1c1c] p-6'>
                <div className='relative max-w-xl mx-auto'>
                    <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8883] dark:text-[#787672]' size={18} />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search notes by title or description...'
                        className='w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] outline-none transition-all shadow-sm'
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className='text-xs sm:text-sm text-[#615d59] dark:text-[#9ea3ae] font-medium px-2'>
                Showing {filtered.length} note{filtered.length === 1 ? '' : 's'}
                {search && ` matching "${search}"`}
            </div>

            {/* Notes Grid or Empty State */}
            {filtered.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filtered.map((note) => (
                        <div
                            key={note._id}
                            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
                        >
                            {/* Note Header */}
                            <div className='p-5 flex-1 flex flex-col'>
                                {/* Author Info */}
                                <div className='flex items-center gap-3 mb-4 pb-4 border-b border-[#f0eee9] dark:border-[#2a2a2a]'>
                                    {note.owner?.profilePicture ? (
                                        <Image
                                            src={note.owner.profilePicture}
                                            alt='Author'
                                            className='w-9 h-9 rounded-full object-cover border border-[#e6e6e6] dark:border-[#2f2f2f]'
                                            width={36}
                                            height={36}
                                        />
                                    ) : (
                                        <div className='w-9 h-9 rounded-full bg-[#eaf3fd] dark:bg-[#183153] border border-[#d2e4f9] dark:border-[#224474] flex items-center justify-center text-[#0075de] dark:text-[#62aef0] font-bold text-sm'>
                                            {note.owner?.username?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-semibold text-[#101828] dark:text-white truncate'>
                                            {note.owner?.username || 'Anonymous'}
                                        </p>
                                        <p className='text-xs text-[#615d59] dark:text-[#9ea3ae] mt-0.5'>
                                            {formatDate(note.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Note Content */}
                                <div className='flex-1'>
                                    <h3 className='text-base font-bold text-[#101828] dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                        {note.title}
                                    </h3>
                                    <p className='text-sm text-[#475467] dark:text-[#9ea3ae] line-clamp-3 leading-relaxed'>
                                        {note.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>

                            {/* Note Footer */}
                            <div className='border-t border-[#e6e6e6] dark:border-[#2f2f2f] px-5 py-3.5 bg-[#f6f5f4] dark:bg-[#191919] mt-auto'>
                                <div className='flex justify-between items-center'>
                                    {/* Stats */}
                                    <div className='flex items-center gap-1.5 text-xs font-medium text-[#615d59] dark:text-[#9ea3ae]'>
                                        <Eye className='w-4 h-4 text-[#8c8883] dark:text-[#787672]' />
                                        <span>{note.clickCounts} views</span>
                                    </div>

                                    {/* View Button */}
                                    <Link
                                        prefetch={false}
                                        href={`/${collegeSlug}/notes/${note.slug}`}
                                        className='px-3.5 py-1.5 bg-white dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#eae8e4] dark:hover:bg-[#333] text-[#101828] dark:text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                                    >
                                        View Note
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : search ? (
                // No Search Results
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-12 text-center shadow-sm max-w-2xl mx-auto w-full'>
                    <Search className='w-14 h-14 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                        No notes found
                    </h3>
                    <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mb-6 max-w-md mx-auto'>
                        No notes match your search for &quot;{search}&quot;. Try different keywords.
                    </p>
                    <button
                        onClick={() => setSearch('')}
                        className='text-[#0075de] dark:text-[#62aef0] hover:underline font-medium text-sm'
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                // No Notes Available
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-12 text-center shadow-sm max-w-2xl mx-auto w-full'>
                    <BookOpen className='w-14 h-14 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                        No Notes Available
                    </h3>
                    <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mb-6 max-w-md mx-auto'>
                        Be the first to contribute study notes for this subject and help fellow students.
                    </p>
                    <button
                        onClick={handleOpenAddNoteModal}
                        className='bg-[#0075de] hover:bg-[#0062bd] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-all shadow-xs active:scale-[0.98]'
                    >
                        <Plus className='w-4 h-4' />
                        Add First Note
                    </button>
                </div>
            )}
            <NotesFormModal
                isOpen={addNote}
                onClose={() => setAddNotes(false)}
                onSubmit={handleAddSubmit}
                form={form}
                setForm={setForm}
                subject={subjectCode}
                branchCode={branchCode}
                collegeSlug={collegeSlug}
            />
        </div>
    );
}
