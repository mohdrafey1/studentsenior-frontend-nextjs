"use client";
import React, { useState } from "react";
import { IVideo } from "@/utils/interface";
import { CheckCircle, X, Youtube, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface EditVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title?: string;
        description?: string;
        videoUrl?: string;
    }) => Promise<void>;
    video: IVideo;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    video,
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingVideoData, setLoadingVideoData] = useState(false);
    const [form, setForm] = useState({
        title: video.title,
        description: video.description || "",
        videoUrl: video.videoUrl,
    });

    // Function to extract YouTube video data
    const extractYouTubeData = async (url: string) => {
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return null;
        }

        setLoadingVideoData(true);
        try {
            // Extract video ID from various YouTube URL formats
            const regExp =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);

            if (!match || match[2].length !== 11) {
                toast.error("Invalid YouTube URL format");
                return null;
            }

            const videoId = match[2];

            // Try to fetch video data from YouTube oEmbed API
            const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

            try {
                const response = await fetch(oembedUrl);
                if (response.ok) {
                    const data = await response.json();
                    return {
                        title: data.title,
                        description: data.description || "",
                        thumbnail: data.thumbnail_url,
                    };
                }
            } catch (error) {
                console.log(
                    "Could not fetch YouTube oEmbed data, using fallback",
                    error
                );
            }

            // Fallback: just return the video ID for thumbnail
            return {
                title: "",
                description: "",
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            };
        } catch (error) {
            console.error("Error extracting YouTube data:", error);
            toast.error("Failed to extract video information");
        } finally {
            setLoadingVideoData(false);
        }
    };

    const handleVideoUrlChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const url = e.target.value;
        setForm((prev) => ({ ...prev, videoUrl: url }));

        // Auto-fill video data if it's a YouTube URL
        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            const videoData = await extractYouTubeData(url);
            if (videoData && videoData.title) {
                setForm((prev) => ({
                    ...prev,
                    title: videoData.title,
                    description: videoData.description || prev.description,
                }));
                toast.success("Video information auto-filled from YouTube!");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!form.videoUrl.trim()) {
            toast.error("Please enter a video URL");
            return;
        }

        // Validate YouTube URL
        if (
            !form.videoUrl.includes("youtube.com") &&
            !form.videoUrl.includes("youtu.be")
        ) {
            toast.error("Please enter a valid YouTube URL");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Updating video...");

        try {
            await onSubmit({
                title: form.title,
                description: form.description,
                videoUrl: form.videoUrl,
            });

            onClose();
        } catch (error) {
            console.error("Error updating video:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update video"
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Edit Video
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 bg-white dark:bg-gray-800"
                >
                    {/* Video URL */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            YouTube Video URL *
                        </label>
                        <div className="relative">
                            <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="url"
                                value={form.videoUrl}
                                onChange={handleVideoUrlChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                            />
                        </div>
                        {form.videoUrl && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>YouTube URL detected</span>
                                <a
                                    href={form.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Open
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            placeholder="Enter video title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold text-sky-500 dark:text-sky-400 mb-1">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            placeholder="Enter video description (optional)"
                        />
                    </div>

                    {/* Loading State for Video Data */}
                    {loadingVideoData && (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Extracting video information...
                            </span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !form.title ||
                                !form.videoUrl ||
                                loadingVideoData
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? "Updating..." : "Update Video"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;
