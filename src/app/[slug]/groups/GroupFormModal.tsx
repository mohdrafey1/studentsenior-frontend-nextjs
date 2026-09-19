'use client';
import React, { useEffect } from 'react';
import { X, Users, Loader2 } from 'lucide-react';

interface GroupFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    form: { title: string; link: string; info: string; domain: string };
    setForm: (form: {
        title: string;
        link: string;
        info: string;
        domain: string;
    }) => void;
    editGroup: WhatsAppGroup | null;
}

interface WhatsAppGroup {
    _id: string;
    title: string;
    link: string;
    info: string;
    domain: string;
    college?: string;
    owner?: string;
    submissionStatus?: string;
    createdAt?: string;
    updatedAt?: string;
}

const COMMON_DOMAINS = ['Study', 'Placement', 'Coding', 'Events', 'Branch', 'Hostel', 'General'];

const GroupFormModal: React.FC<GroupFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    form,
    setForm,
    editGroup,
}) => {
    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open && !loading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, loading, onClose]);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectDomain = (domain: string) => {
        setForm({ ...form, domain });
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
            onClick={() => {
                if (!loading) onClose();
            }}
        >
            <div
                className='bg-white dark:bg-[#1f1f1f] text-[#101828] dark:text-[#ededed] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className='flex items-start justify-between p-5 sm:p-6 border-b border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                    <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl bg-[#eaf3fd] dark:bg-[#183153]/70 border border-[#d2e4f9]/60 dark:border-[#224474]/60 flex items-center justify-center text-[#0075de] dark:text-[#62aef0] shrink-0'>
                            <Users className='w-5 h-5' />
                        </div>
                        <div>
                            <h2 className='text-base sm:text-lg font-bold text-[#101828] dark:text-white leading-tight'>
                                {editGroup ? 'Edit WhatsApp Group' : 'Add WhatsApp Group'}
                            </h2>
                            <p className='text-xs text-[#615d59] dark:text-[#a39e98] mt-0.5'>
                                Share your community with fellow students
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        aria-label='Close modal'
                        className='p-1.5 rounded-lg text-[#8c8883] dark:text-[#787672] hover:text-[#101828] dark:hover:text-white hover:bg-[#ededeb] dark:hover:bg-[#333333] transition-colors disabled:opacity-50'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={onSubmit}>
                    <div className='p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
                        {/* Title */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'>
                                Group Title <span className='text-[#e11d48]'>*</span>
                            </label>
                            <input
                                type='text'
                                name='title'
                                placeholder='e.g. CSE 2026 Batch, Coding Club'
                                value={form.title}
                                onChange={handleChange}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                required
                            />
                        </div>

                        {/* Domain / Category */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'>
                                Domain / Category <span className='text-[#e11d48]'>*</span>
                            </label>
                            <input
                                type='text'
                                name='domain'
                                placeholder='e.g. Study, Placement, Events'
                                value={form.domain}
                                onChange={handleChange}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all mb-2'
                                required
                            />
                            {/* Domain Suggestion Chips */}
                            <div className='flex flex-wrap gap-1.5'>
                                {COMMON_DOMAINS.map((dom) => (
                                    <button
                                        key={dom}
                                        type='button'
                                        onClick={() => handleSelectDomain(dom)}
                                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                                            form.domain.toLowerCase() === dom.toLowerCase()
                                                ? 'bg-[#eaf3fd] dark:bg-[#183153] text-[#0075de] dark:text-[#62aef0] border-[#d2e4f9] dark:border-[#224474] font-semibold'
                                                : 'bg-[#faf9f8] dark:bg-[#262626] text-[#615d59] dark:text-[#a39e98] border-[#e6e6e6] dark:border-[#2f2f2f] hover:text-[#101828] dark:hover:text-white'
                                        }`}
                                    >
                                        {dom}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp Link */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'>
                                WhatsApp Invite Link <span className='text-[#e11d48]'>*</span>
                            </label>
                            <input
                                type='url'
                                name='link'
                                placeholder='https://chat.whatsapp.com/...'
                                value={form.link}
                                onChange={handleChange}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all'
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-xs font-semibold text-[#615d59] dark:text-[#a39e98] uppercase tracking-wider mb-1.5'>
                                Description <span className='text-[#e11d48]'>*</span>
                            </label>
                            <textarea
                                name='info'
                                placeholder='Briefly explain the purpose and guidelines of this group...'
                                value={form.info}
                                onChange={handleChange}
                                rows={3}
                                className='w-full p-2.5 sm:p-3 text-xs sm:text-sm bg-[#faf9f8] dark:bg-[#181818] border border-[#e6e6e6] dark:border-[#2f2f2f] text-[#101828] dark:text-[#ededed] placeholder-[#8c8883] dark:placeholder-[#6b6965] rounded-xl focus:outline-none focus:border-[#0075de] dark:focus:border-[#62aef0] focus:ring-2 focus:ring-[#0075de]/15 transition-all resize-none'
                                required
                                minLength={10}
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className='flex items-center justify-end gap-2.5 p-4 sm:p-5 border-t border-[#f0eee6] dark:border-[#2a2a2a] bg-[#faf9f8] dark:bg-[#242424]'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={loading}
                            className='px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#615d59] dark:text-[#a39e98] hover:text-[#101828] dark:hover:text-white bg-white dark:bg-[#202020] hover:bg-[#f0eee6] dark:hover:bg-[#2b2b2b] border border-[#e6e6e6] dark:border-[#2f2f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className='inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0075de] hover:bg-[#0062bd] disabled:opacity-50 shadow-xs active:scale-[0.98] transition-all disabled:cursor-not-allowed'
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{editGroup ? 'Update Group' : 'Add Group'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupFormModal;
