'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ICourse, IBranch } from '@/utils/interface';
import { api } from '@/config/apiUrls';
import { UploadIcon, DollarSign, CheckCircle, X } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import toast from 'react-hot-toast';

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
    collegeSlug: string;
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
    collegeSlug,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
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
            setSelectedCourse('');
            setSubjects([]);
            appliedPrefRef.current = false;
        }
    }, [isOpen]);

    // Apply saved preference: set course by courseCode when modal opens
    useEffect(() => {
        if (!isOpen || courses.length === 0 || selectedCourse) return;
        try {
            const saved = localStorage.getItem('ss:resourcePref');
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
            const saved = localStorage.getItem('ss:resourcePref');
            if (!saved) return;
            const pref = JSON.parse(saved) as { branchCode?: string };
            if (!pref.branchCode) return;
            const match = branches.find(
                (b) => b.branchCode === pref.branchCode,
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
            const response = await fetch(
                api.resources.getSubjects(branchCode, collegeSlug),
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch subjects');
            }

            setSubjects(data.data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
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
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed.');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10MB.');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!selectedCourse) {
            toast.error('Please select a course');
            return;
        }

        if (!selectedBranch) {
            toast.error('Please select a branch');
            return;
        }

        if (!form.subjectCode) {
            toast.error('Please select a subject');
            return;
        }

        if (!form.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!form.description.trim()) {
            toast.error('Please enter a description');
            return;
        }

        if (!file) {
            toast.error('Please select a PDF file');
            return;
        }

        if (form.isPaid && (!form.price || form.price < 25)) {
            toast.error(
                'Please set a valid price (minimum 25 points) for paid content',
            );
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Processing your request...');

        try {
            let fileUrl = form.fileUrl;

            // Upload file if new file is selected
            if (file) {
                const fileName = `${form.subjectCode}-${Date.now()}.pdf`;
                const fileType = file.type;

                // Step 1: Get pre-signed URL
                const response = await fetch(`${api.aws.presignedUrl}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        fileName: `ss-notes/${fileName}`,
                        fileType,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.message || 'Failed to get presigned URL',
                    );
                }

                const { uploadUrl, key } = await response.json();

                // Step 2: Upload file directly to S3
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': fileType,
                    },
                    body: file,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload file');
                }

                fileUrl = `https://dixu7g0y1r80v.cloudfront.net/${key}`;
                setForm((prev) => ({ ...prev, fileUrl }));
            }

            if (!fileUrl) {
                throw new Error('File URL is required');
            }

            // Submit the form data
            await onSubmit({
                ...form,
                fileUrl,
            });

            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to save note',
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
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white overflow-y-auto dark:bg-[#191919] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                {/* Header */}
                <div className='flex items-center justify-between p-5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] sticky top-0 bg-white dark:bg-[#191919] z-10'>
                    <h2 className='text-lg font-bold text-[#101828] dark:text-[#ededed]'>
                        Add New Note
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#282828]'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='overflow-y-auto p-5 space-y-5 bg-white dark:bg-[#191919]'
                >
                    {/* Title */}
                    <div>
                        <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Title <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className='w-full px-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                            placeholder='Enter note title'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Description <span className='text-red-500'>*</span>
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
                            className='w-full px-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                            placeholder='Enter note description'
                            required
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <SearchableSelect
                            label='Course'
                            required
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            options={courseOptions}
                            placeholder='Select Course'
                            loading={loadingCourses}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <SearchableSelect
                            label='Branch'
                            required
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            options={branchOptions}
                            placeholder='Select Branch'
                            loading={loadingBranches}
                            disabled={!selectedCourse}
                        />
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <SearchableSelect
                            label='Subject'
                            required
                            value={form.subjectCode}
                            onChange={(subjectCode) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subjectCode,
                                }))
                            }
                            options={subjectOptions}
                            placeholder='Select Subject'
                            loading={loadingSubjects}
                            disabled={!selectedBranch}
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Upload PDF (Max 10MB) <span className='text-red-500'>*</span>
                        </label>

                        <div className='flex items-center gap-4'>
                            <label className='flex-1 flex flex-col items-center justify-center px-4 py-6 border border-dashed border-[#e6e6e6] dark:border-[#383838] rounded-lg hover:border-[#0075de] dark:hover:border-[#0075de] transition-colors duration-200 cursor-pointer bg-[#fcfbf9] dark:bg-[#202020]'>
                                <input
                                    id='file-upload'
                                    type='file'
                                    className='hidden'
                                    accept='.pdf'
                                    onChange={handleFileChange}
                                    required={!form.fileUrl}
                                />
                                <div className='text-center'>
                                    <UploadIcon className='w-6 h-6 text-[#8c8883] dark:text-[#787672] mx-auto mb-2' />
                                    <span className='text-sm font-medium text-[#101828] dark:text-[#ededed]'>
                                        {file || form.fileUrl
                                            ? 'File selected'
                                            : 'Click to upload PDF'}
                                    </span>
                                </div>
                            </label>
                            {(file || form.fileUrl) && (
                                <div className='flex items-center gap-1.5 text-xs font-medium text-[#1aae39] dark:text-[#4ade80] bg-[#eaf7ec] dark:bg-[#163821] px-2.5 py-1.5 rounded-md border border-[#d2f0d9] dark:border-[#205130]'>
                                    <CheckCircle className='w-3.5 h-3.5' />
                                    Ready
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='h-px w-full bg-[#f0eee9] dark:bg-[#2a2a2a] my-2' />

                    {/* Paid Option */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <span className='block text-sm font-semibold text-[#101828] dark:text-[#ededed]'>
                                Premium Content
                            </span>
                            <span className='text-xs text-[#8c8883] dark:text-[#787672]'>
                                Charge points for downloading
                            </span>
                        </div>
                        <button
                            type='button'
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPaid: !prev.isPaid,
                                    price: !prev.isPaid ? 25 : 0,
                                }))
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                form.isPaid
                                    ? 'bg-[#d97706]'
                                    : 'bg-[#d0ceca] dark:bg-[#383838]'
                            }`}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                    form.isPaid
                                        ? 'translate-x-4.5'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Price Input - Only visible when isPaid is true */}
                    {form.isPaid && (
                        <div className='pt-2'>
                            <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                                Price (in Points - 5 points = ₹1)
                            </label>
                            <div className='relative'>
                                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c8883] dark:text-[#787672]' />
                                <input
                                    type='number'
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className='w-full pl-9 pr-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                                    placeholder='25'
                                    min='25'
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex justify-end gap-2.5 pt-6 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-[#101828] dark:text-[#ededed] bg-white dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#383838] rounded-lg hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors duration-200 shadow-xs'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={
                                loading ||
                                !form.title ||
                                !form.description ||
                                !form.subjectCode ||
                                (form.isPaid &&
                                    (!form.price || form.price < 25))
                            }
                            className='px-4 py-2 text-sm font-semibold text-white bg-[#0075de] rounded-lg hover:bg-[#0062bd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-xs active:scale-[0.98]'
                        >
                            {loading ? 'Saving...' : 'Add Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotesFormModal;
