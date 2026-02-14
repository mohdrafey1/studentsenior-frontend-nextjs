import type { Metadata } from 'next';
import { IQuickNote } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import Link from 'next/link';
import QuickNoteClient from './QuickNoteClient';
import { capitalizeWords } from '@/utils/formatting';

const getQuickNoteDetail = async (slug: string): Promise<IQuickNote | null> => {
    try {
        const res = await fetch(api.quickNotes.getNoteDetail(slug), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching quick note detail:', error);
        return null;
    }
};

interface QuickNoteDetailPageProps {
    params: Promise<{
        slug: string;
        subjectCode: string;
        quicknoteSlug: string;
    }>;
}

export async function generateMetadata({
    params,
}: QuickNoteDetailPageProps): Promise<Metadata> {
    const { quicknoteSlug, slug, subjectCode } = await params;
    const note = await getQuickNoteDetail(quicknoteSlug);

    if (!note) {
        return {
            title: 'Quick Note Not Found',
        };
    }

    const subjectName =
        typeof note.subject === 'object' ? note.subject.subjectName : '';
    const title = `${note.title} - Unit ${note.unitNumber} Quick Notes${subjectName ? ` | ${subjectName}` : ''}`;
    const description = `Quick revision note for ${subjectName || subjectCode} - ${note.title}. Concise, exam-ready study material for last-minute preparation at ${capitalizeWords(slug)}.`;
    const url = `https://studentsenior.com/${slug}/quicknotes/${subjectCode}/${quicknoteSlug}`;

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

export default async function QuickNoteDetailPage({
    params,
}: QuickNoteDetailPageProps) {
    const { slug, subjectCode, quicknoteSlug } = await params;
    const note = await getQuickNoteDetail(quicknoteSlug);

    if (!note) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-12 text-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    Note Not Found
                </h1>
                <Link
                    href={`/${slug}/quicknotes/${subjectCode}`}
                    className='text-primary mt-4 inline-block hover:underline'
                >
                    Back to List
                </Link>
            </div>
        );
    }

    const subjectName =
        typeof note.subject === 'object' ? note.subject.subjectName : '';
    const pageUrl = `https://studentsenior.com/${slug}/quicknotes/${subjectCode}/${quicknoteSlug}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: note.title,
        description: `Quick revision note for ${subjectName || subjectCode} - Unit ${note.unitNumber}`,
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
        dateModified: note.lastUpdated,
        mainEntityOfPage: pageUrl,
        about: {
            '@type': 'Course',
            name: subjectName || subjectCode,
            courseCode: subjectCode,
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
            <QuickNoteClient
                note={note}
                slug={slug}
                subjectCode={subjectCode}
                quicknoteSlug={quicknoteSlug}
            />
        </>
    );
}
