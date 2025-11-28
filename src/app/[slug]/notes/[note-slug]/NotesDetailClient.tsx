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
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-8 text-center max-w-md w-full'>
                    <div className='w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <FileText className='w-10 h-10 text-red-500' />
                    </div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                        Failed to Load Document
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-6'>
                        {error}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className='inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors duration-200'
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
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4'>
                <div className='text-center'>
                    <div className='w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6'></div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                        Loading Document
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
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
        <div className='min-h-screen bg-sky-50 dark:bg-gray-900'>
            <DetailPageNavbar path='notes' fullPath={`/${slug}/notes`} />

            {/* Document Info Section */}
            <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-8 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                        {/* Main Info */}
                        <div className='flex-1'>
                            <h1 className='sm:text-3xl font-fugaz font-bold text-gray-900 dark:text-white mb-3'>
                                {note.title}
                            </h1>
                            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-lg mb-6'>
                                {note.description}
                            </p>

                            {/* Details Grid */}
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center'>
                                        <FileText className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Subject
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                                            {note.subject.subjectName}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                                        <BookOpen className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Semester
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                                            {note.subject.semester}
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Created
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(
                                                note.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div> */}
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center'>
                                        <User className='w-5 h-5 text-orange-600 dark:text-orange-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Uploaded By
                                        </p>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white'>
                                            {note.owner.username}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <button
                                        onClick={() => {
                                            if (isSaved) {
                                                handleUnsave();
                                            } else {
                                                handleSave();
                                            }
                                        }}
                                        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors'
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
                                            className='w-4 h-4 sm:w-5 sm:h-5'
                                            fill={
                                                isSaved
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                            xmlns='http://www.w3.org/2000/svg'
                                            style={{
                                                color: isSaved
                                                    ? '#10B981'
                                                    : '#10B981',
                                            }}
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
                                        Unlock Full Content
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
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
                                            className='inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl'
                                        >
                                            <ShoppingCart className='w-5 h-5' />
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
                        <div className='flex justify-center items-center min-h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60'>
                            <div className='text-center'>
                                <Loader2 className='w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4' />
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

                {/* Bottom controls: Download for Unpaid Notes */}
                {!note.isPaid && note.isDownloadable && (
                    <div className='mt-8'>
                        <div className='flex flex-wrap gap-3 justify-center'>
                            <button
                                    onClick={() => {
                                        if (!currentUser) {
                                            toast.error('Please login to download resources');
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
                        <BookOpen className='w-6 h-6 text-sky-600 dark:text-sky-400' />
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            Explore More Resources
                        </h2>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {/* More PYQs Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/pyqs/${note.subject?.subjectCode}`}
                            className='group bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border-2 border-sky-200 dark:border-sky-700 p-6 hover:shadow-lg hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300'
                        >
                            <div className='flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300'>
                                <FileStack className='w-6 h-6 text-sky-600 dark:text-sky-400' />
                            </div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                View PYQs
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                View all {note.subject.subjectName} papers
                            </p>
                        </Link>

                        {/* Notes Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/notes/${note.subject?.subjectCode}`}
                            className='group bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300'
                        >
                            <div className='flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300'>
                                <NotebookPen className='w-6 h-6 text-emerald-600 dark:text-emerald-400' />
                            </div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                Notes
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Study notes for {note.subject.subjectName}
                            </p>
                        </Link>

                        {/* Syllabus Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/syllabus/${note.subject?.subjectName.toLowerCase().replace(/\s+/g, '-')}-${note.subject?.subjectCode.toLowerCase()}`}
                            className='group bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300'
                        >
                            <div className='flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300'>
                                <BookOpen className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                            </div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                Syllabus
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Syllabus of {note.subject.subjectName}
                            </p>
                        </Link>

                        {/* Videos Button */}
                        <Link
                            prefetch={false}
                            href={`/${slug}/resources/${note.subject?.branch?.course?.courseCode}/${note.subject?.branch?.branchCode}/videos/${note.subject?.subjectCode}`}
                            className='group bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-700 p-6 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300'
                        >
                            <div className='flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300'>
                                <Video className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                            </div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                                Videos
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
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
                            <Sparkles className='w-6 h-6 text-emerald-600 dark:text-emerald-400' />
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                More {note.subject.subjectName} Notes
                            </h2>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {suggestedNotes.sameSubjectNotes.map(
                                (suggestedNote: INote) => (
                                    <div
                                        key={suggestedNote._id}
                                        onClick={() =>
                                            router.push(
                                                `/${slug}/notes/${suggestedNote.slug}`,
                                            )
                                        }
                                        className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group'
                                    >
                                        <div className='flex items-start gap-3 mb-3'>
                                            <div className='w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                <FileText className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h3 className='font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                                                    {suggestedNote.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3'>
                                            {suggestedNote.description}
                                        </p>
                                        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                                            <span className='flex items-center gap-1'>
                                                <User className='w-3 h-3' />
                                                {suggestedNote.owner.username}
                                            </span>
                                            {suggestedNote.isPaid && (
                                                <span className='bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-medium'>
                                                    {suggestedNote.price} pts
                                                </span>
                                            )}
                                        </div>
                                    </div>
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
