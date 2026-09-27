'use client';

import { useEffect } from 'react';
import { api } from '@/config/apiUrls';
import { signInSuccess, signOut } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';

export const UserInitProvider = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(api.auth.userDetail, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) dispatch(signOut());
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                dispatch(signInSuccess(userData));
            } catch (error) {
                console.error('Error fetching user:', error);
                // Keep a valid local session on network/server outages.
            }
        };

        fetchUser();
    }, [dispatch]);

    return null;
};
