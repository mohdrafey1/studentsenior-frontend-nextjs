'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedCollection } from '@/redux/slices/savedCollectionSlice';
import { useSaveResource } from '@/hooks/useSaveResource';
import type { AppDispatch, RootState } from '@/redux/store';
import type { IPyq, INote } from '@/utils/interface';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';

const CollectionClient = () => {
    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    );

    if (!currentUser) {
        toast.error('Please login to view your collection');
        redirect('/sign-in?from=/collections');
    }

    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState('savedPYQs');
    const [isLoading, setIsLoading] = useState(true);

    const { unsaveResource } = useSaveResource();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await dispatch(fetchSavedCollection());
            setIsLoading(false);
        };
        loadData();
    }, [dispatch]);

    const { savedPYQs, savedNotes, purchasedPYQs, purchasedNotes } =
        useSelector((state: RootState) => state.savedCollection);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const renderLoadingState = () => (
        <div className='col-span-full flex justify-center h-screen py-12 w-full'>
            <div className='text-center'>loading...</div>
        </div>
    );

    const renderEmptyState = () => (
        <div className='flex flex-col items-center justify-center p-8 md:p-12 text-center'>
            <div className='text-gray-400 text-4xl md:text-5xl mb-4'>📄</div>
            <h3 className='text-lg md:text-xl font-semibold text-gray-700 mb-2'>
                No items found
            </h3>
            <p className='text-gray-500 max-w-md'>
                You dont have any items in this collection yet.
            </p>
        </div>
    );

    const renderPYQCard = (
        item: { _id?: string; pyqId?: IPyq | string; savedAt?: string } | IPyq,
        isPurchased = false
    ) => {
        // Handle both structures from the data
        const pyq = (
            isPurchased ? (item as IPyq) : (item as { pyqId?: IPyq }).pyqId
        ) as IPyq | undefined;
        if (!pyq) return null;

        // Constructing the PYQ URL
        const collegeName = pyq.college?.slug;
        const pyqUrl = `/${collegeName}/pyqs/${pyq.slug}`;

        return (
            <div
                key={(item as { _id?: string })?._id || pyq._id}
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-2'>
                        <div className='flex-1'>
                            <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 line-clamp-2'>
                                {pyq.subject?.subjectName ||
                                    pyq.subject?.subjectCode ||
                                    'Unknown Subject'}
                            </h3>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                                <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded'>
                                    {pyq.examType?.toUpperCase() || 'EXAM'}
                                </span>
                                <span className='bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded'>
                                    {pyq.year || 'Unknown Year'}
                                </span>
                                {pyq.solved && (
                                    <span className='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded'>
                                        SOLVED
                                    </span>
                                )}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                                {pyq.slug
                                    ?.replace(/-/g, ' ')
                                    .replace(/(^\w|\s\w)/g, (m: string) =>
                                        m.toUpperCase()
                                    )}
                            </div>
                        </div>
                        <div className='text-right'>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                {isPurchased ? 'Purchased' : 'Saved'}{' '}
                                {formatDate(
                                    (!isPurchased &&
                                        (item as { savedAt?: string })
                                            .savedAt) ||
                                        pyq.createdAt
                                )}
                            </span>
                            {pyq.isPaid && (
                                <div className='mt-1'>
                                    <span className='bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-1 rounded'>
                                        ₹{pyq.price / 5}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex justify-between items-center'>
                    {!isPurchased && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                unsaveResource('pyq', pyq._id);
                            }}
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                            title='Unsave this PYQ'
                        >
                            <Bookmark />
                        </button>
                    )}

                    <div className='flex items-center gap-3'>
                        <span className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                <path
                                    fillRule='evenodd'
                                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {pyq.clickCounts || 0}
                        </span>
                    </div>

                    <Link
                        href={pyqUrl}
                        rel='noopener noreferrer'
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center'
                    >
                        View PDF
                        <svg
                            className='w-4 h-4 ml-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    };

    const renderNoteCard = (
        item:
            | { _id?: string; noteId?: INote | string; savedAt?: string }
            | INote,
        isPurchased = false
    ) => {
        // Handle both structures from the data
        const note = (
            isPurchased ? (item as INote) : (item as { noteId?: INote }).noteId
        ) as INote | undefined;
        if (!note) return null;

        const collegeName = note.college?.slug;

        const noteUrl = `/${collegeName}/notes/${note.slug}`;

        return (
            <div
                key={(item as { _id?: string })?._id || note._id}
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-2'>
                        <div className='flex-1'>
                            <h3 className='font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 line-clamp-2'>
                                {note?.title || 'Untitled Note'}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2'>
                                {note?.description ||
                                    'No description available'}
                            </p>
                            <div className='flex flex-wrap gap-2 mb-2'>
                                {note.subject?.subjectName && (
                                    <span className='bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded'>
                                        {note.subject.subjectName}
                                    </span>
                                )}
                                {note.subject?.subjectCode && (
                                    <span className='bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded'>
                                        {note.subject.subjectCode}
                                    </span>
                                )}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>
                                {note?.slug
                                    ?.replace(/-/g, ' ')
                                    .replace(/(^\w|\s\w)/g, (m: string) =>
                                        m.toUpperCase()
                                    )}
                            </div>
                        </div>
                        <div className='text-right'>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                {isPurchased ? 'Purchased' : 'Saved'}{' '}
                                {formatDate(
                                    (!isPurchased &&
                                        (item as { savedAt?: string })
                                            .savedAt) ||
                                        note.createdAt
                                )}
                            </span>
                            {note?.isPaid && (
                                <div className='mt-1'>
                                    <span className='bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-1 rounded'>
                                        ₹{note?.price / 5}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 px-4 py-3 flex justify-between items-center'>
                    {!isPurchased && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (note) {
                                    unsaveResource('note', note._id);
                                }
                            }}
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center'
                            title='Unsave this Note'
                        >
                            <Bookmark />
                        </button>
                    )}

                    <div className='flex items-center gap-3'>
                        <span className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                <path
                                    fillRule='evenodd'
                                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {note?.clickCounts || 0}
                        </span>

                        <span className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {Array.isArray(
                                (note as unknown as { likes?: unknown[] }).likes
                            )
                                ? (
                                      (note as unknown as { likes?: unknown[] })
                                          .likes as unknown[]
                                  ).length
                                : 0}
                        </span>
                    </div>
                    <Link
                        href={noteUrl}
                        rel='noopener noreferrer'
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center'
                    >
                        View Note
                        <svg
                            className='w-4 h-4 ml-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path
                                fillRule='evenodd'
                                d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        if (isLoading) return renderLoadingState();

        switch (activeTab) {
            case 'savedPYQs':
                return savedPYQs?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {savedPYQs.map((item) => renderPYQCard(item))}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'savedNotes':
                return savedNotes?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {savedNotes.map((item) => renderNoteCard(item))}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'purchasedPYQs':
                return purchasedPYQs?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {purchasedPYQs.map((item) =>
                            renderPYQCard(item as unknown as IPyq, true)
                        )}
                    </div>
                ) : (
                    renderEmptyState()
                );
            case 'purchasedNotes':
                return purchasedNotes?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {purchasedNotes.map((item) =>
                            renderNoteCard(item as unknown as INote, true)
                        )}
                    </div>
                ) : (
                    renderEmptyState()
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'savedPYQs', label: 'Saved PYQs', count: savedPYQs?.length || 0 },
        {
            id: 'savedNotes',
            label: 'Saved Notes',
            count: savedNotes?.length || 0,
        },
        {
            id: 'purchasedPYQs',
            label: 'Purchased PYQs',
            count: purchasedPYQs?.length || 0,
        },
        {
            id: 'purchasedNotes',
            label: 'Purchased Notes',
            count: purchasedNotes?.length || 0,
        },
    ];

    return (
        <div className='max-w-7xl min-h-screen mx-auto px-4 py-6 bg-white dark:bg-gray-900'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                <h1 className='text-2xl font-fugaz font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-0'>
                    My Collection
                </h1>
                <div className='flex items-center'>
                    <span className='text-sm text-gray-500 dark:text-gray-400 mr-2'>
                        Last updated:
                    </span>
                    <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {formatDate(new Date().toISOString())}
                    </span>
                </div>
            </div>

            <div className='mb-6 overflow-x-auto'>
                <div className='border-b border-gray-200 dark:border-gray-700 min-w-max'>
                    <nav
                        className='flex space-x-0 sm:space-x-8'
                        aria-label='Tabs'
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className='ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs'>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className='mt-6'>{renderTabContent()}</div>
        </div>
    );
};

export default CollectionClient;
