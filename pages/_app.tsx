import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../lib/AuthContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>Ether Education Platform — ইথাগোরাস প্রাইভেট নওগাঁ</title>
        <meta
          name="description"
          content="Ether Education Platform (ইথাগোরাস প্রাইভেট), a high-end, digital-first coaching center platform based in Naogaon, Bangladesh."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
