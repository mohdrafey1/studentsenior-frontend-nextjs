import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { CollegePageProps } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { BookOpen, Eye } from 'lucide-react';
import Link from 'next/link';

interface IBranch {
    _id: string;
    branchName: string;
    branchCode: string;
    clickCounts: number;
}

interface ICollegePageProps {
    params: Promise<{
        slug: string;
        courseCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Branches - ${capitalizeWords(slug)}`,
        description:
            'Explore the branches of the course to get the best resources.',
    };
}

export default async function BranchesPage({ params }: ICollegePageProps) {
    const { slug, courseCode } = await params;
    const collegeName = slug;

    let branches: IBranch[] = [];

    try {
        const url = `${api.resources.getBranches(courseCode)}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        branches = data?.data || [];
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }

    return (
        <>
            <DetailPageNavbar
                path='resources'
                fullPath={`/${slug}/resources`}
            />

            <main className='max-w-7xl min-h-screen mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <header className='text-center mb-4'>
                    <h1 className='text-2xl font-fugaz sm:text-4xl font-bold text-gray-800 dark:text-white mb-3'>
                        Branches - {capitalizeWords(collegeName)}
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
                        &quot;Explore the branches of the course to get the best
                        resources.&quot;
                    </p>
                </header>

                {/* List */}
                <div className='space-y-4'>
                    {branches.length > 0 ? (
                        branches.map((branch) => (
                            <div
                                key={branch._id}
                                className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
                            >
                                <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                                    {/* Info */}
                                    <div className='flex-1'>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                <BookOpen className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                                    {branch.branchName}
                                                </h3>
                                                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                                                    <span className='font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                                                        {branch.branchCode}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <Eye className='w-4 h-4' />
                                                        {branch.clickCounts}{' '}
                                                        views
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className='flex lg:flex-shrink-0'>
                                        <Link
                                            href={`${courseCode}/${branch.branchCode}`}
                                            className='bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[160px]'
                                        >
                                            Explore Subjects
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg'>
                            <BookOpen className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                                No branches found
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Try adjusting your search.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
