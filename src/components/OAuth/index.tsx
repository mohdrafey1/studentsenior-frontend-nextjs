'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '@/utils/firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '@/redux/slices/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { api, API_KEY } from '@/config/apiUrls';
import { Loader2 } from 'lucide-react';

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

            if (data.success === false) {
                toast.error(data.message || 'Google sign-in failed');
                return;
            }

            dispatch(signInSuccess(data.data || data));
            toast.success('Signed in with Google successfully');

            // Read "from" param from query string, fallback to "/"
            const from = searchParams.get('from') || '/';
            router.replace(from);
        } catch (error) {
            console.error('Could not login with Google', error);
            toast.error('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type='button'
            onClick={handleGoogleClick}
            disabled={loading}
            className='w-full inline-flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white dark:bg-[#262626] hover:bg-[#f6f5f4] dark:hover:bg-[#303030] text-[#31302e] dark:text-[#f0f0f0] border border-[#e6e6e6] dark:border-[#383838] text-xs sm:text-sm font-medium transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed'
        >
            {loading ? (
                <Loader2 className='w-4 h-4 text-[#0075de] animate-spin' />
            ) : (
                <svg className='w-4 h-4' viewBox='0 0 24 24'>
                    <path
                        fill='#4285F4'
                        d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z'
                    />
                    <path
                        fill='#34A853'
                        d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z'
                    />
                    <path
                        fill='#FBBC05'
                        d='M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z'
                    />
                    <path
                        fill='#EA4335'
                        d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z'
                    />
                </svg>
            )}
            <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
        </button>
    );
}
