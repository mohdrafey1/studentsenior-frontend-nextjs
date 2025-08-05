"use client";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/config/apiUrls";
import toast from "react-hot-toast";
import { IPagination, IPyq, ICourse, IBranch } from "@/utils/interface";
import { SEARCH_DEBOUNCE, PYQ_PAGE_SIZE } from "@/constant";
import DeleteConfirmationModal from "@/components/Common/DeleteConfirmationModal";
import PaginationComponent from "@/components/Common/Pagination";
import { PyqCard } from "./PyqCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    XIcon,
    FileText,
} from "lucide-react";
import PyqFormModal, { PyqFormData } from "./PyqFormModal";
import SearchableSelect from "@/components/Common/SearchableSelect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PyqsClient = ({
    initialPyqs,
    initialPagination,
    collegeName,
}: {
    initialPyqs: IPyq[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [pyqs, setPyqs] = useState<IPyq[]>(initialPyqs);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination
    );
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );
    const [searchInput, setSearchInput] = useState(
        searchParams.get("search") || ""
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get("course") || ""
    );
    const [branchFilter, setBranchFilter] = useState(
        searchParams.get("branch") || ""
    );
    const [yearFilter, setYearFilter] = useState(
        searchParams.get("year") || ""
    );
    const [examTypeFilter, setExamTypeFilter] = useState(
        searchParams.get("examType") || ""
    );
    const [semesterFilter, setSemesterFilter] = useState(
        searchParams.get("semester") || ""
    );
    const [isSolvedFilter, setIsSolvedFilter] = useState(
        searchParams.get("isSolved") || ""
    );
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editPyq, setEditPyq] = useState<IPyq | null>(null);
    const [form, setForm] = useState({
        subject: "",
        year: "",
        examType: "",
        fileUrl: "",
        solved: false,
        isPaid: false,
        price: 0,
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Course and Branch data
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    );

    const ownerId = currentUser?._id;

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch branches when course filter changes
    useEffect(() => {
        if (courseFilter) {
            fetchBranches(courseFilter);
        } else {
            setBranches([]);
        }
    }, [courseFilter]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.getCourses);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            setCourses(data.data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error("Failed to fetch courses");
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchBranches = async (courseCode: string) => {
        setLoadingBranches(true);
        try {
            const response = await fetch(api.resources.getBranches(courseCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch branches");
            }

            setBranches(data.data || []);
        } catch (error) {
            console.error("Error fetching branches:", error);
            toast.error("Failed to fetch branches");
        } finally {
            setLoadingBranches(false);
        }
    };

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set("search", searchTerm);
        if (courseFilter) params.set("course", courseFilter);
        if (branchFilter) params.set("branch", branchFilter);
        if (yearFilter) params.set("year", yearFilter);
        if (examTypeFilter) params.set("examType", examTypeFilter);
        if (semesterFilter) params.set("semester", semesterFilter);
        if (isSolvedFilter) params.set("isSolved", isSolvedFilter);
        if (page > 1) params.set("page", page.toString());

        const newUrl = params.toString()
            ? `${pathname}?${params.toString()}`
            : pathname;
        router.replace(newUrl);
    }, [
        searchTerm,
        courseFilter,
        branchFilter,
        yearFilter,
        examTypeFilter,
        semesterFilter,
        isSolvedFilter,
        page,
        pathname,
        router,
    ]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
        }, SEARCH_DEBOUNCE);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchPyqs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", PYQ_PAGE_SIZE.toString());
            if (searchTerm) params.set("search", searchTerm);
            if (courseFilter) params.set("course", courseFilter);
            if (branchFilter) params.set("branch", branchFilter);
            if (yearFilter) params.set("year", yearFilter);
            if (examTypeFilter) params.set("examType", examTypeFilter);
            if (semesterFilter) params.set("semester", semesterFilter);
            if (isSolvedFilter) params.set("isSolved", isSolvedFilter);
            const url = `${api.pyq.getPyqByCollegeSlug(
                collegeName
            )}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch PYQs");
            }

            const data = await response.json();
            setPyqs(data.data.pyqs || []);
            setPagination(data.data.pagination || null);
        } catch (error) {
            console.error("Error fetching PYQs:", error);
            toast.error("Failed to fetch PYQs");
        } finally {
            setLoading(false);
        }
    }, [
        collegeName,
        searchTerm,
        courseFilter,
        branchFilter,
        yearFilter,
        examTypeFilter,
        semesterFilter,
        isSolvedFilter,
        page,
    ]);

    useEffect(() => {
        fetchPyqs();
    }, [fetchPyqs]);

    const openModal = (pyq?: IPyq) => {
        if (pyq) {
            setEditPyq(pyq);
            setForm({
                subject: pyq.subject._id,
                year: pyq.year,
                examType: pyq.examType,
                fileUrl: pyq.fileUrl,
                solved: pyq.solved,
                isPaid: pyq.isPaid,
                price: pyq.price,
            });
        } else {
            setEditPyq(null);
            setForm({
                subject: "",
                year: "",
                examType: "",
                fileUrl: "",
                solved: false,
                isPaid: false,
                price: 0,
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditPyq(null);
        setForm({
            subject: "",
            year: "",
            examType: "",
            fileUrl: "",
            solved: false,
            isPaid: false,
            price: 0,
        });
    };

    const handleSubmit = async (formData: PyqFormData) => {
        setLoading(true);
        try {
            const url = editPyq
                ? api.pyq.editPyq(editPyq._id)
                : api.pyq.createPyq;

            const response = await fetch(url, {
                method: editPyq ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    college: collegeName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save PYQ");
            }
            toast.success(
                data.message || editPyq
                    ? "PYQ updated successfully!"
                    : "PYQ created successfully!"
            );
        } catch (error) {
            console.error("Error saving PYQ:", error);
            throw error; // Let the form handle the error display
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    const handleDeleteRequest = (pyqId: string) => {
        setDeleteTargetId(pyqId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(api.pyq.deletePyq(deleteTargetId), {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete PYQ");
            }

            toast.success("PYQ deleted successfully!");
            fetchPyqs();
        } catch (error) {
            console.error("Error deleting PYQ:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to delete PYQ"
            );
        } finally {
            setDeleteLoading(false);
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    };

    const goToPage = (p: number) => {
        if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
    };

    const clearFilters = () => {
        setSearchInput("");
        setCourseFilter("");
        setBranchFilter("");
        setYearFilter("");
        setExamTypeFilter("");
        setSemesterFilter("");
        setIsSolvedFilter("");
        setPage(1);
    };

    const hasActiveFilters =
        searchTerm ||
        courseFilter ||
        branchFilter ||
        yearFilter ||
        examTypeFilter ||
        semesterFilter ||
        isSolvedFilter;

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex gap-3 w-full p-3 justify-center items-center bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg  dark:bg-gray-500 dark:hover:bg-gray-600"
                    >
                        <FilterIcon className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">
                                {
                                    [
                                        searchTerm,
                                        courseFilter,
                                        branchFilter,
                                        yearFilter,
                                        examTypeFilter,
                                        semesterFilter,
                                    ].filter(Boolean).length
                                }
                            </span>
                        )}
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center p-3 rounded-lg bg-red-200 gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 "
                        >
                            <XIcon className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>

                <div className="relative flex-grow">
                    <div className="flex gap-3 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 dark:bg-gray-800 dark:text-white transition-all">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search PYQs..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-transparent outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={() => openModal()}
                    className="flex gap-3 w-full sm:w-1/5 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add PYQ
                </button>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <select
                            value={isSolvedFilter}
                            onChange={(e) => setIsSolvedFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">All</option>
                            <option value="true">Solved</option>
                            <option value="false">Unsolved</option>
                        </select>

                        {/* Course Filter */}
                        <SearchableSelect
                            // label="Course"
                            value={courseFilter}
                            onChange={setCourseFilter}
                            options={courses.map((course) => ({
                                value: course.courseCode,
                                label: course.courseName,
                            }))}
                            placeholder="Select Course"
                            loading={loadingCourses}
                        />

                        {/* Branch Filter */}
                        <SearchableSelect
                            // label="Branch"
                            value={branchFilter}
                            onChange={setBranchFilter}
                            options={branches.map((branch) => ({
                                value: branch.branchCode,
                                label: branch.branchName,
                            }))}
                            placeholder="Select Branch"
                            loading={loadingBranches}
                            disabled={!courseFilter}
                        />

                        {/* Year Filter */}
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">All Years</option>
                            <option value="2021-22">2021-2022</option>
                            <option value="2022-23">2022-2023</option>
                            <option value="2023-24">2023-2024</option>
                            <option value="2024-25">2024-2025</option>
                        </select>

                        {/* Exam Type Filter */}
                        <select
                            value={examTypeFilter}
                            onChange={(e) => setExamTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">All Exam Types</option>
                            <option value="midsem1">Midsem 1</option>
                            <option value="midsem2">Midsem 2</option>
                            <option value="endsem">Endsem</option>
                            <option value="improvement">Improvement</option>
                        </select>

                        {/* Semester Filter */}
                        <select
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value="">All Semesters</option>
                            <option value="1">1st Semester</option>
                            <option value="2">2nd Semester</option>
                            <option value="3">3rd Semester</option>
                            <option value="4">4th Semester</option>
                            <option value="5">5th Semester</option>
                            <option value="6">6th Semester</option>
                            <option value="7">7th Semester</option>
                            <option value="8">8th Semester</option>
                            <option value="9">9th Semester</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                </div>
            )}

            {/* PYQs Grid */}
            {!loading && (
                <>
                    {pyqs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pyqs.map((pyq) => (
                                <PyqCard
                                    key={pyq._id}
                                    pyq={pyq}
                                    onEdit={openModal}
                                    onDelete={handleDeleteRequest}
                                    ownerId={ownerId || ""}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No PYQs Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {hasActiveFilters
                                        ? "Try adjusting your filters or add a new PYQ."
                                        : "Be the first to add a PYQ for this college!"}
                                </p>
                                <button
                                    onClick={() => openModal()}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add PYQ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <PaginationComponent
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={goToPage}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <PyqFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                editPyq={editPyq}
                courses={courses}
                branches={branches}
                loadingCourses={loadingCourses}
                loadingBranches={loadingBranches}
                fetchBranches={fetchBranches}
            />

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message="Are you sure you want to delete this PYQ? This action cannot be undone."
            />
        </div>
    );
};

export default PyqsClient;
