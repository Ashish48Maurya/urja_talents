/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["res.cloudinary.com"], // Use 'domains' as an array, no "https://"
    },
};

export default nextConfig;
