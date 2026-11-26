'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
    Check,
    FileQuestion,
    Loader2,
    Upload,
    Users,
    Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import { RootState } from '@/redux/store';

// Midsem 1, Midsem 2 and Endsem papers this subject is missing for the
// running session and the two before it. Each can be uploaded or requested.

export type ExamSlot = 'midsem1' | 'midsem2' | 'endsem';

interface Slot {
    year: string;
    examType: ExamSlot;
    approved: number;
    pending: number;
    requests: number;
    requestedByMe: boolean;
}

// Points a student gets when an uploaded PYQ is approved.
const UPLOAD_REWARD_POINTS = 10;
// Cards shown before "Show all".
const FIRST_CARDS = 6;

const EXAM_NAMES: Record<ExamSlot, string> = {
    midsem1: 'Midsem 1',
    midsem2: 'Midsem 2',
    endsem: 'Endsem',
};

const slotKey = (slot: Pick<Slot, 'year' | 'examType'>) =>
    `${slot.year}|${slot.examType}`;

const students = (n: number) => `${n} student${n === 1 ? '' : 's'}`;

function demandLine(slot: Slot) {
    const others = slot.requests - (slot.requestedByMe ? 1 : 0);
    if (slot.requestedByMe && others > 0)
        return `You and ${others} other student${others === 1 ? '' : 's'} are waiting for this paper.`;
    if (slot.requestedByMe) return "You asked for this paper. We're on it.";
    if (slot.requests > 0)
        return `${students(slot.requests)} ${
            slot.requests === 1 ? 'is' : 'are'
        } waiting for this paper. Upload it and help them out!`;
    return 'Nobody has shared this one yet. Be the first to upload it.';
}

interface MissingPyqsProps {
    subjectId?: string;
    /** Opens the upload form with this session and exam filled in. */
    onUpload: (slot: { year: string; examType: ExamSlot }) => void;
    /** Changes after an upload, so the list is fetched again. */
    refreshKey?: number;
}

export default function MissingPyqs({
    subjectId,
    onUpload,
    refreshKey = 0,
}: MissingPyqsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const userId = currentUser?._id;

    const [slots, setSlots] = useState<Slot[] | null>(null);
    const [sending, setSending] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const load = useCallback(async () => {
        if (!subjectId) return;
        try {
            const response = await fetch(api.pyq.slots(subjectId), {
                credentials: 'include',
                cache: 'no-store',
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data?.data?.slots)) {
                setSlots(data.data.slots);
            }
        } catch {
            // Optional extra: the paper list still works without it.
        }
    }, [subjectId]);

    // Reload after sign-in (for "Requested") and after an upload.
    useEffect(() => {
        load();
    }, [load, userId, refreshKey]);

    const signIn = (why: string) => {
        toast(why);
        router.push(`/sign-in?from=${pathname}`);
    };

    const upload = (slot: Slot) => {
        if (!currentUser) {
            signIn('Sign in to upload a paper');
            return;
        }
        onUpload({ year: slot.year, examType: slot.examType });
    };

    const request = async (slot: Slot) => {
        if (!currentUser) {
            signIn('Sign in to request a paper');
            return;
        }
        const key = slotKey(slot);
        setSending(key);
        try {
            const response = await fetch(api.pyq.requestSlot, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    subject: subjectId,
                    year: slot.year,
                    examType: slot.examType,
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (response.status === 401) {
                router.push(`/sign-in?from=${pathname}`);
                return;
            }
            if (!response.ok) {
                toast.error(data?.message || 'Could not send the request');
                if (response.status === 409) load();
                return;
            }
            toast.success(data?.message || 'Request saved');
            setSlots((prev) =>
                (prev || []).map((s) =>
                    slotKey(s) === key
                        ? {
                              ...s,
                              requests: data?.data?.requests ?? s.requests + 1,
                              requestedByMe: true,
                          }
                        : s,
                ),
            );
        } catch {
            toast.error('Could not send the request');
        } finally {
            setSending(null);
        }
    };

    // Papers waiting for review are on their way, so they are not "missing".
    // Most-wanted first; otherwise newest session first, as the API sends them.
    const missing = (slots || [])
        .filter((s) => !s.approved && !s.pending)
        .map((slot, order) => ({ slot, order }))
        .sort((a, b) => b.slot.requests - a.slot.requests || a.order - b.order)
        .map(({ slot }) => slot);
    if (!missing.length) return null;

    const shown = showAll ? missing : missing.slice(0, FIRST_CARDS);
    const wanted = missing.filter((s) => s.requests > 0).length;

    return (
        <section
            aria-labelledby='missing-pyqs-title'
            className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 shadow-sm'
        >
            <div className='flex items-start gap-3 mb-5'>
                <FileQuestion className='w-5 h-5 mt-0.5 text-[#8c8883] dark:text-[#787672] shrink-0' />
                <div>
                    <h2
                        id='missing-pyqs-title'
                        className='text-base font-bold text-[#101828] dark:text-white'
                    >
                        Missing papers
                        <span className='ml-2 px-2 py-0.5 text-xs rounded-full font-bold bg-[#e6e6e6] dark:bg-[#383838] text-[#475467] dark:text-[#a09e9a] align-middle'>
                            {missing.length}
                        </span>
                    </h2>
                    <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mt-1'>
                        {wanted > 0
                            ? `Students are waiting for ${wanted} of these papers from the last three sessions. `
                            : 'These papers from the last three sessions are not here yet. '}
                        Have one? Upload it to help your classmates and juniors, and earn{' '}
                        <span className='font-semibold text-[#101828] dark:text-[#ededed]'>
                            {UPLOAD_REWARD_POINTS} points
                        </span>{' '}
                        when it&apos;s approved.
                    </p>
                </div>
            </div>

            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                {shown.map((slot) => {
                    const key = slotKey(slot);
                    const busy = sending === key;
                    const wanted = slot.requests > 0;
                    return (
                        <li
                            key={key}
                            className={`flex flex-col gap-3 rounded-xl border p-4 ${
                                wanted
                                    ? 'border-[#fce8b2] dark:border-[#4a3b1c] bg-[#fffbeb] dark:bg-[#2a2416]'
                                    : 'border-[#e6e6e6] dark:border-[#383838] bg-[#f9f8f7] dark:bg-[#212121]'
                            }`}
                        >
                            <div className='flex items-start justify-between gap-2'>
                                <div>
                                    <p className='text-base font-bold text-[#101828] dark:text-white leading-tight'>
                                        {EXAM_NAMES[slot.examType]}
                                    </p>
                                    <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mt-1'>
                                        {slot.year}
                                    </p>
                                </div>
                                {wanted && (
                                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#fef3c7] dark:bg-[#3d3119] text-[#b06000] dark:text-[#fbbc04] whitespace-nowrap'>
                                        <Users className='w-3 h-3' />
                                        {slot.requests} waiting
                                    </span>
                                )}
                            </div>

                            <p className='text-[13px] leading-snug text-[#475467] dark:text-[#a09e9a]'>
                                {demandLine(slot)}
                            </p>

                            <div className='mt-auto flex flex-wrap items-center gap-2'>
                                <button
                                    type='button'
                                    onClick={() => upload(slot)}
                                    aria-label={`Upload ${EXAM_NAMES[slot.examType]} ${slot.year} paper`}
                                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0075de] hover:bg-[#0062bd] text-white transition-colors active:scale-[0.98]'
                                >
                                    <Upload className='w-3.5 h-3.5' />
                                    Upload
                                </button>
                                {slot.requestedByMe ? (
                                    <span className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#e6f4ea] dark:bg-[#1e3a29] text-[#137333] dark:text-[#34a853]'>
                                        <Check className='w-3.5 h-3.5' />
                                        Requested
                                    </span>
                                ) : (
                                    <button
                                        type='button'
                                        onClick={() => request(slot)}
                                        disabled={busy}
                                        aria-label={`Request ${EXAM_NAMES[slot.examType]} ${slot.year} paper`}
                                        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#282828] text-[#344054] dark:text-[#d0d0d0] border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#f6f5f4] dark:hover:bg-[#333] transition-colors disabled:opacity-60'
                                    >
                                        {busy && (
                                            <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                        )}
                                        Request
                                    </button>
                                )}
                                <span className='ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#8c8883] dark:text-[#787672]'>
                                    <Sparkles className='w-3 h-3' />+
                                    {UPLOAD_REWARD_POINTS} pts
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {missing.length > FIRST_CARDS && (
                <button
                    type='button'
                    onClick={() => setShowAll((v) => !v)}
                    className='mt-4 text-sm font-semibold text-[#0075de] dark:text-[#62aef0] hover:underline'
                >
                    {showAll
                        ? 'Show fewer'
                        : `Show all ${missing.length} missing papers`}
                </button>
            )}
        </section>
    );
}
