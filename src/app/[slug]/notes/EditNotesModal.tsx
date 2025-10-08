'use client';
import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { INote } from '@/utils/interface';

interface EditNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title?: string;
        description?: string;
        isPaid?: boolean;
        price?: number;
    }) => Promise<void>;
    note: INote;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    note,
}) => {
    const [form, setForm] = useState({
        title: note.title,
        description: note.description,
        isPaid: note.isPaid,
        price: note.price,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!form.title.trim()) {
            toast.error('Please enter a title');
            return;
        }
        if (!form.description.trim()) {
            toast.error('Please enter a description');
            return;
        }
        if (form.isPaid && (!form.price || form.price < 25)) {
            toast.error('Price must be at least 25 points for paid content');
            return;
        }

        // Create update object with only changed fields
        const updates: {
            title?: string;
            description?: string;
            isPaid?: boolean;
            price?: number;
        } = {};

        if (form.title !== note.title) updates.title = form.title;
        if (form.description !== note.description)
            updates.description = form.description;
        if (form.isPaid !== note.isPaid) updates.isPaid = form.isPaid;
        if (form.price !== note.price) updates.price = form.price;

        // Only submit if there are changes
        if (Object.keys(updates).length === 0) {
            toast.error('No changes made');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Processing your request...');

        try {
            await onSubmit(updates);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update note',
            );
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-sky-50 dark:bg-gray-900 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                        Edit Note
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='p-6 space-y-4 bg-white dark:bg-gray-800'
                >
                    {/* Title */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
                            Title *
                        </label>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                            placeholder='Enter note title'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block font-semibold text-sky-500 dark:text-sky-400 mb-1'>
                            Description *
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
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                            placeholder='Enter note description'
                            required
                        />
                    </div>

                    {/* Paid Option */}
                    <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Premium Content
                        </span>
                        <button
                            type='button'
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPaid: !prev.isPaid,
                                    price: !prev.isPaid ? 25 : 0,
                                }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.isPaid
                                    ? 'bg-violet-600'
                                    : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.isPaid
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Price Input - Only visible when isPaid is true */}
                    {form.isPaid && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Price (in Points - 5 points = 1 INR)
                            </label>
                            <div className='relative'>
                                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='number'
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                                    placeholder='25'
                                    min='25'
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex justify-end gap-3 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={
                                loading ||
                                !form.title ||
                                !form.description ||
                                (form.isPaid &&
                                    (!form.price || form.price < 25))
                            }
                            className='px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNotesModal;
