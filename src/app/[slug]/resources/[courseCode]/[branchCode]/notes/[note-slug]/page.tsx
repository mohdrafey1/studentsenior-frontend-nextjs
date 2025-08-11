import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { INote } from "@/utils/interface";
import SubjectNotesClient from "./SubjectNotesClient";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";

interface SubjectNotesPageProps {
    params: Promise<{
        "note-slug": string;
        slug: string;
        courseCode: string;
        branchCode: string;
    }>;
}

export async function generateMetadata({
    params,
}: SubjectNotesPageProps): Promise<Metadata> {
    const { "note-slug": subjectCode, slug } = await params;
    return {
        title: `${capitalizeWords(subjectCode)} - Notes | ${capitalizeWords(
            slug
        )}`,
        description: "Notes for the subject",
    };
}

export default async function SubjectNotesPage({
    params,
}: SubjectNotesPageProps) {
    const {
        "note-slug": subjectCode,
        slug,
        courseCode,
        branchCode,
    } = await params;

    let notes: INote[] = [];
    try {
        const url = `${api.resources.getNotesBySubject(subjectCode, slug)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        const data = await res.json();
        notes = data?.data || [];
    } catch (error) {
        console.error("Failed to fetch Notes by subject:", error);
    }

    return (
        <>
            <DetailPageNavbar
                path="subjects"
                fullPath={`/${slug}/resources/${courseCode}/${branchCode}`}
            />
            <main>
                <SubjectNotesClient
                    initialNotes={notes}
                    subjectCode={subjectCode}
                    collegeSlug={slug}
                    courseCode={courseCode}
                    branchCode={branchCode}
                />
            </main>
        </>
    );
}
