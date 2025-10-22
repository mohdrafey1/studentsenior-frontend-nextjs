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
// import Image from "next/image";
import { useSaveResource } from '@/hooks/useSaveResource';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface NotesCardProps {
    note: INote;
    onEdit: (note: INote) => void;
    onDelete: (noteId: string) => void;
    ownerId: string;
}

export const NotesCard: React.FC<NotesCardProps> = ({
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
        <article
            className='group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-emerald-300/60 dark:hover:border-emerald-600/60 shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col'
            aria-label={note.title}
        >
            {/* Animated Background Gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-400/10 dark:via-teal-400/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700' />

            {/* Floating Orb Effect - Smaller on mobile */}
            <div className='absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl sm:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110' />

            {/* Content Section - Compact padding on mobile */}
            <div className='flex-1 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4'>
                {/* Title and Description - Smaller text on mobile */}
                <div className='space-y-1 sm:space-y-2'>
                    <h3 className='text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-tight'>
                        {note.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                        {note.description}
                    </p>
                </div>

                {/* Subject Info - More compact on mobile */}
                <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                    <FileText className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                    <span className='truncate'>{note.subject.subjectName}</span>
                </div>
                <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                    <Folder className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                    <span className='text-gray-400 dark:text-gray-500'>
                        {note.subject.branch.branchCode}
                    </span>
                </div>

                {/* Details Grid - More compact on mobile */}
                <div className='grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm'>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <BookOpen className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span className='truncate'>
                            Sem {note.subject.semester}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400'>
                        <Calendar className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
                        <span className='truncate'>
                            {new Date(note.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    </div>
                </div>

                {/* Status Indicators - More compact on mobile */}
                {note.isPaid && (
                    <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        <span className='inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'>
                            <Lock className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
                            <span className='hidden sm:inline'>
                                {note.price} points
                            </span>
                            <span className='sm:hidden'>₹{note.price}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons - More compact on mobile */}
            <div className='px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 z-40'>
                <div className='flex gap-1.5 sm:gap-2'>
                    <Link
                        href={`notes/${note.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 group-hover:shadow-lg'
                    >
                        <Eye className='w-3 h-3 sm:w-4 sm:h-4' />
                        <span className='hidden sm:inline'>View Note</span>
                        <span className='sm:hidden'>View</span>
                    </Link>

                    <button
                        className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow'
                        onClick={() => {
                            if (isSaved) {
                                handleUnsave();
                            } else {
                                handleSave();
                            }
                        }}
                        title={isSaved ? 'Unsave this Note' : 'Save this Note'}
                        aria-label={
                            isSaved ? 'Unsave this Note' : 'Save this Note'
                        }
                    >
                        <svg
                            className='w-4 h-4 sm:w-5 sm:h-5'
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{ color: isSaved ? '#10B981' : '#9CA3AF' }}
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                            ></path>
                        </svg>
                    </button>

                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(note)}
                                aria-label='Edit Note'
                                className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60 transition-colors duration-200'
                            >
                                <Edit2 className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400' />
                            </button>
                            <button
                                onClick={() => onDelete(note._id)}
                                aria-label='Delete Note'
                                className='w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 transition-colors duration-200'
                            >
                                <Trash2 className='w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400' />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

export default NotesCard;
