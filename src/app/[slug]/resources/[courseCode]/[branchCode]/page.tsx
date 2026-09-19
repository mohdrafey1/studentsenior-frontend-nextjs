import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { api } from '@/config/apiUrls';
import SubjectsList from './SubjectsTab';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

interface ISubject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    clickCounts: number;
}
interface ICollegePageProps {
    params: Promise<{
        slug: string;
        branchCode: string;
        courseCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: ICollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Subjects - ${capitalizeWords(slug)}`,
        description:
            'Explore the subjects of the course to get the best resources.',
    };
}

export default async function BranchesPage({ params }: ICollegePageProps) {
    const { slug, branchCode, courseCode } = await params;
    const collegeName = slug;

    let subjects: ISubject[] = [];

    try {
        const url = `${api.resources.getSubjects(branchCode, slug)}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

        const data = await res.json();
        subjects = data?.data || [];
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
    }

    return (
        <>
            <DetailPageNavbar
                path='branches'
                fullPath={`/${slug}/resources/${courseCode}`}
            />

            <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
                {/* Header Section */}
                <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-8 pb-9 sm:pt-10 sm:pb-11 px-4 sm:px-6 lg:px-8'>
                    {/* Subtle Notion Document Grid / Dot Mesh */}
                    <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                    <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center'>
                        {/* Headline */}
                        <h1 className='font-bold tracking-[-0.03em] leading-tight mb-2 text-2xl sm:text-3xl md:text-4xl text-[#000000] dark:text-white max-w-3xl mx-auto'>
                            Subjects —{' '}
                            <span className='text-[#0075de] dark:text-[#62aef0]'>
                                {capitalizeWords(collegeName)}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className='max-w-2xl mx-auto text-xs sm:text-sm text-[#615d59] dark:text-[#b8b5b0] leading-relaxed mb-4'>
                            Explore the subjects of the course to get the best resources.
                        </p>
                    </div>
                </section>

                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                    {/* Pass data to client component */}
                    <SubjectsList
                        subjects={subjects}
                        branchCode={branchCode}
                        collegeSlug={slug}
                        courseCode={courseCode}
                    />
                </div>
            </main>
        </>
    );
}
