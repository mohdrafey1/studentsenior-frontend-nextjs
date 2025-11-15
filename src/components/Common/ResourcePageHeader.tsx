import React from 'react';
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    XIcon,
    TrendingUp,
} from 'lucide-react';
import { ViewToggle } from './ViewToggle';

interface ResourcePageHeaderProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
    hasActiveFilters: boolean;
    activeFilterCount?: number;
    clearFilters: () => void;
    onAdd?: () => void;
    onShowEarning?: () => void;
    addButtonText: string;
    searchPlaceholder: string;
    viewMode: 'list' | 'grid';
    setViewMode: (mode: 'list' | 'grid') => void;
}

export const ResourcePageHeader: React.FC<ResourcePageHeaderProps> = ({
    searchInput,
    setSearchInput,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    onAdd,
    onShowEarning,
    addButtonText,
    searchPlaceholder,
    viewMode,
    setViewMode,
}) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-center gap-4'>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='flex gap-3 w-full p-3 justify-center items-center bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg dark:bg-gray-500 dark:hover:bg-gray-600'
                >
                    <FilterIcon className='w-4 h-4' />
                    Filters
                    {hasActiveFilters &&
                        activeFilterCount !== undefined &&
                        activeFilterCount > 0 && (
                            <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full'>
                                {activeFilterCount}
                            </span>
                        )}
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className='inline-flex items-center p-3 rounded-lg bg-red-200 gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400'
                    >
                        <XIcon className='w-4 h-4' />
                        Clear
                    </button>
                )}
            </div>

            <div className='relative flex-grow'>
                <div className='flex gap-3 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 dark:bg-gray-800 dark:text-white transition-all'>
                    <SearchIcon className='w-5 h-5 text-gray-400' />
                    <input
                        type='text'
                        placeholder={searchPlaceholder}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='w-full bg-transparent outline-none text-black dark:text-white'
                    />
                </div>
            </div>

            {onShowEarning && (
                <button
                    onClick={onShowEarning}
                    className='flex gap-3 w-full sm:w-auto p-3 justify-center items-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600'
                    title='Learn how to earn points'
                >
                    <TrendingUp className='w-4 h-4' />
                    <span className='hidden sm:inline'>How to Earn</span>
                </button>
            )}

            {onAdd && (
                <button
                    onClick={onAdd}
                    className='flex gap-3 w-full sm:w-auto p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600'
                >
                    <PlusIcon className='w-4 h-4' />
                    {addButtonText}
                </button>
            )}
            {/* View Mode Toggle */}
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
    );
};
