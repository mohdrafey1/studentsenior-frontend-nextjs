'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import { signOut } from '@/redux/slices/userSlice';
import { fetchUserData } from '@/redux/slices/userDataSlice';
import { ProfileForm, ProfileTabs, SignOutDialog } from '@/components/Profile';
import type { AppDispatch } from '@/redux/store';

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

export default function Profile() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading1, setLoading1] = useState<boolean>(false);

    const { currentUser } = useSelector(
        (state: { user: UserState }) => state.user,
    );

    useEffect(() => {
        // Redirect to sign-in if not logged in
        if (!currentUser) {
            router.push('/sign-in?from=/profile');
            return;
        }
        dispatch(fetchUserData());
    }, [dispatch, currentUser, router]);

    const handleSignOut = async () => {
        try {
            setLoading1(true);
            const response = await fetch(`${api.auth.signout}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(signOut());
                setLoading1(false);
                toast.success('You are Logout Now');
                router.push('/sign-in');
            } else {
                console.error('Signout failed:', response);
                toast.error('Signout failed');
            }
        } catch (error) {
            console.error('Signout error:', error);
            toast.error('Signout error');
        } finally {
            setLoading1(false);
        }
    };

    const handleSignOutClick = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    if (!currentUser) {
        return (
            <div className='min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
            {/* Sign Out Dialog */}
            <SignOutDialog
                showDialog={showDialog}
                onClose={handleCloseDialog}
                onSignOut={handleSignOut}
                loading={loading1}
            />

            <div className='flex flex-col lg:flex-row'>
                {/* Profile Form Section */}
                <div className='lg:w-1/3 p-6'>
                    <ProfileForm onSignOut={handleSignOutClick} />
                </div>

                {/* Profile Details Section with Tabs */}
                <div className='lg:w-2/3 p-6 overflow-auto'>
                    <ProfileTabs />
                </div>
            </div>
        </div>
    );
}
