import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import Collegelinks from "@/components/Common/CollegeLinks";
import Collegelink2 from "@/components/Common/CollegeLink2";
import WhatsAppGroupClient from "./WhatsAppGroupClient";
import {
    CollegePageProps,
    IPagination,
    IWhatsAppGroup,
} from "@/utils/interface";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Groups - ${capitalizeWords(slug)}`,
        description:
            "Join WhatsApp groups to connect with like-minded people and stay updated with campus activities and resources.",
    };
}

export default async function WhatsAppGroupPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    let groups: IWhatsAppGroup[] = [];
    let pagination: IPagination | null = null;

    try {
        const url = `${api.groups.getGroupsByCollegeSlug(collegeName)}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        groups = data?.data?.groups || [];
        pagination = data?.data?.pagination || null;
    } catch (error) {
        console.error("Failed to fetch groups:", error);
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-900 pb-15">
                <Collegelinks />
                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <header className="text-center mb-8">
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                            Groups - {capitalizeWords(collegeName)}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                            &quot;Connect with peers, share resources, and stay
                            updated with the latest information through these
                            WhatsApp groups.&quot;
                        </p>
                    </header>
                    <WhatsAppGroupClient
                        initialGroups={groups}
                        initialPagination={
                            pagination || {
                                currentPage: 1,
                                totalPages: 1,
                                totalItems: 0,
                                hasNextPage: false,
                                hasPrevPage: false,
                            }
                        }
                        collegeName={collegeName}
                    />
                </main>
            </div>
            <Collegelink2 />
        </>
    );
}
