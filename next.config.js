/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        
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
