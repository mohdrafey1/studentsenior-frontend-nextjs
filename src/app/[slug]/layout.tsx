"use client";

import { usePathname } from "next/navigation";
import Collegelinks from "@/components/Common/CollegeLinks";
import Collegelink2 from "@/components/Common/CollegeLink2";

export default function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideCollegeLinks = pathname.startsWith("/integral-university/store");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-sky-100 dark:from-gray-900 dark:to-gray-900 pb-0">
        {!hideCollegeLinks && <Collegelinks />}
        {children}
      </div>
      <Collegelink2 />
    </>
  );
}
