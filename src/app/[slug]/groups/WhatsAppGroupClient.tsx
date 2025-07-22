"use client";
import React, { useEffect, useState, useCallback } from "react";
import GroupFormModal from "./GroupFormModal";
import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import toast from "react-hot-toast";
import { IPagination, IWhatsAppGroup } from "@/utils/interface";
import { GROUPS_PAGE_SIZE, SEARCH_DEBOUNCE } from "@/constant";
import DeleteConfirmationModal from "@/components/Common/DeleteConfirmationModal";
import PaginationComponent from "@/components/Common/Pagination";

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
        initialPagination
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState<IWhatsAppGroup | null>(null);
    const [form, setForm] = useState({
        title: "",
        link: "",
        info: "",
        domain: "",
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Reset to first page on new search
        }, SEARCH_DEBOUNCE);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Fetch groups from backend
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(GROUPS_PAGE_SIZE),
            });
            if (searchTerm.trim()) params.append("search", searchTerm.trim());
            const url = `${api.groups.getGroupsByCollegeSlug(
                collegeName
            )}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to fetch groups");
            setGroups(data.data.groups || []);
            setPagination(data.data.pagination || null);
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error("Failed to fetch groups");
        } finally {
            setLoading(false);
        }
    }, [collegeName, page, searchTerm]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Modal logic
    const openModal = (group?: IWhatsAppGroup) => {
        setEditGroup(group || null);
        setForm(
            group
                ? {
                      title: group.title,
                      link: group.link,
                      info: group.info,
                      domain: group.domain,
                  }
                : { title: "", link: "", info: "", domain: "" }
        );
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setEditGroup(null);
        setForm({ title: "", link: "", info: "", domain: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = editGroup ? "PUT" : "POST";
            const url = editGroup
                ? api.groups.editGroup(editGroup._id)
                : api.groups.createGroup;
            const body = {
                ...form,
                ...(method === "POST" && { college: collegeName }),
            };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to save group");
            toast.success(editGroup ? "Group updated!" : "Group added!");
            closeModal();
            fetchGroups();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error("Failed to save group");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (groupId: string) => {
        setDeleteTargetId(groupId);
        setDeleteModalOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(api.groups.deleteGroup(deleteTargetId), {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to delete group");
            toast.success("Group deleted!");
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            fetchGroups();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error("Failed to delete group");
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

    // Inline GroupCard component
    const GroupCard = ({ group }: { group: IWhatsAppGroup }) => (
        <article
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full border border-gray-100 dark:border-gray-700"
            aria-label={group.title}
        >
            <div className="mb-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-100 dark:bg-sky-900 dark:text-sky-300 rounded-full mb-3">
                    {group.domain}
                </span>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                    {group.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                    {group.info}
                </p>
            </div>
            <div className="mt-auto flex gap-2">
                <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow transition-all dark:bg-sky-600 dark:hover:bg-sky-700"
                    aria-label={`Join WhatsApp group: ${group.title}`}
                >
                    <i className="fa-brands fa-whatsapp text-lg mr-2"></i>
                    Join Group
                </a>
                <button
                    onClick={() => openModal(group)}
                    className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900"
                    aria-label={`Edit group: ${group.title}`}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteRequest(group._id)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg dark:bg-red-600 dark:hover:bg-red-700"
                    aria-label={`Delete group: ${group.title}`}
                >
                    Delete
                </button>
            </div>
        </article>
    );

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="text-center mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                    WhatsApp Groups - {capitalizeWords(collegeName)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                    Connect with peers, share resources, and stay updated with
                    the latest information through these WhatsApp groups.
                </p>
            </header>
            <section className="mb-8" aria-label="Search and Add Group">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-2/3">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all"
                            aria-label="Search groups"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => openModal()}
                            className="flex-1 sm:flex-none p-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600"
                            aria-label="Add Group"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Group
                        </button>
                    </div>
                </div>
            </section>
            <section aria-label="Groups List">
                {loading ? (
                    <div className="text-center py-10 text-gray-700 dark:text-gray-200">
                        Loading...
                    </div>
                ) : groups.length > 0 ? (
                    <>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            Showing {groups.length} of{" "}
                            {pagination?.totalItems ?? 0} groups
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group) => (
                                <GroupCard key={group._id} group={group} />
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        <PaginationComponent
                            currentPage={page}
                            totalPages={pagination?.totalPages || 1}
                            onPageChange={goToPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <i className="fas fa-users-slash text-5xl text-gray-400 mb-4"></i>
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                            No Groups Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Be the first to add a WhatsApp group for{" "}
                            {capitalizeWords(collegeName)}
                        </p>
                        <button
                            onClick={() => openModal()}
                            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md dark:bg-sky-500 dark:hover:bg-sky-600"
                            aria-label="Add New Group"
                        >
                            Add New Group
                        </button>
                    </div>
                )}
            </section>
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
                message="Are you sure you want to delete this group? This action cannot be undone."
            />
        </main>
    );
};

export default WhatsAppGroupClient;
