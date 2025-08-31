"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IPyq } from "@/utils/interface";
import { BookOpen, Eye, FileText, Plus, Video, Award } from "lucide-react";
import Image from "next/image";

interface SubjectPyqsClientProps {
  initialPyqs: IPyq[];
  subjectCode: string;
  collegeSlug: string;
  courseCode: string;
  branchCode: string;
}

export default function SubjectPyqsClient({
  initialPyqs,
  subjectCode,
  collegeSlug,
  courseCode,
  branchCode,
}: SubjectPyqsClientProps) {
  const [activeExamType, setActiveExamType] = useState<string>("all");

  const uniqueExamTypes = useMemo(() => {
    const setTypes = new Set(
      initialPyqs.map((p) => (p.examType || "").toLowerCase()).filter(Boolean)
    );
    return Array.from(setTypes).sort();
  }, [initialPyqs]);

  const examTypesWithAll = useMemo(
    () => ["all", ...uniqueExamTypes],
    [uniqueExamTypes]
  );

  const examTypeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialPyqs.length };
    uniqueExamTypes.forEach((t) => {
      counts[t] = initialPyqs.filter(
        (p) => (p.examType || "").toLowerCase() === t
      ).length;
    });
    return counts;
  }, [initialPyqs, uniqueExamTypes]);

  const filtered = useMemo(() => {
    return initialPyqs.filter((p) => {
      const matchesExam =
        activeExamType === "all"
          ? true
          : (p.examType || "").toLowerCase() === activeExamType;
      return matchesExam;
    });
  }, [initialPyqs, activeExamType]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-fugaz font-bold text-gray-900 dark:text-white">
              {subjectCode.toUpperCase()} - Previous Year Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Browse and access previous year question papers
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/notes/${subjectCode}`}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Notes
            </Link>
            <Link
              href={`/${collegeSlug}/resources/${courseCode}/${branchCode}/videos/${subjectCode}`}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              Videos
            </Link>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add PYQ
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {examTypesWithAll.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors flex items-center gap-2 ${
                activeExamType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setActiveExamType(type)}
              aria-pressed={activeExamType === type}
            >
              {type === "all" ? "All PYQs" : type}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeExamType === type
                    ? "bg-blue-600 text-blue-100"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
              >
                {examTypeCounts[type] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filtered.length} paper
        {filtered.length === 1 ? "" : "s"}
        {activeExamType !== "all" && ` for ${activeExamType}`}
      </div>

      {/* PYQ Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeExamType === "all"
                ? "No PYQs available yet"
                : `No ${activeExamType} PYQs available yet`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {activeExamType === "all"
                ? "Be the first to contribute by adding a previous year question paper."
                : `Be the first to contribute by adding a ${activeExamType} question paper.`}
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors">
              <Plus className="w-4 h-4" />
              Add First PYQ
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pyq) => (
            <div
              key={pyq._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-4">
                {pyq.owner?.profilePicture ? (
                  <Image
                    src={pyq.owner.profilePicture}
                    alt={`${pyq.owner?.username}'s Profile`}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {pyq.owner?.username?.charAt(0) || "A"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {pyq.owner?.username || "Anonymous"}
                  </p>
                </div>
              </div>

              {/* PYQ Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {pyq.year}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{pyq.clickCounts}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
                  {pyq.examType}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pyq.solved && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      Solved
                    </span>
                  )}
                  {pyq.isPaid && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* View Button */}
              <Link
                href={`/${collegeSlug}/pyqs/${pyq.slug}`}
                className={`w-full block text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  pyq.isPaid
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                View Paper
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
