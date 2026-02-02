import '@styles/general/globals.css';
import '@styles/general/fonts.css';
import '@styles/general/colors.css';

import { Gulzar, Roboto, Vazirmatn, Share_Tech } from 'next/font/google';
import { fallbackLng, languages } from '@i18n/settings';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';

import localFont from 'next/font/local';

const asiatech = localFont({
  subsets: ['arabic'],
  src: '../fonts/asiatech.ttf',
  display: 'swap',
  variable: '--font-asiatech',
  style: 'normal',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const shareTech = Share_Tech({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-share-tech',
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({ children, params }) {
  const { lng } = await params;
  const isRTL = ['fa', 'ar'].includes(
    (String(lng) || fallbackLng).toLowerCase(),
  );

  return (
    <html
      lang={lng}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={
        isRTL
          ? `${vazirmatn.variable} ${asiatech.variable}`
          : `${roboto.variable} ${shareTech.variable}`
      }
    >
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css'
        />
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
          integrity='sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB'
          crossOrigin='anonymous'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css'
        ></link>
      </head>

      <body className={`container-fluid d-flex flex-column min-vh-100 m-0 p-0`}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
        <Script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js'
          integrity='sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI'
          crossOrigin='anonymous'
        ></Script>
      </body>
    </html>
  );
}
