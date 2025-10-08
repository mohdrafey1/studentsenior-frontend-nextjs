import React from 'react';
import { api } from '@/config/apiUrls';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LostFoundDetailClient from './LostFoundDetailClient';

interface LostFoundPageProps {
    params: Promise<{
        'lostfound-slug': string;
    }>;
}

export async function generateMetadata({
    params,
}: LostFoundPageProps): Promise<Metadata> {
    const { 'lostfound-slug': lostFoundSlug } = await params;

    try {
        const res = await fetch(
            `${api.lostFound.getLostFoundBySlug(lostFoundSlug)}`,
            {
                cache: 'no-store',
            },
        );
        const data = await res.json();
        const lostFoundItem = data?.data;

        if (!lostFoundItem) {
            return {
                title: 'Item Not Found',
                description:
                    'The requested lost and found item could not be found.',
            };
        }

        return {
            title: `${lostFoundItem.title} - Student Senior`,
            description: lostFoundItem.description.slice(0, 160),
        };
    } catch (error) {
        console.log(error);
        return {
            title: 'Lost & Found - Student Senior',
            description: 'View lost and found item details',
        };
    }
}

export default async function LostFoundPage({ params }: LostFoundPageProps) {
    const { 'lostfound-slug': lostFoundSlug } = await params;

    const res = await fetch(
        `${api.lostFound.getLostFoundBySlug(lostFoundSlug)}`,
        {
            cache: 'no-store',
        },
    );
    const data = await res.json();

    if (!res.ok || !data?.data) {
        notFound();
    }

    return <LostFoundDetailClient lostFoundItem={data.data} />;
}
