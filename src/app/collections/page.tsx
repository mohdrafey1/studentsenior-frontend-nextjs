import type { Metadata } from 'next';
import CollectionClient from './CollectionClient';

export const metadata: Metadata = {
    title: 'My Collection - Student Senior',
    description:
        'Access all your saved and purchased PYQs, study notes, and college resources in one place.',
    openGraph: {
        title: 'My Collection - Student Senior',
        description:
            'Access all your saved and purchased PYQs, study notes, and college resources in one place.',
    },
};

export default async function CollectionsPage() {
    return (
        <div className='bg-white dark:bg-gray-900'>
            <CollectionClient />
        </div>
    );
}

