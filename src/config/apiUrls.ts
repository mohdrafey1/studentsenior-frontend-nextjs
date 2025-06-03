export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const API_KEY_URL = process.env.NEXT_PUBLIC_API_KEY_URL;

export const api = {
    auth: {
        login: `${API_BASE_URL}/api/auth/signin`,
        signup: `${API_BASE_URL}/api/auth/signup`,
        google: `${API_BASE_URL}/api/auth/google`,
        signout: `${API_BASE_URL}/api/auth/signout`,
    },

    college: {
        getColleges: `${API_BASE_URL}/api/colleges`,
    },
};
