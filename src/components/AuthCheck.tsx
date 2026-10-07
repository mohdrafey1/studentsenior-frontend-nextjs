'use client';

import { useEffect } from 'react';
import { api } from '@/config/apiUrls';
import { signInSuccess, signOut } from '@/redux/slices/userSlice';
import { useDispatch, useStore } from 'react-redux';
import type { RootState } from '@/redux/store';
import { startAuthCheck, watchAuthChanges } from '@/analytics/authCheck';

export const UserInitProvider = ({
    onReady,
}: {
    onReady: (ready: boolean) => void;
}) => {
    const dispatch = useDispatch();
    const store = useStore<RootState>();
    useEffect(() => {
        const auth = watchAuthChanges(store);
        const check = startAuthCheck({
            url: api.auth.userDetail,
            authRevision: auth.revision,
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
            auth.unsubscribe();
            window.removeEventListener('online', resume);
            document.removeEventListener('visibilitychange', resume);
        };
    }, [dispatch, onReady, store]);
    return null;
};
