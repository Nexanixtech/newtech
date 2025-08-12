"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { getCategories, getProductsByCategory } from "@/lib/database"
import type { Category, Product } from "@/lib/database"

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get("category")

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const loadCategoryData = () => {
      try {
        setLoading(true)
        setError("")

        if (!categoryName) {
          setError("No category specified")
          return
        }

        const categories = getCategories()
        const foundCategory = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())

        if (!foundCategory) {
          setError("Category not found")
          return
        }

        setCategory(foundCategory)
        const categoryProducts = getProductsByCategory(foundCategory.id)
        setProducts(categoryProducts)

        console.log("Loaded category:", foundCategory)
        console.log("Loaded products:", categoryProducts)
      } catch (error) {
        console.error("Error loading category data:", error)
        setError("Failed to load category data")
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()

    // Listen for storage changes to update when new products are added
    const handleStorageChange = () => {
      loadCategoryData()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [categoryName])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The requested category could not be found."}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{category.description}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {products.length} {products.length === 1 ? "Product" : "Products"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products yet</h3>
            <p className="mt-2 text-gray-500">Products will appear here once they are added through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.main_image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                  {product.subtitle && <p className="text-sm text-gray-600 mb-3">{product.subtitle}</p>}
                  <p className="text-gray-700 mb-4 line-clamp-3">{product.description}</p>

                  {/* Specifications Preview */}
                  {Object.keys(product.specifications).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Specifications:</h4>
                      <div className="space-y-1">
                        {Object.entries(product.specifications)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900 font-medium">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Fixed Product Link - This was the issue! */}
                  <Link
                    href={`/product?id=${product.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
