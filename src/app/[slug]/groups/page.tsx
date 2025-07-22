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
import { GROUPS_PAGE_SIZE } from "@/constant";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: CollegePageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `WhatsApp Groups - ${capitalizeWords(slug)}`,
        description:
            "Join WhatsApp groups to connect with like-minded people and stay updated with campus activities and resources.",
    };
}

export default async function WhatsAppGroupPage({ params }: CollegePageProps) {
    const { slug } = await params;
    const collegeName = slug;

    const searchParams = new URLSearchParams({
        page: "1",
        limit: String(GROUPS_PAGE_SIZE),
    });
    const url = `${api.groups.getGroupsByCollegeSlug(
        collegeName
    )}?${searchParams.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    const groups: IWhatsAppGroup[] = data.data.groups || [];
    const pagination: IPagination = data.data.pagination || null;
    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-900">
                <Collegelinks />
                <WhatsAppGroupClient
                    initialGroups={groups}
                    initialPagination={pagination}
                    collegeName={collegeName}
                />
                <Collegelink2 />
            </div>
        </>
    );
}
