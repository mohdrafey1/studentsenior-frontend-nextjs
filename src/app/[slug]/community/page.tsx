import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps } from '@/utils/interface';

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Community - ${capitalizeWords(slug)}`,
        description:
            'Connect, share, and ask your questions and doubts through the community.',
    };
}

export default async function CommunitiesPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    return (
        <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='text-center mb-8'>
                <h1 className='text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3'>
                    Community - {capitalizeWords(collegeName)}
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                    &quot;Connect, share, and ask your questions and doubts
                    through the community.&quot;
                </p>
            </header>
            <div className='text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                <p>This feature is coming soon...</p>
                <p>Join our whatsapp group as of now to get updates</p>
                <br />
                <a
                    href='https://chat.whatsapp.com/JcpNIv3SRBYKAXEPE6pk9Y?mode=ac_t'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4'
                >
                    <button className='bg-sky-500 text-white px-4 py-2 rounded-md'>
                        Join Whatsapp Group
                    </button>
                </a>
            </div>
        </main>
    );
}
