'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
    ArrowRight,
    CheckCircle2,
    Inbox,
    Loader2,
    Mail,
    MessageSquare,
    Send,
} from 'lucide-react';
import { api } from '@/config/apiUrls';
import { RootState } from '@/redux/store';
import {
    CATEGORIES,
    TicketSummary,
    supportRequest,
    ticketRef,
} from './support';

const LABEL =
    'block text-[11px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1.5';
const INPUT =
    'block w-full text-xs sm:text-sm border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-lg bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/20 transition-all';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Reports and feedback don't need a reply, so guests may leave out their email.
const EMAIL_OPTIONAL = ['content-report', 'content-request', 'feedback', 'bug'];

interface Sent {
    ticket: TicketSummary | null;
    email: string;
}

/**
 * The "Help & support" form. Signed-in students follow the conversation under
 * Support; guests get replies by email. `?ref=1042` starts a follow-up.
 */
export default function SupportRequestForm() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const signedIn = Boolean(currentUser);
    const ref = useSearchParams().get('ref');
    const followUp = ref && /^\d{1,9}$/.test(ref) ? ref : null;

    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState(
        followUp ? `Follow-up on request #${followUp}` : '',
    );
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    // Hidden from people; bots that fill every field give themselves away.
    const [website, setWebsite] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState<Sent | null>(null);

    const isReport = category === 'content-report';
    const emailOptional = EMAIL_OPTIONAL.includes(category);

    const validate = () => {
        if (!category) return 'Choose what your message is about.';
        if (subject.trim().length < 3) return 'Add a short subject.';
        if (message.trim().length < (isReport ? 1 : 10))
            return 'Tell us a little more (at least 10 characters).';
        if (!signedIn && !emailOptional && !EMAIL_PATTERN.test(email.trim()))
            return 'Enter your email so we can reply to you.';
        if (!signedIn && email.trim() && !EMAIL_PATTERN.test(email.trim()))
            return 'Check your email address.';
        return '';
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await supportRequest<{ ticket: TicketSummary | null }>(
                api.support.tickets,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        category,
                        subject: subject.trim(),
                        message: message.trim(),
                        ...(!signedIn && email.trim()
                            ? { email: email.trim() }
                            : {}),
                        context: { platform: 'web' },
                        website,
                    }),
                },
            );
            setSent({ ticket: data.ticket, email: email.trim() });
        } catch (err) {
            const text =
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.';
            setError(text);
            toast.error(text);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSent(null);
        setCategory('');
        setSubject('');
        setMessage('');
    };

    if (sent) {
        const number = sent.ticket ? ticketRef(sent.ticket) : '';
        return (
            <div className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl p-6 sm:p-8 shadow-xs text-center'>
                <div className='w-11 h-11 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                    <CheckCircle2 className='w-6 h-6' />
                </div>
                <h2 className='text-lg sm:text-xl font-bold text-[#191919] dark:text-[#ececec]'>
                    {number ? `Request ${number} sent` : 'Request sent'}
                </h2>
                <p className='mt-2 text-xs sm:text-sm text-[#787774] dark:text-[#9b9a97] max-w-sm mx-auto leading-relaxed'>
                    {signedIn
                        ? 'We’ll reply here and by email, usually within a day. You’ll find the conversation under Support.'
                        : sent.email
                          ? `We’ll reply to ${sent.email}, usually within a day.`
                          : 'Thanks for letting us know. We’ll look into it.'}
                </p>
                <div className='mt-6 flex flex-wrap items-center justify-center gap-2.5'>
                    {signedIn && sent.ticket && (
                        <Link
                            href={`/support/${sent.ticket._id}`}
                            className='inline-flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0075de] hover:bg-[#0060b9] transition-colors'
                        >
                            View your request
                            <ArrowRight className='w-4 h-4' />
                        </Link>
                    )}
                    <button
                        type='button'
                        onClick={reset}
                        className='py-2.5 px-4 text-xs sm:text-sm font-medium rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#191919] dark:text-[#ececec] hover:bg-[#faf9f8] dark:hover:bg-[#262626] transition-colors cursor-pointer'
                    >
                        Send another message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl p-5 sm:p-7 shadow-xs'>
            {signedIn && (
                <Link
                    href='/support'
                    className='flex items-center gap-3 p-3 mb-5 rounded-lg bg-[#faf9f8] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#0075de]/40 transition-colors group'
                >
                    <Inbox className='w-4 h-4 text-[#0075de] shrink-0' />
                    <span className='flex-1 text-xs sm:text-sm text-[#191919] dark:text-[#ececec]'>
                        See your earlier requests and our replies
                    </span>
                    <ArrowRight className='w-4 h-4 text-[#787774] group-hover:text-[#0075de] transition-colors' />
                </Link>
            )}

            <form
                onSubmit={handleSubmit}
                noValidate
                className='space-y-4 sm:space-y-5'
            >
                <fieldset>
                    <legend className={LABEL}>
                        What do you need help with?
                    </legend>
                    <div className='flex flex-wrap gap-1.5'>
                        {CATEGORIES.map((option) => {
                            const selected = category === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type='button'
                                    aria-pressed={selected}
                                    onClick={() => {
                                        setCategory(option.value);
                                        setError('');
                                    }}
                                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                        selected
                                            ? 'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border-[#0075de]/40 font-semibold'
                                            : 'bg-[#faf9f8] dark:bg-[#191919] text-[#615d59] dark:text-[#a39e98] border-[#e6e6e6] dark:border-[#2f2f2f] hover:text-[#191919] dark:hover:text-white'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                {!signedIn && (
                    <div>
                        <label htmlFor='support-email' className={LABEL}>
                            Your email{emailOptional ? ' (optional)' : ''}
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774] dark:text-[#9b9a97]'>
                                <Mail className='h-4 w-4' />
                            </div>
                            <input
                                id='support-email'
                                type='email'
                                autoComplete='email'
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError('');
                                }}
                                className={`${INPUT} pl-9 pr-3 py-2`}
                                placeholder='name@example.com'
                                maxLength={254}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor='support-subject' className={LABEL}>
                        Subject
                    </label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787774] dark:text-[#9b9a97]'>
                            <MessageSquare className='h-4 w-4' />
                        </div>
                        <input
                            id='support-subject'
                            type='text'
                            value={subject}
                            onChange={(event) => {
                                setSubject(event.target.value);
                                setError('');
                            }}
                            className={`${INPUT} pl-9 pr-3 py-2`}
                            placeholder='What is this about?'
                            maxLength={150}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='support-message' className={LABEL}>
                        Message
                    </label>
                    <textarea
                        id='support-message'
                        value={message}
                        onChange={(event) => {
                            setMessage(event.target.value);
                            setError('');
                        }}
                        rows={5}
                        maxLength={4000}
                        className={`${INPUT} p-3 resize-y`}
                        placeholder={
                            followUp
                                ? `What would you like to add to request #${followUp}?`
                                : 'Tell us what happened and what you expected. Order or payment IDs help a lot.'
                        }
                    />
                </div>

                <div
                    aria-hidden='true'
                    className='absolute -left-[10000px] w-px h-px overflow-hidden'
                >
                    <label>
                        Website
                        <input
                            type='text'
                            tabIndex={-1}
                            autoComplete='off'
                            value={website}
                            onChange={(event) => setWebsite(event.target.value)}
                        />
                    </label>
                </div>

                {error && (
                    <p
                        role='alert'
                        className='text-xs sm:text-sm text-[#e03e3e] dark:text-[#ff7369]'
                    >
                        {error}
                    </p>
                )}

                <p className='text-[11px] text-[#787774] dark:text-[#9b9a97] leading-relaxed'>
                    {signedIn ? (
                        <>
                            Signed in as{' '}
                            <span className='font-semibold text-[#191919] dark:text-[#ececec]'>
                                @{currentUser?.username}
                            </span>
                            . You’ll get our reply here and by email.
                        </>
                    ) : (
                        <>
                            We’ll reply to your email.{' '}
                            <Link
                                href='/sign-in?from=/contact-us'
                                className='font-semibold text-[#0075de] hover:underline'
                            >
                                Sign in
                            </Link>{' '}
                            to follow the conversation on StudentSenior too.
                        </>
                    )}
                </p>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg text-white bg-[#0075de] hover:bg-[#0060b9] shadow-2xs focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                    {loading ? (
                        <>
                            <Loader2 className='animate-spin h-4 w-4' />
                            <span>Sending…</span>
                        </>
                    ) : (
                        <>
                            <Send className='h-4 w-4' />
                            <span>Send message</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
