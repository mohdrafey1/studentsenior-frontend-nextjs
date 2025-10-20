'use client';

import { useEffect, useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { api } from '@/config/apiUrls';

export default function WalletBalance() {
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(api.payment.getBalance, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Use wallet.currentBalance
                setBalance(data.data?.wallet?.currentBalance ?? 0);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-700'>
                <Loader2 className='w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin' />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Loading...
                </span>
            </div>
        );
    }

    return (
        <div className='flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-700'>
            <Wallet className='w-4 h-4 text-sky-600 dark:text-sky-400' />
            <div className='flex items-baseline gap-1'>
                <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                    {balance.toLocaleString()}
                </span>
                <span className='text-xs text-gray-600 dark:text-gray-400'>
                    pts
                </span>
            </div>
        </div>
    );
}
