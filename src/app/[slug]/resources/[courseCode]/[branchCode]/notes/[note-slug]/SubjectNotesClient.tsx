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
    subjectName:string;
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
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
            setLoading(false);
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
        <div className='max-w-7xl mx-auto p-4 space-y-6'>
            {/* Header Section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {subjectName} - Study Notes
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-1'>
                            Browse and access study notes and materials
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <Link
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`}
                            className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                        >
                            <FileText className='w-4 h-4' />
                            PYQs
                        </Link>
                        <Link
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/videos/${subjectCode}`}
                            className='px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                        >
                            <Video className='w-4 h-4' />
                            Videos
                        </Link>
                        <button
                            onClick={handleOpenAddNoteModal}
                            className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                        >
                            <Plus className='w-4 h-4' />
                            Add Note
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
                <div className='relative max-w-xl'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search notes by title or description...'
                        className='w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className='text-sm text-gray-600 dark:text-gray-400'>
                Showing {filtered.length} note{filtered.length === 1 ? '' : 's'}
                {search && ` matching "${search}"`}
            </div>

            {/* Notes Grid or Empty State */}
            {filtered.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filtered.map((note) => (
                        <div
                            key={note._id}
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow'
                        >
                            {/* Note Header */}
                            <div className='p-4'>
                                {/* Author Info */}
                                <div className='flex items-center gap-2 mb-4'>
                                    {note.owner?.profilePicture ? (
                                        <Image
                                            src={note.owner.profilePicture}
                                            alt='Author'
                                            className='w-8 h-8 rounded-full object-cover'
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm'>
                                            {note.owner?.username?.charAt(0) ||
                                                'A'}
                                        </div>
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                                            {note.owner?.username ||
                                                'Anonymous'}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            {formatDate(note.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Note Content */}
                                <div className='mb-4'>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                                        {note.title}
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-3'>
                                        {note.description ||
                                            'No description provided'}
                                    </p>
                                </div>
                            </div>

                            {/* Note Footer */}
                            <div className='border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-700'>
                                <div className='flex justify-between items-center'>
                                    {/* Stats */}
                                    <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                                        <Eye className='w-4 h-4' />
                                        <span>{note.clickCounts} views</span>
                                    </div>

                                    {/* View Button */}
                                    <Link
                                        href={`/${collegeSlug}/notes/${note.slug}`}
                                        className='px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors'
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
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12'>
                    <div className='text-center'>
                        <Search className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                            No notes found
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-6'>
                            No notes match your search for &quot;{search}&quot;.
                            Try different keywords.
                        </p>
                        <button
                            onClick={() => setSearch('')}
                            className='text-blue-500 hover:text-blue-600 font-medium'
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            ) : (
                // No Notes Available
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12'>
                    <div className='text-center'>
                        <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                            No Notes Available
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
                            Be the first to contribute study notes for this
                            subject and help fellow students.
                        </p>
                        <button
                            onClick={handleOpenAddNoteModal}
                            className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors'
                        >
                            <Plus className='w-4 h-4' />
                            Add First Note
                        </button>
                    </div>
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
          />

        </div>
    );
}
