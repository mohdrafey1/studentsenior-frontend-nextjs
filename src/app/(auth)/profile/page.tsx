'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/config/apiUrls';
import { signOut } from '@/redux/slices/userSlice';
import { fetchUserData } from '@/redux/slices/userDataSlice';
import { ProfileForm, ProfileTabs, SignOutDialog } from '@/components/Profile';
import type { AppDispatch } from '@/redux/store';

interface UserType {
    _id: string;
    username: string;
    email: string;
    college: string;
    phone: string;
    profilePicture: string;
}

interface UserState {
    currentUser: UserType | null;
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
                toast.success('Successfully logged out');
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
            <div className='min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4'>
                <div className='text-center space-y-3'>
                    <div className='w-10 h-10 border-3 border-[#0075de] border-t-transparent rounded-full animate-spin mx-auto'></div>
                    <p className='text-xs font-semibold text-[#615d59] dark:text-[#a09e9a]'>
                        Loading profile details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className='min-h-screen bg-white dark:bg-[#191919] text-[#101828] dark:text-[#ededed]'>
            {/* Sign Out Confirmation Modal */}
            <SignOutDialog
                showDialog={showDialog}
                onClose={handleCloseDialog}
                onSignOut={handleSignOut}
                loading={loading1}
            />

            {/* Header Section */}
            <section className='relative bg-[#f6f5f4] dark:bg-[#1f1f1f] border-b border-[#e6e6e6] dark:border-[#2f2f2f] overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-10 px-4 sm:px-6 lg:px-8'>
                {/* Notion Dot Mesh */}
                <div className='absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#d0ceca_1px,transparent_1px)] [background-size:24px_24px]'></div>

                <div className='relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <div>
                        {/* Breadcrumbs Navigation */}
                        <div className='flex items-center gap-2 mb-2 text-xs font-medium text-[#615d59] dark:text-[#a09e9a]'>
                            <Link
                                href='/'
                                className='hover:text-[#0075de] dark:hover:text-[#62aef0] transition-colors'
                            >
                                Home
                            </Link>
                            <span>/</span>
                            <span className='text-[#101828] dark:text-white font-semibold'>
                                My Profile
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className='font-bold tracking-[-0.03em] leading-tight text-2xl sm:text-3xl text-[#000000] dark:text-white'>
                            Account Overview & Contributions
                        </h1>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mt-1'>
                            Manage your personal profile, track upload activity, and view reward wallet earnings.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8'>
                {/* Profile Form / Left Column */}
                <div className='lg:w-1/3 w-full'>
                    <ProfileForm onSignOut={handleSignOutClick} />
                </div>

                {/* Profile Tabs / Right Column */}
                <div className='lg:w-2/3 w-full'>
                    <ProfileTabs />
                </div>
            </div>
        </main>
    );
}
