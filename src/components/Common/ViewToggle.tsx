import React from 'react';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
    viewMode,
    setViewMode,
}) => {
    return (
        <div className='flex justify-end'>
            <div className='flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                            ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    aria-label='Grid view'
                    title='Grid view'
                >
                    <Grid3X3 className='w-4 h-4' />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                            ? 'bg-white dark:bg-gray-600 text-sky-600 dark:text-sky-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    aria-label='List view'
                    title='List view'
                >
                    <List className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
};
