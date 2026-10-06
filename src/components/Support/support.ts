// Shared types, labels and requests for support tickets.

export type TicketStatus =
    | 'pending'
    | 'in-progress'
    | 'awaiting-user'
    | 'resolved'
    | 'closed';

export interface TicketSummary {
    _id: string;
    ticketNumber: number | null;
    subject: string;
    category: string;
    status: TicketStatus;
    unread: number;
    lastMessagePreview: string;
    lastMessageAt: string;
    createdAt: string;
}

export interface TicketMessage {
    _id: string;
    author: 'user' | 'staff';
    authorName: string;
    body: string;
    createdAt: string;
}

export interface Ticket extends TicketSummary {
    canReply: boolean;
    messages: TicketMessage[];
}

export const CATEGORIES = [
    { value: 'account', label: 'Account & sign-in' },
    { value: 'payment', label: 'Payments & premium' },
    { value: 'content-request', label: 'Request notes or PYQs' },
    { value: 'content-report', label: 'Problem with a note or PYQ' },
    { value: 'bug', label: 'Something isn’t working' },
    { value: 'feedback', label: 'Idea or feedback' },
    { value: 'other', label: 'Something else' },
];

export const CATEGORY_LABELS: Record<string, string> = {
    ...Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])),
};

export const STATUS_META: Record<
    TicketStatus,
    { label: string; className: string }
> = {
    pending: {
        label: 'Waiting for support',
        className:
            'bg-[#fff4e5] text-[#a5560a] dark:bg-[#3a2a12] dark:text-[#f5b45c]',
    },
    'in-progress': {
        label: 'In progress',
        className:
            'bg-[#eaf3fd] text-[#0060b9] dark:bg-[#183153] dark:text-[#62aef0]',
    },
    'awaiting-user': {
        label: 'Waiting for your reply',
        className:
            'bg-[#f0ebf8] text-[#7a35c2] dark:bg-[#2b1f3d] dark:text-[#c084fc]',
    },
    resolved: {
        label: 'Resolved',
        className:
            'bg-[#eaf7ec] text-[#16852f] dark:bg-[#163821] dark:text-[#4ade80]',
    },
    closed: {
        label: 'Closed',
        className:
            'bg-[#f1f0ee] text-[#615d59] dark:bg-[#2a2a2a] dark:text-[#a39e98]',
    },
};

export const OPEN_STATUSES: TicketStatus[] = [
    'pending',
    'in-progress',
    'awaiting-user',
];

export const ticketRef = (ticket: { ticketNumber: number | null }) =>
    ticket.ticketNumber ? `#${ticket.ticketNumber}` : 'Request';

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

/** "6 Oct, 13:35" (with the year when it isn't this year). */
export function formatWhen(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year =
        date.getFullYear() === new Date().getFullYear()
            ? ''
            : ` ${date.getFullYear()}`;
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${date.getDate()} ${MONTHS[date.getMonth()]}${year}, ${time}`;
}

/** "just now", "12 min ago", "3 h ago", or a date for anything older. */
export function timeAgo(value: string) {
    const minutes = Math.floor(
        (Date.now() - new Date(value).getTime()) / 60000,
    );
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} h ago`;
    if (minutes < 48 * 60) return 'yesterday';
    return formatWhen(value).split(',')[0];
}

/** A support API call with the session cookie; throws the API's message on failure. */
export async function supportRequest<T>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const response = await fetch(url, {
        ...init,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...init.headers },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.success) {
        throw Object.assign(
            new Error(
                body?.message || 'Something went wrong. Please try again.',
            ),
            { status: response.status },
        );
    }
    return body.data as T;
}
