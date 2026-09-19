'use client';
import React, { useEffect, useState, useId } from 'react';
import { api } from '@/config/apiUrls';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Flag,
    Share2,
    X,
    Check,
    AlertCircle,
    Loader2,
    Link2,
} from 'lucide-react';

interface DetailPageNavbarProps {
    path?: string;
    fullPath?: string;
}

const ISSUE_TYPES = [
    'Broken link / Download error',
    'Incorrect or outdated content',
    'Poor quality / Unreadable',
    'Copyright or privacy concern',
    'Other issue',
];

const formatPathName = (rawPath?: string) => {
    if (!rawPath) return '';
    const clean = rawPath.replace(/^[/-]+|[/-]+$/g, '');
    const map: Record<string, string> = {
        pyqs: 'PYQs',
        notes: 'Notes',
        'lost-found': 'Lost & Found',
        quicknotes: 'Quick Notes',
        videos: 'Videos',
        seniors: 'Seniors',
        opportunities: 'Opportunities',
        store: 'Store',
        syllabus: 'Syllabus',
        collections: 'Collections',
        leaderboard: 'Leaderboard',
        resources: 'Resources',
    };
    if (map[clean.toLowerCase()]) {
        return map[clean.toLowerCase()];
    }
    return clean
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const DetailPageNavbar: React.FC<DetailPageNavbarProps> = ({
    path,
    fullPath,
}) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [currentUrl, setCurrentUrl] = useState<string>('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: 'complain@studentsenior.com',
        subject: '',
        description: '',
    });
    const [canGoBack, setCanGoBack] = useState(false);

    // Initialize subject, URL, and history detection on client mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            setCurrentUrl(url);
            setFormData((prev) => ({
                ...prev,
                subject: 'Reported URL: ' + url,
            }));
            const hasHistory =
                (window.history.state &&
                    typeof window.history.state.idx === 'number' &&
                    window.history.state.idx > 0) ||
                window.history.length > 1;
            setCanGoBack(Boolean(hasHistory));
        }
    }, []);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showReportModal && !isSubmitting) {
                setShowReportModal(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showReportModal, isSubmitting]);

    const handleBackNavigation = () => {
        if (canGoBack || (typeof window !== 'undefined' && window.history.length > 1)) {
            router.back();
        } else if (fullPath) {
            router.push(fullPath);
        } else if (path) {
            router.push(`/${path}`);
        } else {
            router.push('/');
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Clipboard copy error:', error);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
                toast.success('Link copied to clipboard!');
                setTimeout(() => setIsCopied(false), 2000);
            } catch (fallbackError) {
                console.error(fallbackError);
                toast.error('Failed to copy link');
            }
            document.body.removeChild(textArea);
        }
    };

    const handleShare = async () => {
        if (typeof window === 'undefined') return;

        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: `Check out this resource on StudentSenior`,
                    url: url,
                });
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    await copyToClipboard(url);
                }
            }
        } else {
            await copyToClipboard(url);
        }
    };

    const handleCategoryClick = (cat: string) => {
        if (selectedCategory === cat) {
            setSelectedCategory('');
            setFormData((prev) => ({
                ...prev,
                description: prev.description.replace(`[${cat}] `, ''),
            }));
            return;
        }

        setSelectedCategory(cat);
        setFormData((prev) => {
            let updated = prev.description;
            if (selectedCategory && updated.startsWith(`[${selectedCategory}] `)) {
                updated = updated.replace(`[${selectedCategory}] `, '');
            }
            return {
                ...prev,
                description: `[${cat}] ${updated}`.trimStart(),
            };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.description.trim()) {
            toast.error('Please describe the issue before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(api.contactus.createContactus, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Thank you! Your report has been submitted.');
                setFormData((prev) => ({ ...prev, description: '' }));
                setSelectedCategory('');
                setShowReportModal(false);
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            console.error('Report submission error:', error);
            toast.error('An error occurred while submitting the report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        if (!isSubmitting) {
            setShowReportModal(false);
        }
    };

    const formattedPath = formatPathName(path);

    return (
        <>
            {/* Sub-Header Navigation Bar */}
            <div className='sticky top-[60px] sm:top-[64px] left-0 z-30 w-full bg-white/90 dark:bg-[#191919]/90 backdrop-blur-md border-b border-[#e6e6e6] dark:border-[#2f2f2f] transition-all duration-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4'>
                    {/* Back Button */}
                    <button
                        onClick={handleBackNavigation}
                        className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#101828] dark:hover:text-white bg-white dark:bg-[#202020] hover:bg-[#f6f5f4] dark:hover:bg-[#282828] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-150 group'
                        title={
                            formattedPath
                                ? `Back to ${formattedPath}`
                                : 'Go Back'
                        }
                    >
                        <ArrowLeft className='w-4 h-4 text-[#8c8883] dark:text-[#787672] group-hover:text-[#101828] dark:group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-150' />
                        <span className='font-semibold text-[#101828] dark:text-[#ededed]'>
                            Back
                        </span>
                        {formattedPath && (
                            <span className='hidden sm:inline text-[#8c8883] dark:text-[#787672] font-normal border-l border-[#e6e6e6] dark:border-[#2f2f2f] pl-2 ml-0.5'>
                                {formattedPath}
                            </span>
                        )}
                    </button>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-2'>
                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            title={
                                isCopied ? 'Link Copied!' : 'Share this page'
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-150 group ${
                                isCopied
                                    ? 'bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] border-[#d2f0d9] dark:border-[#205130]'
                                    : 'bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#a39e98] hover:text-[#0075de] dark:hover:text-[#62aef0] hover:bg-[#eaf3fd] dark:hover:bg-[#183153]/70 border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#d2e4f9] dark:hover:border-[#224474]/60'
                            }`}
                        >
                            {isCopied ? (
                                <Check className='w-3.5 h-3.5 text-[#1aae39] dark:text-[#4ade80] animate-in zoom-in-50 duration-150' />
                            ) : (
                                <Share2 className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] group-hover:scale-110 transition-all duration-150' />
                            )}
                            <span className='hidden sm:inline font-medium'>
                                {isCopied ? 'Copied' : 'Share'}
                            </span>
                        </button>

                        {/* Report Issue Button */}
                        <button
                            onClick={() => setShowReportModal(true)}
                            title='Report an issue with this content'
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#e11d48] dark:hover:text-[#fb7185] bg-white dark:bg-[#202020] hover:bg-[#fff1f2] dark:hover:bg-[#3b1118] border border-[#e6e6e6] dark:border-[#2f2f2f] hover:border-[#fecdd3] dark:hover:border-[#5c2328] shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-150 group'
                        >
                            <Flag className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672] group-hover:text-[#e11d48] dark:group-hover:text-[#fb7185] group-hover:scale-110 transition-all duration-150' />
                            <span className='hidden sm:inline font-medium'>
                                Report
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Notion-styled Report Modal */}
            {showReportModal && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
                    onClick={handleModalClose}
                >
                    <div
                        className='bg-white dark:bg-[#1f1f1f] text-[#101828] dark:text-[#ededed] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className='flex items-start justify-between p-5 sm:p-6 border-b border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                            <div className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-xl bg-[#fff1f2] dark:bg-[#3b1118] border border-[#fecdd3] dark:border-[#5c2328] flex items-center justify-center text-[#e11d48] dark:text-[#fb7185] shrink-0'>
                                    <AlertCircle className='w-5 h-5' />
                                </div>
                                <div>
                                    <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white leading-tight'>
                                        Report an Issue
                                    </h2>
                                    <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-0.5'>
                                        Help us keep StudentSenior accurate and
                                        reliable
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                                aria-label='Close modal'
                                className='p-1.5 rounded-lg text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white hover:bg-[#ededeb] dark:hover:bg-[#333333] transition-colors disabled:opacity-50'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
                            {/* Quick Category Chips */}
                            <div>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-2'>
                                    Issue Type
                                </label>
                                <div className='flex flex-wrap gap-1.5'>
                                    {ISSUE_TYPES.map((type) => {
                                        const isSelected =
                                            selectedCategory === type;
                                        return (
                                            <button
                                                key={type}
                                                type='button'
                                                onClick={() =>
                                                    handleCategoryClick(type)
                                                }
                                                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                                                    isSelected
                                                        ? 'bg-[#fff1f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] border-[#fecdd3] dark:border-[#5c2328] font-semibold shadow-xs'
                                                        : 'bg-[#faf9f8] dark:bg-[#262626] text-[#615d59] dark:text-[#a39e98] border-[#e6e6e6] dark:border-[#2f2f2f] hover:text-[#101828] dark:hover:text-white hover:bg-[#f0eee6] dark:hover:bg-[#303030]'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description Textarea */}
                            <div>
                                <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-2'>
                                    Details
                                </label>
                                <textarea
                                    className='w-full p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all duration-150 resize-none'
                                    rows={4}
                                    placeholder='Describe what is wrong or what needs to be fixed...'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Reported URL Display */}
                            <div className='flex items-center gap-2 p-2.5 bg-[#faf9f8] dark:bg-[#252525] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl text-xs text-[#615d59] dark:text-[#a39e98]'>
                                <Link2 className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672] shrink-0' />
                                <span className='font-medium shrink-0 text-[#101828] dark:text-[#ededed]'>
                                    Reporting URL:
                                </span>
                                <span className='truncate font-mono text-[11px] text-[#8c8883] dark:text-[#a09e9a]'>
                                    {currentUrl || 'Current Page'}
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex items-center justify-end gap-2.5 p-4 sm:p-5 border-t border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                            <button
                                type='button'
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                                className='px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#101828] dark:hover:text-white bg-white dark:bg-[#202020] hover:bg-[#f0eee6] dark:hover:bg-[#2b2b2b] border border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting || !formData.description.trim()
                                }
                                className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#e11d48] hover:bg-[#be123c] dark:bg-[#e11d48] dark:hover:bg-[#be123c] disabled:opacity-40 disabled:hover:bg-[#e11d48] shadow-xs active:scale-[0.98] transition-all duration-150 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailPageNavbar;
