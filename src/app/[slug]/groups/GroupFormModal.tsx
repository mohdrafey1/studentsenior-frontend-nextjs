'use client';
import React from 'react';

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

const GroupFormModal: React.FC<GroupFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    form,
    setForm,
    editGroup,
}) => {
    if (!open) return null;
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-70'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg relative'>
                <button
                    className='absolute text-4xl top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100'
                    onClick={onClose}
                    aria-label='Close modal'
                >
                    &times;
                </button>
                <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-white'>
                    {editGroup ? 'Edit Group' : 'Add Group'}
                </h2>
                <form onSubmit={onSubmit} className='space-y-4'>
                    <input
                        type='text'
                        name='title'
                        placeholder='Group Title'
                        value={form.title}
                        onChange={handleChange}
                        className='w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        required
                        aria-label='Group Title'
                    />
                    <input
                        type='text'
                        name='domain'
                        placeholder='Domain (e.g. Study, Events)'
                        value={form.domain}
                        onChange={handleChange}
                        className='w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        required
                        aria-label='Domain'
                    />
                    <input
                        type='url'
                        name='link'
                        placeholder='WhatsApp Group Link'
                        value={form.link}
                        onChange={handleChange}
                        className='w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        required
                        aria-label='WhatsApp Group Link'
                    />
                    <textarea
                        name='info'
                        placeholder='Description'
                        value={form.info}
                        onChange={handleChange}
                        className='w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        required
                        aria-label='Description'
                        minLength={10}
                    />
                    <button
                        type='submit'
                        className='w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg py-2 dark:bg-sky-500 dark:hover:bg-sky-600'
                        disabled={loading}
                        aria-label={editGroup ? 'Update Group' : 'Add Group'}
                    >
                        {loading
                            ? 'Saving...'
                            : editGroup
                              ? 'Update Group'
                              : 'Add Group'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupFormModal;
