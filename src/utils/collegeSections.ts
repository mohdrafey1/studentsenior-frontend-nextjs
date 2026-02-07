import { api } from '@/config/apiUrls';
import type { CollegeSections } from '@/utils/interface';

export const DEFAULT_SECTIONS: CollegeSections = {
    pyqs: true,
    notes: true,
    videos: true,
    syllabus: true,
    store: true,
    seniors: true,
    resources: true,
    groups: true,
    opportunities: true,
    lostFound: true,
    quickNotes: true,
};

// Cache duration: 24 hours (in seconds)
// Since college sections rarely change, we cache for a long time
const SECTIONS_CACHE_DURATION = 1; // 24 hours = 86400 seconds

export async function getCollegeSections(
    slug: string,
): Promise<CollegeSections | null> {
    try {
        const res = await fetch(api.college.getCollegeBySlug(slug), {
            next: { revalidate: SECTIONS_CACHE_DURATION },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
            ...DEFAULT_SECTIONS,
            ...(data?.data?.sections || {}),
        };
    } catch (error) {
        console.error('Failed to fetch college sections:', error);
        return null;
    }
}

export async function isSectionEnabled(
    slug: string,
    section: keyof CollegeSections,
): Promise<boolean> {
    const sections = await getCollegeSections(slug);
    return Boolean(sections && sections[section]);
}
