'use client';

import { useEffect } from 'react';
import { api } from '@/config/apiUrls';
import { signInSuccess, signOut } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { startAuthCheck } from '@/analytics/authCheck';

export const UserInitProvider = ({
    onReady,
}: {
    onReady: (ready: boolean) => void;
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const check = startAuthCheck({
            url: api.auth.userDetail,
            signedOut: () => {
                dispatch(signOut());
            },
            signedIn: (user) => {
                dispatch(signInSuccess(user));
            },
            ready: () => onReady(true),
        });
        const resume = () => {
            if (document.visibilityState !== 'hidden') check.resume();
        };
        window.addEventListener('online', resume);
        document.addEventListener('visibilitychange', resume);
        return () => {
            check.dispose();
            window.removeEventListener('online', resume);
            document.removeEventListener('visibilitychange', resume);
        };
    }, [dispatch, onReady]);
    return null;
};
