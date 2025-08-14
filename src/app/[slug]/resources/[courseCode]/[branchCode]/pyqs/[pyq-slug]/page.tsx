import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { IPyq } from "@/utils/interface";
import SubjectPyqsClient from "./SubjectPyqsClient";

import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

interface SubjectPyqsPageProps {
    params: Promise<{
        "pyq-slug": string;
        slug: string;
        courseCode: string;
        branchCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: SubjectPyqsPageProps): Promise<Metadata> {
    const { "pyq-slug": subjectCode, slug } = await params;
    return {
        title: `${capitalizeWords(subjectCode)} - PYQs | ${capitalizeWords(
            slug
        )}`,
        description: "Past year questions for the subject",
    };
}

export default async function SubjectPyqsPage({
    params,
}: SubjectPyqsPageProps) {
    const {
        "pyq-slug": subjectCode,
        slug,
        courseCode,
        branchCode,
    } = await params;

    let pyqs: IPyq[] = [];
    try {
        const url = `${api.resources.getPyqsBySubject(subjectCode, slug)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();
        pyqs = data?.data || [];
    } catch (error) {
        console.error("Failed to fetch PYQs by subject:", error);
    }

    return (
        <>
            <DetailPageNavbar
                path="subjects"
                fullPath={`/${slug}/resources/${courseCode}/${branchCode}`}
            />
            <main className="min-h-screen">
                <SubjectPyqsClient
                    initialPyqs={pyqs}
                    subjectCode={subjectCode}
                    collegeSlug={slug}
                    courseCode={courseCode}
                    branchCode={branchCode}
                />
            </main>
        </>
    );
}
