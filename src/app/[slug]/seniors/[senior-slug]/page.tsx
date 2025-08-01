import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import SeniorDetailClient from "./SeniorDetailClient";

interface SeniorDetailPageProps {
    params: Promise<{ slug: string; "senior-slug": string }>;
}

export async function generateMetadata({
    params,
}: SeniorDetailPageProps): Promise<Metadata> {
    const { slug, "senior-slug": seniorSlug } = await params;
    return {
        title: `${capitalizeWords(seniorSlug)} - Seniors - ${capitalizeWords(
            slug
        )}`,
        description: "Senior profile details and contact information.",
    };
}

export default async function SeniorDetailPage({
    params,
}: SeniorDetailPageProps) {
    const { slug, "senior-slug": seniorSlug } = await params;
    const collegeName = slug;

    let senior = null;

    try {
        const url = `${api.seniors.getSeniorBySlug(seniorSlug)}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        senior = data?.data || null;
    } catch (error) {
        console.error("Error fetching senior details:", error);
    }

    if (!senior) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Senior Profile Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        The senior profile you&apos;re looking for doesn&apos;t
                        exist or has been removed.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <SeniorDetailClient senior={senior} collegeName={collegeName} />
        </main>
    );
}
