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
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white overflow-y-auto dark:bg-[#191919] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                {/* Header */}
                <div className='flex items-center justify-between p-5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] sticky top-0 bg-white dark:bg-[#191919] z-10'>
                    <h2 className='text-lg font-bold text-[#101828] dark:text-[#ededed]'>
                        Edit Note
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#282828]'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className='overflow-y-auto p-5 space-y-5 bg-white dark:bg-[#191919]'
                >
                    {/* Title */}
                    <div>
                        <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Title <span className='text-red-500'>*</span>
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
                            className='w-full px-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                            placeholder='Enter note title'
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                            Description <span className='text-red-500'>*</span>
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
                            className='w-full px-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                            placeholder='Enter note description'
                            required
                        />
                    </div>

                    <div className='h-px w-full bg-[#f0eee9] dark:bg-[#2a2a2a] my-2' />

                    {/* Paid Option */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <span className='block text-sm font-semibold text-[#101828] dark:text-[#ededed]'>
                                Premium Content
                            </span>
                            <span className='text-xs text-[#8c8883] dark:text-[#787672]'>
                                Charge points for downloading
                            </span>
                        </div>
                        <button
                            type='button'
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isPaid: !prev.isPaid,
                                    price: !prev.isPaid ? 25 : 0,
                                }))
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                form.isPaid
                                    ? 'bg-[#d97706]'
                                    : 'bg-[#d0ceca] dark:bg-[#383838]'
                            }`}
                        >
                            <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                    form.isPaid
                                        ? 'translate-x-4.5'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Price Input - Only visible when isPaid is true */}
                    {form.isPaid && (
                        <div className='pt-2'>
                            <label className='block text-xs font-semibold text-[#101828] dark:text-[#ededed] mb-1.5'>
                                Price (in Points - 5 points = ₹1)
                            </label>
                            <div className='relative'>
                                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8c8883] dark:text-[#787672]' />
                                <input
                                    type='number'
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    className='w-full pl-9 pr-3 py-2 text-sm border border-[#e6e6e6] dark:border-[#383838] rounded-lg bg-[#fcfbf9] dark:bg-[#202020] text-[#101828] dark:text-[#ededed] focus:ring-1 focus:ring-[#0075de] focus:border-[#0075de] outline-none transition-all shadow-xs'
                                    placeholder='25'
                                    min='25'
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className='flex justify-end gap-2.5 pt-6 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-[#101828] dark:text-[#ededed] bg-white dark:bg-[#191919] border border-[#e6e6e6] dark:border-[#383838] rounded-lg hover:bg-[#f6f5f4] dark:hover:bg-[#282828] transition-colors duration-200 shadow-xs'
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
                            className='px-4 py-2 text-sm font-semibold text-white bg-[#0075de] rounded-lg hover:bg-[#0062bd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-xs active:scale-[0.98]'
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
