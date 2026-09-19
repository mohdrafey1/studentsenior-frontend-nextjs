import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface SignOutDialogProps {
    showDialog: boolean;
    onClose: () => void;
    onSignOut: () => void;
    loading: boolean;
}

export default function SignOutDialog({
    showDialog,
    onClose,
    onSignOut,
    loading,
}: SignOutDialogProps) {
    if (!showDialog) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
            <div className='w-full max-w-md bg-white dark:bg-[#1f1f1f] rounded-2xl border border-[#e6e6e6] dark:border-[#2f2f2f] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-200'>
                {/* Header with Danger Icon */}
                <div className='p-6 text-center space-y-3'>
                    <div className='w-12 h-12 rounded-full bg-[#fdf2f2] dark:bg-[#3b1118] text-[#e11d48] dark:text-[#fb7185] border border-[#fcdada] dark:border-[#601925] flex items-center justify-center mx-auto'>
                        <LogOut className='w-6 h-6' />
                    </div>

                    <div className='space-y-1'>
                        <h3 className='text-lg font-bold text-[#101828] dark:text-white'>
                            Sign out of your account?
                        </h3>
                        <p className='text-xs sm:text-sm text-[#615d59] dark:text-[#a09e9a] leading-relaxed max-w-xs mx-auto'>
                            You will need to log back in with your credentials to access your notes, wallet, and saved items.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className='p-4 bg-[#faf9f8] dark:bg-[#242424] border-t border-[#f0eee9] dark:border-[#2a2a2a] flex items-center justify-end gap-2.5'>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className='px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#615d59] dark:text-[#a09e9a] bg-white dark:bg-[#2e2e2e] hover:bg-[#f6f5f4] dark:hover:bg-[#383838] border border-[#e6e6e6] dark:border-[#383838] transition-all shadow-xs'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSignOut}
                        disabled={loading}
                        className='px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#e11d48] hover:bg-[#c9183d] transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5'
                    >
                        {loading ? (
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        ) : (
                            <span>Sign Out</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
