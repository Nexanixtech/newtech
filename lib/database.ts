// Mock database with localStorage for persistence
export interface Category {
  id: number
  name: string
  description: string
  image_url?: string
  main_image_url?: string
  bg_image_url?: string
  color: string
  name_color: string
  description_color: string
  is_main: boolean
  is_new: boolean
  created_at: string
}

export interface Product {
  id: number
  title: string
  subtitle: string
  category_id: number
  description: string
  specifications: Record<string, string>
  technical_specifications: Array<{
    spec: string
    subspec: string
    image?: string
  }>
  related_products: string[]
  main_image: string
  banner_image?: string
  right_desc_image?: string
  left_spec_image?: string
  product_video?: string
  model_3d?: string
  video_background_color?: string
  images_360?: string[]
  created_at: string
  updated_at: string
}

export interface Logo {
  id: number
  name: string
  url: string
  uploaded_at: string
}

export interface HomeContent {
  featuredVideo: {
    title: string
    description: string
    videoUrl: string
  }
  youtubeVideos: Array<{
    id: string
    title: string
    url: string
    description: string
    displayOrder: number
  }>
  aboutUs: {
    title: string
    content: string
  }
}

// Default data
const defaultCategories: Category[] = [
  {
    id: 1,
    name: "Delivery Robots",
    description: "Advanced delivery automation solutions",
    color: "#1a1a1a",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Drones",
    description: "Professional drone solutions",
    color: "#2563eb",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "3D Printed Parts",
    description: "Custom 3D printed components",
    color: "#dc2626",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Reception Robots",
    description: "Customer service automation",
    color: "#7c3aed",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "STEM Lab",
    description: "Educational robotics solutions",
    color: "#059669",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Humanoid Robots",
    description: "Advanced humanoid robotics",
    color: "#ea580c",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Arm Robots",
    description: "Robotic arm solutions",
    color: "#0891b2",
    name_color: "#ffffff",
    description_color: "#ffffff",
    is_main: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
]

const defaultProducts: Product[] = [
  {
    id: 1,
    title: "Hotel Delivery Robot",
    subtitle: "Autonomous hotel service robot",
    category_id: 1,
    description:
      "Advanced delivery robot designed for hotel environments with autonomous navigation and customer interaction capabilities.",
    specifications: {
      Height: "120cm",
      Weight: "45kg",
      "Battery Life": "8 hours",
      "Load Capacity": "20kg",
    },
    technical_specifications: [
      {
        spec: "Navigation",
        subspec: "LIDAR + Camera based SLAM",
      },
      {
        spec: "Communication",
        subspec: "WiFi, 4G, Bluetooth",
      },
    ],
    related_products: [],
    main_image: "/placeholder.svg?height=400&width=400&text=Hotel+Delivery+Robot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const defaultLogos: Logo[] = [
  {
    id: 1,
    name: "Client Logo 1",
    url: "/placeholder.svg?height=120&width=300&text=Client+Logo+1",
    uploaded_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Client Logo 2",
    url: "/placeholder.svg?height=120&width=300&text=Client+Logo+2",
    uploaded_at: new Date().toISOString(),
  },
]

const defaultHomeContent: HomeContent = {
  featuredVideo: {
    title: "Featured Technology Demo",
    description: "Showcase of our latest innovations",
    videoUrl: "",
  },
  youtubeVideos: [
    {
      id: "1",
      title: "Robotics Demo 1",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Advanced robotics demonstration",
      displayOrder: 1,
    },
  ],
  aboutUs: {
    title: "About Technovation",
    content: "We are a leading technology company focused on innovation and excellence.",
  },
}

// Database functions with error handling
export const getCategories = (): Category[] => {
  try {
    if (typeof window === "undefined") return defaultCategories
    const stored = localStorage.getItem("technovation_categories")
    if (!stored) {
      localStorage.setItem("technovation_categories", JSON.stringify(defaultCategories))
      return defaultCategories
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error getting categories:", error)
    return defaultCategories
  }
}

export const setCategories = (categories: Category[]): void => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem("technovation_categories", JSON.stringify(categories))
  } catch (error) {
    console.error("Error setting categories:", error)
    throw new Error("Failed to save categories")
  }
}

export const getProducts = (): Product[] => {
  try {
    if (typeof window === "undefined") return defaultProducts
    const stored = localStorage.getItem("technovation_products")
    if (!stored) {
      localStorage.setItem("technovation_products", JSON.stringify(defaultProducts))
      return defaultProducts
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error getting products:", error)
    return defaultProducts
  }
}

export const setProducts = (products: Product[]): void => {
  try {
    if (typeof window === "undefined") return
    if (!Array.isArray(products)) {
      throw new Error("Products must be an array")
    }
    localStorage.setItem("technovation_products", JSON.stringify(products))
    console.log("Products saved successfully:", products.length)
  } catch (error) {
    console.error("Error setting products:", error)
    throw new Error("Failed to save products")
  }
}

// CREATE PRODUCT FUNCTION - This was missing!
export const createProduct = (productData: Omit<Product, "id" | "created_at" | "updated_at">): Product => {
  try {
    const products = getProducts()
    const newId = Math.max(...products.map((p) => p.id), 0) + 1
    const now = new Date().toISOString()

    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: now,
      updated_at: now,
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)

    console.log("Product created successfully:", newProduct)
    return newProduct
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }
}

// UPDATE PRODUCT FUNCTION
export const updateProduct = (id: number, productData: Partial<Product>): Product => {
  try {
    const products = getProducts()
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...productData,
      id, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    }

    products[productIndex] = updatedProduct
    setProducts(products)

    console.log("Product updated successfully:", updatedProduct)
    return updatedProduct
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

// DELETE PRODUCT FUNCTION
export const deleteProduct = (id: number): boolean => {
  try {
    const products = getProducts()
    const filteredProducts = products.filter((p) => p.id !== id)

    if (filteredProducts.length === products.length) {
      throw new Error("Product not found")
    }

    setProducts(filteredProducts)
    console.log("Product deleted successfully:", id)
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

// GET PRODUCT BY ID
export const getProductById = (id: number): Product | null => {
  try {
    const products = getProducts()
    return products.find((p) => p.id === id) || null
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

// GET PRODUCTS BY CATEGORY
export const getProductsByCategory = (categoryId: number): Product[] => {
  try {
    const products = getProducts()
    return products.filter((p) => p.category_id === categoryId)
  } catch (error) {
    console.error("Error getting products by category:", error)
    return []
  }
}

export const getLogos = (): Logo[] => {
  try {
    if (typeof window === "undefined") return defaultLogos
    const stored = localStorage.getItem("technovation_logos")
    if (!stored) {
      localStorage.setItem("technovation_logos", JSON.stringify(defaultLogos))
      return defaultLogos
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error getting logos:", error)
    return defaultLogos
  }
}

export const setLogos = (logos: Logo[]): void => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem("technovation_logos", JSON.stringify(logos))
  } catch (error) {
    console.error("Error setting logos:", error)
    throw new Error("Failed to save logos")
  }
}

export const getHomeContent = (): HomeContent => {
  try {
    if (typeof window === "undefined") return defaultHomeContent
    const stored = localStorage.getItem("technovation_home_content")
    if (!stored) {
      localStorage.setItem("technovation_home_content", JSON.stringify(defaultHomeContent))
      return defaultHomeContent
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error getting home content:", error)
    return defaultHomeContent
  }
}

export const setHomeContent = (content: HomeContent): void => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem("technovation_home_content", JSON.stringify(content))
  } catch (error) {
    console.error("Error setting home content:", error)
    throw new Error("Failed to save home content")
  }
}

// Export for backward compatibility
export const categories = getCategories()
export const products = getProducts()
export const logos = getLogos()
