'use client';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    // const [jumpToPage, setJumpToPage] = React.useState("");

    // const handleJumpToPage = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const pageNumber = parseInt(jumpToPage);
    //     if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
    //         onPageChange(pageNumber);
    //         setJumpToPage("");
    //     }
    // };

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const visiblePages = 3; // Show only 3 page numbers

        if (currentPage <= visiblePages) {
            // At the start
            for (let i = 1; i <= visiblePages; i++) {
                if (i <= totalPages) pages.push(i);
            }
            if (totalPages > visiblePages) {
                pages.push('...');
                pages.push(totalPages);
            }
        } else if (currentPage > totalPages - visiblePages) {
            // At the end
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - visiblePages + 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // In the middle
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        }

        return pages.map((p, index) => {
            if (p === '...') {
                return (
                    <span
                        key={`ellipsis-${index}`}
                        className='px-2 text-gray-700 dark:text-gray-200'
                    >
                        {p}
                    </span>
                );
            }
            return (
                <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    className={`px-4 hover:bg-sky-300 dark:hover:bg-gray-500 py-2 rounded-2xl transition-colors  duration-200 ${
                        p === currentPage
                            ? 'bg-sky-500 text-white dark:bg-sky-400 dark:text-gray-900'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                    aria-label={`Page ${p}`}
                >
                    {p}
                </button>
            );
        });
    };

    return (
        <nav
            className='flex flex-wrap justify-center items-center gap-2 mt-8'
            aria-label='Pagination'
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-4 hover:bg-sky-300 dark:hover:bg-gray-500 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50'
                aria-label='Previous page'
            >
                Prev
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-4 hover:bg-sky-300 dark:hover:bg-gray-500 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50'
                aria-label='Next page'
            >
                Next
            </button>
            {/* <form
                onSubmit={handleJumpToPage}
                className="flex items-center gap-2 ml-2"
            >
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Page"
                    aria-label="Jump to page"
                />
                <button
                    type="submit"
                    className="px-3 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-400 dark:text-gray-900"
                >
                    Go
                </button>
            </form> */}
        </nav>
    );
};

export default Pagination;
