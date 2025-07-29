export interface CollegePageProps {
    params: Promise<{
        slug: string;
    }>;
}

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

export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface IWhatsAppGroup {
    _id: string;
    title: string;
    link: string;
    info: string;
    domain: string;
    college: string;
    owner?: string;
    submissionStatus?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    condition: string;
    createdAt: string;
    updatedAt: string;
}

export interface ISenior {
    _id: string;
    name: string;
    description: string;
    image: string;
    college: string;
    category: string;
    condition: string;
    price: number;
    contact: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    branch: string;
    year: number;
}

export interface IOpportunity {
    _id: string;
    name: string;
    description: string;
    email: string;
    whatsapp?: string;
    link?: string;
    college: string;
    owner?: {
        _id: string;
        username: string;
    };
    submissionStatus: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
}
