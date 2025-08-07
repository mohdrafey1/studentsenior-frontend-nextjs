"use client";
import React, { useState, useEffect, useRef } from "react";
import { IPyq } from "@/utils/interface";
import {
    ArrowLeft,
    FileText,
    Calendar,
    BookOpen,
    Lock,
    Eye,
    Loader2,
    ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { api } from "@/config/apiUrls";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";

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
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
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
                                err
                            );
                            setIsLoading(false);
                        }
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [pdf, pageNum, scale, pageSrc]);

    return (
        <div ref={imgRef} className="relative w-full mb-8 group">
            <div className="bg-sky-50 dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Page Number Badge */}
                <div className="absolute bottom-1 right-1 z-10 bg-sky-500 opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Page {pageNum}
                </div>

                <div className="flex justify-center items-center min-h-[400px]">
                    {isLoading && !pageSrc ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Loading page {pageNum}...
                            </p>
                        </div>
                    ) : pageSrc ? (
                        <Image
                            src={pageSrc}
                            alt={`Page ${pageNum}`}
                            width={800}
                            height={1200}
                            className="w-full h-auto rounded-lg shadow-sm"
                            priority={pageNum <= 2}
                            unoptimized
                        />
                    ) : (
                        <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
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
    const router = useRouter();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const ownerId = "placeholder"; // Replace with actual user ID

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (!pyq?.fileUrl) return;

            setIsLoading(true);
            try {
                const response = await fetch(
                    `${api.aws.getSignedUrl}?fileUrl=${pyq.fileUrl}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to get signed URL."
                    );
                }

                const loadingTask = pdfjsLib.getDocument(data.data.signedUrl);
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
            } catch (err) {
                console.error("Error getting signed URL for view:", err);
                setError("Failed to load PDF document.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSignedUrlForView();
    }, [pyq?.fileUrl]);

    // Security handlers (disable right-click, keyboard shortcuts, devtools)
    useEffect(() => {
        const preventContextMenu = (e: MouseEvent) => e.preventDefault();
        const preventShortcuts = (e: KeyboardEvent) => {
            if (
                e.ctrlKey &&
                (e.key === "p" || e.key === "s" || e.key === "u")
            ) {
                e.preventDefault();
            }
        };
        const blockDevTools = (e: KeyboardEvent) => {
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
                (e.metaKey && e.altKey && ["I", "J"].includes(e.key))
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", preventContextMenu);
        document.addEventListener("keydown", preventShortcuts);
        document.addEventListener("keydown", blockDevTools);

        return () => {
            document.removeEventListener("contextmenu", preventContextMenu);
            document.removeEventListener("keydown", preventShortcuts);
            document.removeEventListener("keydown", blockDevTools);
        };
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-gray-900 flex justify-center items-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-8 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Failed to Load Document
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading && !pdfDoc) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-gray-900 flex justify-center items-center p-4">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Loading PYQ
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we prepare your previous year question
                        paper...
                    </p>
                </div>
            </div>
        );
    }

    const isOwner = pyq.owner._id === ownerId;
    const isPaidAndNotOwner =
        pyq.isPaid && !isOwner && !pyq.purchasedBy?.includes(ownerId);

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-gray-900">
            <DetailPageNavbar path="pyqs" />
            {/* Document Info Section */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-8 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Main Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                {pyq.subject.subjectName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                                {pyq.examType} - {pyq.year}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Semester
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pyq.subject.semester}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Year
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pyq.year}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Views
                                        </p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {pyq.clickCounts}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PDF Viewer Section */}
                <div className="pdf-viewer max-w-4xl mx-auto">
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
                                <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-sky-200 dark:border-sky-700 p-8 text-center">
                                    <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Lock className="w-10 h-10 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Unlock Complete PYQ
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        You&apos;ve seen a preview of this
                                        question paper. Purchase to access all{" "}
                                        {pdfDoc.numPages} pages and get the
                                        complete PYQ with solutions.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                                            <ShoppingCart className="w-5 h-5" />
                                            Purchase for {pyq.price} points or ₹
                                            {pyq.price / 5}
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
                                    )
                                )}
                            </>
                        )
                    ) : (
                        <div className="flex justify-center items-center min-h-[400px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Preparing document...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PyqDetailClient;
