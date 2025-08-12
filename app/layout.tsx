"use client"

import "./globals.css"
import { usePathname } from "next/navigation"
import ClientLayout from "@/components/ClientLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <title>Technovation - Admin Panel</title>
        <meta name="description" content="Technovation Admin Panel for managing products and content" />
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tecpn-Yv8J1kAhdjJdASbmT1B9fa43wnKIPE.png" />
      </head>
      <body>
        {isAdminRoute ? (
          children
        ) : (
          <ClientLayout>{children}</ClientLayout>
        )}
      </body>
    </html>
  )
}
