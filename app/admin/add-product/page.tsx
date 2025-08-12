"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { createProduct, getCategories } from "@/lib/database"
import type { Category } from "@/lib/database"

interface Specification {
  name: string
  value: string
}

interface TechnicalSpecification {
  spec: string
  subspec: string
  image?: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories] = useState<Category[]>(getCategories())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Form state
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [description, setDescription] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [bannerImage, setBannerImage] = useState("")
  const [rightDescImage, setRightDescImage] = useState("")
  const [leftSpecImage, setLeftSpecImage] = useState("")
  const [productVideo, setProductVideo] = useState("")
  const [model3d, setModel3d] = useState("")
  const [videoBackgroundColor, setVideoBackgroundColor] = useState("#000000")

  // Dynamic arrays
  const [specifications, setSpecifications] = useState<Specification[]>([{ name: "", value: "" }])
  const [technicalSpecifications, setTechnicalSpecifications] = useState<TechnicalSpecification[]>([
    { spec: "", subspec: "", image: "" },
  ])
  const [relatedProducts, setRelatedProducts] = useState<string[]>([""])

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }])
  }

  const handleRemoveSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index))
    }
  }

  const handleSpecificationChange = (index: number, field: "name" | "value", value: string) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const handleAddTechnicalSpecification = () => {
    setTechnicalSpecifications([...technicalSpecifications, { spec: "", subspec: "", image: "" }])
  }

  const handleRemoveTechnicalSpecification = (index: number) => {
    if (technicalSpecifications.length > 1) {
      setTechnicalSpecifications(technicalSpecifications.filter((_, i) => i !== index))
    }
  }

  const handleTechnicalSpecificationChange = (index: number, field: "spec" | "subspec" | "image", value: string) => {
    const updated = [...technicalSpecifications]
    updated[index][field] = value
    setTechnicalSpecifications(updated)
  }

  const handleAddRelatedProduct = () => {
    setRelatedProducts([...relatedProducts, ""])
  }

  const handleRemoveRelatedProduct = (index: number) => {
    if (relatedProducts.length > 1) {
      setRelatedProducts(relatedProducts.filter((_, i) => i !== index))
    }
  }

  const handleRelatedProductChange = (index: number, value: string) => {
    const updated = [...relatedProducts]
    updated[index] = value
    setRelatedProducts(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation
      if (!title.trim()) {
        throw new Error("Product title is required")
      }
      if (!categoryId) {
        throw new Error("Please select a category")
      }
      if (!description.trim()) {
        throw new Error("Product description is required")
      }
      if (!mainImage.trim()) {
        throw new Error("Main product image is required")
      }

      // Process specifications
      const processedSpecs: Record<string, string> = {}
      specifications.forEach((spec) => {
        if (spec.name.trim() && spec.value.trim()) {
          processedSpecs[spec.name.trim()] = spec.value.trim()
        }
      })

      // Process technical specifications
      const processedTechSpecs = technicalSpecifications
        .filter((techSpec) => techSpec.spec.trim() && techSpec.subspec.trim())
        .map((techSpec) => ({
          spec: techSpec.spec.trim(),
          subspec: techSpec.subspec.trim(),
          image: techSpec.image?.trim() || undefined,
        }))

      // Process related products
      const processedRelatedProducts = relatedProducts
        .filter((product) => product.trim())
        .map((product) => product.trim())

      // Create product
      const productData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        category_id: categoryId,
        description: description.trim(),
        specifications: processedSpecs,
        technical_specifications: processedTechSpecs,
        related_products: processedRelatedProducts,
        main_image: mainImage.trim(),
        banner_image: bannerImage.trim() || undefined,
        right_desc_image: rightDescImage.trim() || undefined,
        left_spec_image: leftSpecImage.trim() || undefined,
        product_video: productVideo.trim() || undefined,
        model_3d: model3d.trim() || undefined,
        video_background_color: videoBackgroundColor || "#000000",
      }

      console.log("Creating product with data:", productData)

      const newProduct = createProduct(productData)
      console.log("Product created successfully:", newProduct)

      // Trigger storage event to update other components
      window.dispatchEvent(new Event("storage"))

      // Redirect to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      setError(error instanceof Error ? error.message : "Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product with detailed specifications and media</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Product Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
                  Product Subtitle
                </Label>
                <Input
                  id="subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter product subtitle"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select onValueChange={(value) => setCategoryId(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mainImage" className="text-sm font-medium text-gray-700">
                  Main Product Image *
                </Label>
                <Input
                  id="mainImage"
                  type="url"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="Enter main image URL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bannerImage" className="text-sm font-medium text-gray-700">
                  Banner Image
                </Label>
                <Input
                  id="bannerImage"
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="Enter banner image URL"
                />
              </div>

              <div>
                <Label htmlFor="rightDescImage" className="text-sm font-medium text-gray-700">
                  Right Description Image
                </Label>
                <Input
                  id="rightDescImage"
                  type="url"
                  value={rightDescImage}
                  onChange={(e) => setRightDescImage(e.target.value)}
                  placeholder="Enter right description image URL"
                />
              </div>

              <div>
                <Label htmlFor="leftSpecImage" className="text-sm font-medium text-gray-700">
                  Left Specification Image
                </Label>
                <Input
                  id="leftSpecImage"
                  type="url"
                  value={leftSpecImage}
                  onChange={(e) => setLeftSpecImage(e.target.value)}
                  placeholder="Enter left specification image URL"
                />
              </div>

              <div>
                <Label htmlFor="productVideo" className="text-sm font-medium text-gray-700">
                  Product Video
                </Label>
                <Input
                  id="productVideo"
                  type="url"
                  value={productVideo}
                  onChange={(e) => setProductVideo(e.target.value)}
                  placeholder="Enter product video URL"
                />
              </div>

              <div>
                <Label htmlFor="model3d" className="text-sm font-medium text-gray-700">
                  3D Model
                </Label>
                <Input
                  id="model3d"
                  type="url"
                  value={model3d}
                  onChange={(e) => setModel3d(e.target.value)}
                  placeholder="Enter 3D model URL"
                />
              </div>

              <div>
                <Label htmlFor="videoBackgroundColor" className="text-sm font-medium text-gray-700">
                  Video Background Color
                </Label>
                <Input
                  id="videoBackgroundColor"
                  type="color"
                  value={videoBackgroundColor}
                  onChange={(e) => setVideoBackgroundColor(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        value={spec.name}
                        onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
                        placeholder="Specification name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">Value</Label>
                      <Input
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                        placeholder="Specification value"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveSpecification(index)}
                      disabled={specifications.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddSpecification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicalSpecifications.map((techSpec, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">Specification</Label>
                        <Input
                          value={techSpec.spec}
                          onChange={(e) => handleTechnicalSpecificationChange(index, "spec", e.target.value)}
                          placeholder="Technical specification"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveTechnicalSpecification(index)}
                        disabled={technicalSpecifications.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Sub-specification</Label>
                      <Textarea
                        value={techSpec.subspec}
                        onChange={(e) => handleTechnicalSpecificationChange(index, "subspec", e.target.value)}
                        placeholder="Technical sub-specification details"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Image URL (Optional)</Label>
                      <Input
                        value={techSpec.image || ""}
                        onChange={(e) => handleTechnicalSpecificationChange(index, "image", e.target.value)}
                        placeholder="Technical specification image URL"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddTechnicalSpecification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technical Specification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          <Card>
            <CardHeader>
              <CardTitle>Related Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedProducts.map((product, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                      <Input
                        value={product}
                        onChange={(e) => handleRelatedProductChange(index, e.target.value)}
                        placeholder="Related product name"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveRelatedProduct(index)}
                      disabled={relatedProducts.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddRelatedProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Related Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Creating Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
