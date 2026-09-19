'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import {
    BookOpen,
    GraduationCap,
    GitBranch,
    Calendar,
    ArrowRight,
    SlidersHorizontal,
    Sparkles,
    Check,
    X,
    ChevronDown,
    Loader2,
    Trash2,
} from 'lucide-react';

type College = {
    name: string;
    slug: string;
};

type Course = {
    _id: string;
    courseName: string;
    courseCode: string;
};

type Branch = {
    _id: string;
    branchName: string;
    branchCode: string;
};

type Props = {
    colleges: College[];
};

const LOCAL_STORAGE_KEY = 'ss:resourcePref';

export default function ResourceQuickStart({ colleges }: Props) {
    const router = useRouter();

    const [collegeSlug, setCollegeSlug] = useState<string>('');
    const [courseCode, setCourseCode] = useState<string>('');
    const [branchCode, setBranchCode] = useState<string>('');
    const [semester, setSemester] = useState<string>('');

    const [courses, setCourses] = useState<Course[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [semesters, setSemesters] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);

    const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
    const [loadingBranches, setLoadingBranches] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [hasSavedPref, setHasSavedPref] = useState<boolean>(false);

    // Load saved preference once
    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!saved) {
                setHasSavedPref(false);
                return;
            }
            const pref = JSON.parse(saved) as {
                collegeSlug: string;
                courseCode: string;
                branchCode: string;
                semester?: number | string;
            };
            if (pref.collegeSlug) setCollegeSlug(pref.collegeSlug);
            if (pref.courseCode) setCourseCode(pref.courseCode);
            if (pref.branchCode) setBranchCode(pref.branchCode);
            if (pref.semester !== undefined && pref.semester !== null) {
                setSemester(String(pref.semester));
            }
            if (pref.collegeSlug && pref.courseCode && pref.branchCode) {
                setHasSavedPref(true);
            }
        } catch {
            setHasSavedPref(false);
        }
    }, []);

    // Fetch courses once
    useEffect(() => {
        let cancelled = false;
        async function loadCourses() {
            try {
                setLoadingCourses(true);
                const res = await fetch(api.resources.getCourses);
                if (!res.ok) throw new Error('Failed to load courses');
                const data = await res.json();
                if (!cancelled) setCourses(data?.data ?? []);
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoadingCourses(false);
            }
        }
        loadCourses();
        return () => {
            cancelled = true;
        };
    }, []);

    // Fetch branches when course changes
    useEffect(() => {
        if (!courseCode) {
            setBranches([]);
            return;
        }
        let cancelled = false;
        async function loadBranches() {
            try {
                setLoadingBranches(true);
                const res = await fetch(api.resources.getBranches(courseCode));
                if (!res.ok) throw new Error('Failed to load branches');
                const data = await res.json();
                if (!cancelled) setBranches(data?.data ?? []);
            } catch (e) {
                toast.error('Could not load branches');
                console.error(e);
            } finally {
                if (!cancelled) setLoadingBranches(false);
            }
        }
        loadBranches();
        return () => {
            cancelled = true;
        };
    }, [courseCode]);

    // Update semesters based on branch
    useEffect(() => {
        if (!branchCode) {
            setSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
            return;
        }
        setSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
    }, [branchCode]);

    // Handle ESC key to close modal and body scroll locking
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isDialogOpen) {
                setIsDialogOpen(false);
            }
        };

        if (isDialogOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDialogOpen]);

    const canSubmit = useMemo(() => {
        return Boolean(collegeSlug && courseCode && branchCode);
    }, [collegeSlug, courseCode, branchCode]);

    const collegeName = useMemo(() => {
        return colleges.find((c) => c.slug === collegeSlug)?.name || collegeSlug;
    }, [colleges, collegeSlug]);

    const courseName = useMemo(() => {
        return (
            courses.find((c) => c.courseCode === courseCode)?.courseName ||
            courseCode
        );
    }, [courses, courseCode]);

    const branchName = useMemo(() => {
        return (
            branches.find((b) => b.branchCode === branchCode)?.branchName ||
            branchCode
        );
    }, [branches, branchCode]);

    function handleSave(andGo: boolean = false) {
        if (!canSubmit) {
            toast.error('Please select college, course, and branch');
            return;
        }

        const pref = {
            collegeSlug,
            courseCode,
            branchCode,
            semester: semester || undefined,
        };

        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pref));
            setHasSavedPref(true);
            setIsDialogOpen(false);
            toast.success('Quick Access shortcut saved!');

            if (andGo) {
                const query = semester ? `?semester=${semester}` : '';
                router.push(
                    `/${collegeSlug}/resources/${courseCode}/${branchCode}${query}`,
                );
            }
        } catch {
            toast.error('Failed to save preferences');
        }
    }

    function handleClear() {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setCollegeSlug('');
            setCourseCode('');
            setBranchCode('');
            setSemester('');
            setHasSavedPref(false);
            setIsDialogOpen(false);
            toast('Quick Access shortcut cleared');
        } catch {
            toast.error('Failed to clear');
        }
    }

    function handleGoDirectly() {
        if (!hasSavedPref || !collegeSlug || !courseCode || !branchCode) {
            setIsDialogOpen(true);
            return;
        }

        const query = semester ? `?semester=${semester}` : '';
        router.push(
            `/${collegeSlug}/resources/${courseCode}/${branchCode}${query}`,
        );
    }

    return (
        <>
            {/* Ultra-Compact On-Page Shortcut Bar */}
            <div className='w-full py-8 sm:py-12 bg-[#f6f5f4] dark:bg-[#191919] px-4 sm:px-6' id='QuickStart'>
                <div className='bg-white max-w-4xl mx-auto dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all hover:border-[#d9d9d9] dark:hover:border-[#383838]'>
                    {hasSavedPref ? (
                        /* Saved Preference State: Compact Bar */
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4'>
                            <div className='flex items-start sm:items-center gap-3 min-w-0 flex-1'>
                                <div className='w-9 h-9 rounded-lg bg-[#eaf7ec] dark:bg-[#163821] flex items-center justify-center text-[#1aae39] dark:text-[#4ade80] flex-shrink-0 mt-0.5 sm:mt-0'>
                                    <Sparkles className='w-4 h-4' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                                        <span className='text-xs font-bold text-[#000000] dark:text-white flex-shrink-0'>
                                            Quick Shortcut:
                                        </span>
                                        <div className='flex flex-wrap items-center gap-1.5 text-xs min-w-0'>
                                            <span
                                                className='inline-flex items-center gap-1 font-semibold text-[#0075de] dark:text-[#62aef0] bg-[#eaf3fd] dark:bg-[#183153] px-2 py-0.5 rounded border border-[#d2e4f9] dark:border-[#224474] max-w-[180px] sm:max-w-[240px] truncate'
                                                title={collegeName}
                                            >
                                                <GraduationCap className='w-3 h-3 flex-shrink-0' />
                                                <span className='truncate'>{collegeName}</span>
                                            </span>

                                            <span
                                                className='inline-flex items-center gap-1 font-medium text-[#31302e] dark:text-[#e0e0e0] bg-[#f6f5f4] dark:bg-[#2b2b2b] px-2 py-0.5 rounded border border-[#e6e6e6] dark:border-[#383838] max-w-[160px] sm:max-w-none truncate'
                                                title={`${courseName} (${branchCode})`}
                                            >
                                                <BookOpen className='w-3 h-3 text-[#1aae39] flex-shrink-0' />
                                                <span className='truncate'>{courseCode} · {branchCode}</span>
                                            </span>

                                            {semester && (
                                                <span className='inline-flex items-center gap-1 font-medium text-[#dd5b00] dark:text-[#fb923c] bg-[#fdf1e8] dark:bg-[#3d2411] px-2 py-0.5 rounded border border-[#fbd8c1] dark:border-[#583318] flex-shrink-0'>
                                                    <Calendar className='w-3 h-3 flex-shrink-0' />
                                                    <span>Sem {semester}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className='text-[11px] text-[#615d59] dark:text-[#a39e98] mt-1'>
                                        Click to jump straight to your notes and PYQs.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center gap-2 flex-shrink-0 w-full md:w-auto pt-1 md:pt-0'>
                                <button
                                    type='button'
                                    onClick={() => setIsDialogOpen(true)}
                                    className='inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-[#f6f5f4] dark:bg-[#2a2a2a] hover:bg-[#eae8e4] dark:hover:bg-[#333333] text-[#31302e] dark:text-[#d3d1cb] border border-[#e6e6e6] dark:border-[#383838] text-xs font-medium transition-all active:scale-[0.98]'
                                    title='Edit Quick Access Preferences'
                                >
                                    <SlidersHorizontal className='w-3.5 h-3.5' />
                                    <span>Change</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={handleGoDirectly}
                                    className='flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-lg bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] transition-all'
                                >
                                    <span>Go to Resources</span>
                                    <ArrowRight className='w-3.5 h-3.5' />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Empty State: Sleek Banner Trigger */
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                            <div className='flex items-start sm:items-center gap-3 min-w-0'>
                                <div className='w-9 h-9 rounded-lg bg-[#eaf6f6] dark:bg-[#1a3838] flex items-center justify-center text-[#2a9d99] dark:text-[#5ce1dc] flex-shrink-0 mt-0.5 sm:mt-0'>
                                    <BookOpen className='w-4 h-4' strokeWidth={2.2} />
                                </div>
                                <div className='min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h4 className='text-xs sm:text-sm font-bold text-[#000000] dark:text-white tracking-[-0.2px]'>
                                            ⚡ Quick Resource Shortcut
                                        </h4>
                                        <span className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border border-[#d2e4f9] dark:border-[#224474]'>
                                            1-Click Access
                                        </span>
                                    </div>
                                    <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-0.5'>
                                        Save your college & branch once for instant access anytime.
                                    </p>
                                </div>
                            </div>

                            <button
                                type='button'
                                onClick={() => setIsDialogOpen(true)}
                                className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] transition-all flex-shrink-0'
                            >
                                <SlidersHorizontal className='w-3.5 h-3.5' />
                                <span>Set Quick Access</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Dialog Form */}
            {isDialogOpen && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsDialogOpen(false);
                    }}
                >
                    <div
                        className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-2xl animate-in zoom-in-95 duration-200'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='dialog-title'
                    >
                        {/* Dialog Header */}
                        <div className='sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8]/95 dark:bg-[#242424]/95 backdrop-blur-sm'>
                            <div className='flex items-center gap-2.5'>
                                <div className='w-8 h-8 rounded-lg bg-[#eaf6f6] dark:bg-[#1a3838] flex items-center justify-center text-[#2a9d99] dark:text-[#5ce1dc] flex-shrink-0'>
                                    <BookOpen className='w-4 h-4' />
                                </div>
                                <div className='min-w-0'>
                                    <h3
                                        id='dialog-title'
                                        className='text-sm sm:text-base font-bold text-[#000000] dark:text-white tracking-[-0.2px] truncate'
                                    >
                                        Configure Resource Shortcut
                                    </h3>
                                    <p className='text-[11px] text-[#615d59] dark:text-[#a39e98] truncate'>
                                        Save your default academic stream
                                    </p>
                                </div>
                            </div>
                            <button
                                type='button'
                                onClick={() => setIsDialogOpen(false)}
                                className='p-1.5 rounded-lg text-[#615d59] dark:text-[#a39e98] hover:bg-[#eae8e4] dark:hover:bg-[#2f2f2f] transition-colors flex-shrink-0'
                                aria-label='Close dialog'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        {/* Dialog Body / Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave(false);
                            }}
                            className='p-4 sm:p-6 space-y-4'
                        >
                            {/* Information callout */}
                            <div className='p-3 rounded-xl bg-[#f6f5f4] dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#333333] flex items-start gap-2.5 text-xs text-[#615d59] dark:text-[#a39e98]'>
                                <Sparkles className='w-4 h-4 text-[#0075de] flex-shrink-0 mt-0.5' />
                                <p>
                                    Your choice is saved locally on this browser. You can change or clear it anytime.
                                </p>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                                {/* College Selection */}
                                <div className='space-y-1.5 sm:col-span-2'>
                                    <label className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'>
                                        <GraduationCap className='w-3.5 h-3.5 text-[#0075de]' />
                                        College
                                    </label>
                                    <div className='relative'>
                                        <select
                                            className='w-full appearance-none py-2.5 px-3 pr-8 border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-white dark:bg-[#262626] text-[#000000] dark:text-[#f0f0f0] text-sm focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 outline-none transition-all cursor-pointer'
                                            value={collegeSlug}
                                            onChange={(e) =>
                                                setCollegeSlug(e.target.value)
                                            }
                                            required
                                        >
                                            <option value=''>
                                                Select your college
                                            </option>
                                            {colleges.map((c) => (
                                                <option key={c.slug} value={c.slug}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] pointer-events-none' />
                                    </div>
                                </div>

                                {/* Course Selection */}
                                <div className='space-y-1.5'>
                                    <label className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'>
                                        <BookOpen className='w-3.5 h-3.5 text-[#1aae39]' />
                                        Course
                                    </label>
                                    <div className='relative'>
                                        <select
                                            className='w-full appearance-none py-2.5 px-3 pr-8 border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-white dark:bg-[#262626] text-[#000000] dark:text-[#f0f0f0] text-sm focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 outline-none transition-all disabled:opacity-50 cursor-pointer'
                                            value={courseCode}
                                            onChange={(e) => {
                                                setCourseCode(e.target.value);
                                                setBranchCode('');
                                                setSemester('');
                                            }}
                                            disabled={loadingCourses}
                                            required
                                        >
                                            <option value=''>
                                                {loadingCourses
                                                    ? 'Loading courses...'
                                                    : 'Select course'}
                                            </option>
                                            {courses.map((c) => (
                                                <option
                                                    key={c.courseCode}
                                                    value={c.courseCode}
                                                >
                                                    {c.courseName} ({c.courseCode})
                                                </option>
                                            ))}
                                        </select>
                                        {loadingCourses ? (
                                            <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] animate-spin pointer-events-none' />
                                        ) : (
                                            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] pointer-events-none' />
                                        )}
                                    </div>
                                </div>

                                {/* Branch Selection */}
                                <div className='space-y-1.5'>
                                    <label className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'>
                                        <GitBranch className='w-3.5 h-3.5 text-[#8a3fd6]' />
                                        Branch
                                    </label>
                                    <div className='relative'>
                                        <select
                                            className='w-full appearance-none py-2.5 px-3 pr-8 border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-white dark:bg-[#262626] text-[#000000] dark:text-[#f0f0f0] text-sm focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 outline-none transition-all disabled:opacity-50 cursor-pointer'
                                            value={branchCode}
                                            onChange={(e) => {
                                                setBranchCode(e.target.value);
                                                setSemester('');
                                            }}
                                            disabled={
                                                !courseCode || loadingBranches
                                            }
                                            required
                                        >
                                            <option value=''>
                                                {loadingBranches
                                                    ? 'Loading branches...'
                                                    : !courseCode
                                                      ? 'Select course first'
                                                      : 'Select branch'}
                                            </option>
                                            {branches.map((b) => (
                                                <option
                                                    key={b.branchCode}
                                                    value={b.branchCode}
                                                >
                                                    {b.branchName} ({b.branchCode})
                                                </option>
                                            ))}
                                        </select>
                                        {loadingBranches ? (
                                            <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] animate-spin pointer-events-none' />
                                        ) : (
                                            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] pointer-events-none' />
                                        )}
                                    </div>
                                </div>

                                {/* Semester Selection */}
                                <div className='space-y-1.5 sm:col-span-2'>
                                    <label className='flex items-center justify-between text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'>
                                        <span className='flex items-center gap-1.5'>
                                            <Calendar className='w-3.5 h-3.5 text-[#dd5b00]' />
                                            Semester
                                        </span>
                                        <span className='text-[11px] font-normal text-[#a39e98]'>
                                            Optional
                                        </span>
                                    </label>
                                    <div className='relative'>
                                        <select
                                            className='w-full appearance-none py-2.5 px-3 pr-8 border border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-white dark:bg-[#262626] text-[#000000] dark:text-[#f0f0f0] text-sm focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 outline-none transition-all disabled:opacity-50 cursor-pointer'
                                            value={semester}
                                            onChange={(e) =>
                                                setSemester(e.target.value)
                                            }
                                            disabled={!branchCode}
                                        >
                                            <option value=''>
                                                {!branchCode
                                                    ? 'Select branch first'
                                                    : 'All semesters (default)'}
                                            </option>
                                            {semesters.map((s) => (
                                                <option key={s} value={s}>
                                                    Semester {s}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98] pointer-events-none' />
                                    </div>
                                </div>
                            </div>

                            {/* Dialog Footer Actions */}
                            <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#f0eee6] dark:border-[#2a2a2a]'>
                                <div>
                                    {hasSavedPref && (
                                        <button
                                            type='button'
                                            onClick={handleClear}
                                            className='inline-flex items-center gap-1.5 text-xs text-[#e03e3e] hover:text-[#c42828] font-medium py-1 px-2 rounded hover:bg-[#ffebe6] dark:hover:bg-[#3d1818] transition-colors'
                                        >
                                            <Trash2 className='w-3.5 h-3.5' />
                                            Clear Shortcut
                                        </button>
                                    )}
                                </div>

                                <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
                                    <button
                                        type='button'
                                        onClick={() => setIsDialogOpen(false)}
                                        className='px-4 py-2 rounded-lg bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#2a2a2a] text-[#615d59] dark:text-[#d3d1cb] border border-[#e6e6e6] dark:border-[#383838] text-xs font-medium transition-all'
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => handleSave(false)}
                                        disabled={!canSubmit}
                                        className='px-4 py-2 rounded-lg bg-[#f6f5f4] dark:bg-[#2a2a2a] hover:bg-[#eae8e4] dark:hover:bg-[#333333] disabled:opacity-50 text-[#31302e] dark:text-[#e0e0e0] border border-[#e6e6e6] dark:border-[#383838] text-xs font-medium transition-all'
                                    >
                                        <Check className='w-3.5 h-3.5 inline-block mr-1' />
                                        Save
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => handleSave(true)}
                                        disabled={!canSubmit}
                                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] disabled:bg-[#a39e98] disabled:cursor-not-allowed text-white font-medium text-xs shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.2)] transition-all'
                                    >
                                        <span>Save & Open</span>
                                        <ArrowRight className='w-3.5 h-3.5' />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
