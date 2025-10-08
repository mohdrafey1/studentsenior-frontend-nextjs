import { formatDate } from '@/utils/formatting';
import { ILostFoundItem } from '@/utils/interface';
import Image from 'next/image';
import Link from 'next/link';

export const LostFoundCard = ({
    item,
    openModal,
    handleDeleteRequest,
    ownerId,
}: {
    item: ILostFoundItem;
    openModal: (item: ILostFoundItem) => void;
    handleDeleteRequest: (itemId: string) => void;
    ownerId: string;
}) => (
    <article
        className='group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-sky-300/60 dark:hover:border-sky-600/60 shadow-sm hover:shadow-2xl transition-all duration-500 p-0 flex flex-col h-full overflow-hidden backdrop-blur-sm'
        aria-label={item.title}
    >
        {/* Animated Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700' />

        {/* Floating Orb Effect */}
        <div className='absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110' />

        {/* Content Section */}
        <div className='relative p-6 pb-4 flex-grow'>
            {/* Type & Status Badge */}
            <div className='mb-4 flex gap-2'>
                <span
                    className={`inline-flex items-center px-4 py-2 text-xs font-bold ${
                        item.type === 'lost'
                            ? 'text-red-700 bg-red-100'
                            : 'text-blue-700 bg-blue-100'
                    } rounded-full shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}
                >
                    <div
                        className={`w-2 h-2 ${
                            item.type === 'lost' ? 'bg-red-500' : 'bg-blue-500'
                        } rounded-full mr-2 animate-pulse`}
                    ></div>
                    {item.type.toUpperCase()}
                </span>
                <span
                    className={`inline-flex items-center px-4 py-2 text-xs font-bold ${
                        item.currentStatus === 'open'
                            ? 'text-green-700 bg-green-100'
                            : 'text-gray-700 bg-gray-100'
                    } rounded-full shadow-sm`}
                >
                    {item.currentStatus.toUpperCase()}
                </span>
            </div>
            <div className='mb-4'>
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.title || 'Lost/Found Item'}
                        width={300}
                        height={300}
                        className='w-full rounded-lg shadow-md boject-cover'
                    />
                ) : (
                    <div className='w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center'>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>
                            No image available
                        </p>
                    </div>
                )}
            </div>

            {/* Title */}
            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 dark:group-hover:from-sky-400 dark:group-hover:to-cyan-400 transition-all duration-300'>
                {item.title}
            </h2>

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-3 leading-relaxed'>
                {item.description}
            </p>

            {/* Location & Date */}
            <div className='text-sm text-gray-500 dark:text-gray-400 space-y-2'>
                <p>📍 {item.location}</p>
                <p>📅 {formatDate(item.date)}</p>
            </div>
        </div>

        {/* Action Buttons Section */}
        <div className='relative p-6 pt-0 mt-auto'>
            {/* Gradient Separator */}
            <div className='h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4' />

            <div className='flex gap-3'>
                {/* Contact Button */}
                <Link
                    href={`lost-found/${item.slug}`}
                    className='group/contact relative flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] overflow-hidden'
                >
                    View Details
                </Link>

                {/* Owner Action Buttons */}
                {ownerId === item.owner._id && (
                    <>
                        <button
                            onClick={() => openModal(item)}
                            className='group/edit p-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110'
                            aria-label={`Edit item: ${item.title}`}
                        >
                            <svg
                                className='w-4 h-4 group-hover/edit:rotate-12 transition-transform duration-300'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleDeleteRequest(item._id)}
                            className='group/delete p-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-110'
                            aria-label={`Delete item: ${item.title}`}
                        >
                            <svg
                                className='w-4 h-4 group-hover/delete:rotate-12 transition-transform duration-300'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    </article>
);
