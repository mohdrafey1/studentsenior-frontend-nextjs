import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { CollegePageProps, IPagination, IPyq } from "@/utils/interface";
import PyqsClient from "./PyqsClient";

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `PYQs - ${capitalizeWords(slug)}`,
        description:
            "Access past year question papers, understand trends, improve strategies, and ace exams confidently with a well-organized, easy-to-use database for students.",
    };
}

export default async function PyqsPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let pyqs: IPyq[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.pyq.getPyqByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        pyqs = data?.data?.pyqs || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error("Error fetching PYQs:", error);
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="text-center mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    PYQs - {capitalizeWords(collegeName)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                    Access past year question papers, understand trends, improve
                    strategies, and ace exams confidently with a well-organized,
                    easy-to-use database for students.
                </p>
            </header>
            <PyqsClient
                initialPyqs={pyqs}
                initialPagination={
                    pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                    }
                }
                collegeName={collegeName}
            />
        </main>
    );
}
