import type { Metadata } from 'next';
import Link from 'next/link';
import { capitalizeWords } from '@/utils/formatting';
import { api } from '@/config/apiUrls';
import InstallAppCTA from '../InstallAppCTA';

interface PageProps {
    params: Promise<{ slug: string; groupId: string }>;
}

interface PreviewMessage {
    _id: string;
    content: string;
    type: 'text' | 'system';
    isAnonymous: boolean;
    createdAt?: string;
    author: { name: string; avatar: string };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Community Chat - ${capitalizeWords(slug)}`,
        description: 'Read a preview of the community chat. Join in the app.',
    };
}

export default async function CommunityGroupPreview({ params }: PageProps) {
    const { slug, groupId } = await params;

    let messages: PreviewMessage[] = [];
    try {
        // Web preview is capped server-side at 50 messages.
        const res = await fetch(
            `${api.community.getMessages(groupId)}?limit=50`,
            { next: { revalidate: 30 } }
        );
        const data = await res.json();
        messages = data?.data?.messages || [];
    } catch {
        messages = [];
    }

    return (
        <main className='mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-4 sm:px-6'>
            {/* Header */}
            <div className='mb-3 flex items-center gap-3'>
                <Link
                    href={`/${slug}/community`}
                    className='text-gray-500 hover:text-sky-600'
                    aria-label='Back to community'
                >
                    <svg
                        className='h-6 w-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 19l-7-7 7-7'
                        />
                    </svg>
                </Link>
                <div>
                    <h1 className='text-lg font-bold text-gray-900 dark:text-white'>
                        Community Chat
                    </h1>
                    <p className='text-xs text-gray-400'>
                        Read-only preview · {capitalizeWords(slug)}
                    </p>
                </div>
            </div>

            {/* Read-only message list */}
            <div className='flex-1 space-y-3 overflow-y-auto rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4'>
                {messages.length === 0 ? (
                    <div className='flex h-full items-center justify-center text-center text-sm text-gray-400'>
                        No messages yet. Be the first to chat — in the app.
                    </div>
                ) : (
                    messages.map((m) =>
                        m.type === 'system' ? (
                            <div
                                key={m._id}
                                className='text-center text-xs text-gray-400'
                            >
                                {m.content}
                            </div>
                        ) : (
                            <div key={m._id} className='flex flex-col'>
                                <span
                                    className={`text-xs font-semibold ${
                                        m.isAnonymous
                                            ? 'text-purple-500'
                                            : 'text-sky-600 dark:text-sky-400'
                                    }`}
                                >
                                    {m.author.name}
                                </span>
                                <div className='mt-0.5 w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 px-3.5 py-2 text-[15px] text-gray-900 dark:text-white shadow-sm'>
                                    {m.content}
                                </div>
                            </div>
                        )
                    )
                )}
            </div>

            {/* Locked composer → install app */}
            <div className='mt-3'>
                <InstallAppCTA
                    label='Install the app to join the chat'
                    variant='locked'
                    fullWidth
                />
            </div>
        </main>
    );
}
