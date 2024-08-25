const nextConfig  = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static-cdn.jtvnw.net',
                port: '',
                pathname: '*/**',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                port: '',
                pathname: '*/**',
            },
        ],
    },
};

export default nextConfig;
