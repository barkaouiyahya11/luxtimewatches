import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cairo, Allura } from 'next/font/google'
import Script from 'next/script'
import { StoreProvider } from '@/context/StoreContext'

import Header from '@/components/Header'
import AnnouncementBar from '@/components/AnnouncementBar'
import CartDrawer from '@/components/CartDrawer'
import CheckoutModal from '@/components/CheckoutModal'
import ReviewModal from '@/components/ReviewModal'
import Toast from '@/components/Toast'
import { GA_ID } from '@/lib/constants'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-cairo',
})

const allura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
})

export const metadata: Metadata = {
  title: 'GUSHKIN - Boutique Officielle | Montres & Accessoires de Luxe au Maroc',
  description:
    'GUSHKIN — Montres et accessoires de luxe au Maroc. Collections Femme & Homme à partir de 149 MAD. Livraison gratuite partout au Maroc. Paiement à la livraison.',
  keywords: 'gushkin, gushkin maroc, gushkin montres, montres luxe maroc, accessoires luxe maroc, montre femme maroc, montre homme maroc, montre or maroc, livraison gratuite maroc',
  metadataBase: new URL('https://www.gushkin.com'),
  openGraph: {
    title: 'GUSHKIN — Montres & Accessoires de Luxe au Maroc',
    description: 'Collections Femme & Homme à partir de 149 MAD. Livraison gratuite partout au Maroc.',
    type: 'website',
    url: 'https://www.gushkin.com',
    siteName: 'GUSHKIN',
    locale: 'fr_MA',
  },
  twitter: { card: 'summary_large_image', title: 'GUSHKIN — Accessoires de Luxe au Maroc' },
  alternates: { canonical: 'https://www.gushkin.com' },
  verification: {
    google: '57b66e78014f253a',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} ${allura.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect pour charger les ressources plus vite */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        {/* Font Awesome — uniquement les icônes utilisées (kit léger) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="font-sans" style={{ background: '#FAF9F7' }} suppressHydrationWarning>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>

        <StoreProvider>
          <AnnouncementBar />
          <Header />
          <main style={{ paddingTop: '109px' }}>{children}</main>
          <CartDrawer />
          <CheckoutModal />
          <ReviewModal />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  )
}
