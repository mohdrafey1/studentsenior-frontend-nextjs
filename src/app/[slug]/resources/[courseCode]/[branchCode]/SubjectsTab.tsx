'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, PlayCircle, Users } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ISubject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    clickCounts: number;
}

export default function SubjectsList({
    subjects,
    branchCode,
}: {
    subjects: ISubject[];
    branchCode: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialActiveTab = useMemo<number | 'all'>(() => {
        const semesterParam = searchParams.get('semester');
        if (!semesterParam) return 'all';
        const parsed = Number(semesterParam);
        return Number.isFinite(parsed) ? (parsed as number) : 'all';
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<number | 'all'>(
        initialActiveTab,
    );

    useEffect(() => {
        setActiveTab(initialActiveTab);
    }, [initialActiveTab]);
    const [searchQuery, setSearchQuery] = useState('');

    // Get unique semesters from subjects
    const semesters = useMemo(() => {
        const semesterSet = new Set(subjects.map((s) => s.semester));
        return Array.from(semesterSet).sort((a, b) => a - b);
    }, [subjects]);

    // Filtered list
    const filteredSubjects = useMemo(() => {
        return subjects.filter((subject) => {
            const matchesSemester =
                activeTab === 'all' || subject.semester === activeTab;
            const matchesSearch =
                subject.subjectName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                subject.subjectCode
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesSemester && matchesSearch;
        });
    }, [subjects, activeTab, searchQuery]);

    const resourceLinks = [
        {
            type: 'pyqs',
            label: 'Previous Papers',
            icon: FileText,
            color: 'bg-sky-500 hover:bg-sky-600',
        },
        {
            type: 'notes',
            label: 'Study Notes',
            icon: BookOpen,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            type: 'videos',
            label: 'Video Lectures',
            icon: PlayCircle,
            color: 'bg-purple-500 hover:bg-purple-600',
        },
    ];

    return (
        <div className='max-w-7xl mx-auto space-y-6'>
            {/* Semester Filter */}

            <div className='flex flex-wrap gap-2 justify-center'>
                {/* Header with Search */}

                <div className=''>
                    <input
                        type='text'
                        placeholder='Search subjects by name or code...'
                        className='w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => {
                        setActiveTab('all');
                        const params = new URLSearchParams(
                            searchParams.toString(),
                        );
                        params.delete('semester');
                        const query = params.toString();
                        router.replace(
                            query ? `${pathname}?${query}` : pathname,
                            {
                                scroll: false,
                            },
                        );
                    }}
                >
                    All Sem
                </button>
                {semesters.map((semester) => (
                    <button
                        key={semester}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === semester
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => {
                            setActiveTab(semester);
                            const params = new URLSearchParams(
                                searchParams.toString(),
                            );
                            params.set('semester', String(semester));
                            const query = params.toString();
                            router.replace(
                                query ? `${pathname}?${query}` : pathname,
                                {
                                    scroll: false,
                                },
                            );
                        }}
                    >
                        Sem {semester}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className='text-sm text-gray-600 dark:text-gray-400'>
                Showing {filteredSubjects.length} subject
                {filteredSubjects.length !== 1 ? 's' : ''}
            </div>

            {/* Subject Cards */}
            <div className='space-y-4'>
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                        <div
                            key={subject._id}
                            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
                        >
                            <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                                {/* Subject Info */}
                                <div className='flex-1'>
                                    <div className='flex items-start gap-3'>
                                        <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <BookOpen className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                                {subject.subjectName}
                                            </h3>
                                            <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                                                <span className='font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                                                    {subject.subjectCode}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <BookOpen className='w-4 h-4' />
                                                    Semester {subject.semester}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Users className='w-4 h-4' />
                                                    {subject.clickCounts} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-2 lg:flex-shrink-0'>
                                    {resourceLinks.map(
                                        ({
                                            type,
                                            label,
                                            icon: Icon,
                                            color,
                                        }) => (
                                            <Link
                                                key={type}
                                                href={`${branchCode}/${type}/${subject.subjectCode}`}
                                                className={`${color} text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[140px]`}
                                            >
                                                <Icon className='w-4 h-4' />
                                                {label}
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg'>
                        <BookOpen className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                            No subjects found
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
