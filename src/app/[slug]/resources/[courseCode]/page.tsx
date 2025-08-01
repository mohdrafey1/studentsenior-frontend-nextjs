import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { CollegePageProps } from "@/utils/interface";
import { api } from "@/config/apiUrls";
import { ArrowRight, BookOpen, Code2, Eye } from "lucide-react";
import Link from "next/link";

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
            "Explore the branches of the course to get the best resources.",
    };
}

export default async function BranchesPage({ params }: ICollegePageProps) {
    const { slug, courseCode } = await params;
    const collegeName = slug;

    let branches: IBranch[] = [];

    try {
        const url = `${api.resources.getBranches(courseCode)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        branches = data?.data || [];
    } catch (error) {
        console.error("Failed to fetch courses:", error);
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="text-center mb-4">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    Branches - {capitalizeWords(collegeName)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                    &quot;Explore the branches of the course to get the best
                    resources.&quot;
                </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {branches.map((branch) => (
                    <div
                        key={branch._id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 dark:from-sky-400/10 dark:via-cyan-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                        {/* Floating Orb Effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />

                        {/* Course icon */}
                        <div className="relative p-6 pb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>

                            {/* Course details */}
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {branch.branchName}
                            </h3>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    <Code2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    {branch.branchCode}
                                </span>

                                <span className="text-sm flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    {branch.clickCounts}
                                </span>
                            </div>
                        </div>

                        {/* Explore button */}
                        <div className="relative px-6 pb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 opacity-0 group-hover/join:opacity-100 transition-opacity duration-300" />
                            <Link
                                href={`${courseCode}/${branch.branchCode}`}
                                className="relative flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                            >
                                <span>Explore Subjects</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                    </div>
                ))}
            </div>
        </main>
    );
}
