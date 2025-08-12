"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProduct, updateProduct, getCategories, getProducts } from "@/lib/database"
import type { Product, Category } from "@/lib/database"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  const [categories, setCategoriesList] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const [specificationInputs, setSpecificationInputs] = useState({ name: "", value: "" })
  const [technicalSpecInputs, setTechnicalSpecInputs] = useState({
    spec: "",
    subspec: "",
    image: "",
  })

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
      return
    }

    const loadedProduct = getProduct(productId)
    if (!loadedProduct) {
      alert("Product not found")
      router.push("/admin/dashboard")
      return
    }

    setProduct(loadedProduct)
    setFormData(loadedProduct)
    setCategoriesList(getCategories())
    setAllProducts(getProducts())
  }, [router, productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Product) => {
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
          ...(prev.technical_specifications || []),
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
      technical_specifications: prev.technical_specifications?.filter((_, i) => i !== index) || [],
    }))
  }

  const addRelatedProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      related_products: [...(prev.related_products || []), productId],
    }))
  }

  const removeRelatedProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      related_products: prev.related_products?.filter((id) => id !== productId) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedProduct = updateProduct(productId, formData)
      if (updatedProduct) {
        alert("Product updated successfully!")
        router.push("/admin/dashboard")
      } else {
        alert("Error updating product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const availableProducts = allProducts.filter(
    (p) => p.id !== productId && !(formData.related_products || []).includes(p.id),
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600">Edit Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
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
                value={formData.subtitle || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id || ""}
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

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "main_image")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept="image/*"
            />
            {formData.main_image && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={formData.main_image || "/placeholder.svg"}
                  alt="Current main image"
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
                <p className="text-sm text-gray-600 text-center mt-2">Current image (upload a new one to replace)</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
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
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "right_desc_image")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept="image/*"
              />
              {formData.right_desc_image && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.right_desc_image || "/placeholder.svg"}
                    alt="Right description image"
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-600 text-center mt-2">Current image (upload a new one to replace)</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Left Side of Specification Image</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "left_spec_image")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept="image/*"
              />
              {formData.left_spec_image && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.left_spec_image || "/placeholder.svg"}
                    alt="Left specification image"
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-600 text-center mt-2">Current image (upload a new one to replace)</p>
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload with Background Color</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "product_video")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept="video/*"
              />
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
                  value={formData.video_background_color || "#ffffff"}
                  onChange={handleChange}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* 3D Model Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3D Model</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "model_3d")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              accept=".glb,.gltf,.obj,.fbx"
            />
            <p className="text-sm text-gray-500 mt-2">Supported formats: GLB, GLTF, OBJ, FBX</p>
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
              {Object.entries(formData.specifications || {}).map(([key, value]) => (
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
            <button type="button" onClick={addSpecification} className="mt-2 text-gray-700 hover:text-gray-900 text-sm">
              Add Specification
            </button>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
            <div className="space-y-4">
              {(formData.technical_specifications || []).map((spec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specification Image</label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const fileName = file.name.replace(/\.[^/.]+$/, "")
                            const query = encodeURIComponent(`${fileName} specification image`)
                            const url = `/placeholder.svg?height=120&width=120&query=${query}`

                            setFormData((prev) => ({
                              ...prev,
                              technical_specifications:
                                prev.technical_specifications?.map((s, i) =>
                                  i === index ? { ...s, image: url } : s,
                                ) || [],
                            }))
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        accept="image/*"
                      />
                      {spec.image && (
                        <div className="mt-2">
                          <img
                            src={spec.image || "/placeholder.svg"}
                            alt="Specification"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <p className="text-xs text-gray-600 mt-1">Current image (upload a new one to replace)</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specification</label>
                        <input
                          type="text"
                          value={spec.spec}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              technical_specifications:
                                prev.technical_specifications?.map((s, i) =>
                                  i === index ? { ...s, spec: e.target.value } : s,
                                ) || [],
                            }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-specification</label>
                        <textarea
                          value={spec.subspec}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              technical_specifications:
                                prev.technical_specifications?.map((s, i) =>
                                  i === index ? { ...s, subspec: e.target.value } : s,
                                ) || [],
                            }))
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTechnicalSpec(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specification Image</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const fileName = file.name.replace(/\.[^/.]+$/, "")
                        const query = encodeURIComponent(`${fileName} specification image`)
                        const url = `/placeholder.svg?height=120&width=120&query=${query}`
                        setTechnicalSpecInputs((prev) => ({ ...prev, image: url }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specification</label>
                    <input
                      type="text"
                      placeholder="Specification"
                      value={technicalSpecInputs.spec}
                      onChange={(e) => setTechnicalSpecInputs((prev) => ({ ...prev, spec: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-specification</label>
                    <textarea
                      placeholder="Sub-specification"
                      value={technicalSpecInputs.subspec}
                      onChange={(e) => setTechnicalSpecInputs((prev) => ({ ...prev, subspec: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button type="button" onClick={addTechnicalSpec} className="text-gray-700 hover:text-gray-900 text-sm">
                  Add Technical Specification
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Related Products</h3>
            <div className="space-y-2">
              {(formData.related_products || []).map((productId) => {
                const relatedProduct = allProducts.find((p) => p.id === productId)
                return relatedProduct ? (
                  <div key={productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>{relatedProduct.title}</span>
                    <button
                      type="button"
                      onClick={() => removeRelatedProduct(productId)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : null
              })}
            </div>

            {availableProducts.length > 0 && (
              <div className="mt-4">
                <select
                  onChange={(e) => {
                    const productId = Number.parseInt(e.target.value)
                    if (productId) {
                      addRelatedProduct(productId)
                      e.target.value = ""
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a product to add</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
                <button type="button" className="mt-2 text-gray-700 hover:text-gray-900 text-sm">
                  Add Related Product
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium text-lg"
            >
              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
