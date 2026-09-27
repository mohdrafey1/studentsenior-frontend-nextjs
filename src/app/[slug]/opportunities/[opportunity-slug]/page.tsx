import { fetchPublicApi } from '@/utils/serverFetch';
import React from 'react';
import { api } from '@/config/apiUrls';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OpportunityDetailClient from './OpportunityDetailClient';

interface OpportunityPageProps {
    params: Promise<{
        'opportunity-slug': string;
    }>;
}

export async function generateMetadata({
    params,
}: OpportunityPageProps): Promise<Metadata> {
    const { 'opportunity-slug': opportunitySlug } = await params;

    try {
        const res = await fetchPublicApi(
            `${api.opportunities.getOpportunityBySlug(opportunitySlug)}`,
            {
                next: { revalidate: 300 },
            },
        );
        const data = await res.json();
        const opportunity = data?.data;

        if (!opportunity) {
            return {
                title: 'Opportunity Not Found',
                description: 'The requested opportunity could not be found.',
            };
        }

        return {
            title: `${opportunity.name} - Student Senior`,
            description: opportunity.description.slice(0, 160),
        };
    } catch (error) {
        throw error;
    }
}

export default async function OpportunityPage({
    params,
}: OpportunityPageProps) {
    const { 'opportunity-slug': opportunitySlug } = await params;

    const res = await fetchPublicApi(
        `${api.opportunities.getOpportunityBySlug(opportunitySlug)}`,
        { next: { revalidate: 300 } },
    );
    const data = await res.json();

    if (!res.ok || !data?.data) {
        notFound();
    }

    return <OpportunityDetailClient opportunity={data.data} />;
}
