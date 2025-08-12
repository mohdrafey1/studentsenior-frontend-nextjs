"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/config/apiUrls";
import toast from "react-hot-toast";
import {
    BookOpen,
    GraduationCap,
    GitBranch,
    Calendar,
    ArrowRight,
    Edit3,
    Play,
    Save,
    X,
    ChevronDown,
} from "lucide-react";

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

const LOCAL_STORAGE_KEY = "ss:resourcePref";

export default function ResourceQuickStart({ colleges }: Props) {
    const router = useRouter();

    const [collegeSlug, setCollegeSlug] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");
    const [branchCode, setBranchCode] = useState<string>("");
    const [semester, setSemester] = useState<string>("");

    const [courses, setCourses] = useState<Course[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [semesters, setSemesters] = useState<number[]>([]);

    const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
    const [loadingBranches, setLoadingBranches] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(true);

    // Load saved preference once (guard against StrictMode double-invoke)
    const didInit = useRef(false);
    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!saved) {
                setIsEditing(true);
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
            setIsEditing(
                !(pref.collegeSlug && pref.courseCode && pref.branchCode)
            );
        } catch {
            setIsEditing(true);
        }
    }, []);

    // Fetch courses once
    useEffect(() => {
        let cancelled = false;
        async function loadCourses() {
            try {
                setLoadingCourses(true);
                const res = await fetch(api.resources.getCourses);
                if (!res.ok) throw new Error("Failed to load courses");
                const data = await res.json();
                if (!cancelled) setCourses(data?.data ?? []);
            } catch (e) {
                toast.error("Could not load courses");
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
                if (!res.ok) throw new Error("Failed to load branches");
                const data = await res.json();
                if (!cancelled) setBranches(data?.data ?? []);
            } catch (e) {
                toast.error("Could not load branches");
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

    // Derive semesters when branch changes (fallback fixed list)
    useEffect(() => {
        if (!branchCode) {
            setSemesters([]);
            return;
        }
        setSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
        // Do not mutate `semester` here; keep whatever is in state (from localStorage or user)
    }, [branchCode]);

    const canSubmit = useMemo(() => {
        return Boolean(collegeSlug && courseCode && branchCode);
    }, [collegeSlug, courseCode, branchCode]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) {
            toast.error("Please complete all selections");
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
            toast.success("Preference saved successfully!");
            setIsEditing(false);
        } catch {
            toast.error("Failed to save preference");
        }
    }

    function handleGo() {
        if (!canSubmit) {
            toast.error("Incomplete preference");
            return;
        }

        const query = semester ? `?semester=${semester}` : "";
        router.push(
            `/${collegeSlug}/resources/${courseCode}/${branchCode}${query}`
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-sky-100/50 dark:shadow-gray-900/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-200/60 dark:hover:shadow-gray-900/40">
                {/* Background decoration */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-sky-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="relative z-10 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl shadow-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Quick Resource Access
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
                        Jump directly to your semester resources
                    </p>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleGo}
                            className="group flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-sky-500/25"
                        >
                            <Play className="w-4 h-4" />
                            Go Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Preferences
                        </button>
                    </div>
                </div>

                {!isEditing ? (
                    /* Summary View */
                    <div className="relative z-10 space-y-6">
                        {/* Saved Preferences Display */}
                        <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border border-sky-200/50 dark:border-sky-700/50">
                            <h4 className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-4 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Your Saved Preferences
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            College
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {colleges.find(
                                                (c) => c.slug === collegeSlug
                                            )?.name || collegeSlug}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                        <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Course
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {courses.find(
                                                (c) =>
                                                    c.courseCode === courseCode
                                            )?.courseName || courseCode}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Branch
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {branchCode}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Semester
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {semester
                                                ? `Semester ${semester}`
                                                : "All Semesters"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Edit Form */
                    <form
                        onSubmit={handleSubmit}
                        className="relative z-10 space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* College Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    College
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                                        value={collegeSlug}
                                        onChange={(e) =>
                                            setCollegeSlug(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select your college
                                        </option>
                                        {colleges.map((c) => (
                                            <option key={c.slug} value={c.slug}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Course Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    Course
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        value={courseCode}
                                        onChange={(e) => {
                                            setCourseCode(e.target.value);
                                            setBranchCode("");
                                            setSemester("");
                                        }}
                                        disabled={loadingCourses}
                                    >
                                        <option value="">
                                            {loadingCourses
                                                ? "Loading courses..."
                                                : "Select course"}
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
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Branch Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    Branch
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        value={branchCode}
                                        onChange={(e) => {
                                            setBranchCode(e.target.value);
                                            setSemester("");
                                        }}
                                        disabled={
                                            !courseCode || loadingBranches
                                        }
                                    >
                                        <option value="">
                                            {loadingBranches
                                                ? "Loading branches..."
                                                : !courseCode
                                                ? "Select course first"
                                                : "Select branch"}
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
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Semester Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    Semester
                                    <span className="text-xs text-gray-500">
                                        (optional)
                                    </span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                        value={semester}
                                        onChange={(e) =>
                                            setSemester(e.target.value)
                                        }
                                        disabled={!branchCode}
                                    >
                                        <option value="">
                                            {!branchCode
                                                ? "Select branch first"
                                                : "All semesters"}
                                        </option>
                                        {semesters.map((s) => (
                                            <option key={s} value={s}>
                                                Semester {s}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="group flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                Save Preferences
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>

                            {/* <button
                                type="button"
                                onClick={handleGo}
                                disabled={!canSubmit}
                                className="group flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                <Play className="w-4 h-4" />
                                Go Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button> */}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
