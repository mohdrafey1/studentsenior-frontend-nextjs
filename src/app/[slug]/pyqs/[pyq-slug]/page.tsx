import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import PyqDetailClient from './PyqDetailClient';

interface PyqDetailPageProps {
    params: Promise<{ 'pyq-slug': string }>;
}

export async function generateMetadata({
    params,
}: PyqDetailPageProps): Promise<Metadata> {
    const { 'pyq-slug': pyqSlug } = await params;

    const title = `${capitalizeWords(pyqSlug)} - PYQs`;
    const description = 'PYQ PDF for exam preparation';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: '/image192edge.png',
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/image192edge.png'],
        },
    };
}

export default async function PyqDetailPage({ params }: PyqDetailPageProps) {
    const { 'pyq-slug': pyqSlug } = await params;

    let pyq = null;

    try {
        const url = `${api.pyq.getPyqBySlug(pyqSlug)}`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        pyq = data?.data || null;
    } catch (error) {
        console.error('Error fetching pyq details:', error);
    }

    if (!pyq) {
        return (
            <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <div className='text-center py-12'>
                    <h1 className='text-2xl font-fugaz font-bold text-gray-900 dark:text-white mb-4'>
                        PYQ Not Found
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        The PYQ you&apos;re looking for doesn&apos;t exist or
                        has been removed.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <PyqDetailClient pyq={pyq} />
        </main>
    );
}
