'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import { UploadIcon, CheckCircle, X, DollarSign } from 'lucide-react';
import SearchableSelect from '@/components/Common/SearchableSelect';
import toast from 'react-hot-toast';

export interface PyqFormData {
    subject: string;
    year: string;
    examType: string;
    fileUrl: string;
    solved: boolean;
    isPaid: boolean;
    price: number;
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
    collegeSlug: string; // College slug for filtering subjects
}

const PyqFormModal: React.FC<PyqFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    branchCode,
    subjectCode, // Destructure the new prop
    collegeSlug,
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
            const response = await fetch(
                api.resources.getSubjects(bCode, collegeSlug),
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
    }, [collegeSlug]);

    // Fetch subjects when the modal opens or branchCode changes
    useEffect(() => {
        if (isOpen && branchCode) {
            fetchSubjects(branchCode);
        }
    }, [isOpen, branchCode, fetchSubjects]);

    useEffect(() => {
        if (subjects.length > 0 && subjectCode) {
            const matchingSubject = subjects.find(
                (s) => s.subjectCode === subjectCode,
            );
            if (matchingSubject) {
                setForm((prev) => ({ ...prev, subject: matchingSubject._id }));
            }
        }
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
        // { value: '2027-28', label: '2027-28' },
        { value: '2026-27', label: '2026-27' },
        { value: '2025-26', label: '2025-26' },
        { value: '2024-25', label: '2024-25' },
        { value: '2023-24', label: '2023-24' },
        { value: '2022-23', label: '2022-23' },
    ];

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4'>
            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b border-[#e6e6e6] dark:border-[#2f2f2f] sticky top-0 bg-white dark:bg-[#1c1c1c] z-10'>
                    <h2 className='text-lg font-bold text-[#101828] dark:text-white'>
                        Add New PYQ
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full text-[#8c8883] dark:text-[#787672] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    {/* Subject Selection */}
                    <div>
                        <label className='block text-sm font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Subject <span className='text-red-500'>*</span>
                        </label>
                        <SearchableSelect
                            label=''
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
                            disabled={true}
                        />
                    </div>

                    {/* Year and Exam Type */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                                Year <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={form.year}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        year: e.target.value,
                                    }))
                                }
                                className='w-full px-3.5 py-2.5 border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] outline-none transition-all shadow-sm'
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
                            <label className='block text-sm font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                                Exam Type <span className='text-red-500'>*</span>
                            </label>

                            <select
                                value={form.examType}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        examType: e.target.value,
                                    }))
                                }
                                className='w-full px-3.5 py-2.5 border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl bg-white dark:bg-[#191919] text-[#101828] dark:text-white focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] outline-none transition-all shadow-sm'
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
                        <label className='block text-sm font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Upload PDF (Max 10MB) <span className='text-red-500'>*</span>
                        </label>

                        <div className='flex flex-col sm:flex-row items-center gap-4'>
                            <label className='w-full sm:flex-1 flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-[#e6e6e6] dark:border-[#383838] rounded-xl bg-[#fbfbfb] dark:bg-[#191919] hover:bg-white dark:hover:bg-[#202020] hover:border-[#0075de] dark:hover:border-[#62aef0] transition-colors cursor-pointer group'>
                                <input
                                    id='file-upload'
                                    type='file'
                                    className='hidden'
                                    accept='.pdf'
                                    onChange={handleFileChange}
                                    required={!form.fileUrl}
                                />
                                <div className='flex flex-col items-center text-center'>
                                    <div className='w-10 h-10 rounded-full bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform'>
                                        <UploadIcon className='w-5 h-5' />
                                    </div>
                                    <span className='text-sm font-medium text-[#101828] dark:text-white'>
                                        {file ? file.name : (form.fileUrl ? 'Change file' : 'Click to upload')}
                                    </span>
                                    {!file && !form.fileUrl && (
                                        <span className='text-xs text-[#615d59] dark:text-[#787672] mt-1'>
                                            PDF up to 10MB
                                        </span>
                                    )}
                                </div>
                            </label>
                            {form.fileUrl && !file && (
                                <div className='flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg'>
                                    <CheckCircle className='w-4 h-4' />
                                    Existing File Selected
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Solved Option */}
                    <div className='flex items-center justify-between pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                        <div>
                            <span className='text-sm font-bold text-[#101828] dark:text-white block'>
                                Solved Paper
                            </span>
                            <span className='text-xs text-[#615d59] dark:text-[#9ea3ae]'>
                                Does this paper include solutions?
                            </span>
                        </div>
                        <button
                            type='button'
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    solved: !prev.solved,
                                    // Reset paid status when unsolved
                                    isPaid: !prev.solved ? false : prev.isPaid,
                                    price: !prev.solved ? 0 : prev.price,
                                }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0075de] focus:ring-offset-2 dark:focus:ring-offset-[#1c1c1c] ${
                                form.solved
                                    ? 'bg-[#0075de]'
                                    : 'bg-[#e6e6e6] dark:bg-[#383838]'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.solved
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Paid Option - Only visible when solved */}
                    {form.solved && (
                        <div className='flex items-center justify-between pt-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div>
                                <span className='text-sm font-bold text-[#101828] dark:text-white block'>
                                    Premium Content
                                </span>
                                <span className='text-xs text-[#615d59] dark:text-[#9ea3ae]'>
                                    Sell this solved paper for points
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0075de] focus:ring-offset-2 dark:focus:ring-offset-[#1c1c1c] ${
                                    form.isPaid
                                        ? 'bg-[#0075de]'
                                        : 'bg-[#e6e6e6] dark:bg-[#383838]'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        form.isPaid
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    )}

                    {/* Price Input - Only visible when isPaid is true */}
                    {form.solved && form.isPaid && (
                        <div className='bg-[#fbfbfb] dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl p-4'>
                            <label className='block text-sm font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                                Price <span className='font-normal text-[#615d59] dark:text-[#9ea3ae]'>(in Points - 5 points = 1 INR)</span>
                            </label>
                            <div className='relative'>
                                <DollarSign className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8c8883] dark:text-[#787672]' />
                                <input
                                    type='number'
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className='w-full pl-10 pr-3.5 py-2.5 border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl bg-white dark:bg-[#1c1c1c] text-[#101828] dark:text-white focus:ring-2 focus:ring-[#0075de]/20 focus:border-[#0075de] dark:focus:ring-[#62aef0]/20 dark:focus:border-[#62aef0] outline-none transition-all shadow-sm'
                                    placeholder='25'
                                    min='25'
                                />
                            </div>
                        </div>
                    )}
                    {/* Submit Button */}
                    <div className='flex justify-end gap-3 pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f] mt-2'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2.5 text-sm font-semibold text-[#101828] dark:text-white bg-white dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-xl hover:bg-[#eae8e4] dark:hover:bg-[#333] transition-all active:scale-[0.98]'
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
                            className='px-4 py-2.5 text-sm font-semibold text-white bg-[#0075de] hover:bg-[#0062bd] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[100px]'
                        >
                            {loading ? (
                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                            ) : (
                                'Add PYQ'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PyqFormModal;
