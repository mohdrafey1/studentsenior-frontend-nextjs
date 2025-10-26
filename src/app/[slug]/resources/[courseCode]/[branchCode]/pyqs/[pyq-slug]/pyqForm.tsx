'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import { UploadIcon, CheckCircle, X } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import toast from 'react-hot-toast';

export interface PyqFormData {
    subject: string;
    year: string;
    examType: string;
    fileUrl: string;
}

// Define ISubject interface for clarity
interface ISubject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
}

interface PyqFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: PyqFormData) => void;
    form: PyqFormData;
    setForm: React.Dispatch<React.SetStateAction<PyqFormData>>;
    branchCode: string; // Prop to fetch subjects
    subjectCode: string; // New prop to pre-select the subject
}

const PyqFormModal: React.FC<PyqFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    branchCode,
    subjectCode, // Destructure the new prop
}) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSubjects([]);
        }
    }, [isOpen]);

    const fetchSubjects = useCallback(async (bCode: string) => {
        if (!bCode) return;
        setLoadingSubjects(true);
        try {
            const response = await fetch(api.resources.getSubjects(bCode));
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
    }, []);

    // Fetch subjects when the modal opens or branchCode changes
    useEffect(() => {
        if (isOpen && branchCode) {
            fetchSubjects(branchCode);
        }
    }, [isOpen, branchCode, fetchSubjects]);

    // --- NEW: Effect to pre-select subject ---
    // This runs after subjects are fetched and whenever subjectCode changes
    useEffect(() => {
        if (subjects.length > 0 && subjectCode) {
            const matchingSubject = subjects.find(
                (s) => s.subjectCode === subjectCode,
            );
            if (matchingSubject) {
                setForm((prev) => ({ ...prev, subject: matchingSubject._id }));
            }
        }
        // We only want this to run when subjects are loaded or the code changes.
        // Adding setForm to deps can cause loops if not careful, but here it's fine
        // as it only sets the form based on external props (subjectCode)
    }, [subjects, subjectCode, setForm]);

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
        if (!form.subject) {
            toast.error('Please select a subject');
            return;
        }

        if (!form.year) {
            toast.error('Please select a year');
            return;
        }

        if (!form.examType) {
            toast.error('Please select an exam type');
            return;
        }

        if (!file) {
            toast.error('Please select a PDF file');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Processing your request...');

        try {
            let fileUrl = form.fileUrl;

            // Upload file if new file is selected
            if (file) {
                const fileName = `${
                    subjects.find((s) => s._id === form.subject)?.subjectCode ||
                    form.subject
                }-${Date.now()}.pdf`;
                const fileType = file.type;

                // Step 1: Get pre-signed URL
                const response = await fetch(`${api.aws.presignedUrl}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        fileName: `ss-pyq/${fileName}`,
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
                error instanceof Error ? error.message : 'Failed to save PYQ',
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    // Format data for searchable selects
    const subjectOptions = subjects.map((subject) => ({
        value: subject._id,
        label: `${subject.subjectName} (${subject.subjectCode})`,
    }));

    const examTypeOptions = [
        { value: 'midsem1', label: 'Midsem 1' },
        { value: 'midsem2', label: 'Midsem 2' },
        { value: 'improvement', label: 'Improvement' },
        { value: 'endsem', label: 'Endsem' },
    ];

    const yearOptions = [
        { value: '2025-26', label: '2025-26' },
        { value: '2024-25', label: '2024-25' },
        { value: '2023-24', label: '2023-24' },
        { value: '2022-23', label: '2022-23' },
    ];

    if (!isOpen) return null;

    return (
        // Added a higher z-index as requested in the previous turn
        <div className='fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-[9999] p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                        Add New PYQ
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4 bg-white dark:bg-gray-800'
                >
                    {/* Subject Selection */}
                    <div>
                        <SearchableSelect
                            label='Subject *'
                            value={form.subject} // This is now pre-filled
                            onChange={(subjectId) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subject: subjectId,
                                }))
                            }
                            options={subjectOptions}
                            placeholder='Select Subject'
                            loading={loadingSubjects}
                        />
                    </div>

                    {/* Year and Exam Type */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
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
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                required
                            >
                                <option value=''>Select Year</option>
                                {yearOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
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
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                required
                            >
                                <option value=''>Select Exam Type</option>
                                {examTypeOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
                            Upload PDF (Max 10MB) *
                        </label>

                        <div className='flex items-center gap-4'>
                            <label className='flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-sky-500 dark:hover:border-sky-400 transition-colors duration-200 cursor-pointer'>
                                <input
                                    id='file-upload'
                                    type='file'
                                    className='w-full border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-500 file:text-white hover:file:bg-sky-600'
                                    accept='.pdf'
                                    onChange={handleFileChange}
                                    required
                                />
                                <div className='text-center'>
                                    <UploadIcon className='w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2' />
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                        {form.fileUrl
                                            ? 'File uploaded'
                                            : 'Click to upload file'}
                                    </span>
                                </div>
                            </label>
                            {form.fileUrl && (
                                <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                                    <CheckCircle className='w-4 h-4' />
                                    Uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={
                                loading ||
                                !form.subject ||
                                !form.year ||
                                !form.examType
                            }
                            className='px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                        >
                            {loading ? 'Saving...' : 'Add PYQ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PyqFormModal;
