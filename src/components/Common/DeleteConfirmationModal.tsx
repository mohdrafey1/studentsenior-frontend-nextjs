"use client";
import React from "react";

interface DeleteConfirmationModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onConfirm,
    onCancel,
    loading = false,
    message = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 dark:bg-opacity-70">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Confirm Delete
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
