import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { INote } from '@/utils/interface';
import SubjectNotesClient from './SubjectNotesClient';
import Link from 'next/link';

interface SubjectItem {
    subjectCode: string;
    subjectName: string;
}

// ✅ helper to fetch subject name
async function getSubjectName(
    branchCode: string,
    subjectCode: string,
    collegeSlug: string,
) {
    const response = await fetch(
        api.resources.getSubjects(branchCode, collegeSlug),
        {
            next: { revalidate: 3600 },
        },
    );
    const resp = await response.json();
    const matched = resp.data.find(
        (item: SubjectItem) => item.subjectCode === subjectCode,
    );
    return matched?.subjectName || '';
}

// ✅ sanitize subject name
function cleanSubjectName(name: string) {
    return name.replace(/Endsem.*|Midsem.*|\d{4} ?\d{2}/gi, '').trim();
}

interface SubjectNotesPageProps {
    params: Promise<{
        'note-slug': string;
        slug: string;
        courseCode: string;
        branchCode: string;
    }>;
}

// ✅ SEO Metadata
export async function generateMetadata({
    params,
}: SubjectNotesPageProps): Promise<Metadata> {
    const {
        'note-slug': subjectCode,
        slug,
        branchCode,
        courseCode,
    } = await params;

    let subjectName = await getSubjectName(branchCode, subjectCode, slug);
    subjectName = cleanSubjectName(subjectName);

    const pageTitle = `${subjectName} (${subjectCode}) Notes – Free Study Material | ${capitalizeWords(slug)}`;
    const description = `Download verified, high-quality handwritten and PDF notes for ${subjectName} (${subjectCode}). Access unit-wise notes, exam-ready summaries, important questions, and revision material to score higher in university semester exams. Free student study resources.`;

    const url = `https://www.studentsenior.com/${slug}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: pageTitle,
        description,
        provider: {
            '@type': 'CollegeOrUniversity',
            name: capitalizeWords(slug.replace(/-/g, ' ')),
            url: `https://www.studentsenior.com/${slug}`,
        },
        url,
    };

    return {
        title: pageTitle,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: pageTitle,
            description,
            url,
            siteName: 'Student Senior',
            type: 'website',
            images: [
                {
                    url: '/icons/image512.png',
                    width: 512,
                    height: 512,
                    alt: pageTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description,
            images: ['/icons/image512.png'],
            site: '@studentsenior',
            creator: '@studentsenior',
        },
        other: {
            'script:course-schema': JSON.stringify(jsonLd),
        },
    };
}

export default async function SubjectNotesPage({
    params,
}: SubjectNotesPageProps) {
    const {
        'note-slug': subjectCode,
        slug,
        courseCode,
        branchCode,
    } = await params;

    let notes: INote[] = [];
    let subjectName = await getSubjectName(branchCode, subjectCode, slug);
    subjectName = cleanSubjectName(subjectName);

    try {
        const url = api.resources.getNotesBySubject(subjectCode, slug);
        const res = await fetch(url, { next: { revalidate: 300 } });
        const data = await res.json();
        notes = data?.data || [];
    } catch (e) {
        console.error('Notes fetch error:', e);
    }

    return (
        <>
            {/* Minimal Inline Header */}
            <section className='relative w-full bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] pt-12 pb-6 px-4 overflow-hidden z-0'>
                <div className='absolute inset-0 z-0 bg-[radial-gradient(#d0ceca_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-50'></div>

                <div className='relative z-10 max-w-7xl mx-auto'>
                    {/* Breadcrumbs */}
                    <div className='flex items-center gap-2 text-sm text-[#615d59] dark:text-[#a09e9a] mb-3 font-medium overflow-x-auto whitespace-nowrap pb-1 scrollbar-none'>
                        <Link
                            href={`/${slug}`}
                            className='hover:text-[#101828] dark:hover:text-[#ededed] transition-colors'
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/${slug}/resources`}
                            className='hover:text-[#101828] dark:hover:text-[#ededed] transition-colors'
                        >
                            Resources
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/${slug}/resources/${courseCode}`}
                            className='hover:text-[#101828] dark:hover:text-[#ededed] transition-colors uppercase'
                        >
                            {courseCode}
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/${slug}/resources/${courseCode}/${branchCode}`}
                            className='hover:text-[#101828] dark:hover:text-[#ededed] transition-colors uppercase'
                        >
                            {branchCode}
                        </Link>
                        <span>/</span>
                        <span className='text-[#101828] dark:text-[#ededed] uppercase'>
                            Notes
                        </span>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold text-[#101828] dark:text-[#ededed] tracking-tight flex items-center gap-3'>
                                {subjectName}
                                <span className='font-mono text-sm bg-white dark:bg-[#282828] text-[#0075de] dark:text-[#62aef0] px-2.5 py-1 rounded-lg border border-[#e6e6e6] dark:border-[#383838] shadow-sm'>
                                    {subjectCode}
                                </span>
                            </h1>
                            <p className='text-[#615d59] dark:text-[#a09e9a] mt-2 max-w-2xl text-sm'>
                                High-quality handwritten and PDF notes to help you ace your exams.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515]'>
                <SubjectNotesClient
                    initialNotes={notes}
                    subjectCode={subjectCode}
                    collegeSlug={slug}
                    courseCode={courseCode}
                    branchCode={branchCode}
                    subjectName={subjectName}
                />
            </main>

            {/* ✅ Inject JSON-LD */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html:
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (globalThis as any).__METADATA?.other?.[
                            'script:course-schema'
                        ] ?? '',
                }}
            />
        </>
    );
}
