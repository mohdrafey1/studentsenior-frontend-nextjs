'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    Wallet,
    ArrowDownToLine,
    PlusCircle,
    TrendingUp,
    Receipt,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
    CreditCard,
    Sparkles,
    Search,
    IndianRupee,
} from 'lucide-react';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Load the Razorpay checkout script dynamically
 */
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

type ObjId = { _id: string };
type Txn = {
    _id: string;
    type: 'earn' | 'spend' | 'add' | 'redeem' | 'refund' | 'bonus' | 'sale';
    points: number;
    balanceAfter: number;
    orderId?: string | ObjId;
    paymentId?: string | ObjId;
    resourceType?: 'pyq' | 'notes';
    resourceId?: string;
    description?: string;
    createdAt?: string;
};

type Redemption = {
    _id: string;
    upiId: string;
    rewardBalance: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    rejectionReason?: string;
    createdAt?: string;
};

const isObjId = (v: unknown): v is ObjId =>
    !!v &&
    typeof v === 'object' &&
    '_id' in (v as Record<string, unknown>) &&
    typeof (v as Record<string, unknown>)['_id'] === 'string';

const asId = (v: unknown) => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (isObjId(v)) return v._id;
    return '';
};

export default function WalletPage() {
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.user);

    const [wallet, setWallet] = useState<{
        currentBalance: number;
        totalEarning: number;
        totalWithdrawal: number;
    }>({
        currentBalance: 0,
        totalEarning: 0,
        totalWithdrawal: 0,
    });
    const [txns, setTxns] = useState<Txn[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [redemptions, setRedemptions] = useState<Redemption[]>([]);

    // Modal and form states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [addPoints, setAddPoints] = useState<number>(500);
    const [addRupees, setAddRupees] = useState<number>(Math.ceil(500 / 5));
    const [withdrawUpiId, setWithdrawUpiId] = useState<string>('');
    const [withdrawPoints, setWithdrawPoints] = useState<number>(500);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Transaction filters and pagination
    const [type, setType] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Withdrawal requests filters and pagination
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [redemptionPage, setRedemptionPage] = useState(1);
    const [redemptionPageSize, setRedemptionPageSize] = useState(10);

    // Tab state
    const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>('transactions');

    const filtered = useMemo(() => {
        return txns.filter((t) => {
            const matchesType = !type || t.type === type;
            const ref = asId(t.orderId) || asId(t.paymentId) || t.description || '';
            const matchesSearch =
                !searchQuery ||
                ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.type.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [txns, type, searchQuery]);

    const start = (page - 1) * pageSize;
    const current = filtered.slice(start, start + pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;

    // Filter and paginate redemptions
    const filteredRedemptions = useMemo(() => {
        return redemptions.filter(
            (r) => !statusFilter || r.status.toLowerCase() === statusFilter.toLowerCase(),
        );
    }, [redemptions, statusFilter]);

    const redemptionStart = (redemptionPage - 1) * redemptionPageSize;
    const currentRedemptions = filteredRedemptions.slice(
        redemptionStart,
        redemptionStart + redemptionPageSize,
    );
    const totalRedemptionPages =
        Math.ceil(filteredRedemptions.length / redemptionPageSize) || 1;

    const fetchAll = async (isManualRefresh = false) => {
        try {
            setError('');
            if (isManualRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            const [bRes, tRes, rRes] = await Promise.all([
                fetch(`${API_BASE}/payment/wallet/balance`, {
                    credentials: 'include',
                }),
                fetch(`${API_BASE}/payment/wallet/transactions?limit=200`, {
                    credentials: 'include',
                }),
                fetch(`${API_BASE}/payment/wallet/redeem`, {
                    credentials: 'include',
                }),
            ]);
            if (!bRes.ok) throw new Error('Failed to load balance');
            if (!tRes.ok) throw new Error('Failed to load transactions');
            if (!rRes.ok) throw new Error('Failed to load withdrawal requests');

            const bData = await bRes.json();
            const tData = await tRes.json();

            setWallet(bData?.data?.wallet ?? { currentBalance: 0, totalEarning: 0, totalWithdrawal: 0 });
            setTxns(tData?.data?.transactions || tData?.data || []);

            const rData = await rRes.json();
            setRedemptions(rData?.data || []);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Failed to load wallet';
            setError(msg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            router.push('/sign-in?from=/wallet');
            return;
        }
        fetchAll();
    }, [currentUser, router]);

    // Sync rupees with addPoints (5 pts = ₹1)
    useEffect(() => {
        setAddRupees(Math.ceil((addPoints || 0) / 5));
    }, [addPoints]);

    const handleAddPointsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (addPoints < 500 || addPoints > 100000) {
            setError('Points must be between 500 and 100,000');
            return;
        }
        setSubmitting(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error(
                    'Failed to load Razorpay checkout. Please check your internet connection.',
                );
            }

            const returnUrl = `${window.location.origin}/wallet`;
            const createRes = await fetch(`${API_BASE}/payment/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    orderType: 'add_points',
                    paymentMethod: 'online',
                    amount: addRupees,
                    returnUrl,
                    metadata: { pointsToAdd: addPoints },
                }),
            });
            if (!createRes.ok) {
                const msg =
                    (await createRes.json().catch(() => ({}))).message ||
                    'Failed to create payment order';
                throw new Error(msg);
            }
            const orderData = await createRes.json();
            const orderId = orderData?.data?.orderId || orderData?.orderId;
            if (!orderId) throw new Error('Order was not created');

            const payRes = await fetch(`${API_BASE}/payment/pay/online`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    orderId,
                    gateway: 'razorpay',
                    returnUrl,
                }),
            });
            if (!payRes.ok) {
                const msg =
                    (await payRes.json().catch(() => ({}))).message ||
                    'Failed to initiate payment gateway';
                throw new Error(msg);
            }
            const payData = await payRes.json();
            const {
                razorpayOrderId,
                razorpayKeyId,
                amount: amountInPaise,
                currency,
            } = payData.data;

            setShowAddModal(false);

            const razorpayOptions = {
                key: razorpayKeyId,
                amount: amountInPaise,
                currency: currency || 'INR',
                name: 'StudentSenior',
                description: `Add ${addPoints.toLocaleString()} points to wallet`,
                order_id: razorpayOrderId,
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        const verifyRes = await fetch(
                            `${API_BASE}/payment/pay/verify`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                }),
                            },
                        );

                        if (!verifyRes.ok) {
                            throw new Error('Payment verification failed');
                        }

                        setMessage(
                            `Success! Added ${addPoints.toLocaleString()} points to your wallet.`,
                        );
                        fetchAll(true);
                    } catch (err) {
                        console.error('Verification error:', err);
                        setError(
                            'Payment was charged but automatic verification failed. Please contact support.',
                        );
                    } finally {
                        setSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setSubmitting(false);
                    },
                },
                theme: {
                    color: '#0075de',
                },
            };

            const rzp = new window.Razorpay(razorpayOptions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rzp.on('payment.failed', (response: any) => {
                setError(
                    response.error?.description ||
                        'Payment failed or was cancelled. Please try again.',
                );
                setSubmitting(false);
            });
            rzp.open();
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Something went wrong';
            setError(msg);
            setSubmitting(false);
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const pts = Number(withdrawPoints || 0);
        if (!withdrawUpiId || !/^[\w.\-]+@[\w\-]+$/.test(withdrawUpiId)) {
            setError('Please enter a valid UPI ID (e.g. username@okhdfcbank)');
            return;
        }
        if (pts < 500) {
            setError('Minimum withdrawal is 500 points (₹100)');
            return;
        }
        if (pts > wallet.currentBalance) {
            setError('Insufficient wallet points');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/payment/wallet/redeem`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upiId: withdrawUpiId, points: pts }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(
                    data?.message || 'Failed to submit withdrawal request',
                );
            }
            setMessage(
                `Withdrawal request for ₹${Math.floor(pts / 5)} submitted successfully.`,
            );
            setWithdrawUpiId('');
            setWithdrawPoints(500);
            setShowWithdrawModal(false);
            fetchAll(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    const getTypeBadge = (txnType: Txn['type']) => {
        switch (txnType) {
            case 'add':
                return {
                    label: 'Added',
                    classes:
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
                    icon: PlusCircle,
                };
            case 'earn':
                return {
                    label: 'Earned',
                    classes:
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
                    icon: TrendingUp,
                };
            case 'sale':
                return {
                    label: 'Sale',
                    classes:
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
                    icon: ArrowUpRight,
                };
            case 'bonus':
                return {
                    label: 'Bonus',
                    classes:
                        'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
                    icon: Sparkles,
                };
            case 'refund':
                return {
                    label: 'Refund',
                    classes:
                        'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
                    icon: ArrowDownLeft,
                };
            case 'redeem':
                return {
                    label: 'Withdrawal',
                    classes:
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
                    icon: ArrowDownToLine,
                };
            case 'spend':
            default:
                return {
                    label: 'Spent',
                    classes:
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
                    icon: Receipt,
                };
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'approved') {
            return (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'>
                    <CheckCircle2 className='w-3 h-3' />
                    Approved
                </span>
            );
        }
        if (s === 'rejected') {
            return (
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'>
                    <XCircle className='w-3 h-3' />
                    Rejected
                </span>
            );
        }
        return (
            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'>
                <Clock className='w-3 h-3' />
                Pending
            </span>
        );
    };

    return (
        <div className='min-h-screen bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] transition-colors pb-8'>
            <div className='max-w-5xl mx-auto px-3 sm:px-4 pt-4'>
                {/* Compact Header & Action Bar */}
                <div className='flex items-center justify-between gap-3 pb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f] mb-3'>
                    <div className='flex items-center gap-2.5'>
                        <div className='w-8 h-8 rounded-lg bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20 flex items-center justify-center border border-[#0075de]/20 shrink-0'>
                            <Wallet className='w-4 h-4' />
                        </div>
                        <div>
                            <h1 className='text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2 leading-none'>
                                <span>My Wallet</span>
                            </h1>
                            <span className='text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                Manage points & instant payouts
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => fetchAll(true)}
                            disabled={refreshing || loading}
                            title='Refresh wallet data'
                            className='p-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-[#ececec] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] transition-all disabled:opacity-50'
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0075de]' : ''}`}
                            />
                        </button>

                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] text-[#191919] dark:text-[#ececec] shadow-2xs transition-all'
                        >
                            <ArrowDownToLine className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                            <span>Withdraw</span>
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0075de] hover:bg-[#0060b9] text-white shadow-2xs transition-all'
                        >
                            <PlusCircle className='w-3.5 h-3.5' />
                            <span>Add Points</span>
                        </button>
                    </div>
                </div>

                {/* Compact Alerts */}
                {error && (
                    <div className='mb-3 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-2 text-xs shadow-2xs'>
                        <div className='flex items-center gap-2'>
                            <AlertTriangle className='w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0' />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => setError('')}
                            className='text-rose-500 hover:text-rose-700 dark:hover:text-rose-300'
                        >
                            <X className='w-3.5 h-3.5' />
                        </button>
                    </div>
                )}

                {message && (
                    <div className='mb-3 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2 text-xs shadow-2xs'>
                        <div className='flex items-center gap-2'>
                            <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0' />
                            <span>{message}</span>
                        </div>
                        <button
                            onClick={() => setMessage('')}
                            className='text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300'
                        >
                            <X className='w-3.5 h-3.5' />
                        </button>
                    </div>
                )}

                {/* Compact 3 Overview Stat Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3'>
                    {/* Balance Card */}
                    <div className='p-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs group hover:border-[#0075de]/40 transition-all'>
                        <div className='flex items-center justify-between mb-1'>
                            <span className='text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                Available Balance
                            </span>
                            <div className='w-6 h-6 rounded-md bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20 flex items-center justify-center'>
                                <Wallet className='w-3.5 h-3.5' />
                            </div>
                        </div>
                        <div className='text-xl font-bold tracking-tight text-[#191919] dark:text-[#ececec] leading-tight'>
                            {wallet.currentBalance.toLocaleString()}{' '}
                            <span className='text-xs font-normal text-[#787774] dark:text-[#9b9a97]'>
                                pts
                            </span>
                        </div>
                        <div className='flex items-center justify-between mt-1 pt-1 border-t border-[#f0efee] dark:border-[#2a2a2a] text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                            <span className='font-medium text-[#191919] dark:text-[#ececec]'>
                                ≈ ₹{Math.floor(wallet.currentBalance / 5).toLocaleString()}
                            </span>
                            <span className='px-1 py-0.2 rounded text-[10px] bg-[#f3f2ef] dark:bg-[#282828] text-[#787774] dark:text-[#9b9a97]'>
                                5 pts = ₹1
                            </span>
                        </div>
                    </div>

                    {/* Lifetime Earnings Card */}
                    <div className='p-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs group hover:border-emerald-500/40 transition-all'>
                        <div className='flex items-center justify-between mb-1'>
                            <span className='text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                Lifetime Earnings
                            </span>
                            <div className='w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center'>
                                <TrendingUp className='w-3.5 h-3.5' />
                            </div>
                        </div>
                        <div className='text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 leading-tight'>
                            {(wallet.totalEarning ?? 0).toLocaleString()}{' '}
                            <span className='text-xs font-normal text-[#787774] dark:text-[#9b9a97]'>
                                pts
                            </span>
                        </div>
                        <div className='flex items-center justify-between mt-1 pt-1 border-t border-[#f0efee] dark:border-[#2a2a2a] text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                            <span>
                                ≈ ₹{Math.floor((wallet.totalEarning ?? 0) / 5).toLocaleString()}
                            </span>
                            <span>Sales & Rewards</span>
                        </div>
                    </div>

                    {/* Total Redeemed Card */}
                    <div className='p-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs group hover:border-amber-500/40 transition-all'>
                        <div className='flex items-center justify-between mb-1'>
                            <span className='text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                Total Withdrawn
                            </span>
                            <div className='w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center'>
                                <Receipt className='w-3.5 h-3.5' />
                            </div>
                        </div>
                        <div className='text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400 leading-tight'>
                            {(wallet.totalWithdrawal ?? 0).toLocaleString()}{' '}
                            <span className='text-xs font-normal text-[#787774] dark:text-[#9b9a97]'>
                                pts
                            </span>
                        </div>
                        <div className='flex items-center justify-between mt-1 pt-1 border-t border-[#f0efee] dark:border-[#2a2a2a] text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                            <span>
                                ≈ ₹{Math.floor((wallet.totalWithdrawal ?? 0) / 5).toLocaleString()}
                            </span>
                            <span>UPI Payouts</span>
                        </div>
                    </div>
                </div>

                {/* Ultra-compact Info Bar */}
                <div className='py-1.5 px-3 mb-3 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[11px] text-[#787774] dark:text-[#9b9a97] flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                        <IndianRupee className='w-3 h-3 text-emerald-600 shrink-0' />
                        <span><strong>5 pts = ₹1</strong> • Min withdrawal: <strong>500 pts (₹100)</strong></span>
                    </div>
                    <div className='flex items-center gap-1 text-[#0075de] font-medium'>
                        <ShieldCheck className='w-3 h-3' />
                        <span>Instant UPI payout</span>
                    </div>
                </div>

                {/* Compact Main Table Container */}
                <div className='rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-2xs overflow-hidden'>
                    {/* Compact Tabs Header */}
                    <div className='flex items-center justify-between border-b border-[#e6e6e6] dark:border-[#2f2f2f] px-3 bg-[#fbfbfa] dark:bg-[#232323]'>
                        <div className='flex items-center gap-1'>
                            <button
                                onClick={() => {
                                    setActiveTab('transactions');
                                    setPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all -mb-[1px] ${
                                    activeTab === 'transactions'
                                        ? 'border-[#0075de] text-[#0075de]'
                                        : 'border-transparent text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-[#ececec]'
                                }`}
                            >
                                <span>Transactions</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                                        activeTab === 'transactions'
                                            ? 'bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20'
                                            : 'bg-[#e6e6e6] dark:bg-[#2f2f2f] text-[#787774] dark:text-[#9b9a97]'
                                    }`}
                                >
                                    {filtered.length}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    setActiveTab('withdrawals');
                                    setRedemptionPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all -mb-[1px] ${
                                    activeTab === 'withdrawals'
                                        ? 'border-[#0075de] text-[#0075de]'
                                        : 'border-transparent text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-[#ececec]'
                                }`}
                            >
                                <span>Withdrawals</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                                        activeTab === 'withdrawals'
                                            ? 'bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20'
                                            : 'bg-[#e6e6e6] dark:bg-[#2f2f2f] text-[#787774] dark:text-[#9b9a97]'
                                    }`}
                                >
                                    {filteredRedemptions.length}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div>
                            {/* Compact Toolbar */}
                            <div className='p-2.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2'>
                                <div className='relative flex-1 max-w-xs'>
                                    <Search className='w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787774] dark:text-[#9b9a97]' />
                                    <input
                                        type='text'
                                        placeholder='Search reference...'
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setPage(1);
                                        }}
                                        className='w-full pl-8 pr-7 py-1 text-xs rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] placeholder-[#9b9a97] focus:outline-none focus:border-[#0075de] transition-colors'
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className='absolute right-2 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#191919] dark:hover:text-[#ececec]'
                                        >
                                            <X className='w-3 h-3' />
                                        </button>
                                    )}
                                </div>

                                <div className='flex items-center gap-1.5'>
                                    <select
                                        className='text-xs px-2.5 py-1 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] focus:outline-none focus:border-[#0075de] cursor-pointer'
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setPage(1);
                                        }}
                                    >
                                        <option value=''>All Types</option>
                                        <option value='add'>Added</option>
                                        <option value='earn'>Earned</option>
                                        <option value='sale'>Sale Revenue</option>
                                        <option value='bonus'>Bonus</option>
                                        <option value='spend'>Spent</option>
                                        <option value='redeem'>Withdrawal</option>
                                        <option value='refund'>Refund</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table */}
                            <div className='overflow-x-auto'>
                                <table className='w-full text-left text-xs border-collapse'>
                                    <thead>
                                        <tr className='border-b border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#232323] text-[#787774] dark:text-[#9b9a97] uppercase tracking-wider text-[10px] font-semibold'>
                                            <th className='px-3 sm:px-4 py-2'>Date</th>
                                            <th className='px-3 sm:px-4 py-2'>Type</th>
                                            <th className='px-3 sm:px-4 py-2'>Points</th>
                                            <th className='px-3 sm:px-4 py-2'>Balance</th>
                                            <th className='px-3 sm:px-4 py-2'>Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[#e6e6e6] dark:divide-[#2f2f2f]'>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className='px-4 py-10 text-center text-[#787774] dark:text-[#9b9a97]'
                                                >
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <RefreshCw className='w-4 h-4 animate-spin text-[#0075de]' />
                                                        <span className='text-xs'>Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : current.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className='px-4 py-10 text-center text-[#787774] dark:text-[#9b9a97]'
                                                >
                                                    <div className='flex flex-col items-center justify-center gap-1 max-w-xs mx-auto'>
                                                        <Receipt className='w-5 h-5 text-[#787774]' />
                                                        <p className='text-xs font-medium text-[#191919] dark:text-[#ececec]'>
                                                            No transactions found
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            current.map((t) => {
                                                const badge = getTypeBadge(t.type);
                                                const BadgeIcon = badge.icon;
                                                const isPositive = t.points >= 0;
                                                const ref =
                                                    asId(t.orderId) ||
                                                    asId(t.paymentId) ||
                                                    t.description;

                                                return (
                                                    <tr
                                                        key={t._id}
                                                        className='hover:bg-[#fbfbfa] dark:hover:bg-[#252525] transition-colors'
                                                    >
                                                        <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap text-[#787774] dark:text-[#9b9a97] text-[11px]'>
                                                            {t.createdAt
                                                                ? new Date(
                                                                      t.createdAt,
                                                                  ).toLocaleString('en-US', {
                                                                      month: 'short',
                                                                      day: 'numeric',
                                                                      hour: '2-digit',
                                                                      minute: '2-digit',
                                                                  })
                                                                : '-'}
                                                        </td>
                                                        <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap'>
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2 py-0.2 rounded text-[11px] font-medium border ${badge.classes}`}
                                                            >
                                                                <BadgeIcon className='w-2.5 h-2.5' />
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                        <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap font-semibold'>
                                                            <span
                                                                className={
                                                                    isPositive
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-rose-600 dark:text-rose-400'
                                                                }
                                                            >
                                                                {isPositive ? '+' : ''}
                                                                {t.points.toLocaleString()} pts
                                                            </span>
                                                        </td>
                                                        <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap font-medium text-[#191919] dark:text-[#ececec]'>
                                                            {t.balanceAfter.toLocaleString()}
                                                        </td>
                                                        <td className='px-3 sm:px-4 py-2.5 text-[11px] text-[#787774] dark:text-[#9b9a97] font-mono max-w-xs truncate'>
                                                            {ref || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Compact Pagination */}
                            <div className='px-3 sm:px-4 py-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#232323] flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                <div className='flex items-center gap-1.5'>
                                    <select
                                        className='px-1.5 py-0.5 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] focus:outline-none'
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(parseInt(e.target.value, 10));
                                            setPage(1);
                                        }}
                                    >
                                        {[10, 20, 50].map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                    <span>
                                        {filtered.length > 0 ? start + 1 : 0}-
                                        {Math.min(start + pageSize, filtered.length)} of{' '}
                                        {filtered.length}
                                    </span>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <span>
                                        {page}/{totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className='p-1 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                                        title='Previous'
                                    >
                                        <ChevronLeft className='w-3.5 h-3.5' />
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        className='p-1 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                                        title='Next'
                                    >
                                        <ChevronRight className='w-3.5 h-3.5' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Withdrawals Tab */}
                    {activeTab === 'withdrawals' && (
                        <div>
                            {/* Compact Toolbar */}
                            <div className='p-2.5 border-b border-[#e6e6e6] dark:border-[#2f2f2f] flex items-center justify-between gap-2'>
                                <select
                                    className='text-xs px-2.5 py-1 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] focus:outline-none focus:border-[#0075de] cursor-pointer'
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setRedemptionPage(1);
                                    }}
                                >
                                    <option value=''>All Statuses</option>
                                    <option value='pending'>Pending</option>
                                    <option value='approved'>Approved</option>
                                    <option value='rejected'>Rejected</option>
                                </select>

                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs transition-all'
                                >
                                    <PlusCircle className='w-3 h-3' />
                                    <span>New Request</span>
                                </button>
                            </div>

                            {/* Table */}
                            <div className='overflow-x-auto'>
                                <table className='w-full text-left text-xs border-collapse'>
                                    <thead>
                                        <tr className='border-b border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#232323] text-[#787774] dark:text-[#9b9a97] uppercase tracking-wider text-[10px] font-semibold'>
                                            <th className='px-3 sm:px-4 py-2'>Date</th>
                                            <th className='px-3 sm:px-4 py-2'>UPI ID</th>
                                            <th className='px-3 sm:px-4 py-2'>Amount</th>
                                            <th className='px-3 sm:px-4 py-2'>Status</th>
                                            <th className='px-3 sm:px-4 py-2'>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[#e6e6e6] dark:divide-[#2f2f2f]'>
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className='px-4 py-10 text-center text-[#787774] dark:text-[#9b9a97]'
                                                >
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <RefreshCw className='w-4 h-4 animate-spin text-[#0075de]' />
                                                        <span className='text-xs'>Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : currentRedemptions.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className='px-4 py-10 text-center text-[#787774] dark:text-[#9b9a97]'
                                                >
                                                    <div className='flex flex-col items-center justify-center gap-1 max-w-xs mx-auto'>
                                                        <ArrowDownToLine className='w-5 h-5 text-[#787774]' />
                                                        <p className='text-xs font-medium text-[#191919] dark:text-[#ececec]'>
                                                            No withdrawal requests
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentRedemptions.map((r) => (
                                                <tr
                                                    key={r._id}
                                                    className='hover:bg-[#fbfbfa] dark:hover:bg-[#252525] transition-colors'
                                                >
                                                    <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap text-[#787774] dark:text-[#9b9a97] text-[11px]'>
                                                        {r.createdAt
                                                            ? new Date(
                                                                  r.createdAt,
                                                              ).toLocaleString('en-US', {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : '-'}
                                                    </td>
                                                    <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap font-mono text-xs text-[#191919] dark:text-[#ececec]'>
                                                        {r.upiId}
                                                    </td>
                                                    <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap font-semibold text-[#191919] dark:text-[#ececec]'>
                                                        ₹{r.rewardBalance}
                                                    </td>
                                                    <td className='px-3 sm:px-4 py-2.5 whitespace-nowrap'>
                                                        {getStatusBadge(r.status)}
                                                    </td>
                                                    <td className='px-3 sm:px-4 py-2.5 text-[11px] text-[#787774] dark:text-[#9b9a97] max-w-xs'>
                                                        {r.status.toLowerCase() === 'rejected' &&
                                                        r.rejectionReason ? (
                                                            <span className='text-rose-600 dark:text-rose-400 font-medium'>
                                                                {r.rejectionReason}
                                                            </span>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Compact Pagination */}
                            <div className='px-3 sm:px-4 py-2 border-t border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#232323] flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                <div className='flex items-center gap-1.5'>
                                    <select
                                        className='px-1.5 py-0.5 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] focus:outline-none'
                                        value={redemptionPageSize}
                                        onChange={(e) => {
                                            setRedemptionPageSize(
                                                parseInt(e.target.value, 10),
                                            );
                                            setRedemptionPage(1);
                                        }}
                                    >
                                        {[5, 10, 20].map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                    <span>
                                        {filteredRedemptions.length > 0 ? redemptionStart + 1 : 0}-
                                        {Math.min(
                                            redemptionStart + redemptionPageSize,
                                            filteredRedemptions.length,
                                        )}{' '}
                                        of {filteredRedemptions.length}
                                    </span>
                                </div>

                                <div className='flex items-center gap-1'>
                                    <span>
                                        {redemptionPage}/{totalRedemptionPages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setRedemptionPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={redemptionPage === 1}
                                        className='p-1 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                                        title='Previous'
                                    >
                                        <ChevronLeft className='w-3.5 h-3.5' />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setRedemptionPage((p) =>
                                                Math.min(totalRedemptionPages, p + 1),
                                            )
                                        }
                                        disabled={redemptionPage >= totalRedemptionPages}
                                        className='p-1 rounded border border-[#e6e6e6] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] text-[#191919] dark:text-[#ececec] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                                        title='Next'
                                    >
                                        <ChevronRight className='w-3.5 h-3.5' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Add Points Modal */}
            {showAddModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in duration-100'>
                    <div className='w-full max-w-sm rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 shadow-xl transition-all'>
                        <div className='flex items-center justify-between pb-3 mb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 rounded-md bg-[#0075de]/10 text-[#0075de] dark:bg-[#0075de]/20 flex items-center justify-center'>
                                    <PlusCircle className='w-4 h-4' />
                                </div>
                                <h3 className='text-sm font-bold text-[#191919] dark:text-[#ececec]'>
                                    Add Points
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className='p-1 rounded text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-[#ececec] transition-colors'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        <form onSubmit={handleAddPointsSubmit} className='space-y-3'>
                            {/* Preset Buttons */}
                            <div>
                                <label className='block text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1.5'>
                                    Quick Select
                                </label>
                                <div className='grid grid-cols-4 gap-1.5'>
                                    {[500, 1000, 2500, 5000].map((preset) => (
                                        <button
                                            key={preset}
                                            type='button'
                                            onClick={() => setAddPoints(preset)}
                                            className={`py-1 px-1 text-center rounded-md border text-xs font-medium transition-all ${
                                                addPoints === preset
                                                    ? 'border-[#0075de] bg-[#0075de]/10 text-[#0075de] font-semibold'
                                                    : 'border-[#e6e6e6] dark:border-[#2f2f2f] hover:bg-[#f3f2ef] dark:hover:bg-[#252525] text-[#191919] dark:text-[#ececec]'
                                            }`}
                                        >
                                            <div>{preset}</div>
                                            <div className='text-[10px] text-[#787774] dark:text-[#9b9a97]'>
                                                ₹{preset / 5}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Points Input */}
                            <div>
                                <label className='block text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1'>
                                    Points Amount
                                </label>
                                <input
                                    type='number'
                                    min={500}
                                    max={100000}
                                    step={50}
                                    value={addPoints}
                                    onChange={(e) =>
                                        setAddPoints(
                                            Math.max(
                                                0,
                                                parseInt(e.target.value || '0', 10),
                                            ),
                                        )
                                    }
                                    className='w-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0075de] font-semibold'
                                    placeholder='500'
                                />
                                <div className='flex justify-between items-center text-[10px] text-[#787774] dark:text-[#9b9a97] mt-0.5'>
                                    <span>Min: 500 pts</span>
                                    <span>Max: 100,000 pts</span>
                                </div>
                            </div>

                            {/* Calculation Banner */}
                            <div className='p-2.5 rounded-lg border border-[#0075de]/20 bg-[#0075de]/5 dark:bg-[#0075de]/10 flex items-center justify-between'>
                                <div>
                                    <div className='text-[10px] text-[#787774] dark:text-[#9b9a97]'>
                                        Payable Amount
                                    </div>
                                    <div className='text-lg font-bold text-[#0075de]'>
                                        ₹{addRupees}
                                    </div>
                                </div>
                                <div className='text-right text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                    <div className='font-medium text-[#191919] dark:text-[#ececec]'>
                                        {addPoints.toLocaleString()} pts
                                    </div>
                                    <div className='text-[10px]'>5 pts = ₹1.00</div>
                                </div>
                            </div>

                            <div className='flex items-center gap-1.5 text-[10px] text-[#787774] dark:text-[#9b9a97] bg-[#fbfbfa] dark:bg-[#252525] p-2 rounded-md border border-[#e6e6e6] dark:border-[#2f2f2f]'>
                                <CreditCard className='w-3.5 h-3.5 text-[#0075de] shrink-0' />
                                <span>Secured by Razorpay</span>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center gap-2 pt-1'>
                                <button
                                    type='button'
                                    onClick={() => setShowAddModal(false)}
                                    className='flex-1 px-3 py-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-medium hover:bg-[#f3f2ef] dark:hover:bg-[#252525] transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={submitting || addPoints < 500}
                                    className='flex-1 px-3 py-1.5 rounded-lg bg-[#0075de] hover:bg-[#0060b9] text-white text-xs font-semibold shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5'
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className='w-3 h-3 animate-spin' />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Pay ₹{addRupees}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Compact Withdraw Modal */}
            {showWithdrawModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in duration-100'>
                    <div className='w-full max-w-sm rounded-xl bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] p-4 shadow-xl transition-all'>
                        <div className='flex items-center justify-between pb-3 mb-3 border-b border-[#e6e6e6] dark:border-[#2f2f2f]'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center'>
                                    <ArrowDownToLine className='w-4 h-4' />
                                </div>
                                <h3 className='text-sm font-bold text-[#191919] dark:text-[#ececec]'>
                                    Withdraw Points
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className='p-1 rounded text-[#787774] dark:text-[#9b9a97] hover:text-[#191919] dark:hover:text-[#ececec] transition-colors'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        <form onSubmit={handleWithdrawSubmit} className='space-y-3'>
                            {/* UPI ID Input */}
                            <div>
                                <label className='block text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97] mb-1'>
                                    UPI ID
                                </label>
                                <input
                                    type='text'
                                    placeholder='username@okhdfcbank'
                                    value={withdrawUpiId}
                                    onChange={(e) => setWithdrawUpiId(e.target.value)}
                                    className='w-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-mono'
                                    required
                                />
                            </div>

                            {/* Points Input */}
                            <div>
                                <div className='flex justify-between items-center mb-1'>
                                    <label className='block text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9b9a97]'>
                                        Points to Redeem
                                    </label>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setWithdrawPoints(wallet.currentBalance)
                                        }
                                        className='text-[10px] font-semibold text-[#0075de] hover:underline'
                                    >
                                        Max ({wallet.currentBalance.toLocaleString()})
                                    </button>
                                </div>
                                <input
                                    type='number'
                                    min={500}
                                    max={wallet.currentBalance}
                                    step={50}
                                    value={withdrawPoints}
                                    onChange={(e) =>
                                        setWithdrawPoints(
                                            parseInt(e.target.value || '0', 10),
                                        )
                                    }
                                    className='w-full border border-[#e6e6e6] dark:border-[#2f2f2f] bg-[#faf9f8] dark:bg-[#191919] text-[#191919] dark:text-[#ececec] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500 font-semibold'
                                    placeholder='500'
                                    required
                                />
                                <div className='flex justify-between items-center text-[10px] text-[#787774] dark:text-[#9b9a97] mt-0.5'>
                                    <span>Min: 500 pts (₹100)</span>
                                    <span>
                                        Avail: {wallet.currentBalance.toLocaleString()} pts
                                    </span>
                                </div>
                            </div>

                            {/* Calculation Banner */}
                            <div className='p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-between'>
                                <div>
                                    <div className='text-[10px] text-[#787774] dark:text-[#9b9a97]'>
                                        You Will Receive
                                    </div>
                                    <div className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                                        ₹{Math.floor(Number(withdrawPoints || 0) / 5)}
                                    </div>
                                </div>
                                <div className='text-right text-[11px] text-[#787774] dark:text-[#9b9a97]'>
                                    <div className='font-medium text-[#191919] dark:text-[#ececec]'>
                                        {withdrawPoints.toLocaleString()} pts
                                    </div>
                                    <div className='text-[10px]'>5 pts = ₹1.00</div>
                                </div>
                            </div>

                            {withdrawPoints > wallet.currentBalance && (
                                <div className='p-2 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5'>
                                    <AlertTriangle className='w-3.5 h-3.5 shrink-0' />
                                    <span>Insufficient balance.</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className='flex items-center gap-2 pt-1'>
                                <button
                                    type='button'
                                    onClick={() => setShowWithdrawModal(false)}
                                    className='flex-1 px-3 py-1.5 rounded-lg border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs font-medium hover:bg-[#f3f2ef] dark:hover:bg-[#252525] transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={
                                        submitting ||
                                        withdrawPoints > wallet.currentBalance ||
                                        withdrawPoints < 500 ||
                                        !withdrawUpiId
                                    }
                                    className='flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5'
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className='w-3 h-3 animate-spin' />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <span>Submit</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
