import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { CollegePageProps } from "@/utils/interface";
import { api } from "@/config/apiUrls";
import CourseList from "./CourseList";

interface ICourse {
  _id: string;
  courseName: string;
  courseCode: string;
  clickCounts: number;
}

export async function generateMetadata({
  params,
}: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Resources - ${capitalizeWords(slug)}`,
    description: "Get concise and clear notes to boost your exam preparation.",
  };
}

export default async function ResourcesPage({ params }: CollegePageProps) {
  const { slug } = await params;
  const collegeName = slug;

  let courses: ICourse[] = [];
  try {
    const url = `${api.resources.getCourses}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    const data = await res.json();
    courses = data?.data || [];
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-fugaz sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          Resources - {capitalizeWords(collegeName)}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          &quot;Get concise and clear notes to boost your exam
          preparation.&quot;
        </p>
      </header>

      {/* ✅ Pass data to client component for search */}
      <CourseList courses={courses} />
    </main>
  );
}
