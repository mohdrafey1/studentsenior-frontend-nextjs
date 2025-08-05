"use client";
import React, { useState, useEffect, useRef } from "react";
import { IPyq } from "@/utils/interface";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { api } from "@/config/apiUrls";

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

// LazyPDFPage component – renders its page only when it scrolls into view
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
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!pdf) return;

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(async (entry) => {
                    if (entry.isIntersecting && !pageSrc) {
                        try {
                            const page = await pdf.getPage(pageNum);
                            const viewport = page.getViewport({ scale });
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");

                            if (!context) return;

                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            await page.render({
                                canvasContext: context,
                                viewport: viewport,
                            }).promise;

                            setPageSrc(canvas.toDataURL());
                            observer.unobserve(entry.target);
                        } catch (err) {
                            console.error(
                                `Error rendering page ${pageNum}:`,
                                err
                            );
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        return () => observer.disconnect();
    }, [pdf, pageNum, scale, pageSrc]);

    return (
        <div className="relative w-full mb-5" style={{ minHeight: "100px" }}>
            {/* {pageSrc ? ( */}
            <Image
                ref={imgRef}
                src={pageSrc || ""}
                alt={`Page ${pageNum}`}
                width={800}
                height={1200}
                className="w-full h-auto"
                priority={pageNum <= 2} // Prioritize loading first two pages
                unoptimized // Since we're already handling the optimization with PDF.js
            />
            {/* ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Loading page {pageNum}...</p>
                </div>
            )} */}
        </div>
    );
};

// AdPlacement component for displaying advertisements
const AdPlacement = ({ id }: { id: string }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const adScriptSrc =
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4435788387381825";
        const containerRef = adContainerRef.current;

        const initializeAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({
                    push: () => {},
                });
            } catch (e) {
                console.error("AdSense error:", e);
            }
        };

        const existingScript = document.querySelector(
            `script[src="${adScriptSrc}"]`
        );

        if (!existingScript) {
            const script = document.createElement("script");
            script.src = adScriptSrc;
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = initializeAd;
            document.head.appendChild(script);
        } else {
            initializeAd();
        }

        return () => {
            if (containerRef) {
                containerRef.innerHTML = "";
            }
        };
    }, [id]);

    return (
        <div
            ref={adContainerRef}
            className="ad-container my-4 p-4 bg-gray-100 rounded-lg border border-gray-300 text-center"
            style={{ minWidth: "300px" }}
            data-testid={`ad-container-${id}`}
        >
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-4435788387381825"
                data-ad-slot="8136832666"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
            <p className="text-xs text-gray-500 mt-1" data-testid="ad-label">
                Advertisement
            </p>
        </div>
    );
};

declare global {
    interface Window {
        adsbygoogle: Array<{
            push: (params: Record<string, unknown>) => void;
        }>;
    }
}

const PyqDetailClient: React.FC<PyqDetailClientProps> = ({ pyq }) => {
    const router = useRouter();
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const ownerId = "placeholder"; // TODO: Replace with actual user ID from your auth system

    const handleGoBack = () => {
        router.back();
    };

    // Load PDF Document for Viewing
    useEffect(() => {
        const fetchSignedUrlForView = async () => {
            if (pyq?.fileUrl) {
                setIsLoading(true);
                try {
                    // TODO: Replace with your actual API endpoint
                    const response = await fetch(
                        `${api.aws.getSignedUrl}?fileUrl=${pyq.fileUrl}`
                    );
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message || "Failed to get signed URL."
                        );
                    }

                    if (response.ok) {
                        // Load the PDF using the signed URL
                        const loadingTask = pdfjsLib.getDocument(
                            data.data.signedUrl
                        );
                        const pdf = await loadingTask.promise;
                        setPdfDoc(pdf);
                    } else {
                        throw new Error(
                            data.message || "Failed to get signed URL."
                        );
                    }
                } catch (err) {
                    console.error("Error getting signed URL for view:", err);
                    setError("Failed to load PDF document.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchSignedUrlForView();
    }, [pyq?.fileUrl]);

    // Prevent context menu and keyboard shortcuts
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.ctrlKey &&
                (e.key === "p" || e.key === "s" || e.key === "u")
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Block developer tools
    useEffect(() => {
        const blockDevTools = (e: KeyboardEvent) => {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey &&
                    e.shiftKey &&
                    (e.key === "I" || e.key === "J" || e.key === "C")) || // Ctrl+Shift+I/J/C
                (e.metaKey && e.altKey && (e.key === "I" || e.key === "J")) // Cmd+Option+I/J (Mac)
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("keydown", blockDevTools);
        return () => {
            document.removeEventListener("keydown", blockDevTools);
        };
    }, []);

    if (error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div>
                    <p className="text-center text-red-500 mb-4">{error}</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-sky-500 text-white rounded-md px-4 py-2 mt-3 hover:bg-sky-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading && !pdfDoc) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading PDF...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Back Button */}
            <button
                onClick={handleGoBack}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to PYQs
            </button>

            <div className="flex flex-col items-center px-2">
                <h1 className="text-2xl font-bold mb-4">
                    {pyq.subject.subjectName}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    {pyq.examType} - {pyq.year}
                </p>
                {pyq.solved && (
                    <span className="bg-green-200 rounded-md px-2 py-1 font-bold mt-2">
                        Solved
                    </span>
                )}
            </div>

            {/* PDF Viewer */}
            <div className="flex justify-center w-full my-5">
                <div className="pdf-viewer md:w-4/5 lg:w-3/5 px-1">
                    {pdfDoc ? (
                        <>
                            {pyq.isPaid &&
                            pyq.owner._id !== ownerId &&
                            !pyq.purchasedBy?.includes(ownerId) ? (
                                // Preview for unpurchased paid PYQs (first 2 pages only)
                                <>
                                    {Array.from({
                                        length: Math.min(2, pdfDoc.numPages),
                                    }).map((_, index) => (
                                        <React.Fragment key={index}>
                                            <LazyPDFPage
                                                pdf={pdfDoc}
                                                pageNum={index + 1}
                                                scale={1.5}
                                            />
                                            {index === 0 && (
                                                <AdPlacement id="preview-ad" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <div className="text-center mt-5">
                                        <p className="text-gray-600 mb-4">
                                            Purchase this PYQ to view all pages
                                        </p>
                                        {/* Purchase button will be handled by parent component */}
                                    </div>
                                </>
                            ) : (
                                // Full view for free PYQs or purchased/owned paid PYQs
                                <>
                                    {Array.from({
                                        length: pdfDoc.numPages,
                                    }).map((_, index) => (
                                        <React.Fragment key={index}>
                                            <LazyPDFPage
                                                pdf={pdfDoc}
                                                pageNum={index + 1}
                                                scale={1.5}
                                            />
                                            {(index + 1) % 5 === 0 && (
                                                <AdPlacement
                                                    id={`page-${index}`}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <AdPlacement id="bottom" />
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <p className="text-gray-600">Loading PDF...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PyqDetailClient;
