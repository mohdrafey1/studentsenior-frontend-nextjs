'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SemesterTabsProps {
    semesters: number[];
    slug: string;
    branchCode: string;
}

export default function SemesterTabs({
    semesters,
    slug,
    branchCode,
}: SemesterTabsProps) {
    const searchParams = useSearchParams();
    const currentSemester = searchParams.get('semester');

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                    Select Semester
                </h2>
            </div>
            <div className='flex overflow-x-auto scrollbar-hide'>
                <div className='flex gap-2 p-4 min-w-full'>
                    <Link
                        href={`/${slug}/syllabus/branch/${branchCode}`}
                        className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                            !currentSemester
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        All Semesters
                    </Link>
                    {semesters.map((sem) => (
                        <Link
                            key={sem}
                            href={`/${slug}/syllabus/branch/${branchCode}?semester=${sem}`}
                            className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all ${
                                currentSemester === String(sem)
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            Semester {sem}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
