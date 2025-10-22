'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import toast from 'react-hot-toast';
import { IPagination, IOpportunity } from '@/utils/interface';
import { OPPORTUNITIES_PAGE_SIZE, SEARCH_DEBOUNCE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { OpportunityCard } from './OpportunityCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon } from 'lucide-react';
import OpportunityFormModal from './OpportunityFormModal';

interface OpportunityClientProps {
    initialOpportunities: IOpportunity[];
    initialPagination: IPagination;
    collegeName: string;
}

const OpportunityClient = ({
    initialOpportunities,
    initialPagination,
    collegeName,
}: OpportunityClientProps) => {
    const [opportunities, setOpportunities] =
        useState<IOpportunity[]>(initialOpportunities);
    const [pagination, setPagination] =
        useState<IPagination>(initialPagination);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editOpportunity, setEditOpportunity] = useState<IOpportunity | null>(
        null,
    );
    const [form, setForm] = useState({
        name: '',
        description: '',
        email: '',
        whatsapp: '',
        link: '',
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

    // Fetch opportunities from backend
    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(OPPORTUNITIES_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());

            const url = `${api.opportunities.getOpportunitiesByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok)
                throw new Error(
                    data.message || 'Failed to fetch opportunities',
                );

            setOpportunities(data.data.opportunities || []);
            setPagination(data.data.pagination || initialPagination);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch opportunities');
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm, initialPagination]);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    // Modal logic
    const openModal = (opportunity?: IOpportunity) => {
        if (!currentUser) {
            toast.error('Please sign in to post opportunities');
            return;
        }
        setEditOpportunity(opportunity || null);
        setForm(
            opportunity
                ? {
                      name: opportunity.name,
                      description: opportunity.description,
                      email: opportunity.email || '',
                      whatsapp: opportunity.whatsapp || '',
                      link: opportunity.link || '',
                  }
                : {
                      name: '',
                      description: '',
                      email: '',
                      whatsapp: '',
                      link: '',
                  },
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditOpportunity(null);
        setForm({
            name: '',
            description: '',
            email: '',
            whatsapp: '',
            link: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = editOpportunity ? 'PUT' : 'POST';
            const url = editOpportunity
                ? api.opportunities.editOpportunity(editOpportunity._id)
                : api.opportunities.createOpportunity;
            const body = {
                ...form,
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
                throw new Error(data.message || 'Failed to save opportunity');

            toast.success(
                data.message ||
                    (editOpportunity
                        ? 'Opportunity updated!'
                        : 'Opportunity added!'),
                { duration: 10000 },
            );

            closeModal();
            fetchOpportunities();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save opportunity');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (opportunityId: string) => {
        setDeleteTargetId(opportunityId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(
                api.opportunities.deleteOpportunity(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || 'Failed to delete opportunity');

            toast.success('Opportunity deleted!');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            fetchOpportunities();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete opportunity');
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
            <section className='mb-8' aria-label='Search and Add Opportunity'>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <div className='flex gap-3 w-full sm:w-2/3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all'>
                        <SearchIcon className='w-5 h-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search opportunities...'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className='w-full bg-transparent outline-none'
                            aria-label='Search opportunities'
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className='flex gap-3 w-full sm:w-1/3 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                    >
                        <PlusIcon className='w-5 h-5' />
                        <span>Post Opportunity</span>
                    </button>
                </div>
            </section>

            <section aria-label='Opportunities List'>
                {loading ? (
                    <div className='flex justify-center min-h-screen py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600'></div>
                    </div>
                ) : opportunities.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
                            Showing {opportunities.length} of{' '}
                            {pagination?.totalItems ?? 0} opportunities
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {opportunities.map((opportunity) => (
                                <OpportunityCard
                                    key={opportunity._id}
                                    opportunity={opportunity}
                                    openModal={openModal}
                                    handleDeleteRequest={handleDeleteRequest}
                                    ownerId={ownerId || ''}
                                    collegeName={collegeName}
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
                        <i className='fas fa-briefcase text-5xl text-gray-400 mb-4'></i>
                        <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200 mb-2'>
                            No Opportunities Found
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-6'>
                            Be the first to post an opportunity for{' '}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md dark:bg-sky-500 dark:hover:bg-sky-600'
                            aria-label='Post New Opportunity'
                        >
                            Post New Opportunity
                        </button>
                    </div>
                )}
            </section>

            <OpportunityFormModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={loading}
                form={form}
                setForm={setForm}
                editOpportunity={editOpportunity}
            />

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
                message='Are you sure you want to delete this opportunity? This action cannot be undone.'
            />
        </>
    );
};

export default OpportunityClient;
