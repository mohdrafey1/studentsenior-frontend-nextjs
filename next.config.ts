import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

module.exports = {
    images: {
        domains: ["firebasestorage.googleapis.com", "res.cloudinary.com"],
    },
};

export default nextConfig;
