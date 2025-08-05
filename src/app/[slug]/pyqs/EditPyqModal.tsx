"use client";
import React, { useState } from "react";
import { IPyq } from "@/utils/interface";
import { DollarSign, X } from "lucide-react";
import toast from "react-hot-toast";

interface EditPyqModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { isPaid: boolean; price: number }) => void;
    pyq: IPyq;
}

const EditPyqModal: React.FC<EditPyqModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    pyq,
}) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        isPaid: pyq.isPaid,
        price: pyq.price,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.isPaid && (!form.price || form.price < 25)) {
            toast.error(
                "Please set a valid price (minimum 25 points) for paid content"
            );
            return;
        }

        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (error) {
            console.error("Error updating PYQ:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Pricing
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* PYQ Info */}
                    <div className="text-center">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {pyq.subject.subjectName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {pyq.subject.branch.branchName} • {pyq.year}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Premium Content
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPaid: !prev.isPaid,
                                    price: !prev.isPaid ? prev.price || 25 : 0,
                                }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.isPaid
                                    ? "bg-violet-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.isPaid
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Price Input */}
                    {form.isPaid && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Price (Points)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="25"
                                    min="25"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                5 points = ₹1 (Min: 25 points)
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                (form.isPaid &&
                                    (!form.price || form.price < 25))
                            }
                            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                            {loading ? "Saving..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPyqModal;
