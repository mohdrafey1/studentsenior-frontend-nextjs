import { STATUS_META, TicketStatus } from './support';

export default function StatusBadge({ status }: { status: TicketStatus }) {
    const meta = STATUS_META[status] || STATUS_META.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${meta.className}`}
        >
            <span
                className='w-1.5 h-1.5 rounded-full bg-current'
                aria-hidden='true'
            />
            {meta.label}
        </span>
    );
}
