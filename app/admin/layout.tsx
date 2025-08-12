"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login"

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/admin/login")
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">{children}</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Manage Home", href: "/admin/manage-home" },
    { name: "Manage Products", href: "/admin/products" },
    { name: "Manage Categories", href: "/admin/categories" },
    { name: "Manage Logos", href: "/admin/manage-logos" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              <nav className="flex space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </a>
                  )
                })}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
