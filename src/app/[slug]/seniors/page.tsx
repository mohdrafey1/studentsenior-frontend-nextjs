import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { CollegePageProps } from "@/utils/interface";

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Seniors - ${capitalizeWords(slug)}`,
        description:
            "Connect with seniors to get valuable insights and advice for your college journey.",
    };
}

export default async function SeniorsPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="text-center mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    Seniors - {capitalizeWords(collegeName)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                    &quot;Connect with seniors to get valuable insights and
                    advice for your college journey.&quot;
                </p>
            </header>
            {/* TODO: Add seniors */}
        </main>
    );
}
