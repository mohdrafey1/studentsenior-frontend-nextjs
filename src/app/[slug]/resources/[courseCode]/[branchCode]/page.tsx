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
        const url = `${api.resources.getSubjects(branchCode)}`;
        const res = await fetch(url, { cache: 'no-store' });
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

            <main className='max-w-7xl min-h-screen mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <header className='text-center mb-4'>
                    <h1 className='text-2xl font-fugaz sm:text-4xl font-bold text-gray-800 dark:text-white mb-3'>
                        Subjects - {capitalizeWords(collegeName)}
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                        &quot;Explore the subjects of the course to get the best
                        resources.&quot;
                    </p>
                </header>

                {/* Pass data to client component */}
                <SubjectsList subjects={subjects} branchCode={branchCode} />
            </main>
        </>
    );
}
