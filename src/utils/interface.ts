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

export interface ISocialMediaLink {
    platform:
        | "whatsapp"
        | "telegram"
        | "instagram"
        | "linkedin"
        | "facebook"
        | "twitter"
        | "youtube"
        | "github"
        | "other";
    url: string;
}

export interface ISenior {
    _id: string;
    name: string;
    domain?: string;
    branch: {
        _id: string;
        branchName: string;
    };
    image?: string;
    year: string;
    profilePicture?: string;
    socialMediaLinks?: ISocialMediaLink[];
    college: {
        _id: string;
        name: string;
    };
    owner: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    clickCount: number;
    slug: string;
    submissionStatus: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    description?: string;
    deleted?: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
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

export interface ILostFoundItem {
    _id: string;
    title: string;
    description: string;
    type: "lost" | "found";
    location: string;
    date: string;
    currentStatus: "open" | "closed";
    imageUrl?: string;
    whatsapp: string;
    owner: {
        _id: string;
        username: string;
    };
    slug: string;
}

export interface IStoreItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    whatsapp?: string;
    telegram?: string;
    available: boolean;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    slug: string;
    submissionStatus: string;
    clickCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICourse {
    _id: string;
    courseName: string;
    courseCode: string;
    clickCounts: number;
    createdAt: string;
    updatedAt: string;
}

export interface IBranch {
    _id: string;
    branchName: string;
    branchCode: string;
    course: ICourse;
    clickCounts: number;
    createdAt: string;
    updatedAt: string;
}

export interface ISubject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    branch: IBranch;
    clickCounts: number;
    createdAt: string;
    updatedAt: string;
}

export interface IPyq {
    _id: string;
    subject: ISubject;
    slug: string;
    fileUrl: string;
    year: string;
    examType: string;
    owner: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    college: {
        _id: string;
        name: string;
    };
    status: boolean;
    deleted: boolean;
    deletedAt?: string;
    rewardPoints: number;
    clickCounts: number;
    solved: boolean;
    isPaid: boolean;
    price: number;
    purchasedBy: string[];
    submissionStatus: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface INote {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    subject: ISubject;
    branch: IBranch;
    isPaid: boolean;
    price: number;
    owner: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    slug: string;
    submissionStatus: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    clickCounts: number;
}

export interface IPyqResponse {
    pyqs: IPyq[];
    pagination: IPagination;
}

export interface INoteResponse {
    notes: INote[];
    pagination: IPagination;
}
