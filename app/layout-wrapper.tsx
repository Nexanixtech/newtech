"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import ClientLayout from "@/components/ClientLayout"

interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return <>{isAdminRoute ? children : <ClientLayout>{children}</ClientLayout>}</>
}
