"use client";
import React, { useState } from "react";
import { IStoreItem } from "@/utils/interface";
import { api } from "@/config/apiUrls";
import toast from "react-hot-toast";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

export interface StoreFormData {
    name: string;
    description: string;
    price: number;
    image: string;
    whatsapp: string;
    telegram: string;
}

interface StoreFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StoreFormData) => Promise<void>;
    editItem?: IStoreItem | null;
    form: StoreFormData;
    setForm: (form: StoreFormData) => void;
    loading: boolean;
}

const StoreFormModal: React.FC<StoreFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editItem,
    form,
    setForm,
    loading,
}) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    if (!isOpen) return null;

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
            const fileName = `public/ss-store/${Date.now()}-${file.name.replace(
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
            let image = form.image;

            // Upload new image if selected
            if (selectedImage) {
                const loadingToast = toast.loading("Uploading image...");
                try {
                    image = await uploadImage(selectedImage);
                    toast.dismiss(loadingToast);
                    toast.success("Image uploaded successfully");
                } catch (error) {
                    console.error("Image upload error:", error);
                    toast.dismiss(loadingToast);
                    toast.error("Failed to upload image");
                    return;
                }
            }

            // Submit the form with the new image URL
            await onSubmit({
                ...form,
                image,
            });

            // Reset form
            setSelectedImage(null);
            setForm({
                name: "",
                description: "",
                price: 0,
                image: "",
                whatsapp: "",
                telegram: "",
            });
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to submit form");
        } finally {
            setImageLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editItem ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Describe your product"
                            minLength={10}
                            maxLength={1000}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter price"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Product Image *
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={imageLoading}
                                />

                                <div className="text-center">
                                    {imageLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                                    ) : (
                                        <Upload className="w-6 h-6 mx-auto text-gray-400" />
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {imageLoading
                                            ? "Uploading..."
                                            : "Upload"}
                                    </p>
                                </div>
                            </label>
                            {selectedImage && <div>{selectedImage.name}</div>}
                            {form.image && (
                                <div className="flex-1">
                                    <Image
                                        src={form.image}
                                        alt="Preview"
                                        className="object-cover rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            name="whatsapp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="10-digit number"
                        />
                    </div>

                    {/* Telegram */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Telegram (optional)
                        </label>
                        <input
                            type="text"
                            name="telegram"
                            value={form.telegram}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter Tg Number or Username"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || imageLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : editItem ? (
                                "Update Product"
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreFormModal;
