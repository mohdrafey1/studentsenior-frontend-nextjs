import { api } from "@/config/apiUrls";
import { capitalizeWords } from "@/utils/formatting";
import type { Metadata } from "next";
import { CollegePageProps, IPagination, ISenior } from "@/utils/interface";
import SeniorClient from "./SeniorClient";

export async function generateMetadata({
  params,
}: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Seniors - ${capitalizeWords(slug)}`,
    description:
      "Connect with seniors to get valuable insights and advice for your college journey.",
  };
}

export default async function SeniorsPage({ params }: CollegePageProps) {
  const { slug } = await params;
  const collegeName = slug;

  let seniors: ISenior[] = [];
  let pagination: IPagination | null = null;

  try {
    const url = `${api.seniors.getSeniorsByCollegeSlug(collegeName)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    seniors = data?.data?.seniors || [];
    pagination = data?.data?.pagination || null;
  } catch (error) {
    console.error("Error fetching seniors:", error);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-fugaz sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          Seniors - {capitalizeWords(collegeName)}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Connect with seniors to get valuable insights and advice for your
          college journey.
        </p>
      </header>
      <SeniorClient
        initialSeniors={seniors}
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
  );
}
