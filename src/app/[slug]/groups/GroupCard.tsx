import { IWhatsAppGroup } from "@/utils/interface";

export const GroupCard = ({
    group,
    openModal,
    handleDeleteRequest,
    ownerId,
}: {
    group: IWhatsAppGroup;
    openModal: (group: IWhatsAppGroup) => void;
    handleDeleteRequest: (groupId: string) => void;
    ownerId: string;
}) => (
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
            {ownerId === group.owner && (
                <>
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
                </>
            )}
        </div>
    </article>
);
