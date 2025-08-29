import { UserDataState } from "@/redux/slices/userDataSlice";
import { formatDate } from "@/utils/formatting";
import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface TransactionsTabProps {
    transactions: UserDataState["userTransaction"];
}

export default function TransactionsTab({
    transactions,
}: TransactionsTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterType, setFilterType] = useState<string>("all");

    // Filter transactions based on selected type
    const filteredTransactions =
        transactions?.filter((transaction) => {
            if (filterType === "all") return true;
            if (filterType === "income") {
                return [
                    "earn",
                    "bonus",
                    "add-point",
                    "pyq-sale",
                    "note-sale",
                ].includes(transaction.type);
            }
            if (filterType === "expense") {
                return ![
                    "earn",
                    "bonus",
                    "add-point",
                    "pyq-sale",
                    "note-sale",
                ].includes(transaction.type);
            }
            return transaction.type === filterType;
        }) || [];

    // Calculate pagination
    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = filteredTransactions.slice(
        startIndex,
        endIndex
    );

    // Reset to first page when filter changes
    const handleFilterChange = (newFilter: string) => {
        setFilterType(newFilter);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getTransactionIcon = (type: string) => {
        const isIncome = [
            "earn",
            "bonus",
            "add-point",
            "pyq-sale",
            "note-sale",
        ].includes(type);
        return isIncome ? (
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
        );
    };

    const getTransactionTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            earn: "Earned",
            bonus: "Bonus",
            "add-point": "Points Added",
            "pyq-sale": "PYQ Sale",
            "note-sale": "Note Sale",
        };
        return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                            Transaction History
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Showing {startIndex + 1}-
                            {Math.min(endIndex, totalItems)} of {totalItems}{" "}
                            transactions
                        </p>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="earn">Earned</option>
                            <option value="bonus">Bonus</option>
                            <option value="pyq-sale">PYQ Sales</option>
                            <option value="note-sale">Note Sales</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="p-4 sm:p-6">
                {currentTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {currentTransactions.map((transaction) => {
                            const isIncome = [
                                "earn",
                                "bonus",
                                "add-point",
                                "pyq-sale",
                                "note-sale",
                            ].includes(transaction.type);

                            return (
                                <div
                                    key={transaction.id}
                                    className="group p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                                >
                                    {/* Mobile Layout */}
                                    <div className="block sm:hidden">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getTransactionIcon(
                                                    transaction.type
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getTransactionTypeLabel(
                                                            transaction.type
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {
                                                            transaction.resourceType
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${
                                                    isIncome
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {isIncome ? "+" : "-"}₹
                                                {transaction.points}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </span>
                                            <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                                ID: {transaction.resourceId}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden sm:flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getTransactionIcon(
                                                transaction.type
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {getTransactionTypeLabel(
                                                        transaction.type
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {transaction.resourceType}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-300 text-center min-w-[100px]">
                                            {formatDate(transaction.createdAt)}
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center min-w-[80px] font-mono">
                                            {transaction.resourceId}
                                        </div>

                                        <div className="text-right min-w-[100px]">
                                            <span
                                                className={`text-lg font-bold ${
                                                    isIncome
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}
                                            >
                                                {isIncome ? "+" : "-"}₹
                                                {transaction.points}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No transactions found for the selected filter
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Items per page selector */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            <span>Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>per page</span>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="p-1 sm:p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-1">
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (
                                            currentPage >=
                                            totalPages - 2
                                        ) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    handlePageChange(pageNum)
                                                }
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="p-1 sm:p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Page Info */}
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
