'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { INote } from '@/utils/interface';
import {
    FileText,
    Edit2,
    Trash2,
    Lock,
    Calendar,
    BookOpen,
    Eye,
    Folder,
} from 'lucide-react';
import { useSaveResource } from '@/hooks/useSaveResource';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface NoteListItemProps {
    note: INote;
    onEdit: (note: INote) => void;
    onDelete: (noteId: string) => void;
    ownerId: string;
}

export const NoteListItem: React.FC<NoteListItemProps> = ({
    note,
    onEdit,
    onDelete,
    ownerId,
}) => {
    const isOwner = note.owner._id === ownerId;
    const { saveResource, unsaveResource } = useSaveResource();
    const [isSaved, setIsSaved] = useState(false);

    const { savedNotes } = useSelector(
        (state: RootState) => state.savedCollection,
    );

    useEffect(() => {
        const isSavedEntry = savedNotes.some((entry) =>
            typeof entry.noteId === 'string'
                ? entry.noteId === note._id
                : entry.noteId._id === note._id,
        );
        setIsSaved(isSavedEntry);
    }, [savedNotes, note._id]);

    const handleSave = async () => {
        await saveResource('note', note._id);
    };

    const handleUnsave = async () => {
        await unsaveResource('note', note._id);
    };

    return (
        <article className='group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-emerald-300/60 dark:hover:border-emerald-600/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm'>
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500' />

            <div className='relative p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    {/* Left Section - Main Info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                        {/* Title */}
                        <div className='flex items-start justify-between'>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1'>
                                    {note.title}
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1'>
                                    {note.description}
                                </p>
                            </div>

                            {/* Paid Badge */}
                            {note.isPaid && (
                                <div className='ml-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 dark:from-yellow-900/50 dark:to-amber-900/50 dark:text-yellow-200 border border-amber-200/50 dark:border-amber-700/50'>
                                    <Lock className='w-3 h-3' />
                                    <span>₹{note.price / 5}</span>
                                </div>
                            )}
                        </div>

                        {/* Subject Info */}
                        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400'>
                            <div className='flex items-center gap-1.5'>
                                <Folder className='w-4 h-4 flex-shrink-0' />
                                <span className='truncate'>
                                    {note.subject.subjectCode}
                                </span>
                            </div>
                            <span className='text-gray-300 dark:text-gray-600'>
                                •
                            </span>
                            <div className='flex items-center gap-1.5'>
                                <BookOpen className='w-4 h-4 flex-shrink-0' />
                                <span>{note.subject.semester} Sem</span>
                            </div>
                            <span className='text-gray-300 dark:text-gray-600'>
                                •
                            </span>
                            <div className='flex items-center gap-1.5'>
                                <Eye className='w-4 h-4 flex-shrink-0' />
                                <span>{note.clickCounts || 0}</span>
                            </div>
                        </div>

                        {/* Date */}
                        <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500'>
                            <Calendar className='w-3.5 h-3.5 flex-shrink-0' />
                            <time>
                                {new Date(note.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    },
                                )}
                            </time>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className='flex sm:flex-col items-center gap-2'>
                        {/* View Note Link */}
                        <Link
                            prefetch={false}
                            href={`/${note.college.slug}/notes/${note.slug}`}
                            className='flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'
                        >
                            <FileText className='w-4 h-4' />
                            <span>View</span>
                        </Link>

                        <div className='flex items-center gap-2'>
                            {/* Save/Unsave Button */}
                            <button
                                onClick={isSaved ? handleUnsave : handleSave}
                                className={`p-2 rounded-lg transition-all duration-300 ${
                                    isSaved
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                }`}
                                aria-label={
                                    isSaved ? 'Unsave note' : 'Save note'
                                }
                                title={isSaved ? 'Unsave note' : 'Save note'}
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill={isSaved ? 'currentColor' : 'none'}
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                                    />
                                </svg>
                            </button>

                            {/* Edit & Delete for Owners */}
                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => onEdit(note)}
                                        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300'
                                        aria-label='Edit note'
                                        title='Edit note'
                                    >
                                        <Edit2 className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() => onDelete(note._id)}
                                        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300'
                                        aria-label='Delete note'
                                        title='Delete note'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
