'use client';
import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import GroupFormModal from './GroupFormModal';
import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import toast from 'react-hot-toast';
import { IPagination, IWhatsAppGroup } from '@/utils/interface';
import { GROUPS_PAGE_SIZE, SEARCH_DEBOUNCE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { GroupCard } from './GroupCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon, Users, X, Loader2 } from 'lucide-react';

const WhatsAppGroupClient = ({
    initialGroups,
    initialPagination,
    collegeName,
}: {
    initialGroups: IWhatsAppGroup[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const [groups, setGroups] = useState<IWhatsAppGroup[]>(initialGroups);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination,
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string>('All');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState<IWhatsAppGroup | null>(null);
    const [form, setForm] = useState({
        title: '',
        link: '',
        info: '',
        domain: '',
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser,
    );
    const ownerId = currentUser?._id;

    // Dynamically derive unique domains from groups data
    const availableDomains = useMemo(() => {
        const domainSet = new Set<string>();
        initialGroups.forEach((g) => {
            if (g.domain?.trim()) {
                domainSet.add(g.domain.trim());
            }
        });
        groups.forEach((g) => {
            if (g.domain?.trim()) {
                domainSet.add(g.domain.trim());
            }
        });
        const list = Array.from(domainSet).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' }),
        );
        return ['All', ...list];
    }, [initialGroups, groups]);

    // Track initial mount and previous filters
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(false);
    const prevFiltersRef = useRef({ search: '', domain: 'All', page: 1 });

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

    // Memoize current filters
    const currentFilters = useMemo(
        () => ({
            search: searchTerm,
            domain: selectedDomain,
            page: page,
        }),
        [searchTerm, selectedDomain, page],
    );

    // Fetch groups from backend
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(GROUPS_PAGE_SIZE),
            });
            const queryParts = [];
            if (searchTerm.trim()) queryParts.push(searchTerm.trim());
            if (selectedDomain !== 'All') queryParts.push(selectedDomain);

            if (queryParts.length > 0) {
                params.append('search', queryParts.join(' '));
            }

            const url = `${api.groups.getGroupsByCollegeSlug(
                collegeName,
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || 'Failed to fetch groups');
            setGroups(data.data.groups || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm, selectedDomain]);

    // Only fetch when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount) return;

        const prevFilters = prevFiltersRef.current;
        const filterChanged =
            prevFilters.search !== currentFilters.search ||
            prevFilters.domain !== currentFilters.domain ||
            prevFilters.page !== currentFilters.page;

        if (filterChanged || forceRefetch) {
            fetchGroups();
            prevFiltersRef.current = currentFilters;
            if (forceRefetch) {
                setForceRefetch(false);
            }
        }
    }, [currentFilters, isInitialMount, fetchGroups, forceRefetch]);

    // Modal logic with useCallback
    const openModal = useCallback(
        (group?: IWhatsAppGroup) => {
            if (!currentUser) {
                toast.error('Please sign in to add groups');
                return;
            }
            setEditGroup(group || null);
            setForm(
                group
                    ? {
                          title: group.title,
                          link: group.link,
                          info: group.info,
                          domain: group.domain,
                      }
                    : { title: '', link: '', info: '', domain: '' },
            );
            setModalOpen(true);
        },
        [currentUser],
    );

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditGroup(null);
        setForm({ title: '', link: '', info: '', domain: '' });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = editGroup ? 'PUT' : 'POST';
            const url = editGroup
                ? api.groups.editGroup(editGroup._id)
                : api.groups.createGroup;
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
                throw new Error(data.message || 'Failed to save group');
            toast.success(editGroup ? 'Group updated!' : 'Group added!');
            closeModal();
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save group');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = useCallback((groupId: string) => {
        setDeleteTargetId(groupId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(api.groups.deleteGroup(deleteTargetId), {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || 'Failed to delete group');
            toast.success('Group deleted!');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setForceRefetch(true);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete group');
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteTargetId]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
    }, []);

    // Pagination controls with useCallback
    const goToPage = useCallback(
        (p: number) => {
            if (pagination && p >= 1 && p <= pagination.totalPages) setPage(p);
        },
        [pagination],
    );

    return (
        <div className='space-y-6'>
            {/* Search & Actions Bar */}
            <section aria-label='Search and Add Group'>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
                    {/* Search Input */}
                    <div className='relative flex-1'>
                        <div className='flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-white dark:bg-[#202020] border border-[#e6e6e6] dark:border-[#2f2f2f] rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-[#0075de]/15 focus-within:border-[#0075de] transition-all'>
                            <SearchIcon className='w-4 h-4 text-[#8c8883] dark:text-[#787672] shrink-0' />
                            <input
                                type='text'
                                placeholder='Search groups by title, domain, or description...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='w-full bg-transparent outline-none text-xs sm:text-sm text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965]'
                                aria-label='Search groups'
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

                    {/* Add Group Button */}
                    <button
                        onClick={() => openModal()}
                        className='inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98] shrink-0'
                        aria-label='Add WhatsApp Group'
                    >
                        <PlusIcon className='w-4 h-4' />
                        <span>Add Group</span>
                    </button>
                </div>

                {/* Dynamic Domain Filter Chips */}
                {availableDomains.length > 1 && (
                    <div className='flex items-center gap-1.5 overflow-x-auto pb-1 mt-3 scrollbar-none'>
                        {availableDomains.map((domain) => {
                            const isSelected = selectedDomain === domain;
                            return (
                                <button
                                    key={domain}
                                    type='button'
                                    onClick={() => {
                                        setSelectedDomain(domain);
                                        setPage(1);
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all duration-150 font-medium ${
                                        isSelected
                                            ? 'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474] font-semibold shadow-xs'
                                            : 'bg-white dark:bg-[#202020] text-[#615d59] dark:text-[#a09e9a] border-[#e6e6e6] dark:border-[#2f2f2f] hover:text-[#101828] dark:hover:text-white hover:bg-[#f6f5f4] dark:hover:bg-[#282828]'
                                    }`}
                                >
                                    {domain}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Groups Grid / List */}
            <section aria-label='Groups List'>
                {loading ? (
                    <div className='flex flex-col items-center justify-center py-20 min-h-[300px]'>
                        <Loader2 className='w-10 h-10 border-3 text-[#0075de] animate-spin mb-3' />
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a]'>
                            Loading community groups...
                        </p>
                    </div>
                ) : groups.length > 0 ? (
                    <>
                        <div className='flex items-center justify-between mb-4'>
                            <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] font-medium'>
                                Showing {groups.length} of{' '}
                                {pagination?.totalItems ?? groups.length} groups
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
                            {groups.map((group) => (
                                <GroupCard
                                    key={group._id}
                                    group={group}
                                    openModal={openModal}
                                    handleDeleteRequest={handleDeleteRequest}
                                    ownerId={ownerId || ''}
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
                    /* Clean Notion Empty State */
                    <div className='text-center py-16 sm:py-20 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] p-8 max-w-lg mx-auto shadow-xs'>
                        <div className='w-14 h-14 bg-[#f6f5f4] dark:bg-[#282828] border border-[#e6e6e6] dark:border-[#383838] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8c8883] dark:text-[#787672]'>
                            <Users className='w-7 h-7' />
                        </div>
                        <h3 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white mb-1.5'>
                            No WhatsApp Groups Found
                        </h3>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] mb-6 max-w-sm mx-auto'>
                            {searchTerm || selectedDomain !== 'All'
                                ? 'No groups match your search criteria. Try adjusting your filters.'
                                : `Be the first to share an active WhatsApp community group for ${capitalizeWords(collegeName)}.`}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='inline-flex items-center gap-2 px-4 py-2.5 bg-[#0075de] hover:bg-[#0062bd] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-[0.98]'
                            aria-label='Add New Group'
                        >
                            <PlusIcon className='w-4 h-4' />
                            <span>Add New Group</span>
                        </button>
                    </div>
                )}
            </section>

            {/* Modals */}
            <GroupFormModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                loading={loading}
                form={form}
                setForm={setForm}
                editGroup={editGroup}
            />
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
                message='Are you sure you want to delete this group? This action cannot be undone.'
            />
        </div>
    );
};

export default WhatsAppGroupClient;
