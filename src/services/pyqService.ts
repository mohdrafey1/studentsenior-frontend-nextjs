import { api } from "@/config/apiUrls";
import { IPyqResponse } from "@/utils/interface";

export const fetchPyqsByCollege = async (
    collegeSlug: string,
    params?: {
        page?: number;
        limit?: number;
        search?: string;
        subject?: string;
        branch?: string;
        year?: string;
        examType?: string;
    }
): Promise<IPyqResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.subject) searchParams.append("subject", params.subject);
    if (params?.branch) searchParams.append("branch", params.branch);
    if (params?.year) searchParams.append("year", params.year);
    if (params?.examType) searchParams.append("examType", params.examType);

    const url = `${api.pyq.getPyqByCollegeSlug(
        collegeSlug
    )}?${searchParams.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch PYQs");
    }

    const data = await response.json();
    return data.data;
};
