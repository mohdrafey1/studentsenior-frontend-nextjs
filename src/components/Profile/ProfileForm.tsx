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
    ShieldCheck,
} from 'lucide-react';

interface User {
    _id: string;
    username: string;
    email: string;
    college: string;
    phone: string;
    profilePicture: string;
}

interface UserState {
    currentUser: User;
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
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    // Image upload states
    const [imageUploadProgress, setImageUploadProgress] = useState<
        number | null
    >(null);
    const [imageUploadError, setImageUploadError] = useState<string | null>(
        null,
    );

    const { currentUser, loading, error } = useSelector(
        (state: { user: UserState }) => state.user,
    );

    const uploadImageToS3 = async (file: File): Promise<string> => {
        try {
            const fileName = `public/ss-profiles/${Date.now()}-${file.name.replace(
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

            if (!presignedRes.ok) throw new Error('Failed to get upload URL');

            const { uploadUrl, key } = await presignedRes.json();

            // Upload to S3
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

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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
        const loadingToast = toast.loading('Uploading image...');
        try {
            const url = await uploadImageToS3(file);
            setFormData((prev) => ({ ...prev, profilePicture: url }));
            toast.success('Image uploaded successfully, Click Update Profile');
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

        // Validate username if it's being updated
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
                toast.error(data.message);
                return;
            }

            dispatch(updateUserSuccess(data.data));
            setUpdateSuccess(true);
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
        <div
            
            
            
            className='max-w-md mx-auto bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden relative'
        >
            {/* Top Glowing Gradient Section */}
            <div className='absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-purple-600/80 opacity-90 dark:opacity-100 z-0' />

            {/* Blur overlay for top section */}
            <div className='absolute inset-x-0 top-0 h-40 backdrop-blur-[2px] z-0' />

            <div className='h-32 relative z-10'></div>

            {/* Profile Picture */}
            <div className='flex flex-col items-center -mt-16 relative z-10'>
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
                    {profileImageUrl ? (
                        <Image
                            src={profileImageUrl}
                            alt='profile'
                            width={96}
                            height={96}
                            className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover ${editMode ? 'brightness-75' : ''}`}
                        />
                    ) : (
                        <div
                            className={`w-24 h-24 rounded-full bg-gray-300 border-4 border-white dark:border-gray-800 flex items-center justify-center ${editMode ? 'brightness-75' : ''}`}
                        >
                            <User className='w-10 h-10 text-gray-500' />
                        </div>
                    )}
                    {editMode && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Camera className='w-6 h-6 text-white' />
                        </div>
                    )}
                </div>

                {/* Upload Status */}
                <div className='h-6 mt-3 text-sm text-center font-medium'>
                    {imageUploadError ? (
                        <p className='text-red-500 dark:text-red-400'>
                            {imageUploadError}
                        </p>
                    ) : imageUploadProgress !== null &&
                      imageUploadProgress < 100 ? (
                        <div className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
                            <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                            Uploading... {imageUploadProgress}%
                        </div>
                    ) : imageUploadProgress === 100 ? (
                        <p className='text-emerald-500 dark:text-emerald-400 flex items-center justify-center gap-1'>
                            <ShieldCheck className='w-4 h-4' /> Upload complete!
                        </p>
                    ) : null}
                </div>
            </div>

            {/* User Info */}
            <div className='text-center mt-1 relative z-10'>
                <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight'>
                    {formData.username || currentUser.username}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 font-medium mt-1'>
                    {currentUser.email}
                </p>
            </div>

            {/* Info Rows */}
            <div className='mt-6 px-4 relative z-10'>
                <div className='bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl p-2 space-y-1 border border-gray-100 dark:border-white/5'>
                    <div className='flex items-center p-3 text-gray-700 dark:text-gray-300 group hover:bg-white dark:hover:bg-white/5 rounded-xl transition-colors'>
                        <div className='p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg mr-4 group-hover:scale-110 transition-transform'>
                            <Phone className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <span className='font-medium text-sm'>
                            {formData.phone ||
                                currentUser.phone ||
                                'No phone added'}
                        </span>
                    </div>
                    <div className='flex items-center p-3 text-gray-700 dark:text-gray-300 group hover:bg-white dark:hover:bg-white/5 rounded-xl transition-colors'>
                        <div className='p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-4 group-hover:scale-110 transition-transform'>
                            <GraduationCap className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <span className='font-medium text-sm'>
                            {formData.college ||
                                currentUser.college ||
                                'No college added'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Button */}
            <div className='px-6 py-6 relative z-10'>
                <button
                    
                    
                    onClick={() => {
                        setEditMode(!editMode);
                        setUpdateSuccess(false);
                        setFormData({});
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                    }}
                    className='w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium py-3 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2'
                >
                    {editMode ? 'Cancel Editing' : 'Edit Profile'}
                </button>
            </div>

            {/* Edit Form */}
            
                {editMode && (
                    <form
                        
                        
                        
                        
                        onSubmit={handleSubmit}
                        className='px-6 pb-6 space-y-4 text-black dark:text-white relative z-10 overflow-hidden'
                    >
                        <div className='space-y-3'>
                            <input
                                defaultValue={currentUser.username}
                                type='text'
                                id='username'
                                placeholder='Username'
                                className='w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none'
                                onChange={handleChange}
                            />
                            <input
                                defaultValue={currentUser.college}
                                type='text'
                                id='college'
                                placeholder='College'
                                className='w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none'
                                onChange={handleChange}
                            />
                            <input
                                defaultValue={currentUser.phone}
                                type='tel'
                                id='phone'
                                placeholder='Phone'
                                className='w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none'
                                onChange={handleChange}
                            />
                            <input
                                type='password'
                                id='password'
                                placeholder='New Password (optional)'
                                className='w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none'
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            
                            
                            type='submit'
                            className='w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 text-white font-medium py-3.5 rounded-xl disabled:opacity-50 transition-all flex justify-center items-center'
                            disabled={
                                loading ||
                                (imageUploadProgress !== null &&
                                    imageUploadProgress < 100)
                            }
                        >
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Saving...
                                </div>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </form>
                )}
            

            {/* Logout */}
            <div
                onClick={onSignOut}
                className='relative z-10 m-4 rounded-xl flex items-center justify-center px-6 py-3.5 text-red-600 dark:text-red-400 font-medium cursor-pointer transition-colors bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20'
            >
                <LogOut className='w-5 h-5 mr-2' />
                <span>Sign Out</span>
            </div>

            {/* Redux/Error Messages */}
            {error && !updateSuccess && (
                <p className='text-red-500 text-sm text-center pb-6 px-6 font-medium relative z-10'>
                    {error}
                </p>
            )}
        </div>
    );
}
