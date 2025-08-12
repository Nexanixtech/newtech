"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCategories, createProduct } from "@/lib/database"
import type { Category, Product } from "@/lib/database"

export default function ManageProductsPage() {
  const router = useRouter()
  const [categories, setCategoriesList] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Product, "id" | "created_at" | "updated_at">>({
    title: "",
    subtitle: "",
    category_id: 0,
    description: "",
    specifications: {},
    technical_specifications: [],
    related_products: [],
    main_image: "",
    banner_image: "",
    right_desc_image: "",
    left_spec_image: "",
    product_video: "",
    model_3d: "",
    video_background_color: "#ffffff",
    images_360: [],
  })

  const [specificationInputs, setSpecificationInputs] = useState({ name: "", value: "" })
  const [technicalSpecInputs, setTechnicalSpecInputs] = useState({ spec: "", subspec: "", image: "" })

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
      return
    }
    const loadedCategories = getCategories()
    setCategoriesList(loadedCategories)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === "category_id" ? Number.parseInt(value) : value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      const query = encodeURIComponent(`${fileName} product image`)
      const url = `/placeholder.svg?height=400&width=400&query=${query}`
      setFormData((prev) => ({ ...prev, [field]: url }))
    }
  }

  const addSpecification = () => {
    if (specificationInputs.name && specificationInputs.value) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specificationInputs.name]: specificationInputs.value,
        },
      }))
      setSpecificationInputs({ name: "", value: "" })
    }
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const addTechnicalSpec = () => {
    if (technicalSpecInputs.spec && technicalSpecInputs.subspec) {
      setFormData((prev) => ({
        ...prev,
        technical_specifications: [
          ...prev.technical_specifications,
          {
            spec: technicalSpecInputs.spec,
            subspec: technicalSpecInputs.subspec,
            image: technicalSpecInputs.image || undefined,
          },
        ],
      }))
      setTechnicalSpecInputs({ spec: "", subspec: "", image: "" })
    }
  }

  const removeTechnicalSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technical_specifications: prev.technical_specifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newProduct = createProduct(formData)
      alert("Product added successfully!")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "banner_image")}
                  className="w-full"
                  accept="image/*"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "main_image")}
                  className="w-full"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Right Side of Description Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "right_desc_image")}
                  className="w-full"
                  accept="image/*"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Left Side of Specification Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "left_spec_image")}
                  className="w-full"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload with Background Color</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "product_video")}
                  className="w-full"
                  accept="video/*"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Solid Color</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  name="video_background_color"
                  value={formData.video_background_color}
                  onChange={handleChange}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* 3D Model Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3D Model</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "model_3d")}
                className="w-full"
                accept=".glb,.gltf,.obj,.fbx"
              />
              <p className="text-sm text-gray-500 mt-2">Supported formats: GLB, GLTF, OBJ, FBX</p>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 grid grid-cols-3 gap-4 font-medium text-gray-700">
                <div>Name</div>
                <div>Value</div>
                <div>Action</div>
              </div>
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="px-4 py-3 grid grid-cols-3 gap-4 border-t border-gray-200">
                  <div>{key}</div>
                  <div>{value}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Name"
                value={specificationInputs.name}
                onChange={(e) => setSpecificationInputs((prev) => ({ ...prev, name: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={specificationInputs.value}
                onChange={(e) => setSpecificationInputs((prev) => ({ ...prev, value: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addSpecification}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Specification
            </button>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
            <div className="space-y-2">
              {formData.technical_specifications.map((spec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span>
                    <strong>{spec.spec}:</strong> {spec.subspec}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTechnicalSpec(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Specification"
                value={technicalSpecInputs.spec}
                onChange={(e) => setTechnicalSpecInputs((prev) => ({ ...prev, spec: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Sub-specification"
                value={technicalSpecInputs.subspec}
                onChange={(e) => setTechnicalSpecInputs((prev) => ({ ...prev, subspec: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addTechnicalSpec}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Technical Specification
            </button>
          </div>

          {/* Related Products */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Related Products</h3>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Related Product
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium text-lg"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
