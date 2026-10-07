'use client';

import { useEffect } from 'react';
import { api } from '@/config/apiUrls';
import { signInSuccess, signOut } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

export const UserInitProvider = ({
    onReady,
}: {
    onReady: (ready: boolean) => void;
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        let settled = false;
        let pending = false;
        let disposed = false;
        let retry: ReturnType<typeof setTimeout>;
        const controller = new AbortController();
        const fetchUser = async () => {
            if (settled || pending || disposed) return;
            pending = true;
            try {
                const response = await fetch(api.auth.userDetail, {
                    method: 'GET',
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        settled = true;
                        dispatch(signOut());
                        onReady(true);
                        return;
                    }
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                if (disposed) return;
                settled = true;
                dispatch(signInSuccess(userData));
                onReady(true);
            } catch (error) {
                if (disposed) return;
                console.error('Error fetching user:', error);
                retry = setTimeout(() => {
                    void fetchUser();
                }, 30000);
                // Keep a valid local session on network/server outages.
            } finally {
                pending = false;
            }
        };

        void fetchUser();
        const resume = () => {
            if (document.visibilityState !== 'hidden') void fetchUser();
        };
        window.addEventListener('online', resume);
        document.addEventListener('visibilitychange', resume);
        return () => {
            disposed = true;
            controller.abort();
            clearTimeout(retry);
            window.removeEventListener('online', resume);
            document.removeEventListener('visibilitychange', resume);
        };
    }, [dispatch, onReady]);

    return null;
};
