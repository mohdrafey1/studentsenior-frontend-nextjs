'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IPyq } from '@/utils/interface';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    FileText,
    Calendar,
    BookOpen,
    Lock,
    Eye,
    Loader2,
    ShoppingCart,
    Download,
    Sparkles,
    Video,
    NotebookPen,
    FileStack,
    Bot,
} from 'lucide-react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import { api } from '@/config/apiUrls';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';
import { useSaveResource } from '@/hooks/useSaveResource';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PaymentModal from '@/components/PaymentModal';
import GoogleAd from '@/components/GoogleAd';
import DownloadTimerModal from '@/components/Common/DownloadTimerModal';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

interface PDFPageProxy {
    getViewport: (options: { scale: number }) => {
        width: number;
        height: number;
    };
    render: (options: {
        canvasContext: CanvasRenderingContext2D;
        viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
}

interface PDFDocumentProxy {
    getPage: (pageNum: number) => Promise<PDFPageProxy>;
    numPages: number;
}

interface PyqDetailClientProps {
    pyq: IPyq;
}

// Lazy load a PDF page and render as image
const LazyPDFPage = ({
    pdf,
    pageNum,
    scale = 1.5,
}: {
    pdf: PDFDocumentProxy;
    pageNum: number;
    scale?: number;
}) => {
    const [pageSrc, setPageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pdf || pageSrc) return;

        const observer = new IntersectionObserver(
            async (entries, observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        try {
                            const page = await pdf.getPage(pageNum);
                            const viewport = page.getViewport({ scale });
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            if (!context) return;

                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            await page.render({
                                canvasContext: context,
                                viewport,
                            }).promise;
                            setPageSrc(canvas.toDataURL());
                            setIsLoading(false);
                            observer.unobserve(entry.target);
                        } catch (err) {
                            console.error(
                                `Error rendering page ${pageNum}:`,
                                err,
                            );
                            setIsLoading(false);
                        }
                    }
                }
            },
            { threshold: 0.1 },
        );

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [pdf, pageNum, scale, pageSrc]);

    return (
        <div ref={imgRef} className='relative w-full mb-8 group'>
            <div className='bg-sky-50 dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
                {/* Page Number Badge */}
                <div className='absolute bottom-1 right-1 z-10 bg-sky-500 opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg'>
                    Page {pageNum}
                </div>

                <div className='flex justify-center items-center min-h-[400px]'>
                    {isLoading && !pageSrc ? (
                        <div className='flex flex-col items-center space-y-3'>
                            <div className='w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin'></div>
                            <p className='text-gray-500 dark:text-gray-400 text-sm'>
                                Loading page {pageNum}...
                            </p>
                        </div>
                    ) : pageSrc ? (
                        <Image
                            src={pageSrc}
                            alt={`Page ${pageNum}`}
                            width={800}
                            height={1200}
                            className='w-full h-auto rounded-lg shadow-sm'
                            priority={pageNum <= 2}
                            unoptimized
                        />
                    ) : (
                        <div className='text-center'>
                            <FileText className='w-16 h-16 text-gray-400 mx-auto mb-3' />
                            <p className='text-gray-500 dark:text-gray-400'>
                                Failed to load page {pageNum}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PyqDetailClient: React.FC<PyqDetailClientProps> = ({ pyq }) => {
    const { slug } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    // Suggested PYQs state
    const [suggestedPyqs, setSuggestedPyqs] = useState<{
        sameSubjectExamType: IPyq[];
        sameSubject: IPyq[];
        sameSemester: IPyq[];
    }>({
        sameSubjectExamType: [],
        sameSubject: [],
        sameSemester: [],
    });
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [requestingSolution, setRequestingSolution] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );
    const ownerId = currentUser?._id;

    const { saveResource, unsaveResource } = useSaveResource();
    const { savedPYQs } = useSelector(
        (state: RootState) => state.savedCollection,
    );
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (!pyq?.fileUrl) return;

            setIsLoading(true);
            try {
                const response = await fetch(
                    `${api.aws.getSignedUrl}?fileUrl=${pyq.fileUrl}`,
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to get signed URL.',
                    );
                }

                setSignedUrl(data.data.signedUrl);
                const loadingTask = pdfjsLib.getDocument(data.data.signedUrl);
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
            } catch (err) {
                console.error('Error getting signed URL for view:', err);
                setError('Failed to load PDF document.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSignedUrlForView();
    }, [pyq?.fileUrl]);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    useEffect(() => {
        const isSavedEntry = !!savedPYQs?.some((entry) =>
            typeof entry.pyqId === 'string'
                ? entry.pyqId === pyq._id
                : entry.pyqId && typeof entry.pyqId === 'object'
                  ? entry.pyqId._id === pyq._id
                  : false,
        );
        setIsSaved(isSavedEntry);
    }, [savedPYQs, pyq._id]);

    useEffect(() => {
        if (typeof window !== 'undefined' && pyq?._id) {
            const requested = localStorage.getItem(`requested_pyq_${pyq._id}`);
            if (requested === 'true') {
                setHasRequested(true);
            }
        }
    }, [pyq?._id]);

    // Fetch suggested PYQs
    useEffect(() => {
        const fetchSuggestedPyqs = async () => {
            if (!pyq || !pyq.slug) return;

            setLoadingSuggestions(true);
            try {
                const response = await fetch(
                    api.pyq.getSuggestedPyqs(pyq.slug),
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to fetch suggested PYQs',
                    );
                }

                setSuggestedPyqs({
                    sameSubjectExamType: data.data?.sameSubjectExamType || [],
                    sameSubject: data.data?.sameSubject || [],
                    sameSemester: data.data?.sameSemester || [],
                });
            } catch (error) {
                console.error('Error fetching suggested PYQs:', error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        fetchSuggestedPyqs();
    }, [pyq]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveResource('pyq', pyq._id);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnsave = async () => {
        setIsSaving(true);
        try {
            await unsaveResource('pyq', pyq._id);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRequestSolution = async () => {
        setRequestingSolution(true);
        try {
            const response = await fetch(api.pyqSolutions.requestSolution, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pyqId: pyq._id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(`requested_pyq_${pyq._id}`, 'true');
                }
                setHasRequested(true);
                toast.success(
                    'Request sent successfully! Solution will be available shortly',
                );
            } else {
                toast.error(data.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Request solution error:', error);
            toast.error('Something went wrong');
        } finally {
            setRequestingSolution(false);
        }
    };

    // Security handlers (disable right-click, keyboard shortcuts, devtools)
    useEffect(() => {
        const preventContextMenu = (e: MouseEvent) => e.preventDefault();
        const preventShortcuts = (e: KeyboardEvent) => {
            if (
                e.ctrlKey &&
                (e.key === 'p' || e.key === 's' || e.key === 'u')
            ) {
                e.preventDefault();
            }
        };
        const blockDevTools = (e: KeyboardEvent) => {
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.metaKey && e.altKey && ['I', 'J'].includes(e.key))
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', preventContextMenu);
        document.addEventListener('keydown', preventShortcuts);
        document.addEventListener('keydown', blockDevTools);

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('keydown', preventShortcuts);
            document.removeEventListener('keydown', blockDevTools);
        };
    }, []);

    if (error) {
        return (
            <div className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515] flex justify-center items-center p-4'>
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 text-center max-w-md w-full'>
                    <div className='w-20 h-20 bg-[#fef3f2] dark:bg-[#381a1a] rounded-full flex items-center justify-center mx-auto mb-6'>
                        <FileText className='w-10 h-10 text-[#d92d20]' />
                    </div>
                    <h2 className='text-xl font-bold text-[#101828] dark:text-white mb-3'>
                        Failed to Load Document
                    </h2>
                    <p className='text-[#475467] dark:text-[#a09e9a] mb-6 text-sm'>
                        {error}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className='inline-flex items-center gap-2 px-6 py-2.5 bg-[#0075de] text-white font-semibold rounded-xl hover:bg-[#0062bd] transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading && !pdfDoc) {
        return (
            <div className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515] flex justify-center items-center p-4'>
                <div className='text-center'>
                    <div className='w-14 h-14 border-3 border-[#0075de] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <h2 className='text-xl font-bold text-[#101828] dark:text-white mb-2'>
                        Loading PYQ
                    </h2>
                    <p className='text-[#475467] dark:text-[#a09e9a] text-sm'>
                        Please wait while we prepare your previous year question
                        paper...
                    </p>
                </div>
            </div>
        );
    }

    const isOwner = pyq.owner?._id === ownerId;
    const isPaidAndNotOwner =
        pyq.isPaid && !isOwner && !pyq.purchasedBy?.includes(ownerId || '');
    const downloadFileName = `${pyq.subject.subjectCode}-${pyq.examType}-${pyq.year}-studentsenior.pdf`;

    const handleSecureDownload = async () => {
        if (!pyq?.fileUrl) return;
        try {
            const response = await fetch(
                `${api.aws.getSignedUrl}?fileUrl=${pyq.fileUrl}`,
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get download link.');
            }

            const link = document.createElement('a');
            link.href = data.data.signedUrl;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading file:', err);
            toast.error('Failed to download file. Please try again.');
        }
    };

    return (
        <div className='min-h-screen bg-[#fcfcfc] dark:bg-[#151515]'>
            <DetailPageNavbar path='pyqs' fullPath={`/${slug}/pyqs`} />
            {/* Document Info Section (Compact Design) */}
            <div className='max-w-7xl mx-auto px-4 py-4 sm:py-5 sm:px-6 lg:px-8'>
                <div className='bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 sm:p-5 mb-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                        {/* Title & Metadata Badges */}
                        <div className='flex-1 min-w-0'>
                            <h1 className='text-lg sm:text-xl font-bold text-[#101828] dark:text-white tracking-tight mb-2 sm:mb-2.5'>
                                {pyq.subject.subjectName}
                            </h1>
                            <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs'>
                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eaf3fd] dark:bg-[#183153]/70 text-[#0075de] dark:text-[#62aef0] font-semibold border border-[#d2e4f9]/60 dark:border-[#224474]/60'>
                                    <BookOpen className='w-3.5 h-3.5' />
                                    <span>Sem {pyq.subject.semester}</span>
                                </span>
                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a39e98] font-medium border border-[#e6e6e6] dark:border-[#383838]'>
                                    <FileText className='w-3.5 h-3.5 text-[#1aae39]' />
                                    <span>{pyq.examType}</span>
                                </span>
                                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f6f5f4] dark:bg-[#282828] text-[#475467] dark:text-[#a39e98] font-medium border border-[#e6e6e6] dark:border-[#383838]'>
                                    <Calendar className='w-3.5 h-3.5 text-[#8a3fd6]' />
                                    <span>{pyq.year}</span>
                                </span>
                                <span className='inline-flex items-center gap-1 px-2 py-0.5 text-[#8c8883] dark:text-[#787672] font-medium'>
                                    <Eye className='w-3.5 h-3.5 text-[#e58b00]' />
                                    <span>{pyq.clickCounts} views</span>
                                </span>
                            </div>
                        </div>

                        {/* Save Button with Loading State */}
                        <div className='flex items-center sm:self-center shrink-0'>
                            <button
                                onClick={() => {
                                    if (isSaving) return;
                                    if (isSaved) {
                                        handleUnsave();
                                    } else {
                                        handleSave();
                                    }
                                }}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                                    isSaved
                                        ? 'bg-[#e6f4ea] dark:bg-[#1e3a29] border-[#ceead6] dark:border-[#2b5238] text-[#137333] dark:text-[#34a853]'
                                        : 'bg-[#f6f5f4] dark:bg-[#282828] border-[#e6e6e6] dark:border-[#383838] text-[#101828] dark:text-[#ededed] hover:bg-[#eae8e4] dark:hover:bg-[#333]'
                                }`}
                                title={
                                    isSaved
                                        ? 'Unsave this PYQ'
                                        : 'Save this PYQ'
                                }
                                aria-label={
                                    isSaved
                                        ? 'Unsave this PYQ'
                                        : 'Save this PYQ'
                                }
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className='w-3.5 h-3.5 animate-spin text-[#0075de]' />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className='w-3.5 h-3.5'
                                            fill={
                                                isSaved
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                                            ></path>
                                        </svg>
                                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Google Ad */}
                <div className='my-6 w-full max-w-4xl mx-auto'>
                    <GoogleAd
                        adSlot='9984010614'
                        adFormat='auto'
                        className='w-full'
                    />
                </div>

                {/* PDF Viewer Section */}
                <div className='pdf-viewer max-w-4xl mx-auto'>
                    {pdfDoc ? (
                        isPaidAndNotOwner ? (
                            <>
                                {/* Preview Pages */}
                                {Array.from({
                                    length: Math.min(2, pdfDoc.numPages),
                                }).map((_, index) => (
                                    <LazyPDFPage
                                        key={index}
                                        pdf={pdfDoc}
                                        pageNum={index + 1}
                                        scale={1.5}
                                    />
                                ))}

                                {/* Purchase CTA */}
                                <div className='bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-sky-200 dark:border-sky-700 p-8 text-center'>
                                    <div className='w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                                        <Lock className='w-10 h-10 text-sky-600 dark:text-sky-400' />
                                    </div>
                                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                        Unlock Complete PYQ
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
                                        You&apos;ve seen a preview of this
                                        question paper. Purchase to access all{' '}
                                        {pdfDoc.numPages} pages and get the
                                        complete PYQ with solutions.
                                    </p>
                                    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                                        <button
                                            onClick={() => {
                                                if (!currentUser) {
                                                    router.push(
                                                        `/sign-in?from=${pathname}`,
                                                    );
                                                } else {
                                                    setIsPaymentModalOpen(true);
                                                }
                                            }}
                                            className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl'
                                        >
                                            <ShoppingCart className='w-5 h-5' />
                                            Purchase for {pyq.price} points
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {Array.from({ length: pdfDoc.numPages }).map(
                                    (_, index) => (
                                        <LazyPDFPage
                                            key={index}
                                            pdf={pdfDoc}
                                            pageNum={index + 1}
                                            scale={1.5}
                                        />
                                    ),
                                )}
                            </>
                        )
                    ) : (
                        <div className='flex justify-center items-center min-h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60'>
                            <div className='text-center'>
                                <Loader2 className='w-12 h-12 text-sky-500 animate-spin mx-auto mb-4' />
                                <p className='text-gray-600 dark:text-gray-400'>
                                    Preparing document...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Google Ad */}
                <div className='my-6 w-full max-w-4xl mx-auto'>
                    <GoogleAd
                        adSlot='9984010614'
                        adFormat='auto'
                        className='w-full'
                    />
                </div>

                {/* Bottom controls: Download for Unsolved */}
                {!pyq.solved && (
                    <div className='mt-8'>
                        {/* AI Solution Section */}
                        <div className='mt-6 mb-6 flex flex-wrap gap-4 justify-center'>
                            {pyq.mdSolution ? (
                                <Link
                                    prefetch={false}
                                    href={`/${slug}/pyqs/${pyq.slug}/solution`}
                                    className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg'
                                >
                                    <Bot className='w-5 h-5' />
                                    View Solution
                                </Link>
                            ) : (
                                <button
                                    onClick={handleRequestSolution}
                                    disabled={
                                        requestingSolution || hasRequested
                                    }
                                    className={`inline-flex items-center gap-2 px-6 py-3 border font-medium rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-50 ${
                                        hasRequested
                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50'
                                            : 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                    }`}
                                >
                                    {requestingSolution ? (
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                    ) : (
                                        <Bot className='w-5 h-5' />
                                    )}
                                    {hasRequested
                                        ? 'Requested'
                                        : 'Request Solution'}
                                </button>
                            )}
                        </div>
                        <div className='flex flex-wrap gap-3 justify-center'>
                            {!isAndroid ? (
                                <button
                                    onClick={() => {
                                        if (!currentUser) {
                                            toast.error(
                                                'Please login to download resources',
                                            );
                                            return;
                                        }
                                        setIsDownloadModalOpen(true);
                                    }}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm ${
                                        signedUrl
                                            ? 'bg-sky-600 text-white hover:bg-sky-700'
                                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}
                                    title={
                                        signedUrl
                                            ? `Download ${downloadFileName}`
                                            : 'Link expired. Please refresh to get a new link.'
                                    }
                                >
                                    <Download className='w-5 h-5' />
                                    Download
                                </button>
                            ) : (
                                <a
                                    href={`intent://studentsenior.com${pathname}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end`}
                                    className='inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm bg-sky-600 text-white hover:bg-sky-700'
                                >
                                    <Download className='w-5 h-5' />
                                    Open in App
                                </a>
                            )}

                            <DownloadTimerModal
                                isOpen={isDownloadModalOpen}
                                onClose={() => setIsDownloadModalOpen(false)}
                                onDownload={handleSecureDownload}
                            />
                        </div>
                    </div>
                )}

                {/* Related Resources Section */}
                <div className='mt-12 mb-8'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 rounded-xl bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center'>
                             <BookOpen className='w-5 h-5' />
                        </div>
                        <h2 className='text-2xl font-bold text-[#101828] dark:text-white tracking-tight'>
                            Explore More Resources
                        </h2>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {/* More PYQs Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${pyq.subject?.branch?.course?.courseCode}/${pyq.subject?.branch?.branchCode}/pyqs/${pyq.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#eaf3fd] dark:group-hover:bg-[#183153] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <FileStack className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                More PYQs
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                All {pyq.subject.subjectName} papers
                            </p>
                        </Link>

                        {/* Notes Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${pyq.subject?.branch?.course?.courseCode}/${pyq.subject?.branch?.branchCode}/notes/${pyq.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-[0_4px_12px_rgba(16,185,129,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <NotebookPen className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                                Notes
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Study notes for {pyq.subject.subjectName}
                            </p>
                        </Link>

                        {/* Syllabus Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/syllabus/${pyq.subject?.subjectName.toLowerCase().replace(/\s+/g, '-')}-${pyq.subject?.subjectCode.toLowerCase()}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-[0_4px_12px_rgba(168,85,247,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <BookOpen className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                                Syllabus
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Syllabus of {pyq.subject.subjectName}
                            </p>
                        </Link>

                        {/* Videos Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${pyq.subject?.branch?.course?.courseCode}/${pyq.subject?.branch?.branchCode}/videos/${pyq.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-orange-500 dark:hover:border-orange-400 hover:shadow-[0_4px_12px_rgba(249,115,22,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <Video className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
                                Videos
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Videos for {pyq.subject.subjectName}
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Suggested PYQs Section */}
                {!loadingSuggestions &&
                    (suggestedPyqs.sameSubjectExamType.length > 0 ||
                        suggestedPyqs.sameSubject.length > 0 ||
                        suggestedPyqs.sameSemester.length > 0) && (
                        <div className='mt-12 mb-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 rounded-xl bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] flex items-center justify-center'>
                                    <Sparkles className='w-5 h-5' />
                                </div>
                                <h2 className='text-2xl font-bold text-[#101828] dark:text-white tracking-tight'>
                                    Suggested PYQs
                                </h2>
                            </div>

                            {/* Same Subject Same Exam Type */}
                            {suggestedPyqs.sameSubjectExamType.length > 0 && (
                                <div className='mb-8'>
                                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-4'>
                                        More {pyq.subject.subjectName} -{' '}
                                        {pyq.examType} Papers
                                    </h3>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                        {suggestedPyqs.sameSubjectExamType.map(
                                            (suggestedPyq) => (
                                                <Link
                                                    key={suggestedPyq._id}
                                                    prefetch={false}
                                                    href={`/${slug}/pyqs/${suggestedPyq.slug}`}
                                                    className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200 overflow-hidden cursor-pointer'
                                                >
                                                    <div className='p-4 flex flex-col h-full'>
                                                        <div className='flex items-start justify-between mb-4'>
                                                            <div>
                                                                <h3 className='text-xl font-bold text-[#101828] dark:text-white leading-none tracking-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                                                    {suggestedPyq.year}
                                                                </h3>
                                                                <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mt-2'>
                                                                    {suggestedPyq.examType}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='mt-auto pt-3 flex items-center justify-between border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                                            <div className='flex items-center gap-1 text-[11px] font-medium text-[#8c8883] dark:text-[#787672]'>
                                                                <Eye className='w-3.5 h-3.5' />
                                                                <span>{suggestedPyq.clickCounts} views</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Same Subject (All Exam Types) */}
                            {suggestedPyqs.sameSubject.length > 0 && (
                                <div className='mb-8'>
                                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-4'>
                                        More {pyq.subject.subjectName} Papers
                                    </h3>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                        {suggestedPyqs.sameSubject.map(
                                            (suggestedPyq: IPyq) => (
                                                <Link
                                                    key={suggestedPyq._id}
                                                    prefetch={false}
                                                    href={`/${slug}/pyqs/${suggestedPyq.slug}`}
                                                    className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200 overflow-hidden cursor-pointer'
                                                >
                                                    <div className='p-4 flex flex-col h-full'>
                                                        <div className='flex items-start justify-between mb-4'>
                                                            <div>
                                                                <h3 className='text-xl font-bold text-[#101828] dark:text-white leading-none tracking-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                                                    {suggestedPyq.year}
                                                                </h3>
                                                                <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mt-2'>
                                                                    {suggestedPyq.examType}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='mt-auto pt-3 flex items-center justify-between border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                                            <div className='flex items-center gap-1 text-[11px] font-medium text-[#8c8883] dark:text-[#787672]'>
                                                                <Eye className='w-3.5 h-3.5' />
                                                                <span>{suggestedPyq.clickCounts} views</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Same Semester (All Subjects) */}
                            {suggestedPyqs.sameSemester.length > 0 && (
                                <div className='mb-8'>
                                    <h3 className='text-lg font-bold text-[#101828] dark:text-white mb-4'>
                                        Semester {pyq.subject.semester} Papers
                                    </h3>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                        {suggestedPyqs.sameSemester.map(
                                            (suggestedPyq: IPyq) => (
                                                <Link
                                                    key={suggestedPyq._id}
                                                    prefetch={false}
                                                    href={`/${slug}/pyqs/${suggestedPyq.slug}`}
                                                    className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200 overflow-hidden cursor-pointer'
                                                >
                                                    <div className='p-4 flex flex-col h-full'>
                                                        <div className='flex items-start justify-between mb-4'>
                                                            <div>
                                                                <h3 className='text-xl font-bold text-[#101828] dark:text-white leading-none tracking-tight group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                                                    {suggestedPyq.year}
                                                                </h3>
                                                                <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mt-2'>
                                                                    {suggestedPyq.examType}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='mb-3'>
                                                            <h4 className='font-semibold text-[#101828] dark:text-white text-sm line-clamp-2'>
                                                                {suggestedPyq.subject.subjectName}
                                                            </h4>
                                                        </div>
                                                        <div className='mt-auto pt-3 flex items-center justify-between border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                                            <div className='flex items-center gap-1 text-[11px] font-medium text-[#8c8883] dark:text-[#787672]'>
                                                                <Eye className='w-3.5 h-3.5' />
                                                                <span>{suggestedPyq.clickCounts} views</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                resourceType='pyq'
                resourceId={pyq._id}
                price={pyq.price}
                title={pyq.subject.subjectName}
                metadata={{
                    college: pyq.college.name,
                    subject: pyq.subject.subjectName,
                    examType: pyq.examType,
                    year: pyq.year.toString(),
                }}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
};

export default PyqDetailClient;
