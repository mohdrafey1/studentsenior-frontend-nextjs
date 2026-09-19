'use client';
import React, { useState, useEffect, useRef } from 'react';
import { INote } from '@/utils/interface';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    FileText,
    // Calendar,
    BookOpen,
    Lock,
    Loader2,
    ShoppingCart,
    User,
    Download,
    Sparkles,
    Video,
    NotebookPen,
    FileStack,
} from 'lucide-react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import { api } from '@/config/apiUrls';
import Image from 'next/image';
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

interface NotesDetailClientProps {
    note: INote;
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
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden'>
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

const NotesDetailClient: React.FC<NotesDetailClientProps> = ({ note }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { slug } = useParams();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    // Suggested Notes state
    const [suggestedNotes, setSuggestedNotes] = useState<{
        sameSubjectNotes: INote[];
    }>({
        sameSubjectNotes: [],
    });
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );
    const ownerId = currentUser?._id;

    const { saveResource, unsaveResource } = useSaveResource();
    const { savedNotes } = useSelector(
        (state: RootState) => state.savedCollection,
    );
    const [isSaved, setIsSaved] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (!note?.fileUrl) return;

            setIsLoading(true);
            try {
                const response = await fetch(
                    `${api.aws.getSignedUrl}?fileUrl=${note.fileUrl}`,
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
    }, [note?.fileUrl]);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    useEffect(() => {
        const isSavedEntry = !!savedNotes?.some((entry) =>
            typeof entry.noteId === 'string'
                ? entry.noteId === note._id
                : entry.noteId && typeof entry.noteId === 'object'
                  ? entry.noteId._id === note._id
                  : false,
        );
        setIsSaved(isSavedEntry);
    }, [savedNotes, note._id]);

    // Fetch suggested notes
    useEffect(() => {
        const fetchSuggestedNotes = async () => {
            if (!note || !note.slug) return;

            setLoadingSuggestions(true);
            try {
                const response = await fetch(
                    api.notes.getSuggestedNotes(note.slug),
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to fetch suggested notes',
                    );
                }

                setSuggestedNotes({
                    sameSubjectNotes: data.data?.sameSubjectNotes || [],
                });
            } catch (error) {
                console.error('Error fetching suggested notes:', error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        fetchSuggestedNotes();
    }, [note]);

    const handleSave = async () => {
        await saveResource('note', note._id);
    };

    const handleUnsave = async () => {
        await unsaveResource('note', note._id);
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
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-sm p-8 text-center max-w-md w-full'>
                    <div className='w-16 h-16 bg-[#fef2f2] dark:bg-[#3d1c1c] border border-[#fee2e2] dark:border-[#3d1c1c] rounded-2xl flex items-center justify-center mx-auto mb-6'>
                        <FileText className='w-8 h-8 text-[#dc2626] dark:text-[#f87171]' />
                    </div>
                    <h2 className='text-xl font-bold text-[#101828] dark:text-white tracking-tight mb-3'>
                        Failed to Load Document
                    </h2>
                    <p className='text-[#475467] dark:text-[#a09e9a] text-sm mb-6'>
                        {error}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] text-[#101828] dark:text-white hover:bg-[#eae8e4] dark:hover:bg-[#333] font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
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
                    <div className='w-16 h-16 border-4 border-[#0075de] border-t-transparent rounded-full animate-spin mx-auto mb-6'></div>
                    <h2 className='text-xl font-bold text-[#101828] dark:text-white tracking-tight mb-2'>
                        Loading Document
                    </h2>
                    <p className='text-[#475467] dark:text-[#a09e9a] text-sm'>
                        Please wait while we prepare your notes...
                    </p>
                </div>
            </div>
        );
    }

    const isOwner = note.owner._id === ownerId;
    const isPaidAndNotOwner =
        note.isPaid && !isOwner && !note.purchasedBy?.includes(ownerId || '');

    const downloadFileName = `${note.subject.subjectCode}-notes-studentsenior.pdf`;

    const handleSecureDownload = async () => {
        if (!note?.fileUrl) return;
        try {
            const response = await fetch(
                `${api.aws.getSignedUrl}?fileUrl=${note.fileUrl}`,
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
            <DetailPageNavbar path='notes' fullPath={`/${slug}/notes`} />

            {/* Document Info Section */}
            <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-6 sm:p-8 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                        {/* Main Info */}
                        <div className='flex-1'>
                            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6'>
                                <div>
                                    <h1 className='text-3xl font-bold text-[#101828] dark:text-white tracking-tight mb-3'>
                                        {note.title}
                                    </h1>
                                    <p className='text-[#475467] dark:text-[#a09e9a] text-sm sm:text-base max-w-3xl'>
                                        {note.description}
                                    </p>
                                </div>
                                <div className='flex-shrink-0'>
                                    <button
                                        onClick={() => {
                                            if (isSaved) {
                                                handleUnsave();
                                            } else {
                                                handleSave();
                                            }
                                        }}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                                            isSaved
                                                ? 'bg-[#e6f4ea] dark:bg-[#1e3a29] border-[#ceead6] dark:border-[#1e3a29] text-[#137333] dark:text-[#34a853]'
                                                : 'bg-[#f6f5f4] dark:bg-[#282828] border-[#e6e6e6] dark:border-[#383838] text-[#101828] dark:text-white hover:bg-[#eae8e4] dark:hover:bg-[#333]'
                                        }`}
                                        title={
                                            isSaved
                                                ? 'Unsave this Note'
                                                : 'Save this Note'
                                        }
                                        aria-label={
                                            isSaved
                                                ? 'Unsave this Note'
                                                : 'Save this Note'
                                        }
                                    >
                                        <svg
                                            className='w-4 h-4'
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
                                        {isSaved ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            <hr className='border-[#f0eee9] dark:border-[#2a2a2a] mb-6' />

                            {/* Details Grid */}
                            <div className='flex flex-wrap gap-4 sm:gap-8'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-xl flex items-center justify-center text-[#615d59] dark:text-[#a09e9a]'>
                                        <FileText className='w-5 h-5' />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mb-0.5'>
                                            Subject
                                        </p>
                                        <p className='font-bold text-sm text-[#101828] dark:text-white'>
                                            {note.subject.subjectName}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-xl flex items-center justify-center text-[#615d59] dark:text-[#a09e9a]'>
                                        <BookOpen className='w-5 h-5' />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mb-0.5'>
                                            Semester
                                        </p>
                                        <p className='font-bold text-sm text-[#101828] dark:text-white'>
                                            {note.subject.semester}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-xl flex items-center justify-center text-[#615d59] dark:text-[#a09e9a]'>
                                        <User className='w-5 h-5' />
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-[#615d59] dark:text-[#9ea3ae] uppercase tracking-wider mb-0.5'>
                                            Uploaded By
                                        </p>
                                        <p className='font-bold text-sm text-[#101828] dark:text-white'>
                                            {note.owner.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                                <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-sm p-8 text-center'>
                                    <div className='w-16 h-16 bg-[#fef7e0] dark:bg-[#3d3119] border border-[#fce8b2] dark:border-[#3d3119] rounded-2xl flex items-center justify-center mx-auto mb-6'>
                                        <Lock className='w-8 h-8 text-[#b06000] dark:text-[#fbbc04]' />
                                    </div>
                                    <h3 className='text-2xl font-bold text-[#101828] dark:text-white mb-2 tracking-tight'>
                                        Unlock Full Content
                                    </h3>
                                    <p className='text-[#475467] dark:text-[#a09e9a] mb-8 max-w-md mx-auto'>
                                        You&apos;ve seen a preview of this
                                        document. Purchase to access all{' '}
                                        {pdfDoc.numPages} pages and download the
                                        complete notes.
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
                                            className='inline-flex items-center gap-2 px-6 py-3 bg-[#0075de] hover:bg-[#0062bd] text-white text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
                                        >
                                            <ShoppingCart className='w-4 h-4' />
                                            Purchase for {note.price} points
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
                        <div className='flex justify-center items-center min-h-[400px] bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='text-center'>
                                <Loader2 className='w-10 h-10 text-[#0075de] dark:text-[#62aef0] animate-spin mx-auto mb-4' />
                                <p className='text-[#475467] dark:text-[#a09e9a] font-medium'>
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

                {/* Bottom controls: Download for Unpaid Notes */}
                {!note.isPaid && note.isDownloadable && (
                    <div className='mt-8'>
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
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-xs active:scale-[0.98] ${
                                        signedUrl
                                            ? 'bg-[#0075de] hover:bg-[#0062bd] text-white'
                                            : 'bg-[#e6e6e6] dark:bg-[#2f2f2f] text-[#8c8883] dark:text-[#787672] cursor-not-allowed'
                                    }`}
                                    title={
                                        signedUrl
                                            ? `Download ${downloadFileName}`
                                            : 'Link expired. Please refresh to get a new link.'
                                    }
                                >
                                    <Download className='w-4 h-4' />
                                    Download Note
                                </button>
                            ) : (
                                <a
                                    href={`intent://studentsenior.com${pathname}#Intent;scheme=https;package=com.mohdrafey1.studentsenior;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.mohdrafey1.studentsenior;end`}
                                    className='inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-xs active:scale-[0.98] bg-[#0075de] hover:bg-[#0062bd] text-white'
                                >
                                    <Download className='w-4 h-4' />
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
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/pyqs/${note.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-[#0075de] dark:hover:border-[#62aef0] hover:shadow-[0_4px_12px_rgba(0,117,222,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#eaf3fd] dark:group-hover:bg-[#183153] group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <FileStack className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-[#0075de] dark:group-hover:text-[#62aef0] transition-colors'>
                                View PYQs
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                All {note.subject.subjectName} papers
                            </p>
                        </Link>

                        {/* Notes Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/notes/${note.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-[0_4px_12px_rgba(16,185,129,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <NotebookPen className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                                Notes
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Study notes for {note.subject.subjectName}
                            </p>
                        </Link>

                        {/* Syllabus Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/syllabus/${note.subject?.subjectName.toLowerCase().replace(/\s+/g, '-')}-${note.subject?.subjectCode.toLowerCase()}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-[0_4px_12px_rgba(168,85,247,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <BookOpen className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                                Syllabus
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Syllabus of {note.subject.subjectName}
                            </p>
                        </Link>

                        {/* Videos Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/videos/${note.subject?.subjectCode}`}
                            className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-5 flex flex-col hover:border-orange-500 dark:hover:border-orange-400 hover:shadow-[0_4px_12px_rgba(249,115,22,0.1)] transition-all duration-200'
                        >
                            <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all text-[#615d59] dark:text-[#a09e9a]'>
                                <Video className='w-5 h-5' />
                            </div>
                            <h3 className='font-bold text-[#101828] dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
                                Videos
                            </h3>
                            <p className='text-xs font-medium text-[#615d59] dark:text-[#9ea3ae] line-clamp-1'>
                                Videos for {note.subject.subjectName}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Suggested Notes Section */}
            {!loadingSuggestions &&
                suggestedNotes.sameSubjectNotes.length > 0 && (
                    <div className='max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                                <Sparkles className='w-5 h-5' />
                            </div>
                            <h2 className='text-2xl font-bold text-[#101828] dark:text-white tracking-tight'>
                                More {note.subject.subjectName} Notes
                            </h2>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {suggestedNotes.sameSubjectNotes.map(
                                (suggestedNote: INote) => (
                                    <Link
                                        key={suggestedNote._id}
                                        prefetch={false}
                                        href={`/${slug}/notes/${suggestedNote.slug}`}
                                        className='group relative bg-white dark:bg-[#1c1c1c] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-[0_4px_12px_rgba(16,185,129,0.1)] transition-all duration-200 overflow-hidden cursor-pointer'
                                    >
                                        <div className='p-4 flex flex-col h-full'>
                                            <div className='flex items-start gap-3 mb-4'>
                                                <div className='w-10 h-10 rounded-lg bg-[#f6f5f4] dark:bg-[#282828] flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-[#615d59] dark:text-[#a09e9a]'>
                                                    <FileText className='w-5 h-5' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-bold text-[#101828] dark:text-white text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                                                        {suggestedNote.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            
                                            <div className='mt-auto pt-3 flex items-center justify-between border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                                                <div className='flex items-center gap-2'>
                                                    <User className='w-3.5 h-3.5 text-[#8c8883] dark:text-[#787672]' />
                                                    <span className='text-xs font-medium text-[#615d59] dark:text-[#a09e9a] truncate max-w-[120px]'>
                                                        {suggestedNote.owner.username}
                                                    </span>
                                                </div>
                                                {suggestedNote.isPaid && (
                                                    <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fef7e0] dark:bg-[#3d3119] text-[#b06000] dark:text-[#fbbc04] border border-[#fce8b2] dark:border-[#3d3119] leading-none'>
                                                        {suggestedNote.price} pts
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>
                )}

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                resourceType='notes'
                resourceId={note._id}
                price={note.price}
                title={note.title}
                metadata={{
                    college: note.college.name,
                    subject: note.subject.subjectName,
                }}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
};

export default NotesDetailClient;
