import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
    return (
        <Html lang="en">
            <Head>
                {/* Meta tags, styles, fonts, etc. */}
                <meta charSet="UTF-8" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#020617" />
                <meta name="msapplication-TileColor" content="#020617" />
                <meta name="theme-color" content="#020617" />
                <script async src="https://js.stripe.com/v3/buy-button.js"></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
