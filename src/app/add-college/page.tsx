'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    MapPin,
    AlignLeft,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Check,
    GraduationCap,
    Users,
    BookOpen,
} from 'lucide-react';
import { CollegeData } from '@/utils/interface';
import { api } from '@/config/apiUrls';

export default function AddCollegePage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [collegeData, setCollegeData] = useState<CollegeData>({
        name: '',
        location: '',
        description: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setCollegeData({ ...collegeData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setIsError(false);

        try {
            const response = await fetch(`${api.college.addCollege}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(collegeData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(
                    data.message || 'College added successfully! It will be reviewed and published soon.',
                );
                setIsSuccess(true);
                setCollegeData({ name: '', location: '', description: '' });
            } else {
                setResponseMessage(
                    data.message || 'Failed to add college. Please check details and try again.',
                );
                setIsError(true);
            }
        } catch (error) {
            setResponseMessage(
                error instanceof Error
                    ? error.message
                    : 'Network error. Please try again later.',
            );
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsSuccess(false);
        setIsError(false);
        if (isSuccess) {
            window.location.href = '/';
        }
    };

    return (
        <div className='min-h-screen bg-[#f6f5f4] dark:bg-[#191919] text-[#000000] dark:text-[#ededed] transition-colors duration-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8'>
            {/* Modal / Dialog for Success or Error */}
            {(isSuccess || isError) && (
                <div
                    className='fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4'
                    role='dialog'
                    aria-modal='true'
                >
                    <div className='bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_16px_48px_rgba(0,0,0,0.16)] w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-150'>
                        <div
                            className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                                isSuccess
                                    ? 'bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39] dark:text-[#4ade80]'
                                    : 'bg-[#fdf1e8] dark:bg-[#381e0f] text-[#dd5b00] dark:text-[#fb923c]'
                            }`}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className='w-6 h-6' strokeWidth={2.2} />
                            ) : (
                                <AlertCircle className='w-6 h-6' strokeWidth={2.2} />
                            )}
                        </div>

                        <h3 className='text-lg font-bold text-[#000000] dark:text-white tracking-[-0.2px] mb-2'>
                            {isSuccess ? 'College Submitted' : 'Notice'}
                        </h3>

                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98] leading-relaxed mb-6'>
                            {responseMessage}
                        </p>

                        <button
                            type='button'
                            onClick={handleCloseDialog}
                            className='w-full py-2.5 px-5 rounded-full bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.25)]'
                        >
                            {isSuccess ? 'Return to Home' : 'Got it'}
                        </button>
                    </div>
                </div>
            )}

            <div className='max-w-4xl mx-auto'>
                {/* Top Navigation */}
                <div className='mb-6'>
                    <Link
                        href='/'
                        className='inline-flex items-center gap-1.5 text-xs font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#0075de] dark:hover:text-[#62aef0] transition-colors py-1'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                    {/* Left Column: Context & Benefits */}
                    <div className='lg:col-span-5 space-y-4'>
                        <div className='bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
                            <div className='w-10 h-10 rounded-xl bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center mb-4'>
                                <Building2 className='w-5 h-5' strokeWidth={2.2} />
                            </div>

                            <h1 className='text-xl sm:text-2xl font-bold text-[#000000] dark:text-white tracking-[-0.025em] mb-2'>
                                Add New College
                            </h1>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a39e98] leading-relaxed mb-5'>
                                Can’t find your college in our directory? Submit the details below to bring Student Senior mentorship, PYQs, and study materials to your campus.
                            </p>

                            <div className='space-y-3.5 pt-4 border-t border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-6 h-6 rounded-md bg-[#eaf7ec] dark:bg-[#112d1b] text-[#1aae39] flex items-center justify-center flex-shrink-0 mt-0.5'>
                                        <Check className='w-3.5 h-3.5' strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#000000] dark:text-white'>
                                            Community Unlocked
                                        </p>
                                        <p className='text-[11px] text-[#615d59] dark:text-[#a39e98]'>
                                            Enable batchmates and seniors to share university-specific materials.
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <div className='w-6 h-6 rounded-md bg-[#eaf3fd] dark:bg-[#10243e] text-[#0075de] flex items-center justify-center flex-shrink-0 mt-0.5'>
                                        <BookOpen className='w-3.5 h-3.5' strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#000000] dark:text-white'>
                                            Past Year Papers
                                        </p>
                                        <p className='text-[11px] text-[#615d59] dark:text-[#a39e98]'>
                                            Upload and access semester exam archives with solution guides.
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <div className='w-6 h-6 rounded-md bg-[#f5edfd] dark:bg-[#2b1744] text-[#8a3fd6] flex items-center justify-center flex-shrink-0 mt-0.5'>
                                        <GraduationCap className='w-3.5 h-3.5' strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#000000] dark:text-white'>
                                            Senior Mentors
                                        </p>
                                        <p className='text-[11px] text-[#615d59] dark:text-[#a39e98]'>
                                            Connect juniors with verified graduates and experienced peers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Submission Form */}
                    <div className='lg:col-span-7'>
                        <div className='bg-white dark:bg-[#202020] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.03)]'>
                            <div className='mb-5'>
                                <h2 className='text-lg font-bold text-[#000000] dark:text-white tracking-[-0.2px]'>
                                    College Information
                                </h2>
                                <p className='text-xs text-[#615d59] dark:text-[#a39e98]'>
                                    Please provide accurate university or campus details.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* College Name */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='name'
                                        className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'
                                    >
                                        <Building2 className='w-3.5 h-3.5 text-[#0075de]' />
                                        <span>College Name</span>
                                        <span className='text-[#dd5b00]'>*</span>
                                    </label>
                                    <input
                                        name='name'
                                        type='text'
                                        id='name'
                                        placeholder='e.g., Integral University'
                                        maxLength={100}
                                        value={collegeData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-3.5 py-2.5 bg-white dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm text-[#000000] dark:text-white placeholder-[#a39e98] outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                        required
                                        disabled={loading}
                                    />
                                    <p className='text-[11px] text-[#a39e98] text-right'>
                                        {collegeData.name.length}/100
                                    </p>
                                </div>

                                {/* Location */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='location'
                                        className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'
                                    >
                                        <MapPin className='w-3.5 h-3.5 text-[#dd5b00]' />
                                        <span>Location / City</span>
                                        <span className='text-[#dd5b00]'>*</span>
                                    </label>
                                    <input
                                        name='location'
                                        type='text'
                                        id='location'
                                        placeholder='e.g., Lucknow, Uttar Pradesh'
                                        maxLength={100}
                                        value={collegeData.location}
                                        onChange={handleInputChange}
                                        className='w-full px-3.5 py-2.5 bg-white dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm text-[#000000] dark:text-white placeholder-[#a39e98] outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                        required
                                        disabled={loading}
                                    />
                                    <p className='text-[11px] text-[#a39e98] text-right'>
                                        {collegeData.location.length}/100
                                    </p>
                                </div>

                                {/* Description */}
                                <div className='space-y-1.5'>
                                    <label
                                        htmlFor='description'
                                        className='flex items-center gap-1.5 text-xs font-semibold text-[#31302e] dark:text-[#d3d1cb]'
                                    >
                                        <AlignLeft className='w-3.5 h-3.5 text-[#1aae39]' />
                                        <span>Description</span>
                                        <span className='text-[#dd5b00]'>*</span>
                                    </label>
                                    <textarea
                                        name='description'
                                        id='description'
                                        placeholder='Briefly describe the university, popular courses, and branches...'
                                        maxLength={500}
                                        value={collegeData.description}
                                        onChange={handleInputChange}
                                        className='w-full px-3.5 py-2.5 bg-white dark:bg-[#262626] border border-[#e6e6e6] dark:border-[#383838] rounded-lg text-sm text-[#000000] dark:text-white placeholder-[#a39e98] outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/15 transition-all resize-y min-h-[110px]'
                                        rows={4}
                                        required
                                        disabled={loading}
                                    />
                                    <p className='text-[11px] text-[#a39e98] text-right'>
                                        {collegeData.description.length}/500
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className='pt-2'>
                                    <button
                                        type='submit'
                                        disabled={loading || !collegeData.name || !collegeData.location || !collegeData.description}
                                        className='w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#0075de] hover:bg-[#005bab] active:scale-[0.98] text-white font-medium text-sm rounded-full transition-all shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,117,222,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                <span>Submitting College...</span>
                                            </>
                                        ) : (
                                            <span>Submit College</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

