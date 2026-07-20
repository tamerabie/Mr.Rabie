import type { Metadata, Viewport } from "next"
import { Nunito, Baloo_2 } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/components/providers/app-provider"
import { LeoWidget } from "@/components/leo/leo-widget"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
})

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ELH-PRIMARY1-1st-Term | English Learning for Kids",
  description:
    "A playful, gamified English learning platform for 1st grade — Egyptian & International curricula, Leo the AI buddy, phonics lab and 3D video hub.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#5aa9e6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`bg-background ${nunito.variable} ${baloo.variable}`}>
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
          <LeoWidget />
        </AppProvider>
      </body>
    </html>
  )
}
