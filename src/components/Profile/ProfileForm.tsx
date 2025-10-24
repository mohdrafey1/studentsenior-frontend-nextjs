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
    import { User, LogOut, Phone, GraduationCap, Lock, Camera } from 'lucide-react';

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
        const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
        const [imageUploadError, setImageUploadError] = useState<string | null>(null);

        const { currentUser, loading, error } = useSelector(
            (state: { user: UserState }) => state.user,
        );

       const uploadImageToS3 = async (file: File): Promise<string> => {
         try {
           const fileName = `public/ss-profiles/${Date.now()}-${file.name.replace(
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
       
           if (!presignedRes.ok) throw new Error("Failed to get upload URL");
       
           const { uploadUrl, key } = await presignedRes.json();
       
           // Upload to S3
           const uploadRes = await fetch(uploadUrl, {
             method: "PUT",
             headers: { "Content-Type": fileType },
             body: file,
           });
       
           if (!uploadRes.ok) throw new Error("Failed to upload image");
       
           return `https://dixu7g0y1r80v.cloudfront.net/${key}`;
         } catch (error) {
           console.error("Upload error:", error);
           throw new Error("Failed to upload image");
         }
       };
       
       const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;
       
         if (!file.type.startsWith("image/")) {
           toast.error("Please select an image file");
           return;
         }
       
         if (file.size > 5 * 1024 * 1024) {
           toast.error("Image size should be less than 5MB");
           return;
         }
       
         setImageLoading(true);
         const loadingToast = toast.loading("Uploading image...");
         try {
           const url = await uploadImageToS3(file);
           setFormData((prev) => ({ ...prev, profilePicture: url }));
           toast.success("Image uploaded successfully, Click Update Profile");
         } catch (error) {
           toast.error("Failed to upload image"+error);
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

        const profileImageUrl = formData.profilePicture || currentUser.profilePicture;

        return (
            <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
                {/* Top Section */}
                <div className='bg-indigo-200 dark:bg-indigo-600 h-28'></div>

                {/* Profile Picture */}
                <div className='flex flex-col items-center -mt-12'>
                    <input
                      type="file"
                      ref={fileRef}
                      hidden
                      accept="image/*"
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
                            <div className={`w-24 h-24 rounded-full bg-gray-300 border-4 border-white dark:border-gray-800 flex items-center justify-center ${editMode ? 'brightness-75' : ''}`}>
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
                    <div className='h-6 mt-2 text-sm text-center'>
                        {imageUploadError ? (
                            <p className='text-red-600'>{imageUploadError}</p>
                        ) : imageUploadProgress !== null && imageUploadProgress < 100 ? (
                            <p className='text-gray-600 dark:text-gray-300'>
                                Uploading... {imageUploadProgress}%
                            </p>
                        ) : imageUploadProgress === 100 ? (
                            <p className='text-green-600'>Upload complete!</p>
                        ) : null}
                    </div>
                </div>

                {/* User Info */}
                <div className='text-center mt-0'>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {formData.username || currentUser.username}
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {currentUser.email}
                    </p>
                </div>

                {/* Info Rows */}
                <div className='mt-4 divide-y divide-gray-200 dark:divide-gray-700'>
                    <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                        <Phone className='w-5 h-5 mr-3' />
                        <span>{formData.phone || currentUser.phone || 'No phone added'}</span>
                    </div>
                    <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                        <GraduationCap className='w-5 h-5 mr-3' />
                        <span>{formData.college || currentUser.college || 'No college added'}</span>
                    </div>
                    <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                        <Lock className='w-5 h-5 mr-3' />
                        <span>••••••••</span>
                    </div>
                </div>

                {/* Edit Button */}
                <div className='px-6 py-4'>
                    <button
                        onClick={() => {
                            setEditMode(!editMode);
                            setUpdateSuccess(false);
                            setFormData({});
                            setImageUploadError(null);
                            setImageUploadProgress(null);
                        }}
                        className='w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition'
                    >
                        {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {/* Edit Form */}
                {editMode && (
                    <form
                        onSubmit={handleSubmit}
                        className='px-6 pb-6 space-y-4 text-black dark:text-white'
                    >
                        <input
                            defaultValue={currentUser.username}
                            type='text'
                            id='username'
                            placeholder='Username'
                            className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                            onChange={handleChange}
                        />
                        <input
                            defaultValue={currentUser.college}
                            type='text'
                            id='college'
                            placeholder='College'
                            className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                            onChange={handleChange}
                        />
                        <input
                            defaultValue={currentUser.phone}
                            type='tel'
                            id='phone'
                            placeholder='Phone'
                            className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                            onChange={handleChange}
                        />
                        <input
                            type='password'
                            id='password'
                            placeholder='New Password (optional)'
                            className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                            onChange={handleChange}
                        />

                        <button
                            type='submit'
                            className='w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg disabled:opacity-50'
                            disabled={loading || (imageUploadProgress !== null && imageUploadProgress < 100)}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {/* Logout */}
                <div
                    onClick={onSignOut}
                    className='flex items-center px-6 py-4 text-red-600 dark:text-red-400 cursor-pointer border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                    <LogOut className='w-5 h-5 mr-3' />
                    <span>Log out</span>
                </div>

                {/* Redux/Error Messages */}
                {error && !updateSuccess && (
                    <p className='text-red-600 text-center pb-4'>{error}</p>
                )}
            </div>
        );
    }
