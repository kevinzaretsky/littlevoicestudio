/** @type {import('next').NextConfig} */
module.exports = { experimental: { serverActions: { bodySizeLimit: '10mb' } }, images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] } }
