import { CollegePageProps } from "@/utils/interface";

export default async function CollegePage({ params }: CollegePageProps) {
    const { slug } = await params;
    console.log("College page requested for slug:", slug);

    return <div>Groups {slug}</div>;
}
