'use client';
import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { IPagination, IStoreItem } from '@/utils/interface';
import { STORE_PAGE_SIZE, SEARCH_DEBOUNCE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { StoreCard } from './StoreCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon } from 'lucide-react';
import StoreFormModal, { StoreFormData } from './StoreFormModal';
import { capitalizeWords } from '@/utils/formatting';
import { ResourcePageHeader } from '@/components/Common/ResourcePageHeader';

const StoreClient = ({
    initialItems,
    initialPagination,
    collegeName,
}: {
    initialItems: IStoreItem[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const [items, setItems] = useState<IStoreItem[]>(initialItems);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    // const [availableFilter, setAvailableFilter] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<IStoreItem | null>(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        whatsapp: '',
        telegram: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

    // Track initial mount and previous filters
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({ search: '', page: 1 });

    // Memoize current filters
    const currentFilters = useMemo(
        () => ({
            search: searchTerm,
            page: page,
        }),
        [searchTerm, page],
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
                limit: String(STORE_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            // if (availableFilter) params.append("available", availableFilter);

            const url = `${api.store.getStoreByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || 'Failed to fetch products');

            setItems(data.data.products || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm]);

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchItems();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchItems, forceRefetch]);

    const openModal = useCallback(
        (item?: IStoreItem) => {
            if (!currentUser) {
                toast.error('Please sign in to post items');
                return;
            }
            setEditItem(item || null);
            setForm(
                item
                    ? {
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          image: item.image,
                          whatsapp: item.whatsapp || '',
                          telegram: item.telegram || '',
                      }
                    : {
                          name: '',
                          description: '',
                          price: 0,
                          image: '',
                          whatsapp: '',
                          telegram: '',
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
            name: '',
            description: '',
            price: 0,
            image: '',
            whatsapp: '',
            telegram: '',
        });
    }, []);

    const handleSubmit = useCallback(
        async (formData: StoreFormData) => {
            setLoading(true);
            try {
                const method = editItem ? 'PUT' : 'POST';

                const url = editItem
                    ? api.store.editStore(editItem._id)
                    : api.store.createStore;

                const body = {
                    ...formData,
                    ...(method === 'POST' && { college: collegeName }),
                };

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to save product');
                }

                toast.success(
                    data.message ||
                        (editItem ? 'Product updated!' : 'Product added!'),
                );
                closeModal();
                setForceRefetch(true);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error('Failed to save product');
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
            const response = await fetch(
                api.store.deleteStore(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete product');
            }

            toast.success('Product deleted successfully');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete product');
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteTargetId]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    }, []);

    const goToPage = useCallback(
        (p: number) => {
            if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
        },
        [pagination],
    );

    return (
        <>
            <ResourcePageHeader
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                searchPlaceholder='Search products...'
                showFilters={false}
                setShowFilters={() => {}}
                hasActiveFilters={!!searchTerm}
                activeFilterCount={searchTerm ? 1 : 0}
                clearFilters={() => setSearchInput('')}
                onAdd={openModal}
                addButtonText='Add Product'
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <section aria-label='Store Items List'>
                {/* Loading State */}
                {loading ? (
                    <div className='flex justify-center min-h-screen py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className='mb-4'>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                                Showing {items.length} of{' '}
                                {pagination?.totalItems ?? 0} items
                            </p>
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                            {items.map((item) => (
                                <StoreCard
                                    key={item._id}
                                    item={item}
                                    onEdit={openModal}
                                    onDelete={handleDeleteRequest}
                                    ownerId={ownerId || ''}
                                />
                            ))}
                        </div>
                        <PaginationComponent
                            currentPage={page}
                            totalPages={pagination?.totalPages || 1}
                            onPageChange={goToPage}
                        />
                    </>
                ) : (
                    <div className='text-center py-12'>
                        <div className='bg-[#fcfbf9] dark:bg-[#202020] rounded-xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 max-w-md mx-auto shadow-xs'>
                            <div className='w-12 h-12 mx-auto mb-3 bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] rounded-full flex items-center justify-center'>
                                <SearchIcon className='w-6 h-6' />
                            </div>
                            <h3 className='text-base font-bold text-[#101828] dark:text-white mb-1'>
                                No Products Found
                            </h3>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mb-5 leading-relaxed'>
                                {searchTerm
                                    ? 'Try adjusting or clearing your filters to discover more items.'
                                    : `Be the first to post a product in ${capitalizeWords(collegeName)}`}
                            </p>
                            <button
                                onClick={() => openModal()}
                                className='inline-flex items-center gap-1.5 px-4 py-2 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs active:scale-[0.98]'
                                aria-label='Add New Item'
                            >
                                <PlusIcon className='w-4 h-4' />
                                Add Product
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Form Modal */}
            <StoreFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editItem={editItem}
                form={form}
                setForm={setForm}
                loading={loading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message='Are you sure you want to delete this product? This action cannot be undone.'
            />
        </>
    );
};

export default StoreClient;
