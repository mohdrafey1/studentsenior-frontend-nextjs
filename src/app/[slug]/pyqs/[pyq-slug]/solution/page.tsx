import type { Metadata } from 'next';
import { IPyq, IPyqSolution } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import SolutionClient from './SolutionClient';
import Link from 'next/link';
import { capitalizeWords } from '@/utils/formatting';

async function getPyq(slug: string): Promise<IPyq | null> {
    try {
        const res = await fetch(api.pyq.getPyqBySlug(slug), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching PYQ:', error);
        return null;
    }
}

async function getSolution(pyqId: string): Promise<IPyqSolution | null> {
    try {
        const res = await fetch(api.pyqSolutions.getPublicSolution(pyqId), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching Solution:', error);
        return null;
    }
}

interface PageProps {
    params: Promise<{
        slug: string; // College slug
        'pyq-slug': string; // PYQ slug
    }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { 'pyq-slug': pyqSlug, slug } = await params;
    const pyq = await getPyq(pyqSlug);

    if (!pyq) {
        return {
            title: 'Solution Not Found',
        };
    }

    const title = `${pyq.subject.subjectName} Solution - ${pyq.year} ${pyq.examType} | ${capitalizeWords(slug)} PYQ`;
    const description = `Solution for ${pyq.subject.subjectName} (${pyq.subject.subjectCode}) ${pyq.year} ${pyq.examType} exam at ${capitalizeWords(slug)}. Step-by-step answers and explanations.`;
    const url = `https://studentsenior.com/${slug}/pyqs/${pyqSlug}/solution`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'Student Senior',
            type: 'article',
            images: [
                {
                    url: '/icons/image512.png',
                    width: 512,
                    height: 512,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/icons/image512.png'],
            site: '@studentsenior',
            creator: '@studentsenior',
        },
    };
}

export default async function SolutionPage({ params }: PageProps) {
    const { 'pyq-slug': pyqSlug, slug } = await params;
    const pyq = await getPyq(pyqSlug);

    if (!pyq) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-12 text-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    PYQ Not Found
                </h1>
                <Link
                    href={`/${slug}/pyqs`}
                    className='text-primary mt-4 inline-block hover:underline'
                >
                    Back to List
                </Link>
            </div>
        );
    }

    const solution = await getSolution(pyq._id);
    const pageUrl = `https://studentsenior.com/${slug}/pyqs/${pyqSlug}/solution`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${pyq.subject.subjectName} Solution - ${pyq.year} ${pyq.examType}`,
        description: `Solution for ${pyq.subject.subjectName} (${pyq.subject.subjectCode}) ${pyq.year} ${pyq.examType} exam`,
        author: {
            '@type': 'Organization',
            name: 'Student Senior',
            url: 'https://studentsenior.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Student Senior',
            logo: {
                '@type': 'ImageObject',
                url: 'https://studentsenior.com/icons/image512.png',
            },
        },
        dateModified: solution?.updatedAt || pyq.updatedAt,
        datePublished: solution?.createdAt || pyq.createdAt,
        mainEntityOfPage: pageUrl,
        about: {
            '@type': 'Course',
            name: pyq.subject.subjectName,
            courseCode: pyq.subject.subjectCode,
            provider: {
                '@type': 'CollegeOrUniversity',
                name: capitalizeWords(slug),
                url: `https://studentsenior.com/${slug}`,
            },
        },
    };

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <SolutionClient pyq={pyq} solution={solution} />
        </>
    );
}
