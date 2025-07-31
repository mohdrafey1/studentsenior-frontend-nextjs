export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = {
    auth: {
        login: `${API_BASE_URL}/auth/signin`,
        signup: `${API_BASE_URL}/auth/signup`,
        google: `${API_BASE_URL}/auth/google`,
        signout: `${API_BASE_URL}/auth/signout`,
        userDetail: `${API_BASE_URL}/auth/user`,
    },

    user: {
        update: (id: string) => `${API_BASE_URL}/users/update/${id}`,
    },

    college: {
        getColleges: `${API_BASE_URL}/colleges`,
        getCollegeBySlug: (slug: string) => `${API_BASE_URL}/colleges/${slug}`,
        addCollege: `${API_BASE_URL}/colleges`,
    },

    seniors: {
        getSeniors: (collegeId: string) =>
            `${API_BASE_URL}/api/seniors/college/${collegeId}`,
        getFeaturedSeniors: (collegeId: string) =>
            `${API_BASE_URL}/api/seniors/featured/${collegeId}`,
    },

    products: {
        getProducts: (collegeId: string) =>
            `${API_BASE_URL}/api/products/college/${collegeId}`,
        getFeaturedProducts: (collegeId: string) =>
            `${API_BASE_URL}/api/products/featured/${collegeId}`,
    },

    groups: {
        getGroupsByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/groups/college/${slug}`,
        createGroup: `${API_BASE_URL}/groups`,
        editGroup: (id: string) => `${API_BASE_URL}/groups/${id}`,
        deleteGroup: (id: string) => `${API_BASE_URL}/groups/${id}`,
    },

    opportunities: {
        getOpportunitiesByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/opportunities/college/${slug}`,
        createOpportunity: `${API_BASE_URL}/opportunities`,
        editOpportunity: (id: string) => `${API_BASE_URL}/opportunities/${id}`,
        deleteOpportunity: (id: string) =>
            `${API_BASE_URL}/opportunities/${id}`,
        getOpportunityBySlug: (slug: string) =>
            `${API_BASE_URL}/opportunities/${slug}`,
    },

    lostFound: {
        getLostFoundByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/lost-found/college/${slug}`,
        createLostFound: `${API_BASE_URL}/lost-found`,
        editLostFound: (id: string) => `${API_BASE_URL}/lost-found/${id}`,
        deleteLostFound: (id: string) => `${API_BASE_URL}/lost-found/${id}`,
        getLostFoundBySlug: (slug: string) =>
            `${API_BASE_URL}/lost-found/${slug}`,
    },

    store: {
        getStoreByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/store/college/${slug}`,
        createStore: `${API_BASE_URL}/store`,
        editStore: (id: string) => `${API_BASE_URL}/store/${id}`,
        deleteStore: (id: string) => `${API_BASE_URL}/store/${id}`,
        getStoreBySlug: (slug: string) => `${API_BASE_URL}/store/${slug}`,
    },

    contactus: {
        createContactus: `${API_BASE_URL}/contactus`,
    },

    aws: {
        presignedUrl: `${API_BASE_URL}/aws/presigned-url`,
    },
};
