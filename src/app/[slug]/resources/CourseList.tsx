"use client";

import { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Code2, Eye, Search } from "lucide-react";
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
        return courses.filter(
            (course) =>
                course.courseName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                course.courseCode.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, courses]);

    return (
        <>
            {/* Search Input */}
            <div className="mb-6 flex items-center max-w-md mx-auto">
                <div className="relative w-full">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by course name or code..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="relative p-6 pb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {course.courseName}
                                </h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                        <Code2 className="w-4 h-4" />{" "}
                                        {course.courseCode}
                                    </span>
                                    <span className="text-sm flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                        <Eye className="w-4 h-4" />{" "}
                                        {course.clickCounts}
                                    </span>
                                </div>
                            </div>
                            <div className="relative px-6 pb-6">
                                <Link
                                    href={`resources/${course.courseCode}`}
                                    className="relative flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <span>Explore Course</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No courses found.
                    </p>
                )}
            </div>
        </>
    );
}
