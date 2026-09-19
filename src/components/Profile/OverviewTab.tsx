import { UserDataState } from '@/redux/slices/userDataSlice';
import Link from 'next/link';
import {
    Coins,
    Wallet,
    CreditCard,
    PackageSearch,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';

interface OverviewTabProps {
    data: UserDataState;
}

export default function OverviewTab({ data }: OverviewTabProps) {
    const stats = [
        {
            title: 'Total Earned Points',
            value: data.wallet?.totalEarning || 0,
            icon: Coins,
            color: 'text-[#0075de] dark:text-[#62aef0]',
            badgeColor: 'bg-[#eaf3fd] dark:bg-[#183153] border-[#d2e4f9] dark:border-[#224474]',
            iconBg: 'bg-[#eaf3fd] dark:bg-[#183153]/60',
            unit: 'pts',
        },
        {
            title: 'Remaining Balance',
            value: data.wallet?.currentBalance || 0,
            icon: Wallet,
            color: 'text-[#1aae39] dark:text-[#4ade80]',
            badgeColor: 'bg-[#eaf7ec] dark:bg-[#163821] border-[#d2f0d9] dark:border-[#205130]',
            iconBg: 'bg-[#eaf7ec] dark:bg-[#163821]/60',
            unit: 'pts',
        },
        {
            title: 'Total Redeemed',
            value: data.wallet?.totalWithdrawal || 0,
            icon: CreditCard,
            color: 'text-[#8a3fd6] dark:text-[#c084fc]',
            badgeColor: 'bg-[#f0ebf8] dark:bg-[#2b1f3d] border-[#e2d5f3] dark:border-[#3e2b58]',
            iconBg: 'bg-[#f0ebf8] dark:bg-[#2b1f3d]/60',
            unit: 'pts',
        },
        {
            title: 'Total Contributions',
            value:
                (data.userProductAdd?.length || 0) +
                (data.userPyqAdd?.length || 0) +
                (data.userNoteAdd?.length || 0),
            icon: PackageSearch,
            color: 'text-[#dd5b00] dark:text-[#fb923c]',
            badgeColor: 'bg-[#fdf1e8] dark:bg-[#3d2411] border-[#fbd8c1] dark:border-[#583318]',
            iconBg: 'bg-[#fdf1e8] dark:bg-[#3d2411]/60',
            unit: 'items',
        },
    ];

    return (
        <div className='flex flex-col space-y-6'>
            {/* 4-Stat Metric Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className='p-4 sm:p-5 rounded-2xl bg-[#faf9f8] dark:bg-[#242424] border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#0075de]/40 dark:hover:border-[#62aef0]/40'
                        >
                            <div className='space-y-1'>
                                <span className='text-xs font-semibold text-[#615d59] dark:text-[#a09e9a] uppercase tracking-wider block'>
                                    {stat.title}
                                </span>
                                <div className='flex items-baseline gap-1.5'>
                                    <span className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.color}`}>
                                        {stat.value}
                                    </span>
                                    <span className='text-xs font-semibold text-[#8c8883]'>
                                        {stat.unit}
                                    </span>
                                </div>
                            </div>

                            <div className={`p-3 rounded-xl border ${stat.badgeColor} ${stat.iconBg} ${stat.color} shrink-0`}>
                                <Icon className='w-5 h-5' />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Wallet Action CTA Banner */}
            <div className='p-4 sm:p-5 rounded-2xl bg-[#f6f5f4] dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-center justify-between gap-4'>
                <div className='space-y-1 text-center sm:text-left'>
                    <h3 className='font-bold text-[#101828] dark:text-white text-sm'>
                        Ready to withdraw or redeem points?
                    </h3>
                    <p className='text-xs text-[#615d59] dark:text-[#a09e9a]'>
                        Check your full transaction history, UPI payout requests, and refer-and-earn rewards.
                    </p>
                </div>

                <Link prefetch={false} href='/wallet'>
                    <button className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'>
                        <span>Go to Wallet</span>
                        <ArrowRight className='w-4 h-4' />
                    </button>
                </Link>
            </div>
        </div>
    );
}
