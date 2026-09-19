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
        <article
            className='group relative bg-white dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col justify-between'
            aria-label={note.title}
        >
            {/* Content Section */}
            <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                {/* Title and Subject */}
                <div className='space-y-1'>
                    <h3 className='text-sm sm:text-base font-bold text-[#101828] dark:text-white group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors line-clamp-2 leading-snug'>
                        {note.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] line-clamp-2 leading-relaxed'>
                        {note.description}
                    </p>
                </div>

                <div className='pt-2 flex flex-col gap-1.5'>
                    <div className='flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        <FileText className='w-3.5 h-3.5 text-[#0075de] dark:text-[#62aef0] flex-shrink-0' />
                        <span className='truncate font-medium'>
                            {note.subject.subjectName}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        <Folder className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span className='truncate'>
                            {note.subject.branch.branchCode}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-1.5 sm:gap-2 text-xs pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <BookOpen className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span className='truncate'>
                            {note.subject.semester} Sem
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[#615d59] dark:text-[#a09e9a]'>
                        <Calendar className='w-3 h-3 text-[#8c8883] dark:text-[#787672] flex-shrink-0' />
                        <span className='truncate'>
                            {new Date(note.createdAt).toLocaleDateString(
                                'en-US',
                                { month: 'short', day: 'numeric' }
                            )}
                        </span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className='flex flex-wrap gap-1.5'>
                    {note.isPaid && (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#fffbeb] text-[#d97706] dark:bg-[#382606] dark:text-[#fbbf24] border border-[#fef08a] dark:border-[#524419]'>
                            <Lock className='w-2.5 h-2.5' />
                            <span>{note.price} points</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className='p-3 sm:p-4 pt-0'>
                <div className='flex gap-1.5 sm:gap-2 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <Link
                        prefetch={false}
                        href={`notes/${note.slug}`}
                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                    >
                        {!isOwner ? (
                            <><Eye className='w-3.5 h-3.5' />
                        <span>View Note</span>
                        </>):(
                            <Eye className='w-3.5 h-3.5' />
                        )}
                    </Link>

                    <button
                        className='w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] transition-colors shadow-xs'
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
                            className='w-4 h-4'
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{ color: isSaved ? '#0075de' : 'currentColor' }}
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
                                className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fffbeb] dark:bg-[#382606] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fef3c7] dark:hover:bg-[#451a03] border border-[#fef08a] dark:border-[#524419] transition-colors'
                            >
                                <Edit2 className='w-3.5 h-3.5' />
                            </button>
                            <button
                                onClick={() => onDelete(note._id)}
                                aria-label='Delete Note'
                                className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] hover:bg-[#ffe4e6] dark:hover:bg-[#4c0519] border border-[#fecdd3] dark:border-[#5c2328] transition-colors'
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

export default NotesCard;
