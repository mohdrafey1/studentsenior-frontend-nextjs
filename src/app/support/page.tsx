'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AlertCircle, ChevronRight, Inbox, Loader2, Plus } from 'lucide-react';
import { api } from '@/config/apiUrls';
import { RootState } from '@/redux/store';
import StatusBadge from '@/components/Support/StatusBadge';
import {
    CATEGORY_LABELS,
    TicketSummary,
    supportRequest,
    ticketRef,
    timeAgo,
} from '@/components/Support/support';

const FILTERS = [
    { value: '', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'done', label: 'Solved' },
];

interface Page {
    tickets: TicketSummary[];
    pagination: { page: number; totalPages: number };
}

export default function SupportPage() {
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [state, setState] = useState('');
    const [tickets, setTickets] = useState<TicketSummary[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) router.replace('/sign-in?from=/support');
    }, [currentUser, router]);

    const load = useCallback(
        async (nextPage: number) => {
            setLoading(true);
            setError('');
            try {
                const query = new URLSearchParams({
                    page: String(nextPage),
                    ...(state ? { state } : {}),
                });
                const data = await supportRequest<Page>(
                    `${api.support.tickets}?${query}`,
                );
                setTickets((current) =>
                    nextPage === 1
                        ? data.tickets
                        : [...current, ...data.tickets],
                );
                setPage(nextPage);
                setTotalPages(data.pagination.totalPages || 1);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Couldn’t load your requests.',
                );
            } finally {
                setLoading(false);
            }
        },
        [state],
    );

    useEffect(() => {
        if (currentUser) load(1);
    }, [currentUser, load]);

    if (!currentUser) return null;

    return (
        <>
            <div className='flex flex-wrap items-end justify-between gap-3 mb-6'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                        Support
                    </h1>
                    <p className='mt-1 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97]'>
                        Your requests and our replies. We also email you when we
                        reply.
                    </p>
                </div>
                <Link
                    href='/contact-us'
                    className='inline-flex items-center gap-1.5 py-2 px-3.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0075de] hover:bg-[#0060b9] transition-colors'
                >
                    <Plus className='w-4 h-4' />
                    New request
                </Link>
            </div>

            <div
                role='group'
                aria-label='Show'
                className='inline-flex p-[3px] mb-4 rounded-lg bg-[#efeeec] dark:bg-[#262626]'
            >
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        type='button'
                        aria-pressed={state === filter.value}
                        onClick={() => setState(filter.value)}
                        className={`px-3 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            state === filter.value
                                ? 'bg-white dark:bg-[#3a3a3a] text-[#191919] dark:text-white shadow-2xs'
                                : 'text-[#615d59] dark:text-[#a39e98] hover:text-[#191919] dark:hover:text-white'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error && (
                <div
                    role='alert'
                    className='flex items-center gap-2 p-3 mb-4 rounded-lg bg-[#fdecec] dark:bg-[#3d1818] text-xs sm:text-sm text-[#c4352d] dark:text-[#ff8a80]'
                >
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    <span className='flex-1'>{error}</span>
                    <button
                        type='button'
                        onClick={() => load(1)}
                        className='font-semibold underline cursor-pointer'
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading && tickets.length === 0 ? (
                <div className='flex items-center justify-center py-16 text-[#787774]'>
                    <Loader2 className='w-5 h-5 animate-spin' />
                </div>
            ) : tickets.length === 0 && !error ? (
                <div className='text-center py-14 px-6 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl'>
                    <div className='w-11 h-11 mx-auto mb-3 rounded-xl bg-[#f1f0ee] dark:bg-[#2a2a2a] flex items-center justify-center text-[#787774]'>
                        <Inbox className='w-5 h-5' />
                    </div>
                    <p className='font-semibold'>
                        {state ? 'Nothing here' : 'No requests yet'}
                    </p>
                    <p className='mt-1 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97]'>
                        Questions you send us appear here, with our replies.
                    </p>
                </div>
            ) : (
                <ul className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl overflow-hidden divide-y divide-[#efeeec] dark:divide-[#2a2a2a]'>
                    {tickets.map((ticket) => (
                        <li key={ticket._id}>
                            <Link
                                href={`/support/${ticket._id}`}
                                className='flex items-start gap-3 px-4 sm:px-5 py-4 hover:bg-[#faf9f8] dark:hover:bg-[#262626] transition-colors'
                            >
                                <div className='flex-1 min-w-0'>
                                    <div className='flex flex-wrap items-center gap-2 mb-1'>
                                        <span className='font-mono text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                            {ticketRef(ticket)}
                                        </span>
                                        <StatusBadge status={ticket.status} />
                                        {ticket.unread > 0 && (
                                            <span className='inline-flex items-center gap-1 text-[11px] font-semibold text-[#0075de] dark:text-[#62aef0]'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-current' />
                                                New reply
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-sm sm:text-[15px] truncate ${
                                            ticket.unread > 0
                                                ? 'font-bold'
                                                : 'font-semibold'
                                        }`}
                                    >
                                        {ticket.subject}
                                    </p>
                                    <p className='mt-0.5 text-xs sm:text-[13px] text-[#787774] dark:text-[#9b9a97] line-clamp-1'>
                                        {ticket.lastMessagePreview}
                                    </p>
                                    <p className='mt-1.5 text-[11px] text-[#9b9a97]'>
                                        {CATEGORY_LABELS[ticket.category] ||
                                            'Other'}{' '}
                                        · {timeAgo(ticket.lastMessageAt)}
                                    </p>
                                </div>
                                <ChevronRight className='w-4 h-4 mt-1 text-[#b4b1ab] shrink-0' />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {page < totalPages && (
                <div className='flex justify-center mt-4'>
                    <button
                        type='button'
                        disabled={loading}
                        onClick={() => load(page + 1)}
                        className='inline-flex items-center gap-2 py-2 px-4 text-xs sm:text-sm font-medium rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#faf9f8] dark:hover:bg-[#262626] disabled:opacity-50 cursor-pointer'
                    >
                        {loading && (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        )}
                        Show more
                    </button>
                </div>
            )}
        </>
    );
}
