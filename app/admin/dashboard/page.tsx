"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProducts, deleteProduct } from "@/lib/database"
import type { Product } from "@/lib/database"

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProductsList] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
      return
    }

    loadProducts()
  }, [router])

  const loadProducts = () => {
    const loadedProducts = getProducts()
    setProductsList(loadedProducts)
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/edit-product/${id}`)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = deleteProduct(id)
      if (success) {
        alert("Product deleted successfully!")
        loadProducts() // Reload products
      } else {
        alert("Error deleting product")
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Product Management</h1>
        <button
          onClick={() => router.push("/admin/products")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <img
                src={product.main_image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-6">{product.subtitle}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">No products found. Add some products to get started.</div>
      )}
    </div>
  )
}
