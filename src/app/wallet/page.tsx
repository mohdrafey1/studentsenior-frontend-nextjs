'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Withdrawal requests filters and pagination
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [redemptionPage, setRedemptionPage] = useState(1);
    const [redemptionPageSize, setRedemptionPageSize] = useState(10);

    // Tab state
    const [activeTab, setActiveTab] = useState<'transactions' | 'withdrawals'>(
        'transactions',
    );

    const filtered = useMemo(() => {
        return txns.filter((t) => !type || t.type === type);
    }, [txns, type]);

    const start = (page - 1) * pageSize;
    const current = filtered.slice(start, start + pageSize);

    // Filter and paginate redemptions
    const filteredRedemptions = useMemo(() => {
        return redemptions.filter(
            (r) => !statusFilter || r.status === statusFilter,
        );
    }, [redemptions, statusFilter]);

    const redemptionStart = (redemptionPage - 1) * redemptionPageSize;
    const currentRedemptions = filteredRedemptions.slice(
        redemptionStart,
        redemptionStart + redemptionPageSize,
    );

    const fetchAll = async () => {
        try {
            setError('');
            setLoading(true);
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

            setWallet(bData?.data?.wallet ?? 0);
            setTxns(tData?.data?.transactions || tData?.data || []);

            const rData = await rRes.json();
            setRedemptions(rData?.data || []);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Failed to load wallet';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Redirect to sign-in if not logged in
        if (!currentUser) {
            router.push('/sign-in?from=/wallet');
            return;
        }
        fetchAll();
    }, [currentUser, router]);

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
                    'Failed to create order';
                throw new Error(msg);
            }
            const orderData = await createRes.json();
            const orderId = orderData?.data?.orderId || orderData?.orderId;
            if (!orderId) throw new Error('Order not created');

            const payRes = await fetch(`${API_BASE}/payment/pay/online`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    orderId,
                    gateway: 'phonepe',
                    returnUrl: `${window.location.origin}/payment/callback?orderId=${orderId}`,
                }),
            });
            if (!payRes.ok) {
                const msg =
                    (await payRes.json().catch(() => ({}))).message ||
                    'Failed to initiate payment';
                throw new Error(msg);
            }
            const payData = await payRes.json();
            const paymentUrl = payData?.data?.paymentUrl || payData?.paymentUrl;
            if (!paymentUrl) throw new Error('Payment URL not received');

            setShowAddModal(false);
            window.location.href = paymentUrl as string;
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Something went wrong';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const pts = Number(withdrawPoints || 0);
        if (!withdrawUpiId || !/^[\w.\-]+@[\w\-]+$/.test(withdrawUpiId)) {
            setError('Enter a valid UPI ID');
            return;
        }
        if (pts < 500) {
            setError('Minimum withdrawal is 500 points');
            return;
        }
        if (pts > wallet.currentBalance) {
            setError('Insufficient balance');
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
                    data?.message || 'Failed to create withdrawal request',
                );
            }
            setMessage('Withdrawal request submitted successfully.');
            setWithdrawUpiId('');
            setWithdrawPoints(500);
            setShowWithdrawModal(false);
            fetchAll();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
       <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
  <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
    {/* Header */}
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
          My Wallet
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm'>
          Manage your points and withdrawals
        </p>
      </div>
      <div className='flex gap-3'>
        <button
          onClick={() => setShowAddModal(true)}
          className='px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200'
        >
          <span className='flex items-center gap-2'>
            <span>+</span>
            <span>Add Points</span>
          </span>
        </button>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className='px-5 py-2.5 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium shadow-md hover:shadow-lg transition-all duration-200'
        >
          <span className='flex items-center gap-2'>
            <span>↓</span>
            <span>Withdraw</span>
          </span>
        </button>
      </div>
    </div>

    {/* Alerts */}
    {error && (
      <div className='mb-6 p-4 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm'>
        <div className='flex items-start gap-3'>
          <span className='text-xl'>⚠️</span>
          <div>{error}</div>
        </div>
      </div>
    )}
    {message && (
      <div className='mb-6 p-4 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm'>
        <div className='flex items-start gap-3'>
          <span className='text-xl'>✓</span>
          <div>{message}</div>
        </div>
      </div>
    )}

    {/* Balance & Stats Cards */}
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      <div className='p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            Current Balance
          </div>
          <span className='text-2xl'>💰</span>
        </div>
        <div className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
          {wallet.currentBalance.toLocaleString()} pts
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
          <span>
            ≈ ₹
            {Math.floor(
              wallet.currentBalance / 5,
            ).toLocaleString()}
          </span>
          <span className='text-gray-400 dark:text-gray-500'>•</span>
          <span>1 INR = 5 pts</span>
        </div>
      </div>
      <div className='p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            Total Earned
          </div>
          <span className='text-2xl'>📈</span>
        </div>
        <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-1'>
          {(wallet.totalEarning ?? 0).toLocaleString()} pts
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          Lifetime earnings
        </div>
      </div>
      <div className='p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            Total Withdrawl
          </div>
          <span className='text-2xl'>📊</span>
        </div>
        <div className='text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1'>
          {(wallet.totalWithdrawal ?? 0).toLocaleString()} pts
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          All time Redeem
        </div>
      </div>
    </div>

    {/* Tab Navigation */}
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <div className='flex'>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <span className='flex items-center justify-center gap-2'>
              <span>📊</span>
              <span>Transaction History</span>
              <span className='ml-2 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-xs font-medium'>
                {filtered.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === 'withdrawals'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <span className='flex items-center justify-center gap-2'>
              <span>💸</span>
              <span>Withdrawal Requests</span>
              <span className='ml-2 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-xs font-medium'>
                {filteredRedemptions.length}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Transactions Tab Content */}
      {activeTab === 'transactions' && (
        <>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                Transaction History
              </h2>
              <select
                className='border text-black border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
              >
                <option value=''>All types</option>
                <option value='add'>Added</option>
                <option value='earn'>Earn</option>
                <option value='spend'>Spend</option>
                <option value='sale'>Sale</option>
                <option value='refund'>Refund</option>
                <option value='redeem'>Withdrawal</option>
                <option value='bonus'>Bonus</option>
              </select>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Points
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Balance
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                    >
                      <div className='flex items-center justify-center gap-2'>
                        <div className='w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin'></div>
                        <span>Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : current.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <span className='text-4xl'>📭</span>
                        <span>No transactions found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  current.map((t) => (
                    <tr
                      key={t._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300'>
                        {t.createdAt
                          ? new Date(
                              t.createdAt,
                            ).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize
                          ${t.type === 'add' || t.type === 'earn' || t.type === 'sale' || t.type === 'bonus' || t.type === 'refund' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${t.points >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {t.points >= 0 ? '+' : ''}
                        {t.points}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium'>
                        {t.balanceAfter}
                      </td>
                      <td className='px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-mono max-w-xs truncate'>
                        {asId(t.orderId) ||
                          asId(t.paymentId) ||
                          '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Transaction Pagination */}
          <div className='px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                Show
              </span>
              <select
                className='borde text-black border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    parseInt(e.target.value),
                  );
                  setPage(1);
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                per page
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                {start + 1}-
                {Math.min(
                  start + pageSize,
                  filtered.length,
                )}{' '}
                of {filtered.length}
              </span>
              <button
                className='px-4 text-black py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={page === 1}
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
              >
                Previous
              </button>
              <button
                className='px-4 text-black py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={
                  start + pageSize >= filtered.length
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Withdrawals Tab Content */}
      {activeTab === 'withdrawals' && (
        <>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                Withdrawal Requests
              </h2>
              <select
                className='border text-black border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setRedemptionPage(1);
                }}
              >
                <option value=''>All Status</option>
                <option value='pending'>Pending</option>
                <option value='approved'>Approved</option>
                <option value='rejected'>Rejected</option>
              </select>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    UPI ID
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Amount (₹)
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                    >
                      <div className='flex items-center justify-center gap-2'>
                        <div className='w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin'></div>
                        <span>Loading requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentRedemptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <span className='text-4xl'>💸</span>
                        <span>No withdrawal requests</span>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                          Your withdrawal requests will appear
                          here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRedemptions.map((r) => (
                    <tr
                      key={r._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300'>
                        {r.createdAt
                          ? new Date(
                              r.createdAt,
                            ).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium'>
                        {r.upiId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold'>
                        ₹{r.rewardBalance}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                            r.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
                              : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs'>
                        {r.status === 'Rejected' &&
                        r.rejectionReason ? (
                          <span className='text-red-600 dark:text-red-400'>
                            {r.rejectionReason}
                          </span>
                        ) : (
                          <span className='text-gray-400 dark:text-gray-500'>
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Withdrawal Pagination */}
          <div className='px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                Show
              </span>
              <select
                className='border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                value={redemptionPageSize}
                onChange={(e) => {
                  setRedemptionPageSize(
                    parseInt(e.target.value),
                  );
                  setRedemptionPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                per page
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                {redemptionStart + 1}-
                {Math.min(
                  redemptionStart +
                    redemptionPageSize,
                  filteredRedemptions.length,
                )}{' '}
                of {filteredRedemptions.length}
              </span>
              <button
                className='px-4 text-black py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={redemptionPage === 1}
                onClick={() =>
                  setRedemptionPage((p) =>
                    Math.max(1, p - 1),
                  )
                }
              >
                Previous
              </button>
              <button
                className='px-4 text-black py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={
                  redemptionStart +
                    redemptionPageSize >=
                  filteredRedemptions.length
                }
                onClick={() =>
                  setRedemptionPage((p) => p + 1)
                }
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>

    {/* Add Points Modal */}
    {showAddModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
        <div className='w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transform transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                Add Points
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Purchase points using PhonePe
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-2xl'
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={handleAddPointsSubmit}
            className='space-y-5'
          >
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                Points to Add
              </label>
              <input
                type='number'
                min={500}
                max={100000}
                value={addPoints}
                onChange={(e) =>
                  setAddPoints(
                    Math.max(
                      0,
                      parseInt(
                        e.target.value || '0',
                        10,
                      ),
                    ),
                  )
                }
                className='w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400/50 transition-all text-lg'
                placeholder='Enter points'
              />
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Min: 500 pts • Max: 100,000 pts
              </p>
            </div>
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg p-4 border border-blue-200 dark:border-blue-700'>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                Amount to Pay
              </label>
              <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                ₹{addRupees}
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2'>
                <span className='inline-flex items-center px-2 py-0.5 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium'>
                  5 pts = ₹1
                </span>
                <span>•</span>
                <span>
                  {addPoints.toLocaleString()} points
                </span>
              </div>
            </div>
            <div className='flex gap-3 pt-2'>
              <button
                type='button'
                onClick={() => setShowAddModal(false)}
                className='flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting || addPoints < 500}
                className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all'
              >
                {submitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Withdraw Modal */}
    {showWithdrawModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
        <div className='w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transform transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                Withdraw Points
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Convert points to cash via UPI
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-2xl'
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={handleWithdrawSubmit}
            className='space-y-5'
          >
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                UPI ID
              </label>
              <input
                type='text'
                placeholder='yourname@paytm'
                value={withdrawUpiId}
                onChange={(e) =>
                  setWithdrawUpiId(e.target.value)
                }
                className='w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-400/50 transition-all'
                required
              />
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Enter your UPI ID to receive payment
              </p>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                Points to Withdraw
              </label>
              <input
                type='number'
                min={500}
                max={wallet.currentBalance}
                step={50}
                value={withdrawPoints}
                onChange={(e) =>
                  setWithdrawPoints(
                    parseInt(
                      e.target.value || '0',
                      10,
                    ),
                  )
                }
                className='w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-400/50 transition-all text-lg'
                placeholder='Enter points'
                required
              />
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Available:{' '}
                {wallet.currentBalance.toLocaleString()}{' '}
                pts
              </p>
            </div>
            <div className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-lg p-4 border border-green-200 dark:border-green-700'>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                You Will Receive
              </label>
              <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                ₹
                {Math.floor(
                  Number(withdrawPoints || 0) / 5,
                )}
              </div>
              <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2'>
                <span className='inline-flex items-center px-2 py-0.5 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium'>
                  5 pts = ₹1
                </span>
                <span>•</span>
                <span>
                  {withdrawPoints.toLocaleString()}{' '}
                  points
                </span>
              </div>
            </div>
            {withdrawPoints > wallet.currentBalance && (
              <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 text-sm text-red-600 dark:text-red-300 flex items-center gap-2'>
                <span className='text-lg'>⚠️</span>
                <span>
                  Insufficient balance. You have{' '}
                  {wallet.currentBalance.toLocaleString()}{' '}
                  points.
                </span>
              </div>
            )}
            <div className='flex gap-3 pt-2'>
              <button
                type='button'
                onClick={() =>
                  setShowWithdrawModal(false)
                }
                className='flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={
                  submitting ||
                  withdrawPoints >
                    wallet.currentBalance ||
                  withdrawPoints < 500
                }
                className='flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all'
              >
                {submitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Processing...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
</div>
    );
}
