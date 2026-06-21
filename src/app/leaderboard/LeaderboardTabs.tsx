'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface IUser {
    userId: string;
    username: string;
    profilePicture: string;
    totalPoints: number;
    month: number;
    points: number;
}

export interface IContributor {
    userId: string;
    username: string;
    profilePicture: string;
    college?: string;
    notesCount: number;
    pyqsCount: number;
    totalContributions: number;
}

const DEFAULT_AVATAR = '/default-profile.png';

type Tab = 'month' | 'allTime';

function getMonthName(monthIndex: number) {
    return new Date(
        Date.UTC(2000, Math.max(0, monthIndex - 1), 1),
    ).toLocaleString('default', { month: 'long' });
}

function Avatar({
    src,
    alt,
    size,
    className = '',
}: {
    src?: string;
    alt: string;
    size: number;
    className?: string;
}) {
    return (
        <Image
            src={src || DEFAULT_AVATAR}
            alt={alt || 'User profile'}
            width={size}
            height={size}
            style={{ width: size, height: size }}
            className={`rounded-full object-cover ${className}`}
        />
    );
}

/* ---------- Generic podium ---------- */

interface PodiumEntry {
    userId: string;
    username: string;
    profilePicture: string;
    value: number;
    valueLabel: string;
    subStats?: { label: string; value: number; className: string }[];
}

function PodiumCard({
    entry,
    rank,
}: {
    entry: PodiumEntry;
    rank: 1 | 2 | 3;
}) {
    const config = {
        1: {
            medal: '🥇',
            wrapper:
                'w-full md:w-1/3 order-1 md:order-2 p-8 rounded-t-2xl shadow-2xl border-amber-400 bg-gradient-to-b from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 md:hover:-translate-y-4',
            avatar: 100,
            avatarBorder: 'border-amber-400',
            name: 'text-2xl font-extrabold text-amber-900 dark:text-amber-300',
            value: 'text-3xl text-amber-700 dark:text-amber-400',
        },
        2: {
            medal: '🥈',
            wrapper:
                'w-full md:w-1/4 order-2 md:order-1 p-6 rounded-t-xl shadow-lg border-slate-400 bg-white dark:bg-slate-800 md:hover:-translate-y-2',
            avatar: 80,
            avatarBorder: 'border-slate-400',
            name: 'text-xl font-bold',
            value: 'text-2xl text-slate-600 dark:text-slate-300',
        },
        3: {
            medal: '🥉',
            wrapper:
                'w-full md:w-1/4 order-3 md:order-3 p-6 rounded-t-xl shadow-lg border-orange-600 bg-white dark:bg-slate-800 md:hover:-translate-y-2',
            avatar: 70,
            avatarBorder: 'border-orange-600',
            name: 'text-xl font-bold',
            value: 'text-2xl text-slate-600 dark:text-slate-300',
        },
    }[rank];

    return (
        <div
            className={`border-b-8 transform transition-transform duration-300 ${config.wrapper}`}
        >
            <div className='flex flex-col items-center text-center'>
                <div className='relative mb-4'>
                    <Avatar
                        src={entry.profilePicture}
                        alt={entry.username}
                        size={config.avatar}
                        className={`border-4 shadow-md ${config.avatarBorder}`}
                    />
                    <span
                        className='absolute -top-2 -right-2 text-3xl'
                        aria-label={`Rank ${rank}`}
                    >
                        {config.medal}
                    </span>
                </div>
                <h3 className={`truncate w-full ${config.name}`}>
                    {entry.username}
                </h3>
                <p className={`font-bold mt-2 ${config.value}`}>
                    {entry.value}{' '}
                    <span className='text-sm font-medium'>
                        {entry.valueLabel}
                    </span>
                </p>
                {entry.subStats && (
                    <div className='flex gap-3 mt-3 text-sm font-medium'>
                        {entry.subStats.map((s) => (
                            <span key={s.label} className={s.className}>
                                {s.value} {s.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Podium({ entries }: { entries: PodiumEntry[] }) {
    const [first, second, third] = entries;
    return (
        <div className='flex flex-col md:flex-row justify-center items-end gap-4 md:gap-2'>
            {second && <PodiumCard entry={second} rank={2} />}
            {first && <PodiumCard entry={first} rank={1} />}
            {third && <PodiumCard entry={third} rank={3} />}
        </div>
    );
}

/* ---------- Tabs container ---------- */

export default function LeaderboardTabs({
    leaderboard,
    previousWinners,
    contributors,
}: {
    leaderboard: IUser[];
    previousWinners: IUser[];
    contributors: IContributor[];
}) {
    const [tab, setTab] = useState<Tab>('month');

    const totalNotes = contributors.reduce((s, c) => s + c.notesCount, 0);
    const totalPyqs = contributors.reduce((s, c) => s + c.pyqsCount, 0);

    return (
        <>
            {/* --- Tab switcher --- */}
            <div className='flex justify-center mb-12'>
                <div className='inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full shadow-inner'>
                    <button
                        onClick={() => setTab('month')}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                            tab === 'month'
                                ? 'bg-white dark:bg-slate-950 text-amber-600 dark:text-amber-400 shadow'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                        🏆 This Month
                    </button>
                    <button
                        onClick={() => setTab('allTime')}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                            tab === 'allTime'
                                ? 'bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                        💙 All-Time Contributors
                    </button>
                </div>
            </div>

            {tab === 'month' ? (
                <MonthTab
                    leaderboard={leaderboard}
                    previousWinners={previousWinners}
                />
            ) : (
                <AllTimeTab
                    contributors={contributors}
                    totalNotes={totalNotes}
                    totalPyqs={totalPyqs}
                />
            )}
        </>
    );
}

/* ---------- This-month tab (points) ---------- */

function MonthTab({
    leaderboard,
    previousWinners,
}: {
    leaderboard: IUser[];
    previousWinners: IUser[];
}) {
    const podium: PodiumEntry[] = leaderboard.slice(0, 3).map((u) => ({
        userId: u.userId,
        username: u.username,
        profilePicture: u.profilePicture,
        value: u.totalPoints,
        valueLabel: 'Points',
    }));
    const remaining = leaderboard.slice(3);

    if (leaderboard.length === 0) {
        return (
            <EmptyState
                title="The Race Hasn't Started Yet!"
                message='No leaderboard data is available for this month. Start contributing to be the first!'
            />
        );
    }

    return (
        <>
            <section className='mb-16'>
                <h2 className='text-3xl font-bold text-center text-slate-900 dark:text-white mb-10'>
                    This Month&apos;s Titans
                </h2>
                <Podium entries={podium} />
            </section>

            {remaining.length > 0 && (
                <section className='max-w-3xl mx-auto mb-16'>
                    <h2 className='text-2xl font-bold text-center text-slate-900 dark:text-white mb-8'>
                        Top Contributors
                    </h2>
                    <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700'>
                        <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {remaining.map((user, index) => (
                                <li
                                    key={user.userId}
                                    className='flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
                                >
                                    <div className='flex items-center gap-4 min-w-0'>
                                        <span className='font-bold text-lg text-slate-500 w-6 text-center shrink-0'>
                                            {index + 4}
                                        </span>
                                        <Avatar
                                            src={user.profilePicture}
                                            alt={user.username}
                                            size={40}
                                            className='shrink-0'
                                        />
                                        <span className='font-semibold truncate'>
                                            {user.username}
                                        </span>
                                    </div>
                                    <span className='font-bold text-blue-600 dark:text-blue-400 shrink-0'>
                                        {user.totalPoints} Points
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {previousWinners.length > 0 && (
                <section className='pt-4'>
                    <h2 className='text-2xl font-bold text-center text-slate-900 dark:text-white mb-8'>
                        Recent Champions
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                        {previousWinners.map((winner, index) => (
                            <div
                                key={index}
                                className='bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:shadow-lg transition-shadow'
                            >
                                <Avatar
                                    src={winner.profilePicture}
                                    alt={winner.username}
                                    size={50}
                                    className='border-2 border-amber-500'
                                />
                                <div>
                                    <h4 className='font-semibold'>
                                        {winner.username}
                                    </h4>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                                        {getMonthName(winner.month)} Winner 🏆
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

/* ---------- All-time tab (notes + pyqs counts) ---------- */

function AllTimeTab({
    contributors,
    totalNotes,
    totalPyqs,
}: {
    contributors: IContributor[];
    totalNotes: number;
    totalPyqs: number;
}) {
    const podium: PodiumEntry[] = contributors.slice(0, 3).map((c) => ({
        userId: c.userId,
        username: c.username,
        profilePicture: c.profilePicture,
        value: c.totalContributions,
        valueLabel: 'resources',
        subStats: [
            {
                label: 'Notes',
                value: c.notesCount,
                className: 'text-blue-600 dark:text-blue-400',
            },
            {
                label: 'PYQs',
                value: c.pyqsCount,
                className: 'text-purple-600 dark:text-purple-400',
            },
        ],
    }));
    const remaining = contributors.slice(3);

    if (contributors.length === 0) {
        return (
            <EmptyState
                title='No Contributions Yet!'
                message='Be the first to share notes or PYQs and get featured here.'
            />
        );
    }

    return (
        <>
            {/* Stat cards */}
            <div className='flex flex-wrap justify-center gap-4 mb-12'>
                <StatCard
                    value={totalNotes}
                    label='Notes shared'
                    className='bg-blue-500/10 dark:bg-blue-400/10 border-blue-500/40 text-blue-700 dark:text-blue-300'
                />
                <StatCard
                    value={totalPyqs}
                    label='PYQs shared'
                    className='bg-purple-500/10 dark:bg-purple-400/10 border-purple-500/40 text-purple-700 dark:text-purple-300'
                />
                <StatCard
                    value={contributors.length}
                    label='Contributors'
                    className='bg-amber-500/10 dark:bg-amber-400/10 border-amber-500/40 text-amber-700 dark:text-amber-300'
                />
            </div>

            <section className='mb-16'>
                <h2 className='text-3xl font-bold text-center text-slate-900 dark:text-white mb-10'>
                    All-Time Legends
                </h2>
                <Podium entries={podium} />
            </section>

            {remaining.length > 0 && (
                <section className='max-w-3xl mx-auto mb-16'>
                    <h2 className='text-2xl font-bold text-center text-slate-900 dark:text-white mb-8'>
                        More Amazing Contributors
                    </h2>
                    <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700'>
                        <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
                            {remaining.map((c, index) => (
                                <li
                                    key={c.userId}
                                    className='flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'
                                >
                                    <div className='flex items-center gap-4 min-w-0'>
                                        <span className='font-bold text-lg text-slate-500 w-6 text-center shrink-0'>
                                            {index + 4}
                                        </span>
                                        <Avatar
                                            src={c.profilePicture}
                                            alt={c.username}
                                            size={40}
                                            className='shrink-0'
                                        />
                                        <span className='font-semibold truncate'>
                                            {c.username}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-3 shrink-0 text-sm'>
                                        <span className='text-blue-600 dark:text-blue-400 font-medium hidden sm:inline'>
                                            {c.notesCount} Notes
                                        </span>
                                        <span className='text-purple-600 dark:text-purple-400 font-medium hidden sm:inline'>
                                            {c.pyqsCount} PYQs
                                        </span>
                                        <span className='font-bold text-slate-900 dark:text-white'>
                                            {c.totalContributions}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    );
}

/* ---------- Small shared bits ---------- */

function StatCard({
    value,
    label,
    className,
}: {
    value: number;
    label: string;
    className: string;
}) {
    return (
        <div className={`border rounded-xl px-6 py-3 text-center ${className}`}>
            <span className='block text-2xl font-bold'>{value}</span>
            <span className='text-sm font-medium'>{label}</span>
        </div>
    );
}

function EmptyState({ title, message }: { title: string; message: string }) {
    return (
        <section className='text-center bg-white dark:bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-200 dark:border-slate-700 p-12 shadow-md'>
            <h2 className='text-2xl font-semibold text-slate-800 dark:text-white mb-3'>
                {title}
            </h2>
            <p className='text-slate-500 dark:text-slate-400'>{message}</p>
        </section>
    );
}
