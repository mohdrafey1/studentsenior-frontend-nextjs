'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/config/apiUrls';
import toast from 'react-hot-toast';
import { IPagination, ISenior, ICourse, IBranch } from '@/utils/interface';
import { SEARCH_DEBOUNCE, SENIOR_PAGE_SIZE } from '@/constant';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import PaginationComponent from '@/components/Common/Pagination';
import { SeniorCard } from './SeniorCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PlusIcon, SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import SeniorFormModal, { SeniorFormData } from './SeniorFormModal';
import { capitalizeWords } from '@/utils/formatting';
import SearchableSelect from '@/components/Common/SearchableSelect';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SeniorClient = ({
    initialSeniors,
    initialPagination,
    collegeName,
}: {
    initialSeniors: ISenior[];
    initialPagination: IPagination;
    collegeName: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [seniors, setSeniors] = useState<ISenior[]>(initialSeniors);
    const [pagination, setPagination] = useState<IPagination | null>(
        initialPagination
    );
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get('search') || ''
    );
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || ''
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get('course') || ''
    );
    const [branchFilter, setBranchFilter] = useState(
        searchParams.get('branch') || ''
    );
    const [yearFilter, setYearFilter] = useState(
        searchParams.get('year') || ''
    );
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editSenior, setEditSenior] = useState<ISenior | null>(null);
    const [form, setForm] = useState({
        name: '',
        domain: '',
        branch: '',
        year: '',
        profilePicture: '',
        socialMediaLinks: [] as { platform: string; url: string }[],
        description: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    // Course and Branch data
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    );

    const ownerId = currentUser?._id;

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch branches when course filter changes
    useEffect(() => {
        if (courseFilter) {
            fetchBranches(courseFilter);
        } else {
            setBranches([]);
        }
    }, [courseFilter]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await fetch(api.resources.getCourses);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            setCourses(data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchBranches = async (courseCode: string) => {
        setLoadingBranches(true);
        try {
            const response = await fetch(api.resources.getBranches(courseCode));
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch branches');
            }

            setBranches(data.data || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to fetch branches');
        } finally {
            setLoadingBranches(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams();

        if (searchTerm) params.set('search', searchTerm);
        if (courseFilter) params.set('course', courseFilter);
        if (branchFilter) params.set('branch', branchFilter);
        if (yearFilter) params.set('year', yearFilter);
        if (page > 1) params.set('page', String(page));

        // Only push to history if params have changed
        if (params.toString() !== searchParams.toString()) {
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [
        searchTerm,
        courseFilter,
        branchFilter,
        yearFilter,
        page,
        pathname,
        router,
        searchParams,
    ]);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Reset to first page on new search
        }, SEARCH_DEBOUNCE);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Fetch seniors from backend - now uses URL params
    const fetchSeniors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(SENIOR_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            if (branchFilter) params.append('branch', branchFilter);
            if (yearFilter) params.append('year', yearFilter);

            const url = `${api.seniors.getSeniorsByCollegeSlug(
                collegeName
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || 'Failed to fetch seniors');

            setSeniors(data.data.seniors || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to fetch seniors');
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm, branchFilter, yearFilter]);

    useEffect(() => {
        fetchSeniors();
    }, [fetchSeniors]);

    const openModal = (senior?: ISenior) => {
        if (!currentUser) {
            toast.error('Please sign in to add senior profile');
            return;
        }
        setEditSenior(senior || null);
        setForm(
            senior
                ? {
                      name: senior.name,
                      domain: senior.domain || '',
                      branch: senior.branch._id,
                      year: senior.year,
                      profilePicture: senior.profilePicture || '',
                      socialMediaLinks: senior.socialMediaLinks || [],
                      description: senior.description || '',
                  }
                : {
                      name: '',
                      domain: '',
                      branch: '',
                      year: '',
                      profilePicture: '',
                      socialMediaLinks: [],
                      description: '',
                  }
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditSenior(null);
        setForm({
            name: '',
            domain: '',
            branch: '',
            year: '',
            profilePicture: '',
            socialMediaLinks: [],
            description: '',
        });
    };

    const handleSubmit = async (formData: SeniorFormData) => {
        setLoading(true);
        try {
            const method = editSenior ? 'PUT' : 'POST';

            const url = editSenior
                ? api.seniors.editSenior(editSenior._id)
                : api.seniors.createSenior;

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
                throw new Error(
                    data.message || 'Failed to save senior profile'
                );
            }

            toast.success(
                data.message ||
                    (editSenior
                        ? 'Senior profile updated!'
                        : 'Senior profile added!')
            );
            closeModal();
            fetchSeniors();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to save senior profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (seniorId: string) => {
        setDeleteTargetId(seniorId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch(
                api.seniors.deleteSenior(deleteTargetId),
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to delete senior profile'
                );
            }

            toast.success('Senior profile deleted successfully');
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            fetchSeniors();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error('Failed to delete senior profile');
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

    const courseOptions = courses.map((course) => ({
        value: course.courseCode,
        label: course.courseName,
    }));

    return (
        <>
            {/* Header with Add Button */}
            <section className='mb-8' aria-label='Search and Add Senior'>
                <div className='flex flex-col gap-4'>
                    {/* Search and Add Button Row */}
                    <div className='flex flex-col sm:flex-row gap-4 w-full'>
                        {/* Search Input */}
                        <div className='relative flex-grow'>
                            <div className='flex gap-3 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 dark:bg-gray-800 text-black dark:text-white transition-all'>
                                <SearchIcon className='w-5 h-5 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Search seniors...'
                                    value={searchInput}
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    className='w-full bg-transparent outline-none text-black dark:text-white'
                                />
                            </div>
                        </div>

                        {/* Filter Toggle Button (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className='sm:hidden flex items-center text-black dark:text-white justify-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                        >
                            <FilterIcon className='w-4 h-4' />
                            Filters
                            {showFilters ? <XIcon className='w-4 h-4' /> : null}
                        </button>

                        {/* Add Senior Button */}
                        <button
                            onClick={() => openModal()}
                            className='flex gap-3 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                        >
                            <PlusIcon className='w-4 h-4' />
                            <span className='whitespace-nowrap'>
                                Add Senior
                            </span>
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div
                        className={`${
                            showFilters ? 'block' : 'hidden'
                        } sm:block`}
                    >
                        <div className='flex flex-col sm:flex-row gap-4'>
                            {/* Course Filter */}
                            <div className='w-full sm:w-1/3 text-black dark:text-white'>
                                <SearchableSelect
                                    options={courseOptions}
                                    value={courseFilter}
                                    onChange={(value) => {
                                        setCourseFilter(value);
                                        setBranchFilter(''); // Reset branch when course changes
                                    }}
                                    placeholder='Select Course'
                                    loading={loadingCourses}
                                    required={true}
                                />
                            </div>

                            {/* Branch Filter */}
                            <div className='w-full sm:w-1/3 text-black dark:text-white'>
                                {courseFilter ? (
                                    <SearchableSelect
                                        options={branches.map((branch) => ({
                                            value: branch._id,
                                            label: branch.branchName,
                                        }))}
                                        value={branchFilter}
                                        onChange={(value) =>
                                            setBranchFilter(value)
                                        }
                                        placeholder='Select Branch'
                                        loading={loadingBranches}
                                        required={true}
                                        disabled={!courseFilter}
                                    />
                                ) : (
                                    <div className='p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
                                        Select a course first
                                    </div>
                                )}
                            </div>

                            {/* Year Filter */}
                            <div className='w-full sm:w-1/4 text-black dark:text-white'>
                                <select
                                    value={yearFilter}
                                    onChange={(e) =>
                                        setYearFilter(e.target.value)
                                    }
                                    className='w-full p-3 bg-transparent outline-none border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all'
                                >
                                    <option value=''>All Years</option>
                                    <option value='1st Year'>1st Year</option>
                                    <option value='2nd Year'>2nd Year</option>
                                    <option value='3rd Year'>3rd Year</option>
                                    <option value='4th Year'>4th Year</option>
                                    <option value='5th Year'>5th Year</option>
                                    <option value='Alumni'>Alumni</option>
                                </select>
                            </div>

                            {/* Clear Filters Button */}
                            <div className='w-full sm:w-auto'>
                                <button
                                    className='w-full h-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-all'
                                    onClick={() => {
                                        setCourseFilter('');
                                        setBranchFilter('');
                                        setYearFilter('');
                                        setSearchInput('');
                                        setSearchTerm('');
                                        setPage(1);
                                    }}
                                >
                                    <XIcon className='w-4 h-4' />
                                    <span className='whitespace-nowrap'>
                                        Clear Filters
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label='Seniors List'>
                {/* Loading State */}
                {loading ? (
                    <div className='text-center py-10 text-gray-700 dark:text-gray-200'>
                        Loading...
                    </div>
                ) : seniors.length > 0 ? (
                    <>
                        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
                            Showing {seniors.length} of{' '}
                            {pagination?.totalItems ?? 0} seniors
                        </p>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {seniors.map((senior) => (
                                <SeniorCard
                                    key={senior._id}
                                    senior={senior}
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
                        <i className='fas fa-users text-5xl text-gray-400 mb-4'></i>
                        <h3 className='text-xl font-medium text-gray-700 dark:text-gray-200 mb-2'>
                            No Seniors Found
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-6'>
                            Be the first to add your senior profile in{' '}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className='px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md dark:bg-sky-500 dark:hover:bg-sky-600'
                            aria-label='Add New Senior'
                        >
                            Add New Senior
                        </button>
                    </div>
                )}
            </section>

            {/* Form Modal */}
            <SeniorFormModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editSenior={editSenior}
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
                message='Are you sure you want to delete this senior profile? This action cannot be undone.'
            />
        </>
    );
};

export default SeniorClient;
