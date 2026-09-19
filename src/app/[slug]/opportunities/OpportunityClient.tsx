'use client';

import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    useMemo,
} from 'react';
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
import { PlusIcon, SearchIcon, Briefcase, X, Loader2 } from 'lucide-react';
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

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchOpportunities();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchOpportunities, forceRefetch]);

    // Modal logic
    const openModal = useCallback(
        (opportunity?: IOpportunity) => {
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
        },
        [currentUser],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditOpportunity(null);
        setForm({
            name: '',
            description: '',
            email: '',
            whatsapp: '',
            link: '',
        });
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
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
                    throw new Error(
                        data.message || 'Failed to save opportunity',
                    );

                toast.success(
                    data.message ||
                        (editOpportunity
                            ? 'Opportunity updated!'
                            : 'Opportunity added!'),
                    { duration: 5000 },
                );

                closeModal();
                setForceRefetch(true);
            } catch (error: unknown) {
                if (error instanceof Error) toast.error(error.message);
                else toast.error('Failed to save opportunity');
            } finally {
                setLoading(false);
            }
        },
        [editOpportunity, collegeName, closeModal, form],
    );

    const handleDeleteRequest = useCallback((opportunityId: string) => {
        setDeleteTargetId(opportunityId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
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
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete opportunity');
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
            {/* Search and Action Bar */}
            <section aria-label='Search and Add Opportunity'>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
                    {/* Search Bar */}
                    <div className='relative flex-1'>
                        <div className='flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-[#0075de]/15 focus-within:border-[#0075de] transition-all'>
                            <SearchIcon className='w-4 h-4 text-[#8c8883] dark:text-[#787672] shrink-0' />
                            <input
                                type='text'
                                placeholder='Search opportunities by title or description...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965]'
                                aria-label='Search opportunities'
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

                    {/* Post Opportunity Button */}
                    <button
                        onClick={() => openModal()}
                        className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0'
                        aria-label='Post Career Opportunity'
                    >
                        <PlusIcon className='w-4 h-4' />
                        <span>Post Opportunity</span>
                    </button>
                </div>
            </section>

            {/* Opportunities List Section */}
            <section aria-label='Opportunities List'>
                {loading ? (
                    <div className='flex flex-col items-center justify-center py-20 min-h-[300px]'>
                        <Loader2 className='w-10 h-10 border-3 text-[#0075de] animate-spin mb-3' />
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                            Loading opportunities...
                        </p>
                    </div>
                ) : opportunities.length > 0 ? (
                    <>
                        <div className='flex items-center justify-between mb-4'>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] font-medium'>
                                Showing {opportunities.length} of{' '}
                                {pagination?.totalItems ?? opportunities.length}{' '}
                                opportunities
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
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

                        {/* Pagination Controls */}
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
                            <Briefcase className='w-7 h-7' />
                        </div>
                        <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5'>
                            No Opportunities Found
                        </h3>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mb-6 max-w-sm mx-auto'>
                            {searchTerm
                                ? 'No opportunities match your search criteria. Try a different query.'
                                : `Be the first to post an internship or career opportunity for ${capitalizeWords(collegeName)}.`}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='inline-flex items-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
                            aria-label='Post New Opportunity'
                        >
                            <PlusIcon className='w-4 h-4' />
                            <span>Post Opportunity</span>
                        </button>
                    </div>
                )}
            </section>

            {/* Modals */}
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
        </div>
    );
};

export default OpportunityClient;
