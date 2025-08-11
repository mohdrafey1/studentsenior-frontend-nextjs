"use client";

import { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Eye, Search } from "lucide-react";
import Link from "next/link";

interface ICourse {
    _id: string;
    courseName: string;
    courseCode: string;
    clickCounts: number;
}

export default function CourseList({ courses }: { courses: ICourse[] }) {
    const [search, setSearch] = useState("");

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const q = search.toLowerCase();
            return (
                course.courseName.toLowerCase().includes(q) ||
                course.courseCode.toLowerCase().includes(q)
            );
        });
    }, [search, courses]);

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="max-w-xl mx-auto w-full">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search courses by name or code..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                    Showing {filteredCourses.length} course
                    {filteredCourses.length === 1 ? "" : "s"}
                </p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Course Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                {course.courseName}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    {course.courseCode}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {course.clickCounts} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex lg:flex-shrink-0">
                                    <Link
                                        href={`resources/${course.courseCode}`}
                                        className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[160px]"
                                    >
                                        Explore Course
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
