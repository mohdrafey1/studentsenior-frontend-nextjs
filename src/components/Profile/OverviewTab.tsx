import { UserDataState } from '@/redux/slices/userDataSlice';
import Link from 'next/link';
import {
    Coins,
    Wallet,
    CreditCard,
    PackageSearch,
    ArrowRight,
} from 'lucide-react';

interface OverviewTabProps {
    data: UserDataState;
}

export default function OverviewTab({ data }: OverviewTabProps) {
    const stats = [
        {
            title: 'Total Earned Points',
            value: data.wallet.totalEarning,
            icon: Coins,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/40',
        },
        {
            title: 'Remaining Balance',
            value: data.wallet.currentBalance,
            icon: Wallet,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
        },
        {
            title: 'Total Redeemed',
            value: data.wallet.totalWithdrawal,
            icon: CreditCard,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/40',
        },
        {
            title: 'Total Items Added By You',
            value:
                (data.userProductAdd?.length || 0) +
                (data.userPyqAdd?.length || 0) +
                (data.userNoteAdd?.length || 0),
            icon: PackageSearch,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/40',
        },
    ];

    return (
        <div className='flex flex-col h-full space-y-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className='bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200'
                    >
                        {/* Decorative background circle */}
                        <div
                            className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bgColor} blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                        />

                        <div className='relative z-10 flex flex-col justify-between h-full space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div
                                    className={`p-3 rounded-xl ${stat.bgColor}`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.color}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                    {stat.title}
                                </h3>
                                <p
                                    className={`text-3xl font-bold ${stat.color} tracking-tight`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-center sm:justify-end mt-4'>
                <Link prefetch={false} href='/wallet'>
                    <button className='group flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95'>
                        Go to Wallet Page
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300' />
                    </button>
                </Link>
            </div>
        </div>
    );
}
