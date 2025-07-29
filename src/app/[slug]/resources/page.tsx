import { capitalizeWords } from "@/utils/formatting";
import Collegelinks from "@/components/Common/CollegeLinks";
import Collegelink2 from "@/components/Common/CollegeLink2";
import type { Metadata } from "next";
import { CollegePageProps } from "@/utils/interface";

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Resources - ${capitalizeWords(slug)}`,
        description:
            "Get concise and clear notes to boost your exam preparation.",
    };
}

export default async function ResourcesPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-900 pb-15">
                <Collegelinks />
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <header className="text-center mb-8">
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                            Resources - {capitalizeWords(collegeName)}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                            &quot;Get concise and clear notes to boost your exam
                            preparation.&quot;
                        </p>
                    </header>
                    {/* TODO: Add resources */}
                </main>
            </div>
            <Collegelink2 />
        </>
    );
}
