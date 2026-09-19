'use client';
import { api } from '@/config/apiUrls';
import { ILostFoundItem } from '@/utils/interface';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    X,
    UploadCloud,
    Loader2,
    PackageSearch,
    AlertCircle,
    CheckCircle2,
    Trash2,
} from 'lucide-react';

export type LostFoundFormData = {
    title: string;
    description: string;
    type: 'lost' | 'found';
    location: string;
    date: string;
    whatsapp: string;
    imageUrl: string;
    currentStatus: 'open' | 'closed';
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
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Handle Escape Key Close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open && !loading && !imageLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, loading, imageLoading, onClose]);

    // Update image preview
    useEffect(() => {
        if (selectedImage) {
            const objectUrl = URL.createObjectURL(selectedImage);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(form.imageUrl || '');
        }
    }, [selectedImage, form.imageUrl]);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setSelectedImage(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setForm({ ...form, imageUrl: '' });
        setPreviewUrl('');
    };

    const uploadImage = async (file: File): Promise<string> => {
        try {
            const fileName = `public/ss-lostfound/${Date.now()}-${file.name.replace(
                /[^a-zA-Z0-9.-]/g,
                '',
            )}`;
            const fileType = file.type;

            // Get presigned URL
            const presignedRes = await fetch(api.aws.presignedUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!presignedRes.ok) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadUrl, key } = await presignedRes.json();

            // Upload to S3
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': fileType },
                body: file,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload image');
            }

            // Return the CloudFront URL
            return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setImageLoading(true);
            let imageUrl = form.imageUrl;

            // Upload new image if selected
            if (selectedImage) {
                const loadingToast = toast.loading('Uploading item image...');
                try {
                    imageUrl = await uploadImage(selectedImage);
                    toast.dismiss(loadingToast);
                    toast.success('Image uploaded successfully');
                } catch (error) {
                    console.error('Image upload error:', error);
                    toast.dismiss(loadingToast);
                    toast.error('Failed to upload image');
                    return;
                }
            }

            // Submit the form with the new image URL
            await onSubmit({
                ...form,
                imageUrl,
            });

            // Reset form state
            setSelectedImage(null);
            setForm({
                title: '',
                description: '',
                type: 'lost',
                location: '',
                date: new Date().toISOString().split('T')[0],
                whatsapp: '',
                imageUrl: '',
                currentStatus: 'open',
            });
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to submit form');
        } finally {
            setImageLoading(false);
        }
    };

    const isBusy = loading || imageLoading;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
            onClick={() => {
                if (!isBusy) onClose();
            }}
        >
            <div
                className='bg-white dark:bg-[#1f1f1f] text-[#101828] dark:text-[#ededed] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className='flex items-start justify-between p-5 sm:p-6 border-b border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                    <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-[#eaf3fd] dark:bg-[#183153]/70 border border-[#d2e4f9]/60 dark:border-[#224474]/60 flex items-center justify-center text-[#0075de] dark:text-[#62aef0] shrink-0'>
                            <PackageSearch className='w-5 h-5' />
                        </div>
                        <div>
                            <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white leading-tight'>
                                {editItem ? 'Edit Item' : 'Report Lost / Found Item'}
                            </h2>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-0.5'>
                                Help campus members identify and recover belongings
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isBusy}
                        aria-label='Close modal'
                        className='p-1.5 rounded-lg text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white hover:bg-[#ededeb] dark:hover:bg-[#333333] transition-colors disabled:opacity-50'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit}>
                    <div className='p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
                        {/* Type Selector (Lost vs Found) */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-2'>
                                Item Report Type <span className='text-[#e11d48]'>*</span>
                            </label>
                            <div className='grid grid-cols-2 gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setForm({ ...form, type: 'lost' })}
                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                                        form.type === 'lost'
                                            ? 'bg-[#fdf2f2] dark:bg-[#3b1118] border-[#fecdd3] dark:border-[#5c2328] text-[#e11d48] dark:text-[#fb7185] ring-2 ring-[#e11d48]/20'
                                            : 'bg-[#faf9f8] dark:bg-[#181818] border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a] hover:bg-[#f0eee6]'
                                    }`}
                                >
                                    <AlertCircle className='w-4 h-4' />
                                    <span>I Lost Something</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setForm({ ...form, type: 'found' })}
                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                                        form.type === 'found'
                                            ? 'bg-[#eaf7ec] dark:bg-[#163821] border-[#d2f0d9] dark:border-[#205130] text-[#1aae39] dark:text-[#4ade80] ring-2 ring-[#1aae39]/20'
                                            : 'bg-[#faf9f8] dark:bg-[#181818] border-[#e6e6e6] dark:border-[#2f2f2f] text-[#615d59] dark:text-[#a09e9a] hover:bg-[#f0eee6]'
                                    }`}
                                >
                                    <CheckCircle2 className='w-4 h-4' />
                                    <span>I Found Something</span>
                                </button>
                            </div>
                        </div>

                        {/* Status (when editing) */}
                        {editItem && (
                            <div>
                                <label
                                    htmlFor='item-status'
                                    className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                                >
                                    Resolution Status
                                </label>
                                <select
                                    id='item-status'
                                    name='currentStatus'
                                    value={form.currentStatus}
                                    onChange={handleChange}
                                    className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all cursor-pointer'
                                >
                                    <option value='open'>Active (Still searching / unclaimed)</option>
                                    <option value='closed'>Resolved (Returned to owner)</option>
                                </select>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label
                                htmlFor='item-title'
                                className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                            >
                                Item Title <span className='text-[#e11d48]'>*</span>
                            </label>
                            <input
                                type='text'
                                id='item-title'
                                name='title'
                                placeholder='e.g., Blue Fastrack Watch, Dell Laptop Charger'
                                value={form.title}
                                onChange={handleChange}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                required
                                minLength={2}
                                maxLength={200}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor='item-description'
                                className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                            >
                                Detailed Description <span className='text-[#e11d48]'>*</span>
                            </label>
                            <textarea
                                id='item-description'
                                name='description'
                                placeholder='Describe unique identifiers, color, model, specific marks, or circumstances...'
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all resize-none'
                                required
                                minLength={10}
                                maxLength={2000}
                            />
                        </div>

                        {/* Location & Date */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label
                                    htmlFor='item-location'
                                    className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                                >
                                    Location <span className='text-[#e11d48]'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='item-location'
                                    name='location'
                                    placeholder='e.g., Central Library, 2nd Floor'
                                    value={form.location}
                                    onChange={handleChange}
                                    className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='item-date'
                                    className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                                >
                                    Date <span className='text-[#e11d48]'>*</span>
                                </label>
                                <input
                                    type='date'
                                    id='item-date'
                                    name='date'
                                    value={form.date}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                    required
                                />
                            </div>
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label
                                htmlFor='item-whatsapp'
                                className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'
                            >
                                WhatsApp Number for Contact <span className='text-[#e11d48]'>*</span>
                            </label>
                            <input
                                type='tel'
                                id='item-whatsapp'
                                name='whatsapp'
                                placeholder='10-digit mobile number'
                                pattern='[0-9]{10}'
                                value={form.whatsapp}
                                onChange={handleChange}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                required
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'>
                                Item Photo (Optional, Max 5MB)
                            </label>

                            {previewUrl ? (
                                <div className='relative w-full h-36 rounded-xl overflow-hidden border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#181818]'>
                                    <Image
                                        src={previewUrl}
                                        alt='Item preview'
                                        fill
                                        className='object-cover'
                                    />
                                    <button
                                        type='button'
                                        onClick={handleRemoveImage}
                                        className='absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white transition-all'
                                        title='Remove image'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            ) : (
                                <label className='flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#d0ceca] dark:border-[#383838] hover:border-[#0075de] dark:hover:border-[#62aef0] rounded-xl cursor-pointer bg-[#faf9f8] dark:bg-[#181818] hover:bg-[#f6f5f4] dark:hover:bg-[#202020] transition-colors p-4 text-center'>
                                    <UploadCloud className='w-6 h-6 text-[#8c8883] dark:text-[#787672] mb-1' />
                                    <p className='text-xs font-medium text-[#101828] dark:text-[#ededed]'>
                                        Click or drag photo here
                                    </p>
                                    <p className='text-[10px] text-[#8c8883] dark:text-[#787672]'>
                                        PNG, JPG, WEBP up to 5MB
                                    </p>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                        className='hidden'
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className='flex items-center justify-end gap-2.5 p-4 sm:p-5 border-t border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={isBusy}
                            className='px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#101828] dark:hover:text-white bg-white dark:bg-[#202020] hover:bg-[#f0eee6] dark:hover:bg-[#2b2b2b] border border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isBusy}
                            className='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0075de] hover:bg-[#0062bd] disabled:opacity-50 shadow-xs active:scale-[0.98] transition-all disabled:cursor-not-allowed'
                        >
                            {isBusy ? (
                                <>
                                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>
                                    {editItem ? 'Update Report' : 'Post Report'}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LostFoundFormModal;

