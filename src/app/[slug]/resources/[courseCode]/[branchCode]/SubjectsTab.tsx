'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    FileText,
    PlayCircle,
    Search,
    GraduationCap,
    Zap,
    Eye,
    X,
} from 'lucide-react';
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
    collegeSlug,
    branchCode,
    courseCode,
}: {
    subjects: ISubject[];
    branchCode: string;
    collegeSlug: string;
    courseCode: string;
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

    const generateSyllabusSlug = (
        subjectName: string,
        subjectCode: string,
    ): string => {
        const cleanSubjectName = subjectName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        return `${cleanSubjectName}-${subjectCode.toLowerCase()}`;
    };

    const semesters = useMemo(() => {
        const semesterSet = new Set(subjects.map((s) => s.semester));
        return Array.from(semesterSet).sort((a, b) => a - b);
    }, [subjects]);

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
            label: 'Papers',
            fullLabel: 'Previous Papers',
            icon: FileText,
            gradient: 'from-sky-500 to-blue-600',
            hoverGradient: 'hover:from-sky-600 hover:to-blue-700',
            bgLight: 'bg-sky-50 dark:bg-sky-950/40',
            textColor: 'text-sky-600 dark:text-sky-400',
            borderColor: 'border-sky-200 dark:border-sky-800',
        },
        {
            type: 'notes',
            label: 'Notes',
            fullLabel: 'Study Notes',
            icon: BookOpen,
            gradient: 'from-emerald-500 to-green-600',
            hoverGradient: 'hover:from-emerald-600 hover:to-green-700',
            bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            borderColor: 'border-emerald-200 dark:border-emerald-800',
        },
        {
            type: 'quicknotes',
            label: 'Quick',
            fullLabel: 'Quick Notes',
            icon: Zap,
            gradient: 'from-amber-500 to-yellow-600',
            hoverGradient: 'hover:from-amber-600 hover:to-yellow-700',
            bgLight: 'bg-amber-50 dark:bg-amber-950/40',
            textColor: 'text-amber-600 dark:text-amber-400',
            borderColor: 'border-amber-200 dark:border-amber-800',
        },
        {
            type: 'videos',
            label: 'Videos',
            fullLabel: 'Video Lectures',
            icon: PlayCircle,
            gradient: 'from-purple-500 to-violet-600',
            hoverGradient: 'hover:from-purple-600 hover:to-violet-700',
            bgLight: 'bg-purple-50 dark:bg-purple-950/40',
            textColor: 'text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-200 dark:border-purple-800',
        },
        {
            type: 'syllabus',
            label: 'Syllabus',
            fullLabel: 'Syllabus',
            icon: GraduationCap,
            gradient: 'from-orange-500 to-red-500',
            hoverGradient: 'hover:from-orange-600 hover:to-red-600',
            bgLight: 'bg-orange-50 dark:bg-orange-950/40',
            textColor: 'text-orange-600 dark:text-orange-400',
            borderColor: 'border-orange-200 dark:border-orange-800',
        },
    ];

    const handleTabChange = (tab: number | 'all') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        if (tab === 'all') {
            params.delete('semester');
        } else {
            params.set('semester', String(tab));
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };

    return (
        <div className='max-w-6xl mx-auto space-y-5 px-1 sm:px-0'>
            {/* Search & Filter Bar */}
            <div className='bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/60 p-3 sm:p-4 space-y-3 shadow-sm'>
                {/* Search Input */}
                <div className='relative'>
                    <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none' />
                    <input
                        type='text'
                        placeholder='Search subjects by name or code...'
                        className='w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600/60 rounded-xl bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all placeholder:text-gray-400'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                        >
                            <X className='w-4 h-4' />
                        </button>
                    )}
                </div>

                {/* Semester Pills */}
                <div className='flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1'>
                    <button
                        className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'all'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/60'
                        }`}
                        onClick={() => handleTabChange('all')}
                    >
                        All
                    </button>
                    {semesters.map((semester) => (
                        <button
                            key={semester}
                            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                activeTab === semester
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                                    : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/60'
                            }`}
                            onClick={() => handleTabChange(semester)}
                        >
                            Sem {semester}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium pl-1'>
                {filteredSubjects.length} subject
                {filteredSubjects.length !== 1 ? 's' : ''} found
                {activeTab !== 'all' && ` in Semester ${activeTab}`}
            </p>

            {/* Subject Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                        <div
                            key={subject._id}
                            className='group bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300'
                        >
                            {/* Card Header */}
                            <div className='p-4 sm:p-5 pb-3 sm:pb-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300'>
                                        <BookOpen className='w-5 h-5 sm:w-5.5 sm:h-5.5 text-white' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2'>
                                            {subject.subjectName}
                                        </h3>
                                        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5'>
                                            <span className='font-mono text-[11px] sm:text-xs bg-gray-100 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md font-semibold'>
                                                {subject.subjectCode}
                                            </span>
                                            <span className='flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>
                                                <GraduationCap className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                                                Sem {subject.semester}
                                            </span>
                                            <span className='flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400'>
                                                <Eye className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
                                                {subject.clickCounts}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resource Links Grid */}
                            <div className='px-3 sm:px-4 pb-3 sm:pb-4'>
                                <div className='grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2'>
                                    {resourceLinks.map(
                                        ({
                                            type,
                                            label,
                                            fullLabel,
                                            icon: Icon,
                                            bgLight,
                                            textColor,
                                            borderColor,
                                        }) => {
                                            const href =
                                                type === 'syllabus'
                                                    ? `/${collegeSlug}/syllabus/${generateSyllabusSlug(subject.subjectName, subject.subjectCode)}`
                                                    : type === 'quicknotes'
                                                      ? `/${collegeSlug}/quicknotes/${subject.subjectCode}`
                                                      : `/${collegeSlug}/resources/${courseCode}/${branchCode}/${type}/${subject.subjectCode}`;

                                            return (
                                                <Link
                                                    prefetch={false}
                                                    key={type}
                                                    href={href}
                                                    className={`${bgLight} ${textColor} border ${borderColor} rounded-xl px-2 py-2 sm:py-2.5 flex flex-col items-center gap-1 sm:gap-1.5 text-center hover:scale-[1.03] active:scale-[0.97] transition-all duration-200`}
                                                >
                                                    <Icon className='w-4 h-4 sm:w-[18px] sm:h-[18px]' />
                                                    <span className='text-[10px] sm:text-xs font-semibold leading-tight sm:hidden'>
                                                        {label}
                                                    </span>
                                                    <span className='text-[10px] sm:text-xs font-semibold leading-tight hidden sm:block'>
                                                        {fullLabel}
                                                    </span>
                                                </Link>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='col-span-full text-center py-16 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/60'>
                        <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <Search className='w-7 h-7 text-gray-400' />
                        </div>
                        <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5'>
                            No subjects found
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto'>
                            Try adjusting your search or filter to find what
                            you&apos;re looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
