import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import { IPyq } from "@/utils/interface";
import SubjectPyqsClient from "./SubjectPyqsClient";
import DetailPageNavbar from "@/components/Common/DetailPageNavbar";
import type { Metadata } from "next";

// helper to fetch subject name
async function getSubjectName(branchCode: string, subjectCode: string) {
  const response = await fetch(api.resources.getSubjects(branchCode), { cache: "no-store" });
  const resp = await response.json();
  const matched = resp.data.find((item: any) => item.subjectCode === subjectCode);
  return matched?.subjectName || "";
}

// sanitize subject name
function cleanSubjectName(name: string) {
  return name.replace(/Endsem.*|Midsem.*|\d{4} ?\d{2}/gi, "").trim();
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug, branchCode,courseCode, "pyq-slug": subjectCode } = await params;

  let subjectName = await getSubjectName(branchCode, subjectCode);
  subjectName = cleanSubjectName(subjectName);

  const pageTitle = `${subjectName} (${subjectCode}) PYQs – Download Free Past Papers | ${capitalizeWords(slug)}`;
  const description = `Access free past year question papers (PYQs) of ${subjectName} for college and university students. Download and practice End-Sem, Mid-Sem 1, and Mid-Sem 2 exams to boost your exam preparation.`;


  const url = `https://www.studentsenior.com/${slug}/resources/${courseCode}/${branchCode}/pyqs/${subjectCode}`;

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
    alternates: {
      canonical: url,
    },
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

export default async function SubjectPyqsPage({ params }: any) {
  const { "pyq-slug": subjectCode, slug, courseCode, branchCode } = await params;

  let pyqs: IPyq[] = [];
  let subjectName = await getSubjectName(branchCode, subjectCode);
  subjectName = cleanSubjectName(subjectName);

  try {
    const url = api.resources.getPyqsBySubject(subjectCode, slug);
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    pyqs = data?.data || [];
  } catch (e) {
    console.error("PYQ fetch error:", e);
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
          subjectName={subjectName}
        />
      </main>

      {/* ✅ Inject JSON-LD in body */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: (globalThis as any).__METADATA?.other?.["script:course-schema"] ?? "",
        }}
      />
    </>
  );
}
