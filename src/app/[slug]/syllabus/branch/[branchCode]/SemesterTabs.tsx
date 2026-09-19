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
        <div className='mb-6'>
            <div className='flex overflow-x-auto scrollbar-hide pb-2'>
                <div className='flex gap-2 min-w-full'>
                    <Link
                        prefetch={false}
                        href={`/${slug}/syllabus/branch/${branchCode}`}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                            !currentSemester
                                ? 'bg-[#0075de] text-white border-[#0075de] shadow-[0_2px_8px_rgb(0,117,222,0.25)]'
                                : 'bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838] hover:bg-[#fcfbf9] dark:hover:bg-[#2a2a2a] shadow-sm'
                        }`}
                    >
                        All Semesters
                    </Link>
                    {semesters.map((sem) => (
                        <Link
                            prefetch={false}
                            key={sem}
                            href={`/${slug}/syllabus/branch/${branchCode}?semester=${sem}`}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                                currentSemester === String(sem)
                                    ? 'bg-[#0075de] text-white border-[#0075de] shadow-[0_2px_8px_rgb(0,117,222,0.25)]'
                                    : 'bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#383838] hover:bg-[#fcfbf9] dark:hover:bg-[#2a2a2a] shadow-sm'
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
