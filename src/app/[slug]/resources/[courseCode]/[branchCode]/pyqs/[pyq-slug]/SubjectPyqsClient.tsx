'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IPyq } from '@/utils/interface';
import { BookOpen, Eye, FileText, Plus, Video, Award } from 'lucide-react';
import Image from 'next/image';
import PyqFormModal, { PyqFormData } from './pyqForm';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';

interface SubjectPyqsClientProps {
    initialPyqs: IPyq[];
    subjectCode: string;
    collegeSlug: string;
    courseCode: string;
    branchCode: string;
    subjectName: string;
}

export default function SubjectPyqsClient({
    initialPyqs,
    subjectCode,
    collegeSlug,
    courseCode,
    branchCode,
    subjectName,
}: SubjectPyqsClientProps) {
    const [activeExamType, setActiveExamType] = useState<string>('all');
    const [addPyq, setAddPyq] = useState(false);

    const initialFormState: PyqFormData = {
        subject: '',
        year: '',
        examType: '',
        fileUrl: '',
        solved: false,
        isPaid: false,
        price: 0,
    };
    const [form, setForm] = useState<PyqFormData>(initialFormState);

    const uniqueExamTypes = useMemo(() => {
        const setTypes = new Set(
            initialPyqs
                .map((p) => (p.examType || '').toLowerCase())
                .filter(Boolean),
        );
        return Array.from(setTypes).sort();
    }, [initialPyqs]);

    const handleAddPyq = () => {
        setAddPyq(!addPyq);
    };
    
    const handleSubmit = async (formData: PyqFormData) => {
        try {
            const response = await fetch(api.pyq.createPyq, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    college: collegeSlug,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create PYQ');
            }
            toast.success(data.message || 'PYQ created successfully!');
            setAddPyq(false);
            setForm(initialFormState);
        } catch (error) {
            console.error('Error creating PYQ:', error);
            throw error;
        }
    };

    const examTypesWithAll = useMemo(
        () => ['all', ...uniqueExamTypes],
        [uniqueExamTypes],
    );

    const examTypeCounts = useMemo(() => {
        const counts: Record<string, number> = { all: initialPyqs.length };
        uniqueExamTypes.forEach((t) => {
            counts[t] = initialPyqs.filter(
                (p) => (p.examType || '').toLowerCase() === t,
            ).length;
        });
        return counts;
    }, [initialPyqs, uniqueExamTypes]);

    const filtered = useMemo(() => {
        return initialPyqs.filter((p) => {
            const matchesExam =
                activeExamType === 'all'
                    ? true
                    : (p.examType || '').toLowerCase() === activeExamType;
            return matchesExam;
        });
    }, [initialPyqs, activeExamType]);

    return (
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6'>
            {/* Header Section */}
            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-[#101828] dark:text-white'>
                            {subjectName} - PYQs
                        </h1>
                        <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mt-1'>
                            Browse and access previous year question papers
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className='flex flex-col sm:flex-row gap-2.5'>
                        <Link
                            prefetch={false}
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
                            className='px-4 py-2 bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <BookOpen className='w-4 h-4' />
                            Notes
                        </Link>
                        <Link
                            prefetch={false}
                            href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/videos/${subjectCode}`}
                            className='px-4 py-2 bg-[#f6f5f4] dark:bg-[#282828] text-[#555] dark:text-[#bbb] hover:bg-[#eae8e4] dark:hover:bg-[#333] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <Video className='w-4 h-4' />
                            Videos
                        </Link>
                        <button
                            onClick={handleAddPyq}
                            className='px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white rounded-lg text-sm font-semibold transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            <Plus className='w-4 h-4' />
                            Add PYQ
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 shadow-sm'>
                <div className='flex flex-wrap gap-2.5'>
                    {examTypesWithAll.map((type) => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                                activeExamType === type
                                    ? 'bg-[#101828] dark:bg-[#ededed] text-white dark:text-[#101828]'
                                    : 'bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a09e9a] hover:bg-[#eae8e4] dark:hover:bg-[#333]'
                            }`}
                            onClick={() => setActiveExamType(type)}
                            aria-pressed={activeExamType === type}
                        >
                            {type === 'all' ? 'All Papers' : type.toUpperCase()}
                            <span
                                className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                                    activeExamType === type
                                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                                        : 'bg-[#e6e6e6] dark:bg-[#383838] text-[#475467] dark:text-[#a09e9a]'
                                }`}
                            >
                                {examTypeCounts[type] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Info */}
            <div className='text-xs sm:text-sm text-[#615d59] dark:text-[#9ea3ae] font-medium px-2'>
                Showing {filtered.length} paper{filtered.length === 1 ? '' : 's'}
                {activeExamType !== 'all' && ` for ${activeExamType.toUpperCase()}`}
            </div>

            {/* PYQ Grid or Empty State */}
            {filtered.length === 0 ? (
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-12 text-center shadow-sm max-w-2xl mx-auto w-full'>
                    <FileText className='w-14 h-14 text-[#8c8883] dark:text-[#787672] mx-auto mb-4' />
                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-2'>
                        {activeExamType === 'all'
                            ? 'No PYQs available yet'
                            : `No ${activeExamType.toUpperCase()} PYQs available`}
                    </h3>
                    <p className='text-sm text-[#475467] dark:text-[#9ea3ae] mb-6 max-w-md mx-auto'>
                        {activeExamType === 'all'
                            ? 'Be the first to contribute by adding a previous year question paper.'
                            : `Be the first to contribute by adding a ${activeExamType.toUpperCase()} question paper.`}
                    </p>
                    <button
                        onClick={handleAddPyq}
                        className='bg-[#0075de] hover:bg-[#0062bd] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-all shadow-xs active:scale-[0.98]'
                    >
                        <Plus className='w-4 h-4' />
                        Add First PYQ
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filtered.map((pyq) => (
                        <Link
                            key={pyq._id}
                            prefetch={false}
                            href={`/${collegeSlug}/pyqs/${pyq.slug}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200 overflow-hidden cursor-pointer'
                        >
                            <div className='p-4 flex flex-col h-full'>
                                {/* Top Row: Year and Badges */}
                                <div className='flex items-start justify-between mb-4'>
                                    <div>
                                        <h3 className='text-xl font-bold text-[#101828] dark:text-white leading-none tracking-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                            {pyq.year}
                                        </h3>
                                        <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mt-2'>
                                            {pyq.examType}
                                        </p>
                                    </div>
                                    <div className='flex flex-col gap-1.5 items-end'>
                                        {pyq.solved && (
                                            <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e6f4ea] dark:bg-[#1e3a29] text-[#137333] dark:text-[#34a853] border border-[#ceead6] dark:border-[#1e3a29] leading-none'>
                                                <Award className='w-3 h-3 mr-1' />
                                                SOLVED
                                            </span>
                                        )}
                                        {pyq.isPaid && (
                                            <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fef7e0] dark:bg-[#3d3119] text-[#b06000] dark:text-[#fbbc04] border border-[#fce8b2] dark:border-[#3d3119] leading-none'>
                                                <Award className='w-3 h-3 mr-1' />
                                                PREMIUM
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Author Info (Small) */}
                                <div className='mt-auto pt-3 flex items-center justify-between border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                    <div className='flex items-center gap-2'>
                                        {pyq.owner?.profilePicture ? (
                                            <Image
                                                src={pyq.owner.profilePicture}
                                                alt='Author'
                                                className='w-6 h-6 rounded-full object-cover border border-[#e6e6e6] dark:border-[#2f2f2f]'
                                                loading='lazy'
                                                width={24}
                                                height={24}
                                            />
                                        ) : (
                                            <div className='w-6 h-6 rounded-full bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] flex items-center justify-center text-[#475467] dark:text-[#a09e9a] font-bold text-[10px]'>
                                                {pyq.owner?.username?.charAt(0) || 'A'}
                                            </div>
                                        )}
                                        <p className='text-xs font-medium text-[#615d59] dark:text-[#a09e9a] truncate max-w-[120px]'>
                                            {pyq.owner?.username || 'Anonymous'}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-1 text-[11px] font-medium text-[#8c8883] dark:text-[#787672]'>
                                        <Eye className='w-3.5 h-3.5' />
                                        <span>{pyq.clickCounts} views</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            
            

            <PyqFormModal
                isOpen={addPyq}
                onClose={handleAddPyq}
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                branchCode={branchCode}
                subjectCode={subjectCode}
                collegeSlug={collegeSlug}
            />
        </div>
    );
}
