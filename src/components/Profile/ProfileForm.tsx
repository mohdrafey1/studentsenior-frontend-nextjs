'use client';

import { useRef, useState } from 'react';
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
    Moon,
    User,
    Settings,
    LogOut,
    Phone,
    Mail,
    GraduationCap,
    Lock,
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
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    const { currentUser, loading, error } = useSelector(
        (state: { user: UserState }) => state.user
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`${api.user.update(currentUser._id)}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data));
                toast.error(data.message);
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            toast.success('Profile Updated Successfully');
            setEditMode(false);
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error('Something Went Wrong');
        }
    };

    return (
        <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
            {/* Top Section */}
            <div className='bg-indigo-200 dark:bg-indigo-600 h-28'></div>
            <div className='flex justify-center -mt-12'>
                {currentUser.profilePicture ? (
                    <Image
                        src={currentUser.profilePicture}
                        alt='profile'
                        width={100}
                        height={100}
                        className='w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover'
                    />
                ) : (
                    <div className='w-24 h-24 rounded-full bg-gray-300 border-4 border-white dark:border-gray-800 flex items-center justify-center'>
                        <User className='w-10 h-10 text-gray-500' />
                    </div>
                )}
            </div>
            <div className='text-center mt-2'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {currentUser.username}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {currentUser.email}
                </p>
            </div>

            {/* Info Rows */}
            <div className='mt-4 divide-y divide-gray-200 dark:divide-gray-700'>
                <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                    <Phone className='w-5 h-5 mr-3' />
                    <span>{currentUser.phone || 'No phone added'}</span>
                </div>
                <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                    <GraduationCap className='w-5 h-5 mr-3' />
                    <span>{currentUser.college || 'No college added'}</span>
                </div>
                <div className='flex items-center px-6 py-4 text-gray-700 dark:text-gray-300'>
                    <Lock className='w-5 h-5 mr-3' />
                    <span>••••••••</span>
                </div>
            </div>

            {/* Toggle Edit */}
            <div className='px-6 py-4'>
                <button
                    onClick={() => setEditMode(!editMode)}
                    className='w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition'
                >
                    {editMode ? 'Hide Form' : 'Edit Profile'}
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
                        type={passwordShown ? 'text' : 'password'}
                        id='password'
                        placeholder='Password'
                        className='w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                        onChange={handleChange}
                    />

                    <button
                        type='submit'
                        className='w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg'
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            )}

            {/* Logout Row */}
            <div
                onClick={onSignOut}
                className='flex items-center px-6 py-4 text-red-600 dark:text-red-400 cursor-pointer border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            >
                <LogOut className='w-5 h-5 mr-3' />
                <span>Log out</span>
            </div>

            {/* Status Messages */}
            {error && <p className='text-red-600 text-center mt-2'>{error}</p>}
            {updateSuccess && (
                <p className='text-green-600 text-center mt-2'>
                    Profile updated!
                </p>
            )}
        </div>
    );
}
