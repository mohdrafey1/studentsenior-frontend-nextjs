import { api } from '@/config/apiUrls';
import { capitalizeWords } from '@/utils/formatting';
import type { Metadata } from 'next';
import { INote } from '@/utils/interface';
import SubjectNotesClient from './SubjectNotesClient';
import DetailPageNavbar from '@/components/Common/DetailPageNavbar';

// ✅ helper to fetch subject name
async function getSubjectName(branchCode: string, subjectCode: string) {
  const response = await fetch(api.resources.getSubjects(branchCode), { cache: "no-store" });
  const resp = await response.json();
  const matched = resp.data.find((item: any) => item.subjectCode === subjectCode);
  return matched?.subjectName || "";
}

// ✅ sanitize subject name
function cleanSubjectName(name: string) {
  return name.replace(/Endsem.*|Midsem.*|\d{4} ?\d{2}/gi, "").trim();
}

interface SubjectNotesPageProps {
  params: Promise<{
    'note-slug': string;
    slug: string;
    courseCode: string;
    branchCode: string;
  }>;
}

// ✅ SEO Metadata
export async function generateMetadata({ params }: SubjectNotesPageProps): Promise<Metadata> {
  const { 'note-slug': subjectCode, slug, branchCode, courseCode } = await params;

  let subjectName = await getSubjectName(branchCode, subjectCode);
  subjectName = cleanSubjectName(subjectName);

  const pageTitle = `${subjectName} (${subjectCode}) Notes – Free Study Material | ${capitalizeWords(slug)}`;
const description = `Download verified, high-quality handwritten and PDF notes for ${subjectName} (${subjectCode}). Access unit-wise notes, exam-ready summaries, important questions, and revision material to score higher in university semester exams. Free student study resources.`;

  const url = `https://www.studentsenior.com/${slug}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: pageTitle,
    description,
    provider: {
      "@type": "CollegeOrUniversity",
      name: capitalizeWords(slug.replace(/-/g, " ")),
      url: `https://www.studentsenior.com/${slug}`,
    },
    url,
  };

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "Student Senior",
      type: "website",
      images: [
        {
          url: "/icons/image512.png",
          width: 512,
          height: 512,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ["/icons/image512.png"],
      site: "@studentsenior",
      creator: "@studentsenior",
    },
    other: {
      "script:course-schema": JSON.stringify(jsonLd),
    },
  };
}

export default async function SubjectNotesPage({ params }: SubjectNotesPageProps) {
  const { 'note-slug': subjectCode, slug, courseCode, branchCode } = await params;

  let notes: INote[] = [];
  let subjectName = await getSubjectName(branchCode, subjectCode);
  subjectName = cleanSubjectName(subjectName);

  try {
    const url = api.resources.getNotesBySubject(subjectCode, slug);
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    notes = data?.data || [];
  } catch (e) {
    console.error("Notes fetch error:", e);
  }

  return (
    <>
      <DetailPageNavbar
        path="subjects"
        fullPath={`/${slug}/resources/${courseCode}/${branchCode}`}
      />

      <main className="min-h-screen">
        <SubjectNotesClient
          initialNotes={notes}
          subjectCode={subjectCode}
          collegeSlug={slug}
          courseCode={courseCode}
          branchCode={branchCode}
          subjectName={subjectName}
        />
      </main>

      {/* ✅ Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: (globalThis as any).__METADATA?.other?.["script:course-schema"] ?? "",
        }}
      />
    </>
  );
}
