"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminNavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function AdminNavLink({ href, children, className = "" }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`${className} ${
        isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
    >
      {children}
    </Link>
  )
}
