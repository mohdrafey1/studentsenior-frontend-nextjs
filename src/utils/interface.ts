export interface IApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export interface FAQ {
    question: string;
    answer: string;
    category?: string;
}

export interface CollegeData {
    name: string;
    location: string;
    description: string;
}

export interface College {
    _id: string;
    name: string;
    slug: string;
    location: string;
    description: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Senior {
    _id: string;
    name: string;
    email: string;
    college: string;
    year: number;
    branch: string;
    image?: string;
    bio?: string;
    rating?: number;
    totalReviews?: number;
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    college: string;
    seller: string;
    images?: string[];
    condition: "new" | "used" | "like-new";
    createdAt: string;
    updatedAt: string;
}

export interface CollegePageProps {
    params: {
        slug: string;
    };
}
