import { Toaster } from '@/components/ui/Toaster'
import Providers from '@/utils/provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'

import './globals.css'
export const metadata = {
  title: 'movieclub',
  description: 'The app for your long-distance movie club',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} no-scrollbar relative min-h-screen antialiased`}
      >
        <Providers>
          {children}
          <SpeedInsights />
          <Toaster position="bottom-center" closeButton />
        </Providers>
        {/*<script dangerouslySetInnerHTML={{ __html: getTheme }} /> */}
        {/*<script dangerouslySetInnerHTML={{ __html: getAccent }} />*/}
      </body>
    </html>
  )
}
