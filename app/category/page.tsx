"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProducts, getCategories } from "@/lib/database"
import type { Product, Category } from "@/lib/database"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import Footer from "@/components/Footer"

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get("name")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        const loadedProducts = getProducts()
        const loadedCategories = getCategories()
        setProducts(loadedProducts)
        setCategories(loadedCategories)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Listen for storage changes to update when products are added
    const handleStorageChange = () => {
      loadData()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const currentCategory = categories.find((cat) => cat.name === categoryName)

  const getCategorySpecificProducts = (name: string | null) => {
    if (!name) return []
    const category = categories.find((cat) => cat.name === name)
    if (!category) return []
    return products.filter((product) => product.category_id === category.id)
  }

  const categoryProducts = getCategorySpecificProducts(categoryName)

  if (loading) {
    return (
      <div className="category-page">
        <header className="category-header">
          <div className="category-header-content">
            <h1 className="category-title">Loading...</h1>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="category-header-content">
          <h1 className="category-title">{categoryName || "Category"} Products</h1>
          <nav className="breadcrumbs">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            › <span className="breadcrumb-current">{categoryName || "Category"}</span>
          </nav>
        </div>
      </header>

      <main className="category-main">
        {categoryProducts.length === 0 ? (
          <div className="no-products">
            <p>No products available for this category yet.</p>
            <p>Products added through the admin panel will appear here.</p>
            <Link href="/" className="back-home-button">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {categoryProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product?id=${product.title.toLowerCase().replace(/\s/g, "-")}`}
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="category-product-image-container">
                    <Image
                      src={product.main_image || "/placeholder.svg?height=200&width=200&text=Product+Image"}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="product-image"
                    />
                  </div>
                  <h2 className="product-title">{product.title}</h2>
                  <p className="product-subtitle">{product.subtitle}</p>
                  <div className="product-description">
                    <p>{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />

      <style jsx>{`
        .category-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .category-header {
          background: #1a1a1a;
          color: white;
          padding: 2rem 0;
          text-align: center;
        }

        .category-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .category-title {
          font-family: var(--font-oswald), sans-serif;
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .breadcrumbs {
          font-size: 0.9rem;
          color: #ccc;
        }

        .breadcrumb-link {
          color: #ccc;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: white;
        }

        .breadcrumb-current {
          font-weight: 600;
          color: white;
        }

        .category-main {
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          justify-content: center;
          border: 15px solid white;
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        .product-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          border-right: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
        }

        .product-grid .product-card-link:nth-child(3n) {
          border-right: none;
        }

        .product-grid .product-card-link:nth-last-child(-n + 3) {
          border-bottom: none;
        }

        .product-grid:has(.product-card-link:only-child) .product-card-link {
          grid-column: span 3;
          border-right: none;
          border-bottom: none;
        }

        .product-grid:has(.product-card-link:nth-last-child(2)):has(.product-card-link:nth-child(1)):not(:has(.product-card-link:nth-child(3))) .product-card-link {
          grid-column: span 2;
          border-right: none;
          border-bottom: none;
        }

        .product-grid:has(.product-card-link:nth-last-child(2)) .product-card-link:nth-child(1) {
          border-right: 1px solid #e0e0e0;
        }

        .product-card {
          background: #ffffff;
          border-radius: 0;
          box-shadow: none;
          overflow: hidden;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          text-align: center;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .category-product-image-container {
          width: 100%;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          border-radius: 8px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-title {
          font-family: var(--font-oswald), sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .product-subtitle {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .product-description {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.4;
        }

        .product-description p {
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-products {
          text-align: center;
          padding: 5rem 0;
          color: #666;
        }

        .no-products p {
          margin-bottom: 1rem;
        }

        .back-home-button {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.8rem 1.5rem;
          background-color: #6B46C1;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .back-home-button:hover {
          background-color: #5a3a9e;
        }

        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-grid .product-card-link:nth-child(3n) {
            border-right: 1px solid #e0e0e0;
          }

          .product-grid .product-card-link:nth-child(2n) {
            border-right: none;
          }

          .product-grid .product-card-link:nth-last-child(-n + 2) {
            border-bottom: none;
          }

          .product-grid:has(.product-card-link:only-child) .product-card-link {
            grid-column: span 2;
            border-right: none;
            border-bottom: none;
          }
        }

        @media (max-width: 768px) {
          .category-title {
            font-size: 2.5rem;
          }

          .product-grid {
            grid-template-columns: 1fr;
            border: none;
            background: transparent;
          }

          .product-card-link {
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }

          .product-card-link:last-child {
            border-bottom: none;
          }

          .product-card {
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 1rem;
          }

          .product-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .category-title {
            font-size: 2rem;
          }

          .product-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
