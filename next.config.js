/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'image.tmdb.org',
                port: '',
                pathname: '/t/p/**'
            }
        ]
    }
}

module.exports = nextConfig
