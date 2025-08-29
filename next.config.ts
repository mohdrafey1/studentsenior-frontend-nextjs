import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

module.exports = {
    images: {
        domains: [
            "firebasestorage.googleapis.com",
            "res.cloudinary.com",
            "studentsenior.s3.ap-south-1.amazonaws.com",
            "dixu7g0y1r80v.cloudfront.net",
            "lh3.googleusercontent.com",
            "img.youtube.com",
        ],
    },
};

export default nextConfig;
