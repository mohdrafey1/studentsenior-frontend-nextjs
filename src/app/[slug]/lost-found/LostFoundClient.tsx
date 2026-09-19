'use client';
import React, {
    useCallback,
    useEffect,
    useState,
    useMemo,
    useRef,
} from 'react';
import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import toast from 'react-hot-toast';
import { IPagination, ILostFoundItem } from '@/utils/interface';
import { LOST_FOUND_PAGE_SIZE, SEARCH_DEBOUNCE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { LostFoundCard } from './LostFoundCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon, X, Loader2, PackageSearch } from 'lucide-react';
import LostFoundFormModal, { LostFoundFormData } from './LostFoundFormModal';

const LostFoundClient = ({
    initialItems,
    initialPagination,
    collegeName,
}: {
    initialItems: ILostFoundItem[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const [items, setItems] = useState<ILostFoundItem[]>(initialItems);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ILostFoundItem | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'lost' as 'lost' | 'found',
        location: '',
        date: new Date().toISOString().split('T')[0],
        whatsapp: '',
        imageUrl: '',
        currentStatus: 'open' as 'open' | 'closed',
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

    // Track initial mount and previous filters
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({
        search: '',
        type: '',
        status: '',
        page: 1,
    });

    // Memoize current filters
    const currentFilters = useMemo(
        () => ({
            search: searchTerm,
            type: typeFilter,
            status: statusFilter,
            page: page,
        }),
        [searchTerm, typeFilter, statusFilter, page],
    );

    // Mark initial mount as complete
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Reset to first page on new search
        }, SEARCH_DEBOUNCE);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Fetch items from backend
    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(LOST_FOUND_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            if (typeFilter) params.append('type', typeFilter);
            if (statusFilter) params.append('currentStatus', statusFilter);

            const url = `${api.lostFound.getLostFoundByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || 'Failed to fetch items');

            setItems(data.data.items || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm, typeFilter, statusFilter]);

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.type !== currentFilters.type ||
            prevFilters.status !== currentFilters.status ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchItems();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchItems, forceRefetch]);

    // Modal logic
    const openModal = useCallback(
        (item?: ILostFoundItem) => {
            if (!currentUser) {
                toast.error('Please sign in to post items');
                return;
            }
            setEditItem(item || null);
            setForm(
                item
                    ? {
                          title: item.title,
                          description: item.description,
                          type: item.type,
                          location: item.location,
                          date: new Date(item.date).toISOString().split('T')[0],
                          whatsapp: item.whatsapp,
                          imageUrl: item.imageUrl || '',
                          currentStatus: item.currentStatus,
                      }
                    : {
                          title: '',
                          description: '',
                          type: 'lost',
                          location: '',
                          date: new Date().toISOString().split('T')[0],
                          whatsapp: '',
                          imageUrl: '',
                          currentStatus: 'open',
                      },
            );
            setModalOpen(true);
        },
        [currentUser],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditItem(null);
        setForm({
            title: '',
            description: '',
            type: 'lost',
            location: '',
            date: new Date().toISOString().split('T')[0],
            whatsapp: '',
            imageUrl: '',
            currentStatus: 'open',
        });
    }, []);

    const handleSubmit = useCallback(
        async (formData: LostFoundFormData) => {
            setLoading(true);
            try {
                const method = editItem ? 'PUT' : 'POST';
                const url = editItem
                    ? api.lostFound.editLostFound(editItem._id)
                    : api.lostFound.createLostFound;
                const body = {
                    ...formData,
                    ...(method === 'POST' && { college: collegeName }),
                };

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });

                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.message || 'Failed to save item');

                toast.success(
                    data.message ||
                        (editItem ? 'Item updated!' : 'Item added!'),
                );
                closeModal();
                setForceRefetch(true);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error('Failed to save item');
            } finally {
                setLoading(false);
            }
        },
        [editItem, collegeName, closeModal],
    );

    const handleDeleteRequest = useCallback((itemId: string) => {
        setDeleteTargetId(itemId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(
                api.lostFound.deleteLostFound(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || 'Failed to delete item');

            toast.success('Item deleted!');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete item');
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteTargetId]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    }, []);

    // Pagination controls
    const goToPage = useCallback(
        (p: number) => {
            if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
        },
        [pagination],
    );

    return (
        <div className='space-y-6'>
            {/* Search and Filter Controls */}
            <section aria-label='Search and Add Item'>
                <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3'>
                    {/* Search & Filters group */}
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1'>
                        {/* Search Bar */}
                        <div className='relative flex-1 min-w-[240px]'>
                            <div className='flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-[#0075de]/15 focus-within:border-[#0075de] transition-all'>
                                <SearchIcon className='w-4 h-4 text-[#8c8883] dark:text-[#787672] shrink-0' />
                                <input
                                    type='text'
                                    placeholder='Search by item name or description...'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965]'
                                    aria-label='Search items'
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => setSearchInput('')}
                                        className='p-1 text-[#8c8883] hover:text-[#101828] dark:hover:text-white rounded-md'
                                        aria-label='Clear search'
                                    >
                                        <X className='w-3.5 h-3.5' />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Type Filter Select */}
                        <div className='w-full sm:w-36 shrink-0'>
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setPage(1);
                                }}
                                className='w-full px-3 py-2.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs sm:text-sm text-[#101828] dark:text-[#ededed] rounded-xl shadow-xs focus:ring-2 focus:ring-[#0075de]/15 focus:border-[#0075de] outline-none transition-all cursor-pointer'
                                aria-label='Filter by item type'
                            >
                                <option value=''>All Types</option>
                                <option value='lost'>Lost Items</option>
                                <option value='found'>Found Items</option>
                            </select>
                        </div>

                        {/* Status Filter Select */}
                        <div className='w-full sm:w-36 shrink-0'>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className='w-full px-3 py-2.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] text-xs sm:text-sm text-[#101828] dark:text-[#ededed] rounded-xl shadow-xs focus:ring-2 focus:ring-[#0075de]/15 focus:border-[#0075de] outline-none transition-all cursor-pointer'
                                aria-label='Filter by status'
                            >
                                <option value=''>All Status</option>
                                <option value='open'>Open (Active)</option>
                                <option value='closed'>Closed (Resolved)</option>
                            </select>
                        </div>
                    </div>

                    {/* Post Item Action Button */}
                    <button
                        onClick={() => openModal()}
                        className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0'
                        aria-label='Report or Post Item'
                    >
                        <PlusIcon className='w-4 h-4' />
                        <span>Post Item</span>
                    </button>
                </div>
            </section>

            {/* Item Grid & Results */}
            <section aria-label='Lost & Found Items List'>
                {loading ? (
                    <div className='flex flex-col items-center justify-center py-20 min-h-[300px]'>
                        <Loader2 className='w-10 h-10 border-3 text-[#0075de] animate-spin mb-3' />
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                            Loading lost & found items...
                        </p>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className='flex items-center justify-between mb-4'>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] font-medium'>
                                Showing {items.length} of{' '}
                                {pagination?.totalItems ?? items.length} items
                            </p>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
                            {items.map((item) => (
                                <LostFoundCard
                                    key={item._id}
                                    item={item}
                                    openModal={openModal}
                                    handleDeleteRequest={handleDeleteRequest}
                                    ownerId={ownerId || ''}
                                    collegeName={collegeName}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className='mt-8'>
                                <PaginationComponent
                                    currentPage={page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={goToPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    /* Notion-Styled Empty State */
                    <div className='text-center py-16 sm:py-20 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 max-w-lg mx-auto shadow-xs'>
                        <div className='w-14 h-14 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8c8883] dark:text-[#787672]'>
                            <PackageSearch className='w-7 h-7' />
                        </div>
                        <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5'>
                            No Items Found
                        </h3>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mb-6 max-w-sm mx-auto'>
                            {searchTerm || typeFilter || statusFilter
                                ? 'No lost or found items match your filter criteria. Try resetting filters.'
                                : `Be the first to post a lost or found item for ${capitalizeWords(collegeName)}.`}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='inline-flex items-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
                            aria-label='Post New Item'
                        >
                            <PlusIcon className='w-4 h-4' />
                            <span>Post Item</span>
                        </button>
                    </div>
                )}
            </section>

            {/* Form Modal */}
            <LostFoundFormModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={loading}
                form={form}
                setForm={setForm}
                editItem={editItem}
            />

            {/* Delete Modal */}
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
                message='Are you sure you want to delete this lost & found item? This action cannot be undone.'
            />
        </div>
    );
};

export default LostFoundClient;

