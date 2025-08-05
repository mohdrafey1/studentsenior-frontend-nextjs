"use client";
import React, { useEffect, useState } from "react";
import { IPyq, ICourse, IBranch } from "@/utils/interface";
import { api } from "@/config/apiUrls";
import { UploadIcon, DollarSign, CheckCircle, X } from "lucide-react";
import SearchableSelect from "@/components/Common/SearchableSelect";

export interface PyqFormData {
    subject: string;
    year: string;
    examType: string;
    fileUrl: string;
    solved: boolean;
    isPaid: boolean;
    price: number;
}

interface PyqFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: PyqFormData) => void;
    form: PyqFormData;
    setForm: React.Dispatch<React.SetStateAction<PyqFormData>>;
    editPyq: IPyq | null;
    courses: ICourse[];
    branches: IBranch[];
    loadingCourses: boolean;
    loadingBranches: boolean;
    fetchBranches: (courseCode: string) => void;
}

const PyqFormModal: React.FC<PyqFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    editPyq,
    courses,
    branches,
    loadingCourses,
    loadingBranches,
    fetchBranches,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [subjects, setSubjects] = useState<
        Array<{ _id: string; subjectName: string; semester: number }>
    >([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (editPyq) {
                setSelectedCourse(editPyq.subject.branch.course.courseCode);
                fetchSubjects(editPyq.subject.branch.branchCode);
            } else {
                setSelectedCourse("");
                setSubjects([]);
            }
        }
    }, [isOpen, editPyq]);

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

    const handleCourseChange = (courseCode: string) => {
        setSelectedCourse(courseCode);
        setForm((prev) => ({ ...prev, subject: "" }));
        if (courseCode) {
            fetchBranches(courseCode);
        }
    };

    const handleBranchChange = (branchCode: string) => {
        if (branchCode) {
            fetchSubjects(branchCode);
        } else {
            setSubjects([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(form);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(api.aws.presignedUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to get upload URL");
            }

            // Upload to S3
            const uploadResponse = await fetch(data.data.uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload file");
            }

            setForm((prev) => ({ ...prev, fileUrl: data.data.fileUrl }));
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {editPyq ? "Edit PYQ" : "Add New PYQ"}
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
                    {/* Course Selection */}
                    <div>
                        <SearchableSelect
                            label="Course *"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            options={courses.map((course) => ({
                                value: course.courseCode,
                                label: course.courseName,
                            }))}
                            placeholder="Select Course"
                            loading={loadingCourses}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <SearchableSelect
                            label="Branch *"
                            value={
                                form.subject
                                    ? branches.find(
                                          (b) =>
                                              b.branchCode ===
                                              form.subject.split("-")[0]
                                      )?.branchCode || ""
                                    : ""
                            }
                            onChange={handleBranchChange}
                            options={branches.map((branch) => ({
                                value: branch.branchCode,
                                label: branch.branchName,
                            }))}
                            placeholder="Select Branch"
                            loading={loadingBranches}
                            disabled={!selectedCourse}
                        />
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <SearchableSelect
                            label="Subject *"
                            value={form.subject}
                            onChange={(subjectId) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subject: subjectId,
                                }))
                            }
                            options={subjects.map((subject) => ({
                                value: subject._id,
                                label: `${subject.subjectName} (${subject.semester} Semester)`,
                            }))}
                            placeholder="Select Subject"
                            loading={loadingSubjects}
                        />
                    </div>

                    {/* Year and Exam Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                                Year *
                            </label>
                            <select
                                value={form.year}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        year: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="2022-23">2022-2023</option>
                                <option value="2023-24">2023-2024</option>
                                <option value="2024-25">2024-2025</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                                Exam Type *
                            </label>

                            <select
                                value={form.examType}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        examType: e.target.value,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Exam Type</option>
                                <option value="midsem1">Midsem 1</option>
                                <option value="midsem2">Midsem 2</option>
                                <option value="endsem">Endsem</option>
                                <option value="improvement">Improvement</option>
                            </select>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            PYQ File *
                        </label>

                        <div className="flex items-center gap-4">
                            <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-sky-500 dark:hover:border-sky-400 transition-colors duration-200 cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="hidden"
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

                    {/* Solved and Paid Options */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="solved"
                                checked={form.solved}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        solved: e.target.checked,
                                    }))
                                }
                                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                                htmlFor="solved"
                                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Solved Paper
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPaid"
                                checked={form.isPaid}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isPaid: e.target.checked,
                                    }))
                                }
                                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                                htmlFor="isPaid"
                                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Paid Paper
                            </label>
                        </div>
                    </div>

                    {/* Price (if paid) */}
                    {form.isPaid && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Price (₹)
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
                                    placeholder="0"
                                    min="0"
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
                                !form.subject ||
                                !form.year ||
                                !form.examType ||
                                !form.fileUrl
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading
                                ? "Saving..."
                                : editPyq
                                ? "Update PYQ"
                                : "Add PYQ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PyqFormModal;
