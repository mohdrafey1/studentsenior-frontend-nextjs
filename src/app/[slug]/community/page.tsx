import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CollegePageProps } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import InstallAppCTA from './InstallAppCTA';

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Community - ${capitalizeWords(slug)}`,
        description:
            'Join college group chats, ask questions, and connect with your community.',
    };
}

interface CommunityGroup {
    _id: string;
    name: string;
    description?: string;
    memberCount: number;
    lastMessageAt?: string;
}

export default async function CommunitiesPage({ params }: CollegePageProps) {
    const { slug } = await params;

    let groups: CommunityGroup[] = [];
    try {
        const res = await fetch(api.community.listByCollege(slug), {
            next: { revalidate: 60 },
        });
        const data = await res.json();
        groups = data?.data?.groups || [];
    } catch {
        groups = [];
    }

    return (
        <main className='max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2'>
                        Community - {capitalizeWords(slug)}
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl'>
                        Join group chats, ask questions, and connect with your
                        college community.
                    </p>
                </div>
                <InstallAppCTA label='Create Group' />
            </header>

            {/* App-install banner */}
            <div className='mb-6 rounded-2xl border border-sky-200/60 dark:border-sky-900/60 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 p-4 sm:flex sm:items-center sm:justify-between'>
                <p className='text-sm text-sky-900 dark:text-sky-200 mb-3 sm:mb-0'>
                    💬 Chatting, anonymous posting & notifications live in the
                    app. The web shows a preview only.
                </p>
                <InstallAppCTA label='Get the app' />
            </div>

            {groups.length === 0 ? (
                <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm'>
                    <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200 mb-2'>
                        No groups yet
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 mb-6'>
                        Be the first to start a community for{' '}
                        {capitalizeWords(slug)} — in the app.
                    </p>
                    <div className='flex justify-center'>
                        <InstallAppCTA label='Create Group' />
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {groups.map((group) => (
                        <Link
                            key={group._id}
                            href={`/${slug}/community/${group._id}`}
                            className='group flex flex-col rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-5 shadow-sm hover:border-sky-300/60 hover:shadow-xl transition-all duration-300'
                        >
                            <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-900/40 dark:to-cyan-900/40'>
                                <svg
                                    className='h-5 w-5 text-sky-600'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                                    />
                                </svg>
                            </div>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white line-clamp-1'>
                                {group.name}
                            </h3>
                            {group.description ? (
                                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                                    {group.description}
                                </p>
                            ) : null}
                            <span className='mt-3 text-xs font-medium text-gray-400'>
                                {group.memberCount} member
                                {group.memberCount === 1 ? '' : 's'}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
