"use client";
import React, { useEffect, useState, useRef } from "react";
import { ICourse, IBranch } from "@/utils/interface";
import { api } from "@/config/apiUrls";
import { UploadIcon, DollarSign, CheckCircle, X } from "lucide-react";
import SearchableSelect from "@/components/Common/SearchableSelect";
import toast from "react-hot-toast";

export interface NotesFormData {
    title: string;
    description: string;
    fileUrl: string;
    subjectCode: string;
    isPaid: boolean;
    price: number;
}

interface NotesFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NotesFormData) => Promise<void>;
    form: NotesFormData;
    setForm: React.Dispatch<React.SetStateAction<NotesFormData>>;
    courses: ICourse[];
    branches: IBranch[];
    loadingCourses: boolean;
    loadingBranches: boolean;
    fetchBranches: (courseCode: string) => Promise<void>;
}

const NotesFormModal: React.FC<NotesFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    courses,
    branches,
    loadingCourses,
    loadingBranches,
    fetchBranches,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [subjects, setSubjects] = useState<
        Array<{
            _id: string;
            subjectName: string;
            subjectCode: string;
            semester: number;
        }>
    >([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const appliedPrefRef = useRef(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedCourse("");
            setSubjects([]);
            appliedPrefRef.current = false;
        }
    }, [isOpen]);

    // Apply saved preference: set course by courseCode when modal opens
    useEffect(() => {
        if (!isOpen || courses.length === 0 || selectedCourse) return;
        try {
            const saved = localStorage.getItem("ss:resourcePref");
            if (!saved) return;
            const pref = JSON.parse(saved) as { courseCode?: string };
            if (!pref.courseCode) return;
            const match = courses.find((c) => c.courseCode === pref.courseCode);
            if (match) {
                setSelectedCourse(match._id);
                // Trigger branches load
                fetchBranches(match.courseCode);
            }
        } catch {
            // ignore
        }
    }, [isOpen, courses, selectedCourse, fetchBranches]);

    // After branches load, apply saved branch by branchCode (once per open)
    useEffect(() => {
        if (!isOpen || appliedPrefRef.current || branches.length === 0) return;
        try {
            const saved = localStorage.getItem("ss:resourcePref");
            if (!saved) return;
            const pref = JSON.parse(saved) as { branchCode?: string };
            if (!pref.branchCode) return;
            const match = branches.find(
                (b) => b.branchCode === pref.branchCode
            );
            if (match) {
                setSelectedBranch(match._id);
                // Also prefetch subjects list for convenience
                fetchSubjects(match.branchCode);
                appliedPrefRef.current = true;
            }
        } catch {
            // ignore
        }
    }, [isOpen, branches]);

    const fetchSubjects = async (branchCode: string) => {
        setLoadingSubjects(true);
        try {
            const response = await fetch(api.resources.getSubjects(branchCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch subjects");
            }

            setSubjects(data.data || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        const course = courses.find((c) => c._id === courseId);
        if (course) {
            fetchBranches(course.courseCode);
        }
    };

    const handleBranchChange = (branchId: string) => {
        setSelectedBranch(branchId);
        const branch = branches.find((b) => b._id === branchId);
        if (branch) {
            fetchSubjects(branch.branchCode);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                toast.error("Only PDF files are allowed.");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size exceeds 10MB.");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!selectedCourse) {
            toast.error("Please select a course");
            return;
        }

        if (!selectedBranch) {
            toast.error("Please select a branch");
            return;
        }

        if (!form.subjectCode) {
            toast.error("Please select a subject");
            return;
        }

        if (!form.title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!form.description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        if (form.isPaid && (!form.price || form.price < 25)) {
            toast.error(
                "Please set a valid price (minimum 25 points) for paid content"
            );
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Processing your request...");

        try {
            let fileUrl = form.fileUrl;

            // Upload file if new file is selected
            if (file) {
                const fileName = `${form.subjectCode}-${Date.now()}.pdf`;
                const fileType = file.type;

                // Step 1: Get pre-signed URL
                const response = await fetch(`${api.aws.presignedUrl}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        fileName: `ss-notes/${fileName}`,
                        fileType,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.message || "Failed to get presigned URL"
                    );
                }

                const { uploadUrl, key } = await response.json();

                // Step 2: Upload file directly to S3
                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": fileType,
                    },
                    body: file,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload file");
                }

                fileUrl = `https://dixu7g0y1r80v.cloudfront.net/${key}`;
                setForm((prev) => ({ ...prev, fileUrl }));
            }

            if (!fileUrl) {
                throw new Error("File URL is required");
            }

            // Submit the form data
            await onSubmit({
                ...form,
                fileUrl,
            });

            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to save note"
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    // Format data for searchable selects
    const courseOptions = courses.map((course) => ({
        value: course._id,
        label: `${course.courseName} (${course.courseCode})`,
    }));

    const branchOptions = branches.map((branch) => ({
        value: branch._id,
        label: `${branch.branchName} (${branch.branchCode})`,
    }));

    const subjectOptions = subjects.map((subject) => ({
        value: subject.subjectCode,
        label: `${subject.subjectName} (${subject.subjectCode})`,
    }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Add New Note
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 bg-white dark:bg-gray-800"
                >
                    {/* Title */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            placeholder="Enter note title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            Description *
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            placeholder="Enter note description"
                            required
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <SearchableSelect
                            label="Course *"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            options={courseOptions}
                            placeholder="Select Course"
                            loading={loadingCourses}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <SearchableSelect
                            label="Branch *"
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            options={branchOptions}
                            placeholder="Select Branch"
                            loading={loadingBranches}
                            disabled={!selectedCourse}
                        />
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <SearchableSelect
                            label="Subject *"
                            value={form.subjectCode}
                            onChange={(subjectCode) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subjectCode,
                                }))
                            }
                            options={subjectOptions}
                            placeholder="Select Subject"
                            loading={loadingSubjects}
                            disabled={!selectedBranch}
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            Upload PDF (Max 10MB) *
                        </label>

                        <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-sky-500 dark:hover:border-sky-400 transition-colors duration-200 cursor-pointer">
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="w-full border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                                <div className="text-center">
                                    <UploadIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {form.fileUrl
                                            ? "File uploaded"
                                            : "Click to upload file"}
                                    </span>
                                </div>
                            </label>
                            {form.fileUrl && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paid Option */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Premium Content
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPaid: !prev.isPaid,
                                    price: !prev.isPaid ? 25 : 0,
                                }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.isPaid
                                    ? "bg-violet-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.isPaid
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Price Input - Only visible when isPaid is true */}
                    {form.isPaid && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Price (in Points - 5 points = 1 INR)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    placeholder="25"
                                    min="25"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !form.title ||
                                !form.description ||
                                !form.subjectCode ||
                                (form.isPaid &&
                                    (!form.price || form.price < 25))
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? "Saving..." : "Add Note"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotesFormModal;
