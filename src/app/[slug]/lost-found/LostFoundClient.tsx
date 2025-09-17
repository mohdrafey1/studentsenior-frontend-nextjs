'use client';
import React, { useEffect, useState, useCallback } from 'react';
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
import { PlusIcon, SearchIcon } from 'lucide-react';
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
        initialPagination
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
        (state: RootState) => state.user.currentUser
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
                limit: String(LOST_FOUND_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            if (typeFilter) params.append('type', typeFilter);
            if (statusFilter) params.append('currentStatus', statusFilter);

            const url = `${api.lostFound.getLostFoundByCollegeSlug(
                collegeName
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

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Modal logic
    const openModal = (item?: ILostFoundItem) => {
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
                  }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
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
    };

    const handleSubmit = async (formData: LostFoundFormData) => {
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
            if (!res.ok) throw new Error(data.message || 'Failed to save item');

            toast.success(
                data.message || (editItem ? 'Item updated!' : 'Item added!')
            );
            closeModal();
            fetchItems();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save item');
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
            const res = await fetch(
                api.lostFound.deleteLostFound(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || 'Failed to delete item');

            toast.success('Item deleted!');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            fetchItems();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete item');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    };

    // Pagination controls
    const goToPage = (p: number) => {
        if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
    };

    return (
        <>
            <section className='mb-8' aria-label='Search and Add Item'>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex flex-col sm:flex-row gap-4 items-center w-full sm:w-2/3'>
                        <div className='flex gap-3 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white text-black transition-all'>
                            <SearchIcon className='w-5 h-5 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search items...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='w-full bg-transparent outline-none'
                                aria-label='Search items'
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className='w-full p-3 bg-transparent outline-none border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white text-black transition-all'
                        >
                            <option value=''>All Types</option>
                            <option value='lost'>Lost</option>
                            <option value='found'>Found</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='w-full p-3 bg-transparent outline-none border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white text-black transition-all'
                        >
                            <option value=''>All Status</option>
                            <option value='open'>Open</option>
                            <option value='closed'>Closed</option>
                        </select>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className='flex gap-3 w-full sm:w-1/3 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                    >
                        <PlusIcon className='w-5 h-5' />
                        <span>Add Item</span>
                    </button>
                </div>
            </section>

            <section aria-label='Lost & Found Items List'>
                {loading ? (
                    <div className='text-center py-10 text-gray-700 dark:text-gray-200'>
                        Loading...
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
                            Showing {items.length} of{' '}
                            {pagination?.totalItems ?? 0} items
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {items.map((item) => (
                                <LostFoundCard
                                    key={item._id}
                                    item={item}
                                    openModal={openModal}
                                    handleDeleteRequest={handleDeleteRequest}
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

            <LostFoundFormModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={loading}
                form={form}
                setForm={setForm}
                editItem={editItem}
            />

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
                message='Are you sure you want to delete this item? This action cannot be undone.'
            />
        </>
    );
};

export default LostFoundClient;
