"use client";
import { api } from "@/config/apiUrls";
import { ILostFoundItem } from "@/utils/interface";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

export type LostFoundFormData = {
    title: string;
    description: string;
    type: "lost" | "found";
    location: string;
    date: string;
    whatsapp: string;
    imageUrl: string;
    currentStatus: "open" | "closed";
};

interface LostFoundFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: LostFoundFormData) => void;
    loading: boolean;
    form: LostFoundFormData;
    setForm: (form: LostFoundFormData) => void;
    editItem: ILostFoundItem | null;
}

const LostFoundFormModal: React.FC<LostFoundFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    form,
    setForm,
    editItem,
}) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setSelectedImage(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            const fileName = `public/ss-lostfound/${Date.now()}-${file.name.replace(
                /[^a-zA-Z0-9.-]/g,
                ""
            )}`;
            const fileType = file.type;

            // Get presigned URL
            const presignedRes = await fetch(api.aws.presignedUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!presignedRes.ok) {
                throw new Error("Failed to get upload URL");
            }

            const { uploadUrl, key } = await presignedRes.json();

            console.log(fileName, fileType);

            // Upload to S3
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": fileType },
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload image");
            }

            // Return the CloudFront URL
            return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setImageLoading(true);
            let imageUrl = form.imageUrl;

            // Upload new image if selected
            if (selectedImage) {
                const loadingToast = toast.loading("Uploading image...");
                try {
                    imageUrl = await uploadImage(selectedImage);
                    toast.dismiss(loadingToast);
                    toast.success("Image uploaded successfully");
                } catch (error) {
                    console.error("Image upload error:", error);
                    toast.dismiss(loadingToast);
                    toast.error("Failed to upload image");
                    return;
                }
            }

            console.log(form);
            console.log(imageUrl);

            // Submit the form with the new image URL
            await onSubmit({
                ...form,
                imageUrl,
            });

            // Reset form
            setSelectedImage(null);
            setForm({
                title: "",
                description: "",
                type: "lost",
                location: "",
                date: new Date().toISOString().split("T")[0],
                whatsapp: "",
                imageUrl: "",
                currentStatus: "open",
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to submit form");
        } finally {
            setImageLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg relative">
                <button
                    className="absolute text-4xl top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {editItem ? "Edit Item" : "Post Item"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    >
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>

                    {editItem && (
                        <select
                            name="currentStatus"
                            value={form.currentStatus}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    )}

                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        minLength={10}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        max={new Date().toISOString().split("T")[0]}
                    />

                    <input
                        type="text"
                        name="whatsapp"
                        placeholder="WhatsApp Number"
                        value={form.whatsapp}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {selectedImage && (
                            <p className="text-sm text-gray-500">
                                Selected: {selectedImage.name}
                            </p>
                        )}
                        {form.imageUrl && (
                            <div className="mt-2">
                                <Image
                                    src={form.imageUrl}
                                    alt="Current Image"
                                    className="w-20 h-20 object-cover rounded"
                                    width={80}
                                    height={80}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg py-2 dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50"
                        disabled={loading || imageLoading}
                    >
                        {loading || imageLoading
                            ? "Saving..."
                            : editItem
                            ? "Update Item"
                            : "Post Item"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LostFoundFormModal;
