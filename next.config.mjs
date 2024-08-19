const nextConfig  = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static-cdn.jtvnw.net',
                port: '',
                pathname: '*/**',
            },
        ],
    },
};

export default nextConfig;
