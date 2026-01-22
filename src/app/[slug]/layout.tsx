import Collegelinks from '@/components/Common/CollegeLinks';
import Collegelink2 from '@/components/Common/CollegeLink2';
import { getCollegeSections } from '@/utils/collegeSections';
import CollegeLayoutClient from './CollegeLayoutClient';

interface CollegeLayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

export default async function CollegeLayout({
    children,
    params,
}: CollegeLayoutProps) {
    const { slug } = await params;

    // Fetch sections from backend with long cache (24 hours)
    // This will be cached by Next.js and revalidated every 24 hours
    const sections = await getCollegeSections(slug);

    return (
        <CollegeLayoutClient
            sections={sections}
            slug={slug}
            collegeLinksComponent={
                <Collegelinks
                    key='college-links'
                    sections={sections ?? undefined}
                />
            }
            collegeLink2Component={
                <Collegelink2
                    key='college-link2'
                    sections={sections ?? undefined}
                />
            }
        >
            {children}
        </CollegeLayoutClient>
    );
}
