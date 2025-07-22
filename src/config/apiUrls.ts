export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = {
    auth: {
        login: `${API_BASE_URL}/auth/signin`,
        signup: `${API_BASE_URL}/auth/signup`,
        google: `${API_BASE_URL}/auth/google`,
        signout: `${API_BASE_URL}/auth/signout`,
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
};
