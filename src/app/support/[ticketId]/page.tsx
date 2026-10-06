'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import { api } from '@/config/apiUrls';
import { RootState } from '@/redux/store';
import StatusBadge from '@/components/Support/StatusBadge';
import {
    CATEGORY_LABELS,
    OPEN_STATUSES,
    Ticket,
    formatWhen,
    supportRequest,
    ticketRef,
} from '@/components/Support/support';

const REFRESH_MS = 30_000;

export default function SupportTicketPage() {
    const router = useRouter();
    const { ticketId } = useParams<{ ticketId: string }>();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [resolving, setResolving] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentUser) router.replace(`/sign-in?from=/support/${ticketId}`);
    }, [currentUser, router, ticketId]);

    const load = useCallback(async () => {
        try {
            const data = await supportRequest<{ ticket: Ticket }>(
                api.support.ticket(ticketId),
            );
            setTicket(data.ticket);
            setError('');
        } catch (err) {
            if ((err as { status?: number }).status === 404) setNotFound(true);
            else
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Couldn’t load this request.',
                );
        }
    }, [ticketId]);

    // Load now, then check for replies while the page is open.
    useEffect(() => {
        if (!currentUser) return;
        load();
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') load();
        }, REFRESH_MS);
        const onVisible = () => {
            if (document.visibilityState === 'visible') load();
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [currentUser, load]);

    const messageCount = ticket?.messages.length || 0;
    useEffect(() => {
        if (messageCount) endRef.current?.scrollIntoView({ block: 'nearest' });
    }, [messageCount]);

    const send = async (event?: FormEvent) => {
        event?.preventDefault();
        const message = reply.trim();
        if (!message || sending) return;
        setSending(true);
        try {
            const data = await supportRequest<{ ticket: Ticket }>(
                api.support.messages(ticketId),
                { method: 'POST', body: JSON.stringify({ message }) },
            );
            setTicket(data.ticket);
            setReply('');
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : 'Couldn’t send your reply.',
            );
        } finally {
            setSending(false);
        }
    };

    const resolve = async () => {
        setResolving(true);
        try {
            const data = await supportRequest<{ ticket: Ticket }>(
                api.support.resolve(ticketId),
                { method: 'POST' },
            );
            setTicket(data.ticket);
            toast.success('Marked as solved. Glad we could help!');
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : 'Couldn’t update the request.',
            );
        } finally {
            setResolving(false);
        }
    };

    if (!currentUser) return null;

    const back = (
        <Link
            href='/support'
            className='inline-flex items-center gap-1.5 mb-4 text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#0075de] transition-colors'
        >
            <ArrowLeft className='w-4 h-4' />
            All requests
        </Link>
    );

    if (notFound) {
        return (
            <>
                {back}
                <div className='text-center py-14 px-6 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl'>
                    <p className='font-semibold'>
                        We couldn’t find this request
                    </p>
                    <p className='mt-1 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97]'>
                        It may have been sent from another account.
                    </p>
                </div>
            </>
        );
    }

    if (!ticket) {
        return (
            <>
                {back}
                {error ? (
                    <div
                        role='alert'
                        className='p-4 rounded-lg bg-[#fdecec] dark:bg-[#3d1818] text-sm text-[#c4352d] dark:text-[#ff8a80]'
                    >
                        {error}{' '}
                        <button
                            type='button'
                            onClick={load}
                            className='font-semibold underline cursor-pointer'
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className='flex justify-center py-16 text-[#787774]'>
                        <Loader2 className='w-5 h-5 animate-spin' />
                    </div>
                )}
            </>
        );
    }

    const open = OPEN_STATUSES.includes(ticket.status);

    return (
        <>
            {back}
            <div className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl overflow-hidden'>
                <div className='px-5 sm:px-6 py-5 border-b border-[#efeeec] dark:border-[#2a2a2a]'>
                    <div className='flex flex-wrap items-center gap-2 mb-2'>
                        <span className='text-xs text-[#787774] dark:text-[#9b9a97]'>
                            <span className='font-mono'>
                                {ticketRef(ticket)}
                            </span>{' '}
                            · {CATEGORY_LABELS[ticket.category] || 'Other'}
                        </span>
                        <StatusBadge status={ticket.status} />
                    </div>
                    <h1 className='text-lg sm:text-2xl font-bold tracking-tight break-words'>
                        {ticket.subject}
                    </h1>
                    <p className='mt-1 text-xs text-[#787774] dark:text-[#9b9a97]'>
                        Sent {formatWhen(ticket.createdAt)}
                    </p>
                </div>

                <ol
                    aria-label='Conversation'
                    className='flex flex-col gap-5 px-5 sm:px-6 py-6'
                >
                    {ticket.messages.map((message) => {
                        const mine = message.author === 'user';
                        return (
                            <li
                                key={message._id}
                                className={`flex gap-2.5 max-w-[90%] ${
                                    mine
                                        ? 'self-end flex-row-reverse'
                                        : 'self-start'
                                }`}
                            >
                                {!mine && (
                                    <Image
                                        src='/assets/cropped_circle_image.png'
                                        alt=''
                                        width={28}
                                        height={28}
                                        className='w-7 h-7 rounded-full ring-1 ring-[#e6e6e6] dark:ring-[#383838] shrink-0 mt-5'
                                    />
                                )}
                                <div
                                    className={`flex flex-col gap-1 min-w-0 ${
                                        mine ? 'items-end' : 'items-start'
                                    }`}
                                >
                                    <span className='text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                        {mine ? 'You' : message.authorName} ·{' '}
                                        {formatWhen(message.createdAt)}
                                    </span>
                                    <p
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                            mine
                                                ? 'bg-[#0075de] text-white rounded-br-md'
                                                : 'bg-[#f1f0ee] dark:bg-[#2a2a2a] text-[#191919] dark:text-[#ececec] rounded-bl-md'
                                        }`}
                                    >
                                        {message.body}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
                <div ref={endRef} />

                {ticket.canReply ? (
                    <form
                        onSubmit={send}
                        className='px-5 sm:px-6 py-4 border-t border-[#efeeec] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#1c1c1c]'
                    >
                        {ticket.status === 'resolved' && (
                            <p className='mb-2 text-xs text-[#787774] dark:text-[#9b9a97]'>
                                This request is solved. Writing again reopens
                                it.
                            </p>
                        )}
                        <label htmlFor='support-reply' className='sr-only'>
                            Your reply
                        </label>
                        <textarea
                            id='support-reply'
                            value={reply}
                            onChange={(event) => setReply(event.target.value)}
                            onKeyDown={(event) => {
                                if (
                                    (event.metaKey || event.ctrlKey) &&
                                    event.key === 'Enter'
                                )
                                    send();
                            }}
                            rows={3}
                            maxLength={4000}
                            placeholder='Write a reply…'
                            className='block w-full p-3 text-sm border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg bg-white dark:bg-[#191919] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/20 resize-y'
                        />
                        <div className='flex flex-wrap items-center justify-end gap-2 mt-3'>
                            {open && (
                                <button
                                    type='button'
                                    onClick={resolve}
                                    disabled={resolving}
                                    className='inline-flex items-center gap-1.5 py-2 px-3.5 text-xs sm:text-sm font-medium rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#262626] disabled:opacity-50 cursor-pointer'
                                >
                                    {resolving ? (
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                    ) : (
                                        <CheckCircle2 className='w-4 h-4 text-emerald-600' />
                                    )}
                                    My issue is solved
                                </button>
                            )}
                            <button
                                type='submit'
                                disabled={sending || !reply.trim()}
                                className='inline-flex items-center gap-1.5 py-2 px-4 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0075de] hover:bg-[#0060b9] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                            >
                                {sending ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                    <Send className='w-4 h-4' />
                                )}
                                Send
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='px-5 sm:px-6 py-4 border-t border-[#efeeec] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#1c1c1c] text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98]'>
                        This request is closed.{' '}
                        <Link
                            href={`/contact-us${ticket.ticketNumber ? `?ref=${ticket.ticketNumber}` : ''}`}
                            className='font-semibold text-[#0075de] hover:underline'
                        >
                            Start a new request
                        </Link>{' '}
                        if you still need help.
                    </div>
                )}
            </div>
        </>
    );
}
