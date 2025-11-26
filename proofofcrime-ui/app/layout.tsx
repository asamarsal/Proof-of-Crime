import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ContextProvider from '@/context'
import { headers } from "next/headers"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Proof of Crime | AI-Powered Cybercrime Investigation",
  description:
    "The next-generation Web3 dApp for decentralized cybercrime investigation. Track suspects, claim bounties, and analyze blockchain forensics with AI.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookies = (await headers()).get('cookie')

  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased overflow-x-hidden`}>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
