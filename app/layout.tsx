import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingThemeToggle } from "@/components/floating-theme-toggle"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <title>ระบบจัดเก็บข้อสอบ</title>
        <meta name="description" content="ระบบจัดเก็บข้อสอบและค้นหาข้อมูลข้อสอบ" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FloatingThemeToggle />
          <div className="min-h-screen">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
