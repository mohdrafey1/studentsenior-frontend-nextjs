'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import type { CollegeSections } from '@/utils/interface';

interface CollegeLayoutClientProps {
    children: ReactNode;
    sections: CollegeSections | null;
    slug: string;
    collegeLinksComponent: ReactNode;
    collegeLink2Component: ReactNode;
}

export default function CollegeLayoutClient({
    children,
    slug,
    collegeLinksComponent,
    collegeLink2Component,
}: CollegeLayoutClientProps) {
    const pathname = usePathname();

    const hideCollegeLinks = pathname.startsWith(`/${slug}/test`);

    return (
        <div>
            <div className='min-h-full bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-900 pb-16 lg:pb-0'>
                {!hideCollegeLinks && (
                    <div className='flex'>
                        {collegeLinksComponent}
                        <main className='flex-1 min-w-0'>{children}</main>
                    </div>
                )}
                {hideCollegeLinks && children}
            </div>
            {collegeLink2Component}
        </div>
    );
}
