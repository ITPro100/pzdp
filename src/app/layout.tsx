import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Правовий Захист Дніпро | Військове право",
    template: "%s | Правовий Захист Дніпро"
  },
  description: "Професійна правова допомога військовим у Дніпрі. Оскарження рішень ВЛК, незалежна оцінка здоров'я, військове право.",
  keywords: ["військове право", "ВЛК", "оскарження", "Дніпро", "правова допомога"],
  authors: [{ name: "Правовий Захист Дніпро" }],
  creator: "Правовий Захист Дніпро",
  publisher: "Правовий Захист Дніпро",
  metadataBase: new URL("https://pz.dp.ua"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-token",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://pz.dp.ua",
    siteName: "Правовий Захист Дніпро",
    title: "Правовий Захист Дніпро | Військове право",
    description: "Професійна правова допомога військовим у Дніпрі. Оскарження рішень ВЛК, незалежна оцінка здоров'я.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Правовий Захист Дніпро",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Правовий Захист Дніпро | Військове право",
    description: "Професійна правова допомога військовим у Дніпрі.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}