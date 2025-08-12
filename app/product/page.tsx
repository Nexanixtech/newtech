"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react"
import { getProductById, getCategories } from "@/lib/database"
import type { Product, Category } from "@/lib/database"

function ProductDetailPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const loadProductData = () => {
      try {
        setIsLoading(true)
        setError("")

        console.log("Product ID from URL:", productId)

        if (!productId) {
          setError("No product ID provided")
          return
        }

        // Convert to number and validate
        const id = Number.parseInt(productId, 10)
        if (isNaN(id)) {
          setError(`Invalid product ID: ${productId}`)
          return
        }

        console.log("Parsed product ID:", id)

        const productData = getProductById(id)
        console.log("Found product:", productData)

        if (!productData) {
          setError(`Product with ID ${id} not found`)
          return
        }

        setProduct(productData)

        // Load category data
        const categories = getCategories()
        const productCategory = categories.find((cat) => cat.id === productData.category_id)
        setCategory(productCategory || null)

        console.log("Loaded product:", productData)
        console.log("Loaded category:", productCategory)
      } catch (error) {
        console.error("Error loading product:", error)
        setError("Failed to load product data")
      } finally {
        setIsLoading(false)
      }
    }

    loadProductData()
  }, [productId])

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div className="flex flex-col items-center space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-16 h-16 border-4 border-black border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-black font-medium">Loading product...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The requested product could not be found."}</p>
          <p className="text-sm text-gray-500 mb-8">Product ID: {productId}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href={category ? `/category?category=${encodeURIComponent(category.name)}` : "/"}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {category ? category.name : "Home"}
          </Link>
          <h1 className="text-3xl font-bold text-black">{product.title}</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Product Image/3D Viewer */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Product Image Container */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <motion.div
                      animate={{ rotateY: rotation }}
                      transition={{ duration: 0.1 }}
                      className="relative w-full h-full flex items-center justify-center"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Image
                        src={product.main_image || "/placeholder.svg?height=400&width=400&text=Product+Image"}
                        alt={product.title}
                        width={350}
                        height={350}
                        className="object-contain max-w-[90%] max-h-[90%] drop-shadow-xl"
                        priority
                      />
                    </motion.div>
                  </div>

                  {/* 3D Controls */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md rounded-xl px-4 py-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-white hover:bg-white/20"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-white hover:bg-white/20"
                        onClick={() => setRotation(0)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-5xl font-black text-black mb-4">{product.title.toUpperCase()}</h2>
                {product.subtitle && (
                  <h3 className="text-3xl font-black text-red-500 mb-6">{product.subtitle.toUpperCase()}</h3>
                )}
                <p className="text-xl text-gray-600 leading-relaxed mb-8">{product.description}</p>
                {category && (
                  <div className="mb-6">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Basic Specifications Grid */}
              {Object.keys(product.specifications).length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-black">{value}</div>
                        <div className="text-gray-600">{key}</div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Detailed Specifications Section */}
        {Object.keys(product.specifications).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">SPECIFICATIONS</h2>
              <div className="w-20 h-1 bg-black mx-auto"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
                  >
                    <span className="font-semibold text-black">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Technical Specifications Section */}
        {product.technical_specifications.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">TECHNICAL SPECIFICATIONS</h2>
              <div className="w-20 h-1 bg-black mx-auto"></div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.technical_specifications.map((techSpec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    {techSpec.image && (
                      <div className="mb-4">
                        <Image
                          src={techSpec.image || "/placeholder.svg"}
                          alt={techSpec.spec}
                          width={60}
                          height={60}
                          className="mx-auto"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-black mb-3 text-center">{techSpec.spec}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{techSpec.subspec}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Additional Images Section */}
        {(product.banner_image || product.right_desc_image || product.left_spec_image) && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">GALLERY</h2>
              <div className="w-20 h-1 bg-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.banner_image && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={product.banner_image || "/placeholder.svg"}
                    alt="Banner Image"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">Banner Image</h3>
                  </div>
                </div>
              )}
              {product.right_desc_image && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={product.right_desc_image || "/placeholder.svg"}
                    alt="Description Image"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">Description Image</h3>
                  </div>
                </div>
              )}
              {product.left_spec_image && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={product.left_spec_image || "/placeholder.svg"}
                    alt="Specification Image"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">Specification Image</h3>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Video Section */}
        {product.product_video && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">PRODUCT VIDEO</h2>
              <div className="w-20 h-1 bg-black mx-auto"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div
                className="relative rounded-lg overflow-hidden shadow-xl"
                style={{ backgroundColor: product.video_background_color || "#000000" }}
              >
                <video controls className="w-full h-auto" poster={product.main_image}>
                  <source src={product.product_video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.section>
        )}

        {/* Enquiry Button Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-20"
        >
          <div className="text-center">
            <Button
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600 px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                // Handle enquiry action - could open a modal or redirect to contact form
                window.open(`mailto:info@technovation.com?subject=Enquiry about ${product.title}`, "_blank")
              }}
            >
              Enquiry Now
            </Button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2024 Technovation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function ProductPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      }
    >
      <ProductDetailPage />
    </Suspense>
  )
}
