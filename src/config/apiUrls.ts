export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = {
    auth: {
        login: `${API_BASE_URL}/auth/signin`,
        signup: `${API_BASE_URL}/auth/signup`,
        sendOtp: `${API_BASE_URL}/auth/send-otp`,
        verifyOtpSignup: `${API_BASE_URL}/auth/verify-otp-signup`,
        google: `${API_BASE_URL}/auth/google`,
        signout: `${API_BASE_URL}/auth/signout`,
        userDetail: `${API_BASE_URL}/auth/user`,
    },

    user: {
        update: (id: string) => `${API_BASE_URL}/users/update/${id}`,
        userData: `${API_BASE_URL}/users/data`,
    },

    college: {
        getColleges: `${API_BASE_URL}/colleges`,
        getCollegeBySlug: (slug: string) => `${API_BASE_URL}/colleges/${slug}`,
        addCollege: `${API_BASE_URL}/colleges`,
        getCollegeWithFeaturedSeniorsAndProducts: (slug: string) =>
            `${API_BASE_URL}/colleges/featured/${slug}`,
    },

    pyq: {
        getPyqByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/pyqs/college/${encodeURIComponent(slug)}`,
        createPyq: `${API_BASE_URL}/pyqs`,
        editPyq: (id: string) =>
            `${API_BASE_URL}/pyqs/${encodeURIComponent(id)}`,
        deletePyq: (id: string) =>
            `${API_BASE_URL}/pyqs/${encodeURIComponent(id)}`,
        getPyqBySlug: (slug: string) =>
            `${API_BASE_URL}/pyqs/${encodeURIComponent(slug)}`,
        getSuggestedPyqs: (slug: string) =>
            `${API_BASE_URL}/pyqs/${encodeURIComponent(slug)}/suggested`,
    },

    pyqSolutions: {
        getPublicSolution: (pyqId: string) =>
            `${API_BASE_URL}/pyq-solutions/${pyqId}`,
        requestSolution: `${API_BASE_URL}/pyq-solutions/request-solution`,
    },

    notes: {
        getNotesByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/notes/college/${encodeURIComponent(slug)}`,
        createNote: `${API_BASE_URL}/notes`,
        editNote: (id: string) => `${API_BASE_URL}/notes/${encodeURIComponent(id)}`,
        deleteNote: (id: string) => `${API_BASE_URL}/notes/${encodeURIComponent(id)}`,
        getNoteBySlug: (slug: string) => `${API_BASE_URL}/notes/${encodeURIComponent(slug)}`,
        getSuggestedNotes: (slug: string) =>
            `${API_BASE_URL}/notes/${encodeURIComponent(slug)}/suggested`,
    },

    videos: {
        getVideosByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/videos/college/${encodeURIComponent(slug)}`,
        createVideo: `${API_BASE_URL}/videos`,
        editVideo: (id: string) => `${API_BASE_URL}/videos/${encodeURIComponent(id)}`,
        deleteVideo: (id: string) => `${API_BASE_URL}/videos/${encodeURIComponent(id)}`,
        getVideoBySlug: (slug: string) => `${API_BASE_URL}/videos/${encodeURIComponent(slug)}`,
    },

    seniors: {
        getSeniorsByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/seniors/college/${encodeURIComponent(slug)}`,
        createSenior: `${API_BASE_URL}/seniors`,
        editSenior: (id: string) => `${API_BASE_URL}/seniors/${encodeURIComponent(id)}`,
        deleteSenior: (id: string) => `${API_BASE_URL}/seniors/${encodeURIComponent(id)}`,
        getSeniorBySlug: (slug: string) => `${API_BASE_URL}/seniors/${encodeURIComponent(slug)}`,
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

    resources: {
        getCourses: `${API_BASE_URL}/resource/courses`,
        getBranches: (courseId: string) =>
            `${API_BASE_URL}/resource/branches/${courseId}`,
        getSubjects: (branchCode: string, collegeSlug?: string) =>
            collegeSlug
                ? `${API_BASE_URL}/resource/subjects/${branchCode}/${collegeSlug}`
                : `${API_BASE_URL}/resource/subjects/${branchCode}`,
        getPyqsBySubject: (subjectCode: string, slug: string) =>
            `${API_BASE_URL}/resource/pyqs/${subjectCode}/${slug}`,
        getNotesBySubject: (subjectCode: string, slug: string) =>
            `${API_BASE_URL}/resource/notes/${subjectCode}/${slug}`,
        getVideosBySubject: (subjectCode: string, slug: string) =>
            `${API_BASE_URL}/resource/videos/${subjectCode}/${slug}`,
    },

    contactus: {
        createContactus: `${API_BASE_URL}/contactus`,
    },

    aws: {
        presignedUrl: `${API_BASE_URL}/aws/presigned-url`,
        getSignedUrl: `${API_BASE_URL}/aws/signed-url`,
    },

    contributors: {
        getTopContributors: (limit?: number) =>
            limit
                ? `${API_BASE_URL}/contributors?limit=${limit}`
                : `${API_BASE_URL}/contributors`,
    },

    savedData: {
        saveNote: `${API_BASE_URL}/saved-data/save-note`,
        unsaveNote: `${API_BASE_URL}/saved-data/unsave-note`,
        savePyq: `${API_BASE_URL}/saved-data/save-pyq`,
        unsavePyq: `${API_BASE_URL}/saved-data/unsave-pyq`,
        savedCollection: `${API_BASE_URL}/saved-data/saved-collection`,
        leaderboard: `${API_BASE_URL}/saved-data/leaderboard`,
    },

    payment: {
        // Order endpoints
        createOrder: `${API_BASE_URL}/payment/orders`,
        getOrder: (orderId: string) =>
            `${API_BASE_URL}/payment/orders/${orderId}`,
        getUserOrders: `${API_BASE_URL}/payment/orders`,
        refundOrder: (orderId: string) =>
            `${API_BASE_URL}/payment/orders/${orderId}/refund`,

        // Payment endpoints
        payWithPoints: (orderId: string) =>
            `${API_BASE_URL}/payment/orders/${orderId}/pay/points`,
        payOnline: `${API_BASE_URL}/payment/pay/online`,
        verifyPayment: `${API_BASE_URL}/payment/pay/verify`,

        // Wallet endpoints
        getBalance: `${API_BASE_URL}/payment/wallet/balance`,
        getTransactions: `${API_BASE_URL}/payment/wallet/transactions`,
        getStats: `${API_BASE_URL}/payment/wallet/stats`,
    },

    chatbot: {
        track: `${API_BASE_URL}/chatbot/track`,
    },

    syllabus: {
        getSyllabusByCollege: (collegeSlug: string) =>
            `${API_BASE_URL}/syllabus/college/${encodeURIComponent(collegeSlug)}`,

        getSyllabusBySlug: (slug: string) =>
            `${API_BASE_URL}/syllabus/slug/${encodeURIComponent(slug)}`,

        getSyllabusByBranch: (collegeSlug: string, branchCode: string) =>
            `${API_BASE_URL}/syllabus/branch/${encodeURIComponent(collegeSlug)}/${encodeURIComponent(branchCode)}`,
    },

    quickNotes: {
        getQuickNotesByCollegeSlug: (slug: string) =>
            `${API_BASE_URL}/quicknotes/college/${encodeURIComponent(slug)}`,
        getNotesBySubject: (subjectCode: string) =>
            `${API_BASE_URL}/quicknotes/${encodeURIComponent(subjectCode)}`,
        getNoteDetail: (slug: string) => `${API_BASE_URL}/quicknotes/s/${encodeURIComponent(slug)}`,
    },

    affiliateProducts: {
        getAll: `${API_BASE_URL}/affiliate-products`,
        trackClick: (id: string) =>
            `${API_BASE_URL}/affiliate-products/${id}/click`,
    },
};
