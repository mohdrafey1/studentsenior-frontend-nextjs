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
    const isOwner = note.owner?._id === ownerId;
    const { saveResource, unsaveResource } = useSaveResource();
    const [isSaved, setIsSaved] = useState(false);

    const { savedNotes } = useSelector(
        (state: RootState) => state.savedCollection,
    );

    useEffect(() => {
        const isSavedEntry = !!savedNotes?.some((entry) =>
            typeof entry.noteId === 'string'
                ? entry.noteId === note._id
                : entry.noteId && typeof entry.noteId === 'object'
                  ? entry.noteId._id === note._id
                  : false,
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
        <article className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'>
            <div className='relative p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6'>
                {/* Left Section - Main Info */}
                <div className='flex-1 min-w-0 flex flex-col justify-center space-y-2.5'>
                    {/* Title */}
                    <div className='flex items-start justify-between sm:justify-start gap-3'>
                        <div className='min-w-0'>
                            <h3 className='text-sm sm:text-base font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors leading-snug truncate'>
                                {note.title}
                            </h3>
                            <p className='text-xs text-[#615d59] dark:text-[#a09e9a] line-clamp-1 mt-0.5'>
                                {note.description}
                            </p>
                        </div>
                        {/* Paid Badge */}
                        {note.isPaid && (
                            <span className='shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#fffbeb] text-[#d97706] dark:bg-[#382606] dark:text-[#fbbf24] border border-[#fef08a] dark:border-[#524419]'>
                                <Lock className='w-2.5 h-2.5' />
                                <span>{note.price} pts</span>
                            </span>
                        )}
                    </div>

                    {/* Meta Info Grid */}
                    <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        <div className='flex items-center gap-1.5'>
                            <FileText className='w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0]' />
                            <span className='font-medium truncate max-w-[120px] sm:max-w-[180px]'>
                                {note.subject.subjectName}
                            </span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <Folder className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672]' />
                            <span>{note.subject.branch.branchCode}</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <BookOpen className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672]' />
                            <span>{note.subject.semester} Sem</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <Calendar className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672]' />
                            <time>
                                {new Date(note.createdAt).toLocaleDateString(
                                    'en-US',
                                    { month: 'short', day: 'numeric', year: 'numeric' }
                                )}
                            </time>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <Eye className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672]' />
                            <span>{note.clickCounts || 0} views</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className='flex items-center gap-2 shrink-0 sm:pl-4 sm:border-l border-[#f0eee9] dark:border-[#2a2a2a]'>
                    {/* View Note Link */}
                    <Link
                        prefetch={false}
                        href={`/${note.college.slug}/notes/${note.slug}`}
                        className='inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        <Eye className='w-3.5 h-3.5' />
                        <span>View</span>
                    </Link>

                    {/* Save/Unsave Button */}
                    <button
                        onClick={isSaved ? handleUnsave : handleSave}
                        className='w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] transition-colors shadow-xs'
                        aria-label={isSaved ? 'Unsave note' : 'Save note'}
                        title={isSaved ? 'Unsave note' : 'Save note'}
                    >
                        <svg
                            className='w-4 h-4'
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            style={{ color: isSaved ? '#0075de' : 'currentColor' }}
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
                                className='w-8 h-8 flex items-center justify-center rounded-lg bg-[#fffbeb] dark:bg-[#382606] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fef3c7] dark:hover:bg-[#451a03] border border-[#fef08a] dark:border-[#524419] transition-colors'
                                aria-label='Edit note'
                                title='Edit note'
                            >
                                <Edit2 className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={() => onDelete(note._id)}
                                className='w-8 h-8 flex items-center justify-center rounded-lg bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] border border-[#fecdd3] dark:border-[#5c2328] transition-colors'
                                aria-label='Delete note'
                                title='Delete note'
                            >
                                <Trash2 className='w-3.5 h-3.5' />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};
