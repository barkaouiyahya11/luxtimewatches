import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cairo, Allura } from 'next/font/google'
import Script from 'next/script'
import { StoreProvider } from '@/context/StoreContext'

import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import CheckoutModal from '@/components/CheckoutModal'
import ReviewModal from '@/components/ReviewModal'
import Lightbox from '@/components/Lightbox'
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
  title: 'LUX TIME - Boutique Officielle | Montres de Luxe au Maroc',
  description:
    'LUX TIME — Montres de luxe au Maroc. Collections Femme & Homme. Livraison gratuite partout au Maroc. Paiement à la livraison.',
  keywords: 'montres luxe maroc, lux time, montre femme maroc, montre homme maroc, montre or maroc',
  openGraph: {
    title: 'LUX TIME — Montres de Luxe au Maroc 🇲🇦',
    description: 'luxtimewatches.store',
    type: 'website',
  },
  twitter: { card: 'summary' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${cairo.variable} ${allura.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="font-sans bg-white" suppressHydrationWarning>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>

        <StoreProvider>
          <Header />
          <main style={{ paddingTop: '64px' }}>{children}</main>
          <CartDrawer />
          <CheckoutModal />
          <ReviewModal />
          <Lightbox />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  )
}
