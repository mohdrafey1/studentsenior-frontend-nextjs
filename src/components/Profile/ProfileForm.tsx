'use client';

import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
} from '@/redux/slices/userSlice';
import {
    User,
    LogOut,
    Phone,
    GraduationCap,
    Camera,
    Edit3,
    Check,
    X,
} from 'lucide-react';

interface UserType {
    _id: string;
    username: string;
    email: string;
    college: string;
    phone: string;
    profilePicture: string;
}

interface UserState {
    currentUser: UserType;
    loading: boolean;
    error: string | null;
}

interface FormData {
    username?: string;
    email?: string;
    college?: string;
    phone?: string;
    password?: string;
    profilePicture?: string;
}

interface ProfileFormProps {
    onSignOut: () => void;
}

export default function ProfileForm({ onSignOut }: ProfileFormProps) {
    const dispatch = useDispatch();
    const fileRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<FormData>({});
    const [editMode, setEditMode] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    // Image upload states
    const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const { currentUser, loading } = useSelector(
        (state: { user: UserState }) => state.user,
    );

    const uploadImageToS3 = async (file: File): Promise<string> => {
        try {
            const fileName = `public/ss-profiles/${Date.now()}-${file.name.replace(
                /[^a-zA-Z0-9.-]/g,
                '',
            )}`;
            const fileType = file.type;

            const presignedRes = await fetch(api.aws.presignedUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fileName, fileType }),
            });

            if (!presignedRes.ok) throw new Error('Failed to get upload URL');

            const { uploadUrl, key } = await presignedRes.json();

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': fileType },
                body: file,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setImageLoading(true);
        const loadingToast = toast.loading('Uploading profile picture...');
        try {
            const url = await uploadImageToS3(file);
            setFormData((prev) => ({ ...prev, profilePicture: url }));
            toast.success('Image uploaded! Click Save to apply changes.');
        } catch (error) {
            toast.error('Failed to upload image' + error);
        } finally {
            setImageLoading(false);
            toast.dismiss(loadingToast);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.username !== undefined) {
            const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
            if (!usernameRegex.test(formData.username)) {
                toast.error(
                    'Username can only contain letters, numbers, _ and . (3–20 chars)',
                );
                return;
            }
        }

        if (Object.keys(formData).length === 0) {
            toast('No changes to save.');
            setEditMode(false);
            return;
        }

        try {
            dispatch(updateUserStart());
            const res = await fetch(`${api.user.update(currentUser._id)}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data));
                toast.error(data.message || 'Failed to update profile');
                return;
            }

            dispatch(updateUserSuccess(data.data));
            toast.success('🎉 Profile Updated Successfully');
            setEditMode(false);
            setFormData({});
            setImageUploadProgress(null);
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error('Something went wrong!');
        }
    };

    const profileImageUrl =
        formData.profilePicture || currentUser.profilePicture;

    return (
        <div className='bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden'>
            {/* Header Banner with Notion Mesh */}
            <div className='relative bg-[#f6f5f4] dark:bg-[#222222] border-b border-[#e6e6e6] dark:border-[#2f2f2f] pt-8 pb-12 px-6 overflow-hidden'>
                <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:16px_16px]'></div>
            </div>

            {/* Profile Avatar & Identity */}
            <div className='flex flex-col items-center -mt-10 relative px-6'>
                <input
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                    onChange={handleImageChange}
                    disabled={imageLoading}
                />
                <div
                    className='relative group cursor-pointer'
                    onClick={() => editMode && fileRef.current?.click()}
                    title={editMode ? 'Click to change photo' : ''}
                >
                    <div className='relative'>
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt='profile'
                                width={80}
                                height={80}
                                className={`w-20 h-20 rounded-full border-4 border-white dark:border-[#1c1c1c] object-cover ring-1 ring-[#e6e6e6] dark:ring-[#333] shadow-xs ${
                                    editMode ? 'brightness-75' : ''
                                }`}
                            />
                        ) : (
                            <div
                                className={`w-20 h-20 rounded-full bg-[#f6f5f4] dark:bg-[#282828] border-4 border-white dark:border-[#1c1c1c] ring-1 ring-[#e6e6e6] dark:ring-[#333] flex items-center justify-center ${
                                    editMode ? 'brightness-75' : ''
                                }`}
                            >
                                <User className='w-8 h-8 text-[#8c8883]' />
                            </div>
                        )}
                        <span className='absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#1aae39] border-2 border-white dark:border-[#1c1c1c] rounded-full' />
                    </div>

                    {editMode && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity'>
                            <Camera className='w-5 h-5 text-white' />
                        </div>
                    )}
                </div>

                {/* Upload Status Alert */}
                {imageUploadError && (
                    <p className='text-xs text-[#e11d48] font-medium mt-2 text-center'>
                        {imageUploadError}
                    </p>
                )}

                {/* Username & Email */}
                <div className='text-center mt-3'>
                    <h2 className='text-lg font-bold text-[#101828] dark:text-white'>
                        {formData.username || currentUser.username}
                    </h2>
                    <p className='text-xs text-[#615d59] dark:text-[#a09e9a] font-medium mt-0.5'>
                        {currentUser.email}
                    </p>
                </div>
            </div>

            {/* Profile Info Details */}
            <div className='p-6 space-y-4'>
                <div className='space-y-2 text-xs'>
                    {/* College Item */}
                    <div className='flex items-center gap-3 p-3 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#f0eee6] dark:border-[#2a2a2a]'>
                        <div className='p-2 rounded-lg bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] shrink-0'>
                            <GraduationCap className='w-4 h-4' />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <span className='text-[10px] text-[#8c8883] uppercase font-bold block'>
                                College / University
                            </span>
                            <span className='text-xs font-semibold text-[#101828] dark:text-[#ededed] truncate block'>
                                {formData.college || currentUser.college || 'No college added'}
                            </span>
                        </div>
                    </div>

                    {/* Phone Item */}
                    <div className='flex items-center gap-3 p-3 rounded-xl bg-[#faf9f8] dark:bg-[#242424] border border-[#f0eee6] dark:border-[#2a2a2a]'>
                        <div className='p-2 rounded-lg bg-[#eaf7ec] dark:bg-[#163821] text-[#1aae39] dark:text-[#4ade80] shrink-0'>
                            <Phone className='w-4 h-4' />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <span className='text-[10px] text-[#8c8883] uppercase font-bold block'>
                                Phone Number
                            </span>
                            <span className='text-xs font-semibold text-[#101828] dark:text-[#ededed] truncate block'>
                                {formData.phone || currentUser.phone || 'No phone added'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                <button
                    onClick={() => {
                        setEditMode(!editMode);
                        setFormData({});
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] ${
                        editMode
                            ? 'bg-[#f6f5f4] dark:bg-[#282828] text-[#615d59] dark:text-[#a09e9a] border border-[#e6e6e6] dark:border-[#383838]'
                            : 'bg-[#0075de] hover:bg-[#0062bd] text-white'
                    }`}
                >
                    {editMode ? (
                        <>
                            <X className='w-3.5 h-3.5' />
                            <span>Cancel Editing</span>
                        </>
                    ) : (
                        <>
                            <Edit3 className='w-3.5 h-3.5' />
                            <span>Edit Profile</span>
                        </>
                    )}
                </button>

                {/* Edit Form Accordion */}
                {editMode && (
                    <form onSubmit={handleSubmit} className='space-y-3 pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a] animate-in fade-in duration-200'>
                        <div>
                            <label className='block text-[11px] font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                Username
                            </label>
                            <input
                                defaultValue={currentUser.username}
                                type='text'
                                id='username'
                                placeholder='Username'
                                className='w-full px-3 py-2 text-xs bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-[11px] font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                College / University
                            </label>
                            <input
                                defaultValue={currentUser.college}
                                type='text'
                                id='college'
                                placeholder='College'
                                className='w-full px-3 py-2 text-xs bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-[11px] font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                Phone Number
                            </label>
                            <input
                                defaultValue={currentUser.phone}
                                type='tel'
                                id='phone'
                                placeholder='Phone number'
                                className='w-full px-3 py-2 text-xs bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='block text-[11px] font-semibold text-[#615d59] dark:text-[#a09e9a] mb-1'>
                                New Password (Optional)
                            </label>
                            <input
                                type='password'
                                id='password'
                                placeholder='••••••••'
                                className='w-full px-3 py-2 text-xs bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] rounded-xl focus:outline-none focus:border-[#0075de] transition-all'
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading || (imageUploadProgress !== null && imageUploadProgress < 100)}
                            className='w-full py-2.5 px-4 bg-[#1aae39] hover:bg-[#169430] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] disabled:opacity-50'
                        >
                            {loading ? (
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            ) : (
                                <>
                                    <Check className='w-3.5 h-3.5' />
                                    <span>Save Profile Changes</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Sign Out Button */}
                <div className='pt-2 border-t border-[#f0eee9] dark:border-[#2a2a2a]'>
                    <button
                        onClick={onSignOut}
                        className='w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-[#e11d48] dark:text-[#fb7185] bg-[#fdf2f2] dark:bg-[#3b1118] hover:bg-[#fbdada] dark:hover:bg-[#4d1721] border border-[#fcdada] dark:border-[#601925] transition-all flex items-center justify-center gap-2 active:scale-[0.98]'
                    >
                        <LogOut className='w-4 h-4' />
                        <span>Sign Out of Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
