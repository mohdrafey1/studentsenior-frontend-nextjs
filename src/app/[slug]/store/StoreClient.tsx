'use client';
import React, { useEffect, useState, useCallback } from 'react';
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

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );

    const ownerId = currentUser?._id;

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

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const openModal = (item?: IStoreItem) => {
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
    };
    const closeModal = () => {
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
    };

    const handleSubmit = async (formData: StoreFormData) => {
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
            fetchItems();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (itemId: string) => {
        setDeleteTargetId(itemId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
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
            fetchItems();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete product');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    };

    const goToPage = (p: number) => {
        if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
    };

    return (
        <>
            {/* Header with Add Button */}
            <section className='mb-8' aria-label='Search and Add Item'>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center w-full'>
                        <div className='flex gap-3 w-full sm:w-4/5 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all'>
                            <SearchIcon className='w-5 h-5 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search products...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='w-full bg-transparent outline-none text-black dark:text-white'
                            />
                        </div>
                        {/* <select
                            value={availableFilter}
                            onChange={(e) => setAvailableFilter(e.target.value)}
                            className="w-full sm:w-1/5 p-3 bg-transparent outline-none border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all"
                        >
                            <option value="">All Status</option>
                            <option value="true">Available</option>
                            <option value="false">Sold</option>
                        </select> */}
                        <button
                            onClick={() => openModal()}
                            className='flex gap-3 w-full sm:w-1/5 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                        >
                            <PlusIcon className='w-4 h-4' />
                            Add Product
                        </button>
                    </div>
                </div>
            </section>

            <section aria-label='Store Items List'>
                {/* Loading State */}
                {loading ? (
                    <div className='flex justify-center min-h-screen py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
                            Showing {items.length} of{' '}
                            {pagination?.totalItems ?? 0} items
                        </p>

                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
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
                    <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                        <i className='fas fa-search text-5xl text-gray-400 mb-4'></i>
                        <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200 mb-2'>
                            No Items Found
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-6'>
                            Be the first to post a lost or found item in{' '}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md dark:bg-sky-500 dark:hover:bg-sky-600'
                            aria-label='Add New Item'
                        >
                            Add New Item
                        </button>
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
