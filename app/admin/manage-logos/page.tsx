"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getLogos, createLogo, deleteLogo } from "@/lib/database"
import type { Logo } from "@/lib/database"

export default function ManageLogosPage() {
  const router = useRouter()
  const [logos, setLogosList] = useState<Logo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
      return
    }
    loadLogos()
  }, [router])

  const loadLogos = () => {
    const loadedLogos = getLogos()
    setLogosList(loadedLogos)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setLoading(true)

      Array.from(files).forEach((file) => {
        const logoData = {
          url: `/placeholder.svg?height=80&width=120&text=${encodeURIComponent(file.name.replace(/\.[^/.]+$/, ""))}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
        }
        createLogo(logoData)
      })

      loadLogos()
      setLoading(false)
      alert(`${files.length} logo(s) uploaded successfully!`)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this logo?")) {
      const success = deleteLogo(id)
      if (success) {
        loadLogos()
        alert("Logo deleted successfully!")
      } else {
        alert("Error deleting logo")
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Logo Management</h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Upload and Manage Logos</h2>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="text-gray-500 text-lg">Drop files here or click to upload</div>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  Upload Logos
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Logos Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {logos.map((logo) => (
              <div key={logo.id} className="relative group">
                <div className="aspect-[3/2] bg-gray-100 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                  <img
                    src={logo.url || "/placeholder.svg"}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(logo.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                >
                  ×
                </button>

                {/* Logo Name */}
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900 truncate">{logo.name}</p>
                </div>
              </div>
            ))}
          </div>

          {logos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No logos uploaded yet. Upload some logos to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
