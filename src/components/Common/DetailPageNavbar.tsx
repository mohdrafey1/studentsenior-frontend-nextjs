"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/config/apiUrls";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Flag, Share2, X } from "lucide-react";

const DetailPageNavbar = ({
    path,
    fullPath,
}: {
    path?: string;
    fullPath?: string;
}) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "complain@studentsenior.com",
        subject: "",
        description: "",
    });
    const [canGoBack, setCanGoBack] = useState(false);

    // Initialize subject with current URL when component mounts
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setFormData((prev) => ({
                ...prev,
                subject: "Reported URL: " + window.location.href,
            }));
        }
    }, []);

    useEffect(() => {
        // On client, detect if there's history
        setCanGoBack(window.history.length > 1);
    }, []);

    const handleBackNavigation = () => {
        if (fullPath) {
            router.push(fullPath); // Always use defined path if given
        } else if (canGoBack) {
            router.back(); // Only back if there's history
        } else {
            router.push("/"); // SSR-safe fallback
        }
    };

    const handleShare = async () => {
        if (typeof window === "undefined") return;

        const url = window.location.href;

        // Check if Web Share API is available (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: `Check out this page`,
                    url: url,
                });
            } catch (error) {
                // User cancelled sharing or error occurred
                if (error instanceof Error && error.name !== "AbortError") {
                    // Fallback to clipboard
                    await copyToClipboard(url);
                }
            }
        } else {
            // Fallback to clipboard for desktop
            await copyToClipboard(url);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("URL copied to clipboard!");
        } catch (error) {
            // Fallback for older browsers
            console.log(error);
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                toast.success("URL copied to clipboard!");
            } catch (fallbackError) {
                console.log(fallbackError);
                toast.error("Failed to copy URL");
            }
            document.body.removeChild(textArea);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.description.trim()) {
            toast.error("Please describe the issue before submitting");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(api.contactus.createContactus, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Report submitted successfully");
                setFormData({ ...formData, description: "" });
                setShowReportModal(false);
            } else {
                throw new Error("Failed to submit report");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while submitting the report");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        if (!isSubmitting) {
            setShowReportModal(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <div className="sticky top-0 left-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6">
                {/* Back Button */}
                <button
                    onClick={handleBackNavigation}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    <span className="font-medium">
                        Back {path && `to ${path}`}
                    </span>
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Report Button */}
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    >
                        <Flag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium">Report</span>
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    >
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-medium">Share</span>
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Report an Issue
                            </h2>
                            <button
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Describe the issue
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={4}
                                    placeholder="Please provide details about the issue you're reporting..."
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <strong>URL being reported:</strong>
                                <br />
                                {typeof window !== "undefined"
                                    ? window.location.href
                                    : ""}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting || !formData.description.trim()
                                }
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl font-medium transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Report"
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
