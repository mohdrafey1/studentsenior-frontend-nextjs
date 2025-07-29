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
import { GroupCard } from "./GroupCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PlusIcon, SearchIcon } from "lucide-react";

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

    return (
        <>
            <section className="mb-8" aria-label="Search and Add Group">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex gap-3 w-full sm:w-2/3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-800 dark:text-white transition-all">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-transparent outline-none"
                            aria-label="Search groups"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex gap-3 w-full sm:w-1/3 p-3 justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600"
                    >
                        <PlusIcon />
                        <span> Add Group</span>
                    </button>
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
                                <GroupCard
                                    key={group._id}
                                    group={group}
                                    openModal={openModal}
                                    handleDeleteRequest={handleDeleteRequest}
                                    ownerId={ownerId || ""}
                                />
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
        </>
    );
};

export default WhatsAppGroupClient;
