'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '@/utils/firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '@/redux/slices/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, API_KEY } from '@/config/apiUrls';

export default function OAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const handleGoogleClick = async () => {
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch(api.auth.google, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY || '',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();

            dispatch(signInSuccess(data));
            toast.success('Log in successful');

            // Read "from" param from query string, fallback to "/"
            const from = searchParams.get('from') || '/';
            router.replace(from);
        } catch (error) {
            console.error('Could not login with Google', error);
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='cursor-pointer'>
            <button
                onClick={handleGoogleClick}
                disabled={loading}
                className='text-center bg-red-200 p-2 rounded-3xl mx-4 w-full flex justify-center items-center'
            >
                {loading ? (
                    <svg
                        className='animate-spin h-5 w-5 mr-3 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        aria-label='loading spinner'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                        />
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                        />
                    </svg>
                ) : (
                    <i className='fa-brands fa-google text-sky-500 text-xl'></i>
                )}
                {loading ? 'Logging in...' : 'Sign in with Google'}
            </button>
        </div>
    );
}
